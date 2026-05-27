import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, Wrench, Clock, FileText, Shield, Users } from 'lucide-react';

function useCountUp(end: number, duration: number = 2000, active: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const frame = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, end, duration]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

const features = [
  { icon: Car, title: 'Vehicle Management', desc: 'Register vehicles and maintain detailed service histories on one secure dashboard.' },
  { icon: Calendar, title: 'Smart Booking', desc: 'Schedule maintenance slots online at your closest, most convenient workshop.' },
  { icon: Wrench, title: 'Expert Mechanics', desc: 'Match specialized jobs with certified, experienced technicians automatically.' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Track every stage of the active job card from drop-off to ready-for-pickup.' },
  { icon: FileText, title: 'Digital Invoices', desc: 'Obtain clean digital invoices detailing parts and labor costs automatically.' },
  { icon: Shield, title: 'Quality Assured', desc: 'Ensure high workshop standards and stock levels using smart inventory triggers.' },
];

const steps = [
  { n: '01', icon: Users, title: 'Register', desc: 'Sign up and add your vehicle models and license details.' },
  { n: '02', icon: Calendar, title: 'Book Service', desc: 'Choose a local service center and book a time slot.' },
  { n: '03', icon: Clock, title: 'Track Progress', desc: 'Watch your mechanic work on your job card live.' },
  { n: '04', icon: FileText, title: 'Get Invoice', desc: 'View itemized breakdowns and invoices once tasks complete.' },
];

const heroWords = ['The', 'smarter', 'way', 'to', 'manage', 'vehicle', 'services.'];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { ref: statsRef, inView: statsVisible } = useInView();
  const { ref: featRef } = useInView();
  const { ref: stepsRef, inView: stepsVisible } = useInView();

  const vehicles = useCountUp(10000, 2200, statsVisible);
  const satisfaction = useCountUp(98, 1600, statsVisible);
  const mechanics = useCountUp(50, 1600, statsVisible);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          backgroundColor: scrolled ? 'rgba(8,8,8,0.9)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Wrench size={16} color="var(--accent)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AutoServe
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/login"
              style={{
                padding: '5px 12px',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                borderRadius: 'var(--radius)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: '5px 12px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px 80px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: '0 0 20px',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            Vehicle Service Management
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
              color: 'var(--text-primary)',
            }}
          >
            {heroWords.map((word, i) => (
              <Fragment key={i}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`,
                    color: word === 'smarter' ? 'var(--accent)' : 'inherit',
                  }}
                >
                  {word}
                </span>
                {i < heroWords.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: '0 auto 32px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s',
            }}
          >
            Streamline vehicle servicing, track repair jobs in real time, and manage invoices and inventory — all in one place.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease 0.4s, transform 0.4s ease 0.4s',
            }}
          >
            <Link
              to="/register"
              style={{
                padding: '10px 22px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              style={{
                padding: '10px 22px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-border)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section ref={featRef} style={{ padding: '80px 24px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 10px' }}>
              Features
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Everything you need to run service operations
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '460px', margin: 0, lineHeight: 1.6 }}>
              A centralized digital platform designed to optimize every stage of vehicle maintenance.
            </p>
          </div>

          {/* 3×2 touching-borders grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              backgroundColor: 'var(--border)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '24px',
                  transition: 'background-color 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
                  const iconEl = (e.currentTarget as HTMLElement).querySelector('.feat-icon-wrap') as HTMLElement;
                  if (iconEl) iconEl.style.backgroundColor = 'var(--accent-border)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-card)';
                  const iconEl = (e.currentTarget as HTMLElement).querySelector('.feat-icon-wrap') as HTMLElement;
                  if (iconEl) iconEl.style.backgroundColor = 'var(--accent-subtle)';
                }}
              >
                <div
                  className="feat-icon-wrap"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Icon size={16} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section ref={stepsRef} style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 10px' }}>
              How It Works
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Four steps from booking to invoice
            </h2>
          </div>

          <div
            className={stepsVisible ? 'stagger-children' : ''}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}
          >
            {steps.map(({ n, icon: Icon, title, desc }, i) => (
              <Fragment key={n}>
                <div style={{ flex: 1, padding: '0 20px 0 0' }}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontFamily: 'Geist Mono, monospace',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      margin: '0 0 12px',
                    }}
                  >
                    {n}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon size={14} color="var(--text-secondary)" />
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                    {desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: '1px',
                      alignSelf: 'stretch',
                      backgroundColor: 'var(--border)',
                      flexShrink: 0,
                      margin: '0 20px 0 0',
                    }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex' }}>
          {[
            { value: statsVisible ? `${vehicles.toLocaleString()}+` : '0+', label: 'Vehicles Serviced' },
            { value: statsVisible ? `${satisfaction}%` : '0%', label: 'Satisfaction Rate' },
            { value: statsVisible ? `${mechanics}+` : '0+', label: 'Expert Mechanics' },
            { value: '24/7', label: 'Support Available' },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: '40px 24px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'Geist Mono, monospace',
                  letterSpacing: '-0.03em',
                  marginBottom: '4px',
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 16px' }}>
            Get Started
          </p>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 10px',
              letterSpacing: '-0.03em',
            }}
          >
            Ready to get started?
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 28px',
            }}
          >
            Create an account in minutes. Schedule service bookings, track job card milestones, and access invoices — all in one place.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '9px 22px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={14} color="var(--accent)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AutoServe
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AutoServe. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
