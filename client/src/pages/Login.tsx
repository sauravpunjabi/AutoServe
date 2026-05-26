import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';

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

  const inputError: React.CSSProperties = {
    ...inputBase,
    borderColor: 'var(--danger)',
    boxShadow: '0 0 0 2px rgba(239,68,68,0.12)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? 'var(--danger)' : 'var(--accent)';
    e.currentTarget.style.boxShadow = hasError
      ? '0 0 0 2px rgba(239,68,68,0.15)'
      : '0 0 0 2px var(--accent-glow)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? 'var(--danger)' : 'var(--border-strong)';
    e.currentTarget.style.boxShadow = hasError ? '0 0 0 2px rgba(239,68,68,0.12)' : 'none';
  };

  const hasFieldError = !!error && !needsVerification;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Sign in to your AutoServe account
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: needsVerification ? '8px' : '16px',
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

        {needsVerification && (
          <div style={{ marginBottom: '16px' }}>
            {resendStatus ? (
              <p style={{ fontSize: '12px', color: 'var(--success)', margin: 0, padding: '8px 10px', backgroundColor: 'var(--success-subtle)', borderRadius: 'var(--radius)' }}>
                {resendStatus}
              </p>
            ) : (
              <button
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: 0,
                  fontFamily: 'Geist, sans-serif',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              >
                Resend verification email →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={hasFieldError ? inputError : inputBase}
              onFocus={(e) => handleFocus(e, hasFieldError)}
              onBlur={(e) => handleBlur(e, hasFieldError)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={hasFieldError ? inputError : inputBase}
              onFocus={(e) => handleFocus(e, hasFieldError)}
              onBlur={(e) => handleBlur(e, hasFieldError)}
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
              backgroundColor: submitting ? 'var(--bg-elevated)' : 'var(--accent)',
              color: submitting ? 'var(--text-muted)' : '#000',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              opacity: submitting ? 0.6 : 1,
              fontFamily: 'Geist, sans-serif',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }
            }}
          >
            {submitting && (
              <span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
            )}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          No account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          >
            Create one →
          </Link>
        </p>
      </AuthFormPanel>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
