import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      textAlign: 'center',
      width: '100%',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '1px solid var(--border-strong)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
      }}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '360px' }}>
          {description}
        </p>
      )}
      {actionLabel && (actionTo || onAction) && (
        <div style={{ marginTop: '20px' }}>
          {actionTo ? (
            <Link
              to={actionTo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                padding: '0 16px',
                backgroundColor: 'var(--accent)',
                color: '#0B0E14',
                borderRadius: '2px',
                border: '1px solid var(--accent)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                padding: '0 16px',
                backgroundColor: 'var(--accent)',
                color: '#0B0E14',
                borderRadius: '2px',
                border: '1px solid var(--accent)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
