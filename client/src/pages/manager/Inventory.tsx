import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { Package } from 'lucide-react';
import {
  Card,
  SectionLabel,
  TextInput,
  PrimaryButton,
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
} from '../../components/ui/primitives';

export default function ManagerInventory() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partForm, setPartForm] = useState({ name: '', description: '', unit_price: '' });
  const [stockForm, setStockForm] = useState({ quantity: '', low_stock_threshold: '10' });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    if (!centerId) return;
    try {
      const res = await api.get(`/inventory/${centerId}`);
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to load inventory');
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
    setSubmitting(true);
    try {
      const partRes = await api.post('/inventory/parts', {
        name: partForm.name,
        description: partForm.description,
        unit_price: Number(partForm.unit_price),
      });
      const partId = partRes.data.data.id;
      await api.post('/inventory', {
        service_center_id: centerId,
        part_id: partId,
        quantity: Number(stockForm.quantity) || 0,
        low_stock_threshold: Number(stockForm.low_stock_threshold) || 10,
      });
      toast.success('Part added to inventory');
      setPartForm({ name: '', description: '', unit_price: '' });
      setStockForm({ quantity: '', low_stock_threshold: '10' });
      fetchInventory();
    } catch {
      toast.error('Failed to add part');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || centerLoading) {
    return (
      <AppLayout title="Inventory" subtitle="Manage parts and stock levels." navLinks={managerNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  if (!centerId) {
    return (
      <AppLayout title="Inventory" subtitle="Manage parts and stock levels." navLinks={managerNav}>
        <EmptyState
          icon={Package}
          title="No service center"
          description="Create a service center first."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Inventory" subtitle="Manage parts and stock levels." navLinks={managerNav}>
      <Card style={{ marginBottom: '24px' }}>
        <SectionLabel>Add part</SectionLabel>
        <form onSubmit={handleAddPart}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <TextInput
              required
              placeholder="Part name"
              value={partForm.name}
              onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
            />
            <TextInput
              placeholder="Description"
              value={partForm.description}
              onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
            />
            <TextInput
              required
              type="number"
              step="0.01"
              placeholder="Unit price"
              value={partForm.unit_price}
              onChange={(e) => setPartForm({ ...partForm, unit_price: e.target.value })}
            />
            <TextInput
              required
              type="number"
              placeholder="Initial quantity"
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
            />
          </div>
          <PrimaryButton type="submit" disabled={submitting} style={{ marginTop: '16px' }}>
            {submitting ? 'Adding…' : 'Add to inventory'}
          </PrimaryButton>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Empty inventory"
          description="Add your first part using the form above."
        />
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Part</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Unit price</th>
                <th style={thStyle}>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => {
                const low = i.quantity < (i.low_stock_threshold || 10);
                return (
                  <TableRow key={i.id}>
                    <td
                      style={{
                        ...tdStyle,
                        backgroundColor: low ? 'var(--danger-subtle)' : undefined,
                      }}
                    >
                      {i.name}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: low ? 'var(--danger)' : undefined,
                        fontWeight: low ? 500 : undefined,
                        backgroundColor: low ? 'var(--danger-subtle)' : undefined,
                      }}
                    >
                      {i.quantity}
                      {low && (
                        <span
                          style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: 'var(--danger)',
                            backgroundColor: 'var(--danger-subtle)',
                          }}
                        >
                          Low stock
                        </span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      ${Number(i.unit_price).toFixed(2)}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                      {i.low_stock_threshold}
                    </td>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      )}
    </AppLayout>
  );
}
