import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Calendar, 
  Wrench, 
  Car, 
  ShoppingBag, 
  Heart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';

export const MyAccountView: React.FC = () => {
  const { 
    currentUser, 
    testDrives, 
    cancelTestDrive, 
    serviceAppointments, 
    cancelServiceAppointment,
    garage, 
    addCarToGarage, 
    removeCarFromGarage,
    orders, 
    wishlist, 
    vehicles, 
    setSelectedVehicle, 
    openTestDriveModal, 
    openServiceBookingModal,
    setCurrentPage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'garage' | 'orders' | 'wishlist' | 'profile'>('bookings');
  
  // Add car to garage modal
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [newMake, setNewMake] = useState('Porsche');
  const [newModel, setNewModel] = useState('Macan GTS');
  const [newYear, setNewYear] = useState(2023);
  const [newVin, setNewVin] = useState('WP1AB2AY5PDA98124');
  const [newPlate, setNewPlate] = useState('CAR-9110');
  const [newMileage, setNewMileage] = useState(12800);

  const favoritedVehicles = vehicles.filter((v) => wishlist.includes(v.id));

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    addCarToGarage({
      make: newMake,
      model: newModel,
      year: newYear,
      vin: newVin,
      licensePlate: newPlate,
      mileage: newMileage,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDue: '2026-12-15',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
    });
    setIsAddCarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-800 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.name}</h1>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    VIP Customer
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{currentUser.email} • {currentUser.phone}</p>
                <p className="text-xs text-gray-400 mt-0.5">{currentUser.address}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md text-center">
              <div>
                <span className="block text-2xl font-black text-white">{garage.length}</span>
                <span className="text-[10px] text-gray-300 uppercase font-bold">Garage Cars</span>
              </div>
              <div className="border-x border-white/10 px-3">
                <span className="block text-2xl font-black text-white">{testDrives.length + serviceAppointments.length}</span>
                <span className="text-[10px] text-gray-300 uppercase font-bold">Bookings</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">{orders.length}</span>
                <span className="text-[10px] text-gray-300 uppercase font-bold">Orders</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-8 border-t border-white/10 mt-6">
            {[
              { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: testDrives.length + serviceAppointments.length },
              { id: 'garage', label: 'My Garage', icon: Car, badge: garage.length },
              { id: 'orders', label: 'Parts Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length },
              { id: 'profile', label: 'Profile & Settings', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Test Drive Bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Showroom Test Drive Appointments ({testDrives.length})
                </h3>
                <button
                  onClick={() => openTestDriveModal()}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Book New Test Drive
                </button>
              </div>

              {testDrives.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-500 text-xs">
                  No active test drive appointments scheduled.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testDrives.map((td) => (
                    <div
                      key={td.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <img
                          src={td.vehicleImage}
                          alt={td.vehicleName}
                          className="w-24 h-20 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-blue-600">
                              REF: {td.bookingRef}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              td.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {td.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                            {td.vehicleName}
                          </h4>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{td.date} • {td.timeSlot}</span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span className="truncate">{td.branch}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                        <span className="text-[11px] text-gray-500">
                          Advisor: <strong className="text-gray-800">{td.salesAdvisor || 'Assigned on arrival'}</strong>
                        </span>
                        {td.status === 'Confirmed' && (
                          <button
                            onClick={() => cancelTestDrive(td.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Appointments with Pipeline Tracking */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  Workshop Service & Repair Bookings ({serviceAppointments.length})
                </h3>
                <button
                  onClick={() => openServiceBookingModal()}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Schedule Service
                </button>
              </div>

              {serviceAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-500 text-xs">
                  No workshop service appointments scheduled.
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-600">
                              REF: {apt.appointmentRef}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs font-bold text-gray-900">
                              {apt.vehicleDetails.year} {apt.vehicleDetails.make} {apt.vehicleDetails.model}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              ({apt.vehicleDetails.licensePlate})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Scheduled: {apt.date} at {apt.timeSlot} • {apt.branch}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {apt.status}
                          </span>
                          <div className="text-xs font-bold text-gray-900 mt-1">
                            Est: ${apt.totalEstimate.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Services list */}
                      <div className="flex flex-wrap gap-2">
                        {apt.serviceNames.map((s, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>

                      {/* Bay & Progress bar */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>Live Progress: Bay {apt.bayNumber || 3} • {apt.technicianAssigned}</span>
                          <span className="text-blue-600">{apt.progressPercent}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${apt.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Inspection checklist preview */}
                      {apt.inspectionLog && apt.inspectionLog.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                            Step-by-Step Inspection Log:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {apt.inspectionLog.map((log, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100"
                              >
                                {log.status === 'passed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : log.status === 'in_progress' ? (
                                  <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                                )}
                                <span className="font-medium text-gray-800 truncate">{log.step}</span>
                                {log.note && <span className="text-[10px] text-gray-500 truncate">({log.note})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => cancelServiceAppointment(apt.id)}
                          className="text-xs text-gray-500 hover:text-rose-600 font-semibold"
                        >
                          Cancel Service Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: GARAGE */}
        {activeTab === 'garage' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  My Registered Garage ({garage.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your active vehicles for instant OEM part compatibility checks and one-click maintenance scheduling.
                </p>
              </div>

              <button
                onClick={() => setIsAddCarOpen(true)}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle to Garage</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {garage.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-gray-900">
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[11px] font-mono">
                        Plate: {car.licensePlate}
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="text-lg font-black text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono mb-4">VIN: {car.vin}</p>

                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-center mb-4">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Mileage</span>
                          <span className="font-bold text-gray-900">{car.mileage.toLocaleString()} mi</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Last Service</span>
                          <span className="font-semibold text-gray-700">{car.lastServiceDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">Service Due</span>
                          <span className="font-bold text-amber-600">{car.nextServiceDue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => openServiceBookingModal()}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Book Service
                    </button>
                    <button
                      onClick={() => setCurrentPage('parts')}
                      className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
                    >
                      Find Parts
                    </button>
                    <button
                      onClick={() => removeCarFromGarage(car.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4">
              My Parts & Accessories Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">No orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-gray-900">{ord.orderNumber}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Placed on {ord.date} • Paid via {ord.paymentMethod}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Invoiced</span>
                        <span className="text-lg font-black text-gray-900">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 text-xs">
                          <img src={item.image} alt={item.partName} className="w-10 h-10 object-cover rounded-md" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-900 truncate">{item.partName}</h5>
                            <span className="text-[10px] text-gray-400 font-mono">Part #{item.partNumber} • Qty: {item.quantity}</span>
                          </div>
                          <span className="font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Tracking: <strong className="text-gray-900 font-mono">{ord.trackingNumber}</strong></span>
                      </div>
                      <span className="truncate">Destination: {ord.shippingAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4">
              Saved Vehicles Wishlist ({favoritedVehicles.length})
            </h3>

            {favoritedVehicles.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-4">You have not favorited any showroom vehicles yet.</p>
                <button
                  onClick={() => setCurrentPage('vehicles')}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  Browse Showroom Vehicles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedVehicles.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <img src={v.images[0]} alt={v.model} className="w-full h-44 object-cover" />
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{v.stockId}</span>
                        <h4 className="text-base font-bold text-gray-900 truncate">{v.year} {v.make} {v.model}</h4>
                        <p className="text-xs text-gray-500 mb-2">{v.trim}</p>
                        <div className="text-xl font-black text-gray-900">${v.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => setSelectedVehicle(v)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                      >
                        View Vehicle
                      </button>
                      <button
                        onClick={() => openTestDriveModal(v)}
                        className="py-2 px-3 bg-gray-900 text-white text-xs font-bold rounded-xl"
                      >
                        Test Drive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-2xl">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4">
              Customer Profile & Preferences
            </h3>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Full Name</label>
                  <input type="text" readOnly value={currentUser.name} className="w-full p-2.5 rounded-lg border bg-gray-50" />
                </div>
                <div>
                  <label className="text-gray-500 font-bold block mb-1">Email Address</label>
                  <input type="email" readOnly value={currentUser.email} className="w-full p-2.5 rounded-lg border bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="text-gray-500 font-bold block mb-1">Phone Contact</label>
                <input type="tel" readOnly value={currentUser.phone} className="w-full p-2.5 rounded-lg border bg-gray-50" />
              </div>
              <div>
                <label className="text-gray-500 font-bold block mb-1">Primary Delivery & Billing Address</label>
                <input type="text" readOnly value={currentUser.address} className="w-full p-2.5 rounded-lg border bg-gray-50" />
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mt-4">
                <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> CarCraft Preferred Customer Status
                </div>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  Your account is eligible for VIP concierge booking, complimentary loaner vehicles during scheduled services, and exclusive early test drive previews of incoming inventory.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Car to Garage Modal */}
      {isAddCarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-gray-900 text-lg">Add Vehicle to My Garage</h4>
              <button onClick={() => setIsAddCarOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddCar} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Make</label>
                  <input type="text" required value={newMake} onChange={e => setNewMake(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Model</label>
                  <input type="text" required value={newModel} onChange={e => setNewModel(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Year</label>
                  <input type="number" required value={newYear} onChange={e => setNewYear(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">License Plate</label>
                  <input type="text" required value={newPlate} onChange={e => setNewPlate(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">VIN (Vehicle Identification #)</label>
                <input type="text" required value={newVin} onChange={e => setNewVin(e.target.value)} className="w-full p-2 border rounded-lg font-mono" />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Current Mileage</label>
                <input type="number" required value={newMileage} onChange={e => setNewMileage(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCarOpen(false)} className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700">Cancel</button>
                <button type="submit" className="py-2 px-5 rounded-lg bg-blue-600 text-white font-bold">Save to Garage</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
