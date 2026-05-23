import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import StatusBadge from '../../components/ui/StatusBadge';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import {
  GridStats,
  StatCard,
  SectionLabel,
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  TextLink,
} from '../../components/ui/primitives';

export default function ManagerDashboard() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [stats, setStats] = useState({ pending: 0, activeJobs: 0, lowStock: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, jobsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/job-cards'),
        ]);
        const bookings = bookingsRes.data.data || [];
        const jobs = jobsRes.data.data || [];
        setStats({
          pending: bookings.filter((b: any) => b.status === 'pending').length,
          activeJobs: jobs.filter((j: any) => j.status !== 'completed').length,
          lowStock: 0,
        });
        setRecentBookings(bookings.slice(0, 5));

        if (centerId) {
          const invRes = await api.get(`/inventory/${centerId}`);
          const items = invRes.data.data || [];
          setStats((s) => ({
            ...s,
            lowStock: items.filter(
              (i: any) => i.quantity < (i.low_stock_threshold || 10)
            ).length,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!centerLoading) fetchData();
  }, [centerId, centerLoading]);

  if (loading || centerLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your service center." navLinks={managerNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard" subtitle="Overview of your service center." navLinks={managerNav}>
      <GridStats>
        <StatCard label="Pending bookings" value={stats.pending} />
        <StatCard label="Active job cards" value={stats.activeJobs} />
        <StatCard label="Low stock items" value={stats.lowStock} />
      </GridStats>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <SectionLabel>Recent bookings</SectionLabel>
        <TextLink to="/manager/bookings">View all</TextLink>
      </div>

      {recentBookings.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No bookings yet.</p>
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <TableRow key={b.id}>
                  <td style={tdStyle}>{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{b.service_type}</td>
                  <td style={{ ...tdStyle, fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {b.make} {b.model}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={b.status} />
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </AppLayout>
  );
}
