import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
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
  EmptyState,
  SkeletonTable,
} from '../../components/ui';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <SkeletonTable rows={2} />
          </Card>
          <SkeletonTable rows={5} />
        </div>
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
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
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
                    <tr
                      key={i.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        borderLeft: low ? '3px solid var(--danger)' : '3px solid transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <td style={tdStyle}>{i.name}</td>
                      <td style={{ ...tdStyle }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: low ? 'var(--danger)' : 'var(--text-primary)', fontWeight: low ? 600 : 400 }}>
                            {i.quantity}
                          </span>
                          {low && (
                            <span
                              style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 600,
                                color: 'var(--danger)',
                                backgroundColor: 'var(--danger-subtle)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Low
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            marginTop: '6px',
                            height: '3px',
                            borderRadius: '2px',
                            backgroundColor: 'var(--border)',
                            width: '80px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              borderRadius: '2px',
                              width: `${Math.min(100, (i.quantity / Math.max(i.low_stock_threshold * 3, 1)) * 100)}%`,
                              backgroundColor: low ? 'var(--danger)' : 'var(--accent)',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                        ₹{Number(i.unit_price).toFixed(2)}
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                        {i.low_stock_threshold}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </div>
    </AppLayout>
  );
}
