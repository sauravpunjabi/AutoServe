import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, Wrench, Package, FileText, Zap, Building2, Receipt } from 'lucide-react';

function useCountUp(end: number, duration: number = 1200, active: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    let animId: number;
    const frame = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // Easing: easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      }
    };
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [active, end, duration]);
  return count;
}

const useInView = (threshold = 0.15) => {
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView] as const;
};

const features = [
  { icon: Car, title: 'Vehicle Management', desc: 'Track all your vehicles and complete service history in one place' },
  { icon: Calendar, title: 'Smart Booking', desc: 'Book multiple services at once with live price calculation' },
  { icon: Wrench, title: 'Job Card System', desc: 'Digital job cards with real-time task-level progress tracking' },
  { icon: Package, title: 'Inventory Control', desc: 'Track parts, get low stock alerts, auto-deduct on usage' },
  { icon: FileText, title: 'Digital Invoices', desc: 'Auto-generated invoices with PDF download and online payment' },
  { icon: Zap, title: 'Real-time Updates', desc: 'Live job progress via WebSockets — no page refresh needed' },
];

const steps = [
  { num: '01', icon: Building2, title: 'Setup', desc: 'Manager creates a service center, mechanics join' },
  { num: '02', icon: Calendar, title: 'Book', desc: 'Customer selects services and books appointment' },
  { num: '03', icon: Wrench, title: 'Service', desc: 'Mechanic works through digital job card tasks' },
  { num: '04', icon: Receipt, title: 'Invoice', desc: 'Invoice auto-generated, customer pays online' },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [featRef, featInView] = useInView(0.15);
  const [howRef, howInView] = useInView(0.15);
  const [statsRef, statsInView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.15);

  const vehiclesVal = useCountUp(10, 1200, statsInView);
  const satisfactionVal = useCountUp(98, 1200, statsInView);
  const mechanicsVal = useCountUp(50, 1200, statsInView);

  return (
    <div style={{ backgroundColor: '#080808', color: '#fafafa', minHeight: '100vh', fontFamily: 'Geist, sans-serif' }}>
      
      {/* HEADER — sticky, 52px height */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          backgroundColor: scrolled ? 'rgba(8, 8, 8, 0.9)' : '#080808',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
          transition: 'background-color 0.2s ease, border-bottom 0.2s ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: wrench icon + "AutoServe" */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Wrench size={14} color="#f97316" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.03em' }}>
              AutoServe
            </span>
          </Link>

          {/* Right: Log in + Get started */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#717171',
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                transition: 'color 0.15s ease, background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fafafa';
                e.currentTarget.style.backgroundColor = '#141414';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#717171';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Log in
            </Link>
            <Link
              to="/register"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#080808',
                backgroundColor: '#f97316',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                transition: 'background-color 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fb923c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — full viewport height, flex center */}
      <section
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '52px 24px 0',
          boxSizing: 'border-box',
          backgroundColor: '#080808',
        }}
      >
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Eyebrow */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#717171',
              marginBottom: '20px',
            }}
          >
            Vehicle Service Management
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#fafafa',
              margin: '0',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
            }}
          >
            The <span style={{ color: '#f97316' }}>smarter</span> way to manage vehicle services.
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: '15px',
              color: '#717171',
              lineHeight: 1.6,
              maxWidth: '460px',
              margin: '16px auto 0',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s',
            }}
          >
            One platform for customers, mechanics, managers, and admins. Book services, track jobs, manage inventory.
          </p>

          {/* CTA row */}
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
            }}
          >
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                padding: '0 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#080808',
                backgroundColor: '#f97316',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fb923c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f97316'; }}
            >
              Get started
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                padding: '0 20px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#fafafa',
                backgroundColor: 'transparent',
                border: '1px solid #1f1f1f',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#fafafa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1f1f1f';
                e.currentTarget.style.color = '#fafafa';
              }}
            >
              Sign in
            </Link>
          </div>

          {/* Metrics row */}
          <div
            style={{
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.55s, transform 0.5s ease 0.55s',
            }}
          >
            {[
              { val: '10K+', label: 'Vehicles Serviced' },
              { val: '98%', label: 'Satisfaction' },
              { val: '50+', label: 'Mechanics' },
              { val: '24/7', label: 'Support' }
            ].map((metric, i) => (
              <Fragment key={metric.label}>
                <div style={{ padding: '0 32px', textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Geist Mono, monospace', color: '#fafafa' }}>
                    {metric.val}
                  </div>
                  <div style={{ fontSize: '10px', color: '#3d3d3d', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {metric.label}
                  </div>
                </div>
                {i < 3 && (
                  <div style={{ width: '1px', height: '24px', backgroundColor: '#1f1f1f' }} />
                )}
              </Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* CSS STYLES FOR RESPONSIVENESS AND ANIMATION */}
      <style>{`
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .connecting-line {
            display: none !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .stat-item {
            border-right: none !important;
            border-bottom: 1px solid #1f1f1f !important;
            padding: 16px 0 !important;
          }
          .stat-item:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>

      {/* SECTION DIVIDER */}
      <div style={{ borderTop: '1px solid #1f1f1f' }} />

      {/* FEATURES SECTION */}
      <section
        ref={featRef}
        style={{
          borderTop: '1px solid #1f1f1f',
          padding: '96px 24px',
          backgroundColor: '#080808',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#717171',
                marginBottom: '12px',
              }}
            >
              FEATURES
            </div>
            <h2
              style={{
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#fafafa',
                margin: 0,
              }}
            >
              Everything you need
            </h2>
          </div>

          {/* Grid Container */}
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              backgroundColor: '#1f1f1f',
              border: '1px solid #1f1f1f',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  style={{
                    backgroundColor: hoveredCardIdx === i ? '#141414' : '#0f0f0f',
                    padding: '28px',
                    transition: 'background-color 0.15s ease, opacity 0.3s ease, transform 0.3s ease',
                    opacity: featInView ? 1 : 0,
                    transform: featInView ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${i * 0.05}s`,
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredCardIdx(i)}
                  onMouseLeave={() => setHoveredCardIdx(null)}
                >
                  <Icon size={16} color="#f97316" />
                  <h3
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#fafafa',
                      marginTop: '14px',
                      marginBottom: 0,
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#717171',
                      marginTop: '6px',
                      lineHeight: 1.6,
                      marginRight: 0,
                      marginLeft: 0,
                      marginBottom: 0,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        ref={howRef}
        style={{
          backgroundColor: '#0f0f0f',
          borderTop: '1px solid #1f1f1f',
          borderBottom: '1px solid #1f1f1f',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#717171',
                marginBottom: '12px',
              }}
            >
              HOW IT WORKS
            </div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#fafafa',
                margin: 0,
              }}
            >
              From booking to invoice in four steps
            </h2>
          </div>

          {/* Row Container */}
          <div
            className="how-it-works-grid"
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
            }}
          >
            {/* Connecting line */}
            <div
              className="connecting-line"
              style={{
                position: 'absolute',
                top: '22px',
                left: '12.5%',
                right: '12.5%',
                height: '1px',
                backgroundColor: '#1f1f1f',
                zIndex: 0,
              }}
            />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center',
                    opacity: howInView ? 1 : 0,
                    transform: howInView ? 'translateY(0)' : 'translateY(10px)',
                    transition: `opacity 0.3s ease ${i * 0.08}s, transform 0.3s ease ${i * 0.08}s`,
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'Geist Mono, monospace',
                      color: '#f97316',
                      marginBottom: '8px',
                    }}
                  >
                    {step.num}
                  </div>
                  
                  {/* Icon Circle */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: '#080808',
                      border: '1px solid #1f1f1f',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    <Icon size={18} color="#717171" />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#fafafa',
                      marginTop: '14px',
                      marginBottom: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#717171',
                      marginTop: '4px',
                      lineHeight: 1.5,
                      marginRight: 0,
                      marginLeft: 0,
                      marginBottom: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section
        ref={statsRef}
        style={{
          backgroundColor: '#080808',
          borderTop: '1px solid #1f1f1f',
          padding: '64px 24px',
        }}
      >
        <div
          className="stats-grid"
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {[
            { val: `${vehiclesVal}K+`, label: 'Vehicles Serviced' },
            { val: `${satisfactionVal}%`, label: 'Satisfaction' },
            { val: `${mechanicsVal}+`, label: 'Mechanics' },
            { val: '24/7', label: 'Support', fadeOnly: true }
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item"
              style={{
                textAlign: 'center',
                padding: '0 32px',
                borderRight: i < 3 ? '1px solid #1f1f1f' : 'none',
                opacity: stat.fadeOnly ? (statsInView ? 1 : 0) : 1,
                transform: stat.fadeOnly ? (statsInView ? 'translateY(0)' : 'translateY(10px)') : 'none',
                transition: stat.fadeOnly ? 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s' : 'none',
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: '36px',
                  fontFamily: 'Geist Mono, monospace',
                  fontWeight: 700,
                  color: '#fafafa',
                  lineHeight: 1.2,
                }}
              >
                {stat.val}
              </div>
              
              {/* Label */}
              <div
                style={{
                  fontSize: '10px',
                  color: '#3d3d3d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '6px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        ref={ctaRef}
        style={{
          backgroundColor: '#080808',
          borderTop: '1px solid #1f1f1f',
          padding: '96px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {/* Heading */}
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              margin: 0,
            }}
          >
            Start managing smarter today.
          </h2>
          
          {/* Subtext */}
          <p
            style={{
              fontSize: '14px',
              color: '#717171',
              marginTop: '12px',
              marginBottom: 0,
            }}
          >
            Join thousands of service centers already on AutoServe.
          </p>

          {/* Button */}
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '28px',
              backgroundColor: '#f97316',
              color: '#000000',
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              filter: ctaHovered ? 'brightness(1.1)' : 'brightness(1)',
              transition: 'filter 0.15s ease',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            Create free account &rarr;
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid #1f1f1f',
          padding: '24px',
          backgroundColor: '#080808',
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={14} color="#f97316" />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#fafafa',
                letterSpacing: '-0.03em',
              }}
            >
              AutoServe
            </span>
          </div>

          {/* Right: Copyright */}
          <div style={{ fontSize: '11px', color: '#3d3d3d' }}>
            &copy; 2026 AutoServe
          </div>
        </div>
      </footer>

    </div>
  );
}
