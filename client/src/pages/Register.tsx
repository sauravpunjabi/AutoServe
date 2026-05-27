import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { CheckCircle2 } from 'lucide-react';

const ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Book and track vehicle service' },
  { id: 'mechanic', label: 'Mechanic', desc: 'Work on assigned job cards' },
  { id: 'manager', label: 'Manager', desc: 'Run a service center' },
] as const;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' as string });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate(`/${formData.role}/dashboard`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '7px 10px',
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    fontFamily: 'Geist, sans-serif',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249,115,22,0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-strong)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', animation: 'fadeInUp 0.25s ease forwards' }}>
      <AuthBrandPanel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', position: 'relative' }}>
          <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
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
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
                  backgroundColor: active ? 'var(--accent-subtle)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  borderLeft: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                  fontFamily: 'Geist, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {r.label}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {r.desc}
                  </p>
                </div>
                {active && <CheckCircle2 size={16} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      </AuthBrandPanel>

      <AuthFormPanel>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Create an account
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Get started with AutoServe today
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'var(--danger)',
              fontSize: '12px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="you@example.com"
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'filter 0.15s ease, transform 0.1s ease',
              opacity: submitting ? 0.45 : 1,
              fontFamily: 'Geist, sans-serif',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.filter = 'brightness(1)';
              }
            }}
            onMouseDown={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = 'scale(0.97)';
              }
            }}
            onMouseUp={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {submitting && (
              <span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
            )}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          >
            Sign in →
          </Link>
        </p>
      </AuthFormPanel>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
