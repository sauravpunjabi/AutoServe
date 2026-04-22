import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Search, MapPin, Phone, Star, ArrowRight } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerServiceCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await api.get("/service-centers");
        setCenters(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((c: any) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <CustomerLayout title="Service Centers" subtitle="Find an AutoServe location near you.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Service Centers" subtitle="Find an AutoServe location near you.">
      <div className="mb-8">
        <div className="relative max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
            <MapPin className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No centers found</h3>
          <p className="mt-1 text-sm text-slate-500">We couldn't find any locations matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((c: any) => (
            <div key={c.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="h-32 bg-slate-100 flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{c.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-md">
                    <Star size={14} className="fill-amber-500" />
                    4.8
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 flex-1">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="leading-snug">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    to="/customer/book-service" 
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Book Here
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}