// Manager view — approvals, mechanic assignment, bay status, inventory
const { useState: mUseState, useMemo: mUseMemo, useEffect: mUseEffect } = React;

function PriorityChip({ p }) {
  const map = {
    critical: { fg: '#ef4444', label: 'Critical' },
    high:     { fg: '#eab308', label: 'High'     },
    normal:   { fg: '#94A3B8', label: 'Normal'   },
  };
  const s = map[p] || map.normal;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
      {s.label}
    </span>
  );
}

function ApprovalQueue({ pushToast }) {
  const [items, setItems] = mUseState(DB.approvals);
  const [assignFor, setAssignFor] = mUseState(null);

  const approve = (id) => {
    const it = items.find(i => i.id === id);
    setAssignFor(it);
  };
  const reject = (id) => {
    setItems(arr => arr.filter(i => i.id !== id));
    pushToast({ title: 'Booking rejected', body: id, icon: 'x' });
  };
  const confirmAssign = (mechId) => {
    setItems(arr => arr.filter(i => i.id !== assignFor.id));
    pushToast({ title: 'Approved & assigned', body: `${assignFor.id} → ${DB.mechanics.find(m=>m.id===mechId)?.name}`, icon: 'check' });
    setAssignFor(null);
  };

  return (
    <>
      <Panel
        title="Pending approvals"
        subtitle={`${items.length} bookings awaiting decision`}
        action={<Button size="sm" variant="ghost" icon="refresh-cw">Refresh</Button>}
        innerClassName="p-0"
      >
        {items.length === 0
          ? <EmptyState icon="check-check" title="Inbox zero" body="No bookings awaiting your approval." />
          : (
            <DataTable
              columns={[
                { header: 'Booking',   cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.id },
                { header: 'Created',   cellClass: 'text-mute whitespace-nowrap', render: r => r.created },
                { header: 'Customer',  cellClass: 'text-ink whitespace-nowrap', render: r => r.customer },
                { header: 'Vehicle',   cellClass: 'text-silver whitespace-nowrap', render: r => <span className="font-mono text-[12px]">{r.vehicle}</span> },
                { header: 'Services',  maxWidth: 320, cellClass: 'text-silver', render: r => <span className="block leading-snug" style={{ wordBreak:'break-word' }}>{r.services}</span> },
                { header: 'Requested', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.requested },
                { header: 'Priority',  render: r => <PriorityChip p={r.priority} /> },
                { header: '',          cellClass: 'whitespace-nowrap', render: r => (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="default" onClick={(e)=>{e.stopPropagation(); reject(r.id);}}>Reject</Button>
                      <Button size="sm" variant="primary" onClick={(e)=>{e.stopPropagation(); approve(r.id);}}>Approve</Button>
                    </div>
                ) },
              ]}
              rows={items}
            />
          )
        }
      </Panel>

      <Modal
        open={!!assignFor}
        onClose={() => setAssignFor(null)}
        kicker="Mechanic assignment"
        title={assignFor ? `Assign mechanic for ${assignFor.id}` : ''}
        width={680}
      >
        {assignFor && (
          <>
            <div className="grid grid-cols-3 gap-0 border border-line2 rounded-md mb-5 overflow-hidden">
              <div className="px-4 py-3 border-r border-line"><div className="text-[11px] text-mute mb-1">Customer</div><div className="text-[13px] text-ink">{assignFor.customer}</div></div>
              <div className="px-4 py-3 border-r border-line"><div className="text-[11px] text-mute mb-1">Vehicle</div><div className="text-[13px] text-ink font-mono">{assignFor.vehicle}</div></div>
              <div className="px-4 py-3"><div className="text-[11px] text-mute mb-1">Requested</div><div className="font-mono text-[13px] text-ink tnum">{assignFor.requested}</div></div>
            </div>
            <div className="text-[12px] text-silver mb-2.5">Available mechanics, sorted by current load</div>
            <ul className="border border-line2 rounded-md divide-y divide-line overflow-hidden">
              {DB.mechanics.filter(m => m.status !== 'off-shift').sort((a,b)=>a.utilization-b.utilization).map(m => (
                <li key={m.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink">{m.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink">{m.name}</div>
                    <div className="text-[11px] text-silver">{m.cert}</div>
                  </div>
                  <div className="w-28">
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-mute">Load</span><span className="text-ink tnum font-mono">{m.utilization}%</span></div>
                    <CapacityBar value={m.utilization} />
                  </div>
                  <div className="text-[11px] text-silver tnum font-mono w-20 text-right">{m.activeJobs}/{m.capacity} jobs</div>
                  <Button
                    size="sm"
                    variant={m.status === 'at-capacity' ? 'default' : 'primary'}
                    disabled={m.status === 'at-capacity'}
                    onClick={() => confirmAssign(m.id)}
                  >
                    {m.status === 'at-capacity' ? 'Full' : 'Assign'}
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
}

function BayGrid() {
  return (
    <Panel
      title="Bay status"
      subtitle="Mission center · 6 bays"
      innerClassName="p-0"
    >
      <div className="grid grid-cols-3 gap-0">
        {DB.bays.map((b, i) => {
          const occupied = b.status === 'occupied';
          const maint = b.status === 'service';
          return (
            <div key={b.id} className={`px-4 py-4 border-line ${i % 3 !== 2 ? 'border-r' : ''} ${i < 3 ? 'border-b' : ''} relative`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-ink">Bay <span className="font-mono">{b.id.replace('BAY-','')}</span></span>
                <StatusBadge status={b.status} />
              </div>
              {occupied ? (
                <>
                  <div className="text-[13px] text-ink truncate mb-0.5">{b.vehicle}</div>
                  <div className="text-[11px] text-silver"><span className="font-mono">{b.jobId}</span> · ETA <span className="font-mono tnum">{b.eta}</span></div>
                  <div className="mt-3 h-1 bg-white/[0.04] border border-line rounded-xs overflow-hidden">
                    <div className="h-full bg-info" style={{ width: (30 + (i*13)%55) + '%' }} />
                  </div>
                </>
              ) : maint ? (
                <>
                  <div className="text-[13px] text-silver">Bay maintenance</div>
                  <div className="text-[11px] text-mute mt-0.5">Hydraulic lift recalibration</div>
                </>
              ) : (
                <>
                  <div className="text-[13px] text-teal">Available</div>
                  <div className="text-[11px] text-silver mt-0.5">Drag a booking to assign →</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function MechanicRoster() {
  return (
    <Panel
      title="Team"
      subtitle="Today's shift"
      action={<Button size="sm" variant="ghost" icon="users">Schedule</Button>}
      innerClassName="p-0"
    >
      <ul className="divide-y divide-line">
        {DB.mechanics.map(m => (
          <li key={m.id} className="flex items-center gap-4 px-5 py-3 row-hover transition-colors">
            <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink shrink-0">
              {m.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink truncate">{m.name}</div>
              <div className="text-[11px] text-silver">{m.cert}</div>
            </div>
            <div className="w-28 hidden md:block">
              <div className="flex justify-between text-[11px] mb-1"><span className="text-mute">Load</span><span className="text-ink tnum font-mono">{m.utilization}%</span></div>
              <CapacityBar value={m.utilization} />
            </div>
            <div className="text-[11px] text-silver tnum font-mono w-12 text-right hidden sm:block">{m.activeJobs}/{m.capacity}</div>
            <StatusBadge status={m.status} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function InventoryAlerts() {
  const lowStock = DB.inventory.filter(i => i.stock < i.reorder);
  return (
    <Panel
      title="Inventory"
      subtitle={`${lowStock.length} SKUs below reorder threshold`}
      action={
        <div className="flex items-center gap-2">
          <Input icon="search" placeholder="SKU, name…" className="w-56" />
          <Button size="sm" variant="warn" icon="shopping-cart">Reorder all</Button>
        </div>
      }
      innerClassName="p-0"
    >
      <DataTable
        columns={[
          { header: 'SKU',      cellClass: 'font-mono text-ink whitespace-nowrap', render: r => r.sku },
          { header: 'Item',     cellClass: 'text-silver', render: r => r.name, maxWidth: 280 },
          { header: 'Supplier', cellClass: 'text-mute whitespace-nowrap', render: r => r.supplier },
          { header: 'Cost',     cellClass: 'font-mono text-silver tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.cost)}</div> },
          { header: 'Stock',    cellClass: 'whitespace-nowrap', render: r => (
              <div className="flex items-center gap-3 w-36">
                <span className={`font-mono text-[13px] tnum w-8 text-right ${r.stock === 0 ? 'text-danger' : r.stock < r.reorder ? 'text-warn' : 'text-ink'}`}>{r.stock}</span>
                <div className="flex-1"><CapacityBar value={Math.min(100, (r.stock/r.reorder)*100)} color={r.stock === 0 ? '#ef4444' : r.stock < r.reorder ? '#eab308' : '#10B981'} /></div>
                <span className="font-mono text-[11px] text-mute tnum w-8">/{r.reorder}</span>
              </div>
          ) },
          { header: '', cellClass: 'whitespace-nowrap', render: r => (
              <div className="text-right">
                {r.stock < r.reorder
                  ? <Button size="sm" variant="warn">Reorder</Button>
                  : <span className="text-[12px] text-teal">In stock</span>
                }
              </div>
          ) },
        ]}
        rows={DB.inventory}
      />
    </Panel>
  );
}

function ManagerDashboard({ pushToast }) {
  const [loading, setLoading] = mUseState(true);
  mUseEffect(() => { const t = setTimeout(()=>setLoading(false), 600); return () => clearTimeout(t); }, []);

  const sla = mUseMemo(() => 97.4, []);
  const todayRevenue = mUseMemo(() => DB.centers.find(c => c.id === 'SF-MISSION-01').revenue, []);
  const jobsToday = 14;
  const pendingApprovals = DB.approvals.length;

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonBlock h={92} />
        <SkeletonBlock h={320} />
        <div className="grid grid-cols-3 gap-4">
          <SkeletonBlock h={220} />
          <SkeletonBlock h={220} />
          <SkeletonBlock h={220} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-5">
        <KPI label="Pending approvals" value={pendingApprovals} sub="3 added since 10:00" accent="#eab308" />
        <KPI label="Jobs today"        value={jobsToday}        sub="5 in progress · 9 queued" />
        <KPI label="Revenue today"     value={fmtMoney(todayRevenue)} sub="vs $14,920 yesterday" trend="+23%" accent="#10B981" mono />
        <KPI label="Bay occupancy"     value="83%"              sub="5 of 6 bays in use" />
        <KPI label="SLA compliance"    value={`${sla}%`}        sub="7-day rolling avg" />
      </section>

      <ApprovalQueue pushToast={pushToast} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BayGrid />
        <MechanicRoster />
      </div>

      <InventoryAlerts />
    </div>
  );
}

Object.assign(window, { ManagerDashboard });
