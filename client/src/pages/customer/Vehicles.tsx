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
  EmptyState,
  StatusBadge,
  SkeletonTable,
} from '../../components/ui';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await api.delete(`/vehicles/${deletingId}`);
      toast.success('Vehicle removed');
      fetchVehicles();
      setDeletingId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove vehicle');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout
        title="My garage"
        subtitle="Manage your vehicles and their service history."
        navLinks={customerNav}
      >
        <SkeletonTable rows={5} />
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
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
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
                  <DangerTextButton onClick={() => setDeletingId(v.id)}>Remove</DangerTextButton>
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

        {deletingId && (
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
                maxWidth: '400px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  Remove Vehicle
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Are you sure you want to remove this vehicle? This action cannot be undone.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeletingId(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!deleting) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    if (!deleting) e.currentTarget.style.backgroundColor = '#ef4444';
                  }}
                >
                  {deleting ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
