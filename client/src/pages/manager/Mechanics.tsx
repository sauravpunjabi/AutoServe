import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { Users } from "lucide-react";

export default function ManagerMechanics() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMechanics = async () => {
    if (!centerId) return;
    try {
      const res = await api.get(`/service-centers/${centerId}/mechanics`);
      setMechanics(res.data.data || []);
    } catch {
      toast.error("Failed to load mechanics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!centerLoading && centerId) fetchMechanics();
    else if (!centerLoading) setLoading(false);
  }, [centerId, centerLoading]);

  const updateStatus = async (userId: string, status: "active" | "rejected") => {
    try {
      await api.patch(`/service-centers/${centerId}/mechanics/${userId}`, { status });
      toast.success(`Mechanic ${status}`);
      fetchMechanics();
    } catch {
      toast.error("Failed to update mechanic");
    }
  };

  if (loading || centerLoading) {
    return (
      <ManagerLayout title="Mechanics" subtitle="Approve and manage your team.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  if (!centerId) {
    return (
      <ManagerLayout title="Mechanics" subtitle="Approve and manage your team.">
        <EmptyState
          icon={Users}
          title="No service center"
          description="Create a service center first."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </ManagerLayout>
    );
  }

  const pending = mechanics.filter((m) => m.status === "pending");
  const active = mechanics.filter((m) => m.status === "active");

  const MechanicRow = ({ m, showActions }: { m: any; showActions?: boolean }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{m.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{m.email}</td>
      <td className="px-4 py-3">
        <StatusBadge status={m.status} />
      </td>
      {showActions && (
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => updateStatus(m.id, "active")}
            className="mr-2 text-sm font-medium text-emerald-600 hover:underline"
          >
            Approve
          </button>
          <button
            onClick={() => updateStatus(m.id, "rejected")}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Reject
          </button>
        </td>
      )}
    </tr>
  );

  return (
    <ManagerLayout title="Mechanics" subtitle="Approve and manage your team.">
      <section className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
          Pending approval
        </p>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-400">No pending requests.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((m) => (
                  <MechanicRow key={m.id} m={m} showActions />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
          Active mechanics
        </p>
        {active.length === 0 ? (
          <p className="text-sm text-gray-400">No active mechanics yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {active.map((m) => (
                  <MechanicRow key={m.id} m={m} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ManagerLayout>
  );
}
