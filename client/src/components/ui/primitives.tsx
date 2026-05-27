import { CSSProperties, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

export function Card({
  children,
  style,
  hoverable,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  hoverable?: boolean;
  onClick?: () => void;
}) {
  const isInteractive = hoverable || onClick;
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        transition: isInteractive 
          ? 'border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease'
          : 'border-color 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        transform: 'translateY(0)',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (isInteractive) {
          el.style.borderColor = '#2a2a2a';
          el.style.backgroundColor = '#141414';
          el.style.transform = 'translateY(-1px)';
        } else {
          el.style.borderColor = '#2a2a2a';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (isInteractive) {
          el.style.borderColor = 'var(--border)';
          el.style.backgroundColor = 'var(--bg-card)';
          el.style.transform = 'translateY(0)';
        } else {
          el.style.borderColor = 'var(--border)';
        }
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: '10px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '12px',
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
}

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '20px',
        transition: 'border-color 0.2s ease',
        cursor: 'default',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <p style={{
        fontSize: '10px', fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: 0
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '32px', fontWeight: 700,
        fontFamily: 'Geist Mono, monospace',
        color: 'var(--text-primary)',
        margin: '8px 0 0',
        letterSpacing: '-0.02em',
        lineHeight: 1
      }}>
        {value}
      </p>
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  loading,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: 'var(--accent)',
        color: '#000',
        fontWeight: 600,
        fontSize: '12px',
        padding: '7px 14px',
        borderRadius: '6px',
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'filter 0.15s ease, transform 0.1s ease',
        opacity: isDisabled ? 0.45 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) e.currentTarget.style.filter = 'brightness(1.1)';
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) e.currentTarget.style.filter = 'brightness(1)';
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = 'scale(0.97)';
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = 'scale(1)';
        props.onMouseUp?.(e);
      }}
    >
      {loading && (
        <span
          style={{
            width: '11px',
            height: '11px',
            border: '2px solid rgba(0,0,0,0.2)',
            borderTopColor: '#000',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-strong)',
        fontSize: '12px',
        fontWeight: 500,
        padding: '7px 14px',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.15s ease, color 0.15s ease',
        opacity: disabled ? 0.45 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = '#3a3a3a';
          e.currentTarget.style.color = '#fafafa';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: 'transparent',
        color: 'var(--danger)',
        border: '1px solid rgba(239,68,68,0.2)',
        fontSize: '12px',
        padding: '7px 14px',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s ease',
        opacity: disabled ? 0.45 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)';
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'transparent';
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 500,
        padding: '6px 10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s ease, color 0.15s ease',
        opacity: disabled ? 0.45 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = '#fafafa';
          e.currentTarget.style.backgroundColor = '#1a1a1a';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { error?: string; label?: string }) {
  const { error, label, ...inputProps } = props;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '5px',
          }}
        >
          {label}
        </label>
      )}
      <input
        {...inputProps}
        style={{
          background: 'var(--bg)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
          borderRadius: '6px',
          padding: '7px 10px',
          fontSize: '13px',
          fontFamily: 'Geist, sans-serif',
          color: 'var(--text-primary)',
          width: '100%',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: error ? '0 0 0 2px rgba(239,68,68,0.12)' : 'none',
          ...inputProps.style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
          e.currentTarget.style.boxShadow = error
            ? '0 0 0 2px rgba(239,68,68,0.15)'
            : '0 0 0 2px rgba(249,115,22,0.1)';
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)';
          e.currentTarget.style.boxShadow = 'none';
          inputProps.onBlur?.(e);
        }}
        placeholder={inputProps.placeholder}
      />
      {error && (
        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
}

export function TextSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border-strong)',
        borderRadius: '6px',
        padding: '7px 10px',
        fontSize: '13px',
        fontFamily: 'Geist, sans-serif',
        color: 'var(--text-primary)',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249,115,22,0.1)';
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

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: '12px',
        color: 'var(--accent)',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
    >
      {children}
    </Link>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}
    </div>
  );
}

export const thStyle: CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '10px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  backgroundColor: 'var(--bg-elevated)',
  borderBottom: '1px solid var(--border)',
};

export const tdStyle: CSSProperties = {
  padding: '13px 16px',
  color: 'var(--text-primary)',
  fontSize: '12px',
  verticalAlign: 'middle',
};

export function TableRow({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: '1px solid #111111',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.1s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = onClick ? '#141414' : '#0d0d0d';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </tr>
  );
}

export function DangerTextButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--danger)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity 0.15s ease',
        fontFamily: 'Geist, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

export function SuccessTextButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--success)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        marginRight: '12px',
        transition: 'opacity 0.15s ease',
        fontFamily: 'Geist, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

export function GridStats({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {children}
    </div>
  );
}

export function KpiStrip({
  children,
  cols,
  style,
}: {
  children: ReactNode;
  cols?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className="kpi-strip"
      style={{
        display: 'grid',
        gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : 'repeat(auto-fit, minmax(140px, 1fr))',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function KpiCell({
  label,
  value,
  sub,
  accent,
  mono,
  trend,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: string;
  mono?: boolean;
  trend?: string;
}) {
  const trendPositive = trend && !trend.startsWith('-');
  return (
    <div
      className="kpi-cell"
      style={{
        padding: '16px 20px',
        borderRight: '1px solid var(--border)',
        minWidth: 0,
      }}
    >
      <p
        style={{
          margin: '0 0 8px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '26px',
            lineHeight: 1,
            fontWeight: 500,
            fontFamily: mono ? 'Geist Mono, monospace' : 'Geist, sans-serif',
            color: accent || 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </p>
        {trend && (
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'Geist Mono, monospace',
              color: trendPositive ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {trend}
          </span>
        )}
      </div>
      {sub && (
        <p
          style={{
            margin: '6px 0 0',
            fontSize: '11px',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  noPad,
  style,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  noPad?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            minHeight: '48px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </p>
            )}
            {subtitle && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      <div style={noPad ? {} : { padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

export function CapacityBar({
  value,
  max = 100,
  color,
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = color || (pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)');
  return (
    <div
      style={{
        width: '100%',
        height: '4px',
        background: 'var(--bg-elevated)',
        borderRadius: '2px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: pct + '%',
          backgroundColor: c,
          transition: 'width 0.5s ease',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}
