import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { ArrowRight } from 'lucide-react';

const ROLES = [
  { id: 'customer', label: 'Vehicle owner',   sub: 'Book service · track jobs' },
  { id: 'mechanic', label: 'Mechanic',         sub: 'Work on assigned job cards' },
  { id: 'manager',  label: 'Center operator',  sub: 'Run a service center'       },
] as const;

const inputStyle: React.CSSProperties = {
  width: '100%', height: '36px', padding: '0 12px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: '2px', fontSize: '13px',
  color: 'var(--text-primary)', outline: 'none',
  fontFamily: 'Geist, sans-serif',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--accent)';
  
};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--border-strong)';
  e.currentTarget.style.boxShadow = 'none';
};

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Brand pane with role selector */}
      <AuthBrandPanel>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
            I am a
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ROLES.map(r => {
              const active = formData.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  style={{
                    textAlign: 'left', padding: '14px 16px',
                    borderRadius: '2px',
                    border: `1px solid ${active ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                    backgroundColor: active ? 'rgba(16,185,129,0.08)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'Geist, sans-serif',
                    width: '100%',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, color: active ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '2px' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '11px', color: active ? 'rgba(16,185,129,0.7)' : 'var(--text-muted)' }}>
                    {r.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </AuthBrandPanel>

      <AuthFormPanel>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Open account
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Create your AutoServe account.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Two minutes to set up. No card required for trial.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '10px 14px', borderRadius: '2px',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: 'var(--danger)', fontSize: '12px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full name</label>
            <input type="text" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required placeholder="Marcus Holloway"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email</label>
            <input type="email" value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required placeholder="you@email.com"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
            <input type="password" value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required minLength={6} placeholder="At least 6 characters"
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <button type="submit" disabled={submitting} style={{
            width: '100%', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginTop: '4px',
            backgroundColor: submitting ? 'var(--bg-elevated)' : 'var(--accent)',
            color: submitting ? 'var(--text-muted)' : '#0B0E14',
            border: `1px solid ${submitting ? 'var(--border)' : 'var(--accent)'}`,
            borderRadius: '2px', fontSize: '13px', fontWeight: 500,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.45 : 1,
            fontFamily: 'Geist, sans-serif',
            transition: 'background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease',
          }}
            onMouseEnter={e => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = '#0B0E14';
              }
            }}
          >
            {submitting
              ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0B0E14', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating account…</>
              : <><ArrowRight size={14} /> Create account</>
            }
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
            Sign in →
          </Link>
        </p>
      </AuthFormPanel>
    </div>
  );
};

export default Register;
