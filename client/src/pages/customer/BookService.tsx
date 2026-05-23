import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import {
  Card,
  SectionLabel,
  PrimaryButton,
  TextInput,
  TextSelect,
  TextLink,
} from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';

const labelStyle = { display: 'block', marginBottom: '20px' } as const;

export default function CustomerBookService() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_center_id: '',
    service_type: '',
    booking_date: '',
    time_slot: '09:00',
  });
  const [submitting, setSubmitting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/service-centers')])
      .then(([vRes, cRes]) => {
        setVehicles(vRes.data.data || []);
        setCenters(cRes.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoad(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/bookings', formData);
      navigate('/customer/bookings');
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoad) {
    return (
      <AppLayout
        title="Book a service"
        subtitle="Schedule an appointment at your preferred service center."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Book a service"
      subtitle="Schedule an appointment at your preferred service center."
      navLinks={customerNav}
    >
      <div style={{ maxWidth: '640px' }}>
        <Card>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>
              <SectionLabel>Select vehicle</SectionLabel>
              {vehicles.length === 0 ? (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warning)' }}>
                  You need to add a vehicle first.{' '}
                  <TextLink to="/customer/vehicles">Go to your garage</TextLink>
                </p>
              ) : (
                <TextSelect
                  required
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                >
                  <option value="" disabled>
                    Choose your vehicle…
                  </option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.license_plate})
                    </option>
                  ))}
                </TextSelect>
              )}
            </label>

            <label style={labelStyle}>
              <SectionLabel>Service center</SectionLabel>
              <TextSelect
                required
                value={formData.service_center_id}
                onChange={(e) => setFormData({ ...formData, service_center_id: e.target.value })}
              >
                <option value="" disabled>
                  Choose a location…
                </option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.location}
                  </option>
                ))}
              </TextSelect>
            </label>

            <label style={labelStyle}>
              <SectionLabel>Service type</SectionLabel>
              <TextSelect
                required
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              >
                <option value="" disabled>
                  What do you need?
                </option>
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="General Diagnostics">General Diagnostics</option>
                <option value="Battery Replacement">Battery Replacement</option>
              </TextSelect>
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <label style={{ display: 'block' }}>
                <SectionLabel>Date</SectionLabel>
                <TextInput
                  type="date"
                  required
                  value={formData.booking_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                />
              </label>
              <label style={{ display: 'block' }}>
                <SectionLabel>Time slot</SectionLabel>
                <TextSelect
                  required
                  value={formData.time_slot}
                  onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                </TextSelect>
              </label>
            </div>

            <div
              style={{
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                You will receive a confirmation shortly.
              </p>
              <PrimaryButton type="submit" disabled={submitting || vehicles.length === 0}>
                {submitting ? 'Confirming…' : 'Confirm booking'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
