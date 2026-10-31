export type Role = 'customer' | 'admin' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  address?: string;
  preferredBranch?: string;
}

export type VehicleCondition = 'New' | 'Certified Pre-Owned' | 'Used';
export type BodyType = 'SUV' | 'Sedan' | 'Coupe' | 'Truck' | 'Sports' | 'Electric' | 'Convertible';
export type FuelType = 'Gasoline' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | 'Diesel';
export type Transmission = 'Automatic' | 'Manual' | 'Dual-Clutch' | 'Single-Speed';
export type DriveType = 'AWD' | 'RWD' | 'FWD' | '4WD';
export type VehicleStatus = 'In Stock' | 'Reserved' | 'In Service' | 'Sold';

export interface Vehicle {
  id: string;
  vin: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  condition: VehicleCondition;
  bodyType: BodyType;
  price: number;
  msrp?: number;
  monthlyEstimate: number;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  fuelType: FuelType;
  transmission: Transmission;
  drivetrain: DriveType;
  engine: string;
  horsepower: number;
  torque: string;
  acceleration: string; // e.g. "3.2s 0-60 mph"
  fuelEconomy: string; // e.g. "22 City / 29 Hwy" or "112 MPGe"
  images: string[];
  features: string[];
  status: VehicleStatus;
  location: string;
  warranty: string;
  carfaxClean: boolean;
  ownersCount: number;
  serviceRecordsCount: number;
  inspectionScore: number; // e.g. 150/150
  featured?: boolean;
}

export interface PartCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  brand: string;
  inStock: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  compatibility: string[]; // List of models, e.g. ["BMW M3 (2020-2025)", "BMW M4 (2021-2025)"]
  isOem: boolean;
  warranty: string;
  installationDifficulty: 'Easy' | 'Moderate' | 'Professional Recommended';
}

export interface CartItem {
  part: Part;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    partId: string;
    partName: string;
    partNumber: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Ready for Pickup';
  shippingAddress: string;
  deliveryMethod: 'Express Delivery' | 'Dealership Pickup';
  trackingNumber?: string;
  paymentMethod: string;
}

export interface TestDriveBooking {
  id: string;
  bookingRef: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleStockId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  date: string;
  timeSlot: string;
  branch: string;
  salesAdvisor?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdDate: string;
  specialRequests?: string;
}

export type ServiceStatus = 
  | 'Received' 
  | 'Diagnostic Inspection' 
  | 'Parts & Repair' 
  | 'Quality Check' 
  | 'Ready for Delivery' 
  | 'Completed';

export interface ServicePackage {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  estimatedHours: string;
  popular?: boolean;
  includedItems: string[];
}

export interface ServiceAppointment {
  id: string;
  appointmentRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    mileage: number;
  };
  serviceIds: string[];
  serviceNames: string[];
  totalEstimate: number;
  date: string;
  timeSlot: string;
  branch: string;
  technicianAssigned?: string;
  bayNumber?: number;
  status: ServiceStatus;
  pickupRequired: boolean;
  loanerCarRequired: boolean;
  notes?: string;
  progressPercent: number;
  inspectionLog: {
    step: string;
    status: 'pending' | 'in_progress' | 'passed' | 'attention';
    note?: string;
  }[];
}

export interface CustomerCar {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  lastServiceDate: string;
  nextServiceDue: string;
  image: string;
}

export interface DealershipBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  serviceBays: number;
}

export interface Employee {
  id: string;
  name: string;
  role: 'General Manager' | 'Senior Sales Advisor' | 'Master Technician' | 'Service Advisor' | 'Finance Specialist';
  department: 'Sales' | 'Service Workshop' | 'Management' | 'Finance';
  email: string;
  phone: string;
  avatar: string;
  status: 'Available' | 'In Consultation' | 'In Bay' | 'On Leave';
  activeAssignments: number;
  rating: number;
}
