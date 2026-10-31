import React from 'react';
import { 
  Search, 
  RotateCcw, 
  DollarSign, 
  Gauge, 
  Palette, 
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export interface VehicleFilterState {
  searchQuery: string;
  condition: string;
  bodyStyle: string;
  minPrice: number;
  maxPrice: number;
  maxMileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  sortBy: string;
}

interface VehicleFilterSidebarProps {
  filters: VehicleFilterState;
  setFilters: React.Dispatch<React.SetStateAction<VehicleFilterState>>;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const VehicleFilterSidebar: React.FC<VehicleFilterSidebarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onReset,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const bodyStyles = ['All', 'SUV', 'Sedan', 'Coupe', 'Truck', 'Sports'];
  const conditions = ['All', 'New', 'Certified Pre-Owned', 'Used'];
  const colors = [
    { label: 'All', hex: 'transparent' },
    { label: 'White', hex: '#FFFFFF', border: true },
    { label: 'Grey', hex: '#6B7280' },
    { label: 'Green', hex: '#047857' },
    { label: 'Silver', hex: '#9CA3AF' },
    { label: 'Blue', hex: '#1D4ED8' },
    { label: 'Red', hex: '#DC2626' }
  ];
  const mileageOptions = [
    { label: 'Any Mileage', value: 200000 },
    { label: 'Under 10,000 mi', value: 10000 },
    { label: 'Under 25,000 mi', value: 25000 },
    { label: 'Under 50,000 mi', value: 50000 }
  ];
  const fuelTypes = ['All', 'Gasoline', 'Electric', 'Hybrid'];
  const transmissions = ['All', 'Dual-Clutch', 'Automatic', 'Single-Speed'];

  // Count active non-default filters
  const activeFiltersCount = 
    (filters.searchQuery ? 1 : 0) +
    (filters.condition !== 'All' ? 1 : 0) +
    (filters.bodyStyle !== 'All' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 200000 ? 1 : 0) +
    (filters.maxMileage < 200000 ? 1 : 0) +
    (filters.color !== 'All' ? 1 : 0) +
    (filters.fuelType !== 'All' ? 1 : 0) +
    (filters.transmission !== 'All' ? 1 : 0);

  const content = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm tracking-tight">Filter Showroom</h3>
          {activeFiltersCount > 0 && (
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Keywords Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="e.g. Porsche, M4, 2024, Plaid..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Vehicle Condition */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {conditions.map((cond) => (
            <button
              key={cond}
              onClick={() => setFilters((prev) => ({ ...prev, condition: cond }))}
              className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                filters.condition === cond
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Price Range
          </label>
          <span className="text-xs font-bold text-blue-700">
            ${filters.minPrice.toLocaleString()} - ${filters.maxPrice >= 200000 ? '200k+' : `$${filters.maxPrice.toLocaleString()}`}
          </span>
        </div>
        
        {/* Dual slider simulation */}
        <input
          type="range"
          min="40000"
          max="200000"
          step="5000"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
        />

        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 relative">
            <span className="text-gray-400 text-xs absolute left-2.5 top-2">$</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
              className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-blue-600"
              placeholder="Min"
            />
          </div>
          <span className="text-gray-400 text-xs">to</span>
          <div className="flex-1 relative">
            <span className="text-gray-400 text-xs absolute left-2.5 top-2">$</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-blue-600"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Body Style */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Body Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {bodyStyles.map((style) => (
            <button
              key={style}
              onClick={() => setFilters((prev) => ({ ...prev, bodyStyle: style }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filters.bodyStyle === style
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Maximum Mileage */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Maximum Mileage
        </label>
        <select
          value={filters.maxMileage}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxMileage: Number(e.target.value) }))}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-white text-gray-700"
        >
          {mileageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Exterior Color */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Exterior Color
          </label>
          <span className="text-xs text-gray-500 font-medium">{filters.color}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {colors.map((c) => {
            const isSelected = filters.color === c.label;
            if (c.label === 'All') {
              return (
                <button
                  key={c.label}
                  onClick={() => setFilters((prev) => ({ ...prev, color: 'All' }))}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Colors
                </button>
              );
            }

            return (
              <button
                key={c.label}
                onClick={() => setFilters((prev) => ({ ...prev, color: c.label }))}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  c.border ? 'border border-gray-300' : ''
                } ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              >
                {isSelected && (
                  <Check className={`w-3.5 h-3.5 ${c.label === 'White' ? 'text-gray-900' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Fuel & Powertrain
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel}
              onClick={() => setFilters((prev) => ({ ...prev, fuelType: fuel }))}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                filters.fuelType === fuel
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
          Transmission
        </label>
        <select
          value={filters.transmission}
          onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-white text-gray-700"
        >
          {transmissions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Summary */}
      <div className="pt-4 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredCount}</span> of {totalCount} vehicles in stock
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm self-start sticky top-24">
        {content}
      </div>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-80 max-w-full bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 mb-3 border-b">
                <span className="font-bold text-base text-gray-900">Filters</span>
                <button
                  onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6">
              <button
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md"
              >
                Apply Filters ({filteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
