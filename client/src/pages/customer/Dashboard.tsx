import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Car, Calendar, Clock, ArrowRight, Activity, ShieldCheck, Wrench } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, bRes] = await Promise.all([
          api.get("/vehicles"),
          api.get("/bookings")
        ]);
        setVehicles(vRes.data.data || []);
        setBookings(bRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-darker">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <CustomerLayout 
      title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`} 
      subtitle="Here is what's happening with your vehicles today."
    >
      {/* Hero Action Banner */}
      <div className="relative mb-8 rounded-3xl overflow-hidden glass-card p-8 md:p-10 border-t border-l border-white/20 animate-slide-up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-600/30 to-indigo-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Need a tune up?</h2>
            <p className="text-slate-300 max-w-xl text-lg">Book a certified AutoServe mechanic in seconds and track the real-time progress of your vehicle's service.</p>
          </div>
          <Link 
            to="/customer/book-service" 
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
          >
            Book New Service
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full border border-white/50 scale-[1.05] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
            <Car size={26} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Registered Vehicles</p>
            <h3 className="text-3xl font-bold text-white">{vehicles.length}</h3>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={26} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Completed Services</p>
            <h3 className="text-3xl font-bold text-white">{bookings.filter((b:any)=>b.status==='completed').length}</h3>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity size={26} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Active Appointments</p>
            <h3 className="text-3xl font-bold text-white">{bookings.filter((b:any)=>b.status==='approved' || b.status==='pending').length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Vehicles Premium Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Car className="text-primary-400" size={28} />
              Your Garage
            </h2>
            <Link to="/customer/vehicles" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">View All</Link>
          </div>
          
          {vehicles.length === 0 ? (
            <div className="text-center py-10 bg-surface-dark/50 rounded-2xl border border-white/5">
              <div className="mx-auto h-16 w-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 border border-primary-500/20">
                <Car className="h-8 w-8 text-primary-400" />
              </div>
              <p className="text-slate-400 mb-4 font-medium">You haven't added any vehicles yet.</p>
              <Link to="/customer/vehicles" className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">Add your first vehicle</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {vehicles.map((v: any) => (
                <li key={v.id} className="p-4 rounded-2xl bg-surface-dark/40 border border-white/5 flex items-center justify-between hover:bg-surface-dark/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/10">
                      {v.make.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{v.year} {v.make} {v.model}</p>
                      <p className="text-sm text-primary-400 font-mono mt-0.5 tracking-wider">{v.license_plate}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold tracking-widest uppercase">Active</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Bookings Premium Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-indigo-400" size={28} />
              Recent Appointments
            </h2>
            <Link to="/customer/bookings" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">History</Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 bg-surface-dark/50 rounded-2xl border border-white/5">
              <div className="mx-auto h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                <Calendar className="h-8 w-8 text-indigo-400" />
              </div>
              <p className="text-slate-400 mb-4 font-medium">No recent bookings found.</p>
              <Link to="/customer/book-service" className="text-primary-400 hover:underline text-sm font-semibold">Schedule a service</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {bookings.slice(0,4).map((b: any) => (
                <li key={b.id} className="p-4 rounded-2xl bg-surface-dark/40 border border-white/5 flex items-center justify-between hover:bg-surface-dark/60 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                      <Wrench size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{b.service_type}</p>
                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-500" /> 
                        {new Date(b.booking_date).toLocaleDateString()} at {b.time_slot}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase border ${
                    b.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    b.status === 'approved' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                    b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-white/5 text-slate-300 border-white/10'
                  }`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </CustomerLayout>
  );
}