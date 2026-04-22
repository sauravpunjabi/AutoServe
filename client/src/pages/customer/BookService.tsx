import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Calendar as CalendarIcon, CheckCircle, Clock } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerBookService() {
  const [vehicles, setVehicles] = useState([]);
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    service_center_id: "",
    service_type: "",
    booking_date: "",
    time_slot: "09:00",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/vehicles"), api.get("/service-centers")])
      .then(([vRes, cRes]) => {
        setVehicles(vRes.data.data || []);
        setCenters(cRes.data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setInitialLoad(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/bookings", formData);
      navigate("/customer/bookings");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <CustomerLayout title="Book a Service" subtitle="Schedule an appointment at your preferred service center.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Book a Service" subtitle="Schedule an appointment at your preferred service center.">
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Select Vehicle</label>
              {vehicles.length === 0 ? (
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200/50">
                  You need to add a vehicle first. Please go to your Garage to add one.
                </div>
              ) : (
                <select 
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                >
                  <option value="" disabled>Choose your vehicle...</option>
                  {vehicles.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} ({v.license_plate})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Service Center */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Service Center</label>
              <select 
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.service_center_id}
                onChange={(e) => setFormData({...formData, service_center_id: e.target.value})}
              >
                <option value="" disabled>Choose a location...</option>
                {centers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.location}</option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Service Type</label>
              <select 
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={formData.service_type}
                onChange={(e) => setFormData({...formData, service_type: e.target.value})}
              >
                <option value="" disabled>What do you need?</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="General Diagnostics">General Diagnostics</option>
                <option value="Battery Replacement">Battery Replacement</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Date</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <CalendarIcon size={16} />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={formData.booking_date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Time Slot</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Clock size={16} />
                  </div>
                  <select 
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={formData.time_slot}
                    onChange={(e) => setFormData({...formData, time_slot: e.target.value})}
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              You will receive a confirmation shortly.
            </p>
            <button 
              type="submit" 
              disabled={loading || vehicles.length === 0}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}