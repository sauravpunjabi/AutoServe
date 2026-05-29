import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { Card, SectionLabel, TextInput, PrimaryButton } from '../../components/ui';

const fieldLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
};

const CreateServiceCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user?.role !== 'manager') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg)',
          color: 'var(--danger)',
          fontFamily: 'Geist, sans-serif',
          fontSize: '14px',
        }}
      >
        Access Denied: Managers Only
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/service-centers', formData);
      navigate('/manager/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service center');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Create service center"
      subtitle="Set up your center to start accepting bookings."
      navLinks={managerNav}
    >
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Card style={{ maxWidth: '420px' }}>
          <SectionLabel>New center</SectionLabel>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                marginBottom: '16px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--danger)',
                backgroundColor: 'rgba(239,68,68,0.08)',
                fontSize: '13px',
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={fieldLabel}>Name</p>
              <TextInput
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. AutoServe Downtown"
              />
            </div>
            <div>
              <p style={fieldLabel}>Location</p>
              <TextInput
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 123 Main St, City"
              />
            </div>
            <div>
              <p style={fieldLabel}>Contact</p>
              <TextInput
                required
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g. (555) 123-4567"
              />
            </div>
            <PrimaryButton type="submit" disabled={submitting} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              {submitting ? 'Creating…' : 'Create center'}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateServiceCenter;
