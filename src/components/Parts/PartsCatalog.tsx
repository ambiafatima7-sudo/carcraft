import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Part } from '../../types';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  Tag, 
  Star, 
  Plus, 
  Check, 
  SlidersHorizontal,
  Car,
  X
} from 'lucide-react';

export const PartsCatalog: React.FC = () => {
  const { 
    parts, 
    addToCart, 
    selectedPart, 
    setSelectedPart, 
    garage 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicleFitment, setSelectedVehicleFitment] = useState<string>('All');
  const [oemOnly, setOemOnly] = useState<boolean>(false);

  const categories = [
    'All',
    'Engine & Performance',
    'Brakes & Suspension',
    'Wheels & Tires',
    'Maintenance & Fluids',
    'Exterior Styling',
    'Interior Upgrades',
    'Lighting & Electronics'
  ];

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // Category filter
      if (selectedCategory !== 'All' && part.category !== selectedCategory) {
        return false;
      }

      // OEM only filter
      if (oemOnly && !part.isOem) {
        return false;
      }

      // Vehicle compatibility filter
      if (selectedVehicleFitment !== 'All') {
        const matchesCar = part.compatibility.some((model) =>
          model.toLowerCase().includes(selectedVehicleFitment.toLowerCase())
        );
        if (!matchesCar) return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const pool = `${part.name} ${part.partNumber} ${part.category} ${part.brand} ${part.description}`.toLowerCase();
        if (!pool.includes(query)) return false;
      }

      return true;
    });
  }, [parts, selectedCategory, oemOnly, selectedVehicleFitment, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>CarCraft</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Genuine Parts & Accessories</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Parts & Performance Store
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  {filteredParts.length} Products
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Authentic OEM replacement components, race-proven upgrades, and high-performance automotive accessories with verified vehicle fitment.
              </p>
            </div>

            {/* Garage vehicle fitment selector banner */}
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Vehicle Fitment Checker
                </label>
                <select
                  value={selectedVehicleFitment}
                  onChange={(e) => setSelectedVehicleFitment(e.target.value)}
                  className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="All">All Vehicles (Universal & Model Specific)</option>
                  {garage.map((car) => (
                    <option key={car.id} value={car.model}>
                      Fit for My {car.year} {car.make} {car.model}
                    </option>
                  ))}
                  <option value="Porsche 911">Porsche 911 (2020-2025)</option>
                  <option value="BMW M4">BMW M4 Competition</option>
                  <option value="Audi RS6">Audi RS6 Avant</option>
                  <option value="Tesla Model S">Tesla Model S</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search, OEM Toggle & Category Pills */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search part name, OEM part #, brand..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 bg-gray-50"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* OEM toggle */}
            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={oemOnly}
                onChange={(e) => setOemOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-gray-700">OEM Certified Only</span>
            </label>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredParts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No parts found</h3>
            <p className="text-xs text-gray-500 mb-4">
              Try selecting a different category or clearing the vehicle fitment filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedVehicleFitment('All');
                setSearchQuery('');
                setOemOnly(false);
              }}
              className="py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredParts.map((part) => {
              const matchesSelectedFitment = 
                selectedVehicleFitment !== 'All' && 
                part.compatibility.some((m) => m.toLowerCase().includes(selectedVehicleFitment.toLowerCase()));

              return (
                <div
                  key={part.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image & Badges */}
                    <div 
                      onClick={() => setSelectedPart(part)}
                      className="relative h-44 bg-gray-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={part.image}
                        alt={part.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {part.isOem ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                            OEM Genuine
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-900 text-white shadow-xs">
                            Performance
                          </span>
                        )}
                        {matchesSelectedFitment && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3" /> Guaranteed Fit
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[10px] font-bold">
                        {part.inStock} in Stock
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="text-[10px] font-mono font-bold text-gray-400 mb-0.5">
                        {part.partNumber}
                      </div>
                      <h4 
                        onClick={() => setSelectedPart(part)}
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
                      >
                        {part.name}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-3">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{part.rating}</span>
                        <span className="text-gray-400 font-normal">({part.reviewCount})</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 font-medium text-[11px] truncate">{part.brand}</span>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">
                        {part.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-lg font-black text-gray-900">
                        ${part.price.toLocaleString()}
                      </div>
                      {part.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          ${part.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(part, 1)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export const PartDetailModal: React.FC = () => {
  const { selectedPart, setSelectedPart, addToCart } = useApp();
  const [qty, setQty] = useState(1);

  if (!selectedPart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedPart(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 hover:bg-white text-gray-700 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left photo */}
          <div className="h-64 sm:h-auto bg-gray-900 relative">
            <img
              src={selectedPart.image}
              alt={selectedPart.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-md">
                {selectedPart.isOem ? 'OEM Genuine Spec' : 'Aftermarket Performance'}
              </span>
            </div>
          </div>

          {/* Right Info */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600">
                {selectedPart.partNumber}
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-snug mt-1 mb-2">
                {selectedPart.name}
              </h3>
              
              <div className="flex items-center gap-2 text-xs mb-3">
                <span className="font-bold text-gray-900">Brand: {selectedPart.brand}</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-semibold">{selectedPart.inStock} In Stock</span>
              </div>

              <div className="text-2xl font-black text-gray-900 mb-4">
                ${selectedPart.price.toLocaleString()}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {selectedPart.description}
              </p>

              {/* Vehicle Compatibility list */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs mb-4">
                <div className="font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Verified Compatible With:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedPart.compatibility.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <div>• Installation: <span className="font-semibold text-gray-800">{selectedPart.installationDifficulty}</span></div>
                <div>• Warranty: <span className="font-semibold text-gray-800">{selectedPart.warranty}</span></div>
              </div>
            </div>

            {/* Quantity and Add to cart */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-gray-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedPart, qty);
                  setSelectedPart(null);
                }}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
