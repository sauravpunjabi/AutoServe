import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthBrandPanel, AuthFormPanel } from '../components/AuthShell';
import { TextInput, PrimaryButton } from '../components/ui/primitives';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password has been reset successfully. Please sign in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired or is invalid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)', animation: 'fadeInUp 0.25s ease forwards' }}>
      <AuthBrandPanel />
      <AuthFormPanel>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Reset your password
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          Enter your new password below
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
              New password
            </label>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Confirm new password
            </label>
            <TextInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <PrimaryButton type="submit" disabled={submitting} style={{ width: '100%', marginTop: '8px' }}>
            {submitting ? 'Resetting…' : 'Reset password'}
          </PrimaryButton>
          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Back to sign in
            </Link>
          </p>
        </form>
      </AuthFormPanel>
    </div>
  );
};

export default ResetPassword;
