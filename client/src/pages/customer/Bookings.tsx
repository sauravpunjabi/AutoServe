import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import { Card, PrimaryButton, SecondaryButton } from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { Calendar, Clock } from 'lucide-react';
import ServiceTags from '../../components/ui/ServiceTags';

export default function CustomerBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout
        title="My appointments"
        subtitle="Track your service history and upcoming visits."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="My appointments"
      subtitle="Track your service history and upcoming visits."
      navLinks={customerNav}
      actions={
        <PrimaryButton type="button" onClick={() => navigate('/customer/book-service')}>
          Book new service
        </PrimaryButton>
      }
    >
      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments found"
          description="You don't have any past or upcoming services."
          actionLabel="Book new service"
          actionTo="/customer/book-service"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map((b) => (
            <Card key={b.id} style={{ padding: '20px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <ServiceTags services={b.services} serviceType={b.service_type} />
                    <StatusBadge status={b.status} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {new Date(b.booking_date).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      {b.time_slot}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {b.status === 'approved' && (
                    <Link to={`/customer/job-tracker/${b.id}`} style={{ textDecoration: 'none' }}>
                      <SecondaryButton type="button">Track job</SecondaryButton>
                    </Link>
                  )}
                  {b.status === 'completed' && (
                    <Link to="/customer/invoices" style={{ textDecoration: 'none' }}>
                      <SecondaryButton type="button">View invoice</SecondaryButton>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
