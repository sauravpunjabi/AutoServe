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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {actionLabel && (actionTo || onAction) && (
        actionTo ? (
          <Link
            to={actionTo}
            style={{
              marginTop: description ? '0' : '16px',
              padding: '6px 14px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            style={{
              marginTop: description ? '0' : '16px',
              padding: '6px 14px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
