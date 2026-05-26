const map: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  approved:    { label: 'Approved',    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  active:      { label: 'Active',      color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  completed:   { label: 'Completed',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  rejected:    { label: 'Rejected',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  suspended:   { label: 'Suspended',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  open:        { label: 'Open',        color: '#717171', bg: 'rgba(113,113,113,0.1)' },
  in_progress: { label: 'In Progress', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  paid:        { label: 'Paid',        color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  unpaid:      { label: 'Unpaid',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  cancelled:   { label: 'Cancelled',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  available:   { label: 'Available',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() || 'pending';
  const s = map[key] ?? { label: key.replace(/_/g, ' '), color: 'var(--text-secondary)', bg: 'rgba(113,113,113,0.1)' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 500,
        color: s.color,
        backgroundColor: s.bg,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}
