import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Vehicle, 
  Part, 
  CartItem, 
  Order, 
  TestDriveBooking, 
  ServiceAppointment, 
  CustomerCar, 
  DealershipBranch, 
  Employee,
  ServiceStatus,
  ServicePackage
} from '../types';
import { 
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_PARTS,
  DEALERSHIP_BRANCHES, 
  EMPLOYEES_DATA,
  SERVICE_PACKAGES
} from '../data/mockData';
import * as api from '../services/api';

export type NavigationPage = 
  | 'home' 
  | 'vehicles' 
  | 'parts' 
  | 'services' 
  | 'account' 
  | 'admin'
  | 'auth';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  title?: string;
}

interface AppContextType {
  // Navigation & User
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  currentUser: User;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  signOut: () => void;
  hasDealershipAuthorization: boolean;
  grantDealershipAuthorization: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Inventory & Vehicles
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Wishlist & Compare
  wishlist: string[]; // vehicle IDs
  toggleWishlist: (id: string) => void;
  compareList: Vehicle[];
  addToCompare: (vehicle: Vehicle) => void;
  removeFromCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Test Drive Modal & Flow
  testDriveVehicle: Vehicle | null;
  openTestDriveModal: (vehicle?: Vehicle) => void;
  closeTestDriveModal: () => void;
  isTestDriveModalOpen: boolean;
  testDrives: TestDriveBooking[];
  bookTestDrive: (booking: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdDate' | 'status'>) => Promise<string>;
  cancelTestDrive: (bookingId: string) => void;

  // Parts & Cart
  parts: Part[];
  services: ServicePackage[];
  selectedPart: Part | null;
  setSelectedPart: (part: Part | null) => void;
  cart: CartItem[];
  addToCart: (part: Part, quantity?: number) => void;
  updateCartQuantity: (partId: string, quantity: number) => void;
  removeFromCart: (partId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  promoCode: string;
  discountRate: number;
  applyPromoCode: (code: string) => boolean;
  orders: Order[];
  placeOrder: (orderData: {
    shippingAddress: string;
    deliveryMethod: 'Express Delivery' | 'Dealership Pickup';
    paymentMethod: string;
  }) => Promise<Order>;

  // Services & Appointments
  serviceAppointments: ServiceAppointment[];
  isServiceModalOpen: boolean;
  setIsServiceModalOpen: (open: boolean) => void;
  preselectedServiceId: string | null;
  openServiceBookingModal: (serviceId?: string) => void;
  bookServiceAppointment: (appointment: {
    vehicleDetails: ServiceAppointment['vehicleDetails'];
    serviceIds: string[];
    serviceNames: string[];
    totalEstimate: number;
    date: string;
    timeSlot: string;
    branch: string;
    pickupRequired: boolean;
    loanerCarRequired: boolean;
    notes?: string;
  }) => Promise<string>;
  updateServiceStatus: (appointmentId: string, status: ServiceStatus, bayNumber?: number, technician?: string) => void;
  cancelServiceAppointment: (appointmentId: string) => void;

  // Customer Garage
  garage: CustomerCar[];
  addCarToGarage: (car: Omit<CustomerCar, 'id'>) => void;
  removeCarFromGarage: (carId: string) => void;

  // Dealership Branches & Staff
  branches: DealershipBranch[];
  employees: Employee[];

  // Global Vehicle Search Filter transfer
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  selectedFilterCondition: string;
  setSelectedFilterCondition: (cond: string) => void;
  selectedFilterBodyType: string;
  setSelectedFilterBodyType: (body: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [currentUser, setCurrentUser] = useState<User>(() => api.getSavedUser() || INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(api.hasSavedAccessToken);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Wishlist & Compare
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Test Drive Modal
  const [testDriveVehicle, setTestDriveVehicle] = useState<Vehicle | null>(null);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>([]);

  // Parts & Store
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [services, setServices] = useState<ServicePackage[]>(SERVICE_PACKAGES);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('carcraft_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    return [];
  });

  // Services
  const [serviceAppointments, setServiceAppointments] = useState<ServiceAppointment[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  // Customer Garage
  const [garage, setGarage] = useState<CustomerCar[]>([]);

  // Dealership metadata
  const [branches, setBranches] = useState<DealershipBranch[]>(DEALERSHIP_BRANCHES);
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES_DATA);

  // Filters passed from Home hero
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedFilterCondition, setSelectedFilterCondition] = useState('All');
  const [selectedFilterBodyType, setSelectedFilterBodyType] = useState('All');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keep the cart local until checkout; business records are loaded from Django.
  useEffect(() => {
    localStorage.setItem('carcraft_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast helper
  const showToast = (message: string, type: ToastMessage['type'] = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const reportApiError = (error: unknown, title: string) => {
    showToast(error instanceof Error ? error.message : 'The request could not be completed.', 'error', title);
  };

  useEffect(() => {
    let active = true;
    api.loadCatalog().then((catalog) => {
      if (!active) return;
      setVehicles(catalog.vehicles);
      setParts(catalog.parts);
      setServices(catalog.services);
      setBranches(catalog.branches);
      setEmployees(catalog.employees);
    }).catch((error: unknown) => {
      if (active) reportApiError(error, 'Backend connection');
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!api.hasSavedAccessToken()) return;
    let active = true;
    Promise.all([api.loadCurrentUser(), api.loadCustomerData()]).then(([user, data]) => {
      if (!active) return;
      setCurrentUser({ ...user, id: String(user.id) });
      setIsAuthenticated(true);
      setTestDrives(data.testDrives);
      setServiceAppointments(data.serviceAppointments);
      setOrders(data.orders);
      setGarage(data.garage);
    }).catch((error: unknown) => {
      if (!active) return;
      api.clearSession();
      setIsAuthenticated(false);
      setCurrentUser(INITIAL_USERS[0]);
      reportApiError(error, 'Sign-in session');
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await api.login(email, password);
    const customerData = await api.loadCustomerData();
    setCurrentUser({ ...user, id: String(user.id) });
    setIsAuthenticated(true);
    setTestDrives(customerData.testDrives);
    setServiceAppointments(customerData.serviceAppointments);
    setOrders(customerData.orders);
    setGarage(customerData.garage);
    setIsAuthModalOpen(false);
    showToast(`Signed in as ${user.name}`, 'success', 'Welcome to CarCraft');
  };

  const signUp = async (input: { name: string; email: string; password: string; phone?: string }) => {
    const user = await api.register(input);
    setCurrentUser({ ...user, id: String(user.id) });
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    showToast('Your customer account has been created.', 'success', 'Welcome to CarCraft');
  };

  const signOut = () => {
    api.clearSession();
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(false);
    setTestDrives([]);
    setServiceAppointments([]);
    setOrders([]);
    setGarage([]);
    setCurrentPage('home');
    showToast('You have been signed out.', 'info');
  };

  const grantDealershipAuthorization = () => {
    if (isAuthenticated && currentUser.role === 'admin') {
      setCurrentPage('admin');
      return;
    }
    setIsAuthModalOpen(true);
    showToast('Sign in with a staff account to access dealership management.', 'info', 'Staff access required');
  };

  // Vehicle inventory CRUD
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const newVehicle = await api.createVehicle(vehicleData);
      setVehicles((prev) => [newVehicle, ...prev]);
      showToast(`Added ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} to inventory`, 'success', 'Inventory Updated');
    } catch (error) {
      reportApiError(error, 'Could not add vehicle');
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const updatedVehicle = await api.updateVehicle(id, updates);
      setVehicles((prev) => prev.map((vehicle) => vehicle.id === id ? updatedVehicle : vehicle));
      showToast('Vehicle specifications saved successfully', 'success', 'Update Complete');
    } catch (error) {
      reportApiError(error, 'Could not update vehicle');
    }
  };

  const deleteVehicle = async (id: string) => {
    const veh = vehicles.find((v) => v.id === id);
    try {
      await api.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast(veh ? `Removed ${veh.make} ${veh.model}` : 'Vehicle removed', 'warning', 'Deleted from Inventory');
    } catch (error) {
      reportApiError(error, 'Could not delete vehicle');
    }
  };

  // Wishlist
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved vehicles', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your vehicles wishlist', 'success');
        return [...prev, id];
      }
    });
  };

  // Compare
  const addToCompare = (vehicle: Vehicle) => {
    if (compareList.some((v) => v.id === vehicle.id)) {
      showToast('Vehicle is already in comparison', 'info');
      return;
    }
    if (compareList.length >= 3) {
      showToast('You can compare up to 3 vehicles at a time', 'warning', 'Comparison Limit');
      return;
    }
    setCompareList((prev) => [...prev, vehicle]);
    setIsCompareModalOpen(true);
    showToast(`Added ${vehicle.make} ${vehicle.model} to compare`, 'success');
  };

  const removeFromCompare = (vehicleId: string) => {
    setCompareList((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareModalOpen(false);
  };

  // Test Drive Modal
  const openTestDriveModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setTestDriveVehicle(vehicle);
    } else if (vehicles.length > 0) {
      setTestDriveVehicle(vehicles[0]);
    }
    setIsTestDriveModalOpen(true);
  };

  const closeTestDriveModal = () => {
    setIsTestDriveModalOpen(false);
  };

  const bookTestDrive = async (bookingData: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdDate' | 'status'>) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Sign in before booking a test drive.', 'info', 'Sign-in required');
      throw new Error('Sign in to book a test drive.');
    }
    try {
      const newBooking = await api.createTestDrive(bookingData);
      setTestDrives((prev) => [newBooking, ...prev]);
      showToast(`Test drive confirmed for ${newBooking.vehicleName}! Ref: ${newBooking.bookingRef}`, 'success', 'Booking Confirmed');
      return newBooking.bookingRef;
    } catch (error) {
      reportApiError(error, 'Could not book test drive');
      throw error;
    }
  };

  const cancelTestDrive = async (bookingId: string) => {
    try {
      const booking = await api.cancelTestDrive(bookingId);
      setTestDrives((prev) => prev.map((item) => item.id === bookingId ? booking : item));
      showToast('Test drive appointment has been cancelled', 'info');
    } catch (error) {
      reportApiError(error, 'Could not cancel test drive');
    }
  };

  // Cart operations
  const addToCart = (part: Part, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { part, quantity }];
    });
    showToast(`Added ${part.name.substring(0, 30)}... to Cart`, 'success', 'Cart Updated');
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.part.id === partId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CARCRAFT10' || clean === 'VIP10') {
      setPromoCode(clean);
      setDiscountRate(0.10);
      showToast('Promo code applied: 10% discount!', 'success');
      return true;
    } else if (clean === 'DRIVE15') {
      setPromoCode(clean);
      setDiscountRate(0.15);
      showToast('VIP Promo code applied: 15% discount!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try CARCRAFT10', 'warning', 'Coupon Error');
      return false;
    }
  };

  const placeOrder = async (orderData: {
    shippingAddress: string;
    deliveryMethod: 'Express Delivery' | 'Dealership Pickup';
    paymentMethod: string;
  }) => {
    try {
      const newOrder = await api.createOrder({
        ...orderData,
        items: cart.map(({ part, quantity }) => ({ partId: part.id, quantity })),
        promoCode,
      });
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setPromoCode('');
      setDiscountRate(0);
      showToast(`Order placed successfully! Ref: ${newOrder.orderNumber}`, 'success', 'Order Confirmed');
      api.loadCatalog().then((catalog) => setParts(catalog.parts)).catch((error: unknown) => {
        reportApiError(error, 'Could not refresh inventory');
      });
      return newOrder;
    } catch (error) {
      throw error;
    }
  };

  // Services
  const openServiceBookingModal = (serviceId?: string) => {
    if (serviceId) {
      setPreselectedServiceId(serviceId);
    } else {
      setPreselectedServiceId(null);
    }
    setIsServiceModalOpen(true);
  };

  const bookServiceAppointment = async (appointmentData: {
    vehicleDetails: ServiceAppointment['vehicleDetails'];
    serviceIds: string[];
    serviceNames: string[];
    totalEstimate: number;
    date: string;
    timeSlot: string;
    branch: string;
    pickupRequired: boolean;
    loanerCarRequired: boolean;
    notes?: string;
  }) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Sign in before booking a service appointment.', 'info', 'Sign-in required');
      throw new Error('Sign in to book a service appointment.');
    }
    try {
      const newAppointment = await api.createServiceAppointment({
        ...appointmentData,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone,
      });
      setServiceAppointments((prev) => [newAppointment, ...prev]);
      setIsServiceModalOpen(false);
      showToast(`Service appointment booked! Reference: ${newAppointment.appointmentRef}`, 'success', 'Workshop Scheduled');
      return newAppointment.appointmentRef;
    } catch (error) {
      reportApiError(error, 'Could not book service appointment');
      throw error;
    }
  };

  const updateServiceStatus = (
    appointmentId: string, 
    status: ServiceStatus, 
    bayNumber?: number, 
    technician?: string
  ) => {
    const percentMap: Record<ServiceStatus, number> = {
      'Received': 15,
      'Diagnostic Inspection': 35,
      'Parts & Repair': 65,
      'Quality Check': 85,
      'Ready for Delivery': 95,
      'Completed': 100,
      'Cancelled': 0
    };

    api.updateServiceAppointment(appointmentId, { status, bayNumber, technicianAssigned: technician })
      .then((updated) => {
        setServiceAppointments((prev) => prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...updated, progressPercent: percentMap[status] || updated.progressPercent }
            : appointment
        ));
        showToast(`Service ticket status updated to "${status}"`, 'info', 'Workshop Live Sync');
      })
      .catch((error: unknown) => reportApiError(error, 'Could not update service status'));
  };

  const cancelServiceAppointment = (appointmentId: string) => {
    api.cancelServiceAppointment(appointmentId).then((cancelled) => {
      setServiceAppointments((prev) => prev.map((appointment) =>
        appointment.id === appointmentId ? cancelled : appointment
      ));
      showToast('Service appointment cancelled', 'info');
    }).catch((error: unknown) => reportApiError(error, 'Could not cancel appointment'));
  };

  // Garage
  const addCarToGarage = async (carData: Omit<CustomerCar, 'id'>) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Sign in to manage your vehicle garage.', 'info', 'Sign-in required');
      return;
    }
    try {
      const newCar = await api.addCustomerCar(carData);
      setGarage((prev) => [newCar, ...prev]);
      showToast(`Added ${newCar.year} ${newCar.make} ${newCar.model} to your garage`, 'success', 'Garage Updated');
    } catch (error) {
      reportApiError(error, 'Could not add vehicle to garage');
    }
  };

  const removeCarFromGarage = async (carId: string) => {
    try {
      await api.removeCustomerCar(carId);
      setGarage((prev) => prev.filter((car) => car.id !== carId));
      showToast('Vehicle removed from your garage', 'info');
    } catch (error) {
      reportApiError(error, 'Could not remove vehicle from garage');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentUser,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        hasDealershipAuthorization: isAuthenticated && currentUser.role === 'admin',
        grantDealershipAuthorization,
        isAuthModalOpen,
        setIsAuthModalOpen,

        vehicles,
        selectedVehicle,
        setSelectedVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,

        wishlist,
        toggleWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,

        testDriveVehicle,
        openTestDriveModal,
        closeTestDriveModal,
        isTestDriveModalOpen,
        testDrives,
        bookTestDrive,
        cancelTestDrive,

        parts,
        services,
        selectedPart,
        setSelectedPart,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        promoCode,
        discountRate,
        applyPromoCode,
        orders,
        placeOrder,

        serviceAppointments,
        isServiceModalOpen,
        setIsServiceModalOpen,
        preselectedServiceId,
        openServiceBookingModal,
        bookServiceAppointment,
        updateServiceStatus,
        cancelServiceAppointment,

        garage,
        addCarToGarage,
        removeCarFromGarage,

        branches,
        employees,

        globalSearchQuery,
        setGlobalSearchQuery,
        selectedFilterCondition,
        setSelectedFilterCondition,
        selectedFilterBodyType,
        setSelectedFilterBodyType,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
