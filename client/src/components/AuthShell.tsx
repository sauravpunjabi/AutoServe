import { ReactNode } from 'react';

export function AuthBrandPanel({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        width: '42%',
        minWidth: '320px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>AutoServe</span>
      </div>
      {children ?? (
        <>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Vehicle service, simplified
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Book maintenance, track jobs, and manage your service center — all in one place.
            </p>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            &copy; {new Date().getFullYear()} AutoServe
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
      <div style={{ width: '100%', maxWidth: '360px' }}>{children}</div>
    </div>
  );
}
