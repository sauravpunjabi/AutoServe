import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { Building2 } from "lucide-react";

export default function ManageServiceCenter() {
  const { center, loading } = useManagerCenter();

  if (loading) {
    return (
      <ManagerLayout title="Service center" subtitle="Your center details.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  if (!center) {
    return (
      <ManagerLayout title="Service center" subtitle="Your center details.">
        <EmptyState
          icon={Building2}
          title="No service center"
          description="Create a service center to start managing bookings and staff."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </ManagerLayout>
    );
  }

  const fields = [
    { label: "Name", value: center.name },
    { label: "Address", value: center.address },
    { label: "Phone", value: center.phone },
    { label: "Email", value: center.email },
  ];

  return (
    <ManagerLayout title="Service center" subtitle="Your center details.">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <dl className="space-y-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-widest text-gray-400">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-gray-700">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-mono text-xs text-gray-400">ID: {center.id}</p>
      </div>
    </ManagerLayout>
  );
}
