import { useState, useEffect } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import { Users, CalendarCheck, DollarSign, Store, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/misc/admin/analytics");
        setAnalytics(response.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Overview" subtitle="System-wide metrics and performance.">
        <LoadingPage />
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Total users", value: analytics?.stats?.users, icon: Users },
    { label: "Total bookings", value: analytics?.stats?.bookings, icon: CalendarCheck },
    {
      label: "Total revenue",
      value: `$${Number(analytics?.stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <AdminLayout title="Overview" subtitle="System-wide metrics and performance.">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-6"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{value ?? "—"}</p>
            </div>
            <Icon className="h-5 w-5 text-gray-300" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Revenue per center</h3>
            <Store className="h-4 w-4 text-gray-300" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.revenuePerCenter || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #f3f4f6" }} />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Bookings over time</h3>
            <TrendingUp className="h-4 w-4 text-gray-300" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.bookingsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #f3f4f6" }} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#111827"
                  fill="#f3f4f6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
