import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { Calendar } from 'lucide-react';
import {
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  SuccessTextButton,
  DangerTextButton,
} from '../../components/ui/primitives';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Schedule" subtitle="Manage incoming service requests." navLinks={managerNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Schedule" subtitle="Manage incoming service requests." navLinks={managerNav}>
      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings"
          description="Bookings from customers will appear here."
        />
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <td style={tdStyle}>
                    <Link
                      to={`/manager/bookings/${b.id}`}
                      style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {new Date(b.booking_date).toLocaleDateString()}
                    </Link>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                    {b.time_slot?.slice?.(0, 5) || b.time_slot}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                    {b.make} {b.model}
                  </td>
                  <td style={tdStyle}>{b.service_type}</td>
                  <td style={tdStyle}>
                    <StatusBadge status={b.status} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {b.status === 'pending' && (
                      <>
                        <SuccessTextButton
                          onClick={() => updateStatus(b.id, 'approved')}
                          disabled={updatingId === b.id}
                        >
                          {updatingId === b.id ? 'Updating…' : 'Approve'}
                        </SuccessTextButton>
                        <DangerTextButton
                          onClick={() => updateStatus(b.id, 'rejected')}
                          disabled={updatingId === b.id}
                        >
                          Reject
                        </DangerTextButton>
                      </>
                    )}
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
