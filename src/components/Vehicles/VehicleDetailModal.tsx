import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Fuel, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  MapPin, 
  Award,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';

export const VehicleDetailModal: React.FC = () => {
  const { 
    selectedVehicle, 
    setSelectedVehicle, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    addToCompare, 
    removeFromCompare,
    openTestDriveModal,
    showToast 
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'inspection' | 'specs'>('overview');

  // Financing Calculator state
  const [downPayment, setDownPayment] = useState(15000);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [interestRate, setInterestRate] = useState(5.9); // %

  if (!selectedVehicle) return null;

  const isFavorited = wishlist.includes(selectedVehicle.id);
  const isInCompare = compareList.some((v) => v.id === selectedVehicle.id);

  // EMI calculation: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const principal = Math.max(0, selectedVehicle.price - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const emi =
    monthlyRate > 0 && principal > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : principal / (loanTerm || 1);
  const totalLoanRepayment = emi * loanTerm;
  const totalFinanceInterest = totalLoanRepayment - principal;

  const handleDownloadBrochure = () => {
    showToast(
      `Official brochure for ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} generated.`,
      'success',
      'Brochure Ready'
    );
  };

  const handleRequestQuote = () => {
    showToast(
      `Dealership quote request submitted for ${selectedVehicle.stockId}. A sales advisor will reach out shortly.`,
      'success',
      'Quote Inquired'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {selectedVehicle.stockId}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-mono">VIN: {selectedVehicle.vin}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedVehicle.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(selectedVehicle.id)}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-600 fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={() => isInCompare ? removeFromCompare(selectedVehicle.id) : addToCompare(selectedVehicle)}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Compare"
            >
              <Layers className={`w-4 h-4 ${isInCompare ? 'text-blue-600' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="p-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Gallery & Quick Numbers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Gallery Left (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-900 shadow-inner">
                <img
                  src={selectedVehicle.images[activeImageIdx] || selectedVehicle.images[0]}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                  Photo {activeImageIdx + 1} of {selectedVehicle.images.length}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedVehicle.location}</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedVehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Pricing & Booking Right (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  CarCraft Guaranteed Dealer Price
                </div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    ${selectedVehicle.price.toLocaleString()}
                  </span>
                  {selectedVehicle.msrp && (
                    <span className="text-sm text-gray-400 line-through">
                      MSRP ${selectedVehicle.msrp.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-emerald-600 mb-5">
                  Est. ${Math.round(emi)}/month (with {Math.round((downPayment / selectedVehicle.price) * 100)}% down)
                </div>

                {/* Key specs highlight */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white border border-gray-200 text-xs mb-6">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Horsepower</span>
                    <span className="font-bold text-gray-900">{selectedVehicle.horsepower} HP</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">0-60 mph</span>
                    <span className="font-bold text-gray-900">{selectedVehicle.acceleration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Mileage</span>
                    <span className="font-bold text-gray-900">{selectedVehicle.mileage.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Drivetrain</span>
                    <span className="font-bold text-gray-900">{selectedVehicle.drivetrain} • {selectedVehicle.transmission}</span>
                  </div>
                </div>

                {/* Assurance pills */}
                <div className="space-y-2 mb-6 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Clean CARFAX • {selectedVehicle.ownersCount} Owner • 0 Accidents Reported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>150-Point Certified Multipoint Dealership Inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Warranty: {selectedVehicle.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    openTestDriveModal(selectedVehicle);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book VIP Test Drive</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRequestQuote}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Request Quote
                  </button>
                  <button
                    onClick={handleDownloadBrochure}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-600" />
                    Brochure PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              {[
                { id: 'overview', label: 'Features & Equipment' },
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'calculator', label: 'Financing & Payment Calculator' },
                { id: 'inspection', label: '150-Point Inspection Report' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Installed Options & Factory Equipment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedVehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-800 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  CarCraft Certified Guarantee
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  This vehicle has passed our rigorous multi-stage mechanical, electronic, and structural inspection. Includes 7-day or 500-mile money-back exchange guarantee and complimentary 1-year roadside assistance.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                <div className="p-3 bg-gray-50 font-bold text-gray-900">Powertrain & Performance</div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Engine</span><span className="font-semibold text-gray-900">{selectedVehicle.engine}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Horsepower</span><span className="font-semibold text-gray-900">{selectedVehicle.horsepower} HP</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Torque</span><span className="font-semibold text-gray-900">{selectedVehicle.torque}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Acceleration 0-60 mph</span><span className="font-semibold text-gray-900">{selectedVehicle.acceleration}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Transmission</span><span className="font-semibold text-gray-900">{selectedVehicle.transmission}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Drivetrain</span><span className="font-semibold text-gray-900">{selectedVehicle.drivetrain}</span></div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                <div className="p-3 bg-gray-50 font-bold text-gray-900">Dimensions & Colors</div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Exterior Color</span><span className="font-semibold text-gray-900">{selectedVehicle.exteriorColor}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Interior Color</span><span className="font-semibold text-gray-900">{selectedVehicle.interiorColor}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Fuel Economy</span><span className="font-semibold text-gray-900">{selectedVehicle.fuelEconomy}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Mileage</span><span className="font-semibold text-gray-900">{selectedVehicle.mileage.toLocaleString()} miles</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Body Type</span><span className="font-semibold text-gray-900">{selectedVehicle.bodyType}</span></div>
                <div className="p-3 flex justify-between"><span className="text-gray-500">Warranty Coverage</span><span className="font-semibold text-gray-900">{selectedVehicle.warranty}</span></div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <Calculator className="w-4 h-4 text-blue-600" />
                Customize Your Monthly Financing Payment
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Down payment */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>Down Payment</span>
                    <span className="text-blue-600 font-bold">${downPayment.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.min(selectedVehicle.price * 0.5, 60000)}
                    step="1000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>$0 (0%)</span>
                    <span>${Math.min(selectedVehicle.price * 0.5, 60000).toLocaleString()}</span>
                  </div>
                </div>

                {/* Term */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Term Length: {loanTerm} Months
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[24, 36, 48, 60].map((t) => (
                      <button
                        key={t}
                        onClick={() => setLoanTerm(t)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          loanTerm === t ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700'
                        }`}
                      >
                        {t}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest rate */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>Estimated APR</span>
                    <span className="text-blue-600 font-bold">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="2.9"
                    max="10.9"
                    step="0.2"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Tier 1: 2.9%</span>
                    <span>Standard: 10.9%</span>
                  </div>
                </div>
              </div>

              {/* Results Breakdown Box */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500">Estimated Monthly Payment</div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight text-blue-600">
                    ${Math.round(emi).toLocaleString()}<span className="text-sm font-medium text-gray-500">/mo</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-600 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <span className="block text-gray-400 font-medium">Financed Amount</span>
                    <span className="font-bold text-gray-900">${principal.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-medium">Est. Total Interest</span>
                    <span className="font-bold text-gray-900">${Math.round(totalFinanceInterest).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-medium">Total Cost of Vehicle</span>
                    <span className="font-bold text-gray-900">${Math.round(totalLoanRepayment + downPayment).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inspection' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    {selectedVehicle.inspectionScore}/150
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-900">Passed Certified Multi-Point Inspection</div>
                    <div className="text-xs text-emerald-700">Signed off by Lead Master Technician at CarCraft Center</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
                  100% Certified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { section: 'Engine & Powertrain', items: ['Fluid levels & condition', 'Engine compression & seals', 'Drive belts & hoses', 'Exhaust emissions test'] },
                  { section: 'Brakes & Suspension', items: ['Rotor thickness & pad wear (>80%)', 'ABS sensor calibration', 'Struts & shock absorbers', 'Bushings & tie-rod joints'] },
                  { section: 'Electrical & ADAS Systems', items: ['ECU fault code clear', 'Radar / Camera ADAS alignment', 'Battery health & alternator draw', 'Lighting & signal indicators'] },
                  { section: 'Interior & Safety', items: ['Airbag deployment modules', 'Seatbelt tensioners', 'Climate control HVAC clean', 'Surround camera calibration'] }
                ].map((sec, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-white">
                    <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {sec.section}
                    </div>
                    <ul className="space-y-1 text-gray-600 pl-5 list-disc text-[11px]">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item} — <span className="text-emerald-600 font-semibold">Passed</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
