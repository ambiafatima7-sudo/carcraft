import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Calendar, Check, Zap, Gauge, DollarSign } from 'lucide-react';

export const VehicleCompareModal: React.FC = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen, 
    openTestDriveModal, 
    setSelectedVehicle 
  } = useApp();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Vehicle Comparison Matrix
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {compareList.length} / 3 Vehicles
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Side-by-side comparison of performance, pricing, and factory specifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-x-auto">
          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No vehicles added for comparison yet.</p>
              <p className="text-xs text-gray-400 mt-1">Browse vehicles and click "Compare" on any card.</p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              {/* Header Cards row */}
              <div className="grid grid-cols-4 gap-4 pb-6 border-b border-gray-200 items-end">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Vehicle Model
                </div>
                {compareList.map((v) => (
                  <div key={v.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    <button
                      onClick={() => removeFromCompare(v.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-rose-600 p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={v.images[0]}
                      alt={v.model}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{v.stockId}</div>
                    <div className="text-sm font-bold text-gray-900 truncate">{v.year} {v.make} {v.model}</div>
                    <div className="text-xs text-gray-500 truncate mb-3">{v.trim}</div>
                    
                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        openTestDriveModal(v);
                      }}
                      className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3" /> Test Drive
                    </button>
                  </div>
                ))}
              </div>

              {/* Specs Rows */}
              <div className="divide-y divide-gray-100 text-xs">
                {/* Price */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Retail Price</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center font-black text-gray-900 text-base">
                      ${v.price.toLocaleString()}
                    </div>
                  ))}
                </div>

                {/* Est Monthly */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Est. Monthly (10% Down)</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center font-bold text-emerald-600">
                      ${v.monthlyEstimate}/mo
                    </div>
                  ))}
                </div>

                {/* Horsepower */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Horsepower</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center font-semibold text-gray-900 flex items-center justify-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {v.horsepower} HP
                    </div>
                  ))}
                </div>

                {/* Acceleration 0-60 */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">0-60 mph Time</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center font-bold text-blue-600">
                      {v.acceleration}
                    </div>
                  ))}
                </div>

                {/* Mileage */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Odometer Mileage</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center text-gray-700">
                      {v.mileage.toLocaleString()} miles
                    </div>
                  ))}
                </div>

                {/* Drivetrain & Trans */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Drivetrain & Gearbox</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center text-gray-700">
                      {v.drivetrain} • {v.transmission}
                    </div>
                  ))}
                </div>

                {/* Fuel Economy */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Fuel Economy</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center text-gray-700">
                      {v.fuelEconomy}
                    </div>
                  ))}
                </div>

                {/* Inspection score */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Inspection Rating</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center text-emerald-700 font-bold">
                      {v.inspectionScore}/150 Certified
                    </div>
                  ))}
                </div>

                {/* Warranty */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-bold text-gray-700">Warranty</div>
                  {compareList.map((v) => (
                    <div key={v.id} className="text-center text-gray-600 text-[11px]">
                      {v.warranty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
