import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Wrench, 
  Calendar, 
  Clock, 
  Car, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Plus, 
  ArrowRight 
} from 'lucide-react';

export const ServiceBookingModal: React.FC = () => {
  const { 
    isServiceModalOpen, 
    setIsServiceModalOpen, 
    preselectedServiceId, 
    services,
    garage, 
    branches, 
    currentUser, 
    bookServiceAppointment,
    setCurrentPage 
  } = useApp();

  // Selected Services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Vehicle Source: 'garage' or 'custom'
  const [vehicleSource, setVehicleSource] = useState<'garage' | 'custom'>(
    garage.length > 0 ? 'garage' : 'custom'
  );
  const [selectedGarageCarId, setSelectedGarageCarId] = useState<string>(garage[0]?.id || '');
  const [customMake, setCustomMake] = useState('BMW');
  const [customModel, setCustomModel] = useState('M3 Competition');
  const [customYear, setCustomYear] = useState(2023);
  const [customPlate, setCustomPlate] = useState('CAL-7890');
  const [customMileage, setCustomMileage] = useState(16500);

  // Booking details
  const [selectedBranch, setSelectedBranch] = useState(branches[0].name);
  const [appointmentDate, setAppointmentDate] = useState('2026-11-05');
  const [appointmentSlot, setAppointmentSlot] = useState('09:00 AM');
  const [pickupRequired, setPickupRequired] = useState(false);
  const [loanerCarRequired, setLoanerCarRequired] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isServiceModalOpen || services.length === 0) return;
    const validSelection = selectedServiceIds.filter((id) => services.some((service) => service.id === id));
    if (validSelection.length) {
      if (validSelection.length !== selectedServiceIds.length) setSelectedServiceIds(validSelection);
      return;
    }
    const selected = services.find((service) => service.id === preselectedServiceId) || services[0];
    setSelectedServiceIds([selected.id]);
  }, [isServiceModalOpen, preselectedServiceId, services, selectedServiceIds]);

  if (!isServiceModalOpen) return null;

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const selectedPackages = services.filter((p) => selectedServiceIds.includes(p.id));
  const totalEstimate = selectedPackages.reduce((acc, p) => acc + p.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let vehicleDetails;
    if (vehicleSource === 'garage') {
      const car = garage.find((c) => c.id === selectedGarageCarId) || garage[0];
      vehicleDetails = {
        make: car.make,
        model: car.model,
        year: car.year,
        licensePlate: car.licensePlate,
        mileage: car.mileage
      };
    } else {
      vehicleDetails = {
        make: customMake,
        model: customModel,
        year: customYear,
        licensePlate: customPlate,
        mileage: customMileage
      };
    }

    try {
      await bookServiceAppointment({
        vehicleDetails,
        serviceIds: selectedServiceIds,
        serviceNames: selectedPackages.map((p) => p.title),
        totalEstimate,
        date: appointmentDate,
        timeSlot: appointmentSlot,
        branch: selectedBranch,
        pickupRequired,
        loanerCarRequired,
        notes
      });
      setCurrentPage('account');
    } catch {
      // The app context displays the API error toast.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white p-6 relative">
          <button
            onClick={() => setIsServiceModalOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
            <Wrench className="w-4 h-4" /> Dealership Workshop Booking
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Schedule Certified Service & Inspection
          </h3>
          <p className="text-gray-300 text-xs mt-1">
            Factory technicians, OEM genuine parts, and live bay diagnostic tracking.
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Select Vehicle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              1. Select Vehicle for Service
            </label>
            {garage.length > 0 && (
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setVehicleSource('garage')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border ${
                    vehicleSource === 'garage'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  From My Garage ({garage.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleSource('custom')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border ${
                    vehicleSource === 'custom'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  Enter Different Car
                </button>
              </div>
            )}

            {vehicleSource === 'garage' && garage.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {garage.map((car) => (
                  <label
                    key={car.id}
                    onClick={() => setSelectedGarageCarId(car.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedGarageCarId === car.id
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={car.image} alt={car.model} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {car.year} {car.make} {car.model}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Plate: {car.licensePlate} • {car.mileage.toLocaleString()} mi
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Year</label>
                  <input
                    type="number"
                    value={customYear}
                    onChange={(e) => setCustomYear(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Make</label>
                  <input
                    type="text"
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Model</label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase">License Plate</label>
                  <input
                    type="text"
                    value={customPlate}
                    onChange={(e) => setCustomPlate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Select Service Packages */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              2. Select Workshop Services (Multi-select)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {services.map((pkg) => {
                const isSelected = selectedServiceIds.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => toggleService(pkg.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/30'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{pkg.title}</div>
                        <div className="text-[11px] text-gray-500">{pkg.estimatedHours} • {pkg.category}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      ${pkg.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Branch & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Workshop Location
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-gray-300 text-xs bg-white"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-gray-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Drop-off Window
              </label>
              <select
                value={appointmentSlot}
                onChange={(e) => setAppointmentSlot(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-gray-300 text-xs bg-white"
              >
                <option value="08:00 AM">08:00 AM (Early Drop)</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>
          </div>

          {/* Step 4: Complimentary Amenities */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
              Complimentary Dealership Concierge Amenities:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loanerCarRequired}
                  onChange={(e) => setLoanerCarRequired(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
                <span className="text-gray-800">Free Loaner Vehicle during repair</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupRequired}
                  onChange={(e) => setPickupRequired(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
                <span className="text-gray-800">Doorstep Pickup & Valet Return</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Technician Notes / Specific Symptoms
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Squeaking noise when turning full lock, check tire pressures..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Estimated Service Cost</span>
              <div className="text-2xl font-black text-gray-900">${totalEstimate.toLocaleString()}</div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Workshop Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
