import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { Calendar } from "lucide-react";

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch {
      toast.error("Failed to update booking");
    }
  };

  if (loading) {
    return (
      <ManagerLayout title="Schedule" subtitle="Manage incoming service requests.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Schedule" subtitle="Manage incoming service requests.">
      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings"
          description="Bookings from customers will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <Link to={`/manager/bookings/${b.id}`} className="text-blue-600 hover:underline">
                      {new Date(b.booking_date).toLocaleDateString()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{b.time_slot?.slice?.(0, 5) || b.time_slot}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {b.make} {b.model}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.service_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => updateStatus(b.id, "approved", e)}
                          className="mr-2 text-sm font-medium text-emerald-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => updateStatus(b.id, "rejected", e)}
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ManagerLayout>
  );
}
