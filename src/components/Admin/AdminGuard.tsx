import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Car, Lock, ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { hasDealershipAuthorization, grantDealershipAuthorization, setCurrentPage } = useApp();

  if (!hasDealershipAuthorization) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Staff account required
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Admin Panel Access</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Sign in with an account that has been granted dealership staff permissions. Customer accounts cannot authorize themselves.
          </p>
          <div className="space-y-3">
            <button
              onClick={grantDealershipAuthorization}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Sign in with staff account</span>
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Return to showroom</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
