import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, VehicleCondition, BodyType, FuelType, Transmission, DriveType, VehicleStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Car, 
  DollarSign, 
  Gauge, 
  ShieldCheck, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, setSelectedVehicle } = useApp();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formMake, setFormMake] = useState('BMW');
  const [formModel, setFormModel] = useState('M2 Coupe');
  const [formYear, setFormYear] = useState(2024);
  const [formTrim, setFormTrim] = useState('6-Speed Manual M Driver Pack');
  const [formCondition, setFormCondition] = useState<VehicleCondition>('New');
  const [formBodyType, setFormBodyType] = useState<BodyType>('Coupe');
  const [formPrice, setFormPrice] = useState(68900);
  const [formMileage, setFormMileage] = useState(30);
  const [formHorsepower, setFormHorsepower] = useState(453);
  const [formAcceleration, setFormAcceleration] = useState('3.9s 0-60 mph');
  const [formFuelType, setFormFuelType] = useState<FuelType>('Gasoline');
  const [formTransmission, setFormTransmission] = useState<Transmission>('Manual');
  const [formDrivetrain, setFormDrivetrain] = useState<DriveType>('RWD');
  const [formStatus, setFormStatus] = useState<VehicleStatus>('In Stock');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80');
  const [formVin, setFormVin] = useState('WBS13AY08P123998');
  const [formStockId, setFormStockId] = useState('CC-2024-M2C');
  const [formExtColor, setFormExtColor] = useState('Zandvoort Blue');
  const [formIntColor, setFormIntColor] = useState('Black Vernasca Leather');

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const pool = `${v.make} ${v.model} ${v.stockId} ${v.vin} ${v.year}`.toLowerCase();
      if (!pool.includes(q)) return false;
    }
    return true;
  });

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormMake(vehicle.make);
    setFormModel(vehicle.model);
    setFormYear(vehicle.year);
    setFormTrim(vehicle.trim);
    setFormCondition(vehicle.condition);
    setFormBodyType(vehicle.bodyType);
    setFormPrice(vehicle.price);
    setFormMileage(vehicle.mileage);
    setFormHorsepower(vehicle.horsepower);
    setFormAcceleration(vehicle.acceleration);
    setFormFuelType(vehicle.fuelType);
    setFormTransmission(vehicle.transmission);
    setFormDrivetrain(vehicle.drivetrain);
    setFormStatus(vehicle.status);
    setFormImage(vehicle.images[0]);
    setFormVin(vehicle.vin);
    setFormStockId(vehicle.stockId);
    setFormExtColor(vehicle.exteriorColor);
    setFormIntColor(vehicle.interiorColor);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        make: formMake,
        model: formModel,
        year: formYear,
        trim: formTrim,
        condition: formCondition,
        bodyType: formBodyType,
        price: formPrice,
        monthlyEstimate: Math.round(formPrice / 60 * 1.05),
        mileage: formMileage,
        horsepower: formHorsepower,
        acceleration: formAcceleration,
        fuelType: formFuelType,
        transmission: formTransmission,
        drivetrain: formDrivetrain,
        status: formStatus,
        images: [formImage, ...editingVehicle.images.slice(1)],
        vin: formVin,
        stockId: formStockId,
        exteriorColor: formExtColor,
        interiorColor: formIntColor
      });
      setEditingVehicle(null);
    } else {
      addVehicle({
        vin: formVin,
        stockId: formStockId,
        make: formMake,
        model: formModel,
        year: formYear,
        trim: formTrim,
        condition: formCondition,
        bodyType: formBodyType,
        price: formPrice,
        msrp: formPrice + 4500,
        monthlyEstimate: Math.round(formPrice / 60 * 1.05),
        mileage: formMileage,
        exteriorColor: formExtColor,
        interiorColor: formIntColor,
        fuelType: formFuelType,
        transmission: formTransmission,
        drivetrain: formDrivetrain,
        engine: '3.0L TwinPower Turbocharged',
        horsepower: formHorsepower,
        torque: '406 lb-ft',
        acceleration: formAcceleration,
        fuelEconomy: '19 City / 26 Hwy',
        images: [formImage],
        features: [
          'Adaptive M Suspension',
          'M Compound Brakes with Red Calipers',
          'Harman Kardon Premium Sound',
          'Heated Sport Seats'
        ],
        status: formStatus,
        location: 'CarCraft Metro Flagship & Service Center',
        warranty: '4 Years / 50,000 Miles Factory Warranty',
        carfaxClean: true,
        ownersCount: 1,
        serviceRecordsCount: 1,
        inspectionScore: 150,
        featured: false
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search VIN, Stock ID, Model..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-blue-600 bg-gray-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs">
            {['All', 'In Stock', 'Reserved', 'In Service', 'Sold'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`py-1.5 px-3 rounded-lg font-semibold transition-colors ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setIsAddModalOpen(true);
          }}
          className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle to Inventory</span>
        </button>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Stock ID & VIN</th>
                <th className="py-3 px-4">Specs & Drivetrain</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Mileage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.images[0]}
                        alt={v.model}
                        className="w-14 h-11 object-cover rounded-lg border border-gray-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">
                          {v.year} {v.make} {v.model}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[200px]">{v.trim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-blue-600">{v.stockId}</div>
                    <div className="text-[10px] text-gray-400">{v.vin}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-800">{v.horsepower} HP • {v.drivetrain}</div>
                    <div className="text-[10px] text-gray-500">{v.fuelType} • {v.bodyType}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-gray-900 text-sm">
                      ${v.price.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      ${v.monthlyEstimate}/mo
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {v.mileage.toLocaleString()} mi
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={v.status}
                      onChange={(e) => updateVehicle(v.id, { status: e.target.value as VehicleStatus })}
                      className={`text-xs font-bold px-2 py-1 rounded-md border cursor-pointer ${
                        v.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : v.status === 'Reserved'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : v.status === 'In Service'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Reserved">Reserved</option>
                      <option value="In Service">In Service</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVehicle(v)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title="View Live Card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        title="Edit Specs & Price"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(v.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete from Inventory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">Delete Vehicle?</h4>
            <p className="text-xs text-gray-500 mb-5">
              This vehicle will be permanently removed from the dealership inventory and public catalog.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVehicle(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto">
            <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingVehicle ? 'Edit Vehicle Specifications' : 'Add New Vehicle to Inventory'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">CarCraft Dealership Inventory System</p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVehicle(null);
                }}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={formMake}
                    onChange={(e) => setFormMake(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock ID</label>
                  <input
                    type="text"
                    required
                    value={formStockId}
                    onChange={(e) => setFormStockId(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">VIN Number</label>
                  <input
                    type="text"
                    required
                    value={formVin}
                    onChange={(e) => setFormVin(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Trim / Edition</label>
                <input
                  type="text"
                  required
                  value={formTrim}
                  onChange={(e) => setFormTrim(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mileage (Miles)</label>
                  <input
                    type="number"
                    required
                    value={formMileage}
                    onChange={(e) => setFormMileage(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Horsepower (HP)</label>
                  <input
                    type="number"
                    required
                    value={formHorsepower}
                    onChange={(e) => setFormHorsepower(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Body Style</label>
                  <select
                    value={formBodyType}
                    onChange={(e) => setFormBodyType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Coupe">Coupe</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Inventory Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Reserved">Reserved</option>
                    <option value="In Service">In Service</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Fuel Type</label>
                  <select
                    value={formFuelType}
                    onChange={(e) => setFormFuelType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Transmission</label>
                  <select
                    value={formTransmission}
                    onChange={(e) => setFormTransmission(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Dual-Clutch">Dual-Clutch</option>
                    <option value="Manual">Manual</option>
                    <option value="Single-Speed">Single-Speed</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Drivetrain</label>
                  <select
                    value={formDrivetrain}
                    onChange={(e) => setFormDrivetrain(e.target.value as any)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="AWD">AWD</option>
                    <option value="RWD">RWD</option>
                    <option value="4WD">4WD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVehicle(null);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  {editingVehicle ? 'Update Specifications' : 'Add Vehicle to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
