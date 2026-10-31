import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Car, 
  TrendingUp, 
  Wrench, 
  Users, 
  Calendar, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { vehicles, testDrives, serviceAppointments, orders } = useApp();

  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price, 0);
  const activeStockCount = vehicles.filter(v => v.status === 'In Stock').length;
  const reservedCount = vehicles.filter(v => v.status === 'Reserved').length;
  const partsRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Monthly sales bar chart data mock
  const monthlySales = [
    { month: 'May', count: 18, volume: 1650 },
    { month: 'Jun', count: 22, volume: 1980 },
    { month: 'Jul', count: 25, volume: 2240 },
    { month: 'Aug', count: 21, volume: 1890 },
    { month: 'Sep', count: 28, volume: 2480 },
    { month: 'Oct', count: 32, volume: 2890 }
  ];

  return (
    <div className="space-y-6">
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Showroom Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Inventory Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              ${(totalInventoryValue / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{activeStockCount} In Stock • {reservedCount} Reserved</span>
            </div>
          </div>
        </div>

        {/* Monthly Vehicles Sold */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Monthly Dealership Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              $2,890,000
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs previous month</span>
            </div>
          </div>
        </div>

        {/* Active Test Drives */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Test Drive Pipeline
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {testDrives.length} Bookings
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <span>92% conversion to sales quote</span>
            </div>
          </div>
        </div>

        {/* Workshop Service Bays */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Workshop Bays
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {serviceAppointments.length} Active Tickets
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1">
              <span>Bays operating at 90% capacity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Sales Chart & Workshop Bay Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Performance Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Vehicle Sales & Gross Revenue</h3>
              <p className="text-xs text-gray-500">Monthly delivery volume (May - Oct 2026)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Record Quarter
            </span>
          </div>

          {/* Interactive Bar representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-gray-100">
            {monthlySales.map((item) => {
              const heightPercent = (item.volume / 3000) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(item.volume / 1000).toFixed(2)}M
                  </div>
                  <div 
                    className="w-full bg-blue-600 group-hover:bg-blue-700 rounded-t-lg transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-gray-700">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs text-gray-600">
            <div>
              <span className="block text-gray-400 font-medium">Top Margin Brand</span>
              <strong className="text-gray-900 font-bold">Porsche (34%)</strong>
            </div>
            <div className="border-x border-gray-100">
              <span className="block text-gray-400 font-medium">Avg. Days in Inventory</span>
              <strong className="text-gray-900 font-bold">14.2 Days</strong>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Parts Store GMV</span>
              <strong className="text-gray-900 font-bold">${partsRevenue.toFixed(0)}</strong>
            </div>
          </div>
        </div>

        {/* Live Workshop Bays & Alerts (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                Service Bay Queue
              </h3>
              <span className="text-[10px] font-mono text-gray-400">Live</span>
            </div>

            <div className="space-y-3">
              {serviceAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-900">
                      Bay {apt.bayNumber || 1} • {apt.vehicleDetails.make} {apt.vehicleDetails.model}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600">{apt.status}</span>
                  </div>
                  <div className="text-gray-500 text-[11px] truncate">
                    {apt.technicianAssigned}
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${apt.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            Master Technicians on Duty: <strong className="text-gray-900 font-bold">4 Mechanics</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSales: React.FC = () => {
  const { testDrives, cancelTestDrive, showToast } = useApp();

  const handleApprove = (bookingRef: string) => {
    showToast(`Test drive ${bookingRef} assigned to Senior Sales Specialist with VIP demo route.`, 'success', 'Lead Assigned');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Test Drive Bookings & Sales Inquiries</h3>
            <p className="text-xs text-gray-500">Review prospective client bookings, verify credentials, and dispatch vehicles.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            {testDrives.length} Inquiries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b">
              <tr>
                <th className="py-3 px-4">Ref & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Vehicle Requested</th>
                <th className="py-3 px-4">Driver License</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {testDrives.map((td) => (
                <tr key={td.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-blue-600">{td.bookingRef}</div>
                    <div className="text-[10px] text-gray-400">{td.date} • {td.timeSlot}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{td.customerName}</div>
                    <div className="text-[10px] text-gray-400">{td.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{td.vehicleName}</div>
                    <div className="text-[10px] text-gray-500">Stock: {td.vehicleStockId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-gray-800">
                    {td.licenseNumber}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-gray-500 truncate max-w-[150px]">
                    {td.branch}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      td.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {td.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleApprove(td.bookingRef)}
                        className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold"
                      >
                        Assign Advisor
                      </button>
                      <button
                        onClick={() => cancelTestDrive(td.id)}
                        className="py-1 px-2 rounded-lg text-gray-400 hover:text-rose-600 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
