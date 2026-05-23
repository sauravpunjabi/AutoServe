import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <Icon size={28} color="var(--text-muted)" strokeWidth={1.5} />
      <p style={{ margin: '12px 0 4px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            borderRadius: 'var(--radius)',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
