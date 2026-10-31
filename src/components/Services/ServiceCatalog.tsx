import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServicePackage, ServiceAppointment } from '../../types';
import { SERVICE_PACKAGES } from '../../data/mockData';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ChevronRight,
  Activity,
  MapPin,
  Car
} from 'lucide-react';

export const ServiceCatalog: React.FC = () => {
  const { 
    openServiceBookingModal, 
    serviceAppointments, 
    currentUser, 
    setCurrentPage 
  } = useApp();

  const [activeTrackingApt, setActiveTrackingApt] = useState<ServiceAppointment | null>(
    serviceAppointments[0] || null
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>CarCraft</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Certified Workshop & Maintenance</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Factory Certified Workshop
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Precision maintenance, digital laser alignment, factory software updates, and high-voltage EV service by Master Certified Technicians.
              </p>
            </div>

            <button
              onClick={() => openServiceBookingModal()}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service Appointment</span>
            </button>
          </div>
        </div>

        {/* Live Service Status Bar (if any active appointment) */}
        {serviceAppointments.length > 0 && (
          <div className="bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-white p-5 rounded-2xl shadow-xl border border-gray-800 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Live Dealership Workshop Bay Tracker
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Ticket #{serviceAppointments[0].appointmentRef} — {serviceAppointments[0].vehicleDetails.year} {serviceAppointments[0].vehicleDetails.make} {serviceAppointments[0].vehicleDetails.model}
                </h3>
                <p className="text-xs text-gray-300">
                  Bay {serviceAppointments[0].bayNumber || '3'} • Assigned to {serviceAppointments[0].technicianAssigned}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Current Status: {serviceAppointments[0].status}
                </span>
                <button
                  onClick={() => setCurrentPage('account')}
                  className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  View Details in Account
                </button>
              </div>
            </div>

            {/* Visual Progress Pipeline */}
            <div className="pt-2">
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  'Received',
                  'Diagnostic Inspection',
                  'Parts & Repair',
                  'Quality Check',
                  'Ready for Delivery'
                ].map((stepName, i) => {
                  const stepIndexMap: Record<string, number> = {
                    'Received': 0,
                    'Diagnostic Inspection': 1,
                    'Parts & Repair': 2,
                    'Quality Check': 3,
                    'Ready for Delivery': 4,
                    'Completed': 5
                  };
                  const currentIdx = stepIndexMap[serviceAppointments[0].status] ?? 0;
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={stepName} className="space-y-1.5">
                      <div className={`h-2 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-blue-400 ring-2 ring-blue-400/50'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-gray-800'
                      }`} />
                      <span className={`text-[10px] block font-bold leading-tight ${
                        isCurrent ? 'text-blue-300' : isDone ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 relative group"
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                    Popular Package
                  </span>
                </div>
              )}

              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                  {pkg.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {pkg.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Est. Completion: <strong className="text-gray-900">{pkg.estimatedHours}</strong></span>
                </div>

                {/* Included checklist */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                    What's Included:
                  </span>
                  {pkg.includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Booking action */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Standard Fee</div>
                  <div className="text-2xl font-black text-gray-900">
                    ${pkg.price.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => openServiceBookingModal(pkg.id)}
                  className="py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
