import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
const photoSrc = (path: string | null) => (path ? `${SERVER_URL}${path}` : null);

import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import {
  Card,
  PrimaryButton,
  SecondaryButton,
  TextInput,
  DangerTextButton,
  EmptyState,
  SkeletonTable,
} from '../../components/ui';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
      {children}
    </label>
  );
}
import { Car, Plus, Camera } from 'lucide-react';


function resizeImageToDataUrl(file: File, maxW = 800, maxH = 560): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function VehicleCard({ v, onDelete, onPhotoUpdated }: {
  v: any;
  onDelete: (id: string) => void;
  onPhotoUpdated: (id: string, photoUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const res = await api.patch(`/vehicles/${v.id}/photo`, { photo_url: dataUrl });
      onPhotoUpdated(v.id, res.data.photo_url);
      toast.success('Photo updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Card>
      {/* Photo area — click to upload */}
      <div
        style={{ position: 'relative', marginBottom: '14px', cursor: 'pointer' }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <div style={{
          height: '140px', borderRadius: '2px',
          border: `1px solid ${hovering ? 'var(--border-strong)' : 'var(--border)'}`,
          backgroundColor: 'var(--bg-elevated)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          transition: 'border-color 0.15s ease',
        }}>
          {v.photo_url
            ? <img src={photoSrc(v.photo_url)!} alt={`${v.make} ${v.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Car size={28} color="var(--text-muted)" strokeWidth={1.5} />
          }

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(11,14,20,0.65)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
            opacity: uploading || hovering ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}>
            {uploading
              ? <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fafafa', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : <Camera size={18} color="#fafafa" strokeWidth={1.5} />
            }
            <span style={{ fontSize: '11px', color: '#fafafa', fontWeight: 500 }}>
              {uploading ? 'Uploading…' : v.photo_url ? 'Change photo' : 'Add photo'}
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {v.year} {v.make}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {v.model}
          </p>
        </div>
        <DangerTextButton onClick={() => onDelete(v.id)}>Remove</DangerTextButton>
      </div>

      <div style={{
        marginTop: '12px', paddingTop: '12px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>
          {v.license_plate}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {v.photo_url ? 'Photo added' : 'No photo'}
        </span>
      </div>
    </Card>
  );
}

export default function CustomerVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    make: '', model: '', year: new Date().getFullYear(), license_plate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchVehicles(); }, []);

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
      toast.error(err.response?.data?.message || 'Failed to remove vehicle');
    } finally {
      setDeleting(false);
    }
  };

  const handlePhotoUpdated = (id: string, photoUrl: string) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, photo_url: photoUrl } : v));
  };

  if (loading) {
    return (
      <AppLayout title="My garage" subtitle="Manage your vehicles." navLinks={customerNav}>
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
      {showForm && (
        <Card style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Add new vehicle
          </p>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <FieldLabel>Make</FieldLabel>
                <TextInput required type="text" value={formData.make}
                  onChange={e => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g. Toyota" />
              </div>
              <div>
                <FieldLabel>Model</FieldLabel>
                <TextInput required type="text" value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. Camry" />
              </div>
              <div>
                <FieldLabel>Year</FieldLabel>
                <TextInput required type="number" value={formData.year}
                  onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                  min={1900} max={new Date().getFullYear() + 1} />
              </div>
              <div>
                <FieldLabel>License plate</FieldLabel>
                <TextInput required type="text" value={formData.license_plate}
                  onChange={e => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                  placeholder="e.g. MH12AB1234"
                  style={{ textTransform: 'uppercase' }} />
              </div>
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
        <EmptyState
          icon={Car}
          title="Your garage is empty"
          description="Add a vehicle to start booking services."
          actionLabel="Add a vehicle"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {vehicles.map(v => (
            <VehicleCard
              key={v.id}
              v={v}
              onDelete={id => setDeletingId(id)}
              onPhotoUpdated={handlePhotoUpdated}
            />
          ))}
        </div>
      )}

      {/* Delete confirm dialog */}
      {deletingId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '400px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px' }}>Remove vehicle</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                This action cannot be undone. Vehicles with active bookings cannot be removed.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <SecondaryButton disabled={deleting} onClick={() => setDeletingId(null)}>Cancel</SecondaryButton>
              <button type="button" disabled={deleting} onClick={handleDelete} style={{
                height: '36px', padding: '0 16px',
                backgroundColor: 'var(--danger)', color: '#fafafa',
                border: '1px solid var(--danger)', borderRadius: '2px',
                fontSize: '13px', fontWeight: 500,
                cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.5 : 1,
                transition: 'background-color 0.1s ease',
              }}
                onMouseEnter={e => { if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626'; }}
                onMouseLeave={e => { if (!deleting) e.currentTarget.style.backgroundColor = 'var(--danger)'; }}
              >
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
