import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Inbox, ClipboardList, Package, Receipt, ShieldCheck, User, Wrench, GaugeCircle, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Gauge,         k: '01', title: 'Operations dashboard',  desc: 'Bay occupancy, SLA, revenue, mechanic utilization in one tactical view. Refreshes every 4 seconds.' },
  { icon: Inbox,         k: '02', title: 'Approval inbox',         desc: 'Triage incoming bookings with priority and customer history. One-tap mechanic assignment.' },
  { icon: ClipboardList, k: '03', title: 'Job cards',              desc: 'Step-by-step task lists with timestamps, parts consumption, photos and customer sign-off.' },
  { icon: Package,       k: '04', title: 'Parts inventory',        desc: 'Live stock counts, reorder triggers, supplier ledger. Auto-consume on job complete.' },
  { icon: Receipt,       k: '05', title: 'Customer billing',       desc: 'Itemized invoices issued automatically. Card on file, ACH or counter pay.' },
  { icon: ShieldCheck,   k: '06', title: 'Admin command',          desc: 'Regional rollout, audit log, user provisioning, SOC 2 controls. Built for multi-tenant.' },
];

const ROLES = [
  { r: 'Customer', icon: User,         desc: 'Book service, track jobs in real time, pay invoices, manage your garage.' },
  { r: 'Mechanic', icon: Wrench,       desc: 'Workbench-style task list, parts requisition, on-shift dispatch from a phone.' },
  { r: 'Manager',  icon: GaugeCircle,  desc: 'Floor command center: bays, mechanics, approvals, inventory, reviews.' },
  { r: 'Admin',    icon: ShieldCheck,  desc: 'Multi-center fleet view, audit log, user provisioning and regional SLA.' },
];

function NavLink({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href ?? '#'}
      style={{ fontSize: '12px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
    >
      {children}
    </a>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'Geist, sans-serif' }}>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        backgroundColor: scrolled ? 'rgba(11,14,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{
          maxWidth: '1320px', margin: '0 auto', width: '100%',
          padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px',
              border: '1px solid rgba(16,185,129,0.7)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ display: 'block', width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '1px' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>AutoServe</span>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: '4px' }}>
              Workshop OS
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <NavLink>Product</NavLink>
            <NavLink>Centers</NavLink>
            <NavLink>Pricing</NavLink>
            <NavLink>Docs</NavLink>
            <NavLink>Changelog</NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', height: '32px', padding: '0 12px',
              fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)',
              textDecoration: 'none', borderRadius: '2px',
              transition: 'color 0.15s ease, background-color 0.15s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign in
            </Link>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', height: '32px', padding: '0 14px',
              fontSize: '12px', fontWeight: 500,
              color: '#0B0E14', backgroundColor: '#10B981',
              border: '1px solid #10B981', borderRadius: '2px', textDecoration: 'none',
              transition: 'background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#10B981';
                e.currentTarget.style.borderColor = '#10B981';
              }}
            >
              Open account
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span className="live-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            142 service centers live across NORAM
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            lineHeight: 0.95,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 28px',
            maxWidth: '900px',
          }}>
            Run the service bay,<br />
            <span style={{ color: 'var(--text-secondary)' }}>not the spreadsheet.</span>
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 36px', maxWidth: '680px', lineHeight: 1.65 }}>
            AutoServe is the operating layer for modern automotive service centers. Live job telemetry, mechanic capacity, parts inventory and customer billing — on one terminal, for everyone in the workflow.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '80px', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              height: '44px', padding: '0 20px',
              fontSize: '14px', fontWeight: 500,
              color: '#0B0E14', backgroundColor: '#10B981',
              border: '1px solid #10B981', borderRadius: '2px', textDecoration: 'none',
              transition: 'background-color 0.1s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#10B981';
                e.currentTarget.style.borderColor = '#10B981';
              }}
            >
              Start free trial <ArrowRight size={14} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              height: '44px', padding: '0 20px',
              fontSize: '14px', fontWeight: 500,
              color: 'var(--text-primary)', backgroundColor: 'transparent',
              border: '1px solid var(--border-strong)', borderRadius: '2px', textDecoration: 'none',
              transition: 'background-color 0.1s ease, color 0.1s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.color = '#0B0E14';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Sign in
            </Link>
            <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              14-day trial · no card
            </span>
          </div>
        </div>

        {/* Mock dashboard */}
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ border: '1px solid var(--border-strong)', borderRadius: '6px', backgroundColor: 'var(--bg-card)', overflow: 'hidden' }}>
            {/* Window chrome */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', height: '44px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.6)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.6)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.6)' }} />
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                  autoserve · sf-mission-01 · live
                </span>
              </div>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)' }}>
                {new Date().toLocaleTimeString('en-US', { hour12: true })}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
              {/* Bays */}
              <div style={{ padding: '24px', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Active bays · 6 of 6 instrumented
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'BAY-01', status: 'occupied', vehicle: 'Tesla Model 3', eta: 'ETA 14:30' },
                    { id: 'BAY-02', status: 'in_progress', vehicle: 'Honda Civic', eta: 'ETA 15:00' },
                    { id: 'BAY-03', status: 'open', vehicle: '— available —', eta: null },
                    { id: 'BAY-04', status: 'occupied', vehicle: 'BMW X5', eta: 'ETA 16:45' },
                    { id: 'BAY-05', status: 'pending', vehicle: 'Ford F-150', eta: 'ETA 17:00' },
                    { id: 'BAY-06', status: 'open', vehicle: '— available —', eta: null },
                  ].map(bay => {
                    const colors: Record<string, string> = {
                      occupied: 'rgba(59,130,246,0.3)',
                      in_progress: 'rgba(59,130,246,0.3)',
                      open: 'rgba(16,185,129,0.3)',
                      pending: 'rgba(234,179,8,0.3)',
                    };
                    return (
                      <div key={bay.id} style={{
                        border: `1px solid ${colors[bay.status] ?? 'var(--border)'}`,
                        borderRadius: '4px', padding: '12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)' }}>{bay.id}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {bay.vehicle}
                        </div>
                        {bay.eta && (
                          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {bay.eta}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Today · revenue ladder</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  {[
                    { label: 'Booked', value: '$18,420', accent: false },
                    { label: 'Goal',   value: '$22,000', accent: true  },
                  ].map((s, i) => (
                    <div key={s.label} style={{ padding: '12px', borderRight: i === 0 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                      <div style={{
                        fontFamily: 'Geist Mono, monospace', fontSize: '16px',
                        color: s.accent ? 'var(--accent)' : 'var(--text-primary)',
                        fontVariantNumeric: 'tabular-nums', marginTop: '4px',
                      }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SLA today</span>
                    <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '12px', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>98.2%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '1px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '98.2%', backgroundColor: 'var(--accent)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Modules
          </div>
          <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 48px', maxWidth: '600px' }}>
            Five surfaces. One source of truth.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.k}
                  style={{
                    padding: '24px',
                    borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)',
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{f.k}</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15,18,24,0.4)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Who it's for
          </div>
          <h2 style={{ fontSize: '40px', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 48px', maxWidth: '600px' }}>
            Built for four kinds of operator.
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden',
          }}>
            {ROLES.map((x, i) => {
              const Icon = x.icon;
              return (
                <div key={x.r} style={{
                  padding: '24px',
                  backgroundColor: 'var(--bg-card)',
                  borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Icon size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{x.r}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>{x.desc}</div>
                  <Link to="/login" style={{
                    fontSize: '12px', color: 'var(--accent)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    transition: 'gap 0.15s ease',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '10px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '6px'; }}
                  >
                    View workspace <ArrowRight size={11} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '1320px', margin: '0 auto', padding: '80px 24px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Ready
            </div>
            <h2 style={{ fontSize: '44px', lineHeight: 1, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 20px' }}>
              Spin up a center<br />in 12 minutes.
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '480px', lineHeight: 1.65 }}>
              Onboarding wizard handles bays, mechanics, services and inventory seed in one pass.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              height: '44px', padding: '0 20px',
              fontSize: '14px', fontWeight: 500,
              color: '#0B0E14', backgroundColor: '#10B981',
              border: '1px solid #10B981', borderRadius: '2px', textDecoration: 'none',
              transition: 'background-color 0.1s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#10B981';
                e.currentTarget.style.borderColor = '#10B981';
              }}
            >
              Open account <ArrowRight size={14} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              height: '44px', padding: '0 20px',
              fontSize: '14px', fontWeight: 500,
              color: 'var(--text-primary)', backgroundColor: 'transparent',
              border: '1px solid var(--border-strong)', borderRadius: '2px', textDecoration: 'none',
              transition: 'background-color 0.1s ease, color 0.1s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.color = '#0B0E14';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{
          maxWidth: '1320px', margin: '0 auto',
          padding: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'Geist Mono, monospace', fontSize: '11px',
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          <span>© 2026 AutoServe Systems</span>
          <span>San Francisco · Berlin · Singapore</span>
        </div>
      </footer>
    </div>
  );
}
