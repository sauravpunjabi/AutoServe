export * from './primitives';
export { default as StatusBadge } from './StatusBadge';
export { default as LoadingPage } from './LoadingPage';
export { default as EmptyState } from './EmptyState';

import { ReactNode, useEffect } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '20px',
              lineHeight: 1,
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Skeleton({ width, height, className = '' }: { width?: string | number; height?: string | number; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height: height ?? '16px' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
      }}
    >
      <Skeleton height={12} width="40%" />
      <div style={{ height: '12px' }} />
      <Skeleton height={32} width="60%" />
      <div style={{ height: '8px' }} />
      <Skeleton height={12} width="30%" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: '12px 16px' }}><Skeleton height={14} width="80%" /></td>
      <td style={{ padding: '12px 16px' }}><Skeleton height={14} width="60%" /></td>
      <td style={{ padding: '12px 16px' }}><Skeleton height={14} width="70%" /></td>
      <td style={{ padding: '12px 16px' }}><Skeleton height={20} width="70px" /></td>
    </tr>
  );
}
