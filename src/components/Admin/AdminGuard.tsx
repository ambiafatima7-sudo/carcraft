import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, UserCheck, Car, Key, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { currentUser, grantDealershipAuthorization, setCurrentPage, setIsAuthModalOpen } = useApp();
  const [securityKey, setSecurityKey] = useState('CARCRAFT-GM-2026');

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Dealership Authorization Required
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            Admin Panel Access
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            You are currently viewing as <strong className="text-gray-800">{currentUser.name}</strong>. Grant dealership administrative authorization to access full ERP inventory management, sales leads, service bays, and financial reports.
          </p>

          {/* Quick Authorization Action Box */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 mb-5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
              <Key className="w-4 h-4 text-amber-600" />
              <span>Dealership Executive Clearance:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={securityKey}
                className="w-full bg-white px-3 py-2 rounded-xl border border-amber-200 text-xs font-mono font-bold text-gray-800 tracking-wider text-center"
              />
            </div>
            <p className="text-[10px] text-amber-700/80 mt-1.5 text-center">
              Master Dealership Key Pre-validated for instant authorization
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={grantDealershipAuthorization}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:bg-amber-800 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Grant Dealership Authorization Now</span>
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Return to Customer Showroom</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
