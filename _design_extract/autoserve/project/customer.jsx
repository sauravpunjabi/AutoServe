// Customer view — live job tracking, vehicles, history, invoices
const { useState: cUseState, useEffect: cUseEffect, useMemo: cUseMemo } = React;

function LiveClock({ className = '' }) {
  const [t, setT] = cUseState(new Date());
  cUseEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const pad = n => String(n).padStart(2,'0');
  return <span className={`font-mono tnum ${className}`}>{pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())}</span>;
}

function ActiveJobHero({ onPay }) {
  const job = DB.activeJob;
  const veh = vehicleById(job.vehicleId);
  const [progress, setProgress] = cUseState(58);

  cUseEffect(() => {
    const i = setInterval(() => { setProgress(p => Math.min(72, p + 0.05)); }, 1100);
    return () => clearInterval(i);
  }, []);

  const completedCount = job.tasks.filter(t => t.status === 'done').length;
  const totalCount = job.tasks.length;

  return (
    <section className="border border-line bg-panel rounded-md overflow-hidden">
      {/* Bar header */}
      <div className="flex items-center justify-between px-5 h-11 border-b border-line">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          <span className="text-[13px] text-ink">Service in progress</span>
          <span className="text-mute">·</span>
          <span className="text-[12px] text-silver">Job <span className="font-mono">{job.id}</span></span>
          <span className="text-mute">·</span>
          <span className="text-[12px] text-silver">Bay <span className="font-mono">{job.bayId.replace('BAY-','')}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-silver">
          <Icon name="clock" size={13} />
          <LiveClock className="text-ink" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Vehicle render placeholder + headlines */}
        <div className="col-span-12 lg:col-span-7 px-7 py-7 border-r border-line relative">
          <div className="absolute top-5 right-5 text-[11px] text-mute">
            VIN <span className="font-mono text-silver ml-1">{veh.vin}</span>
          </div>
          <div className="text-[12px] text-silver mb-2">Now servicing</div>
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-[30px] font-medium tracking-tight leading-none text-ink">{veh.year} {veh.make} {veh.model}</h1>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[12px] px-2 py-0.5 border border-line2 rounded-xs text-ink">{veh.plate}</span>
            <span className="text-[12px] text-silver"><span className="font-mono tnum">{fmtCount(veh.miles)}</span> mi</span>
            <span className="text-mute">·</span>
            <span className="text-[12px] text-silver">{veh.color}</span>
          </div>

          {/* Progress bar */}
          <div className="mb-2.5 flex items-end justify-between">
            <div>
              <div className="text-[12px] text-silver mb-1.5">Job completion</div>
              <div className="flex items-baseline gap-2">
                <div className="text-[40px] leading-none font-medium text-teal tnum">{Math.floor(progress)}<span className="text-silver text-2xl">%</span></div>
                <div className="text-[12px] text-silver"><span className="font-mono tnum">{completedCount}</span> of <span className="font-mono tnum">{totalCount}</span> tasks</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-silver mb-1.5">Estimated completion</div>
              <div className="font-mono text-[20px] text-ink tnum">12:30 PM</div>
              <div className="text-[11px] text-mute mt-0.5">in about 1h 28m</div>
            </div>
          </div>
          <div className="relative h-2 bg-white/[0.04] border border-line rounded-xs overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-teal transition-all duration-700" style={{ width: progress + '%' }} />
          </div>

          {/* meta grid */}
          <div className="grid grid-cols-3 gap-0 mt-7 border border-line rounded-md overflow-hidden">
            <div className="px-4 py-3.5 border-r border-line">
              <div className="text-[11px] text-mute mb-1.5">Service center</div>
              <div className="text-[13px] text-ink">SF · Mission</div>
              <div className="text-[11px] text-silver mt-0.5">123 Valencia St</div>
            </div>
            <div className="px-4 py-3.5 border-r border-line">
              <div className="text-[11px] text-mute mb-1.5">Assigned mechanic</div>
              <div className="text-[13px] text-ink">Diego Marquez</div>
              <div className="text-[11px] text-silver mt-0.5">ASE Master · L1</div>
            </div>
            <div className="px-4 py-3.5">
              <div className="text-[11px] text-mute mb-1.5">Final invoice</div>
              <div className="text-[13px] text-ink font-mono tnum">{fmtMoney(540.00)}</div>
              <div className="text-[11px] text-warn mt-0.5">Due on completion</div>
            </div>
          </div>
        </div>

        {/* Task feed */}
        <div className="col-span-12 lg:col-span-5">
          <div className="px-5 h-11 flex items-center justify-between border-b border-line">
            <div className="text-[13px] text-ink">Activity</div>
            <div className="text-[11px] text-silver">{job.tasks.length} steps</div>
          </div>
          <ol className="px-5 py-4 space-y-0">
            {job.tasks.map((t, i) => {
              const done = t.status === 'done';
              const inProg = t.status === 'in_progress';
              return (
                <li key={t.id} className="relative pl-7 pb-4 last:pb-0">
                  {i < job.tasks.length - 1 && (
                    <span className="absolute left-[9px] top-5 bottom-0 w-px bg-line" />
                  )}
                  <span
                    className={`absolute left-0 top-1 w-[18px] h-[18px] border rounded-full flex items-center justify-center ${
                      done ? 'border-teal bg-teal/10' : inProg ? 'border-info bg-info/10' : 'border-line2 bg-panel2'
                    }`}
                  >
                    {done && <Icon name="check" size={10} className="text-teal" />}
                    {inProg && <span className="w-1.5 h-1.5 rounded-full bg-info" />}
                  </span>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`text-[13px] leading-snug ${done ? 'text-silver' : inProg ? 'text-ink' : 'text-mute'}`}>{t.label}</div>
                      {t.at && <div className="font-mono text-[11px] text-mute mt-0.5 tnum">{t.at}</div>}
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="px-5 py-3.5 border-t border-line flex items-center justify-between">
            <div className="text-[12px] text-silver">
              Updates every few seconds
            </div>
            <Button size="sm" variant="primary" icon="credit-card" onClick={onPay}>Pay {fmtMoney(540.00)}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MyVehicles({ onBook }) {
  return (
    <Panel
      title="Garage"
      subtitle={`${DB.vehicles.length} vehicles registered`}
      action={<Button size="sm" variant="default" icon="plus">Add vehicle</Button>}
      innerClassName="p-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {DB.vehicles.map((v, i) => (
          <div key={v.id} className={`p-5 ${i < DB.vehicles.length - 1 ? 'md:border-r border-line' : ''} hover:bg-white/[0.02] transition-colors`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[15px] font-medium text-ink">{v.year} {v.make}</div>
                <div className="text-[12px] text-silver mt-0.5">{v.model}</div>
              </div>
              <span className="font-mono text-[12px] px-2 py-0.5 border border-line2 rounded-xs text-ink">{v.plate}</span>
            </div>
            {/* placeholder vehicle silhouette */}
            <div className="h-20 border border-line rounded-md mb-5 flex items-center justify-center bg-panel2/40">
              <Icon name={v.battery != null ? 'zap' : 'car'} size={28} className="text-mute" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-mute mb-1">Odometer</div>
                <div className="text-[13px] text-ink"><span className="font-mono tnum">{fmtCount(v.miles)}</span> mi</div>
              </div>
              <div>
                <div className="text-[11px] text-mute mb-1">Next service</div>
                <div className="text-[13px] text-ink font-mono tnum">{v.nextService}</div>
              </div>
              {v.battery != null && (
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] text-mute">Battery health</div>
                    <div className="text-[12px] text-ink tnum font-mono">{v.battery}%</div>
                  </div>
                  <CapacityBar value={v.battery} />
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="default" icon="calendar-plus" onClick={onBook} className="flex-1">Book service</Button>
              <Button size="sm" variant="ghost" icon="more-horizontal" aria-label="More" />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ServiceHistory() {
  const [filter, setFilter] = cUseState('all');
  const rows = cUseMemo(() => {
    if (filter === 'all') return DB.history;
    return DB.history.filter(h => h.status === filter);
  }, [filter]);

  return (
    <Panel
      title="Service history"
      subtitle="Last 12 months"
      action={
        <div className="flex items-center gap-2">
          <Segmented
            options={[{label:'All', value:'all'}, {label:'Completed', value:'completed'}, {label:'Cancelled', value:'cancelled'}]}
            value={filter}
            onChange={setFilter}
          />
          <Button size="sm" variant="ghost" icon="download">Export</Button>
        </div>
      }
      innerClassName="p-0"
    >
      <DataTable
        emptyTitle="No history yet"
        emptyBody="Your completed services will appear here once your first job wraps up."
        emptyIcon="history"
        columns={[
          { header: 'Job',       cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.id },
          { header: 'Date',      cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.date },
          { header: 'Vehicle',   cellClass: 'whitespace-nowrap', render: r => {
              const v = vehicleById(r.vehicleId);
              return <span className="text-ink">{v.year} {v.make} {v.model.split(' ')[0]}</span>;
            } },
          { header: 'Services',  maxWidth: 360, cellClass: 'text-silver', render: r => (
              <span className="block leading-snug" style={{ wordBreak: 'break-word' }}>{r.services}</span>
          )},
          { header: 'Total',     cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.total)}</div> },
          { header: 'Status',    render: r => <StatusBadge status={r.status} /> },
          { header: '',          cellClass: 'text-right whitespace-nowrap', render: r => (
              <button className="text-silver hover:text-teal transition-colors text-[12px]">
                {r.invoice ? `${r.invoice} →` : '—'}
              </button>
          ) },
        ]}
        rows={rows}
      />
    </Panel>
  );
}

function InvoicesPanel({ onPay }) {
  const pending = DB.invoices.filter(i => i.status === 'pending');
  return (
    <Panel
      title="Invoices"
      subtitle={`${pending.length} requiring action`}
      action={<Button size="sm" variant="ghost" icon="external-link">Statement</Button>}
      innerClassName="p-0"
    >
      <ul className="divide-y divide-line">
        {DB.invoices.map(inv => (
          <li key={inv.id} className="flex items-center justify-between gap-4 px-5 py-4 row-hover transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-silver">
                <Icon name="file-text" size={14} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[13px] text-ink">{inv.id}</div>
                <div className="text-[11px] text-silver"><span className="font-mono tnum">{inv.date}</span> · Job <span className="font-mono">{inv.job}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[14px] text-ink tnum">{fmtMoney(inv.amount)}</span>
              <StatusBadge status={inv.status} />
              {inv.status === 'pending'
                ? <Button size="sm" variant="primary" onClick={onPay}>Pay</Button>
                : <Button size="sm" variant="ghost" icon="download" aria-label="Download" />}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function BookServiceModal({ open, onClose, onConfirm }) {
  const [vehicle, setVehicle] = cUseState(DB.vehicles[0].id);
  const [selected, setSelected] = cUseState(['SVC-OIL-01']);
  const [date, setDate] = cUseState('2026-05-30');
  const [time, setTime] = cUseState('10:30');

  const total = selected.reduce((s, c) => s + (serviceByCode(c)?.price || 0), 0);
  const duration = selected.reduce((s, c) => s + (serviceByCode(c)?.duration || 0), 0);

  const toggle = (code) => {
    setSelected(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      kicker="New booking"
      title="Schedule a service"
      width={620}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="check" onClick={() => onConfirm({ vehicle, selected, date, time, total })}>Confirm booking</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="text-[12px] text-silver mb-2 block">Vehicle</label>
          <div className="grid grid-cols-3 gap-0 border border-line2 rounded-md overflow-hidden">
            {DB.vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`px-3 py-2.5 text-left border-r border-line last:border-r-0 transition-colors ${vehicle === v.id ? 'bg-ink text-obsidian' : 'bg-transparent text-silver hover:bg-white/[0.04] hover:text-ink'}`}
              >
                <div className="text-[12px] font-medium">{v.year} {v.make}</div>
                <div className="font-mono text-[11px] opacity-70">{v.plate}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] text-silver mb-2 block">Services <span className="text-mute">· select one or more</span></label>
          <ul className="border border-line2 rounded-md divide-y divide-line overflow-hidden">
            {DB.services.slice(0,5).map(s => {
              const on = selected.includes(s.code);
              return (
                <li
                  key={s.code}
                  onClick={() => toggle(s.code)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${on ? 'bg-teal/[0.06]' : 'hover:bg-white/[0.03]'}`}
                >
                  <div className={`w-4 h-4 border rounded-xs flex items-center justify-center ${on ? 'bg-teal border-teal' : 'border-line2'}`}>
                    {on && <Icon name="check" size={10} className="text-obsidian" />}
                  </div>
                  <div className="flex-1 text-[13px] text-ink">{s.name}</div>
                  <div className="text-[11px] text-silver tnum font-mono">{s.duration}m</div>
                  <div className="font-mono text-[13px] text-ink tnum w-20 text-right">{fmtMoney(s.price)}</div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] text-silver mb-2 block">Date</label>
            <Input icon="calendar" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-[12px] text-silver mb-2 block">Time</label>
            <Input icon="clock" type="time" value={time} onChange={e=>setTime(e.target.value)} />
          </div>
        </div>

        <div className="border border-line2 rounded-md p-4 bg-panel2">
          <div className="flex justify-between text-[13px] mb-2"><span className="text-silver">Estimated duration</span><span className="font-mono text-ink tnum">{Math.floor(duration/60)}h {duration%60}m</span></div>
          <div className="flex justify-between text-[13px] mb-2"><span className="text-silver">Items</span><span className="font-mono text-ink tnum">{selected.length}</span></div>
          <div className="flex justify-between text-[14px] pt-2 border-t border-line"><span className="text-ink font-medium">Estimated total</span><span className="font-mono text-teal tnum">{fmtMoney(total)}</span></div>
        </div>
      </div>
    </Modal>
  );
}

function CustomerDashboard({ pushToast }) {
  const [loading, setLoading] = cUseState(true);
  const [bookOpen, setBookOpen] = cUseState(false);
  cUseEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonBlock h={340} />
        <div className="grid grid-cols-3 gap-4">
          <SkeletonBlock h={220} />
          <SkeletonBlock h={220} />
          <SkeletonBlock h={220} />
        </div>
        <SkeletonBlock h={260} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ActiveJobHero onPay={() => pushToast({ title: 'Payment processed', body: 'INV-09014 · $540.00 settled.', icon: 'check' })} />

      {/* KPI strip */}
      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-4">
        <KPI label="Active jobs"      value="1"    sub="In progress now" accent="#3b82f6" />
        <KPI label="Vehicles"         value="3"    sub="2 ICE · 1 EV"   />
        <KPI label="Lifetime spend"   value={fmtMoney(4218.00)} sub="Since 2023" mono />
        <KPI label="Loyalty tier"     value="Platinum" sub="92,000 pts · +12% rewards" accent="#10B981" />
      </section>

      <MyVehicles onBook={() => setBookOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><ServiceHistory /></div>
        <div className="lg:col-span-2"><InvoicesPanel onPay={() => pushToast({ title: 'Payment processed', body: 'INV-09014 · $540.00 settled.' })} /></div>
      </div>

      <BookServiceModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onConfirm={(payload) => { setBookOpen(false); pushToast({ title: 'Booking submitted', body: `Pending manager approval · ${payload.selected.length} services` }); }}
      />
    </div>
  );
}

Object.assign(window, { CustomerDashboard });
