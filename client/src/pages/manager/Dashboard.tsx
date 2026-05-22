import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { Calendar, Briefcase, Package } from "lucide-react";

export default function ManagerDashboard() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [stats, setStats] = useState({ pending: 0, activeJobs: 0, lowStock: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, jobsRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/job-cards"),
        ]);
        const bookings = bookingsRes.data.data || [];
        const jobs = jobsRes.data.data || [];
        setStats({
          pending: bookings.filter((b: any) => b.status === "pending").length,
          activeJobs: jobs.filter((j: any) => j.status !== "completed").length,
          lowStock: 0,
        });
        setRecentBookings(bookings.slice(0, 5));

        if (centerId) {
          const invRes = await api.get(`/inventory/${centerId}`);
          const items = invRes.data.data || [];
          setStats((s) => ({
            ...s,
            lowStock: items.filter(
              (i: any) => i.quantity < (i.low_stock_threshold || 10)
            ).length,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!centerLoading) fetchData();
  }, [centerId, centerLoading]);

  if (loading || centerLoading) {
    return (
      <ManagerLayout title="Dashboard" subtitle="Overview of your service center.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  const statCards = [
    { label: "Pending bookings", value: stats.pending, icon: Calendar },
    { label: "Active job cards", value: stats.activeJobs, icon: Briefcase },
    { label: "Low stock items", value: stats.lowStock, icon: Package },
  ];

  return (
    <ManagerLayout title="Dashboard" subtitle="Overview of your service center.">
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-6"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
            <Icon className="h-5 w-5 text-gray-300" />
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Recent bookings
          </p>
          <Link to="/manager/bookings" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
            No bookings yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(b.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.service_type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {b.make} {b.model}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}
