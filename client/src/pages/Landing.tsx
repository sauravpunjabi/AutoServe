import { Link } from 'react-router-dom';
import { Wrench, Car, Calendar, Shield, FileText, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* 1. Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--accent)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wrench size={18} color="white" />
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              AutoServe
            </span>
          </Link>

          {/* Navigation CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '44px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
            }}
          >
            Smart Vehicle Maintenance <br />
            <span style={{ color: 'var(--accent)' }}>& Service Management</span>
          </h1>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 40px',
            }}
          >
            Streamline your vehicle servicing, track repair job cards in real time, and manage invoices and inventory seamlessly across multiple service hubs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
            >
              Book a Service
            </Link>
            <Link
              to="/login"
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Advanced Core Features
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              A centralized digital platform designed to optimize every stage of vehicle maintenance.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Feature 1 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Car size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Vehicle Management
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Register personal vehicles and maintain detailed service histories on one secure dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Calendar size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Smart Booking
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Schedule maintenance slots online at your closest, most convenient workshop.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Wrench size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Expert Mechanics
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Match specialized jobs with certified, experienced technicians automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Clock size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Real-time Tracking
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Track every stage of the active job card from vehicle drop-off to ready-for-pickup.
              </p>
            </div>

            {/* Feature 5 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <FileText size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Digital Invoices
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Obtain clean digital invoices detailing parts and labor costs automatically.
              </p>
            </div>

            {/* Feature 6 */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Shield size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                Quality Assured
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Ensure high workshop standards and stock levels using smart inventory triggers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Four simple phases to service your vehicle digitally and friction-free.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '32px',
            }}
          >
            {/* Step 1 */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>01</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Register</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Sign up as a customer and add your vehicle models and license details.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>02</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Book Service</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Choose a local service center, describe requirements, and book a time slot.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>03</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Track Progress</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                Watch your mechanic start tasks, request parts, and work on your job card.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>04</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Get Invoice</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                View itemized breakdowns and invoices securely once tasks are completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section style={{ padding: '48px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '4px' }}>10K+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Vehicles Serviced</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '4px' }}>98%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Satisfaction Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '4px' }}>50+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Expert Mechanics</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '4px' }}>24/7</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Create an account in minutes to schedule service bookings, check active mechanic milestones, and access invoices cleanly.
          </p>
          <Link
            to="/register"
            style={{
              padding: '12px 32px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: 'var(--radius)',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
            }}
          >
            Create An Account
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{ padding: '32px 24px', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                backgroundColor: 'var(--accent)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wrench size={14} color="white" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              AutoServe
            </span>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AutoServe. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
