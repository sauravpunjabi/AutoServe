import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { ArrowRight } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '36px',
  padding: '0 12px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: '2px',
  fontSize: '13px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'Geist, sans-serif',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</label>
        {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setResendStatus('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, { id: user.id, name: user.name, email: user.email, role: user.role });
      navigate(`/${user.role}/dashboard`);
    } catch (err: any) {
      const data = err.response?.data;
      if (err.response?.status === 403 && data?.resend) {
        setNeedsVerification(true);
        setError(data.message);
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('');
    try {
      await api.post('/auth/resend-verification', { email });
      setResendStatus('Verification email sent. Check your inbox.');
    } catch (err: any) {
      setResendStatus(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-strong)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Sign in
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Continue to your AutoServe workspace.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: needsVerification ? '8px' : '16px',
            padding: '10px 14px',
            borderRadius: '2px',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: 'var(--danger)',
            fontSize: '12px',
          }}>
            {error}
          </div>
        )}

        {needsVerification && (
          <div style={{ marginBottom: '16px' }}>
            {resendStatus ? (
              <p style={{ fontSize: '12px', color: 'var(--success)', margin: 0, padding: '8px 10px', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '2px', border: '1px solid rgba(16,185,129,0.3)' }}>
                {resendStatus}
              </p>
            ) : (
              <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, padding: 0, fontFamily: 'Geist, sans-serif' }}>
                Resend verification email →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Email">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <Field label="Password" hint={
            <Link to="/forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '11px' }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
              Forgot?
            </Link>
          }>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </Field>

          <button type="submit" disabled={submitting} style={{
            width: '100%', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginTop: '4px',
            backgroundColor: submitting ? 'var(--bg-elevated)' : 'var(--accent)',
            color: submitting ? 'var(--text-muted)' : '#0B0E14',
            border: `1px solid ${submitting ? 'var(--border)' : 'var(--accent)'}`,
            borderRadius: '2px',
            fontSize: '13px', fontWeight: 500,
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
              ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0B0E14', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
              : <><ArrowRight size={14} /> Sign in</>
            }
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          New to AutoServe?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
            Open an account →
          </Link>
        </p>
      </AuthFormPanel>
    </div>
  );
};

export default Login;
