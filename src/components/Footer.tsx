import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  Wrench, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, branches } = useApp();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">150-Point Inspection</div>
              <div className="text-xs text-gray-500">Every certified vehicle rigorously vetted</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Factory Warranty Backed</div>
              <div className="text-xs text-gray-500">Up to 5 years comprehensive coverage</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Certified Technicians</div>
              <div className="text-xs text-gray-500">Master-trained automotive mechanics</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Instant Online Booking</div>
              <div className="text-xs text-gray-500">Test drives & bay slots confirmed live</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Showroom Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-black tracking-tight text-white">
                CARCRAFT<span className="text-blue-500">.</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The premier automotive inventory and dealership management suite. Offering certified luxury, sports, electric, and commercial vehicles with authentic OEM parts and certified workshop maintenance.
            </p>
            <div className="pt-2 text-xs text-gray-500">
              Corporate Headquarters: 1000 Grand Boulevard, Auto District, CA
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Dealership Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => setCurrentPage('vehicles')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Browse Showroom
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('parts')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Genuine OEM Parts
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('services')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Service Appointment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('account')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> My Customer Garage
                </button>
              </li>
            </ul>
          </div>

          {/* Admin ERP Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Management Suite
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Executive Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Inventory CRUD
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Sales & Test Drive Queue
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> Workshop Bay Scheduling
                </button>
              </li>
            </ul>
          </div>

          {/* Dealership Locations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Showroom Locations
            </h4>
            <div className="space-y-3 text-xs">
              {branches.slice(0, 2).map((b) => (
                <div key={b.id} className="border-l-2 border-blue-600 pl-3">
                  <div className="font-semibold text-gray-200">{b.name}</div>
                  <div className="text-gray-500 mt-0.5">{b.address}, {b.city}</div>
                  <div className="text-blue-400 font-mono mt-0.5">{b.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} CarCraft Automotive Group. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Vehicle Licensing & Disclosures</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
