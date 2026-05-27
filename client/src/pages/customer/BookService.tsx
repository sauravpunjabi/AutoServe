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
  SkeletonText,
} from '../../components/ui';

const labelStyle = { display: 'block', marginBottom: '20px' } as const;

export default function CustomerBookService() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_center_id: '',
    booking_date: '',
    time_slot: '09:00',
  });
  const [submitting, setSubmitting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.get('/vehicles'), api.get('/service-centers'), api.get('/services')])
      .then(([vRes, cRes, sRes]) => {
        if (vRes.status === 'fulfilled') setVehicles(vRes.value.data.data || []);
        if (cRes.status === 'fulfilled') setCenters(cRes.value.data.data || []);
        if (sRes.status === 'fulfilled') setServices(sRes.value.data.data || []);
      })
      .finally(() => setInitialLoad(false));
  }, []);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const estimatedTotal = services
    .filter((s) => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + Number(s.base_price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      toast.error('Select at least one service.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings', { ...formData, service_ids: selectedServiceIds });
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
        <div style={{ maxWidth: '640px' }}>
          <SkeletonText lines={10} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Book a service"
      subtitle="Schedule an appointment at your preferred service center."
      navLinks={customerNav}
    >
      <div style={{ maxWidth: '640px', animation: 'fadeInUp 0.25s ease forwards' }}>
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
                  <option value="" disabled>Choose your vehicle…</option>
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
                <option value="" disabled>Choose a location…</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.address}
                  </option>
                ))}
              </TextSelect>
            </label>

            <div style={{ marginBottom: '20px' }}>
              <SectionLabel>Select services</SectionLabel>
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                {services.map((s, i) => {
                  const checked = selectedServiceIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        borderBottom:
                          i < services.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        backgroundColor: checked ? 'var(--accent-subtle)' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(s.id)}
                        style={{ marginTop: '3px', accentColor: 'var(--accent)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {s.name}
                        </p>
                        {s.description && (
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {s.description}
                          </p>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--accent)',
                          whiteSpace: 'nowrap',
                          fontFamily: 'DM Mono, monospace',
                        }}
                      >
                        ₹{Number(s.base_price).toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedServiceIds.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 4px 0',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'DM Mono, monospace',
                    }}
                  >
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

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
              <PrimaryButton
                type="submit"
                disabled={submitting || vehicles.length === 0 || selectedServiceIds.length === 0}
              >
                {submitting ? 'Confirming…' : 'Confirm booking'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
