// AutoServe — main shell + role router
const { useState: appUseState, useEffect: appUseEffect, useMemo: appUseMemo, useRef: appUseRef } = React;

const ROLES = [
  { id: 'customer', label: 'Customer', icon: 'user',          shortcut: '1' },
  { id: 'manager',  label: 'Manager',  icon: 'gauge-circle',  shortcut: '2' },
  { id: 'mechanic', label: 'Mechanic', icon: 'wrench',        shortcut: '3' },
  { id: 'admin',    label: 'Admin',    icon: 'shield-check',  shortcut: '4' },
];

const NAV_BY_ROLE = {
  customer: [
    { id: 'dashboard', label: 'Dashboard',  icon: 'layout-dashboard' },
    { id: 'vehicles',  label: 'Vehicles',   icon: 'car' },
    { id: 'history',   label: 'History',    icon: 'history' },
    { id: 'invoices',  label: 'Invoices',   icon: 'receipt', badge: '1' },
    { id: 'support',   label: 'Support',    icon: 'life-buoy' },
  ],
  manager: [
    { id: 'dashboard',  label: 'Operations',  icon: 'gauge' },
    { id: 'approvals',  label: 'Approvals',   icon: 'inbox', badge: '5' },
    { id: 'bays',       label: 'Floor',       icon: 'layout-grid' },
    { id: 'mechanics',  label: 'Team',        icon: 'users' },
    { id: 'inventory',  label: 'Inventory',   icon: 'package' },
    { id: 'reports',    label: 'Reports',     icon: 'file-bar-chart' },
  ],
  mechanic: [
    { id: 'dashboard', label: 'Workbench',   icon: 'wrench' },
    { id: 'jobs',      label: 'Job Cards',   icon: 'clipboard-list', badge: '3' },
    { id: 'parts',     label: 'Parts',       icon: 'package-2' },
    { id: 'schedule',  label: 'Schedule',    icon: 'calendar' },
    { id: 'history',   label: 'Completed',   icon: 'check-circle' },
  ],
  admin: [
    { id: 'dashboard',  label: 'Command',     icon: 'satellite-dish' },
    { id: 'centers',    label: 'Centers',     icon: 'building-2' },
    { id: 'analytics',  label: 'Analytics',   icon: 'line-chart' },
    { id: 'users',      label: 'Users',       icon: 'user-cog' },
    { id: 'audit',      label: 'Audit Log',   icon: 'scroll-text' },
    { id: 'settings',   label: 'System',      icon: 'settings-2' },
  ],
};

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="inline-flex border border-line2 rounded-xs overflow-hidden">
      {ROLES.map(r => {
        const active = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-2 h-8 px-3 text-[12px] transition-colors border-r border-line2 last:border-r-0 ${
              active ? 'bg-ink text-obsidian' : 'bg-transparent text-silver hover:text-ink hover:bg-white/[0.04]'
            }`}
            title={`Switch to ${r.label}`}
          >
            <Icon name={r.icon} size={13} />
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Sidebar({ role, section, setSection }) {
  const items = NAV_BY_ROLE[role];
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-panel/40 min-h-screen sticky top-0">
      <div className="px-5 h-14 flex items-center border-b border-line">
        <div className="flex items-center gap-2.5">
          {/* logo mark */}
          <div className="relative w-7 h-7 border border-teal/70 rounded-md flex items-center justify-center">
            <span className="block w-2.5 h-2.5 bg-teal rounded-[1px]" />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-ink tracking-tight">AutoServe</div>
            <div className="text-[11px] text-mute">SF · Mission</div>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-px">
        <div className="text-[11px] text-mute px-2 py-2">Workspace</div>
        {items.map(it => {
          const active = section === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setSection(it.id)}
              className={`w-full flex items-center justify-between gap-3 h-9 px-2.5 text-[13px] rounded-xs transition-colors ${
                active ? 'bg-ink text-obsidian' : 'text-silver hover:bg-white/[0.04] hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon name={it.icon} size={14} />
                {it.label}
              </span>
              {it.badge && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-xs border ${active ? 'border-obsidian/30 bg-obsidian/10' : 'border-line2 text-warn'}`}>
                  {it.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="text-[11px] text-mute px-2 pt-6 pb-2">System</div>
        {[
          { id: 's-notif', label: 'Notifications', icon: 'bell' },
          { id: 's-help',  label: 'Help & Docs',   icon: 'book-open' },
          { id: 's-pref',  label: 'Preferences',   icon: 'sliders-horizontal' },
        ].map(it => (
          <button key={it.id} className="w-full flex items-center gap-2.5 h-8 px-2 text-[13px] text-silver rounded-xs hover:bg-white/[0.04] hover:text-ink transition-colors">
            <Icon name={it.icon} size={14} />
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function CommandBar({ role, section }) {
  const userMap = DB.user;
  const u = userMap[role];
  const sectionLabel = NAV_BY_ROLE[role].find(n => n.id === section)?.label || section;

  return (
    <header className="h-14 border-b border-line bg-obsidian/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="font-mono text-[10px] tracking-[0.22em] text-mute uppercase">
          <span className="text-silver">{role.toUpperCase()}</span>
          <span className="text-mute mx-2">/</span>
          <span className="text-ink">{sectionLabel.toUpperCase()}</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 ml-6">
          <Input icon="search" placeholder={`Search ${role === 'customer' ? 'history, vehicles' : role === 'manager' ? 'bookings, mechanics, SKUs' : role === 'mechanic' ? 'jobs, parts' : 'centers, users, logs'}…`} className="w-[420px]" />
          <span className="font-mono text-[10px] text-mute px-1.5 py-0.5 border border-line2 rounded-xs">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoleSwitcher role={role} setRole={() => {}} />
        <button className="relative w-9 h-9 border border-line2 rounded-xs flex items-center justify-center text-silver hover:text-ink hover:bg-white/[0.04] transition-colors">
          <Icon name="bell" size={14} />
          <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-warn text-obsidian font-mono text-[9px] flex items-center justify-center rounded-xs">3</span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-line">
          <div className="w-8 h-8 border border-line2 rounded-xs flex items-center justify-center font-mono text-[10px] text-ink">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-[11px] text-ink">{u.name}</div>
            <div className="font-mono text-[10px] text-mute tracking-wider">{u.id}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Wrap a setter that also resets section to dashboard on role change
function App() {
  // Persisted state
  const [role, setRole] = appUseState(() => localStorage.getItem('as_role') || 'customer');
  const [section, setSection] = appUseState(() => localStorage.getItem('as_section') || 'dashboard');
  const [toasts, setToasts] = appUseState([]);

  appUseEffect(() => { localStorage.setItem('as_role', role); }, [role]);
  appUseEffect(() => { localStorage.setItem('as_section', section); }, [section]);

  // Keyboard shortcuts
  appUseEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const r = ROLES[parseInt(e.key, 10) - 1];
        if (r) { setRole(r.id); setSection('dashboard'); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const pushToast = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(arr => [...arr, { id, ...msg }]);
    setTimeout(() => setToasts(arr => arr.filter(t => t.id !== id)), 3200);
  };

  const handleRoleChange = (r) => { setRole(r); setSection('dashboard'); };

  // Render the section for current role. We mostly show "dashboard" detailed UI.
  // For other sections, we render a focused "lite" placeholder so the prototype feels complete.
  const Body = appUseMemo(() => {
    if (section === 'dashboard') {
      if (role === 'customer') return <CustomerDashboard pushToast={pushToast} />;
      if (role === 'manager')  return <ManagerDashboard  pushToast={pushToast} />;
      if (role === 'mechanic') return <MechanicDashboard pushToast={pushToast} />;
      if (role === 'admin')    return <AdminDashboard    pushToast={pushToast} />;
    }
    // Lightweight section placeholders that still feel native
    return <SectionPlaceholder role={role} section={section} />;
  }, [role, section]);

  return (
    <div className="min-h-screen text-ink" data-screen-label={`${role.toUpperCase()} · ${section}`}>
      <div className="flex">
        <Sidebar role={role} section={section} setSection={setSection} />
        <div className="flex-1 min-w-0 flex flex-col">
          <CommandBarRoleAware role={role} section={section} setRole={handleRoleChange} />
          <main className="flex-1 px-6 py-5 max-w-[1640px] w-full mx-auto">
            {Body}
          </main>
          <footer className="border-t border-line px-6 py-3.5 flex items-center justify-between text-[11px] text-mute">
            <span>AutoServe · © 2026</span>
            <span>San Francisco · Mission Service Center</span>
          </footer>
        </div>
      </div>
      <Toaster messages={toasts} />
    </div>
  );
}

// Command bar that can actually flip role
function CommandBarRoleAware({ role, section, setRole }) {
  const u = DB.user[role];
  const sectionLabel = NAV_BY_ROLE[role].find(n => n.id === section)?.label || section;
  return (
    <header className="h-14 border-b border-line bg-obsidian/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-[12px] text-silver whitespace-nowrap">
          <span className="capitalize">{role}</span>
          <span className="text-mute mx-2">/</span>
          <span className="text-ink">{sectionLabel}</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 ml-6 flex-1 max-w-[480px]">
          <Input icon="search" placeholder="Search jobs, vehicles, parts, customers…" />
          <span className="text-[11px] text-mute px-1.5 py-0.5 border border-line2 rounded-xs">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoleSwitcher role={role} setRole={setRole} />
        <button className="relative w-9 h-9 border border-line2 rounded-xs flex items-center justify-center text-silver hover:text-ink hover:bg-white/[0.04] transition-colors" aria-label="Notifications">
          <Icon name="bell" size={14} />
          <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-warn text-obsidian text-[10px] font-medium flex items-center justify-center rounded-xs">3</span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-line">
          <div className="w-8 h-8 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-[12px] text-ink">{u.name}</div>
            <div className="text-[11px] text-mute">{u.id}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Section placeholder — bordered, non-bubbly empty state for non-dashboard tabs
function SectionPlaceholder({ role, section }) {
  const label = NAV_BY_ROLE[role].find(n => n.id === section)?.label || section;
  const iconMap = {
    vehicles: 'car', history: 'history', invoices: 'receipt', support: 'life-buoy',
    approvals: 'inbox', bays: 'layout-grid', mechanics: 'users', inventory: 'package', reports: 'file-bar-chart',
    jobs: 'clipboard-list', parts: 'package-2', schedule: 'calendar',
    centers: 'building-2', analytics: 'line-chart', users: 'user-cog', audit: 'scroll-text', settings: 'settings-2',
  };
  return (
    <div className="space-y-4">
      <Panel
        title={label}
        subtitle="This module is wired to the same backend services as the dashboard view."
        innerClassName="p-0"
      >
        <EmptyState
          icon={iconMap[section] || 'database'}
          title={`${label} module ready`}
          body="Switch to the Dashboard tab to see the fully-built primary surface for this role. Every other module in this prototype shares the same primitives — tables, status badges, skeletons — ready to drop into."
          cta={<Button variant="primary" icon="layout-dashboard" onClick={() => {
            const ev = new CustomEvent('autoserve:goto-dashboard');
            window.dispatchEvent(ev);
          }}>Open dashboard</Button>}
        />
      </Panel>
    </div>
  );
}

// hookup go-to-dashboard event from placeholder
window.addEventListener('autoserve:goto-dashboard', () => {
  localStorage.setItem('as_section', 'dashboard');
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
