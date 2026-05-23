import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import {
  Card,
  StatCard,
  Mono,
  GridStats,
  TextLink,
} from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { Car, Calendar, Clock } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, bRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/bookings'),
        ]);
        setVehicles(vRes.data.data || []);
        setBookings(bRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const activeCount = bookings.filter(
    (b) => b.status === 'approved' || b.status === 'pending'
  ).length;

  if (loading) {
    return (
      <AppLayout
        title="Overview"
        subtitle="Your vehicles and appointments at a glance."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <AppLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Here is what's happening with your vehicles today."
      navLinks={customerNav}
      actions={<TextLink to="/customer/book-service">Book service</TextLink>}
    >
      <Card style={{ marginBottom: '24px' }}>
        <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Need a tune up?
        </p>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px' }}>
          Book a certified AutoServe mechanic and track your vehicle's service in real time.
        </p>
        <TextLink to="/customer/book-service">Book new service →</TextLink>
      </Card>

      <GridStats>
        <StatCard label="Registered vehicles" value={vehicles.length} />
        <StatCard label="Completed services" value={completedCount} />
        <StatCard label="Active appointments" value={activeCount} />
      </GridStats>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} color="var(--accent)" />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Your garage
              </p>
            </div>
            <TextLink to="/customer/vehicles">View all</TextLink>
          </div>

          {vehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No vehicles yet"
              description="Add a vehicle to start booking services."
              actionLabel="Add vehicle"
              actionTo="/customer/vehicles"
            />
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {vehicles.map((v, i) => (
                <li
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < vehicles.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {v.year} {v.make} {v.model}
                    </p>
                    <Mono style={{ display: 'block', marginTop: '4px' }}>{v.license_plate}</Mono>
                  </div>
                  <StatusBadge status="active" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent)" />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent appointments
              </p>
            </div>
            <TextLink to="/customer/bookings">History</TextLink>
          </div>

          {bookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No bookings yet"
              description="Schedule your first service appointment."
              actionLabel="Book service"
              actionTo="/customer/book-service"
            />
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {bookings.slice(0, 4).map((b, i) => (
                <li
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < Math.min(bookings.length, 4) - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {b.service_type}
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={12} color="var(--text-muted)" />
                      {new Date(b.booking_date).toLocaleDateString()} at {b.time_slot}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
