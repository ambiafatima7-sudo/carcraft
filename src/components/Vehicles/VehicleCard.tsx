import React from 'react';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Gauge, 
  Zap, 
  Fuel, 
  ShieldCheck, 
  Heart, 
  Layers, 
  Calendar, 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, viewMode = 'grid' }) => {
  const { 
    setSelectedVehicle, 
    wishlist, 
    toggleWishlist, 
    compareList, 
    addToCompare, 
    removeFromCompare,
    openTestDriveModal 
  } = useApp();

  const isFavorited = wishlist.includes(vehicle.id);
  const isInCompare = compareList.some((v) => v.id === vehicle.id);

  const conditionColors = {
    'New': 'bg-emerald-600 text-white',
    'Certified Pre-Owned': 'bg-blue-600 text-white',
    'Used': 'bg-gray-800 text-gray-200'
  };

  const statusColors = {
    'In Stock': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Reserved': 'bg-amber-50 text-amber-700 border-amber-200',
    'In Service': 'bg-blue-50 text-blue-700 border-blue-200',
    'Sold': 'bg-rose-50 text-rose-700 border-rose-200'
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
        {/* Image & Badges */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${conditionColors[vehicle.condition]}`}>
              {vehicle.condition}
            </span>
            {vehicle.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(vehicle.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 shadow-md transition-colors"
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-600 fill-rose-600' : ''}`} />
          </button>

          <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate max-w-[220px]">{vehicle.location.split('&')[0]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {vehicle.stockId} • VIN: ...{vehicle.vin.slice(-6)}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[vehicle.status]}`}>
                {vehicle.status}
              </span>
            </div>

            <h3 
              onClick={() => setSelectedVehicle(vehicle)}
              className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
            >
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">{vehicle.trim}</p>

            {/* Spec Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-gray-400" />
                <span>{vehicle.mileage.toLocaleString()} miles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{vehicle.horsepower} HP ({vehicle.acceleration})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-blue-500" />
                <span>{vehicle.fuelType} • {vehicle.drivetrain}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>150-Pt Inspected</span>
              </div>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.msrp && vehicle.msrp > vehicle.price && (
                  <span className="text-xs text-gray-400 line-through">
                    MSRP ${vehicle.msrp.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-600 font-semibold">
                Est. ${vehicle.monthlyEstimate}/mo with 10% down
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => isInCompare ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isInCompare
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
                title="Compare Vehicle"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">{isInCompare ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                onClick={() => openTestDriveModal(vehicle)}
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Test Drive</span>
              </button>

              <button
                onClick={() => setSelectedVehicle(vehicle)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Thumbnail & Badges */}
      <div 
        className="relative h-52 bg-gray-900 overflow-hidden cursor-pointer"
        onClick={() => setSelectedVehicle(vehicle)}
      >
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${conditionColors[vehicle.condition]}`}>
            {vehicle.condition}
          </span>
          {vehicle.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(vehicle.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 shadow-md transition-colors"
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-600 fill-rose-600' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            {vehicle.mileage.toLocaleString()} mi
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[vehicle.status]}`}>
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
            {vehicle.stockId}
          </div>
          
          <h3 
            onClick={() => setSelectedVehicle(vehicle)}
            className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-1">{vehicle.trim}</p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{vehicle.horsepower} HP • {vehicle.acceleration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{vehicle.drivetrain} • {vehicle.transmission.split('-')[0]}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                ${vehicle.price.toLocaleString()}
              </span>
              <div className="text-[11px] text-emerald-600 font-semibold">
                Est. ${vehicle.monthlyEstimate}/mo
              </div>
            </div>

            <button
              onClick={() => isInCompare ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isInCompare
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Add to Compare"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openTestDriveModal(vehicle)}
              className="py-2.5 px-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Drive</span>
            </button>

            <button
              onClick={() => setSelectedVehicle(vehicle)}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
