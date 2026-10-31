import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  Wrench, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Menu, 
  X, 
  Calendar, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    grantDealershipAuthorization,
    hasDealershipAuthorization,
    isAuthenticated,
    signOut,
    setIsAuthModalOpen,
    wishlist, 
    cart, 
    setIsCartDrawerOpen,
    vehicles,
    openTestDriveModal,
    testDrives,
    serviceAppointments,
    compareList,
    setIsCompareModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeBookingsCount = testDrives.filter(t => t.status === 'Confirmed').length + 
    serviceAppointments.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled').length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'vehicles', label: 'Vehicles', count: vehicles.length },
    { id: 'parts', label: 'Parts & Accessories' },
    { id: 'services', label: 'Services' },
    { id: 'account', label: 'My Account', badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#111827] text-white border-b border-gray-800 shadow-xl backdrop-blur-md">
      {/* Top micro bar: dealership status and signed-in account */}
      <div className="bg-gray-950/80 border-b border-gray-800/80 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-300 font-medium">Showrooms Open Today</span>
            <span className="text-gray-500 hidden sm:inline">• San Francisco & San Jose</span>
          </div>
          <span className="text-gray-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-gray-400">
            Concierge Support: <span className="text-blue-400 font-mono">+1 (555) 800-2277</span>
          </span>
        </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">
                  Signed in as <span className={hasDealershipAuthorization ? 'text-amber-300' : 'text-blue-300'}>
                    {hasDealershipAuthorization ? 'Staff' : 'Customer'}
                  </span>
                </span>
                <button onClick={signOut} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign in
              </button>
            )}
          </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center">
                CARCRAFT<span className="text-blue-500">.</span>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                Automotive & Dealership Suite
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.badge !== undefined && (
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </span>
                </button>
              );
            })}

            {/* Admin Panel Direct Link */}
            <button
              onClick={() => {
                if (!hasDealershipAuthorization) {
                  grantDealershipAuthorization();
                } else {
                  setCurrentPage('admin');
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentPage === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                  : hasDealershipAuthorization
                  ? 'text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                  : 'text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
              {hasDealershipAuthorization && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </nav>

          {/* Action Icons & CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Compare vehicles button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="relative p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
                title={`Compare ${compareList.length} Vehicles`}
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => {
                setCurrentPage('account');
              }}
              className="relative p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
              title={`Wishlist (${wishlist.length})`}
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-gray-300'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
              title={`Shopping Cart (${cartCount})`}
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book Test Drive Shortcut */}
            <button
              onClick={() => openTestDriveModal()}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-102"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Test Drive</span>
            </button>

            {/* User Profile Avatar / Sign In */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
              title="Manage Account"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/50"
              />
              <span className="hidden xl:inline text-xs font-semibold text-gray-200">
                {isAuthenticated ? currentUser.name.split(' ')[0] : 'Sign in'}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                currentPage === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.label}</span>
              {item.count && (
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">{item.count}</span>
              )}
            </button>
          ))}

          <button
            onClick={() => {
              if (!hasDealershipAuthorization) {
                grantDealershipAuthorization();
              } else {
                setCurrentPage('admin');
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-amber-950/40 text-amber-300 border border-amber-600/30"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin ERP Suite (Authorized)</span>
          </button>

          <button
            onClick={() => {
              openTestDriveModal();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 text-center font-bold text-sm bg-blue-600 text-white rounded-xl shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Test Drive
          </button>
        </div>
      )}
    </header>
  );
};
