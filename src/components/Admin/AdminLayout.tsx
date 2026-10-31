import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminGuard } from './AdminGuard';
import { AdminDashboard, AdminSales } from './AdminDashboard';
import { AdminInventory } from './AdminInventory';
import { AdminCustomers, AdminEmployees, AdminServices, AdminReports } from './AdminModules';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Car, 
  DollarSign, 
  Users, 
  Briefcase, 
  Wrench, 
  FileBarChart, 
  ExternalLink,
  ChevronRight,
  MapPin
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, branches, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'inventory' | 'sales' | 'customers' | 'employees' | 'services' | 'reports'
  >('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory CRUD', icon: Car },
    { id: 'sales', label: 'Sales & Test Drives', icon: DollarSign },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'employees', label: 'Staff Roster', icon: Briefcase },
    { id: 'services', label: 'Workshop Bays', icon: Wrench },
    { id: 'reports', label: 'Reports & Export', icon: FileBarChart },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Admin Header Banner */}
          <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 text-white p-6 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Dealership Management & ERP Suite
                    </h1>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Dealership Authorization: ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Authorized Clearance: <strong>{currentUser.name}</strong> (General Manager) • Token <span className="font-mono text-amber-400">#CC-AUTH-882-VERIFIED</span> • Metro Flagship Center
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>View Customer Showroom</span>
                </button>
              </div>
            </div>

            {/* Sub navigation bar */}
            <div className="flex gap-1.5 overflow-x-auto pt-6 border-t border-gray-800/80 mt-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Sub-View */}
          <div>
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'inventory' && <AdminInventory />}
            {activeTab === 'sales' && <AdminSales />}
            {activeTab === 'customers' && <AdminCustomers />}
            {activeTab === 'employees' && <AdminEmployees />}
            {activeTab === 'services' && <AdminServices />}
            {activeTab === 'reports' && <AdminReports />}
          </div>

        </div>
      </div>
    </AdminGuard>
  );
};
