import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { Card, SectionLabel, TextSelect, TextLink, Mono, StatusBadge, Skeleton, SkeletonText } from '../../components/ui';
import { ArrowLeft } from 'lucide-react';
import ServiceTags from '../../components/ui/ServiceTags';

const dtStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  margin: 0,
};

const ddStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-primary)',
  margin: '4px 0 0',
};

export default function ManagerBookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [jobCardId, setJobCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data);
        if (res.data.data?.status === 'approved') {
          const jobsRes = await api.get('/job-cards');
          const job = (jobsRes.data.data || []).find((j: any) => j.booking_id === id);
          if (job) setJobCardId(job.id);
        }
      } catch {
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const updateStatus = async (status: string) => {
    setSubmittingStatus(true);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.data);
      if (status === 'approved') {
        const jobsRes = await api.get('/job-cards');
        const job = (jobsRes.data.data || []).find((j: any) => j.booking_id === id);
        if (job) setJobCardId(job.id);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Booking" subtitle="Booking details." navLinks={managerNav}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="100px" height="14px" />
              <SkeletonText lines={4} />
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="120px" height="14px" />
              <SkeletonText lines={3} />
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout title="Booking" subtitle="Booking details." navLinks={managerNav}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Booking not found.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Booking" subtitle={`#${id?.slice(0, 8)}`} navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Link
          to="/manager/bookings"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to schedule
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <Card>
            <SectionLabel>Booking</SectionLabel>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <dt style={dtStyle}>Service</dt>
                <dd style={{ margin: '4px 0 0' }}>
                  <ServiceTags services={booking.services} serviceType={booking.service_type} />
                </dd>
              </div>
              {Array.isArray(booking.services) && booking.services.length > 0 && (
                <div>
                  <dt style={dtStyle}>Services breakdown</dt>
                  <dd style={{ margin: '4px 0 0' }}>
                    {booking.services.map((s: any) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          padding: '3px 0',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>{s.name}</span>
                        <span style={{ fontFamily: 'DM Mono, monospace' }}>
                          ₹{Number(s.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: '4px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Subtotal</span>
                      <span style={{ fontFamily: 'DM Mono, monospace' }}>
                        ₹{Number(booking.services_total || 0).toLocaleString()}
                      </span>
                    </div>
                  </dd>
                </div>
              )}
              <div>
                <dt style={dtStyle}>Date</dt>
                <dd style={ddStyle}>
                  {new Date(booking.booking_date).toLocaleDateString()} · {booking.time_slot?.slice?.(0, 5)}
                </dd>
              </div>
              <div>
                <dt style={dtStyle}>Status</dt>
                <dd style={{ margin: '4px 0 0' }}>
                  <StatusBadge status={booking.status} />
                </dd>
              </div>
              {booking.notes && (
                <div>
                  <dt style={dtStyle}>Notes</dt>
                  <dd style={{ ...ddStyle, color: 'var(--text-secondary)' }}>{booking.notes}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <SectionLabel>Customer & vehicle</SectionLabel>
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <dt style={dtStyle}>Customer</dt>
                <dd style={ddStyle}>{booking.customer_name}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Email</dt>
                <dd style={{ ...ddStyle, color: 'var(--text-secondary)' }}>{booking.customer_email}</dd>
              </div>
              <div>
                <dt style={dtStyle}>Vehicle</dt>
                <dd style={{ margin: '4px 0 0' }}>
                  <Mono>
                    {booking.year} {booking.make} {booking.model} · {booking.license_plate}
                  </Mono>
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <TextSelect
            value={booking.status}
            disabled={submittingStatus}
            onChange={(e) => updateStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </TextSelect>
          {submittingStatus && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Updating…</span>
          )}
          {jobCardId && <TextLink to={`/manager/job-cards/${jobCardId}`}>View job card →</TextLink>}
        </div>
      </div>
    </AppLayout>
  );
}
