// Manager pages — Bookings, BookingDetail, JobCards, JobCardDetail,
// Mechanics, Inventory, Invoices, Reviews, Profile, CreateServiceCenter, ManageServiceCenter
const { useState: mpUseState, useEffect: mpUseEffect, useMemo: mpUseMemo } = React;

// ============ Manager · Bookings ============
function ManagerBookingsPage({ goDetail }) {
  const [filter, setFilter] = mpUseState('all');
  const rows = mpUseMemo(() => filter === 'all' ? DB.managerBookings : DB.managerBookings.filter(b => b.status === filter), [filter]);

  return (
    <div>
      <PageHeader
        kicker="Operations"
        title="Bookings"
        subtitle="All bookings flowing through the Mission center — pending, in progress, completed."
        actions={<>
          <Segmented
            options={[
              { label:'All',         value:'all' },
              { label:'Pending',     value:'pending' },
              { label:'In progress', value:'in_progress' },
              { label:'Completed',   value:'completed' },
              { label:'Cancelled',   value:'cancelled' },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <Button size="sm" variant="default" icon="download">Export</Button>
          <Button size="sm" variant="primary" icon="plus">Walk-in</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-warn">{DB.managerBookings.filter(b=>b.status==='pending').length}</span> pending</span>
          <span><span className="font-mono tnum text-info">{DB.managerBookings.filter(b=>b.status==='in_progress').length}</span> in progress</span>
          <span><span className="font-mono tnum text-teal">{DB.managerBookings.filter(b=>b.status==='completed').length}</span> completed today</span>
          <span>Conversion <span className="font-mono tnum text-ink">86%</span></span>
        </>}
      />

      <Panel innerClassName="p-0">
        <DataTable
          onRowClick={(r) => goDetail && goDetail(r.id)}
          columns={[
            { header: 'Booking',  cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.id },
            { header: 'Customer', cellClass: 'text-ink whitespace-nowrap', render: r => r.customer },
            { header: 'Vehicle',  cellClass: 'text-silver whitespace-nowrap', render: r => <span className="font-mono text-[12px]">{r.vehicle}</span> },
            { header: 'Services', maxWidth: 280, cellClass: 'text-silver', render: r => <span className="block leading-snug" style={{ wordBreak:'break-word' }}>{r.services}</span> },
            { header: 'Date',     cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.date },
            { header: 'Mechanic', cellClass: 'text-silver whitespace-nowrap', render: r => r.mechanic },
            { header: 'Priority', render: r => <PriorityChip p={r.priority} /> },
            { header: 'Status',   render: r => <StatusBadge status={r.status} /> },
            { header: '',         cellClass: 'whitespace-nowrap text-right', render: () => <Icon name="chevron-right" size={14} className="text-mute" /> },
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

// ============ Manager · BookingDetail ============
function ManagerBookingDetailPage({ goBack, pushToast }) {
  const r = DB.managerBookings.find(b => b.id === 'BK-2026-1141') || DB.managerBookings[0];
  const cust = DB.systemUsers.find(u => u.name === r.customer) || { email: 'jonas.e@kth.se', id: 'US-10010' };

  return (
    <div>
      <button onClick={goBack} className="flex items-center gap-1.5 text-[12px] text-silver hover:text-ink mb-4 transition-colors">
        <Icon name="arrow-left" size={13} /> Back to bookings
      </button>

      <PageHeader
        kicker={<>Booking · <span className="font-mono text-silver">{r.id}</span></>}
        title={r.customer}
        subtitle={<>{r.vehicle} · requested {r.date}</>}
        actions={<>
          <Button size="sm" variant="ghost" icon="message-square">Message</Button>
          <Button size="sm" variant="default" icon="x" onClick={() => pushToast && pushToast({ title: 'Booking rejected', body: r.id, icon: 'x' })}>Reject</Button>
          <Button size="sm" variant="primary" icon="check" onClick={() => pushToast && pushToast({ title: 'Booking approved', body: `${r.id} · assigned to Rafael Costa` })}>Approve & assign</Button>
        </>}
        meta={<>
          <PriorityChip p={r.priority} />
          <StatusBadge status={r.status} />
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Customer-requested services" innerClassName="p-0">
            <ul className="divide-y divide-line">
              {['SVC-BAT-04','SVC-DGN-01'].map(c => {
                const s = serviceByCode(c);
                return (
                  <li key={c} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-silver shrink-0">
                      <Icon name="wrench" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-ink">{s.name}</div>
                      <div className="font-mono text-[11px] text-mute">{s.code} · est. {s.duration}m</div>
                    </div>
                    <div className="font-mono text-[14px] text-ink tnum">{fmtMoney(s.price)}</div>
                  </li>
                );
              })}
              <li className="px-5 py-3 flex justify-between bg-white/[0.02]">
                <span className="text-[13px] text-ink font-medium">Estimated total</span>
                <span className="font-mono text-[16px] text-teal tnum">{fmtMoney(365.00)}</span>
              </li>
            </ul>
          </Panel>

          <Panel title="Customer notes" innerClassName="p-5">
            <div className="text-[13px] text-silver leading-relaxed">
              "Picked up some odd warnings on the dash last week — battery temperature warning on a cold start, cleared after driving. Would like the full HV battery health printout with the cell readings. The Lightning has 18,400 miles, all highway. No collision history."
            </div>
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
              <span className="font-mono text-[11px] text-mute tnum">Submitted 2026-05-28 09:43 PDT</span>
              <Button size="sm" variant="ghost" icon="paperclip">2 attachments</Button>
            </div>
          </Panel>

          <Panel title="Assign mechanic" subtitle="Sorted by load" innerClassName="p-0">
            <ul className="divide-y divide-line">
              {DB.mechanics.filter(m => m.status !== 'off-shift').sort((a,b) => a.utilization - b.utilization).slice(0,4).map((m, i) => (
                <li key={m.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink shrink-0">{m.name.split(' ').map(n=>n[0]).join('')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink truncate">{m.name}</div>
                    <div className="text-[11px] text-silver truncate">{m.cert}</div>
                  </div>
                  <div className="w-28 hidden md:block">
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-mute">Load</span><span className="text-ink tnum font-mono">{m.utilization}%</span></div>
                    <CapacityBar value={m.utilization} />
                  </div>
                  <div className="font-mono text-[11px] text-silver tnum w-12 text-right">{m.activeJobs}/{m.capacity}</div>
                  <Button size="sm" variant={i === 0 ? 'primary' : 'default'} disabled={m.status === 'at-capacity'}>{m.status === 'at-capacity' ? 'Full' : i === 0 ? 'Best fit' : 'Assign'}</Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Customer" innerClassName="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 border border-line2 rounded-md flex items-center justify-center text-[13px] text-ink">{r.customer.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <div className="text-[14px] text-ink">{r.customer}</div>
                <div className="font-mono text-[11px] text-mute tnum">{cust.id}</div>
              </div>
            </div>
            <dl className="text-[12px] space-y-2">
              <div className="flex justify-between"><dt className="text-silver">Email</dt><dd className="font-mono text-ink truncate">{cust.email}</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Phone</dt><dd className="font-mono text-ink tnum">+1 415 555 0188</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Lifetime visits</dt><dd className="font-mono text-ink tnum">11</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Lifetime spend</dt><dd className="font-mono text-ink tnum">{fmtMoney(4218.00)}</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Last visit</dt><dd className="font-mono text-ink tnum">2026-04-18</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Loyalty</dt><dd className="text-teal">Platinum</dd></div>
            </dl>
          </Panel>

          <Panel title="Vehicle" innerClassName="p-5">
            <div className="font-mono text-[11px] text-mute mb-1">VEHICLE</div>
            <div className="text-[14px] text-ink">{r.vehicle.split('·')[0]}</div>
            <div className="font-mono text-[11px] text-silver mt-0.5">{r.vehicle.split('·')[1]?.trim()}</div>
            <div className="h-24 border border-line rounded-md mt-3 stripe flex items-center justify-center">
              <Icon name="zap" size={28} className="text-mute" />
            </div>
            <dl className="text-[12px] space-y-2 mt-4">
              <div className="flex justify-between"><dt className="text-silver">VIN</dt><dd className="font-mono text-ink">1FT6W1EV1RWE12480</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Odometer</dt><dd className="font-mono text-ink tnum">18,400 mi</dd></div>
              <div className="flex justify-between"><dt className="text-silver">Warranty</dt><dd className="text-teal">Active</dd></div>
            </dl>
          </Panel>

          <Panel title="Audit trail" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                { t: '09:43:12', m: 'Booking submitted by customer' },
                { t: '09:43:21', m: 'Validated · slot available at SF-MISSION-01' },
                { t: '09:43:22', m: 'Priority elevated to HIGH (EV battery scan)' },
                { t: '09:51:08', m: 'Manager viewed booking' },
              ].map((x,i) => (
                <li key={i} className="px-4 py-2.5 flex gap-3">
                  <span className="font-mono text-[11px] text-mute tnum w-16 shrink-0">{x.t}</span>
                  <span className="text-silver">{x.m}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ============ Manager · JobCards ============
function ManagerJobCardsPage({ goDetail }) {
  const [filter, setFilter] = mpUseState('all');

  // synthesize a richer list
  const cards = mpUseMemo(() => ([
    { id: 'JC-2026-08469', vehicle: '2018 Audi A4',         customer: 'Henrik Lund',       mechanic: 'Kenji Watanabe', bay: '01', status: 'in_progress', progress: 84, eta: '11:45', priority: 'normal' },
    { id: 'JC-2026-08470', vehicle: '2022 Honda Odyssey',   customer: 'Sara Kowalski',     mechanic: 'Hailey Okafor',  bay: '02', status: 'in_progress', progress: 41, eta: '13:20', priority: 'normal' },
    { id: 'JC-2026-08471', vehicle: '2023 Tesla Model 3',   customer: 'Marcus Holloway',   mechanic: 'Diego Marquez',  bay: '03', status: 'in_progress', progress: 58, eta: '12:30', priority: 'normal' },
    { id: 'JC-2026-08472', vehicle: '2019 Toyota RAV4',     customer: 'Wei-Lun Chang',     mechanic: 'Sandra Petrov',  bay: '05', status: 'in_progress', progress: 22, eta: '14:10', priority: 'high'   },
    { id: 'JC-2026-08475', vehicle: '2021 Toyota Tacoma',   customer: 'Marcus Holloway',   mechanic: 'Diego Marquez',  bay: '—',  status: 'pending',     progress: 0,  eta: '15:00', priority: 'normal' },
    { id: 'JC-2026-08478', vehicle: '2019 Honda Civic Si',  customer: 'Marcus Holloway',   mechanic: 'Diego Marquez',  bay: '—',  status: 'pending',     progress: 0,  eta: '16:45', priority: 'high'   },
    { id: 'JC-2026-08465', vehicle: '2020 Porsche Macan',   customer: 'Henrik Lund',       mechanic: 'Kenji Watanabe', bay: '—',  status: 'completed',   progress:100, eta: '—',     priority: 'high'   },
    { id: 'JC-2026-08462', vehicle: '2016 VW Golf GTI',     customer: 'Sara Kowalski',     mechanic: 'Diego Marquez',  bay: '—',  status: 'completed',   progress:100, eta: '—',     priority: 'normal' },
  ]), []);
  const rows = filter === 'all' ? cards : cards.filter(c => c.status === filter);

  return (
    <div>
      <PageHeader
        kicker="Workflow"
        title="Job cards"
        subtitle="Every active and completed job card under this center."
        actions={<>
          <Segmented
            options={[
              { label:'All',         value:'all' },
              { label:'In progress', value:'in_progress' },
              { label:'Pending',     value:'pending' },
              { label:'Completed',   value:'completed' },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <Button size="sm" variant="default" icon="filter">Filters</Button>
          <Button size="sm" variant="primary" icon="plus">New job card</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-info">{cards.filter(c=>c.status==='in_progress').length}</span> in progress</span>
          <span><span className="font-mono tnum text-warn">{cards.filter(c=>c.status==='pending').length}</span> queued</span>
          <span><span className="font-mono tnum text-teal">{cards.filter(c=>c.status==='completed').length}</span> finished today</span>
          <span>Avg cycle <span className="font-mono tnum text-ink">1h 47m</span></span>
        </>}
      />

      <Panel innerClassName="p-0">
        <DataTable
          onRowClick={(r) => goDetail && goDetail(r.id)}
          columns={[
            { header: 'Card',     cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.id },
            { header: 'Vehicle',  cellClass: 'text-ink whitespace-nowrap', render: r => r.vehicle },
            { header: 'Customer', cellClass: 'text-silver whitespace-nowrap', render: r => r.customer },
            { header: 'Mechanic', cellClass: 'text-silver whitespace-nowrap', render: r => r.mechanic },
            { header: 'Bay',      cellClass: 'font-mono text-ink tnum whitespace-nowrap', render: r => r.bay },
            { header: 'Progress', cellClass: 'whitespace-nowrap', render: r => (
              <div className="flex items-center gap-2 w-32">
                <span className="font-mono text-[12px] text-ink tnum w-8 text-right">{r.progress}%</span>
                <div className="flex-1"><CapacityBar value={r.progress} color={r.progress === 100 ? '#10B981' : '#3b82f6'} /></div>
              </div>
            )},
            { header: 'ETA',      cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.eta },
            { header: 'Priority', render: r => <PriorityChip p={r.priority} /> },
            { header: 'Status',   render: r => <StatusBadge status={r.status} /> },
            { header: '', cellClass: 'whitespace-nowrap text-right', render: () => <Icon name="chevron-right" size={14} className="text-mute" /> },
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

// ============ Manager · JobCardDetail ============
function ManagerJobCardDetailPage({ goBack, pushToast }) {
  const job = DB.activeJob;
  const veh = vehicleById(job.vehicleId);

  return (
    <div>
      <button onClick={goBack} className="flex items-center gap-1.5 text-[12px] text-silver hover:text-ink mb-4 transition-colors">
        <Icon name="arrow-left" size={13} /> Back to job cards
      </button>

      <PageHeader
        kicker={<>Job card · <span className="font-mono text-silver">{job.id}</span></>}
        title={`${veh.year} ${veh.make} ${veh.model}`}
        subtitle={<>Bay <span className="font-mono text-ink">{job.bayId.replace('BAY-','')}</span> · Mechanic Diego Marquez · Customer Marcus Holloway</>}
        actions={<>
          <Button size="sm" variant="ghost" icon="message-square">Notify customer</Button>
          <Button size="sm" variant="default" icon="user-plus">Reassign</Button>
          <Button size="sm" variant="warn" icon="pause">Pause</Button>
          <Button size="sm" variant="primary" icon="check-circle">Mark QA passed</Button>
        </>}
        meta={<>
          <StatusBadge status="in_progress" />
          <span>Started <span className="font-mono text-ink tnum">09:14</span></span>
          <span>ETA <span className="font-mono text-ink tnum">12:30</span></span>
          <span>VIN <span className="font-mono text-ink">{veh.vin}</span></span>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Task progression" subtitle={`${job.tasks.filter(t=>t.status==='done').length} of ${job.tasks.length} complete`} innerClassName="p-0">
            <ul className="divide-y divide-line">
              {job.tasks.map((t, i) => {
                const done = t.status === 'done';
                const inProg = t.status === 'in_progress';
                return (
                  <li key={t.id} className={`flex items-center gap-4 px-5 py-3.5 ${inProg ? 'bg-info/[0.04]' : ''}`}>
                    <div className="font-mono text-[11px] text-mute tnum w-6">{String(i+1).padStart(2,'0')}</div>
                    <div className={`w-5 h-5 border rounded-full flex items-center justify-center shrink-0 ${done ? 'border-teal bg-teal/10' : inProg ? 'border-info bg-info/10' : 'border-line2'}`}>
                      {done && <Icon name="check" size={12} className="text-teal" />}
                      {inProg && <span className="w-1.5 h-1.5 rounded-full bg-info" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] leading-snug ${done ? 'text-silver' : inProg ? 'text-ink' : 'text-mute'}`}>{t.label}</div>
                      <div className="text-[11px] text-mute mt-0.5">{t.at ? <>Logged at <span className="font-mono tnum">{t.at}</span></> : 'Awaiting prior step'}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </li>
                );
              })}
            </ul>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title="Parts consumed" innerClassName="p-0">
              <DataTable
                columns={[
                  { header: 'SKU',  cellClass: 'font-mono text-ink whitespace-nowrap', render: r => r.sku },
                  { header: 'Item', cellClass: 'text-silver', render: r => r.name, maxWidth: 200 },
                  { header: 'Qty',  cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">×{r.qty}</div> },
                  { header: 'Cost', cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.cost)}</div> },
                ]}
                rows={[
                  { sku: 'FLT-AIR-K&N-1',  name: 'K&N High-Flow Air Filter',  qty: 1, cost: 42.00 },
                  { sku: 'WIP-BLD-BSH-22', name: 'Bosch ICON Wiper Blade 22"', qty: 2, cost: 49.98 },
                  { sku: 'OIL-5W30-MOB1',  name: 'Mobil 1 5W-30 (1qt)',        qty: 5, cost: 49.00 },
                ]}
              />
            </Panel>

            <Panel title="Diagnostic readings" innerClassName="p-0">
              <ul className="text-[12px]">
                {[
                  ['HV battery SOH',   '94%',     '#10B981'],
                  ['Cell 47 voltage',  '3.81V',   '#eab308'],
                  ['Coolant pressure', '14.2 psi','#10B981'],
                  ['Brake pad rear',   '6.2mm',   '#10B981'],
                  ['Brake fluid H₂O',  '1.4%',    '#10B981'],
                  ['Tire FL · PSI',    '36.0',    '#10B981'],
                ].map(([k,v,c],i) => (
                  <li key={i} className="flex justify-between gap-4 px-4 py-2.5 border-b border-line last:border-b-0">
                    <span className="text-silver">{k}</span>
                    <span className="font-mono tnum" style={{ color: c }}>{v}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Mechanic notes" innerClassName="p-5">
            <div className="text-[13px] text-silver leading-relaxed">
              Battery cell 47 reading 3.81V (nominal 3.92V) — within tolerance but flagged for monitoring at next visit. No corrosion observed on HV connector. Tire rotation complete; rears at 60% tread, fronts at 40%, customer notified about projected replacement at ~32k miles. All torque specs to manufacturer values.
            </div>
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
              <span className="font-mono text-[11px] text-mute tnum">Last edit · 10:32 PDT · Diego Marquez</span>
              <Button size="sm" variant="ghost" icon="edit-3">Edit</Button>
            </div>
          </Panel>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <Panel innerClassName="p-5">
            <div className="text-[12px] text-silver mb-1.5">Job completion</div>
            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-[44px] leading-none font-medium text-teal tnum">58<span className="text-silver text-[20px]">%</span></div>
              <div className="text-[12px] text-silver">3 of 6 tasks</div>
            </div>
            <CapacityBar value={58} />
            <div className="grid grid-cols-2 gap-0 mt-5 border border-line rounded-md overflow-hidden">
              <div className="px-3 py-2.5 border-r border-line">
                <div className="text-[11px] text-mute">Elapsed</div>
                <div className="font-mono text-[14px] text-ink tnum">1h 47m</div>
              </div>
              <div className="px-3 py-2.5">
                <div className="text-[11px] text-mute">Remaining</div>
                <div className="font-mono text-[14px] text-warn tnum">1h 28m</div>
              </div>
            </div>
          </Panel>

          <Panel title="Billing" innerClassName="p-0">
            <ul className="text-[12px]">
              <li className="flex justify-between px-4 py-2.5 border-b border-line"><span className="text-silver">Labor (3.2h × $115)</span><span className="font-mono text-ink tnum">{fmtMoney(368.00)}</span></li>
              <li className="flex justify-between px-4 py-2.5 border-b border-line"><span className="text-silver">Parts</span><span className="font-mono text-ink tnum">{fmtMoney(140.98)}</span></li>
              <li className="flex justify-between px-4 py-2.5 border-b border-line"><span className="text-silver">Shop supplies</span><span className="font-mono text-ink tnum">{fmtMoney(14.00)}</span></li>
              <li className="flex justify-between px-4 py-2.5 border-b border-line"><span className="text-silver">Tax (8.625%)</span><span className="font-mono text-ink tnum">{fmtMoney(45.30)}</span></li>
              <li className="flex justify-between px-4 py-3 bg-white/[0.02]"><span className="text-ink font-medium">Customer total</span><span className="font-mono text-teal tnum text-[14px]">{fmtMoney(540.00)}</span></li>
            </ul>
            <div className="px-4 py-3 border-t border-line">
              <Button size="sm" variant="primary" icon="file-text" className="w-full" onClick={() => pushToast && pushToast({ title: 'Invoice generated', body: 'INV-09014 · $540.00' })}>Generate invoice</Button>
            </div>
          </Panel>

          <Panel title="Activity log" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                { t: '10:32', m: 'Tire rotation in progress · FL/FR done' },
                { t: '09:51', m: 'HV battery scan complete · 94% SOH' },
                { t: '09:28', m: 'ECU snapshot captured · 14.2MB' },
                { t: '09:14', m: 'Vehicle intake · checked into Bay 3' },
                { t: '09:02', m: 'Diego Marquez assigned' },
              ].map((x,i) => (
                <li key={i} className="px-4 py-2.5 flex gap-3">
                  <span className="font-mono text-[11px] text-mute tnum w-12 shrink-0">{x.t}</span>
                  <span className="text-silver leading-snug">{x.m}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ============ Manager · Mechanics ============
function ManagerMechanicsPage() {
  return (
    <div>
      <PageHeader
        kicker="Team"
        title="Mechanics"
        subtitle="Roster, certifications, current load and shift schedule."
        actions={<>
          <Button size="sm" variant="ghost" icon="calendar">Schedule</Button>
          <Button size="sm" variant="default" icon="download">Export</Button>
          <Button size="sm" variant="primary" icon="user-plus">Add mechanic</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-ink">{DB.mechanics.filter(m=>m.status==='on-shift').length}</span> on shift</span>
          <span><span className="font-mono tnum text-warn">{DB.mechanics.filter(m=>m.status==='at-capacity').length}</span> at capacity</span>
          <span><span className="font-mono tnum text-mute">{DB.mechanics.filter(m=>m.status==='off-shift').length}</span> off shift</span>
          <span>Avg utilization <span className="font-mono tnum text-ink">{Math.round(DB.mechanics.reduce((s,m)=>s+m.utilization,0)/DB.mechanics.length)}%</span></span>
        </>}
      />

      <Panel innerClassName="p-0">
        <DataTable
          columns={[
            { header: 'Mechanic', cellClass: 'whitespace-nowrap', render: m => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink">{m.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div className="text-[13px] text-ink">{m.name}</div>
                  <div className="font-mono text-[11px] text-mute">{m.id}</div>
                </div>
              </div>
            )},
            { header: 'Cert',         cellClass: 'text-silver whitespace-nowrap', render: m => m.cert },
            { header: 'Active jobs',  cellClass: 'font-mono text-ink tnum whitespace-nowrap', render: m => `${m.activeJobs} / ${m.capacity}` },
            { header: 'Utilization', cellClass: 'whitespace-nowrap', render: m => (
              <div className="flex items-center gap-3 w-44">
                <span className={`font-mono text-[13px] tnum w-9 text-right ${m.utilization >= 90 ? 'text-warn' : 'text-ink'}`}>{m.utilization}%</span>
                <div className="flex-1"><CapacityBar value={m.utilization} /></div>
              </div>
            )},
            { header: 'Shift ends',  cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: m => m.shiftEnds },
            { header: 'Avg job', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: m => ['1h 42m','1h 31m','2h 04m','1h 28m','1h 56m','—'][DB.mechanics.indexOf(m) % 6] },
            { header: 'Status',  render: m => <StatusBadge status={m.status} /> },
            { header: '', cellClass: 'whitespace-nowrap text-right', render: () => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" icon="message-square">Message</Button>
                <Button size="sm" variant="ghost" icon="external-link">Profile</Button>
              </div>
            )},
          ]}
          rows={DB.mechanics}
        />
      </Panel>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Today's shift" subtitle="06:00 — 22:00" innerClassName="p-5">
          <div className="grid grid-cols-16 gap-0 border border-line rounded-md overflow-hidden mb-3" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
            {Array.from({length:16}).map((_,i)=> (
              <div key={i} className="border-r border-line last:border-r-0 px-1 py-1.5 font-mono text-[10px] text-mute tnum text-center">{String(6+i).padStart(2,'0')}</div>
            ))}
          </div>
          <ul className="space-y-2">
            {DB.mechanics.filter(m => m.status !== 'off-shift').map((m, i) => {
              const start = [3,3,5,2,4][i % 5];   // hours from 06:00
              const len = [9,11,13,12,16][i % 5]; // total length
              return (
                <li key={m.id} className="flex items-center gap-3 text-[12px]">
                  <span className="w-28 text-ink truncate">{m.name.split(' ')[0]} {m.name.split(' ')[1][0]}.</span>
                  <div className="relative flex-1 h-5 border border-line rounded-xs">
                    <div className="absolute top-0 bottom-0 bg-teal/30 border-l border-r border-teal/50" style={{ left: (start/16)*100 + '%', width: (len/16)*100 + '%' }} />
                  </div>
                  <span className="font-mono text-[11px] text-silver tnum w-12 text-right">{m.shiftEnds}</span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Performance · last 30 days" innerClassName="p-0">
          <DataTable
            columns={[
              { header: 'Mechanic', cellClass: 'text-ink whitespace-nowrap', render: m => m.name.split(' ')[0] + ' ' + m.name.split(' ')[1][0] + '.' },
              { header: 'Jobs',     cellClass: 'font-mono text-silver tnum text-right', render: (_,i) => <div className="text-right">{[41,38,29,52,34,8][i]}</div> },
              { header: 'QA pass',  cellClass: 'font-mono text-silver tnum text-right', render: (_,i) => <div className="text-right">{['99.4%','98.1%','100%','97.2%','99.0%','—'][i]}</div> },
              { header: 'Avg',      cellClass: 'font-mono text-silver tnum text-right', render: (_,i) => <div className="text-right">{['1h 42m','1h 31m','2h 04m','1h 28m','1h 56m','—'][i]}</div> },
              { header: 'Rating',   render: (_,i) => <Stars value={[5,4,5,4,5,3][i]} /> },
            ]}
            rows={DB.mechanics}
          />
        </Panel>
      </div>
    </div>
  );
}

// ============ Manager · Inventory ============
function ManagerInventoryPage({ pushToast }) {
  const low = DB.inventory.filter(i => i.stock < i.reorder);
  const out = DB.inventory.filter(i => i.stock === 0);

  return (
    <div>
      <PageHeader
        kicker="Parts ledger"
        title="Inventory"
        subtitle="Stock levels, reorder triggers, supplier ledger."
        actions={<>
          <Input icon="search" placeholder="SKU, name, supplier…" className="w-72" />
          <Button size="sm" variant="default" icon="download">Export</Button>
          <Button size="sm" variant="warn" icon="shopping-cart">Reorder all low</Button>
        </>}
      />

      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-5 mb-4">
        <KPI label="SKUs"               value={DB.inventory.length} sub="tracked" />
        <KPI label="Stock value"        value={fmtMoney(DB.inventory.reduce((s,i)=>s+i.stock*i.cost,0))} mono />
        <KPI label="Below reorder"      value={low.length}     sub={`${out.length} out of stock`}   accent="#eab308" />
        <KPI label="Open POs"           value="4"              sub={fmtMoney(2840.00) + ' on order'} />
        <KPI label="Turn rate"          value="14.2"           sub="cycles / yr" />
      </section>

      <Panel title="All parts" subtitle={`${DB.inventory.length} SKUs`} innerClassName="p-0">
        <DataTable
          columns={[
            { header: 'SKU',      cellClass: 'font-mono text-ink whitespace-nowrap', render: r => r.sku },
            { header: 'Item',     cellClass: 'text-silver', render: r => r.name, maxWidth: 280 },
            { header: 'Supplier', cellClass: 'text-mute whitespace-nowrap', render: r => r.supplier },
            { header: 'Cost',     cellClass: 'font-mono text-silver tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.cost)}</div> },
            { header: 'Stock',    cellClass: 'whitespace-nowrap', render: r => (
              <div className="flex items-center gap-3 w-40">
                <span className={`font-mono text-[13px] tnum w-8 text-right ${r.stock === 0 ? 'text-danger' : r.stock < r.reorder ? 'text-warn' : 'text-ink'}`}>{r.stock}</span>
                <div className="flex-1"><CapacityBar value={Math.min(100, (r.stock/r.reorder)*100)} color={r.stock === 0 ? '#ef4444' : r.stock < r.reorder ? '#eab308' : '#10B981'} /></div>
                <span className="font-mono text-[11px] text-mute tnum w-8">/{r.reorder}</span>
              </div>
            )},
            { header: 'Value',    cellClass: 'font-mono text-silver tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.stock * r.cost)}</div> },
            { header: '', cellClass: 'whitespace-nowrap text-right', render: r => (
              r.stock < r.reorder
                ? <Button size="sm" variant="warn" onClick={() => pushToast && pushToast({ title: 'Reorder placed', body: `${r.sku} · ${r.reorder} units from ${r.supplier}` })}>Reorder</Button>
                : <span className="text-[12px] text-teal">In stock</span>
            )},
          ]}
          rows={DB.inventory}
        />
      </Panel>
    </div>
  );
}

// ============ Manager · Invoices ============
function ManagerInvoicesPage({ pushToast }) {
  const all = DB.managerInvoices;
  const pending = all.filter(i => i.status === 'pending');
  const overdue = all.filter(i => i.status === 'overdue');
  const paid    = all.filter(i => i.status === 'paid');

  return (
    <div>
      <PageHeader
        kicker="Billing"
        title="Invoices"
        subtitle="Issued by SF · Mission · last 30 days"
        actions={<>
          <Input icon="search" placeholder="Customer, ID…" className="w-64" />
          <Button size="sm" variant="default" icon="download">Export</Button>
          <Button size="sm" variant="primary" icon="plus">Manual invoice</Button>
        </>}
      />

      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-4 mb-4">
        <KPI label="Outstanding" value={fmtMoney(pending.reduce((s,i)=>s+i.amount,0))} sub={`${pending.length} pending`} accent="#eab308" mono />
        <KPI label="Overdue"     value={fmtMoney(overdue.reduce((s,i)=>s+i.amount,0))} sub={`${overdue.length} accounts`}  accent="#ef4444" mono />
        <KPI label="Paid (30d)"  value={fmtMoney(paid.reduce((s,i)=>s+i.amount,0))}    sub={`${paid.length} invoices`} mono />
        <KPI label="DSO"         value="6.4d" sub="vs 11d industry" accent="#10B981" />
      </section>

      <Panel innerClassName="p-0">
        <DataTable
          columns={[
            { header: 'Invoice',  cellClass: 'font-mono text-ink whitespace-nowrap', render: r => r.id },
            { header: 'Date',     cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.date },
            { header: 'Customer', cellClass: 'text-ink whitespace-nowrap', render: r => r.customer },
            { header: 'Amount',   cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.amount)}</div> },
            { header: 'Status',   render: r => <StatusBadge status={r.status} /> },
            { header: '', cellClass: 'whitespace-nowrap text-right', render: r => (
              <div className="flex justify-end gap-2">
                {r.status === 'pending' && <Button size="sm" variant="ghost" icon="send">Remind</Button>}
                {r.status === 'overdue' && <Button size="sm" variant="warn" icon="alert-triangle">Escalate</Button>}
                {r.status === 'paid'    && <Button size="sm" variant="ghost" icon="receipt">Receipt</Button>}
                <Button size="sm" variant="ghost" icon="download" aria-label="Download" />
              </div>
            )},
          ]}
          rows={all}
        />
      </Panel>
    </div>
  );
}

// ============ Manager · Reviews ============
function ManagerReviewsPage() {
  const avg = (DB.reviews.reduce((s,r) => s + r.rating, 0) / DB.reviews.length).toFixed(1);
  const dist = [5,4,3,2,1].map(s => ({ s, n: DB.reviews.filter(r => r.rating === s).length }));
  const max = Math.max(...dist.map(d => d.n));

  return (
    <div>
      <PageHeader
        kicker="Voice of customer"
        title="Reviews"
        subtitle="Customer feedback on services performed at SF · Mission."
        actions={<>
          <Segmented value="all" onChange={()=>{}} options={[
            { label:'All', value:'all' }, { label:'5★', value:'5' }, { label:'4★', value:'4' }, { label:'≤3★', value:'3' }, { label:'Flagged', value:'flagged' },
          ]} />
          <Button size="sm" variant="default" icon="download">Export</Button>
        </>}
        meta={<>
          <span>Average <span className="font-mono tnum text-ink">{avg}</span></span>
          <span>{DB.reviews.length} reviews · trailing 30d</span>
          <span>Response rate <span className="font-mono tnum text-ink">94%</span></span>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Score" innerClassName="p-5">
            <div className="flex items-baseline gap-3 mb-1">
              <div className="text-[56px] leading-none font-medium text-ink tnum">{avg}</div>
              <Stars value={Math.round(avg)} size={16} />
            </div>
            <div className="text-[12px] text-silver mb-5">{DB.reviews.length} reviews · last 30 days</div>
            <ul className="space-y-2">
              {dist.map(d => (
                <li key={d.s} className="flex items-center gap-3 text-[12px]">
                  <span className="font-mono text-mute tnum w-6">{d.s}★</span>
                  <div className="flex-1 h-2 border border-line rounded-xs bg-white/[0.02] overflow-hidden">
                    <div className="h-full bg-teal/70" style={{ width: max ? (d.n/max)*100+'%' : '0%' }} />
                  </div>
                  <span className="font-mono text-ink tnum w-6 text-right">{d.n}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-line">
              <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Trend</div>
              <Sparkline data={[4.4,4.5,4.6,4.5,4.7,4.6,4.8,4.7]} />
            </div>
          </Panel>

          <Panel title="Top compliments" innerClassName="p-0">
            <ul className="text-[12px] divide-y divide-line">
              {[
                ['Transparent pricing', 28],
                ['On-time completion',  24],
                ['Friendly staff',      19],
                ['Detailed reports',    15],
                ['Live job updates',    11],
              ].map(([t,n],i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-silver">{t}</span>
                  <span className="font-mono text-ink tnum">×{n}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Panel title="Recent" subtitle={`${DB.reviews.length} reviews · most recent first`} innerClassName="p-0">
            <ul className="divide-y divide-line">
              {DB.reviews.map(r => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-line2 rounded-md flex items-center justify-center text-[11px] text-ink">{r.customer.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <div className="text-[13px] text-ink">{r.customer}</div>
                        <div className="font-mono text-[11px] text-mute tnum">{r.date} · serviced by {r.mechanic}</div>
                      </div>
                    </div>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <div className="text-[13px] text-silver leading-relaxed pl-12">{r.body}</div>
                  <div className="pl-12 mt-3 flex items-center gap-2">
                    <Button size="sm" variant="ghost" icon="reply">Reply</Button>
                    {r.rating <= 3 && <Button size="sm" variant="warn" icon="flag">Flag for review</Button>}
                    <span className="flex-1" />
                    <span className="font-mono text-[10px] text-mute tracking-wider">{r.id}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ============ Manager · Profile ============
function ManagerProfilePage({ pushToast }) {
  const u = DB.user.manager;
  return (
    <div>
      <PageHeader
        kicker="Account"
        title="Profile"
        subtitle="Personal details, role, security and notification preferences."
        actions={<>
          <Button size="sm" variant="ghost" icon="log-out">Sign out</Button>
          <Button size="sm" variant="primary" icon="save" onClick={() => pushToast && pushToast({ title: 'Profile saved', body: 'Changes published to all centers' })}>Save changes</Button>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel innerClassName="p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 border border-line2 rounded-md flex items-center justify-center text-[20px] text-ink shrink-0">{u.name.split(' ').map(n=>n[0]).join('')}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] text-ink font-medium">{u.name}</div>
                <div className="text-[12px] text-silver">Manager · SF · Mission</div>
                <div className="font-mono text-[11px] text-mute mt-1 tnum">{u.id}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-line">
              <Button size="sm" variant="default" icon="upload" className="w-full">Change avatar</Button>
            </div>
          </Panel>

          <Panel title="Security" innerClassName="p-0">
            <ul className="text-[12px] divide-y divide-line">
              <li className="flex items-center justify-between px-4 py-3">
                <span className="text-silver">Password</span>
                <Button size="sm" variant="ghost" icon="key">Change</Button>
              </li>
              <li className="flex items-center justify-between px-4 py-3">
                <span className="text-silver">Two-factor (Authenticator)</span>
                <StatusBadge status="open" label="ON" />
              </li>
              <li className="flex items-center justify-between px-4 py-3">
                <span className="text-silver">Hardware key</span>
                <span className="text-mute">Not enrolled</span>
              </li>
              <li className="flex items-center justify-between px-4 py-3">
                <span className="text-silver">Active sessions</span>
                <span className="font-mono text-ink tnum">2</span>
              </li>
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Identity" innerClassName="p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name"><Input defaultValue="Priya" /></Field>
              <Field label="Last name"><Input defaultValue="Chandrasekaran" /></Field>
              <Field label="Email"><Input icon="mail" type="email" defaultValue={u.email} /></Field>
              <Field label="Phone"><Input icon="phone" defaultValue="+1 415 555 0190" /></Field>
              <Field label="Role"><Input defaultValue="Center Manager · L3" disabled /></Field>
              <Field label="Center"><Input icon="building-2" defaultValue="SF-MISSION-01" disabled /></Field>
            </div>
          </Panel>

          <Panel title="Notifications" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                ['Pending approvals',          'Email + push',   true],
                ['Critical inventory alerts',  'Email + push + SMS', true],
                ['SLA warnings',                'Email + push',  true],
                ['Daily revenue digest',        'Email · 18:00', true],
                ['Customer reviews ≤ 3★',       'Email + push',  true],
                ['Mechanic shift incidents',    'Push',          false],
                ['Weekly performance review',   'Email · Mon',   false],
              ].map(([label, channel, on], i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-ink text-[13px]">{label}</div>
                    <div className="text-[11px] text-mute">{channel}</div>
                  </div>
                  <span className={`w-9 h-5 rounded-full border flex items-center transition-colors ${on ? 'bg-teal/20 border-teal/50 justify-end pr-0.5' : 'bg-panel2 border-line2 pl-0.5'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full ${on ? 'bg-teal' : 'bg-mute'}`} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="API access" subtitle="For external scheduling integrations" innerClassName="p-5">
            <div className="text-[12px] text-silver mb-2">Personal access token</div>
            <div className="flex items-center gap-2">
              <Input icon="key" defaultValue="as_pa_•••••••••••••••••••••••••••2BkF" disabled className="flex-1" />
              <Button size="sm" variant="default" icon="copy">Copy</Button>
              <Button size="sm" variant="ghost" icon="refresh-cw">Rotate</Button>
            </div>
            <div className="text-[11px] text-mute mt-2">Last used 2026-05-27 09:14 from <span className="font-mono">10.42.0.118</span></div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// Field helper (mirrors the one in public.jsx — small wrap for labelled inputs)
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] text-silver">{label}</span>
        {hint && <span className="text-[11px] text-mute">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

// ============ Manager · CreateServiceCenter ============
function ManagerCreateServiceCenterPage({ pushToast }) {
  const [step, setStep] = mpUseState(1);
  const steps = ['Identity','Location','Operations','Capacity','Review'];

  const next = () => setStep(s => Math.min(5, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  return (
    <div>
      <PageHeader
        kicker="Onboarding wizard"
        title="Open a service center"
        subtitle="A 12-minute setup. We'll seed bays, services and inventory once you finish."
        actions={<>
          <Button size="sm" variant="ghost">Save draft</Button>
          {step < 5
            ? <Button size="sm" variant="primary" icon="arrow-right" onClick={next}>Continue</Button>
            : <Button size="sm" variant="primary" icon="check" onClick={() => pushToast && pushToast({ title: 'Center created', body: 'OAK-LAKE-01 · provisioning in progress' })}>Provision center</Button>
          }
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3">
          <Panel innerClassName="p-0">
            <ol className="text-[13px]">
              {steps.map((s, i) => {
                const idx = i + 1;
                const done = idx < step;
                const cur = idx === step;
                return (
                  <li key={s} onClick={() => setStep(idx)} className={`flex items-center gap-3 px-5 py-3.5 border-b border-line last:border-b-0 cursor-pointer transition-colors ${cur ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                    <div className={`w-6 h-6 border rounded-full flex items-center justify-center text-[11px] ${done ? 'border-teal bg-teal/10 text-teal' : cur ? 'border-ink bg-ink text-obsidian' : 'border-line2 text-mute'}`}>
                      {done ? <Icon name="check" size={11} /> : idx}
                    </div>
                    <span className={cur ? 'text-ink' : done ? 'text-silver' : 'text-mute'}>{s}</span>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          {step === 1 && (
            <Panel title="Identity" subtitle="Public name + brand presence" innerClassName="p-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Center display name" hint="public"><Input icon="building-2" defaultValue="Oakland · Lake Merritt" /></Field>
                <Field label="Internal ID" hint="auto-generated"><Input defaultValue="OAK-LAKE-01" disabled /></Field>
                <Field label="Brand tagline" hint="optional"><Input defaultValue="Service that respects your time." /></Field>
                <Field label="Cover photo"><Input icon="upload" placeholder="Drop or browse — 1920×1080 recommended" /></Field>
              </div>
            </Panel>
          )}

          {step === 2 && (
            <Panel title="Location" subtitle="Address + service radius" innerClassName="p-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Street address"><Input icon="map-pin" defaultValue="2255 Lakeshore Ave" /></Field>
                <Field label="Suite / unit" hint="optional"><Input defaultValue="—" /></Field>
                <Field label="City"><Input defaultValue="Oakland" /></Field>
                <Field label="State"><Input defaultValue="CA" /></Field>
                <Field label="ZIP"><Input defaultValue="94606" /></Field>
                <Field label="Service radius (mi)"><Input defaultValue="15" /></Field>
              </div>
              <div className="mt-4 h-44 border border-line rounded-md stripe flex items-center justify-center">
                <Icon name="map" size={28} className="text-mute" />
              </div>
            </Panel>
          )}

          {step === 3 && (
            <Panel title="Operations" subtitle="Hours, services, payment" innerClassName="p-5">
              <div className="grid grid-cols-7 gap-2 mb-5">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
                  <div key={d} className="border border-line rounded-md p-2.5">
                    <div className="font-mono text-[10px] text-mute tracking-wider uppercase">{d}</div>
                    <div className="font-mono text-[12px] text-ink tnum mt-1">{i === 6 ? '— closed —' : '07:00 – 20:00'}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[12px] text-silver mb-2">Services offered</div>
                <div className="grid grid-cols-2 gap-2">
                  {DB.services.map(s => (
                    <label key={s.code} className="flex items-center gap-2.5 px-3 py-2 border border-line2 rounded-xs bg-panel2 cursor-pointer hover:bg-white/[0.04]">
                      <span className="w-4 h-4 border border-teal/40 bg-teal/15 rounded-xs flex items-center justify-center">
                        <Icon name="check" size={10} className="text-teal" />
                      </span>
                      <span className="text-[12px] text-ink flex-1 truncate">{s.name}</span>
                      <span className="font-mono text-[11px] text-silver tnum">{fmtMoney(s.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {step === 4 && (
            <Panel title="Capacity" subtitle="Bays + initial team" innerClassName="p-5">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <Field label="Number of bays"><Input icon="layout-grid" defaultValue="6" /></Field>
                <Field label="Diagnostic bays" hint="of total"><Input defaultValue="2" /></Field>
                <Field label="EV-capable bays" hint="of total"><Input defaultValue="3" /></Field>
              </div>
              <div className="text-[12px] text-silver mb-2">Initial mechanics</div>
              <ul className="border border-line2 rounded-md overflow-hidden divide-y divide-line">
                {DB.mechanics.slice(0,3).map(m => (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-4 h-4 border border-teal/40 bg-teal/15 rounded-xs flex items-center justify-center"><Icon name="check" size={10} className="text-teal" /></span>
                    <div className="w-8 h-8 border border-line2 rounded-md flex items-center justify-center text-[10px] text-ink">{m.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-ink">{m.name}</div>
                      <div className="text-[11px] text-silver">{m.cert}</div>
                    </div>
                    <span className="text-[11px] text-mute">Will transfer from SF · Mission</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="default" icon="user-plus" className="mt-3">Invite more mechanics</Button>
            </Panel>
          )}

          {step === 5 && (
            <Panel title="Review" subtitle="Everything looks good?" innerClassName="p-0">
              <dl className="text-[12px]">
                {[
                  ['Display name',     'Oakland · Lake Merritt'],
                  ['Internal ID',      'OAK-LAKE-01'],
                  ['Address',          '2255 Lakeshore Ave, Oakland CA 94606'],
                  ['Hours',            'Mon–Sat · 07:00–20:00'],
                  ['Service radius',   '15 mi'],
                  ['Bays',             '6 (2 diagnostic · 3 EV-capable)'],
                  ['Initial mechanics','3 transferring from SF · Mission'],
                  ['Services',         `${DB.services.length} services enabled`],
                  ['Estimated launch', '2026-06-10'],
                ].map(([k,v],i) => (
                  <div key={i} className="flex justify-between gap-4 px-5 py-3 border-b border-line last:border-b-0">
                    <dt className="text-silver">{k}</dt>
                    <dd className="text-ink font-mono tnum text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" icon="arrow-left" disabled={step === 1} onClick={prev}>Back</Button>
            <span className="font-mono text-[11px] text-mute tracking-wider uppercase">Step {step} of {steps.length}</span>
            {step < 5
              ? <Button variant="primary" icon="arrow-right" onClick={next}>Continue</Button>
              : <Button variant="primary" icon="check" onClick={() => pushToast && pushToast({ title: 'Center created', body: 'OAK-LAKE-01 · provisioning in progress' })}>Provision</Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Manager · ManageServiceCenter ============
function ManagerManageServiceCenterPage({ pushToast }) {
  const c = DB.centers[0];
  const [tab, setTab] = mpUseState('overview');

  return (
    <div>
      <PageHeader
        kicker="Center settings"
        title={c.name}
        subtitle={<>SF-MISSION-01 · 123 Valencia St · {c.bays} bays · {c.mechs} mechanics</>}
        actions={<>
          <Button size="sm" variant="ghost" icon="external-link">View public page</Button>
          <Button size="sm" variant="default" icon="pause-circle">Suspend center</Button>
          <Button size="sm" variant="primary" icon="save" onClick={() => pushToast && pushToast({ title: 'Center settings saved' })}>Save</Button>
        </>}
        meta={<>
          <StatusBadge status="open" label="ONLINE" />
          <span>Today <span className="font-mono tnum text-ink">{fmtMoney(c.revenue)}</span> · {c.jobs} jobs</span>
          <span>SLA <span className="font-mono tnum text-teal">{c.sla}%</span></span>
        </>}
      />

      <div className="border border-line bg-panel rounded-md overflow-hidden">
        <div className="flex border-b border-line">
          {[
            { id: 'overview', label: 'Overview',   icon: 'gauge' },
            { id: 'hours',    label: 'Hours',      icon: 'clock' },
            { id: 'services', label: 'Services',   icon: 'wrench' },
            { id: 'bays',     label: 'Bays',       icon: 'layout-grid' },
            { id: 'team',     label: 'Team',       icon: 'users' },
            { id: 'billing',  label: 'Billing',    icon: 'credit-card' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 h-11 text-[12px] border-r border-line transition-colors ${tab === t.id ? 'text-ink bg-white/[0.04]' : 'text-silver hover:text-ink hover:bg-white/[0.02]'}`}>
              <Icon name={t.icon} size={13} /> {t.label}
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-px bg-teal" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Display name"><Input defaultValue={c.name} /></Field>
                  <Field label="Internal ID"><Input defaultValue="SF-MISSION-01" disabled /></Field>
                  <Field label="Tagline"><Input defaultValue="Service that respects your time." /></Field>
                  <Field label="Region"><Input defaultValue="NORAM-WEST" disabled /></Field>
                  <Field label="Address line 1"><Input icon="map-pin" defaultValue="123 Valencia St" /></Field>
                  <Field label="Address line 2"><Input defaultValue="—" /></Field>
                  <Field label="City"><Input defaultValue="San Francisco" /></Field>
                  <Field label="ZIP"><Input defaultValue="94103" /></Field>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <Panel title="At a glance" innerClassName="p-0">
                  <dl className="text-[12px]">
                    {[
                      ['Opened',   '2021-03-08'],
                      ['Bays',     `${c.bays}`],
                      ['Mechanics',`${c.mechs}`],
                      ['Jobs/mo',  '418'],
                      ['Revenue/mo',fmtMoney(412800)],
                      ['SLA · 30d',`${c.sla}%`],
                      ['Rating',   '4.8 ★'],
                    ].map(([k,v],i) => (
                      <div key={i} className="flex justify-between gap-4 px-4 py-2.5 border-b border-line last:border-b-0">
                        <dt className="text-silver">{k}</dt><dd className="text-ink font-mono tnum">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
                <Panel title="Danger zone" innerClassName="p-5">
                  <div className="text-[12px] text-silver mb-3">Suspending a center freezes new bookings but keeps active jobs running.</div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button size="sm" variant="warn" icon="pause-circle">Suspend center</Button>
                    <Button size="sm" variant="danger" icon="trash-2">Decommission</Button>
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {tab === 'hours' && (
            <div>
              <div className="text-[12px] text-silver mb-3">Weekly hours · timezone <span className="font-mono text-ink">America/Los_Angeles</span></div>
              <ul className="border border-line2 rounded-md overflow-hidden divide-y divide-line">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d,i) => (
                  <li key={d} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                    <div className="col-span-3 text-[13px] text-ink">{d}</div>
                    <div className="col-span-2"><span className={`text-[11px] px-2 py-0.5 rounded-xs border ${i === 6 ? 'border-mute/30 text-mute' : 'border-teal/30 text-teal bg-teal/10'}`}>{i === 6 ? 'Closed' : 'Open'}</span></div>
                    <div className="col-span-3"><Input icon="clock" defaultValue={i === 6 ? '—' : '07:00'} /></div>
                    <div className="col-span-3"><Input icon="clock" defaultValue={i === 6 ? '—' : '20:00'} /></div>
                    <div className="col-span-1 text-right"><Button size="sm" variant="ghost" icon="copy" aria-label="Copy" /></div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'services' && (
            <ul className="border border-line2 rounded-md overflow-hidden divide-y divide-line">
              {DB.services.map(s => (
                <li key={s.code} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                  <div className="col-span-1">
                    <span className="w-4 h-4 border border-teal/40 bg-teal/15 rounded-xs flex items-center justify-center"><Icon name="check" size={10} className="text-teal" /></span>
                  </div>
                  <div className="col-span-5 min-w-0">
                    <div className="text-[13px] text-ink truncate">{s.name}</div>
                    <div className="font-mono text-[11px] text-mute">{s.code}</div>
                  </div>
                  <div className="col-span-3"><Input icon="clock" defaultValue={`${s.duration} min`} /></div>
                  <div className="col-span-3"><Input icon="dollar-sign" defaultValue={s.price.toFixed(2)} /></div>
                </li>
              ))}
            </ul>
          )}

          {tab === 'bays' && (
            <div className="grid grid-cols-3 gap-3">
              {DB.bays.map(b => (
                <div key={b.id} className="border border-line2 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] text-ink">Bay <span className="font-mono">{b.id.replace('BAY-','')}</span></span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="space-y-3">
                    <Field label="Type"><Input defaultValue={b.id === 'BAY-06' ? 'Heavy lift' : b.id === 'BAY-03' ? 'EV diagnostic' : 'General'} /></Field>
                    <Field label="Equipment"><Input defaultValue="OBD-II reader · Hunter aligner" /></Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'team' && (
            <Panel innerClassName="p-0" className="border-0">
              <DataTable
                columns={[
                  { header: 'Mechanic', cellClass: 'text-ink whitespace-nowrap', render: m => m.name },
                  { header: 'Cert',     cellClass: 'text-silver whitespace-nowrap', render: m => m.cert },
                  { header: 'Capacity', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: m => `${m.capacity}` },
                  { header: 'Status',   render: m => <StatusBadge status={m.status} /> },
                  { header: '', cellClass: 'text-right whitespace-nowrap', render: () => <Button size="sm" variant="ghost" icon="more-horizontal" /> },
                ]}
                rows={DB.mechanics}
              />
            </Panel>
          )}

          {tab === 'billing' && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tax ID (EIN)"><Input defaultValue="84-2918340" /></Field>
              <Field label="Sales tax rate"><Input defaultValue="8.625%" /></Field>
              <Field label="Payout account"><Input icon="credit-card" defaultValue="ACH · Wells Fargo · ••••3192" /></Field>
              <Field label="Payout schedule"><Input defaultValue="Weekly · Fridays" /></Field>
              <Field label="Accepted methods"><Input defaultValue="Card · ACH · Counter" /></Field>
              <Field label="Default deposit"><Input defaultValue="20% on booking" /></Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ManagerBookingsPage, ManagerBookingDetailPage,
  ManagerJobCardsPage, ManagerJobCardDetailPage,
  ManagerMechanicsPage, ManagerInventoryPage,
  ManagerInvoicesPage, ManagerReviewsPage,
  ManagerProfilePage,
  ManagerCreateServiceCenterPage, ManagerManageServiceCenterPage,
});
