import { ReactNode } from 'react';

export function AuthBrandPanel({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        width: '40%',
        minWidth: '300px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orange glow orb */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '-15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          AutoServe
        </span>
      </div>

      {children ?? (
        <>
          <div style={{ position: 'relative' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 12px',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Vehicle service,{' '}
              <span style={{ color: 'var(--accent)' }}>simplified.</span>
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7, maxWidth: '300px' }}>
              Book maintenance, track jobs in real time, and manage your service center — all in one place.
            </p>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, position: 'relative' }}>
            © {new Date().getFullYear()} AutoServe
          </p>
        </>
      )}
    </div>
  );
}

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{ width: '100%', maxWidth: '360px' }}
      >
        {children}
      </div>
    </div>
  );
}
