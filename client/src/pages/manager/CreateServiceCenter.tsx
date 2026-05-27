import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { Card, SectionLabel, TextInput, PrimaryButton, Skeleton, SkeletonText } from '../../components/ui';

const fieldLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
};

export default function CreateServiceCenter() {
  const navigate = useNavigate();
  const { center, loading: centerLoading } = useManagerCenter();
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!centerLoading && center) {
      navigate('/manager/service-center/manage', { replace: true });
    }
  }, [center, centerLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/service-centers', form);
      toast.success('Service center created');
      navigate('/manager/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create service center');
    } finally {
      setSubmitting(false);
    }
  };

  if (centerLoading) {
    return (
      <AppLayout title="Create service center" subtitle="Set up your center." navLinks={managerNav}>
        <Card style={{ maxWidth: '420px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton width="100px" height="14px" />
            <SkeletonText lines={4} />
          </div>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Create service center"
      subtitle="Set up your center to start accepting bookings."
      navLinks={managerNav}
    >
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Card style={{ maxWidth: '420px' }}>
          <SectionLabel>New center</SectionLabel>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['name', 'address', 'phone', 'email'] as const).map((field) => (
              <div key={field}>
                <p style={fieldLabel}>{field}</p>
                <TextInput
                  required
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <PrimaryButton type="submit" disabled={submitting} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              {submitting ? 'Creating…' : 'Create center'}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
