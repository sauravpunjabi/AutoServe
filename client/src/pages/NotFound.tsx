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
        backgroundColor: '#080808',
        color: '#fafafa',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Geist, sans-serif',
        animation: 'fadeInUp 0.25s ease forwards',
      }}
    >
      <AlertTriangle size={32} color="#f97316" style={{ marginBottom: '16px' }} />
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
          color: '#717171',
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
          color: '#080808',
          backgroundColor: '#f97316',
          borderRadius: '6px',
          textDecoration: 'none',
          transition: 'filter 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
      >
        Go to home
      </Link>
    </div>
  );
}
