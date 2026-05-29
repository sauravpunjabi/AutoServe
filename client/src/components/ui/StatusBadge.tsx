const STATUS_MAP: Record<string, { fg: string; bg: string; bd: string; label: string }> = {
  pending:      { label: 'Pending',     fg: '#eab308', bg: 'rgba(234,179,8,0.10)',   bd: 'rgba(234,179,8,0.30)'   },
  approved:     { label: 'Approved',    fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  active:       { label: 'Active',      fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  in_progress:  { label: 'In progress', fg: '#3b82f6', bg: 'rgba(59,130,246,0.10)', bd: 'rgba(59,130,246,0.30)'  },
  completed:    { label: 'Completed',   fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  rejected:     { label: 'Rejected',    fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'   },
  cancelled:    { label: 'Cancelled',   fg: '#94A3B8', bg: 'rgba(148,163,184,0.08)',bd: 'rgba(148,163,184,0.25)' },
  open:         { label: 'Open',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  paid:         { label: 'Paid',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  unpaid:       { label: 'Unpaid',      fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'   },
  overdue:      { label: 'Overdue',     fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'   },
  done:         { label: 'Done',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  high:         { label: 'High',        fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'   },
  critical:     { label: 'Critical',    fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'   },
  normal:       { label: 'Normal',      fg: '#94A3B8', bg: 'rgba(148,163,184,0.08)',bd: 'rgba(148,163,184,0.20)' },
  occupied:     { label: 'Occupied',    fg: '#3b82f6', bg: 'rgba(59,130,246,0.10)', bd: 'rgba(59,130,246,0.30)'  },
  'on-shift':   { label: 'On shift',    fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)'  },
  'off-shift':  { label: 'Off shift',   fg: '#5B6473', bg: 'rgba(91,100,115,0.10)', bd: 'rgba(91,100,115,0.25)'  },
  'at-capacity':{ label: 'At capacity', fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'   },
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const key = status?.toLowerCase() ?? 'normal';
  const s = STATUS_MAP[key] ?? { fg: '#94A3B8', bg: 'rgba(148,163,184,0.08)', bd: 'rgba(148,163,184,0.20)', label: key };
  const display = label || s.label;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '2px 8px',
      borderRadius: '2px',
      fontSize: '11px',
      fontWeight: 500,
      color: s.fg,
      backgroundColor: s.bg,
      border: `1px solid ${s.bd}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: s.fg, flexShrink: 0 }} />
      {display}
    </span>
  );
}
