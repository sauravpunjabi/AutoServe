import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { TextInput, PrimaryButton } from '../components/ui/primitives';

const ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Book and track vehicle service' },
  { id: 'mechanic', label: 'Mechanic', desc: 'Work on assigned job cards' },
  { id: 'manager', label: 'Manager', desc: 'Run a service center' },
] as const;

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' as string });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/register', formData);
      setRegistered(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('');
    try {
      await api.post('/auth/resend-verification', { email: formData.email });
      setResendStatus('Verification email resent. Check your inbox.');
    } catch (err: any) {
      setResendStatus(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  if (registered) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
        <AuthBrandPanel>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            &copy; {new Date().getFullYear()} AutoServe
          </p>
        </AuthBrandPanel>
        <AuthFormPanel>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉️</div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Check your email
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 32px', lineHeight: '1.6' }}>
              Account created! Check your email to verify your account before logging in.
            </p>
            {resendStatus && (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{resendStatus}</p>
            )}
            <button
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            >
              Resend verification email
            </button>
            <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Back to sign in
              </Link>
            </p>
          </div>
        </AuthFormPanel>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Choose your role
          </p>
          {ROLES.map((r) => {
            const active = formData.role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setFormData({ ...formData, role: r.id })}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius)',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: active ? 'var(--accent-subtle)' : 'var(--bg)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{r.desc}</p>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          &copy; {new Date().getFullYear()} AutoServe
        </p>
      </AuthBrandPanel>
      <AuthFormPanel>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Create account
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          Fill in your details below
        </p>
        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--danger-subtle)',
              color: 'var(--danger)',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Full name
            </label>
            <TextInput name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Email
            </label>
            <TextInput type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Password
            </label>
            <TextInput type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
          </div>
          <PrimaryButton type="submit" disabled={submitting} style={{ width: '100%', marginTop: '8px' }}>
            {submitting ? 'Creating account…' : 'Create account'}
          </PrimaryButton>
        </form>
        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </AuthFormPanel>
    </div>
  );
};

export default Register;
