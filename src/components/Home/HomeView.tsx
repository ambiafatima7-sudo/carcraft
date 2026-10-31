import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Car, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Wrench, 
  Calendar, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  Gauge,
  Zap,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';
import { VehicleCard } from '../Vehicles/VehicleCard';

export const HomeView: React.FC = () => {
  const { 
    vehicles, 
    setCurrentPage, 
    setGlobalSearchQuery, 
    setSelectedFilterCondition, 
    setSelectedFilterBodyType,
    openTestDriveModal,
    openServiceBookingModal,
    parts,
    addToCart,
    branches 
  } = useApp();

  // Quick search widget state
  const [quickKeyword, setQuickKeyword] = useState('');
  const [quickCondition, setQuickCondition] = useState('All');
  const [quickBodyStyle, setQuickBodyStyle] = useState('All');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearchQuery(quickKeyword);
    setSelectedFilterCondition(quickCondition);
    setSelectedFilterBodyType(quickBodyStyle);
    setCurrentPage('vehicles');
  };

  const featuredVehicles = vehicles.filter((v) => v.featured || v.price > 90000).slice(0, 3);
  const featuredParts = parts.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#111827] text-white overflow-hidden pt-12 pb-24 border-b border-gray-800">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-black to-slate-900/60 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Automotive Dealership & Inventory Suite
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6">
              Precision Engineering. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-300">
                Uncompromising Luxury.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Browse our certified showroom inventory of luxury, high-performance, and electric vehicles. Schedule private VIP test drives, order genuine OEM parts, and book certified factory workshop services.
            </p>
          </div>

          {/* Quick Search Widget Bar */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-gray-200 text-gray-900">
            <form onSubmit={handleQuickSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Search Model or VIN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={quickKeyword}
                    onChange={(e) => setQuickKeyword(e.target.value)}
                    placeholder="e.g. Porsche 911, M4, Audi..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Condition
                </label>
                <select
                  value={quickCondition}
                  onChange={(e) => setQuickCondition(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="All">All Conditions (New & CPO)</option>
                  <option value="New">Brand New</option>
                  <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              {/* Body Style */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Body Style
                </label>
                <select
                  value={quickBodyStyle}
                  onChange={(e) => setQuickBodyStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="All">All Body Styles</option>
                  <option value="Coupe">Coupe / Sports</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">Luxury SUV</option>
                  <option value="Truck">Electric Truck</option>
                </select>
              </div>

              {/* Search CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Inventory ({vehicles.length})</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800/80 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>150-Point Certified Multipoint Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Complimentary 45-Min Test Drives</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Genuine OEM Replacement Parts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Workshop Bay Status Tracker</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED VEHICLES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              Hand-Selected Flagship Fleet
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Featured Showroom Arrivals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Top tier certified vehicles with complete history reports and factory warranties.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('vehicles')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Inventory ({vehicles.length} Vehicles)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 3. DEALERSHIP TRUST & VALUE PROPOSITION */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              The CarCraft Advantage
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Built on Transparency & Certified Excellence
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Every vehicle and service ticket at CarCraft is managed with real-time dealership tracking and complete customer visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">150-Point Multi-Stage Vetting</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our factory certified technicians test powertrain tolerances, ECU diagnostic fault memories, paint depth, and brake runouts before certifying any car.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">VIP Concierge Test Drives</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Select your preferred showroom branch, pick your vehicle, and reserve an exclusive 45-minute driving slot online with zero pushy sales tactics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Workshop Bay Tracking</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Never wonder what stage your vehicle repair is in. Follow inspection logs, technician work in bay, and road-test sign-offs right from your phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GENUINE OEM PARTS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              Genuine OEM & Performance
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Parts, Accessories & Tuning Store
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track-proven exhaust systems, carbon ceramic brakes, tires, and certified dealership maintenance fluids.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('parts')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore Parts Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredParts.map((part) => (
            <div
              key={part.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div>
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
                <div className="text-[10px] font-mono font-bold text-blue-600">{part.partNumber}</div>
                <h4 className="font-bold text-gray-900 text-xs line-clamp-2 mt-0.5 mb-2">{part.name}</h4>
                <div className="text-xs text-gray-500 mb-2">{part.brand} • {part.inStock} In Stock</div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="font-black text-gray-900 text-base">${part.price.toLocaleString()}</span>
                <button
                  onClick={() => addToCart(part, 1)}
                  className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKSHOP PROMOTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Certified Service Appointment
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Keep Your Vehicle in Peak Track & Highway Condition
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Schedule factory maintenance with complimentary concierge valet, laser 3D alignment, and free loaner vehicles while our master mechanics work on your car.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openServiceBookingModal()}
                className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/40 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Service Now</span>
              </button>
              <button
                onClick={() => setCurrentPage('services')}
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                View Service Packages
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
