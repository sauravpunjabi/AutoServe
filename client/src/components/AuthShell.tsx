import { ReactNode } from 'react';

export function AuthBrandPanel({ children }: { children?: ReactNode }) {
  return (
    <aside style={{
      width: '44%',
      minWidth: '340px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div className="grid-bg" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }} />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom right, transparent 40%, rgba(11,14,20,0.85))',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '1px solid rgba(16,185,129,0.7)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ display: 'block', width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '1px' }} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AutoServe</div>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Workshop OS
          </div>
        </div>
      </div>

      {/* Main content */}
      {children ?? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              v4.2 · live
            </div>
            <h2 style={{
              fontSize: '38px',
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 16px',
            }}>
              The operating layer<br />for modern service bays.
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7, maxWidth: '340px' }}>
              Live job telemetry, parts inventory, mechanic capacity, customer billing — all on one terminal. No spreadsheets, no clipboards.
            </p>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--border-strong)',
            borderRadius: '6px',
            overflow: 'hidden',
            maxWidth: '360px',
          }}>
            {[
              { label: 'Centers', value: '142' },
              { label: 'Jobs/day', value: '8,210' },
              { label: 'SLA', value: '97.4%', accent: true },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: '12px 16px',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: '18px',
                  color: stat.accent ? 'var(--accent)' : 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        fontFamily: 'Geist Mono, monospace',
        fontSize: '10px',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        © 2026 AutoServe Systems · SOC 2 Type II
      </div>
    </aside>
  );
}

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <main style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px',
      backgroundColor: 'var(--bg)',
    }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </div>
    </main>
  );
}
