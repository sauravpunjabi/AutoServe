import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import MechanicLayout from "../../components/MechanicLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { ArrowLeft } from "lucide-react";

export default function MechanicJobCardDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    const res = await api.get(`/job-cards/${id}`);
    setJob(res.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchJob();
      } catch {
        toast.error("Failed to load job card");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/job-cards/tasks/${taskId}/status`, { status });
      toast.success("Task updated");
      fetchJob();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const updateJobStatus = async (status: string) => {
    try {
      await api.patch(`/job-cards/${id}/status`, { status });
      toast.success("Job status updated");
      fetchJob();
    } catch {
      toast.error("Failed to update job status");
    }
  };

  if (loading) {
    return (
      <MechanicLayout title="Job card" subtitle="Job details.">
        <LoadingPage />
      </MechanicLayout>
    );
  }

  if (!job) {
    return (
      <MechanicLayout title="Job card" subtitle="Job details.">
        <p className="text-sm text-gray-400">Job card not found.</p>
      </MechanicLayout>
    );
  }

  return (
    <MechanicLayout title="Job card" subtitle={`#${id?.slice(0, 8)}`}>
      <Link
        to="/mechanic/job-cards"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to job cards
      </Link>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <p className="text-sm text-gray-700">
          {job.year} {job.make} {job.model} · {job.license_plate}
        </p>
        <p className="mt-1 text-sm text-gray-500">{job.service_type}</p>
        <div className="mt-4">
          <StatusBadge status={job.status} />
        </div>
        <select
          value={job.status}
          onChange={(e) => updateJobStatus(e.target.value)}
          className="mt-4 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
          Tasks
        </p>
        <ul className="divide-y divide-gray-100">
          {(job.tasks || []).map((t: any) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="text-sm text-gray-700">{t.description}</span>
              <select
                value={t.status}
                onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </li>
          ))}
        </ul>
        {(!job.tasks || job.tasks.length === 0) && (
          <p className="text-sm text-gray-400">No tasks yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
          Parts used
        </p>
        <ul className="divide-y divide-gray-100">
          {(job.parts || []).map((p: any) => (
            <li key={p.id} className="flex justify-between py-3 text-sm text-gray-700">
              <span>{p.part_name}</span>
              <span className="text-gray-400">Qty {p.quantity_used}</span>
            </li>
          ))}
        </ul>
        {(!job.parts || job.parts.length === 0) && (
          <p className="text-sm text-gray-400">No parts recorded.</p>
        )}
      </div>
    </MechanicLayout>
  );
}
