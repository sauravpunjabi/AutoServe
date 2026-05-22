import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/misc/admin/users");
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user: any) => {
    const next = user.status === "active" ? "rejected" : "active";
    try {
      await api.patch(`/misc/admin/users/${user.id}/status`, { status: next });
      toast.success(`User ${next === "active" ? "activated" : "suspended"}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Users" subtitle="Manage platform accounts.">
        <LoadingPage />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users" subtitle="Manage platform accounts.">
      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users" description="No users in the system." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status === "rejected" ? "suspended" : u.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(u)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {u.status === "active" ? "Suspend" : "Activate"}
                    </button>
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
