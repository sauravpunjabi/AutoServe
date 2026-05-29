import { CSSProperties, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

/* ── Panel ─────────────────────────────────────────────────────────── */
export function Panel({
  title, subtitle, action, children, noPad, style,
}: {
  title?: ReactNode; subtitle?: ReactNode; action?: ReactNode;
  children: ReactNode; noPad?: boolean; style?: CSSProperties;
}) {
  return (
    <section style={{
      border: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '6px',
      overflow: 'hidden',
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          minHeight: '48px',
        }}>
          <div style={{ minWidth: 0 }}>
            {title && (
              <p style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {title}
              </p>
            )}
            {subtitle && (
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      <div style={noPad ? {} : { padding: '20px' }}>{children}</div>
    </section>
  );
}

/* ── KPI strip ─────────────────────────────────────────────────────── */
export function KpiStrip({
  children, cols, style,
}: {
  children: ReactNode; cols?: number; style?: CSSProperties;
}) {
  return (
    <div className="kpi-strip" style={{
      display: 'grid',
      gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : 'repeat(auto-fit, minmax(140px, 1fr))',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      overflow: 'hidden',
      marginBottom: '20px',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function KpiCell({
  label, value, sub, accent, mono, trend,
}: {
  label: string; value: ReactNode; sub?: string;
  accent?: string; mono?: boolean; trend?: string;
}) {
  const trendPositive = trend && !trend.startsWith('-');
  return (
    <div className="kpi-cell" style={{
      padding: '16px 20px',
      borderRight: '1px solid var(--border)',
      minWidth: 0,
    }}>
      <p style={{
        margin: '0 0 8px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <p style={{
          margin: 0,
          fontSize: '26px',
          lineHeight: 1,
          fontWeight: 500,
          fontFamily: mono ? 'Geist Mono, monospace' : 'Geist, sans-serif',
          color: accent || 'var(--text-primary)',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </p>
        {trend && (
          <span style={{
            fontSize: '11px',
            fontFamily: 'Geist Mono, monospace',
            color: trendPositive ? 'var(--success)' : 'var(--danger)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {trend}
          </span>
        )}
      </div>
      {sub && (
        <p style={{
          margin: '6px 0 0',
          fontSize: '11px',
          color: 'var(--text-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── StatCard ──────────────────────────────────────────────────────── */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      padding: '20px',
      transition: 'border-color 0.15s ease',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        {label}
      </p>
      <p style={{
        fontSize: '32px', fontWeight: 500,
        fontFamily: 'Geist Mono, monospace',
        color: 'var(--text-primary)',
        margin: '8px 0 0',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </p>
    </div>
  );
}

/* ── GridStats ─────────────────────────────────────────────────────── */
export function GridStats({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '12px',
      marginBottom: '24px',
    }}>
      {children}
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────────── */
export function Card({
  children, style, hoverable, onClick,
}: {
  children: ReactNode; style?: CSSProperties; hoverable?: boolean; onClick?: () => void;
}) {
  const isInteractive = hoverable || onClick;
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '16px',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
        } else {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-card)';
      }}
    >
      {children}
    </div>
  );
}

/* ── Buttons ───────────────────────────────────────────────────────── */
const BTN_BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontWeight: 500,
  fontSize: '13px',
  borderRadius: '2px',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease',
  fontFamily: 'Geist, sans-serif',
  whiteSpace: 'nowrap',
};

export function PrimaryButton({
  children, disabled, loading, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      {...props}
      style={{
        ...BTN_BASE,
        backgroundColor: 'var(--accent)',
        color: '#0B0E14',
        border: '1px solid var(--accent)',
        padding: '0 16px',
        height: '36px',
        opacity: isDisabled ? 0.45 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.color = '#0B0E14';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.color = '#0B0E14';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {loading && (
        <span style={{
          width: '11px', height: '11px',
          border: '2px solid rgba(0,0,0,0.2)',
          borderTopColor: '#0B0E14',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children, disabled, ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        ...BTN_BASE,
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-strong)',
        padding: '0 14px',
        height: '36px',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.color = '#0B0E14';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children, disabled, ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        ...BTN_BASE,
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
        padding: '0 10px',
        height: '34px',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children, disabled, ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        ...BTN_BASE,
        backgroundColor: 'transparent',
        color: 'var(--danger)',
        border: '1px solid rgba(239,68,68,0.3)',
        padding: '0 14px',
        height: '36px',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--danger)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--danger)';
          (e.currentTarget as HTMLElement).style.color = '#0B0E14';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
          (e.currentTarget as HTMLElement).style.color = 'var(--danger)';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function DangerTextButton({
  children, onClick, disabled,
}: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: '12px', fontWeight: 500,
        color: 'var(--danger)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: 'Geist, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

export function SuccessTextButton({
  children, onClick, disabled,
}: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: '12px', fontWeight: 500,
        color: 'var(--success)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        marginRight: '12px',
        fontFamily: 'Geist, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

/* ── Form inputs ───────────────────────────────────────────────────── */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { error?: string; label?: string }) {
  const { error, label, ...inputProps } = props;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '6px',
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '36px',
        padding: '0 12px',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
        borderRadius: '2px',
        backgroundColor: 'var(--bg-elevated)',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)';
        }}
      >
        <input
          {...inputProps}
          style={{
            background: 'transparent',
            border: 0,
            outline: 'none',
            fontSize: '13px',
            fontFamily: 'Geist, sans-serif',
            color: 'var(--text-primary)',
            width: '100%',
            ...inputProps.style,
          }}
        />
      </div>
      {error && <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}

export function TextSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-strong)',
        borderRadius: '2px',
        padding: '0 12px',
        height: '36px',
        fontSize: '13px',
        fontFamily: 'Geist, sans-serif',
        color: 'var(--text-primary)',
        width: '100%',
        outline: 'none',
        cursor: 'pointer',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

/* ── Typography helpers ────────────────────────────────────────────── */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 500,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '12px', marginTop: 0,
    }}>
      {children}
    </p>
  );
}

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{
      fontFamily: 'Geist Mono, monospace',
      fontSize: '12px',
      color: 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>
      {children}
    </span>
  );
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: '12px',
        color: 'var(--accent)',
        textDecoration: 'none',
        fontWeight: 500,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
    >
      {children}
    </Link>
  );
}

/* ── Table ─────────────────────────────────────────────────────────── */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

export const thStyle: CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  backgroundColor: 'var(--bg-card)',
  borderBottom: '1px solid var(--border)',
};

export const tdStyle: CSSProperties = {
  padding: '12px 16px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  verticalAlign: 'middle',
};

export function TableRow({
  children, onClick,
}: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="row-hover"
      style={{
        borderBottom: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.1s ease',
      }}
    >
      {children}
    </tr>
  );
}

/* ── CapacityBar ───────────────────────────────────────────────────── */
export function CapacityBar({
  value, max = 100, color,
}: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = color || (pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)');
  return (
    <div style={{
      width: '100%', height: '6px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '1px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        height: '100%', width: pct + '%',
        backgroundColor: c,
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}
