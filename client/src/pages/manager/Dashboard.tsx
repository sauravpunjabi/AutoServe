import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import {
  KpiStrip,
  KpiCell,
  Panel,
  EmptyState,
  StatusBadge,
  SkeletonStatCard,
  SkeletonTable,
  Mono,
  Modal,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  DangerButton,
  CapacityBar,
} from '../../components/ui';
import { Users, Package, Check, X, RefreshCw, ShoppingCart } from 'lucide-react';

function fmtMoney(n: number) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Priority = 'critical' | 'high' | 'normal';

function PriorityChip({ p }: { p: Priority }) {
  const map: Record<Priority, { fg: string; label: string }> = {
    critical: { fg: 'var(--danger)', label: 'Critical' },
    high: { fg: 'var(--warning)', label: 'High' },
    normal: { fg: 'var(--text-muted)', label: 'Normal' },
  };
  const s = map[p] || map.normal;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: s.fg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: s.fg, display: 'inline-block' }} />
      {s.label}
    </span>
  );
}

// ─── Approval Queue ───────────────────────────────────────────────────────────
function ApprovalQueue({
  bookings, mechanics, onApprove, onReject,
}: {
  bookings: any[];
  mechanics: any[];
  onApprove: (b: any) => void;
  onReject: (id: string) => void;
}) {
  if (bookings.length === 0) {
    return (
      <Panel title="Pending approvals" subtitle="0 bookings awaiting decision" noPad>
        <EmptyState icon={Check} title="Inbox zero" description="No bookings need your approval right now." />
      </Panel>
    );
  }

  return (
    <Panel
      title="Pending approvals"
      subtitle={`${bookings.length} booking${bookings.length !== 1 ? 's' : ''} awaiting decision`}
      action={<GhostButton style={{ fontSize: 12, height: 28 }}><RefreshCw size={12} strokeWidth={1.5} />Refresh</GhostButton>}
      noPad
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Booking', 'Customer', 'Vehicle', 'Services', 'Date', 'Priority', ''].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-elevated)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <Mono style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.id.slice(0, 8)}</Mono>
                </td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{b.customer_name || '—'}</td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <Mono style={{ fontSize: 12 }}>{b.make} {b.model} {b.year}</Mono>
                </td>
                <td style={{ padding: '10px 16px', maxWidth: 240 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.services?.map((s: any) => s.name).join(', ') || b.service_type || '—'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <Mono style={{ fontSize: 12 }}>{fmtDate(b.booking_date)} · {b.time_slot}</Mono>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <PriorityChip p="normal" />
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <DangerButton
                      onClick={(e) => { e.stopPropagation(); onReject(b.id); }}
                      style={{ height: 28, padding: '0 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <X size={12} strokeWidth={2} />Reject
                    </DangerButton>
                    <PrimaryButton
                      onClick={(e) => { e.stopPropagation(); onApprove(b); }}
                      style={{ height: 28, padding: '0 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Check size={12} strokeWidth={2} />Approve
                    </PrimaryButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ─── Assign Mechanic Modal ────────────────────────────────────────────────────
function AssignMechanicModal({
  open, booking, mechanics, onClose, onConfirm,
}: {
  open: boolean;
  booking: any;
  mechanics: any[];
  onClose: () => void;
  onConfirm: (mechanicId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal open={open} onClose={onClose} title={`Assign mechanic — ${booking?.id?.slice(0, 8) || ''}`}>
      {booking && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid var(--border-strong)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            {[
              { label: 'Customer', value: booking.customer_name || '—' },
              { label: 'Vehicle', value: `${booking.make || ''} ${booking.model || ''}` },
              { label: 'Date', value: `${fmtDate(booking.booking_date)} ${booking.time_slot}` },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '10px 14px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-primary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)' }}>
            Select a mechanic to assign:
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--border-strong)', borderRadius: 8, overflow: 'hidden' }}>
            {mechanics.length === 0 ? (
              <li style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                No mechanics available at this center.
              </li>
            ) : (
              mechanics.map((m) => (
                <li
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    background: selected === m.id ? 'var(--accent-subtle)' : 'transparent',
                    borderLeft: selected === m.id ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { if (selected !== m.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (selected !== m.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 32, height: 32, border: '1px solid var(--border-strong)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-primary)', flexShrink: 0 }}>
                    {m.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)' }}>{m.name}</p>
                    <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{m.email}</p>
                  </div>
                  <StatusBadge status={m.status || 'active'} />
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton disabled={!selected} onClick={() => selected && onConfirm(selected)}>
          Assign & approve
        </PrimaryButton>
      </div>
    </Modal>
  );
}

// ─── Bay Grid ─────────────────────────────────────────────────────────────────
function BayGrid({ jobs }: { jobs: any[] }) {
  const inProgress = jobs.filter((j) => j.status === 'in_progress').slice(0, 4);
  const bays = Array.from({ length: 6 }, (_, i) => ({
    id: `BAY-0${i + 1}`,
    job: inProgress[i] || null,
  }));

  return (
    <Panel title="Bay status" subtitle={`${inProgress.length} of 6 bays occupied`} noPad>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {bays.map((bay, i) => (
          <div
            key={bay.id}
            style={{
              padding: '14px 16px',
              borderRight: i % 3 !== 2 ? '1px solid var(--border)' : 'none',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                Bay <Mono style={{ fontSize: 13, color: 'var(--text-primary)' }}>{String(i + 1).padStart(2, '0')}</Mono>
              </span>
              <StatusBadge status={bay.job ? 'in_progress' : 'available'} />
            </div>
            {bay.job ? (
              <>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {bay.job.make} {bay.job.model} {bay.job.year}
                </p>
                <Mono style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                  {bay.job.id.slice(0, 12)} · {bay.job.mechanic_name || 'Unassigned'}
                </Mono>
                <div style={{ marginTop: 8 }}>
                  <CapacityBar value={50 + (i * 13) % 45} color="var(--info)" />
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--success)' }}>Available</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Ready for assignment</p>
              </>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Mechanic Roster ──────────────────────────────────────────────────────────
function MechanicRoster({ mechanics, jobCards }: { mechanics: any[]; jobCards: any[] }) {
  const enriched = useMemo(() => {
    return mechanics.map((m) => {
      const assigned = jobCards.filter((j) => j.mechanic_id === m.id);
      const active = assigned.filter((j) => j.status === 'in_progress').length;
      return { ...m, assignedJobs: assigned.length, activeJobs: active };
    });
  }, [mechanics, jobCards]);

  return (
    <Panel
      title="Team"
      subtitle="Mechanics at this center"
      action={
        <Link to="/manager/mechanics" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Users size={12} strokeWidth={1.5} />Manage
        </Link>
      }
      noPad
    >
      {enriched.length === 0 ? (
        <EmptyState icon={Users} title="No mechanics yet" description="Mechanics who join this center will appear here." />
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {enriched.map((m, i) => {
            const load = m.assignedJobs > 0 ? Math.min(100, (m.activeJobs / Math.max(m.assignedJobs, 1)) * 100) : 0;
            return (
              <li
                key={m.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 20px',
                  borderBottom: i < enriched.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ width: 32, height: 32, border: '1px solid var(--border-strong)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-primary)', flexShrink: 0 }}>
                  {m.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{m.email}</p>
                </div>
                <div style={{ width: 110 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Load</span>
                    <Mono style={{ fontSize: 11, color: 'var(--text-primary)' }}>{m.activeJobs}/{m.assignedJobs}</Mono>
                  </div>
                  <CapacityBar value={load} />
                </div>
                <StatusBadge status={m.status || 'active'} />
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

// ─── Inventory Alerts ─────────────────────────────────────────────────────────
function InventoryAlerts({ items }: { items: any[] }) {
  const lowStock = items.filter((i) => i.quantity < (i.low_stock_threshold || 10));

  return (
    <Panel
      title="Inventory"
      subtitle={lowStock.length > 0 ? `${lowStock.length} SKU${lowStock.length !== 1 ? 's' : ''} below reorder threshold` : 'All stock levels normal'}
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/manager/inventory" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>View all →</Link>
          {lowStock.length > 0 && (
            <button style={{ height: 28, padding: '0 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--warning)', borderRadius: 6, color: 'var(--warning)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShoppingCart size={11} strokeWidth={1.5} />Reorder all
            </button>
          )}
        </div>
      }
      noPad
    >
      {items.length === 0 ? (
        <EmptyState icon={Package} title="No inventory data" description="Inventory items for this center will appear here." />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Item', 'SKU', 'Stock', 'Threshold', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-elevated)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 8).map((item) => {
                const threshold = item.low_stock_threshold || 10;
                const pct = Math.min(100, (item.quantity / threshold) * 100);
                const low = item.quantity < threshold;
                const critical = item.quantity === 0;
                return (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '10px 16px', maxWidth: 240 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                      <Mono style={{ fontSize: 12 }}>{item.sku || item.id.slice(0, 8)}</Mono>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                        <Mono style={{ fontSize: 13, color: critical ? 'var(--danger)' : low ? 'var(--warning)' : 'var(--text-primary)', width: 28, textAlign: 'right' }}>
                          {item.quantity}
                        </Mono>
                        <div style={{ flex: 1 }}>
                          <CapacityBar value={pct} color={critical ? 'var(--danger)' : low ? 'var(--warning)' : 'var(--success)'} />
                        </div>
                        <Mono style={{ fontSize: 11, color: 'var(--text-muted)', width: 32 }}>/{threshold}</Mono>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <Mono style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{threshold}</Mono>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      {low ? (
                        <button style={{ height: 28, padding: '0 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--warning)', borderRadius: 6, color: 'var(--warning)', cursor: 'pointer' }}>
                          Reorder
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--success)' }}>In stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ManagerDashboard() {
  const { center, centerId, loading: centerLoading } = useManagerCenter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignFor, setAssignFor] = useState<any>(null);

  useEffect(() => {
    if (centerLoading) return;
    const fetchData = async () => {
      try {
        const [bRes, jRes] = await Promise.allSettled([
          api.get('/bookings'),
          api.get('/job-cards'),
        ]);
        if (bRes.status === 'fulfilled') setBookings(bRes.value.data.data || []);
        if (jRes.status === 'fulfilled') setJobCards(jRes.value.data.data || []);

        if (centerId) {
          const [invRes, mechRes] = await Promise.allSettled([
            api.get(`/inventory/${centerId}`),
            api.get(`/service-centers/${centerId}/mechanics`),
          ]);
          if (invRes.status === 'fulfilled') setInventory(invRes.value.data.data || []);
          if (mechRes.status === 'fulfilled') setMechanics(mechRes.value.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [centerId, centerLoading]);

  const pending = bookings.filter((b) => b.status === 'pending');
  const active = jobCards.filter((j) => j.status === 'in_progress');
  const lowStock = inventory.filter((i) => i.quantity < (i.low_stock_threshold || 10));

  const handleApprove = (booking: any) => setAssignFor(booking);
  const handleReject = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'rejected' });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };
  const handleAssignConfirm = async (mechanicId: string) => {
    if (!assignFor) return;
    try {
      await api.patch(`/bookings/${assignFor.id}/status`, { status: 'approved' });
      const jobRes = await api.get('/job-cards');
      const jobs = jobRes.data.data || [];
      const newJob = jobs.find((j: any) => j.booking_id === assignFor.id);
      if (newJob) {
        await api.patch(`/job-cards/${newJob.id}/mechanic`, { mechanic_id: mechanicId });
        setJobCards(jobs);
      }
      setBookings((prev) => prev.filter((b) => b.id !== assignFor.id));
    } catch (err) { console.error(err); }
    setAssignFor(null);
  };

  if (loading || centerLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your service center." navLinks={managerNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
          <SkeletonTable rows={5} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <SkeletonTable rows={4} /><SkeletonTable rows={4} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Dashboard"
      subtitle={center ? `${center.name} · Operations overview` : 'Operations overview'}
      navLinks={managerNav}
    >
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI strip */}
        <KpiStrip cols={5} style={{ marginBottom: 0 }}>
          <KpiCell label="Pending approvals" value={pending.length} sub="Awaiting decision" accent={pending.length > 0 ? 'var(--warning)' : undefined} />
          <KpiCell label="Jobs active" value={active.length} sub="In progress now" accent={active.length > 0 ? 'var(--accent)' : undefined} />
          <KpiCell label="Total job cards" value={jobCards.length} sub="All open cards" />
          <KpiCell label="Low stock items" value={lowStock.length} sub="Below reorder point" accent={lowStock.length > 0 ? 'var(--danger)' : undefined} />
          <KpiCell label="Mechanics" value={mechanics.length} sub="At this center" />
        </KpiStrip>

        {/* Approval queue */}
        <ApprovalQueue
          bookings={pending}
          mechanics={mechanics}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Bay grid + Mechanic roster */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <BayGrid jobs={jobCards} />
          <MechanicRoster mechanics={mechanics} jobCards={jobCards} />
        </div>

        {/* Inventory */}
        <InventoryAlerts items={inventory} />
      </div>

      {/* Assign mechanic modal */}
      <AssignMechanicModal
        open={!!assignFor}
        booking={assignFor}
        mechanics={mechanics}
        onClose={() => setAssignFor(null)}
        onConfirm={handleAssignConfirm}
      />
    </AppLayout>
  );
}
