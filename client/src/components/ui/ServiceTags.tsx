export default function ServiceTags({
  services,
  serviceType,
}: {
  services?: any[] | null;
  serviceType?: string;
}) {
  if (Array.isArray(services) && services.length > 0) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {services.map((s: any, i: number) => (
          <span
            key={s.id || i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--accent)',
              backgroundColor: 'var(--accent-subtle)',
            }}
          >
            {s.name}
          </span>
        ))}
      </div>
    );
  }
  return <span style={{ color: 'var(--text-primary)' }}>{serviceType || '—'}</span>;
}
