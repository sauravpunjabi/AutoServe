import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { FileText } from "lucide-react";

export default function ManagerInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/misc/invoices/manager");
        setInvoices(res.data.data || []);
      } catch {
        toast.error("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <ManagerLayout title="Invoices" subtitle="Billing for completed jobs.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Invoices" subtitle="Billing for completed jobs.">
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices"
          description="Generate invoices from completed job cards."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Booking date</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {inv.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {inv.booking_date
                      ? new Date(inv.booking_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{inv.service_type || "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${Number(inv.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
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
