import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || "Check your inbox. We've sent a password reset link to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', animation: 'fadeInUp 0.25s ease forwards' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Reset password
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Enter your email and we'll send a reset link
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

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--success-subtle)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: 'var(--success)',
                fontSize: '12px',
                lineHeight: 1.6,
              }}
            >
              {success}
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              <Link
                to="/login"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              >
                ← Return to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputBase}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249,115,22,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              <Link
                to="/login"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              >
                ← Back to sign in
              </Link>
            </p>
          </form>
        )}
      </AuthFormPanel>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ForgotPassword;
