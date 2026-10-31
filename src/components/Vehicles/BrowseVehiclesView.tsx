import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import { VehicleFilterSidebar, VehicleFilterState } from './VehicleFilterSidebar';
import { 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Car, 
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

export const BrowseVehiclesView: React.FC = () => {
  const { 
    vehicles, 
    globalSearchQuery, 
    setGlobalSearchQuery,
    selectedFilterCondition,
    setSelectedFilterCondition,
    selectedFilterBodyType,
    setSelectedFilterBodyType
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<VehicleFilterState>({
    searchQuery: globalSearchQuery || '',
    condition: selectedFilterCondition || 'All',
    bodyStyle: selectedFilterBodyType || 'All',
    minPrice: 0,
    maxPrice: 200000,
    maxMileage: 200000,
    color: 'All',
    fuelType: 'All',
    transmission: 'All',
    drivetrain: 'All',
    sortBy: 'featured'
  });

  // Sync if global search or home filter updated
  useEffect(() => {
    if (globalSearchQuery) {
      setFilters((prev) => ({ ...prev, searchQuery: globalSearchQuery }));
    }
  }, [globalSearchQuery]);

  useEffect(() => {
    if (selectedFilterCondition) {
      setFilters((prev) => ({ ...prev, condition: selectedFilterCondition }));
    }
  }, [selectedFilterCondition]);

  useEffect(() => {
    if (selectedFilterBodyType) {
      setFilters((prev) => ({ ...prev, bodyStyle: selectedFilterBodyType }));
    }
  }, [selectedFilterBodyType]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      condition: 'All',
      bodyStyle: 'All',
      minPrice: 0,
      maxPrice: 200000,
      maxMileage: 200000,
      color: 'All',
      fuelType: 'All',
      transmission: 'All',
      drivetrain: 'All',
      sortBy: 'featured'
    });
    setGlobalSearchQuery('');
    setSelectedFilterCondition('All');
    setSelectedFilterBodyType('All');
  };

  // Real-time dynamic filtering logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Keyword search: matches make, model, year, trim, engine, vin, stockId
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const searchPool = `${v.make} ${v.model} ${v.year} ${v.trim} ${v.engine} ${v.stockId} ${v.vin}`.toLowerCase();
        if (!searchPool.includes(query)) return false;
      }

      // Condition
      if (filters.condition !== 'All' && v.condition !== filters.condition) {
        return false;
      }

      // Body Style
      if (filters.bodyStyle !== 'All') {
        if (filters.bodyStyle === 'Sports' && v.bodyType !== 'Sports' && v.bodyType !== 'Coupe') {
          return false;
        } else if (filters.bodyStyle !== 'Sports' && v.bodyType !== filters.bodyStyle) {
          return false;
        }
      }

      // Price Range
      if (v.price < filters.minPrice) return false;
      if (filters.maxPrice < 200000 && v.price > filters.maxPrice) return false;

      // Mileage
      if (v.mileage > filters.maxMileage) return false;

      // Exterior Color
      if (filters.color !== 'All') {
        const colorLower = filters.color.toLowerCase();
        if (!v.exteriorColor.toLowerCase().includes(colorLower)) {
          return false;
        }
      }

      // Fuel Type
      if (filters.fuelType !== 'All' && v.fuelType !== filters.fuelType) {
        return false;
      }

      // Transmission
      if (filters.transmission !== 'All' && !v.transmission.includes(filters.transmission)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'mileage-low') return a.mileage - b.mileage;
      if (filters.sortBy === 'year-new') return b.year - a.year;
      if (filters.sortBy === 'hp-high') return b.horsepower - a.horsepower;
      // Default: featured first, then price high
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.price - a.price;
    });
  }, [vehicles, filters]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>CarCraft</span>
            <span>/</span>
            <span>Vehicles</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Browse Showroom</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Showroom Inventory
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  {filteredVehicles.length} Available
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Explore our certified fleet of luxury, performance, and electric vehicles with verified CARFAX and inspection records.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden py-2.5 px-4 rounded-xl bg-white border border-gray-300 font-bold text-xs text-gray-800 flex items-center justify-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters & Search</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          
          {/* Left Filter Sidebar Component */}
          <VehicleFilterSidebar
            filters={filters}
            setFilters={setFilters}
            totalCount={vehicles.length}
            filteredCount={filteredVehicles.length}
            onReset={handleResetFilters}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
          />

          {/* Right Main Grid */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              
              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
                  Active:
                </span>
                {filters.condition !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    {filters.condition}
                    <button onClick={() => setFilters(f => ({ ...f, condition: 'All' }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.bodyStyle !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    {filters.bodyStyle}
                    <button onClick={() => setFilters(f => ({ ...f, bodyStyle: 'All' }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.color !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    Color: {filters.color}
                    <button onClick={() => setFilters(f => ({ ...f, color: 'All' }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    "{filters.searchQuery}"
                    <button onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 200000) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
                    <button onClick={() => setFilters(f => ({ ...f, minPrice: 0, maxPrice: 200000 }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>

              {/* Sort & View Mode Switcher */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline font-semibold">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 bg-gray-50 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="mileage-low">Lowest Mileage</option>
                    <option value="year-new">Newest Year</option>
                    <option value="hp-high">Highest Horsepower</option>
                  </select>
                </div>

                {/* View toggles */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicles Results */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Matching Vehicles Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any vehicles matching your current search parameters. Try expanding your price range, clearing keywords, or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }>
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
