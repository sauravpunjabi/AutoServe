const map: Record<string, { color: string; bg: string }> = {
  pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  approved:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  active:      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  completed:   { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  rejected:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  open:        { color: '#717171', bg: 'rgba(113,113,113,0.1)' },
  in_progress: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  paid:        { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  unpaid:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() || 'pending';
  const s = map[key] ?? { color: '#717171', bg: 'rgba(113,113,113,0.1)' };
  
  // Format display label: e.g. "in_progress" -> "IN PROGRESS"
  const displayLabel = key.replace(/_/g, ' ');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 600,
        color: s.color,
        backgroundColor: s.bg,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {displayLabel}
    </span>
  );
}
