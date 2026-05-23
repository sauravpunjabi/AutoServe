import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import {
  Card,
  SectionLabel,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  DangerTextButton,
} from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { Car, Plus } from 'lucide-react';

const labelStyle = { display: 'block', marginBottom: '16px' } as const;

export default function CustomerVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/vehicles', formData);
      setShowForm(false);
      setFormData({ make: '', model: '', year: new Date().getFullYear(), license_plate: '' });
      fetchVehicles();
      toast.success('Vehicle added');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
      toast.success('Vehicle removed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove vehicle');
    }
  };

  if (loading) {
    return (
      <AppLayout
        title="My garage"
        subtitle="Manage your vehicles and their service history."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="My garage"
      subtitle="Manage your vehicles and their service history."
      navLinks={customerNav}
      actions={
        <SecondaryButton onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} />
          {showForm ? 'Cancel' : 'Add vehicle'}
        </SecondaryButton>
      }
    >
      {showForm && (
        <Card style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Add new vehicle
          </p>
          <form onSubmit={handleAdd}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <label style={labelStyle}>
                <SectionLabel>Make</SectionLabel>
                <TextInput
                  required
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g. Toyota"
                />
              </label>
              <label style={labelStyle}>
                <SectionLabel>Model</SectionLabel>
                <TextInput
                  required
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. Camry"
                />
              </label>
              <label style={labelStyle}>
                <SectionLabel>Year</SectionLabel>
                <TextInput
                  required
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </label>
              <label style={labelStyle}>
                <SectionLabel>License plate</SectionLabel>
                <TextInput
                  required
                  type="text"
                  value={formData.license_plate}
                  onChange={(e) =>
                    setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. ABC-1234"
                  style={{ textTransform: 'uppercase' }}
                />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <PrimaryButton type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save vehicle'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center' }}>
          <EmptyState
            icon={Car}
            title="Your garage is empty"
            description="Add a vehicle to start booking services."
          />
          <PrimaryButton type="button" onClick={() => setShowForm(true)} style={{ marginTop: '16px' }}>
            Add a vehicle now
          </PrimaryButton>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {vehicles.map((v) => (
            <Card key={v.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--bg-hover)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {v.make.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {v.year} {v.make}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {v.model}
                    </p>
                  </div>
                </div>
                <DangerTextButton onClick={() => handleDelete(v.id)}>Remove</DangerTextButton>
              </div>
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                  {v.license_plate}
                </span>
                <StatusBadge status="active" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
