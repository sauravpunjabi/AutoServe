import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { TextInput, PrimaryButton } from '../components/ui/primitives';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [showResend, setShowResend] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    api.get(`/auth/verify-email/${token}`)
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendStatus('');
    try {
      await api.post('/auth/resend-verification', { email: resendEmail });
      setResendStatus('Verification email sent. Check your inbox.');
    } catch (err: any) {
      setResendStatus(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          &copy; {new Date().getFullYear()} AutoServe
        </p>
      </AuthBrandPanel>
      <AuthFormPanel>
        {status === 'loading' && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Verifying your email…</p>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Email verified!
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
              Your account is now active. Redirecting to sign in…
            </p>
            <Link
              to="/login"
              style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}
            >
              Go to sign in now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Invalid or expired link
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 24px' }}>
              This verification link is no longer valid. Request a new one below.
            </p>
            {!showResend && (
              <button
                onClick={() => setShowResend(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: 0 }}
              >
                Resend verification email
              </button>
            )}
            {showResend && (
              <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Email
                  </label>
                  <TextInput
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                </div>
                {resendStatus && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{resendStatus}</p>
                )}
                <PrimaryButton type="submit" style={{ width: '100%' }}>
                  Send verification email
                </PrimaryButton>
              </form>
            )}
            <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Back to sign in
              </Link>
            </p>
          </div>
        )}
      </AuthFormPanel>
    </div>
  );
};

export default VerifyEmail;
