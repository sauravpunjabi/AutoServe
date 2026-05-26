import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { adminNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import { GridStats, StatCard, Card, SectionLabel } from '../../components/ui/primitives';
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
  backgroundColor: '#0d1825',
  border: '1px solid #1a2d40',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e8f4f8',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
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

  return (
    <AppLayout title="Overview" subtitle="System-wide metrics and performance." navLinks={adminNav}>
      <GridStats>
        <StatCard
          label="Total users"
          value={analytics?.stats?.users ?? '—'}
          icon={Users}
        />
        <StatCard
          label="Total bookings"
          value={analytics?.stats?.bookings ?? '—'}
          icon={CalendarCheck}
        />
        <StatCard
          label="Total revenue"
          value={`$${Number(analytics?.stats?.revenue || 0).toLocaleString()}`}
          icon={DollarSign}
        />
      </GridStats>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SectionLabel>Revenue per center</SectionLabel>
            <Store size={16} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <div style={{ height: '256px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.revenuePerCenter || []}>
                <defs>
                  <linearGradient id="tealBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00b4aa" stopOpacity={1} />
                    <stop offset="100%" stopColor="#00b4aa" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a2d40" />
                <XAxis dataKey="name" tick={{ fill: '#3d5a6e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#3d5a6e', fontSize: 11 }} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(0,180,170,0.06)' }} />
                <Bar dataKey="revenue" fill="url(#tealBarGradient)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SectionLabel>Bookings over time</SectionLabel>
            <TrendingUp size={16} color="var(--text-muted)" strokeWidth={1.5} />
          </div>
          <div style={{ height: '256px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.bookingsOverTime || []}>
                <defs>
                  <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00b4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a2d40" />
                <XAxis dataKey="name" tick={{ fill: '#3d5a6e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#3d5a6e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={chartTooltipStyle} cursor={{ stroke: 'rgba(0,180,170,0.2)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00b4aa"
                  fill="url(#tealGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#00b4aa', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
