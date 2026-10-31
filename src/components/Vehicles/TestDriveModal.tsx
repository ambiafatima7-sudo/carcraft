import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  ArrowRight, 
  ArrowLeft,
  FileCheck,
  User,
  Phone,
  Mail
} from 'lucide-react';

export const TestDriveModal: React.FC = () => {
  const { 
    isTestDriveModalOpen, 
    closeTestDriveModal, 
    testDriveVehicle, 
    vehicles, 
    branches, 
    currentUser, 
    bookTestDrive,
    setCurrentPage 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    testDriveVehicle?.id || (vehicles[0]?.id || '')
  );
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0].name);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM - 11:45 AM');
  
  // Driver Info
  const [driverName, setDriverName] = useState(currentUser.name);
  const [driverEmail, setDriverEmail] = useState(currentUser.email);
  const [driverPhone, setDriverPhone] = useState(currentUser.phone);
  const [licenseNumber, setLicenseNumber] = useState('CA-D8492019');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingRefResult, setBookingRefResult] = useState<string>('');

  useEffect(() => {
    setDriverName(currentUser.name);
    setDriverEmail(currentUser.email);
    setDriverPhone(currentUser.phone);
  }, [currentUser.name, currentUser.email, currentUser.phone]);

  if (!isTestDriveModalOpen) return null;

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || testDriveVehicle || vehicles[0];

  const timeSlots = [
    '09:30 AM - 10:15 AM',
    '11:00 AM - 11:45 AM',
    '01:30 PM - 02:15 PM',
    '03:00 PM - 03:45 PM',
    '04:30 PM - 05:15 PM'
  ];

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;

    try {
      const ref = await bookTestDrive({
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`,
      vehicleImage: activeVehicle.images[0],
      vehicleStockId: activeVehicle.stockId,
      customerName: driverName,
      customerEmail: driverEmail,
      customerPhone: driverPhone,
      licenseNumber: licenseNumber,
      date: selectedDate,
      timeSlot: selectedSlot,
      branch: selectedBranch,
      salesAdvisor: 'Marcus Vance',
      specialRequests: specialRequests
      });

      setBookingRefResult(ref);
      setStep(4);
    } catch {
      // The app context displays the API error toast.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#111827] text-white p-6 relative">
          <button
            onClick={closeTestDriveModal}
            className="absolute top-5 right-5 text-gray-400 hover:text-white rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
            <Calendar className="w-4 h-4" /> VIP Showroom Experience
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Schedule a Private Test Drive
          </h3>
          <p className="text-gray-300 text-xs mt-1">
            Complimentary 45-minute unaccompanied or guided route with our Performance Specialist.
          </p>

          {/* Stepper */}
          {step < 4 && (
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { num: 1, label: 'Vehicle' },
                { num: 2, label: 'Date & Location' },
                { num: 3, label: 'Driver Details' },
              ].map((s) => (
                <div key={s.num} className="text-left">
                  <div className={`h-1.5 rounded-full mb-1.5 transition-all ${
                    step >= s.num ? 'bg-blue-500' : 'bg-gray-800'
                  }`} />
                  <span className={`text-[11px] font-bold ${
                    step >= s.num ? 'text-blue-300' : 'text-gray-500'
                  }`}>
                    Step {s.num}: {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* STEP 1: VEHICLE CONFIRMATION / SELECT */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Selected Vehicle for Experience
              </label>

              {activeVehicle && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <img
                    src={activeVehicle.images[0]}
                    alt={activeVehicle.model}
                    className="w-full sm:w-44 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      Stock: {activeVehicle.stockId} • {activeVehicle.condition}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 truncate">
                      {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{activeVehicle.trim}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{activeVehicle.horsepower} HP</span>
                      <span>•</span>
                      <span>{activeVehicle.acceleration}</span>
                      <span>•</span>
                      <span className="font-bold text-gray-900">${activeVehicle.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Or switch to a different vehicle in stock:
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.stockId}) - ${v.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>Select Date & Showroom</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & TIME */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Select Dealership Showroom
                </label>
                <div className="space-y-2">
                  {branches.map((b) => (
                    <label
                      key={b.id}
                      onClick={() => setSelectedBranch(b.name)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedBranch === b.name
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedBranch === b.name ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-900">{b.name}</div>
                        <div className="text-[11px] text-gray-500">{b.address}, {b.city}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Time Window
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>Driver Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DRIVER DETAILS */}
          {step === 3 && (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Driver Full Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Driver License ID</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    placeholder="e.g. CA-D8492019"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Special Preferences / Requests</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Would like highway acceleration test, evaluating trade-in on current car..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Please present your valid driver's license and proof of full insurance at the showroom reception. No purchase obligation required.
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Test Drive Booking</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION PASS */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">
                  VIP Test Drive Confirmed!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  A calendar invite and SMS confirmation have been sent to your phone.
                </p>
              </div>

              {/* Pass Card */}
              <div className="bg-gradient-to-br from-gray-900 to-blue-950 text-white p-5 rounded-2xl text-left shadow-xl border border-gray-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block">
                      Booking Reference Pass
                    </span>
                    <span className="text-xl font-mono font-bold tracking-tight text-white">
                      {bookingRefResult}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-3">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Vehicle</span>
                    <span className="font-bold text-white">{activeVehicle?.year} {activeVehicle?.make} {activeVehicle?.model}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Date & Slot</span>
                    <span className="font-bold text-white">{selectedDate} • {selectedSlot.split('-')[0]}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px]">Showroom Address</span>
                    <span className="font-bold text-white">{selectedBranch}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeTestDriveModal();
                    setCurrentPage('account');
                  }}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  View in My Bookings
                </button>
                <button
                  type="button"
                  onClick={closeTestDriveModal}
                  className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
