import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export interface NavLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  navLinks: NavLink[];
  actions?: React.ReactNode;
}

export default function AppLayout({ children, title, subtitle, navLinks, actions }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          width: expanded ? '200px' : '52px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '10px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
          >
            AutoServe
          </span>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: '8px 6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {navLinks.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            const isItemHovered = hoveredPath === path;
            return (
              <Link
                key={path}
                to={path}
                title={!expanded ? name : undefined}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: expanded ? '10px' : '0',
                  height: '36px',
                  padding: '0 8px',
                  justifyContent: expanded ? 'flex-start' : 'center',
                  borderRadius: 'var(--radius)',
                  borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  backgroundColor: isActive
                    ? 'var(--accent-subtle)'
                    : isItemHovered
                    ? 'var(--bg-hover)'
                    : 'transparent',
                  color: isActive ? 'var(--accent)' : isItemHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={16}
                  style={{
                    flexShrink: 0,
                    color: isActive
                      ? 'var(--accent)'
                      : isItemHovered
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    transition: 'color 0.15s ease',
                  }}
                />
                {expanded && (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: '8px 6px',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          {expanded ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#000',
                  fontFamily: 'Geist Mono, monospace',
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name}
                </p>
                <p
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    margin: '1px 0 0',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.role}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                style={{
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.25)';
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
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 8px' }}>
              <div
                title={user?.name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#000',
                  fontFamily: 'Geist Mono, monospace',
                  cursor: 'default',
                }}
              >
                {initials}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main — margin stays at 52px; sidebar overlays */}
      <div
        style={{
          marginLeft: '52px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <main style={{ flex: 1, padding: '24px 32px' }}>
          <div className="animate-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Page header */}
            <div
              style={{
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
