// Customer pages — Vehicles, Bookings, JobTracker, Invoices, ServiceCenters
const { useState: cpUseState, useEffect: cpUseEffect, useMemo: cpUseMemo } = React;

// ============ Customer · Vehicles ============
function CustomerVehiclesPage() {
  const [selected, setSelected] = cpUseState(DB.vehicles[0].id);
  const v = vehicleById(selected) || DB.vehicles[0];
  const isEv = v.battery != null;

  return (
    <div>
      <PageHeader
        kicker="My garage"
        title="Vehicles"
        subtitle="Registered vehicles, service plans and warranty status."
        actions={<>
          <Button size="sm" variant="ghost" icon="download">Export CSV</Button>
          <Button size="sm" variant="primary" icon="plus">Add vehicle</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-ink">{DB.vehicles.length}</span> registered</span>
          <span><span className="font-mono tnum text-ink">2</span> ICE · <span className="font-mono tnum text-ink">1</span> EV</span>
          <span>Total <span className="font-mono tnum text-ink">{fmtCount(DB.vehicles.reduce((s,x)=>s+x.miles,0))}</span> miles</span>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <Panel title="Garage" subtitle={`${DB.vehicles.length} vehicles`} innerClassName="p-0">
            <ul>
              {DB.vehicles.map(vh => {
                const on = vh.id === selected;
                return (
                  <li key={vh.id} onClick={() => setSelected(vh.id)} className={`px-4 py-3.5 border-b border-line last:border-b-0 cursor-pointer transition-colors ${on ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border rounded-md flex items-center justify-center shrink-0 ${on ? 'border-teal/50 bg-teal/10 text-teal' : 'border-line2 text-mute'}`}>
                        <Icon name={vh.battery != null ? 'zap' : 'car'} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-ink truncate">{vh.year} {vh.make} {vh.model.split(' ')[0]}</div>
                        <div className="font-mono text-[11px] text-mute tnum truncate">{vh.plate} · {fmtCount(vh.miles)} mi</div>
                      </div>
                      {on && <Icon name="chevron-right" size={14} className="text-teal" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel innerClassName="p-0">
            <div className="grid grid-cols-12 gap-0">
              <div className="col-span-12 md:col-span-7 p-6 border-r border-line">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <div className="text-[12px] text-silver mb-1">{v.year} · {v.color}</div>
                    <h2 className="text-[24px] font-medium tracking-tight text-ink leading-tight">{v.make} {v.model}</h2>
                  </div>
                  <span className="font-mono text-[12px] px-2 py-1 border border-line2 rounded-xs text-ink">{v.plate}</span>
                </div>
                <div className="font-mono text-[11px] text-mute mt-1">VIN <span className="text-silver ml-1">{v.vin}</span></div>

                <div className="h-44 border border-line rounded-md mt-5 flex items-center justify-center stripe relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-mute">
                    <Icon name={isEv ? 'zap' : 'car'} size={48} strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] text-mute tracking-wider uppercase">
                    Render · {v.color.toLowerCase()}
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 p-6 space-y-5">
                <div>
                  <div className="text-[11px] text-mute mb-1.5">Odometer</div>
                  <div className="font-mono text-[24px] text-ink tnum">{fmtCount(v.miles)} <span className="text-[14px] text-silver">mi</span></div>
                  <div className="text-[11px] text-silver mt-0.5 tnum">+ <span className="font-mono">412</span> mi this month</div>
                </div>
                <div>
                  <div className="text-[11px] text-mute mb-1.5">Next recommended service</div>
                  <div className="font-mono text-[15px] text-ink tnum">{v.nextService}</div>
                  <div className="text-[11px] text-silver mt-0.5">Tire rotation · Cabin filter</div>
                </div>
                {isEv && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[11px] text-mute">Battery state of health</div>
                      <div className="font-mono text-[12px] text-ink tnum">{v.battery}%</div>
                    </div>
                    <CapacityBar value={v.battery} />
                    <div className="text-[11px] text-silver mt-1.5">96 cells nominal · last scan 2026-04-18</div>
                  </div>
                )}
                <div className="pt-3 border-t border-line flex gap-2">
                  <Button size="sm" variant="primary" icon="calendar-plus" className="flex-1">Book service</Button>
                  <Button size="sm" variant="default" icon="edit-3" aria-label="Edit" />
                </div>
              </div>
            </div>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title="Specifications" innerClassName="p-0">
              <dl className="text-[12px]">
                {[
                  ['Body style',   isEv ? 'Sedan · EV' : 'Sedan · ICE'],
                  ['Drivetrain',   isEv ? 'RWD · single motor' : 'FWD · 1.5T petrol'],
                  ['Transmission', isEv ? 'Direct drive' : '6-speed manual'],
                  ['Delivery',     '2023-02-14'],
                  ['Insurance',    'State Farm · POL-44193-A'],
                  ['Reg. expires', '2026-12-31'],
                ].map(([k,v2],i) => (
                  <div key={i} className="flex justify-between gap-4 px-4 py-2.5 border-b border-line last:border-b-0">
                    <dt className="text-silver">{k}</dt>
                    <dd className="text-ink font-mono tnum text-right">{v2}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title="Service plan" subtitle="Platinum · auto-renew" action={<StatusBadge status="paid" label="ACTIVE" />} innerClassName="p-0">
              <div className="px-4 py-4 space-y-3">
                {[
                  { l: 'Oil & filter',        n: 'Every 7,500 mi',    s: 'Due 2026-08-12', ok: false },
                  { l: 'Tire rotation',       n: 'Every 5,000 mi',    s: '12d ago · done', ok: true },
                  { l: 'Brake inspection',    n: 'Every 12,000 mi',   s: 'In 4,200 mi',    ok: true },
                  { l: 'Battery scan (EV)',   n: 'Every 6 months',    s: 'In 2 months',    ok: true },
                ].map((x,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${x.ok ? 'bg-teal' : 'bg-warn'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-ink truncate">{x.l}</div>
                      <div className="text-[11px] text-mute">{x.n}</div>
                    </div>
                    <div className={`font-mono text-[11px] tnum ${x.ok ? 'text-silver' : 'text-warn'}`}>{x.s}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Customer · Bookings ============
function CustomerBookingsPage() {
  const [filter, setFilter] = cpUseState('all');
  const rows = cpUseMemo(() => filter === 'all' ? DB.bookings : DB.bookings.filter(b => b.status === filter), [filter]);

  return (
    <div>
      <PageHeader
        kicker="Service appointments"
        title="Bookings"
        subtitle="Upcoming, in-progress and historical service appointments."
        actions={<>
          <Segmented
            options={[
              {label:'All', value:'all'},
              {label:'Pending', value:'pending'},
              {label:'Completed', value:'completed'},
              {label:'Cancelled', value:'cancelled'},
            ]}
            value={filter}
            onChange={setFilter}
          />
          <Button size="sm" variant="primary" icon="calendar-plus">New booking</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-ink">{DB.bookings.filter(b=>b.status==='pending').length}</span> upcoming</span>
          <span><span className="font-mono tnum text-ink">{DB.bookings.filter(b=>b.status==='completed').length}</span> completed</span>
          <span><span className="font-mono tnum text-ink">{DB.history.length + DB.bookings.length}</span> lifetime</span>
        </>}
      />

      <Panel innerClassName="p-0">
        <DataTable
          emptyTitle="No bookings"
          emptyBody="Schedule your first service to see it here."
          emptyIcon="calendar"
          columns={[
            { header: 'Booking',  cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.id },
            { header: 'Date · time', cellClass: 'font-mono text-ink tnum whitespace-nowrap', render: r => `${r.date} · ${r.time}` },
            { header: 'Vehicle',  cellClass: 'whitespace-nowrap', render: r => {
              const veh = vehicleById(r.vehicleId);
              return <span className="text-ink">{veh.year} {veh.make} <span className="text-silver">· {veh.plate}</span></span>;
            } },
            { header: 'Center',   cellClass: 'text-silver', render: r => DB.centerDirectory.find(c => c.id === r.centerId)?.name || r.centerId },
            { header: 'Services', maxWidth: 280, cellClass: 'text-silver', render: r => (
              <span className="block leading-snug" style={{ wordBreak:'break-word' }}>
                {r.services.map(c => serviceByCode(c)?.name || c).join(', ')}
              </span>
            ) },
            { header: 'Status', render: r => <StatusBadge status={r.status} /> },
            { header: '', cellClass: 'text-right whitespace-nowrap', render: r => (
              <div className="flex justify-end gap-2">
                {r.status === 'pending' ? (
                  <>
                    <Button size="sm" variant="ghost" icon="x">Cancel</Button>
                    <Button size="sm" variant="default" icon="edit-3">Modify</Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" icon="external-link">Details</Button>
                )}
              </div>
            ) },
          ]}
          rows={rows}
        />
      </Panel>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Upcoming this week" subtitle="May 27 – Jun 02 · 1 scheduled" innerClassName="p-5">
          <div className="grid grid-cols-7 gap-2">
            {['Mon 27','Tue 28','Wed 29','Thu 30','Fri 31','Sat 01','Sun 02'].map((d,i) => {
              const hit = i === 1;
              return (
                <div key={i} className={`p-2 border rounded-md ${hit ? 'border-teal/50 bg-teal/[0.06]' : 'border-line'}`}>
                  <div className="font-mono text-[10px] text-mute tracking-wider uppercase">{d}</div>
                  {hit ? (
                    <div className="mt-2">
                      <div className="font-mono text-[11px] text-teal">10:00</div>
                      <div className="text-[11px] text-ink mt-0.5 leading-tight">Oil & tire rotation</div>
                    </div>
                  ) : (
                    <div className="mt-6 text-center text-[11px] text-mute">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Spend by service" subtitle="Trailing 12 months" innerClassName="p-5">
          <div className="space-y-3">
            {[
              { l: 'Oil & filter',     v: 416, pct: 18 },
              { l: 'Tire / alignment', v: 631, pct: 28 },
              { l: 'Brakes',           v: 612, pct: 27 },
              { l: 'Diagnostics',      v: 363, pct: 16 },
              { l: 'EV battery',       v: 220, pct: 11 },
            ].map((s,i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[12px] text-silver">{s.l}</div>
                  <div className="font-mono text-[12px] text-ink tnum">{fmtMoney(s.v)}</div>
                </div>
                <CapacityBar value={s.pct} color="#10B981" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ============ Customer · JobTracker ============
function CustomerJobTrackerPage({ pushToast }) {
  const job = DB.activeJob;
  const veh = vehicleById(job.vehicleId);
  const [progress, setProgress] = cpUseState(58);
  cpUseEffect(() => {
    const i = setInterval(() => setProgress(p => Math.min(74, p + 0.06)), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div>
      <PageHeader
        kicker={<span><span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-teal mr-2 align-middle" />Job in progress</span>}
        title={`Live tracker · ${job.id}`}
        subtitle="Real-time telemetry from the service bay. Updates every few seconds."
        actions={<>
          <Button size="sm" variant="ghost" icon="message-square">Message bay</Button>
          <Button size="sm" variant="default" icon="bell">Pause alerts</Button>
        </>}
        meta={<>
          <span>Bay <span className="font-mono text-ink">{job.bayId}</span></span>
          <span>Mechanic <span className="text-ink">Diego Marquez</span></span>
          <span>Started <span className="font-mono text-ink tnum">09:14</span></span>
          <span>ETA <span className="font-mono text-ink tnum">12:30</span></span>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel innerClassName="p-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[12px] text-silver mb-1">Now servicing</div>
                <div className="text-[24px] font-medium tracking-tight text-ink">{veh.year} {veh.make} {veh.model}</div>
                <div className="font-mono text-[11px] text-mute mt-1">VIN <span className="text-silver ml-1">{veh.vin}</span></div>
              </div>
              <span className="font-mono text-[12px] px-2 py-1 border border-line2 rounded-xs text-ink">{veh.plate}</span>
            </div>

            <div className="grid grid-cols-12 gap-6 items-end mb-3">
              <div className="col-span-12 md:col-span-7">
                <div className="text-[12px] text-silver mb-1.5">Completion</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-[56px] leading-none font-medium text-teal tnum">{Math.floor(progress)}<span className="text-silver text-[24px]">%</span></div>
                  <div className="text-[12px] text-silver"><span className="font-mono tnum">3</span> of <span className="font-mono tnum">6</span> tasks</div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-0 border border-line rounded-md overflow-hidden">
                <div className="px-3 py-2.5 border-r border-line">
                  <div className="text-[11px] text-mute">Elapsed</div>
                  <div className="font-mono text-[14px] text-ink tnum">1h 47m</div>
                </div>
                <div className="px-3 py-2.5">
                  <div className="text-[11px] text-mute">Remaining</div>
                  <div className="font-mono text-[14px] text-warn tnum">1h 28m</div>
                </div>
              </div>
            </div>
            <div className="relative h-2 bg-white/[0.04] border border-line rounded-xs overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-teal transition-all duration-700" style={{ width: progress + '%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-mute mt-2 font-mono tracking-wider">
              <span>INTAKE</span><span>DIAGNOSTICS</span><span>SERVICE</span><span>QA</span><span>HANDOFF</span>
            </div>
          </Panel>

          <Panel title="Live activity feed" subtitle={`${job.tasks.length} steps`} innerClassName="p-0">
            <ol className="px-5 py-5">
              {job.tasks.map((t, i) => {
                const done = t.status === 'done';
                const inProg = t.status === 'in_progress';
                return (
                  <li key={t.id} className="relative pl-8 pb-5 last:pb-0">
                    {i < job.tasks.length - 1 && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-line" />}
                    <span className={`absolute left-0 top-1 w-[22px] h-[22px] border rounded-full flex items-center justify-center ${done ? 'border-teal bg-teal/10' : inProg ? 'border-info bg-info/10' : 'border-line2 bg-panel2'}`}>
                      {done && <Icon name="check" size={12} className="text-teal" />}
                      {inProg && <span className="w-2 h-2 rounded-full bg-info live-dot" />}
                    </span>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`text-[14px] leading-snug ${done ? 'text-silver' : inProg ? 'text-ink' : 'text-mute'}`}>{t.label}</div>
                        {t.at && <div className="font-mono text-[11px] text-mute mt-1 tnum">{t.at} · Diego M.</div>}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Bay 3 · live" subtitle="Mission center" innerClassName="p-0">
            <div className="h-44 stripe border-b border-line flex items-center justify-center relative">
              <Icon name="camera-off" size={28} className="text-mute" />
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-mute tracking-wider uppercase">CAM-03 · placeholder</div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono text-[10px] text-teal tracking-wider uppercase">
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-teal" /> LIVE
              </div>
            </div>
            <div className="px-5 py-4 text-[12px] space-y-2.5">
              <div className="flex justify-between"><span className="text-silver">Center</span><span className="text-ink">SF · Mission</span></div>
              <div className="flex justify-between"><span className="text-silver">Address</span><span className="text-ink">123 Valencia St</span></div>
              <div className="flex justify-between"><span className="text-silver">Phone</span><span className="font-mono text-ink tnum">+1 415 555 0100</span></div>
            </div>
          </Panel>

          <Panel title="Estimate" subtitle="Final invoice on completion" innerClassName="p-0">
            <ul className="text-[12px]">
              {job.services.map(c => {
                const s = serviceByCode(c);
                return (
                  <li key={c} className="flex justify-between px-4 py-2.5 border-b border-line">
                    <span className="text-silver pr-2">{s.name}</span>
                    <span className="font-mono text-ink tnum whitespace-nowrap">{fmtMoney(s.price)}</span>
                  </li>
                );
              })}
              <li className="flex justify-between px-4 py-2.5 border-b border-line">
                <span className="text-silver">Shop supplies</span>
                <span className="font-mono text-ink tnum">{fmtMoney(14.00)}</span>
              </li>
              <li className="flex justify-between px-4 py-3 bg-white/[0.02]">
                <span className="text-ink font-medium">Total</span>
                <span className="font-mono text-teal tnum text-[14px]">{fmtMoney(540.00)}</span>
              </li>
            </ul>
            <div className="px-4 py-3 border-t border-line">
              <Button size="sm" variant="primary" icon="credit-card" className="w-full" onClick={() => pushToast && pushToast({ title: 'Payment processed', body: 'INV-09014 · $540.00' })}>Pay on completion</Button>
            </div>
          </Panel>

          <Panel title="Messages" subtitle="Last 3" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                { who: 'Diego M.', t: '10:32', m: 'Started tire rotation — rears looking great, fronts at 40% tread.' },
                { who: 'Diego M.', t: '09:51', m: 'Battery scan complete. Cell 47 reading slightly low, will flag in report.' },
                { who: 'AutoServe',t: '09:14', m: 'Vehicle checked into Bay 3. Estimated 3h 16m.' },
              ].map((x,i) => (
                <li key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-ink">{x.who}</span>
                    <span className="font-mono text-[11px] text-mute tnum">{x.t}</span>
                  </div>
                  <div className="text-silver leading-snug">{x.m}</div>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ============ Customer · Invoices ============
function CustomerInvoicesPage({ pushToast }) {
  const all = [...DB.invoices].sort((a,b) => b.date.localeCompare(a.date));
  const pending = all.filter(i => i.status === 'pending');
  const total = all.reduce((s,i) => s + i.amount, 0);

  return (
    <div>
      <PageHeader
        kicker="Billing"
        title="Invoices"
        subtitle="All invoices for completed and active services."
        actions={<>
          <Button size="sm" variant="ghost" icon="file-text">Statement (PDF)</Button>
          <Button size="sm" variant="default" icon="credit-card">Payment methods</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-ink">{all.length}</span> invoices</span>
          <span><span className="font-mono tnum text-warn">{pending.length}</span> pending</span>
          <span>Lifetime <span className="font-mono tnum text-ink">{fmtMoney(total)}</span></span>
        </>}
      />

      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-4 mb-4">
        <KPI label="Pending"     value={fmtMoney(pending.reduce((s,i)=>s+i.amount,0))} sub={`${pending.length} invoice${pending.length===1?'':'s'}`} accent="#eab308" mono />
        <KPI label="Paid YTD"    value={fmtMoney(all.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0))} sub="2026" mono />
        <KPI label="Avg ticket"  value={fmtMoney(total/all.length)} sub="Last 12 months" mono />
        <KPI label="Card"        value="•••• 4429" sub="Visa · default" accent="#10B981" />
      </section>

      <Panel title="All invoices" subtitle={`${all.length} records`} innerClassName="p-0">
        <DataTable
          columns={[
            { header: 'Invoice', cellClass: 'font-mono text-ink whitespace-nowrap', render: r => r.id },
            { header: 'Date',    cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.date },
            { header: 'Job',     cellClass: 'font-mono text-silver whitespace-nowrap', render: r => r.job },
            { header: 'Description', cellClass: 'text-silver', render: r => DB.history.find(h => h.id === r.job)?.services?.split(',')[0] || 'Active job' },
            { header: 'Amount',  cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.amount)}</div> },
            { header: 'Status',  render: r => <StatusBadge status={r.status} /> },
            { header: '', cellClass: 'text-right whitespace-nowrap', render: r => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" icon="download" aria-label="Download" />
                {r.status === 'pending'
                  ? <Button size="sm" variant="primary" onClick={() => pushToast && pushToast({ title: 'Payment processed', body: `${r.id} · ${fmtMoney(r.amount)}` })}>Pay {fmtMoney(r.amount)}</Button>
                  : <Button size="sm" variant="ghost" icon="external-link">Open</Button>
                }
              </div>
            ) },
          ]}
          rows={all}
        />
      </Panel>
    </div>
  );
}

// ============ Customer · ServiceCenters ============
function CustomerServiceCentersPage() {
  const [selected, setSelected] = cpUseState(DB.centerDirectory[0].id);
  const c = DB.centerDirectory.find(x => x.id === selected);

  return (
    <div>
      <PageHeader
        kicker="Find a center"
        title="Service centers"
        subtitle="Browse nearby AutoServe-certified centers, check availability, book directly."
        actions={<>
          <Input icon="search" placeholder="ZIP, address, city…" className="w-64" />
          <Button size="sm" variant="default" icon="filter">Filters</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-ink">{DB.centerDirectory.length}</span> within 50 mi</span>
          <span>Sorted by <span className="text-ink">distance</span></span>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <Panel title="Nearby" subtitle={`${DB.centerDirectory.length} results`} innerClassName="p-0">
            <ul>
              {DB.centerDirectory.map((ce, i) => {
                const on = ce.id === selected;
                return (
                  <li key={ce.id} onClick={() => setSelected(ce.id)} className={`px-5 py-4 border-b border-line last:border-b-0 cursor-pointer transition-colors ${on ? 'bg-white/[0.04] border-l-2 border-l-teal' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}`}>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="min-w-0">
                        <div className="text-[14px] text-ink">{ce.name}</div>
                        <div className="text-[11px] text-silver truncate">{ce.address}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-[12px] text-ink tnum">{ce.distance} mi</div>
                        <div className="font-mono text-[10px] text-mute mt-0.5">{ce.slots} open</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Stars value={Math.round(ce.rating)} />
                      <span className="font-mono text-[11px] text-silver tnum">{ce.rating} <span className="text-mute">· {ce.reviews}</span></span>
                      <span className="flex-1" />
                      <div className="flex gap-1">
                        {ce.specialties.slice(0,2).map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 border border-line2 rounded-xs text-silver">{s}</span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Panel innerClassName="p-0">
            <div className="h-56 stripe border-b border-line flex items-center justify-center relative">
              <Icon name="map" size={32} className="text-mute" />
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-mute tracking-wider uppercase">Map placeholder · {c.name}</div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button size="sm" variant="default" icon="navigation">Directions</Button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-[22px] font-medium tracking-tight text-ink">{c.name}</h2>
                <div className="flex items-center gap-2">
                  <Stars value={Math.round(c.rating)} />
                  <span className="font-mono text-[13px] text-ink tnum">{c.rating}</span>
                  <span className="text-[11px] text-mute">· {c.reviews} reviews</span>
                </div>
              </div>
              <div className="text-[12px] text-silver">{c.address}</div>

              <div className="grid grid-cols-3 gap-0 mt-5 border border-line rounded-md overflow-hidden">
                <div className="px-4 py-3 border-r border-line">
                  <div className="text-[11px] text-mute mb-1">Hours</div>
                  <div className="text-[12px] text-ink">{c.hours}</div>
                </div>
                <div className="px-4 py-3 border-r border-line">
                  <div className="text-[11px] text-mute mb-1">Distance</div>
                  <div className="font-mono text-[14px] text-ink tnum">{c.distance} mi</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-[11px] text-mute mb-1">Open slots today</div>
                  <div className="font-mono text-[14px] text-teal tnum">{c.slots}</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Specialties</div>
                <div className="flex flex-wrap gap-2">
                  {c.specialties.map(s => (
                    <span key={s} className="text-[12px] px-2.5 py-1 border border-line2 rounded-xs text-silver">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="primary" icon="calendar-plus" className="flex-1">Book at this center</Button>
                <Button variant="default" icon="phone">Call</Button>
                <Button variant="default" icon="message-square">Message</Button>
              </div>
            </div>
          </Panel>

          <Panel title="Available slots · next 7 days" subtitle="Tap a slot to start booking" innerClassName="p-5">
            <div className="grid grid-cols-7 gap-2">
              {['Wed 28','Thu 29','Fri 30','Sat 31','Sun 01','Mon 02','Tue 03'].map((d,i) => {
                const slots = [3,5,2,7,0,4,6][i];
                return (
                  <div key={i} className="border border-line rounded-md p-3">
                    <div className="font-mono text-[10px] text-mute tracking-wider uppercase">{d}</div>
                    <div className="font-mono text-[18px] text-ink tnum mt-1">{slots}</div>
                    <div className="text-[10px] text-mute">{slots === 0 ? 'closed' : 'slots'}</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  CustomerVehiclesPage, CustomerBookingsPage, CustomerJobTrackerPage,
  CustomerInvoicesPage, CustomerServiceCentersPage,
});
