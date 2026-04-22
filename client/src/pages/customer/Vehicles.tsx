import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Car, Plus, Trash2, ShieldCheck, Hash } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ make: "", model: "", year: new Date().getFullYear(), license_plate: "" });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", formData);
      setShowForm(false);
      setFormData({ make: "", model: "", year: new Date().getFullYear(), license_plate: "" });
      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <CustomerLayout title="My Garage" subtitle="Manage your vehicles and their service history.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="My Garage" subtitle="Manage your vehicles and their service history.">
      <div className="mb-8 flex justify-end">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Add New Vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Make</label>
              <input required type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} placeholder="e.g. Toyota" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Model</label>
              <input required type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Camry" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Year</label>
              <input required type="number" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} min="1900" max={new Date().getFullYear() + 1} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">License Plate</label>
              <input required type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm uppercase focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value.toUpperCase()})} placeholder="e.g. ABC-1234" />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition">Save Vehicle</button>
          </div>
        </form>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <Car className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Your garage is empty</h3>
          <p className="mt-1 text-sm text-slate-500">Add a vehicle to start booking services.</p>
          <button onClick={() => setShowForm(true)} className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition">Add a vehicle now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v: any) => (
            <div key={v.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500 font-bold text-lg">
                    {v.make.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{v.year} {v.make}</h3>
                    <p className="text-sm font-medium text-slate-500">{v.model}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(v.id)} className="text-slate-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Hash size={14} className="text-slate-400" />
                  {v.license_plate}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider ml-auto">
                  <ShieldCheck size={14} />
                  Active
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}