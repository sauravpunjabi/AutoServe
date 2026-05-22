import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import { Building2 } from "lucide-react";

export default function AdminServiceCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await api.get("/service-centers");
        setCenters(res.data.data || []);
      } catch {
        toast.error("Failed to load service centers");
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Service centers" subtitle="Platform-wide center overview.">
        <LoadingPage />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Service centers" subtitle="Platform-wide center overview.">
      {centers.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No service centers"
          description="Centers will appear here once managers create them."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.address}</td>
                  <td className="px-4 py-3 text-gray-700">{c.manager_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {Number(c.average_rating).toFixed(1)} ★
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
