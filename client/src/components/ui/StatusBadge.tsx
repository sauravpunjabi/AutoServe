const map: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'var(--warning)', bg: 'var(--warning-subtle)' },
  approved: { label: 'Approved', color: 'var(--info)', bg: 'var(--info-subtle)' },
  active: { label: 'Active', color: 'var(--success)', bg: 'var(--success-subtle)' },
  completed: { label: 'Completed', color: 'var(--success)', bg: 'var(--success-subtle)' },
  rejected: { label: 'Rejected', color: 'var(--danger)', bg: 'var(--danger-subtle)' },
  suspended: { label: 'Suspended', color: 'var(--danger)', bg: 'var(--danger-subtle)' },
  open: { label: 'Open', color: 'var(--text-secondary)', bg: 'var(--bg-hover)' },
  in_progress: { label: 'In Progress', color: 'var(--accent)', bg: 'var(--accent-subtle)' },
  paid: { label: 'Paid', color: 'var(--success)', bg: 'var(--success-subtle)' },
  unpaid: { label: 'Unpaid', color: 'var(--warning)', bg: 'var(--warning-subtle)' },
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() || 'pending';
  const s = map[key] ?? { label: key.replace(/_/g, ' '), color: 'var(--text-secondary)', bg: 'var(--bg-hover)' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        color: s.color,
        backgroundColor: s.bg,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
      }}
    >
      {s.label}
    </span>
  );
}
