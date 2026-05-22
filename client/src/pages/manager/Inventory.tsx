import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { Package } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ManagerInventory() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partForm, setPartForm] = useState({ name: "", description: "", unit_price: "" });
  const [stockForm, setStockForm] = useState({ quantity: "", low_stock_threshold: "10" });
  const fetchInventory = async () => {
    if (!centerId) return;
    try {
      const res = await api.get(`/inventory/${centerId}`);
      setItems(res.data.data || []);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!centerLoading && centerId) fetchInventory();
    else if (!centerLoading) setLoading(false);
  }, [centerId, centerLoading]);

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const partRes = await api.post("/inventory/parts", {
        name: partForm.name,
        description: partForm.description,
        unit_price: Number(partForm.unit_price),
      });
      const partId = partRes.data.data.id;
      await api.post("/inventory", {
        service_center_id: centerId,
        part_id: partId,
        quantity: Number(stockForm.quantity) || 0,
        low_stock_threshold: Number(stockForm.low_stock_threshold) || 10,
      });
      toast.success("Part added to inventory");
      setPartForm({ name: "", description: "", unit_price: "" });
      setStockForm({ quantity: "", low_stock_threshold: "10" });
      fetchInventory();
    } catch {
      toast.error("Failed to add part");
    }
  };

  if (loading || centerLoading) {
    return (
      <ManagerLayout title="Inventory" subtitle="Manage parts and stock levels.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  if (!centerId) {
    return (
      <ManagerLayout title="Inventory" subtitle="Manage parts and stock levels.">
        <EmptyState
          icon={Package}
          title="No service center"
          description="Create a service center first."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Inventory" subtitle="Manage parts and stock levels.">
      <form
        onSubmit={handleAddPart}
        className="mb-8 rounded-xl border border-gray-100 bg-white p-6"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
          Add part
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Part name"
            value={partForm.name}
            onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Description"
            value={partForm.description}
            onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Unit price"
            value={partForm.unit_price}
            onChange={(e) => setPartForm({ ...partForm, unit_price: e.target.value })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Initial quantity"
            value={stockForm.quantity}
            onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Add to inventory
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Empty inventory"
          description="Add your first part using the form above."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Unit price</th>
                <th className="px-4 py-3">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const low = i.quantity < (i.low_stock_threshold || 10);
                return (
                  <tr
                    key={i.id}
                    className={cn(
                      "border-b border-gray-100 transition-colors hover:bg-gray-50",
                      low && "bg-red-50"
                    )}
                  >
                    <td className="px-4 py-3 text-gray-900">{i.name}</td>
                    <td className={cn("px-4 py-3", low && "font-medium text-red-500")}>
                      {i.quantity}
                      {low && (
                        <span className="ml-2 rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-500">
                          Low stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">${Number(i.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-400">{i.low_stock_threshold}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ManagerLayout>
  );
}
