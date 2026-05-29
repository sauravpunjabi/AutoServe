// AutoServe — main shell + router (public + workspace)
const { useState: appUseState, useEffect: appUseEffect, useMemo: appUseMemo } = React;

const ROLES = [
  { id: 'customer', label: 'Customer', icon: 'user',          shortcut: '1' },
  { id: 'manager',  label: 'Manager',  icon: 'gauge-circle',  shortcut: '2' },
  { id: 'mechanic', label: 'Mechanic', icon: 'wrench',        shortcut: '3' },
  { id: 'admin',    label: 'Admin',    icon: 'shield-check',  shortcut: '4' },
];

const NAV_BY_ROLE = {
  customer: [
    { id: 'dashboard',       label: 'Dashboard',       icon: 'layout-dashboard' },
    { id: 'vehicles',        label: 'Vehicles',        icon: 'car' },
    { id: 'bookings',        label: 'Bookings',        icon: 'calendar' },
    { id: 'jobtracker',      label: 'Job tracker',     icon: 'activity', badge: 'LIVE' },
    { id: 'invoices',        label: 'Invoices',        icon: 'receipt',  badge: '1' },
    { id: 'servicecenters',  label: 'Service centers', icon: 'building-2' },
  ],
  manager: [
    { id: 'dashboard',           label: 'Dashboard',     icon: 'gauge' },
    { id: 'bookings',            label: 'Bookings',      icon: 'inbox', badge: '5' },
    { id: 'jobcards',            label: 'Job cards',     icon: 'clipboard-list' },
    { id: 'mechanics',           label: 'Mechanics',     icon: 'users' },
    { id: 'inventory',           label: 'Inventory',     icon: 'package' },
    { id: 'invoices',            label: 'Invoices',      icon: 'receipt' },
    { id: 'reviews',             label: 'Reviews',       icon: 'message-square' },
    { id: 'managecenter',        label: 'Manage center', icon: 'settings-2' },
    { id: 'createcenter',        label: 'Open new center', icon: 'plus-circle' },
    { id: 'profile',             label: 'Profile',       icon: 'user-cog' },
  ],
  mechanic: [
    { id: 'dashboard',       label: 'Workbench',       icon: 'wrench' },
    { id: 'jobcards',        label: 'Job cards',       icon: 'clipboard-list', badge: '3' },
    { id: 'servicecenters',  label: 'Service centers', icon: 'building-2' },
    { id: 'profile',         label: 'Profile',         icon: 'user-cog' },
  ],
  admin: [
    { id: 'dashboard',       label: 'Command',         icon: 'satellite-dish' },
    { id: 'users',           label: 'Users',           icon: 'user-cog' },
    { id: 'servicecenters',  label: 'Service centers', icon: 'building-2' },
  ],
};

// Display label for a section, including the special detail routes
function sectionLabelOf(role, section) {
  if (section === 'bookingdetail') return 'Booking · detail';
  if (section === 'jobcarddetail') return 'Job card · detail';
  return NAV_BY_ROLE[role].find(n => n.id === section)?.label || section;
}

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="inline-flex border border-line2 rounded-xs overflow-hidden">
      {ROLES.map(r => {
        const active = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-2 h-8 px-3 text-[12px] transition-colors border-r border-line2 last:border-r-0 ${active ? 'bg-ink text-obsidian' : 'bg-transparent text-silver hover:text-ink hover:bg-white/[0.04]'}`}
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

function Sidebar({ role, section, setSection, onSignOut }) {
  const items = NAV_BY_ROLE[role];
  const u = DB.user[role];
  const centerSub = role === 'customer' ? '3 vehicles' :
                    role === 'manager'  ? 'SF · Mission' :
                    role === 'mechanic' ? 'SF · Mission · Bay 3' :
                                          'NORAM-WEST · 6 centers';

  return (
    <aside className="w-56 shrink-0 border-r border-line bg-panel/40 min-h-screen sticky top-0 flex flex-col">
      <div className="px-5 h-14 flex items-center border-b border-line shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 border border-teal/70 rounded-md flex items-center justify-center">
            <span className="block w-2.5 h-2.5 bg-teal rounded-[1px]" />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-ink tracking-tight">AutoServe</div>
            <div className="text-[11px] text-mute truncate max-w-[140px]">{centerSub}</div>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-px flex-1 overflow-y-auto scroll-thin">
        <div className="text-[11px] text-mute px-2 py-2 uppercase tracking-wider">{role === 'admin' ? 'Command' : role === 'mechanic' ? 'Workbench' : role === 'manager' ? 'Operations' : 'My account'}</div>
        {items.map(it => {
          const active = section === it.id ||
                         (it.id === 'bookings' && section === 'bookingdetail') ||
                         (it.id === 'jobcards' && section === 'jobcarddetail');
          return (
            <button
              key={it.id}
              onClick={() => setSection(it.id)}
              className={`w-full flex items-center justify-between gap-3 h-9 px-2.5 text-[13px] rounded-xs transition-colors ${active ? 'bg-ink text-obsidian' : 'text-silver hover:bg-white/[0.04] hover:text-ink'}`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon name={it.icon} size={14} />
                <span className="truncate">{it.label}</span>
              </span>
              {it.badge && (
                <span className={`text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded-xs border whitespace-nowrap ${active ? 'border-obsidian/30 bg-obsidian/10' : it.badge === 'LIVE' ? 'border-teal/40 text-teal bg-teal/10' : 'border-line2 text-warn'}`}>
                  {it.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="text-[11px] text-mute px-2 pt-6 pb-2 uppercase tracking-wider">System</div>
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

      <div className="p-3 border-t border-line shrink-0">
        <button onClick={onSignOut} className="w-full flex items-center gap-3 px-2 py-2 rounded-xs hover:bg-white/[0.04] transition-colors text-left">
          <div className="w-8 h-8 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink shrink-0">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-[12px] text-ink truncate">{u.name}</div>
            <div className="font-mono text-[10px] text-mute tracking-wider tnum">{u.id}</div>
          </div>
          <Icon name="log-out" size={13} className="text-mute" />
        </button>
      </div>
    </aside>
  );
}

function CommandBarRoleAware({ role, section, setRole }) {
  const sectionLabel = sectionLabelOf(role, section);
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
      </div>
    </header>
  );
}

function renderRoute(role, section, ctx) {
  // ctx = { pushToast, setSection }
  const goDetail = (id, route) => ctx.setSection(route);
  const goBack   = (route) => ctx.setSection(route);

  if (role === 'customer') {
    switch (section) {
      case 'dashboard':      return <CustomerDashboard pushToast={ctx.pushToast} />;
      case 'vehicles':       return <CustomerVehiclesPage />;
      case 'bookings':       return <CustomerBookingsPage />;
      case 'jobtracker':     return <CustomerJobTrackerPage pushToast={ctx.pushToast} />;
      case 'invoices':       return <CustomerInvoicesPage pushToast={ctx.pushToast} />;
      case 'servicecenters': return <CustomerServiceCentersPage />;
    }
  }
  if (role === 'manager') {
    switch (section) {
      case 'dashboard':      return <ManagerDashboard pushToast={ctx.pushToast} />;
      case 'bookings':       return <ManagerBookingsPage goDetail={() => goDetail(null, 'bookingdetail')} />;
      case 'bookingdetail':  return <ManagerBookingDetailPage goBack={() => goBack('bookings')} pushToast={ctx.pushToast} />;
      case 'jobcards':       return <ManagerJobCardsPage goDetail={() => goDetail(null, 'jobcarddetail')} />;
      case 'jobcarddetail':  return <ManagerJobCardDetailPage goBack={() => goBack('jobcards')} pushToast={ctx.pushToast} />;
      case 'mechanics':      return <ManagerMechanicsPage />;
      case 'inventory':      return <ManagerInventoryPage pushToast={ctx.pushToast} />;
      case 'invoices':       return <ManagerInvoicesPage pushToast={ctx.pushToast} />;
      case 'reviews':        return <ManagerReviewsPage />;
      case 'profile':        return <ManagerProfilePage pushToast={ctx.pushToast} />;
      case 'createcenter':   return <ManagerCreateServiceCenterPage pushToast={ctx.pushToast} />;
      case 'managecenter':   return <ManagerManageServiceCenterPage pushToast={ctx.pushToast} />;
    }
  }
  if (role === 'mechanic') {
    switch (section) {
      case 'dashboard':      return <MechanicDashboard pushToast={ctx.pushToast} />;
      case 'jobcards':       return <MechanicJobCardsPage goDetail={() => goDetail(null, 'jobcarddetail')} />;
      case 'jobcarddetail':  return <MechanicJobCardDetailPage goBack={() => goBack('jobcards')} pushToast={ctx.pushToast} />;
      case 'servicecenters': return <MechanicServiceCentersPage />;
      case 'profile':        return <MechanicProfilePage pushToast={ctx.pushToast} />;
    }
  }
  if (role === 'admin') {
    switch (section) {
      case 'dashboard':      return <AdminDashboard pushToast={ctx.pushToast} />;
      case 'users':          return <AdminUsersPage pushToast={ctx.pushToast} />;
      case 'servicecenters': return <AdminServiceCentersPage pushToast={ctx.pushToast} />;
    }
  }
  return <div className="text-mute text-sm">Route not found: {role}/{section}</div>;
}

function App() {
  // Persisted state
  const [auth, setAuth] = appUseState(() => localStorage.getItem('as_auth') || ''); // '' | 'customer'|...
  const [authView, setAuthView] = appUseState('landing'); // landing | login | register | forgot | reset
  const [section, setSection] = appUseState(() => localStorage.getItem('as_section') || 'dashboard');
  const [toasts, setToasts] = appUseState([]);

  appUseEffect(() => { localStorage.setItem('as_auth', auth); }, [auth]);
  appUseEffect(() => { localStorage.setItem('as_section', section); }, [section]);

  // role shortcuts cmd/ctrl + 1..4
  appUseEffect(() => {
    const h = (e) => {
      if (!auth) return;
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const r = ROLES[parseInt(e.key, 10) - 1];
        if (r) { setAuth(r.id); setSection('dashboard'); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [auth]);

  const pushToast = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(arr => [...arr, { id, ...msg }]);
    setTimeout(() => setToasts(arr => arr.filter(t => t.id !== id)), 3200);
  };

  const onSignOut = () => { setAuth(''); setAuthView('landing'); setSection('dashboard'); };
  const onAuth = (role) => { setAuth(role); setSection('dashboard'); };
  const goPublic = (view) => { setAuthView(view); };

  // Public mode (signed out)
  if (!auth) {
    let view;
    if (authView === 'landing')  view = <LandingPage go={goPublic} />;
    else if (authView === 'login')    view = <LoginPage go={goPublic} onAuth={onAuth} />;
    else if (authView === 'register') view = <RegisterPage go={goPublic} onAuth={onAuth} />;
    else if (authView === 'forgot')   view = <ForgotPasswordPage go={goPublic} />;
    else if (authView === 'reset')    view = <ResetPasswordPage go={goPublic} />;
    else view = <LandingPage go={goPublic} />;

    return (
      <div className="min-h-screen text-ink" data-screen-label={`PUBLIC · ${authView}`}>
        {view}
        <Toaster messages={toasts} />
      </div>
    );
  }

  // Workspace mode
  const role = auth;
  const body = renderRoute(role, section, { pushToast, setSection });
  const handleRoleChange = (r) => { setAuth(r); setSection('dashboard'); };

  return (
    <div className="min-h-screen text-ink" data-screen-label={`${role.toUpperCase()} · ${section}`}>
      <div className="flex">
        <Sidebar role={role} section={section} setSection={setSection} onSignOut={onSignOut} />
        <div className="flex-1 min-w-0 flex flex-col">
          <CommandBarRoleAware role={role} section={section} setRole={handleRoleChange} />
          <main className="flex-1 px-6 py-5 max-w-[1640px] w-full mx-auto">
            {body}
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
