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
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        transition: 'all 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-card)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
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
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: { value: string; up?: boolean };
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        minWidth: '140px',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)';
        (e.currentTarget as HTMLElement).style.borderLeftColor = 'var(--accent)';
        (e.currentTarget as HTMLElement).style.borderLeftWidth = '2px';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.borderLeftWidth = '1px';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          {label}
        </p>
        {Icon && <Icon size={14} color="var(--text-muted)" />}
      </div>
      <p
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'Geist Mono, monospace',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </p>
      {trend && (
        <span
          style={{
            display: 'inline-block',
            marginTop: '6px',
            fontSize: '11px',
            fontWeight: 500,
            color: trend.up ? 'var(--success)' : 'var(--danger)',
            backgroundColor: trend.up ? 'var(--success-subtle)' : 'var(--danger-subtle)',
            padding: '1px 6px',
            borderRadius: '3px',
          }}
        >
          {trend.up ? '↑' : '↓'} {trend.value}
        </span>
      )}
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
        padding: '6px 14px',
        backgroundColor: isDisabled ? 'var(--bg-elevated)' : 'var(--accent)',
        color: isDisabled ? 'var(--text-muted)' : '#000',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: isDisabled ? 0.4 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!isDisabled) (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (!isDisabled) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
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
        padding: '6px 14px',
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }
        props.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        props.onMouseUp?.(e);
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
        padding: '6px 14px',
        backgroundColor: 'transparent',
        color: 'var(--danger)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--danger-subtle)';
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
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
        padding: '6px 10px',
        backgroundColor: 'transparent',
        color: 'var(--text-muted)',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
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
            letterSpacing: '0.06em',
            marginBottom: '5px',
          }}
        >
          {label}
        </label>
      )}
      <input
        {...inputProps}
        style={{
          width: '100%',
          padding: '7px 10px',
          backgroundColor: 'var(--bg)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius)',
          fontSize: '13px',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          fontFamily: 'Geist, sans-serif',
          boxShadow: error ? '0 0 0 2px rgba(239,68,68,0.12)' : 'none',
          ...inputProps.style,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
          (e.currentTarget as HTMLElement).style.boxShadow = error
            ? '0 0 0 2px rgba(239,68,68,0.15)'
            : '0 0 0 2px var(--accent-glow)';
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = error ? 'var(--danger)' : 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.boxShadow = error ? '0 0 0 2px rgba(239,68,68,0.12)' : 'none';
          inputProps.onBlur?.(e);
        }}
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
        width: '100%',
        padding: '7px 10px',
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius)',
        fontSize: '13px',
        color: 'var(--text-primary)',
        outline: 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer',
        fontFamily: 'Geist, sans-serif',
        ...props.style,
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px var(--accent-glow)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
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
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
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
  letterSpacing: '0.06em',
  backgroundColor: 'var(--bg-elevated)',
};

export const tdStyle: CSSProperties = {
  padding: '11px 16px',
  color: 'var(--text-primary)',
  fontSize: '12px',
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
      style={{
        borderBottom: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
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
