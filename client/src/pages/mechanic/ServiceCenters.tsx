import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import MechanicLayout from "../../components/MechanicLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { Building2 } from "lucide-react";

export default function MechanicServiceCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [centersRes, meRes] = await Promise.all([
          api.get("/service-centers"),
          api.get("/auth/me"),
        ]);
        setCenters(centersRes.data.data || []);
        setProfile(meRes.data?.data ?? meRes.data);
      } catch {
        toast.error("Failed to load centers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const requestJoin = async (centerId: string) => {
    try {
      await api.post(`/service-centers/${centerId}/join`);
      toast.success("Join request sent");
      const meRes = await api.get("/auth/me");
      setProfile(meRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) {
    return (
      <MechanicLayout title="Service centers" subtitle="Find a center to join.">
        <LoadingPage />
      </MechanicLayout>
    );
  }

  const joinedCenterId = profile?.service_center_id;

  return (
    <MechanicLayout title="Service centers" subtitle="Find a center to join.">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {centers.map((c) => {
          const isJoined = joinedCenterId === c.id;
          const isPending = isJoined && profile?.status === "pending";
          const isActive = isJoined && profile?.status === "active";

          return (
            <div
              key={c.id}
              className="rounded-xl border border-gray-100 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <Building2 className="h-5 w-5 text-gray-300" />
                {isActive && <StatusBadge status="active" />}
                {isPending && <StatusBadge status="pending" />}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{c.address}</p>
              <p className="mt-2 text-xs text-gray-400">
                Rating: {Number(c.average_rating).toFixed(1)} ★
              </p>
              {!joinedCenterId && (
                <button
                  onClick={() => requestJoin(c.id)}
                  className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Request to join
                </button>
              )}
              {isPending && (
                <p className="mt-4 text-sm text-gray-400">Awaiting manager approval</p>
              )}
            </div>
          );
        })}
      </div>
    </MechanicLayout>
  );
}
