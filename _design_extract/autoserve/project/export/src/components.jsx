// Shared UI primitives — strictly tactical, no soft cards.
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Lucide icon helper. Renders an inline SVG by name from window.lucide.icons.
function Icon({ name, size = 16, strokeWidth = 1.5, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    const def = window.lucide.icons[name] || window.lucide.icons[
      name.replace(/(^|-)([a-z])/g, (_,_dash,c) => c.toUpperCase())
    ];
    if (!def) return;
    // lucide UMD exposes createElement helper
    try {
      const svg = window.lucide.createElement(def);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      svg.setAttribute('class', className);
      ref.current.innerHTML = '';
      ref.current.appendChild(svg);
    } catch (e) { /* noop */ }
  }, [name, size, strokeWidth, className]);
  return <span ref={ref} className="inline-flex" aria-hidden="true" />;
}

// Unified Status Badge
const STATUS_MAP = {
  pending:     { label: 'PENDING',     fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'  },
  in_progress: { label: 'IN PROGRESS', fg: '#3b82f6', bg: 'rgba(59,130,246,0.10)', bd: 'rgba(59,130,246,0.30)' },
  completed:   { label: 'COMPLETED',   fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)' },
  cancelled:   { label: 'CANCELLED',   fg: '#94A3B8', bg: 'rgba(148,163,184,0.08)',bd: 'rgba(148,163,184,0.25)'},
  paid:        { label: 'PAID',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)' },
  overdue:     { label: 'OVERDUE',     fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'  },
  done:        { label: 'DONE',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)' },
  high:        { label: 'HIGH',        fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'  },
  critical:    { label: 'CRITICAL',    fg: '#ef4444', bg: 'rgba(239,68,68,0.10)',  bd: 'rgba(239,68,68,0.30)'  },
  normal:      { label: 'NORMAL',      fg: '#94A3B8', bg: 'rgba(148,163,184,0.08)',bd: 'rgba(148,163,184,0.20)'},
  open:        { label: 'OPEN',        fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)' },
  occupied:    { label: 'OCCUPIED',    fg: '#3b82f6', bg: 'rgba(59,130,246,0.10)', bd: 'rgba(59,130,246,0.30)' },
  service:     { label: 'MAINT',       fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'  },
  'on-shift':  { label: 'ON SHIFT',    fg: '#10B981', bg: 'rgba(16,185,129,0.10)', bd: 'rgba(16,185,129,0.30)' },
  'at-capacity':{label: 'AT CAPACITY', fg: '#eab308', bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(234,179,8,0.30)'  },
  'off-shift': { label: 'OFF SHIFT',   fg: '#5B6473', bg: 'rgba(91,100,115,0.10)', bd: 'rgba(91,100,115,0.25)' },
};

function StatusBadge({ status, label, className = '' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.normal;
  const display = (label || s.label);
  const pretty = display.charAt(0) + display.slice(1).toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-xs border ${className}`}
      style={{ color: s.fg, backgroundColor: s.bg, borderColor: s.bd }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
      {pretty.replace(/_/g,' ')}
    </span>
  );
}

// Button — sharp, inverting hover
function Button({ variant = 'default', size = 'md', icon, children, className = '', ...rest }) {
  const sz = size === 'sm' ? 'h-7 px-2.5 text-[12px]' : size === 'lg' ? 'h-11 px-5 text-sm' : 'h-9 px-3.5 text-[13px]';
  const base = `inline-flex items-center justify-center gap-2 font-medium rounded-xs border transition-colors duration-100 focus-ring ${sz}`;
  let variantCls = '';
  if (variant === 'primary') {
    variantCls = 'bg-teal text-obsidian border-teal hover:bg-ink hover:border-ink';
  } else if (variant === 'ghost') {
    variantCls = 'bg-transparent text-silver border-transparent hover:text-ink hover:bg-white/5';
  } else if (variant === 'danger') {
    variantCls = 'bg-transparent text-danger border-danger/40 hover:bg-danger hover:text-obsidian hover:border-danger';
  } else if (variant === 'warn') {
    variantCls = 'bg-transparent text-warn border-warn/40 hover:bg-warn hover:text-obsidian hover:border-warn';
  } else {
    variantCls = 'bg-transparent text-ink border-line2 hover:bg-ink hover:text-obsidian hover:border-ink';
  }
  return (
    <button className={`${base} ${variantCls} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
}

// Panel — bordered block with optional title bar
function Panel({ title, subtitle, kicker, action, children, className = '', innerClassName = 'p-5' }) {
  return (
    <section className={`border border-line bg-panel rounded-md ${className}`}>
      {(title || action) && (
        <header className="flex items-end justify-between gap-4 px-5 pt-4 pb-3.5 border-b border-line">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-medium text-ink tracking-tight truncate">{title}</h2>}
            {subtitle && <p className="text-[12px] text-silver mt-1 truncate">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={innerClassName}>{children}</div>
    </section>
  );
}

// KPI cell — used in tactical headers
function KPI({ label, value, sub, accent, mono = false, trend }) {
  return (
    <div className="px-5 py-4 border-r border-line last:border-r-0 min-w-0">
      <div className="text-[12px] text-silver mb-2 truncate">{label}</div>
      <div className="flex items-baseline gap-2">
        <div
          className={`${mono ? 'font-mono' : ''} text-[26px] leading-none font-medium tnum tracking-tight`}
          style={{ color: accent || '#fafafa' }}
        >
          {value}
        </div>
        {trend && (
          <div className={`text-[11px] tnum ${trend.startsWith('-') ? 'text-danger' : 'text-teal'}`}>
            {trend}
          </div>
        )}
      </div>
      {sub && <div className="text-[11px] text-mute mt-1.5 truncate">{sub}</div>}
    </div>
  );
}

// Skeleton primitives
function SkeletonLine({ w = '100%', h = 12, className = '' }) {
  return <div className={`sk rounded-xs ${className}`} style={{ width: w, height: h }} />;
}
function SkeletonBlock({ h = 80, className = '' }) {
  return <div className={`sk rounded-xs ${className}`} style={{ height: h }} />;
}
function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-line">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4"><SkeletonLine w={`${40 + Math.random()*55}%`} h={10} /></td>
      ))}
    </tr>
  );
}

// Empty state
function EmptyState({ icon = 'inbox', title, body, cta }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 border border-line2 rounded-md flex items-center justify-center text-silver mb-4">
        <Icon name={icon} size={20} />
      </div>
      <div className="text-[14px] font-medium text-ink">{title}</div>
      {body && <div className="text-[12px] text-silver mt-1.5 max-w-sm leading-relaxed">{body}</div>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}

// Data table — borders, mono cells, overflow handling
function DataTable({ columns, rows, onRowClick, loading = false, emptyTitle = 'No records', emptyBody, emptyCta, emptyIcon = 'database' }) {
  if (loading) {
    return (
      <table className="w-full text-xs">
        <thead><tr className="border-b border-line">
          {columns.map((c,i) => <th key={i} className="px-4 py-3 text-left text-[11px] text-mute font-medium">{c.header}</th>)}
        </tr></thead>
        <tbody>{Array.from({length: 5}).map((_,i) => <SkeletonRow key={i} cols={columns.length} />)}</tbody>
      </table>
    );
  }
  if (!rows || rows.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} body={emptyBody} cta={emptyCta} />;
  }
  return (
    <div className="overflow-x-auto scroll-thin">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c,i) => (
              <th key={i} className="px-4 py-3 text-left text-[11px] text-mute font-medium whitespace-nowrap" style={{ width: c.width }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-line row-hover transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((c, ci) => (
                <td key={ci} className={`px-4 py-3 align-top ${c.cellClass || ''}`} style={{ maxWidth: c.maxWidth }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mini sparkline (no fill, no glow)
function Sparkline({ data, height = 36, color = '#10B981', strokeWidth = 1.25, className = '' }) {
  const w = 200;
  const max = Math.max(...data), min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg className={`spark ${className}`} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Capacity bar
function CapacityBar({ value, max = 100, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = color || (pct > 90 ? '#ef4444' : pct > 70 ? '#eab308' : '#10B981');
  return (
    <div className="w-full h-1.5 bg-white/[0.04] rounded-xs overflow-hidden border border-line">
      <div className="h-full transition-all duration-500" style={{ width: pct + '%', backgroundColor: c }} />
    </div>
  );
}

// Segmented control
function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex border border-line2 rounded-xs overflow-hidden ${className}`}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`h-7 px-3 text-[11px] transition-colors ${
            value === o.value ? 'bg-ink text-obsidian' : 'bg-transparent text-silver hover:text-ink hover:bg-white/[0.04]'
          } border-r border-line2 last:border-r-0`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Input — focus ring
function Input({ icon, className = '', ...rest }) {
  return (
    <div className={`flex items-center gap-2 h-9 px-3 border border-line2 rounded-xs bg-panel2 focus-within:ring-1 focus-within:ring-teal focus-within:border-teal ${className}`}>
      {icon && <span className="text-silver"><Icon name={icon} size={14} /></span>}
      <input className="bg-transparent border-0 outline-none text-xs text-ink placeholder:text-mute flex-1 w-full" {...rest} />
    </div>
  );
}

// Toast / Toast container — minimal
function Toaster({ messages }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {messages.map(m => (
        <div key={m.id} className="bg-panel border border-line2 rounded-xs px-4 py-3 min-w-[280px] shadow-float flex items-start gap-3 animate-[fadeIn_.2s_ease-out]">
          <Icon name={m.icon || 'check'} size={14} className={m.tone === 'danger' ? 'text-danger' : 'text-teal'} />
          <div className="flex-1">
            <div className="text-xs font-medium text-ink">{m.title}</div>
            {m.body && <div className="text-[11px] text-silver mt-0.5">{m.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Modal — hard structural shadow only
function Modal({ open, onClose, title, kicker, children, footer, width = 560 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-panel border border-line2 rounded-md w-full"
        style={{ maxWidth: width, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
        onClick={(e)=>e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
          <div>
            {kicker && <div className="text-[12px] text-silver mb-1">{kicker}</div>}
            <h3 className="text-[15px] font-medium text-ink">{title}</h3>
          </div>
          <button onClick={onClose} className="text-silver hover:text-ink transition-colors" aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-line flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, StatusBadge, Button, Panel, KPI,
  SkeletonLine, SkeletonBlock, SkeletonRow, EmptyState,
  DataTable, Sparkline, CapacityBar, Segmented, Input, Toaster, Modal,
  STATUS_MAP,
});
