/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/Home/HomeView';
import { BrowseVehiclesView } from './components/Vehicles/BrowseVehiclesView';
import { VehicleDetailModal } from './components/Vehicles/VehicleDetailModal';
import { VehicleCompareModal } from './components/Vehicles/VehicleCompareModal';
import { TestDriveModal } from './components/Vehicles/TestDriveModal';
import { PartsCatalog, PartDetailModal } from './components/Parts/PartsCatalog';
import { CartDrawer } from './components/Parts/CartDrawer';
import { ServiceCatalog } from './components/Services/ServiceCatalog';
import { ServiceBookingModal } from './components/Services/ServiceBookingModal';
import { MyAccountView } from './components/Account/MyAccountView';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AuthModal } from './components/Auth/AuthModal';
import { ToastContainer } from './components/Common/Toast';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with live role switcher and badges */}
      <Navbar />

      {/* Main Page Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'vehicles' && <BrowseVehiclesView />}
        {currentPage === 'parts' && <PartsCatalog />}
        {currentPage === 'services' && <ServiceCatalog />}
        {currentPage === 'account' && <MyAccountView />}
        {currentPage === 'admin' && <AdminLayout />}
      </main>

      {/* Global Modals, Drawers & Overlays */}
      <VehicleDetailModal />
      <VehicleCompareModal />
      <TestDriveModal />
      <ServiceBookingModal />
      <PartDetailModal />
      <CartDrawer />
      <AuthModal />
      <ToastContainer />

      {/* Dealership Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
