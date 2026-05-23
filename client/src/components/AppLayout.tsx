import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <aside
        style={{
          width: collapsed ? '60px' : '220px',
          flexShrink: 0,
          position: 'fixed',
          inset: '0 auto 0 0',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          transition: 'width 0.2s ease',
        }}
      >
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 17px' : '0 20px',
            borderBottom: '1px solid var(--border)',
            gap: '10px',
            transition: 'padding 0.2s ease',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              backgroundColor: 'var(--accent)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              AutoServe
            </span>
          )}
        </div>

        <nav style={{ flex: 1, padding: collapsed ? '12px 5px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px', transition: 'padding 0.2s ease' }}>
          {navLinks.map(({ name, path, icon: Icon }) => {
            const isActive =
              location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? name : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? '0' : '10px',
                  padding: collapsed ? '8px 0' : '8px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                  transition: 'all 0.15s, padding 0.2s ease, gap 0.2s ease',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={15} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                {!collapsed && name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: collapsed ? '12px 5px' : '12px 10px', borderTop: '1px solid var(--border)', transition: 'padding 0.2s ease' }}>
          {!collapsed && (
            <div style={{ padding: '8px 12px', marginBottom: '4px' }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
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
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  textTransform: 'capitalize',
                }}
              >
                {user?.role}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Sign out" : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? '0' : '10px',
              width: '100%',
              padding: collapsed ? '8px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'all 0.15s, padding 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.08)';
              (e.currentTarget as HTMLElement).style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && 'Sign out'}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-end',
              width: '100%',
              padding: collapsed ? '8px 0' : '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginTop: '4px',
              transition: 'all 0.15s, padding 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      </aside>

      <div
        style={{
          marginLeft: collapsed ? '60px' : '220px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.2s ease',
        }}
      >
        <main style={{ flex: 1, padding: '40px 48px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div
              style={{
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
