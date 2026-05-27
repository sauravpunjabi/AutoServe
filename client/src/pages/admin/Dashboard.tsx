import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { adminNav } from '../../lib/nav';
import {
  KpiStrip,
  KpiCell,
  Panel,
  EmptyState,
  StatusBadge,
  SkeletonStatCard,
  Skeleton,
  Mono,
  CapacityBar,
  GhostButton,
} from '../../components/ui';
import { Building2, TrendingUp, Store, Map } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

function fmtMoney(n: number) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const chartTooltipStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-strong)',
  borderRadius: '6px',
  fontSize: '12px',
  color: 'var(--text-primary)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
};

// ─── Revenue Chart ────────────────────────────────────────────────────────────
function RevenueChart({ data }: { data: { name: string; revenue: number }[] }) {
  const [period, setPeriod] = useState('30d');
  const periods = ['7D', '30D', '90D', '1Y'];

  return (
    <Panel
      title="Revenue"
      subtitle="All centers · gross by service center"
      action={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden' }}>
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p.toLowerCase())}
                style={{
                  height: 28, padding: '0 10px', fontSize: 11, border: 'none', cursor: 'pointer',
                  borderRight: p !== '1Y' ? '1px solid var(--border-strong)' : 'none',
                  background: period === p.toLowerCase() ? 'var(--text-primary)' : 'transparent',
                  color: period === p.toLowerCase() ? 'var(--bg)' : 'var(--text-secondary)',
                  transition: 'all 0.1s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <GhostButton style={{ height: 28, padding: '0 10px', fontSize: 11 }}>
            <Store size={12} strokeWidth={1.5} />Export
          </GhostButton>
        </div>
      }
    >
      {data.length === 0 ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState icon={TrendingUp} title="No revenue data" description="Revenue data will appear here once bookings are invoiced." />
        </div>
      ) : (
        <div style={{ height: 240, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(249,115,22,0.04)' }} />
              <Bar dataKey="revenue" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

// ─── Bookings Over Time Chart ─────────────────────────────────────────────────
function BookingsChart({ data }: { data: { name: string; bookings: number }[] }) {
  return (
    <Panel title="Bookings" subtitle="Daily volume over time" action={<TrendingUp size={14} color="var(--text-muted)" strokeWidth={1.5} />}>
      {data.length === 0 ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState icon={TrendingUp} title="No booking data" description="Booking trends will appear here." />
        </div>
      ) : (
        <div style={{ height: 240, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={chartTooltipStyle} cursor={{ stroke: 'rgba(249,115,22,0.1)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="bookings" stroke="var(--accent)" fill="url(#orangeGradient)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
const SEV_MAP: Record<string, { fg: string; label: string }> = {
  ok:   { fg: 'var(--success)', label: 'OK' },
  info: { fg: 'var(--info)',    label: 'Info' },
  warn: { fg: 'var(--warning)', label: 'Warn' },
  crit: { fg: 'var(--danger)',  label: 'Crit' },
};

const EVENT_POOL = [
  { msg: 'Job card status updated to in_progress', sev: 'info', center: 'SF-MISSION' },
  { msg: 'New booking submitted and pending approval', sev: 'info', center: 'OAK-DT' },
  { msg: 'Invoice paid by customer', sev: 'ok', center: 'SF-SUNSET' },
  { msg: 'Inventory item below reorder threshold', sev: 'warn', center: 'SJ-NORTH' },
  { msg: 'Job card completed — customer handoff', sev: 'ok', center: 'SF-MISSION' },
  { msg: 'Mechanic utilization at 90%', sev: 'warn', center: 'BRK-WEST' },
  { msg: 'New service center registered', sev: 'info', center: 'PAL-EMBR' },
  { msg: 'Booking approved and job card created', sev: 'ok', center: 'OAK-DT' },
];

function ActivityFeed() {
  const [items, setItems] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return EVENT_POOL.slice(0, 6).map((e, i) => ({
      ...e,
      t: `${pad(now.getHours())}:${pad(Math.max(0, now.getMinutes() - i * 2))}:${pad(Math.floor(Math.random() * 60))}`,
    }));
  });

  useEffect(() => {
    const i = setInterval(() => {
      const ev = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setItems((arr) => [{ ...ev, t }, ...arr].slice(0, 30));
    }, 4500);
    return () => clearInterval(i);
  }, []);

  return (
    <Panel
      title="Activity"
      subtitle="Live across all centers"
      action={
        <span style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          Connected
        </span>
      }
      noPad
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 340, overflowY: 'auto' }}>
        {items.map((ev, i) => {
          const s = SEV_MAP[ev.sev] || SEV_MAP.info;
          return (
            <li
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 20px', borderBottom: '1px solid var(--border)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Mono style={{ fontSize: 11, color: 'var(--text-muted)', width: 64, flexShrink: 0, paddingTop: 1 }}>{ev.t}</Mono>
              <span style={{ fontSize: 11, color: s.fg, width: 32, flexShrink: 0, paddingTop: 1 }}>{s.label}</span>
              <Mono style={{ fontSize: 11, color: 'var(--text-secondary)', width: 90, flexShrink: 0, paddingTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ev.center}
              </Mono>
              <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>{ev.msg}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

// ─── Centers Table ────────────────────────────────────────────────────────────
function CentersTable({ centers }: { centers: any[] }) {
  return (
    <Panel
      title="Service centers"
      subtitle={`${centers.length} registered`}
      action={
        <div style={{ display: 'flex', gap: 8 }}>
          <GhostButton style={{ height: 28, padding: '0 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Map size={12} strokeWidth={1.5} />Map view
          </GhostButton>
        </div>
      }
      noPad
    >
      {centers.length === 0 ? (
        <EmptyState icon={Building2} title="No service centers" description="Registered centers will appear here." />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Center', 'Location', 'Manager', 'Rating', 'Status', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-elevated)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {centers.map((c) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '10px 16px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</p>
                      <Mono style={{ fontSize: 11, display: 'block', marginTop: 1 }}>{c.id?.slice(0, 8)}</Mono>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: 13 }}>
                    {c.city || c.address || '—'}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {c.manager_name || '—'}
                  </td>
                  <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                      <Mono style={{ fontSize: 13, color: Number(c.average_rating) >= 4 ? 'var(--success)' : Number(c.average_rating) >= 3 ? 'var(--warning)' : 'var(--danger)' }}>
                        {Number(c.average_rating).toFixed(1)}
                      </Mono>
                      <div style={{ width: 60 }}>
                        <CapacityBar value={(Number(c.average_rating) / 5) * 100} color={Number(c.average_rating) >= 4 ? 'var(--success)' : 'var(--warning)'} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <StatusBadge status={c.status || 'active'} />
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <button style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

// ─── System Health ────────────────────────────────────────────────────────────
const SYSTEM_SERVICES = [
  { name: 'API Gateway',        status: 'ok',   latency: '42ms',  uptime: '99.99%' },
  { name: 'PostgreSQL Primary', status: 'ok',   latency: '8ms',   uptime: '99.97%' },
  { name: 'Auth Service',       status: 'ok',   latency: '18ms',  uptime: '99.98%' },
  { name: 'Payment Gateway',    status: 'warn', latency: '780ms', uptime: '99.42%' },
  { name: 'File Storage',       status: 'ok',   latency: '23ms',  uptime: '99.99%' },
  { name: 'Email Service',      status: 'ok',   latency: '67ms',  uptime: '99.91%' },
];

function SystemHealth() {
  const sevColor: Record<string, string> = { ok: 'var(--success)', warn: 'var(--warning)', crit: 'var(--danger)' };
  return (
    <Panel title="System health" subtitle="All services · live" noPad>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {SYSTEM_SERVICES.map((s, i) => (
          <li
            key={s.name}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
              borderBottom: i < SYSTEM_SERVICES.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sevColor[s.status], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
            <Mono style={{ fontSize: 12, color: 'var(--text-secondary)', width: 60, textAlign: 'right' }}>{s.latency}</Mono>
            <Mono style={{ fontSize: 12, color: 'var(--text-muted)', width: 60, textAlign: 'right' }}>{s.uptime}</Mono>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ─── Top Services ─────────────────────────────────────────────────────────────
function TopServices({ data }: { data: { name: string; bookings: number }[] }) {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  const max = Math.max(...sorted.map((r) => r.bookings));
  return (
    <Panel title="Top services" subtitle="By booking volume" noPad>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {sorted.map((r) => (
          <li key={r.name} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{r.name}</span>
              <Mono style={{ fontSize: 13, color: 'var(--text-primary)', flexShrink: 0 }}>{r.bookings}×</Mono>
            </div>
            <CapacityBar value={(r.bookings / max) * 100} color="var(--accent)" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, centersRes] = await Promise.allSettled([
          api.get('/misc/admin/analytics'),
          api.get('/service-centers'),
        ]);
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data.data);
        if (centersRes.status === 'fulfilled') setCenters(centersRes.value.data.data || []);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Overview" subtitle="System-wide metrics and performance." navLinks={adminNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}><Skeleton width="150px" height="13px" /></div>
              <div style={{ padding: 20 }}><Skeleton width="100%" height="240px" /></div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}><Skeleton width="120px" height="13px" /></div>
              <div style={{ padding: 20 }}><Skeleton width="100%" height="240px" /></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalRevenue = Number(analytics?.stats?.revenue || 0);
  const revenuePerCenter: { name: string; revenue: number }[] = analytics?.revenuePerCenter || [];
  const bookingsOverTime: { name: string; bookings: number }[] = analytics?.bookingsOverTime || [];

  return (
    <AppLayout title="Overview" subtitle="System-wide metrics and performance." navLinks={adminNav}>
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI strip */}
        <KpiStrip cols={4} style={{ marginBottom: 0 }}>
          <KpiCell label="Registered users" value={analytics?.stats?.users ?? '—'} sub="All accounts" />
          <KpiCell label="Total bookings" value={analytics?.stats?.bookings ?? '—'} sub="All time" />
          <KpiCell label="Total revenue" value={fmtMoney(totalRevenue)} sub="Cumulative" mono accent="var(--accent)" />
          <KpiCell label="Service centers" value={centers.length} sub="Registered" accent={centers.length > 0 ? 'var(--success)' : undefined} />
        </KpiStrip>

        {/* Charts + Activity feed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <RevenueChart data={revenuePerCenter} />
          <BookingsChart data={bookingsOverTime} />
        </div>

        {/* Activity feed */}
        <ActivityFeed />

        {/* Centers table */}
        <CentersTable centers={centers} />

        {/* Top services + system health */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <TopServices data={bookingsOverTime} />
          <SystemHealth />
        </div>
      </div>
    </AppLayout>
  );
}
