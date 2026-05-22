import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import MechanicLayout from "../../components/MechanicLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import { Briefcase, Building2 } from "lucide-react";

export default function MechanicDashboard() {
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/job-cards");
        const jobs = res.data.data || [];
        setStats({
          total: jobs.length,
          inProgress: jobs.filter((j: any) => j.status === "in_progress").length,
          completed: jobs.filter((j: any) => j.status === "completed").length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <MechanicLayout title="Dashboard" subtitle="Your assigned work at a glance.">
        <LoadingPage />
      </MechanicLayout>
    );
  }

  const statCards = [
    { label: "Assigned jobs", value: stats.total },
    { label: "In progress", value: stats.inProgress },
    { label: "Completed", value: stats.completed },
  ];

  return (
    <MechanicLayout title="Dashboard" subtitle="Your assigned work at a glance.">
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {statCards.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-white p-6"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          to="/mechanic/job-cards"
          className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 transition-colors hover:bg-gray-50"
        >
          <Briefcase className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">View job queue</p>
            <p className="text-sm text-gray-400">See and update your assigned jobs</p>
          </div>
        </Link>
        <Link
          to="/mechanic/service-centers"
          className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 transition-colors hover:bg-gray-50"
        >
          <Building2 className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Service centers</p>
            <p className="text-sm text-gray-400">Join or check your center status</p>
          </div>
        </Link>
      </div>
    </MechanicLayout>
  );
}
