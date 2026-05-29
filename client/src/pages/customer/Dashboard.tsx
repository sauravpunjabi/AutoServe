import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
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
  CapacityBar,
} from '../../components/ui';
import { Car, Clock, Check, ChevronRight, CreditCard, Download, CalendarPlus, FileText, AlertCircle } from 'lucide-react';

function fmtMoney(n: number) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', color: 'var(--text-primary)' }}>
      {pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())}
    </span>
  );
}

// ─── Active Job Hero ──────────────────────────────────────────────────────────
function ActiveJobHero({ job, onPay }: { job: any; onPay: () => void }) {
  const tasks = job.tasks || [];
  const completed = tasks.filter((t: any) => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const statusIcon = (status: string) => {
    if (status === 'completed') return <Check size={10} color="var(--accent)" strokeWidth={2.5} />;
    if (status === 'in_progress') return <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--info)', display: 'block' }} />;
    return null;
  };

  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 44, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Service in progress</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>·</span>
          <Mono style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Job {job.id?.slice(0, 8)}</Mono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={12} color="var(--text-muted)" strokeWidth={1.5} />
          <LiveClock />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px' }}>
        {/* Left: vehicle info + progress */}
        <div style={{ padding: '24px 28px', borderRight: '1px solid var(--border)' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)' }}>Now servicing</p>
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {job.year} {job.make} {job.model}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Mono style={{ fontSize: 12, padding: '2px 8px', border: '1px solid var(--border-strong)', borderRadius: 4, color: 'var(--text-primary)' }}>
              {job.license_plate}
            </Mono>
            {job.mechanic_name && (
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Mechanic: {job.mechanic_name}
              </span>
            )}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Job completion</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 38, fontWeight: 600, color: 'var(--accent)', fontFamily: 'Geist Mono, monospace', lineHeight: 1 }}>
                  {progress}
                </span>
                <span style={{ fontSize: 22, color: 'var(--text-secondary)' }}>%</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {completed} of {tasks.length} tasks
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Scheduled for</p>
              <Mono style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                {job.time_slot || '—'}
              </Mono>
            </div>
          </div>
          <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ height: '100%', width: progress + '%', background: 'var(--accent)', transition: 'width 0.6s ease', borderRadius: 3 }} />
          </div>

          {/* Services */}
          {job.services?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {job.services.map((s: any) => (
                <span key={s.id} style={{ fontSize: 11, padding: '2px 8px', border: '1px solid var(--border-strong)', borderRadius: 4, color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: task feed */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 20px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Activity</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{tasks.length} steps</span>
          </div>
          <ol style={{ flex: 1, padding: '16px 20px', margin: 0, listStyle: 'none', overflow: 'hidden' }}>
            {tasks.slice(0, 5).map((t: any, i: number) => {
              const done = t.status === 'completed';
              const inProg = t.status === 'in_progress';
              return (
                <li key={t.id} style={{ position: 'relative', paddingLeft: 24, paddingBottom: i < Math.min(tasks.length, 5) - 1 ? 14 : 0 }}>
                  {i < Math.min(tasks.length, 5) - 1 && (
                    <span style={{ position: 'absolute', left: 7, top: 20, bottom: 0, width: 1, background: 'var(--border)' }} />
                  )}
                  <span style={{
                    position: 'absolute', left: 0, top: 2,
                    width: 16, height: 16, borderRadius: '50%',
                    border: `1px solid ${done ? 'var(--accent)' : inProg ? 'var(--info)' : 'var(--border-strong)'}`,
                    background: done ? 'rgba(16,185,129,0.1)' : inProg ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {statusIcon(t.status)}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, color: done ? 'var(--text-secondary)' : inProg ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.4 }}>
                      {t.title || t.description || `Task ${i + 1}`}
                    </span>
                    <StatusBadge status={t.status === 'completed' ? 'completed' : t.status === 'in_progress' ? 'in_progress' : 'pending'} />
                  </div>
                </li>
              );
            })}
            {tasks.length === 0 && (
              <li style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 16 }}>
                No tasks yet
              </li>
            )}
          </ol>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <PrimaryButton onClick={onPay} style={{ gap: 6 }}>
              <CreditCard size={13} strokeWidth={1.5} />
              Pay now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Vehicle Garage ───────────────────────────────────────────────────────────
function VehicleGarage({ vehicles, onBook }: { vehicles: any[]; onBook: () => void }) {
  return (
    <Panel
      title="Garage"
      subtitle={`${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} registered`}
      action={
        <Link to="/customer/vehicles" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          View all →
        </Link>
      }
      noPad
    >
      {vehicles.length === 0 ? (
        <div style={{ padding: 20 }}>
          <EmptyState icon={Car} title="No vehicles yet" description="Add a vehicle to start booking services." actionLabel="Add vehicle" actionTo="/customer/vehicles" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(vehicles.length, 3)}, 1fr)` }}>
          {vehicles.slice(0, 3).map((v, i) => (
            <div
              key={v.id}
              style={{
                padding: '20px',
                borderRight: i < Math.min(vehicles.length, 3) - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v.year} {v.make}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{v.model}</p>
                </div>
                <Mono style={{ fontSize: 11, padding: '2px 7px', border: '1px solid var(--border-strong)', borderRadius: 4, color: 'var(--text-primary)' }}>
                  {v.license_plate}
                </Mono>
              </div>
              {/* Vehicle photo */}
              <div style={{
                height: 96, borderRadius: 4, marginBottom: 16, overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {v.photo_url
                  ? <img src={`${SERVER_URL}${v.photo_url}`} alt={`${v.make} ${v.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Car size={24} color="var(--text-muted)" strokeWidth={1.5} />
                }
              </div>
              <button
                onClick={onBook}
                style={{
                  width: '100%', height: 32, border: '1px solid var(--border-strong)', borderRadius: 6,
                  background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--border-strong)'; el.style.color = 'var(--text-secondary)'; }}
              >
                <CalendarPlus size={13} strokeWidth={1.5} />
                Book service
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ─── Service History ──────────────────────────────────────────────────────────
function ServiceHistory({ bookings }: { bookings: any[] }) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled' | 'pending'>('all');
  const filtered = useMemo(() => filter === 'all' ? bookings : bookings.filter(b => b.status === filter), [bookings, filter]);

  const tabs: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Panel
      title="Service history"
      subtitle="Your bookings"
      action={
        <div style={{ display: 'flex', gap: 2, border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                height: 28, padding: '0 10px', fontSize: 11, border: 'none', cursor: 'pointer',
                transition: 'all 0.1s', borderRight: '1px solid var(--border-strong)',
                background: filter === t.key ? 'var(--text-primary)' : 'transparent',
                color: filter === t.key ? 'var(--bg)' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
      noPad
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Clock} title="No bookings found" description="Your service history will appear here." />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Date', 'Services', 'Vehicle', 'Total', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-elevated)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s', cursor: 'pointer' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <Mono style={{ fontSize: 12 }}>{fmtDate(b.booking_date)}</Mono>
                </td>
                <td style={{ padding: '10px 16px', maxWidth: 280 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.services?.map((s: any) => s.name).join(', ') || b.service_type || '—'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {b.make} {b.model}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <Mono style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    {b.services_total ? fmtMoney(Number(b.services_total)) : '—'}
                  </Mono>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <StatusBadge status={b.status} />
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <Link to={`/customer/bookings`} style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

// ─── Invoices Panel ───────────────────────────────────────────────────────────
function InvoicesPanel({ invoices, onPay }: { invoices: any[]; onPay: (id: string) => void }) {
  const pending = invoices.filter((i) => i.status === 'unpaid' || i.status === 'pending');
  return (
    <Panel
      title="Invoices"
      subtitle={pending.length > 0 ? `${pending.length} requiring action` : 'All settled'}
      action={
        <Link to="/customer/invoices" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          View all →
        </Link>
      }
      noPad
    >
      {invoices.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices yet" description="Your invoices will appear here after services are completed." />
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {invoices.slice(0, 5).map((inv) => (
            <li
              key={inv.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, border: '1px solid var(--border-strong)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={14} color="var(--text-secondary)" strokeWidth={1.5} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Mono style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block' }}>INV-{inv.id.slice(0, 8)}</Mono>
                  <Mono style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                    {fmtDate(inv.issued_at)} · {inv.service_type || 'Service'}
                  </Mono>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <Mono style={{ fontSize: 14, color: 'var(--text-primary)' }}>{fmtMoney(Number(inv.total_amount))}</Mono>
                <StatusBadge status={inv.status} />
                {(inv.status === 'unpaid' || inv.status === 'pending') ? (
                  <PrimaryButton onClick={() => onPay(inv.id)} style={{ fontSize: 11, padding: '4px 10px', height: 28 }}>
                    Pay
                  </PrimaryButton>
                ) : (
                  <button style={{ width: 28, height: 28, border: '1px solid var(--border-strong)', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Download size={12} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, bRes, invRes, jRes] = await Promise.allSettled([
          api.get('/vehicles'),
          api.get('/bookings'),
          api.get('/misc/invoices/me'),
          api.get('/job-cards'),
        ]);
        const vs = vRes.status === 'fulfilled' ? vRes.value.data.data || [] : [];
        const bs = bRes.status === 'fulfilled' ? bRes.value.data.data || [] : [];
        const ins = invRes.status === 'fulfilled' ? invRes.value.data.data || [] : [];
        const jobs = jRes.status === 'fulfilled' ? jRes.value.data.data || [] : [];

        setVehicles(vs);
        setBookings(bs);
        setInvoices(ins);

        const inProgressJob = jobs.find((j: any) => j.status === 'in_progress');
        if (inProgressJob) {
          try {
            const jDetail = await api.get(`/job-cards/${inProgressJob.id}`);
            setActiveJob(jDetail.data.data);
          } catch {
            setActiveJob(inProgressJob);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePay = async (id: string) => {
    try {
      await api.patch(`/misc/invoices/${id}/pay`);
      setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: 'paid' } : inv));
    } catch (err) {
      console.error(err);
    } finally {
      setPayModal(null);
    }
  };

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const activeCount = bookings.filter((b) => b.status === 'approved' || b.status === 'pending' || b.status === 'in_progress').length;
  const pendingInvoices = invoices.filter((i) => i.status === 'unpaid' || i.status === 'pending');
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  if (loading) {
    return (
      <AppLayout title={`Welcome back, ${firstName}`} subtitle="Your vehicles and appointments." navLinks={customerNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ height: 280, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <SkeletonTable rows={3} /><SkeletonTable rows={3} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Your vehicles and appointments at a glance."
      navLinks={customerNav}
      actions={
        <Link to="/customer/book-service">
          <PrimaryButton>Book service</PrimaryButton>
        </Link>
      }
    >
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Active job hero */}
        {activeJob && (
          <ActiveJobHero job={activeJob} onPay={() => setPayModal(activeJob.id)} />
        )}

        {!activeJob && (
          <section style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 36, height: 36, border: '1px solid var(--border-strong)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={16} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>No active service in progress</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                Book a service to get started, or check back when your appointment begins.
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Link to="/customer/book-service"><SecondaryButton>Book service</SecondaryButton></Link>
            </div>
          </section>
        )}

        {/* KPI strip */}
        <KpiStrip cols={4} style={{ marginBottom: 0 }}>
          <KpiCell label="Registered vehicles" value={vehicles.length} sub={`${vehicles.length} in garage`} />
          <KpiCell label="Active appointments" value={activeCount} sub={activeCount > 0 ? 'Scheduled or pending' : 'None scheduled'} accent={activeCount > 0 ? 'var(--accent)' : undefined} />
          <KpiCell label="Completed services" value={completedCount} sub="Lifetime total" accent={completedCount > 0 ? 'var(--success)' : undefined} />
          <KpiCell label="Pending invoices" value={pendingInvoices.length} sub={pendingInvoices.length > 0 ? `${fmtMoney(pendingInvoices.reduce((s, i) => s + Number(i.total_amount), 0))} due` : 'All settled'} accent={pendingInvoices.length > 0 ? 'var(--warning)' : undefined} />
        </KpiStrip>

        {/* Garage */}
        <VehicleGarage vehicles={vehicles} onBook={() => {}} />

        {/* History + Invoices */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
          <ServiceHistory bookings={bookings} />
          <InvoicesPanel invoices={invoices} onPay={(id) => setPayModal(id)} />
        </div>
      </div>

      {/* Pay modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Confirm payment">
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Are you sure you want to pay this invoice? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <SecondaryButton onClick={() => setPayModal(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={() => payModal && handlePay(payModal)}>Confirm payment</PrimaryButton>
        </div>
      </Modal>
    </AppLayout>
  );
}
