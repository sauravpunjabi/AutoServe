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
      padding: '48px 24px',
      border: '1px dashed #1f1f1f',
      borderRadius: '10px',
      textAlign: 'center',
      width: '100%',
    }}>
      <Icon size={20} color="#3d3d3d" strokeWidth={1.5} />
      <p style={{ 
        margin: '12px 0 4px', 
        fontSize: '13px', 
        fontWeight: 500,
        color: 'var(--text-primary)'
      }}>
        {title}
      </p>
      {description && (
        <p style={{ 
          margin: 0, 
          fontSize: '12px', 
          color: 'var(--text-secondary)' 
        }}>
          {description}
        </p>
      )}
      {actionLabel && (actionTo || onAction) && (
        <div style={{ marginTop: '16px' }}>
          {actionTo ? (
            <Link
              to={actionTo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '32px',
                padding: '0 14px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'filter 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
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
                height: '32px',
                padding: '0 14px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'filter 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
