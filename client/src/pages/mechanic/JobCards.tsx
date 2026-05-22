import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import MechanicLayout from "../../components/MechanicLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase } from "lucide-react";

export default function MechanicJobCards() {
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
      <MechanicLayout title="Job cards" subtitle="Your assigned service jobs.">
        <LoadingPage />
      </MechanicLayout>
    );
  }

  return (
    <MechanicLayout title="Job cards" subtitle="Your assigned service jobs.">
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs assigned"
          description="Jobs will appear here once a manager assigns you."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
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
                      to={`/mechanic/job-cards/${j.id}`}
                      className="font-mono text-xs text-blue-600 hover:underline"
                    >
                      {j.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{j.service_type || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {j.booking_date
                      ? new Date(j.booking_date).toLocaleDateString()
                      : "—"}
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
    </MechanicLayout>
  );
}
