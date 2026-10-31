import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Car, Lock, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, signUp, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await signIn(email, password);
      } else {
        await signUp({ name, email, password, phone });
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Authentication failed. Please try again.', 'error', 'Sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 text-white p-6 relative">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/10"
            aria-label="Close sign-in dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
            <Car className="w-4 h-4" /> CarCraft Dealership Suite
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {tab === 'login' ? 'Sign in to your account' : 'Create a customer account'}
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Customer accounts are self-registered. Staff access is assigned by a dealership administrator.
          </p>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              tab === 'login' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${
              tab === 'register' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-xs font-semibold text-gray-700 mb-1">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
              <div>
                <label htmlFor="auth-phone" className="block text-xs font-semibold text-gray-700 mb-1">Phone (optional)</label>
                <input
                  id="auth-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                type="password"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
            {tab === 'register' && <p className="mt-1 text-[11px] text-gray-500">Use at least 8 characters.</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-gray-500">
            {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button type="button" onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="text-blue-600 font-semibold hover:underline">
              {tab === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
