import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { TextInput, PrimaryButton } from '../components/ui/primitives';

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Forgot password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          Enter your email and we'll send you a password reset link
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

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--success-subtle)',
                color: 'var(--success)',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {success}
            </div>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Return to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Email address
              </label>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <PrimaryButton type="submit" disabled={submitting} style={{ width: '100%', marginTop: '8px' }}>
              {submitting ? 'Sending link…' : 'Send reset link'}
            </PrimaryButton>
            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </AuthFormPanel>
    </div>
  );
};

export default ForgotPassword;
