// Admin pages — Users, ServiceCenters
const { useState: apUseState, useMemo: apUseMemo, useEffect: apUseEffect } = React;

// ============ Admin · Users ============
function AdminUsersPage({ pushToast }) {
  const [role, setRole] = apUseState('all');
  const [q, setQ] = apUseState('');
  const rows = apUseMemo(() => {
    let r = DB.systemUsers;
    if (role !== 'all') r = r.filter(u => u.role === role);
    if (q) r = r.filter(u => `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(q.toLowerCase()));
    return r;
  }, [role, q]);

  const counts = {
    all:      DB.systemUsers.length,
    customer: DB.systemUsers.filter(u => u.role === 'customer').length,
    manager:  DB.systemUsers.filter(u => u.role === 'manager').length,
    mechanic: DB.systemUsers.filter(u => u.role === 'mechanic').length,
    admin:    DB.systemUsers.filter(u => u.role === 'admin').length,
  };

  const roleColor = {
    customer: { fg: '#94A3B8' },
    manager:  { fg: '#3b82f6' },
    mechanic: { fg: '#10B981' },
    admin:    { fg: '#eab308' },
  };

  const statusLabel = {
    active:    { label: 'ACTIVE',    status: 'open' },
    suspended: { label: 'SUSPENDED', status: 'cancelled' },
    invited:   { label: 'INVITED',   status: 'pending' },
    inactive:  { label: 'INACTIVE',  status: 'off-shift' },
  };

  return (
    <div>
      <PageHeader
        kicker="Identity & access"
        title="Users"
        subtitle="All user accounts across the AutoServe platform."
        actions={<>
          <Input icon="search" placeholder="Name, email, ID…" value={q} onChange={e => setQ(e.target.value)} className="w-72" />
          <Button size="sm" variant="default" icon="download">Export</Button>
          <Button size="sm" variant="primary" icon="user-plus">Invite user</Button>
        </>}
      />

      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-5 mb-4">
        <KPI label="Total accounts"  value={counts.all}      sub="across all roles" />
        <KPI label="Customers"       value={counts.customer} sub="end users" />
        <KPI label="Managers"        value={counts.manager}  sub="across 6 centers" accent="#3b82f6" />
        <KPI label="Mechanics"       value={counts.mechanic} sub="48 across fleet" accent="#10B981" />
        <KPI label="Admins"          value={counts.admin}    sub="region & global"  accent="#eab308" />
      </section>

      <div className="mb-4">
        <Segmented
          value={role}
          onChange={setRole}
          options={[
            { label:`All · ${counts.all}`,           value:'all' },
            { label:`Customers · ${counts.customer}`,value:'customer' },
            { label:`Managers · ${counts.manager}`,  value:'manager' },
            { label:`Mechanics · ${counts.mechanic}`,value:'mechanic' },
            { label:`Admins · ${counts.admin}`,      value:'admin' },
          ]}
        />
      </div>

      <Panel innerClassName="p-0" subtitle={`${rows.length} of ${DB.systemUsers.length} accounts`}>
        <DataTable
          columns={[
            { header: '', cellClass: 'w-6', render: () => (
              <span className="w-4 h-4 border border-line2 rounded-xs bg-panel2 inline-block" />
            )},
            { header: 'User', cellClass: 'whitespace-nowrap', render: u => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink">{u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div>
                  <div className="text-[13px] text-ink">{u.name}</div>
                  <div className="font-mono text-[11px] text-mute">{u.id}</div>
                </div>
              </div>
            )},
            { header: 'Email', cellClass: 'font-mono text-silver whitespace-nowrap', render: u => u.email },
            { header: 'Role', cellClass: 'whitespace-nowrap', render: u => (
              <span className="inline-flex items-center gap-1.5 text-[12px] capitalize" style={{ color: roleColor[u.role].fg }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor[u.role].fg }} />
                {u.role}
              </span>
            )},
            { header: 'Status', render: u => <StatusBadge status={statusLabel[u.status].status} label={statusLabel[u.status].label} /> },
            { header: 'Created', cellClass: 'font-mono text-mute tnum whitespace-nowrap', render: u => u.created },
            { header: 'Last seen', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: u => u.lastSeen },
            { header: '', cellClass: 'text-right whitespace-nowrap', render: u => (
              <div className="flex justify-end gap-2">
                {u.status === 'invited' && <Button size="sm" variant="ghost" icon="send" onClick={() => pushToast && pushToast({ title: 'Invite re-sent', body: u.email })}>Resend</Button>}
                {u.status === 'active'  && <Button size="sm" variant="ghost" icon="user-x" onClick={() => pushToast && pushToast({ title: 'User suspended', body: u.id, icon: 'x' })}>Suspend</Button>}
                {u.status === 'suspended' && <Button size="sm" variant="ghost" icon="user-check" onClick={() => pushToast && pushToast({ title: 'User reactivated', body: u.id })}>Reactivate</Button>}
                <Button size="sm" variant="ghost" icon="more-horizontal" aria-label="More" />
              </div>
            )},
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

// ============ Admin · ServiceCenters ============
function AdminServiceCentersPage({ pushToast }) {
  const [selected, setSelected] = apUseState(DB.centers[0].id);
  const c = DB.centers.find(x => x.id === selected) || DB.centers[0];

  const totalBays = DB.centers.reduce((s, c) => s + c.bays, 0);
  const totalOcc  = DB.centers.reduce((s, c) => s + c.occ, 0);
  const totalRev  = DB.centers.reduce((s, c) => s + c.revenue, 0);
  const avgSla    = (DB.centers.reduce((s, c) => s + c.sla, 0) / DB.centers.length).toFixed(1);

  return (
    <div>
      <PageHeader
        kicker="Fleet operations"
        title="Service centers"
        subtitle="All AutoServe-operated centers across the West region."
        actions={<>
          <Input icon="search" placeholder="Center, city, ID…" className="w-64" />
          <Button size="sm" variant="default" icon="map">Map view</Button>
          <Button size="sm" variant="primary" icon="plus">New center</Button>
        </>}
      />

      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-5 mb-4">
        <KPI label="Active centers"  value={DB.centers.length} sub="all online" accent="#10B981" />
        <KPI label="Total bays"      value={totalBays} sub={`${totalOcc} occupied`} />
        <KPI label="Mechanics"       value={DB.centers.reduce((s,c)=>s+c.mechs,0)} sub="across fleet" />
        <KPI label="Revenue today"   value={fmtMoney(totalRev)} sub="combined" trend="+18%" mono />
        <KPI label="Avg SLA"         value={`${avgSla}%`} sub="target 95%" accent={avgSla >= 95 ? '#10B981' : '#eab308'} />
      </section>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <Panel title="All centers" subtitle={`${DB.centers.length} active · West region`} innerClassName="p-0">
            <DataTable
              onRowClick={(r) => setSelected(r.id)}
              columns={[
                { header: 'Center',  cellClass: 'whitespace-nowrap', render: r => (
                  <div>
                    <div className="text-[13px] text-ink">{r.name}</div>
                    <div className="font-mono text-[11px] text-mute">{r.id}</div>
                  </div>
                )},
                { header: 'City', cellClass: 'text-silver whitespace-nowrap', render: r => r.city },
                { header: 'Bays', cellClass: 'whitespace-nowrap', render: r => (
                  <div className="flex items-center gap-2 w-28">
                    <span className="font-mono text-[12px] text-ink tnum w-10 text-right">{r.occ}/{r.bays}</span>
                    <div className="flex-1"><CapacityBar value={(r.occ/r.bays)*100} /></div>
                  </div>
                )},
                { header: 'Mechs',   cellClass: 'font-mono text-silver tnum text-right whitespace-nowrap', render: r => <div className="text-right">{r.mechs}</div> },
                { header: 'Revenue', cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.revenue)}</div> },
                { header: 'SLA',     cellClass: 'whitespace-nowrap', render: r => <span className={`font-mono text-[13px] tnum ${r.sla < 95 ? 'text-warn' : 'text-teal'}`}>{r.sla}%</span> },
                { header: '',        cellClass: 'text-right whitespace-nowrap', render: r => <Icon name={selected === r.id ? 'chevron-right' : 'chevron-right'} size={14} className={selected === r.id ? 'text-teal' : 'text-mute'} /> },
              ]}
              rows={DB.centers}
            />
          </Panel>
        </div>

        <aside className="col-span-12 lg:col-span-5 space-y-4">
          <Panel
            title={c.name}
            subtitle={c.id + ' · ' + c.city}
            action={<StatusBadge status="open" label="ONLINE" />}
            innerClassName="p-5"
          >
            <div className="h-32 border border-line rounded-md stripe flex items-center justify-center mb-4">
              <Icon name="map" size={28} className="text-mute" />
            </div>
            <div className="grid grid-cols-2 gap-0 border border-line rounded-md overflow-hidden">
              <div className="px-3 py-2.5 border-r border-b border-line"><div className="text-[11px] text-mute">Bay occupancy</div><div className="font-mono text-[15px] text-ink tnum">{c.occ}/{c.bays}</div></div>
              <div className="px-3 py-2.5 border-b border-line"><div className="text-[11px] text-mute">Mechanics</div><div className="font-mono text-[15px] text-ink tnum">{c.mechs}</div></div>
              <div className="px-3 py-2.5 border-r border-line"><div className="text-[11px] text-mute">Jobs today</div><div className="font-mono text-[15px] text-ink tnum">{c.jobs}</div></div>
              <div className="px-3 py-2.5"><div className="text-[11px] text-mute">SLA</div><div className={`font-mono text-[15px] tnum ${c.sla < 95 ? 'text-warn' : 'text-teal'}`}>{c.sla}%</div></div>
            </div>
            <div className="mt-5">
              <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Revenue · 14d</div>
              <Sparkline data={DB.revenue30.slice(-14).map(v => v * (c.bays / 6))} color="#10B981" height={56} />
            </div>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="primary" icon="external-link" className="flex-1">Inspect</Button>
              <Button size="sm" variant="default" icon="settings-2">Settings</Button>
              <Button size="sm" variant="warn" icon="pause-circle" onClick={() => pushToast && pushToast({ title: 'Center suspended', body: c.id, icon: 'x' })}>Suspend</Button>
            </div>
          </Panel>

          <Panel title="Regional rollup" subtitle="West region · YTD" innerClassName="p-0">
            <ul className="text-[12px]">
              {[
                ['Centers',          '6'],
                ['Total bays',       String(totalBays)],
                ['Total mechanics',  String(DB.centers.reduce((s,c)=>s+c.mechs,0))],
                ['Lifetime jobs',    '187,420'],
                ['Lifetime revenue', '$42.8M'],
                ['Avg SLA · YTD',    `${avgSla}%`],
                ['Avg rating · YTD', '4.7 ★'],
              ].map(([k,v],i) => (
                <li key={i} className="flex justify-between px-4 py-2.5 border-b border-line last:border-b-0">
                  <span className="text-silver">{k}</span><span className="font-mono text-ink tnum">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { AdminUsersPage, AdminServiceCentersPage });
