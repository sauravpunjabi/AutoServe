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
import ServiceTags from '../../components/ui/ServiceTags';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import {
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  SuccessTextButton,
  DangerTextButton,
} from '../../components/ui/primitives';

export default function ManagerBookings() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal states
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [fetchingMechanics, setFetchingMechanics] = useState(false);
  const [submittingApproval, setSubmittingApproval] = useState(false);

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

  const fetchMechanics = async () => {
    if (!centerId) return;
    setFetchingMechanics(true);
    try {
      const res = await api.get(`/service-centers/${centerId}/mechanics`);
      const active = (res.data.data || []).filter((m: any) => m.status === 'active');
      setMechanics(active);
    } catch {
      toast.error('Failed to load mechanics');
    } finally {
      setFetchingMechanics(false);
    }
  };

  useEffect(() => {
    if (selectedBookingId && centerId) {
      fetchMechanics();
    }
  }, [selectedBookingId, centerId]);

  const handleApproveClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setSelectedMechanicId(null);
  };

  const handleConfirmApproval = async () => {
    if (!selectedBookingId || !selectedMechanicId) return;
    setSubmittingApproval(true);
    try {
      await api.patch(`/bookings/${selectedBookingId}/status`, {
        status: 'approved',
        mechanic_id: selectedMechanicId,
      });
      toast.success('Booking approved & mechanic assigned');
      setSelectedBookingId(null);
      setSelectedMechanicId(null);
      fetchBookings();
    } catch {
      toast.error('Failed to approve booking');
    } finally {
      setSubmittingApproval(false);
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

  if (loading || centerLoading) {
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
                  <td style={tdStyle}>
                    <ServiceTags services={b.services} serviceType={b.service_type} />
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={b.status} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {b.status === 'pending' && (
                      <>
                        <SuccessTextButton
                          onClick={() => handleApproveClick(b.id)}
                          disabled={updatingId === b.id}
                        >
                          Approve
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

      {selectedBookingId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '500px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                Approve & Assign Mechanic
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Select an active mechanic to assign to this booking.
              </p>
            </div>

            {fetchingMechanics ? (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, textAlign: 'center', padding: '20px 0' }}>
                Loading active mechanics...
              </p>
            ) : mechanics.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                  No active mechanics available
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  Please activate or register mechanics under the "Mechanics" page first.
                </p>
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {mechanics.map((m) => {
                      const isSelected = selectedMechanicId === m.id;
                      return (
                        <tr
                          key={m.id}
                          onClick={() => setSelectedMechanicId(m.id)}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'var(--accent-subtle)' : 'transparent',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={{ ...tdStyle, borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent', padding: '10px 12px' }}>
                            <div style={{ fontWeight: 500, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                              {m.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {m.email}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedBookingId(null);
                  setSelectedMechanicId(null);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedMechanicId || submittingApproval}
                onClick={handleConfirmApproval}
                style={{
                  padding: '8px 16px',
                  backgroundColor: !selectedMechanicId ? 'var(--border)' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: !selectedMechanicId ? 'not-allowed' : 'pointer',
                  opacity: !selectedMechanicId ? 0.6 : 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (selectedMechanicId) e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                }}
                onMouseLeave={(e) => {
                  if (selectedMechanicId) e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
              >
                {submittingApproval ? 'Approving…' : 'Approve & Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
