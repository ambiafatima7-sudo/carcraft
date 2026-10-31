import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceStatus } from '../../types';
import { 
  Users, 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { garage, orders, testDrives } = useApp();

  const customerList = [
    {
      id: 'cust-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      tier: 'Platinum VIP',
      spend: '$184,500',
      vehicles: ['2023 BMW M4 Competition', '2024 Porsche 911 Carrera GTS'],
      totalOrders: orders.length,
      status: 'Active'
    },
    {
      id: 'cust-2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@techventures.io',
      phone: '+1 (555) 441-9922',
      tier: 'Gold Executive',
      spend: '$94,990',
      vehicles: ['2024 Tesla Model S Plaid'],
      totalOrders: 3,
      status: 'Active'
    },
    {
      id: 'cust-3',
      name: 'Jonathan Hayes',
      email: 'j.hayes@hayeslogistics.com',
      phone: '+1 (555) 887-1923',
      tier: 'Platinum VIP',
      spend: '$128,500',
      vehicles: ['2023 Audi RS6 Avant'],
      totalOrders: 6,
      status: 'Active'
    },
    {
      id: 'cust-4',
      name: 'Elena Morales',
      email: 'elena.morales@designco.com',
      phone: '+1 (555) 302-8811',
      tier: 'Silver Member',
      spend: '$89,900',
      vehicles: ['2024 Ford F-150 Lightning'],
      totalOrders: 1,
      status: 'Active'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900">Dealership Customer Relationship Directory</h3>
          <p className="text-xs text-gray-500">Track client vehicle portfolios, order history, and VIP tier statuses.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {customerList.length} Clients
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b">
            <tr>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">VIP Tier</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Registered Vehicles</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {customerList.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-900 text-sm">{c.name}</td>
                <td className="py-3 px-4">
                  <div className="text-gray-800">{c.email}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{c.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3 px-4 font-black text-gray-900">{c.spend}</td>
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    {c.vehicles.map((v, i) => (
                      <span key={i} className="block text-[11px] text-gray-600 font-medium">
                        • {v}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminEmployees: React.FC = () => {
  const { employees } = useApp();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900">Dealership Staff & Service Workshop Roster</h3>
          <p className="text-xs text-gray-500">Sales directors, finance managers, and master-certified mechanics.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {employees.length} Staff Members
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start gap-3">
            <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm truncate">{emp.name}</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  emp.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {emp.status}
                </span>
              </div>
              <div className="text-xs text-blue-600 font-medium">{emp.role}</div>
              <div className="text-[11px] text-gray-500 mt-1">{emp.department} • {emp.email}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Rating: ★ {emp.rating} • {emp.activeAssignments} active tasks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminServices: React.FC = () => {
  const { serviceAppointments, updateServiceStatus, showToast } = useApp();

  const statuses: ServiceStatus[] = [
    'Received',
    'Diagnostic Inspection',
    'Parts & Repair',
    'Quality Check',
    'Ready for Delivery',
    'Completed'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Service Bay Operations & Pipeline Control</h3>
            <p className="text-xs text-gray-500">Progress vehicle work orders through diagnostic, repair, and delivery stages in real-time.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
            {serviceAppointments.length} Active Work Orders
          </span>
        </div>

        <div className="space-y-4">
          {serviceAppointments.map((apt) => (
            <div key={apt.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{apt.appointmentRef}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-bold text-gray-900 text-sm">
                      Bay {apt.bayNumber || 1}: {apt.vehicleDetails.year} {apt.vehicleDetails.make} {apt.vehicleDetails.model}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      [{apt.vehicleDetails.licensePlate}]
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Customer: {apt.customerName} ({apt.customerPhone}) • Assigned: {apt.technicianAssigned}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900">
                    Est: ${apt.totalEstimate.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                    {apt.status} ({apt.progressPercent}%)
                  </span>
                </div>
              </div>

              {/* Status advancement buttons */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Advance Ticket Status Stage:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => updateServiceStatus(apt.id, st)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        apt.status === st
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminReports: React.FC = () => {
  const { vehicles, orders, showToast } = useApp();

  const handleExport = (type: string) => {
    showToast(`CarCraft ERP ${type} generated and exported successfully.`, 'success', 'Export Complete');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h3 className="text-lg font-black text-gray-900">Financial Reports & Performance Analytics</h3>
            <p className="text-xs text-gray-500">Gross margin breakdown, showroom turnover rate, and parts profitability.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('Inventory Valuation PDF')}
              className="py-2 px-3.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> PDF Report
            </button>
            <button
              onClick={() => handleExport('Sales Ledger CSV')}
              className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Report summary grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase block mb-1">Total Showroom Gross</span>
            <div className="text-2xl font-black text-gray-900">$2,890,000</div>
            <span className="text-[10px] text-emerald-600 font-semibold">+18.4% month-over-month</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase block mb-1">Parts & Accessories Revenue</span>
            <div className="text-2xl font-black text-gray-900">$48,250</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Average order: $382.00</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase block mb-1">Workshop Labor & Diagnostics</span>
            <div className="text-2xl font-black text-gray-900">$64,800</div>
            <span className="text-[10px] text-blue-600 font-semibold">94% customer satisfaction index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
