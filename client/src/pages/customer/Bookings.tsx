import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Calendar, Clock, Wrench, FileText, ExternalLink } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout title="My Appointments" subtitle="Track your service history and upcoming visits.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "approved": return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <CustomerLayout title="My Appointments" subtitle="Track your service history and upcoming visits.">
      <div className="mb-6 flex justify-end">
        <Link to="/customer/book-service" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition">
          Book New Service
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No appointments found</h3>
          <p className="mt-1 text-sm text-slate-500">You don't have any past or upcoming services.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                
                <div className="flex items-start gap-5">
                  <div className="hidden md:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                    <Wrench className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{b.service_type}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${getStatusColor(b.status)}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-slate-400" />
                        {new Date(b.booking_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-slate-400" />
                        {b.time_slot}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex items-center gap-3">
                  {b.status === "approved" && (
                    <Link to={`/customer/job-tracker/${b.id}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition">
                      <ExternalLink size={16} />
                      Track Job
                    </Link>
                  )}
                  {b.status === "completed" && (
                    <button className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition">
                      <FileText size={16} />
                      View Invoice
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}