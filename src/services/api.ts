import type {
  CustomerCar,
  DealershipBranch,
  Employee,
  Order,
  Part,
  ServiceAppointment,
  ServicePackage,
  TestDriveBooking,
  User,
  Vehicle,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');
const ACCESS_TOKEN_KEY = 'carcraft_access';
const REFRESH_TOKEN_KEY = 'carcraft_refresh';
const USER_KEY = 'carcraft_user';

interface TokenResponse {
  access: string;
  refresh: string;
  user?: User;
}

interface Page<T> {
  results: T[];
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

function readAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getSavedUser(): User | null {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function hasSavedAccessToken() {
  return Boolean(readAccessToken());
}

function saveSession(data: TokenResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retryAfterRefresh = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = readAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, '')}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retryAfterRefresh) {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refresh) {
      try {
        const refreshed = await fetch(`${API_BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });
        if (refreshed.ok) {
          const tokens = (await refreshed.json()) as { access: string; refresh?: string };
          localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
          if (tokens.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
          return request<T>(path, options, false);
        }
      } catch {
        clearSession();
        throw new ApiError('Your session expired. Please sign in again.', 401);
      }
      clearSession();
    }
  }

  if (response.status === 204) return undefined as T;
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) {
    const detail = payload?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : payload
          ? Object.values(payload).flatMap((value) => (Array.isArray(value) ? value : [value])).find((value) => typeof value === 'string') as string | undefined
          : undefined;
    throw new ApiError(message || `Request failed (${response.status}).`, response.status);
  }
  return payload as T;
}

async function list<T>(path: string): Promise<T[]> {
  const result = await request<T[] | Page<T>>(path);
  return Array.isArray(result) ? result : result.results;
}

const numeric = (value: string | number | null | undefined) =>
  value == null ? undefined : Number(value);

function vehicleFromApi(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    price: Number(vehicle.price),
    msrp: numeric(vehicle.msrp),
    monthlyEstimate: Number(vehicle.monthlyEstimate),
  };
}

function partFromApi(part: Part): Part {
  return {
    ...part,
    price: Number(part.price),
    originalPrice: numeric(part.originalPrice),
    rating: Number(part.rating),
  };
}

function serviceFromApi(service: ServicePackage): ServicePackage {
  return { ...service, price: Number(service.price) };
}

function employeeFromApi(employee: Employee): Employee {
  return { ...employee, rating: Number(employee.rating) };
}

function appointmentFromApi(appointment: ServiceAppointment): ServiceAppointment {
  return { ...appointment, totalEstimate: Number(appointment.totalEstimate) };
}

function orderFromApi(order: Order): Order {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export async function loadCatalog() {
  const [vehicles, parts, services, branches, employees] = await Promise.all([
    list<Vehicle>('vehicles/'),
    list<Part>('products/'),
    list<ServicePackage>('services/'),
    list<DealershipBranch>('branches/'),
    list<Employee>('employees/'),
  ]);
  return {
    vehicles: vehicles.map(vehicleFromApi),
    parts: parts.map(partFromApi),
    services: services.map(serviceFromApi),
    branches,
    employees: employees.map(employeeFromApi),
  };
}

export async function loadCustomerData() {
  const [testDrives, serviceAppointments, orders, garage] = await Promise.all([
    list<TestDriveBooking>('test-drives/'),
    list<ServiceAppointment>('appointments/'),
    list<Order>('orders/'),
    list<CustomerCar>('garage/'),
  ]);
  return {
    testDrives,
    serviceAppointments: serviceAppointments.map(appointmentFromApi),
    orders: orders.map(orderFromApi),
    garage,
  };
}

export async function loadCurrentUser() {
  return request<User>('me/');
}

export async function login(email: string, password: string) {
  const session = await request<TokenResponse>('token/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(session);
  return session.user || loadCurrentUser();
}

export async function register(input: { name: string; email: string; password: string; phone?: string }) {
  const session = await request<TokenResponse>('register/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  saveSession(session);
  return session.user || loadCurrentUser();
}

export async function createVehicle(data: Omit<Vehicle, 'id'>) {
  return vehicleFromApi(await request<Vehicle>('vehicles/', { method: 'POST', body: JSON.stringify(data) }));
}

export async function updateVehicle(id: string, data: Partial<Vehicle>) {
  return vehicleFromApi(await request<Vehicle>(`vehicles/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }));
}

export function deleteVehicle(id: string) {
  return request<void>(`vehicles/${id}/`, { method: 'DELETE' });
}

export async function createTestDrive(data: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdDate' | 'status'>) {
  return request<TestDriveBooking>('test-drives/', { method: 'POST', body: JSON.stringify(data) });
}

export function cancelTestDrive(id: string) {
  return request<TestDriveBooking>(`test-drives/${id}/cancel/`, { method: 'POST' });
}

export async function createOrder(input: {
  items: { partId: string; quantity: number }[];
  shippingAddress: string;
  deliveryMethod: 'Express Delivery' | 'Dealership Pickup';
  paymentMethod: string;
  promoCode?: string;
}) {
  return orderFromApi(await request<Order>('orders/', { method: 'POST', body: JSON.stringify(input) }));
}

export async function createServiceAppointment(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleDetails: ServiceAppointment['vehicleDetails'];
  serviceIds: string[];
  date: string;
  timeSlot: string;
  branch: string;
  pickupRequired: boolean;
  loanerCarRequired: boolean;
  notes?: string;
}) {
  return appointmentFromApi(await request<ServiceAppointment>('appointments/', { method: 'POST', body: JSON.stringify(input) }));
}

export function updateServiceAppointment(
  id: string,
  input: { status: ServiceAppointment['status']; bayNumber?: number; technicianAssigned?: string },
) {
  return request<ServiceAppointment>(`appointments/${id}/set_status/`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  }).then(appointmentFromApi);
}

export async function cancelServiceAppointment(id: string) {
  return appointmentFromApi(await request<ServiceAppointment>(`appointments/${id}/cancel/`, { method: 'POST' }));
}

export async function addCustomerCar(data: Omit<CustomerCar, 'id'>) {
  return request<CustomerCar>('garage/', { method: 'POST', body: JSON.stringify(data) });
}

export function removeCustomerCar(id: string) {
  return request<void>(`garage/${id}/`, { method: 'DELETE' });
}
