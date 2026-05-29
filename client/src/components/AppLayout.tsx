import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  navLinks: NavLink[];
  actions?: React.ReactNode;
  kicker?: string;
}

export default function AppLayout({ children, title, subtitle, navLinks, actions, kicker }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const roleLabel =
    user?.role === 'customer' ? 'My account' :
    user?.role === 'manager'  ? 'Operations' :
    user?.role === 'mechanic' ? 'Workbench'  :
    user?.role === 'admin'    ? 'Command'    : 'Navigation';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '224px',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        backgroundColor: 'rgba(15,18,24,0.6)',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '10px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            border: '1px solid rgba(16,185,129,0.7)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              display: 'block',
              width: '10px',
              height: '10px',
              backgroundColor: '#10B981',
              borderRadius: '1px',
            }} />
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AutoServe
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>
              {user?.role ? `${user.role} workspace` : 'Workshop OS'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '4px 10px 8px',
          }}>
            {roleLabel}
          </div>

          {navLinks.map(({ name, path, icon: Icon, badge }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '36px',
                  padding: '0 10px',
                  borderRadius: '2px',
                  backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
                  color: isActive ? '#0B0E14' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background-color 0.1s ease, color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                </span>
                {badge !== undefined && (
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'Geist Mono, monospace',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    border: `1px solid ${isActive ? 'rgba(11,14,20,0.25)' : 'var(--border-strong)'}`,
                    backgroundColor: isActive ? 'rgba(11,14,20,0.1)' : 'transparent',
                    color: isActive ? '#0B0E14' : 'var(--warning)',
                    flexShrink: 0,
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 8px',
            borderRadius: '2px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'Geist, sans-serif',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, lineHeight: 1.3 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.06em' }}>
                {user?.role}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                borderRadius: '2px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'var(--danger)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ marginLeft: '224px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top command bar */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'rgba(11,14,20,0.8)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '16px',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {user?.role}
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1640px', width: '100%', margin: '0 auto' }}>
          <div className="animate-in">
            {(title || subtitle) && (
              <header style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    {kicker && (
                      <div style={{
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}>
                        {kicker}
                      </div>
                    )}
                    <h1 style={{
                      fontSize: '26px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                    }}>
                      {title}
                    </h1>
                    {subtitle && (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0', lineHeight: 1.5 }}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {actions && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
                      {actions}
                    </div>
                  )}
                </div>
              </header>
            )}
            {children}
          </div>
        </main>

        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          <span>AutoServe · © 2026</span>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px' }}>Workshop OS</span>
        </footer>
      </div>
    </div>
  );
}
