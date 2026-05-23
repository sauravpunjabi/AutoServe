import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { adminNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import { GridStats, Card, SectionLabel } from '../../components/ui/primitives';
import { Users, CalendarCheck, DollarSign, Store, TrendingUp } from 'lucide-react';
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

const chartTooltipStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: '12px',
  color: 'var(--text-primary)',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/misc/admin/analytics');
        setAnalytics(response.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Overview" subtitle="System-wide metrics and performance." navLinks={adminNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  const statCards = [
    { label: 'Total users', value: analytics?.stats?.users ?? '—' },
    { label: 'Total bookings', value: analytics?.stats?.bookings ?? '—' },
    {
      label: 'Total revenue',
      value: `$${Number(analytics?.stats?.revenue || 0).toLocaleString()}`,
    },
  ];

  const statIcons = [Users, CalendarCheck, DollarSign];

  return (
    <AppLayout title="Overview" subtitle="System-wide metrics and performance." navLinks={adminNav}>
      <GridStats>
        {statCards.map(({ label, value }, i) => {
          const Icon = statIcons[i];
          return (
            <div
              key={label}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 8px',
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {value}
                </p>
              </div>
              <Icon size={18} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
          );
        })}
      </GridStats>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <SectionLabel>Revenue per center</SectionLabel>
            <Store size={16} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <div style={{ height: '256px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.revenuePerCenter || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e1e" />
                <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 12 }} />
                <YAxis tick={{ fill: '#555', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <SectionLabel>Bookings over time</SectionLabel>
            <TrendingUp size={16} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <div style={{ height: '256px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.bookingsOverTime || []}>
                <defs>
                  <linearGradient id="bookingsOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e1e" />
                <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 12 }} />
                <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#f97316"
                  fill="url(#bookingsOrange)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
