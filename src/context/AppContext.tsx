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
  ServiceStatus 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_VEHICLES, 
  INITIAL_PARTS, 
  INITIAL_GARAGE, 
  INITIAL_TEST_DRIVES, 
  INITIAL_SERVICE_APPOINTMENTS, 
  INITIAL_ORDERS, 
  DEALERSHIP_BRANCHES, 
  EMPLOYEES_DATA 
} from '../data/mockData';

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
  switchUserRole: (role: 'customer' | 'admin') => void;
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
  bookTestDrive: (booking: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdDate' | 'status'>) => string;
  cancelTestDrive: (bookingId: string) => void;

  // Parts & Cart
  parts: Part[];
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
  }) => Order;

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
  }) => string;
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
  // Default to Marcus Vance (Dealership General Manager / Admin) for full dealership authorization
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('carcraft_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Wishlist & Compare
  const [wishlist, setWishlist] = useState<string[]>(['veh-1', 'veh-2']);
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Test Drive Modal
  const [testDriveVehicle, setTestDriveVehicle] = useState<Vehicle | null>(null);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>(() => {
    const saved = localStorage.getItem('carcraft_test_drives');
    return saved ? JSON.parse(saved) : INITIAL_TEST_DRIVES;
  });

  // Parts & Store
  const [parts] = useState<Part[]>(INITIAL_PARTS);
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
    const saved = localStorage.getItem('carcraft_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Services
  const [serviceAppointments, setServiceAppointments] = useState<ServiceAppointment[]>(() => {
    const saved = localStorage.getItem('carcraft_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_APPOINTMENTS;
  });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  // Customer Garage
  const [garage, setGarage] = useState<CustomerCar[]>(() => {
    const saved = localStorage.getItem('carcraft_garage');
    return saved ? JSON.parse(saved) : INITIAL_GARAGE;
  });

  // Dealership metadata
  const [branches] = useState<DealershipBranch[]>(DEALERSHIP_BRANCHES);
  const [employees] = useState<Employee[]>(EMPLOYEES_DATA);

  // Filters passed from Home hero
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedFilterCondition, setSelectedFilterCondition] = useState('All');
  const [selectedFilterBodyType, setSelectedFilterBodyType] = useState('All');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('carcraft_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('carcraft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('carcraft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('carcraft_test_drives', JSON.stringify(testDrives));
  }, [testDrives]);

  useEffect(() => {
    localStorage.setItem('carcraft_services', JSON.stringify(serviceAppointments));
  }, [serviceAppointments]);

  useEffect(() => {
    localStorage.setItem('carcraft_garage', JSON.stringify(garage));
  }, [garage]);

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

  // User switcher & Dealership Authorization
  const grantDealershipAuthorization = () => {
    setCurrentUser(INITIAL_USERS[1]);
    setCurrentPage('admin');
    showToast('Dealership Authorization Granted: Marcus Vance (General Manager) — Full ERP Access', 'success', 'Dealership Clearance Active');
  };

  const switchUserRole = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(INITIAL_USERS[1]);
      showToast('Switched to Dealership Executive & Admin view', 'info', 'Role: Marcus Vance (GM)');
    } else {
      setCurrentUser(INITIAL_USERS[0]);
      showToast('Switched to Customer account', 'info', 'Role: Alex Rivera (Client)');
    }
  };

  // Vehicle inventory CRUD
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    showToast(`Added ${newVehicle.year} ${newVehicle.make} ${newVehicle.model} to inventory`, 'success', 'Inventory Updated');
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    showToast('Vehicle specifications saved successfully', 'success', 'Update Complete');
  };

  const deleteVehicle = (id: string) => {
    const veh = vehicles.find((v) => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast(veh ? `Removed ${veh.make} ${veh.model}` : 'Vehicle removed', 'warning', 'Deleted from Inventory');
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

  const bookTestDrive = (bookingData: Omit<TestDriveBooking, 'id' | 'bookingRef' | 'createdDate' | 'status'>) => {
    const bookingRef = `TD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: TestDriveBooking = {
      ...bookingData,
      id: `td-${Date.now()}`,
      bookingRef,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed'
    };
    setTestDrives((prev) => [newBooking, ...prev]);
    showToast(`Test drive confirmed for ${newBooking.vehicleName}! Ref: ${bookingRef}`, 'success', 'Booking Confirmed');
    return bookingRef;
  };

  const cancelTestDrive = (bookingId: string) => {
    setTestDrives((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );
    showToast('Test drive appointment has been cancelled', 'info');
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

  const placeOrder = (orderData: {
    shippingAddress: string;
    deliveryMethod: 'Express Delivery' | 'Dealership Pickup';
    paymentMethod: string;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.part.price * item.quantity, 0);
    const discount = subtotal * discountRate;
    const shipping = orderData.deliveryMethod === 'Dealership Pickup' ? 0 : 25;
    const tax = (subtotal - discount) * 0.0825;
    const total = subtotal - discount + shipping + tax;

    const orderNumber = `CC-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((c) => ({
        partId: c.part.id,
        partName: c.part.name,
        partNumber: c.part.partNumber,
        price: c.part.price,
        quantity: c.quantity,
        image: c.part.image
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      status: 'Processing',
      shippingAddress: orderData.shippingAddress,
      deliveryMethod: orderData.deliveryMethod,
      trackingNumber: `CC-FEDEX-${Math.floor(100000000 + Math.random() * 900000000)}`,
      paymentMethod: orderData.paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setPromoCode('');
    setDiscountRate(0);
    showToast(`Order placed successfully! Ref: ${orderNumber}`, 'success', 'Order Confirmed');
    return newOrder;
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

  const bookServiceAppointment = (appointmentData: {
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
    const appointmentRef = `SRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAppointment: ServiceAppointment = {
      ...appointmentData,
      id: `srv-apt-${Date.now()}`,
      appointmentRef,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      bayNumber: Math.floor(1 + Math.random() * 6),
      technicianAssigned: 'David Chen (Master Certified Lead)',
      status: 'Received',
      progressPercent: 15,
      inspectionLog: [
        { step: 'Check-in & Visual Walkaround', status: 'in_progress', note: 'Checked in by service reception.' },
        { step: 'Diagnostic Inspection', status: 'pending' },
        { step: 'Parts & Mechanical Service', status: 'pending' },
        { step: 'Road Test & Safety Check', status: 'pending' },
        { step: 'Car Wash & Delivery Prep', status: 'pending' }
      ]
    };

    setServiceAppointments((prev) => [newAppointment, ...prev]);
    setIsServiceModalOpen(false);
    showToast(`Service appointment booked! Reference: ${appointmentRef}`, 'success', 'Workshop Scheduled');
    return appointmentRef;
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
      'Completed': 100
    };

    setServiceAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status,
            progressPercent: percentMap[status] || apt.progressPercent,
            bayNumber: bayNumber !== undefined ? bayNumber : apt.bayNumber,
            technicianAssigned: technician || apt.technicianAssigned
          };
        }
        return apt;
      })
    );
    showToast(`Service ticket status updated to "${status}"`, 'info', 'Workshop Live Sync');
  };

  const cancelServiceAppointment = (appointmentId: string) => {
    setServiceAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    showToast('Service appointment cancelled', 'info');
  };

  // Garage
  const addCarToGarage = (carData: Omit<CustomerCar, 'id'>) => {
    const newCar: CustomerCar = {
      ...carData,
      id: `car-user-${Date.now()}`
    };
    setGarage((prev) => [newCar, ...prev]);
    showToast(`Added ${newCar.year} ${newCar.make} ${newCar.model} to your garage`, 'success', 'Garage Updated');
  };

  const removeCarFromGarage = (carId: string) => {
    setGarage((prev) => prev.filter((c) => c.id !== carId));
    showToast('Vehicle removed from your garage', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentUser,
        switchUserRole,
        hasDealershipAuthorization: currentUser.role === 'admin',
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
