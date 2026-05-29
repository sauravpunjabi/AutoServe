import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { toast } from 'react-toastify';
import { Check, ArrowRight } from 'lucide-react';

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checks = [
    { label: '6 characters minimum', ok: password.length >= 6 },
    { label: 'Matches confirmation',  ok: password.length > 0 && password === confirmPassword },
  ];
  const allOk = checks.every(c => c.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long'); return; }
    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully. Please sign in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
            One-time link
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Set a new password.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Choose something strong. We'll sign you in once it's saved.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '10px 14px', borderRadius: '2px',
            backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            color: 'var(--danger)', fontSize: '12px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              required placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Strength checks */}
          <div style={{ border: '1px solid var(--border-strong)', borderRadius: '2px', padding: '14px 16px', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              Strength
            </div>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', marginBottom: i < checks.length - 1 ? '6px' : 0 }}>
                <span style={{
                  width: '16px', height: '16px', borderRadius: '2px',
                  border: `1px solid ${c.ok ? 'rgba(16,185,129,0.4)' : 'var(--border-strong)'}`,
                  backgroundColor: c.ok ? 'rgba(16,185,129,0.15)' : 'var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {c.ok ? <Check size={10} style={{ color: 'var(--accent)' }} /> : <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />}
                </span>
                <span style={{ color: c.ok ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{c.label}</span>
              </div>
            ))}
          </div>

          <button type="submit" disabled={submitting || !allOk} style={{
            width: '100%', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: !allOk ? 'var(--bg-elevated)' : 'var(--accent)',
            color: !allOk ? 'var(--text-muted)' : '#0B0E14',
            border: `1px solid ${!allOk ? 'var(--border)' : 'var(--accent)'}`,
            borderRadius: '2px', fontSize: '13px', fontWeight: 500,
            cursor: submitting || !allOk ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.45 : 1,
            fontFamily: 'Geist, sans-serif',
            transition: 'background-color 0.1s ease, color 0.1s ease',
          }}
            onMouseEnter={e => {
              if (!submitting && allOk) {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!submitting && allOk) {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = '#0B0E14';
              }
            }}
          >
            {submitting
              ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0B0E14', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
              : <><ArrowRight size={14} /> Save and sign in</>
            }
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Need a fresh link?{' '}
          <Link to="/forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
            Request again
          </Link>
        </p>
      </AuthFormPanel>
    </div>
  );
};

export default ResetPassword;
