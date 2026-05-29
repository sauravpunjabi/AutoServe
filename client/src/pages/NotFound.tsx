import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Geist, sans-serif',
        animation: 'fadeInUp 0.25s ease forwards',
      }}
    >
      <AlertTriangle size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          margin: '0 0 8px 0',
        }}
      >
        404 — Page not found
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          maxWidth: '360px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
        }}
      >
        The page you are looking for does not exist or has been moved to a new URL.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '36px',
          padding: '0 20px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--bg)',
          backgroundColor: 'var(--accent)',
          borderRadius: 'var(--radius)',
          textDecoration: 'none',
          transition: 'background 0.15s ease',
          border: '1px solid var(--accent)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.color = 'var(--bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--bg)';
        }}
      >
        Go to home
      </Link>
    </div>
  );
}
