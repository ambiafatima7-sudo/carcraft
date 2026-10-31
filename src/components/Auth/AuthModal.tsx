import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, UserCheck, KeyRound, ArrowRight, Car, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, switchUserRole, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>('customer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      // If role matches admin or email has dealer domain
      if (selectedRole === 'admin' || email.includes('carcraft-dealers.com')) {
        switchUserRole('admin');
      } else {
        switchUserRole('customer');
      }
      setIsAuthModalOpen(false);
    } else {
      switchUserRole(selectedRole);
      showToast(`Account registered as ${name || 'User'} (${selectedRole})`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header styling */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
            <Car className="w-4 h-4" /> CarCraft Dealership Suite
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {tab === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Access certified vehicles, scheduled services, or dealership management tools.
          </p>

          {/* Quick Demo Switcher Banner */}
          <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/15 backdrop-blur-md">
            <div className="text-xs font-semibold text-gray-200 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>One-Click Role Demonstration:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchUserRole('customer');
                  setIsAuthModalOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'customer'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Customer: Alex R.
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUserRole('admin');
                  setIsAuthModalOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin: Marcus V. (GM)
              </button>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role selector for registration/login */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Select Role & Access Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'customer'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Customer
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Browse cars, book test drives, order parts & track workshop repairs.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Dealership Admin
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Full ERP Suite: Inventory CRUD, leads, service bays, employees & reports.
                </p>
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'admin' ? 'marcus.vance@carcraft-dealers.com' : 'alex.rivera@example.com'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              {tab === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to demo email', 'info')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{tab === 'login' ? `Sign In as ${selectedRole === 'admin' ? 'Dealership Admin' : 'Customer'}` : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              {tab === 'login' ? "Don't have an account? " : "Already registered? "}
              <button
                type="button"
                onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                {tab === 'login' ? 'Register here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
