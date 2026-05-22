import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { ArrowLeft } from "lucide-react";

export default function ManagerJobCardDetail() {
  const { id } = useParams();
  const { centerId } = useManagerCenter();
  const [job, setJob] = useState<any>(null);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDesc, setTaskDesc] = useState("");
  const [partId, setPartId] = useState("");
  const [partQty, setPartQty] = useState(1);
  const [laborCost, setLaborCost] = useState("");

  const fetchJob = async () => {
    const res = await api.get(`/job-cards/${id}`);
    setJob(res.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchJob();
        if (centerId) {
          const [mechRes, invRes] = await Promise.all([
            api.get(`/service-centers/${centerId}/mechanics`),
            api.get(`/inventory/${centerId}`),
          ]);
          setMechanics((mechRes.data.data || []).filter((m: any) => m.status === "active"));
          setInventory(invRes.data.data || []);
        }
      } catch {
        toast.error("Failed to load job card");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, centerId]);

  const assignMechanic = async (mechanicId: string) => {
    try {
      await api.patch(`/job-cards/${id}/mechanic`, { mechanic_id: mechanicId });
      toast.success("Mechanic assigned");
      fetchJob();
    } catch {
      toast.error("Failed to assign mechanic");
    }
  };

  const updateJobStatus = async (status: string) => {
    try {
      await api.patch(`/job-cards/${id}/status`, { status });
      toast.success("Status updated");
      fetchJob();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;
    try {
      await api.post(`/job-cards/${id}/tasks`, { description: taskDesc });
      toast.success("Task added");
      setTaskDesc("");
      fetchJob();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const addPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId || !centerId) return;
    try {
      await api.post(`/inventory/job-parts/${id}`, {
        part_id: partId,
        quantity_used: partQty,
        service_center_id: centerId,
      });
      toast.success("Part added");
      setPartId("");
      setPartQty(1);
      fetchJob();
      const invRes = await api.get(`/inventory/${centerId}`);
      setInventory(invRes.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add part");
    }
  };

  const generateInvoice = async () => {
    try {
      await api.post("/misc/invoices", {
        job_card_id: id,
        booking_id: job.booking_id,
        customer_id: job.customer_id,
        labor_cost: Number(laborCost) || 0,
      });
      toast.success("Invoice generated");
    } catch {
      toast.error("Failed to generate invoice");
    }
  };

  if (loading) {
    return (
      <ManagerLayout title="Job card" subtitle="Job details.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  if (!job) {
    return (
      <ManagerLayout title="Job card" subtitle="Job details.">
        <p className="text-sm text-gray-400">Job card not found.</p>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Job card" subtitle={`#${id?.slice(0, 8)}`}>
      <Link
        to="/manager/job-cards"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to job cards
      </Link>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Booking ref
            </p>
            <p className="mt-1 font-mono text-xs text-gray-700">{job.booking_id?.slice(0, 8)}</p>
            <p className="mt-3 text-sm text-gray-700">
              {job.year} {job.make} {job.model} · {job.license_plate}
            </p>
            <p className="text-sm text-gray-500">{job.customer_name}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <select
            value={job.mechanic_id || ""}
            onChange={(e) => e.target.value && assignMechanic(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">Assign mechanic</option>
            {mechanics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            value={job.status}
            onChange={(e) => updateJobStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
          Tasks
        </p>
        <ul className="mb-4 divide-y divide-gray-100">
          {(job.tasks || []).map((t: any) => (
            <li key={t.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-gray-700">{t.description}</span>
              <StatusBadge status={t.status} />
            </li>
          ))}
        </ul>
        <form onSubmit={addTask} className="flex gap-2">
          <input
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="New task description"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
          Parts used
        </p>
        <ul className="mb-4 divide-y divide-gray-100">
          {(job.parts || []).map((p: any) => (
            <li key={p.id} className="flex justify-between py-3 text-sm text-gray-700">
              <span>{p.part_name}</span>
              <span className="text-gray-400">Qty {p.quantity_used}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={addPart} className="flex flex-wrap gap-2">
          <select
            value={partId}
            onChange={(e) => setPartId(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">Select part</option>
            {inventory.map((i) => (
              <option key={i.part_id} value={i.part_id}>
                {i.name} (stock: {i.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={partQty}
            onChange={(e) => setPartQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add part
          </button>
        </form>
      </div>

      {job.status === "completed" && (
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
            Generate invoice
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Labor cost"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              onClick={generateInvoice}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Generate invoice
            </button>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}
