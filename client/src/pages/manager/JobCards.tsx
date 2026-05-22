import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase } from "lucide-react";

export default function ManagerJobCards() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/job-cards");
        setJobs(res.data.data || []);
      } catch {
        toast.error("Failed to load job cards");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <ManagerLayout title="Job cards" subtitle="Track active service work.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Job cards" subtitle="Track active service work.">
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job cards"
          description="Job cards are created when bookings are approved."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Mechanic</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/manager/job-cards/${j.id}`}
                      className="font-mono text-xs text-blue-600 hover:underline"
                    >
                      {j.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {j.booking_date
                      ? new Date(j.booking_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{j.service_type || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {j.mechanic_name || "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={j.status} />
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
