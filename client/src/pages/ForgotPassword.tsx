import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { Send, MailCheck } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%', height: '36px', padding: '0 12px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: '2px', fontSize: '13px',
  color: 'var(--text-primary)', outline: 'none',
  fontFamily: 'Geist, sans-serif',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
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
            Account recovery
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Reset your password.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Enter the email associated with your account. We'll send a one-time link.
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

        {sent ? (
          <div style={{
            border: '1px solid rgba(16,185,129,0.3)',
            backgroundColor: 'rgba(16,185,129,0.06)',
            borderRadius: '6px', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px',
                border: '1px solid rgba(16,185,129,0.4)',
                backgroundColor: 'rgba(16,185,129,0.1)',
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', flexShrink: 0,
              }}>
                <MailCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Check your inbox
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  If an account exists for that address, we've sent a link valid for 30 minutes.
                  Don't see it? Check spam or{' '}
                  <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontFamily: 'Geist, sans-serif' }}>
                    try another address
                  </button>.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)';  }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <button type="submit" disabled={submitting} style={{
              width: '100%', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: submitting ? 'var(--bg-elevated)' : 'var(--accent)',
              color: submitting ? 'var(--text-muted)' : '#0B0E14',
              border: `1px solid ${submitting ? 'var(--border)' : 'var(--accent)'}`,
              borderRadius: '2px', fontSize: '13px', fontWeight: 500,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.45 : 1,
              fontFamily: 'Geist, sans-serif',
              transition: 'background-color 0.1s ease, color 0.1s ease',
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
                ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0B0E14', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending…</>
                : <><Send size={14} /> Send reset link</>
              }
            </button>
          </form>
        )}

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Remembered?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
            Back to sign in
          </Link>
        </p>
      </AuthFormPanel>
    </div>
  );
};

export default ForgotPassword;
