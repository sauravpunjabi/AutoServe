// Mechanic pages — JobCards, JobCardDetail, ServiceCenters, Profile
const { useState: meaUseState, useMemo: meaUseMemo, useEffect: meaUseEffect } = React;

// ============ Mechanic · JobCards ============
function MechanicJobCardsPage({ goDetail }) {
  const [filter, setFilter] = meaUseState('all');
  const rows = filter === 'all' ? DB.jobCards : DB.jobCards.filter(j => j.status === filter);

  return (
    <div>
      <PageHeader
        kicker="My queue"
        title="Job cards"
        subtitle="Cards assigned to you · sorted by priority and ETA."
        actions={<>
          <Segmented
            options={[
              { label:'All', value:'all' },
              { label:'In progress', value:'in_progress' },
              { label:'Pending', value:'pending' },
              { label:'Completed', value:'completed' },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <Button size="sm" variant="ghost" icon="refresh-cw">Refresh</Button>
        </>}
        meta={<>
          <span><span className="font-mono tnum text-info">1</span> active</span>
          <span><span className="font-mono tnum text-warn">2</span> queued</span>
          <span>Shift ends <span className="font-mono tnum text-ink">18:00</span></span>
        </>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rows.map(j => {
          const inProg = j.status === 'in_progress';
          return (
            <button key={j.id} onClick={() => goDetail && goDetail(j.id)} className="text-left border border-line bg-panel rounded-md hover:border-line2 hover:bg-white/[0.02] transition-colors">
              <div className="px-5 py-4 border-b border-line flex items-center justify-between">
                <div className="font-mono text-[12px] text-silver">{j.id}</div>
                <PriorityChip p={j.priority} />
              </div>
              <div className="px-5 py-4">
                <div className="text-[15px] text-ink mb-0.5 leading-tight">{j.vehicle.split(' · ')[0]}</div>
                <div className="font-mono text-[11px] text-mute tnum">{j.vehicle.split(' · ')[1]} · {j.customer}</div>

                <div className="mt-5">
                  <ul className="space-y-1.5 mb-4">
                    {j.services.slice(0,3).map(s => (
                      <li key={s} className="text-[12px] text-silver leading-tight">— {s}</li>
                    ))}
                  </ul>
                </div>

                {inProg ? (
                  <>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-mute">Progress</span>
                      <span className="font-mono text-ink tnum">{j.progress}%</span>
                    </div>
                    <CapacityBar value={j.progress} color="#3b82f6" />
                    <div className="flex justify-between text-[11px] mt-3 text-silver">
                      <span>Bay <span className="font-mono">{j.bay}</span></span>
                      <span>ETA <span className="font-mono tnum">{j.eta}</span></span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status="pending" />
                    <span className="text-[11px] text-silver">ETA <span className="font-mono tnum">{j.eta}</span></span>
                  </div>
                )}
              </div>
              <div className="px-5 py-2.5 border-t border-line flex justify-between items-center">
                <span className="font-mono text-[11px] text-mute">{j.services.length} services</span>
                <span className="text-[12px] text-teal flex items-center gap-1 transition-all">
                  Open <Icon name="arrow-right" size={11} />
                </span>
              </div>
            </button>
          );
        })}

        {/* completed (mock) */}
        <div className="border border-dashed border-line2 rounded-md p-5 flex flex-col items-center justify-center text-center min-h-[260px]">
          <div className="w-10 h-10 border border-line2 rounded-md flex items-center justify-center text-silver mb-3">
            <Icon name="check-check" size={16} />
          </div>
          <div className="text-[13px] text-ink">12 completed today</div>
          <div className="text-[12px] text-silver mt-1">Average cycle 1h 42m</div>
          <Button size="sm" variant="ghost" icon="history" className="mt-3">View completed</Button>
        </div>
      </div>
    </div>
  );
}

// ============ Mechanic · JobCardDetail ============
function MechanicJobCardDetailPage({ goBack, pushToast }) {
  const job = DB.activeJob;
  const veh = vehicleById(job.vehicleId);
  const [tasks, setTasks] = meaUseState(job.tasks);
  const [notes, setNotes] = meaUseState('Battery cell 47 reading 3.81V (nominal 3.92V) — flagged for next visit. No corrosion observed on HV connector.');

  const complete = (idx) => {
    setTasks(arr => arr.map((t, i) => {
      if (i === idx) return { ...t, status: 'done', at: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) };
      if (i === idx + 1 && t.status === 'pending') return { ...t, status: 'in_progress', at: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) };
      return t;
    }));
    pushToast && pushToast({ title: 'Step complete', body: `${job.id} · advanced` });
  };

  const completed = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <div>
      <button onClick={goBack} className="flex items-center gap-1.5 text-[12px] text-silver hover:text-ink mb-4 transition-colors">
        <Icon name="arrow-left" size={13} /> Back to my queue
      </button>

      <PageHeader
        kicker={<>Active job · <span className="font-mono text-silver">{job.id}</span></>}
        title={`${veh.year} ${veh.make} ${veh.model}`}
        subtitle={<>Bay <span className="font-mono text-ink">{job.bayId.replace('BAY-','')}</span> · Marcus Holloway</>}
        actions={<>
          <Button size="sm" variant="ghost" icon="message-square">Notify customer</Button>
          <Button size="sm" variant="warn" icon="pause">Pause</Button>
          <Button size="sm" variant="primary" icon="check-circle">Mark job done</Button>
        </>}
        meta={<>
          <span>Started <span className="font-mono text-ink tnum">{tasks[0]?.at}</span></span>
          <span>ETA <span className="font-mono text-ink tnum">12:30</span></span>
          <span>VIN <span className="font-mono text-ink">{veh.vin}</span></span>
          <span>{progress}% complete</span>
        </>}
      />

      <div className="border border-line bg-panel rounded-md overflow-hidden mb-4">
        <div className="grid grid-cols-4 gap-0 border-b border-line">
          <div className="px-5 py-3.5 border-r border-line"><div className="text-[11px] text-mute mb-1">Plate</div><div className="font-mono text-[13px] text-ink">{veh.plate}</div></div>
          <div className="px-5 py-3.5 border-r border-line"><div className="text-[11px] text-mute mb-1">Odometer</div><div className="text-[13px] text-ink"><span className="font-mono tnum">{fmtCount(veh.miles)}</span> mi</div></div>
          <div className="px-5 py-3.5 border-r border-line"><div className="text-[11px] text-mute mb-1">Battery SOH</div><div className="font-mono text-[13px] text-ink tnum">94%</div></div>
          <div className="px-5 py-3.5"><div className="text-[11px] text-mute mb-1">Progress</div><div className="flex items-center gap-2"><span className="font-mono text-[13px] text-teal tnum">{progress}%</span><div className="flex-1"><CapacityBar value={progress} color="#10B981" /></div></div></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Task sequence" subtitle={`${completed} of ${tasks.length} complete`} innerClassName="p-0">
            <ul className="divide-y divide-line">
              {tasks.map((t, i) => {
                const done = t.status === 'done';
                const inProg = t.status === 'in_progress';
                const pending = t.status === 'pending';
                return (
                  <li key={t.id} className={`flex items-center gap-4 px-5 py-3.5 ${inProg ? 'bg-info/[0.04]' : ''}`}>
                    <div className="font-mono text-[11px] text-mute tnum w-6">{String(i+1).padStart(2,'0')}</div>
                    <div className={`w-5 h-5 border rounded-full flex items-center justify-center shrink-0 ${done ? 'border-teal bg-teal/10' : inProg ? 'border-info bg-info/10' : 'border-line2'}`}>
                      {done && <Icon name="check" size={12} className="text-teal" />}
                      {inProg && <span className="w-1.5 h-1.5 rounded-full bg-info" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] leading-snug ${done ? 'text-silver' : inProg ? 'text-ink' : 'text-mute'}`}>{t.label}</div>
                      <div className="text-[11px] text-mute mt-0.5">{t.at ? <>Logged at <span className="font-mono tnum">{t.at}</span></> : <>Awaiting prior step</>}</div>
                    </div>
                    {inProg ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" icon="paperclip">Attach</Button>
                        <Button size="sm" variant="primary" icon="check" onClick={() => complete(i)}>Mark complete</Button>
                      </div>
                    ) : done ? (
                      <StatusBadge status="done" />
                    ) : pending && i === completed ? (
                      <Button size="sm" variant="default" icon="play" onClick={() => {
                        setTasks(arr => arr.map((tt, j) => j === i ? { ...tt, status: 'in_progress', at: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) } : tt));
                      }}>Start</Button>
                    ) : (
                      <StatusBadge status="pending" />
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Diagnostic notes" subtitle="Auto-saved" innerClassName="p-5">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              className="w-full bg-panel2 border border-line2 rounded-md p-3 text-[13px] text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-mute"><span className="font-mono tnum">{notes.length}</span>/2000 · autosaved 12s ago</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon="camera">Photo</Button>
                <Button size="sm" variant="default" icon="paperclip">Attach OBD log</Button>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Parts drawn" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                { sku: 'FLT-AIR-K&N-1',  qty: 1, name: 'K&N High-Flow Air Filter' },
                { sku: 'WIP-BLD-BSH-22', qty: 2, name: 'Bosch ICON Wiper Blade 22"' },
                { sku: 'OIL-5W30-MOB1',  qty: 5, name: 'Mobil 1 5W-30 (1qt)' },
              ].map(p => (
                <li key={p.sku} className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-mono text-[12px] text-ink">{p.sku}</div>
                    <div className="text-silver truncate">{p.name}</div>
                  </div>
                  <span className="font-mono text-[13px] text-ink tnum">×{p.qty}</span>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-line">
              <Button size="sm" variant="default" icon="plus" className="w-full">Draw part</Button>
            </div>
          </Panel>

          <Panel title="Live readings" innerClassName="p-0">
            <ul className="text-[12px]">
              {[
                ['HV battery SOH',   '94%',     '#10B981'],
                ['Cell 47 voltage',  '3.81V',   '#eab308'],
                ['Brake fluid H₂O',  '1.4%',    '#10B981'],
                ['Tire FL · PSI',    '36.0',    '#10B981'],
                ['Tire FR · PSI',    '36.2',    '#10B981'],
              ].map(([k,v,c],i) => (
                <li key={i} className="flex justify-between gap-4 px-4 py-2.5 border-b border-line last:border-b-0">
                  <span className="text-silver">{k}</span>
                  <span className="font-mono tnum" style={{ color: c }}>{v}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Customer" innerClassName="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-line2 rounded-md flex items-center justify-center text-[12px] text-ink">MH</div>
              <div>
                <div className="text-[13px] text-ink">Marcus Holloway</div>
                <div className="font-mono text-[11px] text-mute tnum">CU-44193 · Platinum</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="default" icon="phone" className="flex-1">Call</Button>
              <Button size="sm" variant="default" icon="message-square" className="flex-1">SMS</Button>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ============ Mechanic · ServiceCenters ============
function MechanicServiceCentersPage() {
  const home = DB.centers[0];
  return (
    <div>
      <PageHeader
        kicker="Where I'm certified"
        title="Service centers"
        subtitle="Your home center, plus locations you're cross-certified to cover."
        actions={<>
          <Button size="sm" variant="default" icon="map">Map</Button>
          <Button size="sm" variant="primary" icon="user-plus">Request cross-cert</Button>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <Panel title="Home center" subtitle="Primary assignment" action={<StatusBadge status="open" label="PRIMARY" />} innerClassName="p-5">
            <div className="text-[18px] text-ink font-medium tracking-tight">{home.name}</div>
            <div className="text-[12px] text-silver mt-0.5">123 Valencia St, San Francisco</div>
            <div className="grid grid-cols-3 gap-0 border border-line rounded-md overflow-hidden mt-5">
              <div className="px-4 py-3 border-r border-line"><div className="text-[11px] text-mute">Bays</div><div className="font-mono text-[15px] text-ink tnum">{home.bays}</div></div>
              <div className="px-4 py-3 border-r border-line"><div className="text-[11px] text-mute">Mechanics</div><div className="font-mono text-[15px] text-ink tnum">{home.mechs}</div></div>
              <div className="px-4 py-3"><div className="text-[11px] text-mute">SLA</div><div className="font-mono text-[15px] text-teal tnum">{home.sla}%</div></div>
            </div>
            <div className="h-32 border border-line rounded-md mt-4 stripe flex items-center justify-center">
              <Icon name="map" size={28} className="text-mute" />
            </div>
            <div className="mt-4 pt-4 border-t border-line">
              <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Today's stats · you</div>
              <div className="grid grid-cols-3 gap-3 text-[12px]">
                <div><div className="text-silver">Hours</div><div className="font-mono text-ink tnum text-[15px]">3.2h</div></div>
                <div><div className="text-silver">Jobs done</div><div className="font-mono text-ink tnum text-[15px]">2</div></div>
                <div><div className="text-silver">QA pass</div><div className="font-mono text-teal tnum text-[15px]">100%</div></div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <Panel title="Cross-certifications" subtitle="Centers you can cover" innerClassName="p-0">
            <DataTable
              columns={[
                { header: 'Center',   cellClass: 'whitespace-nowrap', render: r => (
                  <div>
                    <div className="text-[13px] text-ink">{r.name}</div>
                    <div className="font-mono text-[11px] text-mute">{r.id}</div>
                  </div>
                )},
                { header: 'City',     cellClass: 'text-silver whitespace-nowrap', render: r => r.city },
                { header: 'Distance',cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: (_,i) => `${[0,4.2,8.7,12.1,31.8,18.4][i]} mi` },
                { header: 'Cert',    cellClass: 'whitespace-nowrap', render: (_,i) => (
                  i === 0 ? <span className="text-[11px] px-2 py-0.5 rounded-xs border border-teal/40 text-teal bg-teal/10">Primary</span>
                  : i < 3   ? <span className="text-[11px] px-2 py-0.5 rounded-xs border border-info/40 text-info bg-info/10">Cross-cert</span>
                  : <span className="text-[11px] text-mute">—</span>
                )},
                { header: 'Status',  render: r => <StatusBadge status="open" label="ONLINE" /> },
                { header: '',         cellClass: 'whitespace-nowrap text-right', render: (_,i) => (
                  i === 0 ? <span className="font-mono text-[11px] text-mute">YOU</span> :
                  i < 3   ? <Button size="sm" variant="ghost">Pick up shift</Button> :
                            <Button size="sm" variant="default">Request cert</Button>
                )},
              ]}
              rows={DB.centers}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ============ Mechanic · Profile ============
function MechanicProfilePage({ pushToast }) {
  const u = DB.user.mechanic;
  return (
    <div>
      <PageHeader
        kicker="Workbench account"
        title="Profile"
        subtitle="Identity, certifications, performance and preferences."
        actions={<>
          <Button size="sm" variant="ghost" icon="log-out">Sign out</Button>
          <Button size="sm" variant="primary" icon="save" onClick={() => pushToast && pushToast({ title: 'Profile saved' })}>Save</Button>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel innerClassName="p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 border border-line2 rounded-md flex items-center justify-center text-[20px] text-ink">{u.name.split(' ').map(n=>n[0]).join('')}</div>
              <div className="min-w-0">
                <div className="text-[16px] text-ink font-medium">{u.name}</div>
                <div className="text-[12px] text-silver">{u.cert}</div>
                <div className="font-mono text-[11px] text-mute mt-1 tnum">{u.id}</div>
              </div>
            </div>
            <ul className="text-[12px] mt-5 pt-5 border-t border-line space-y-2.5">
              <li className="flex justify-between"><span className="text-silver">Home center</span><span className="text-ink">SF · Mission</span></li>
              <li className="flex justify-between"><span className="text-silver">Hire date</span><span className="font-mono text-ink tnum">2021-04-19</span></li>
              <li className="flex justify-between"><span className="text-silver">Shift</span><span className="font-mono text-ink tnum">Mon–Fri · 08:00–18:00</span></li>
              <li className="flex justify-between"><span className="text-silver">Pay rate</span><span className="font-mono text-ink tnum">$58.40/h</span></li>
            </ul>
          </Panel>

          <Panel title="Certifications" innerClassName="p-0">
            <ul className="text-[12px] divide-y divide-line">
              {[
                ['ASE Master Technician',     'A1–A8',          'Expires 2027-09-30'],
                ['EV High Voltage',           'L1 Certified',   'Expires 2026-11-12'],
                ['OEM · Tesla Service',       'Cert #TS-44193', 'Active'],
                ['OEM · Rivian Adventure',    'Pending',        'Submitted 2026-05-10'],
              ].map(([t, n, s], i) => (
                <li key={i} className="px-4 py-3">
                  <div className="text-[13px] text-ink leading-tight">{t}</div>
                  <div className="font-mono text-[11px] text-mute tnum mt-0.5">{n} · {s}</div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-line">
              <Button size="sm" variant="default" icon="upload" className="w-full">Upload certificate</Button>
            </div>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Panel title="Identity" innerClassName="p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name"><Input defaultValue="Diego" /></Field>
              <Field label="Last name"><Input defaultValue="Marquez" /></Field>
              <Field label="Email"><Input icon="mail" type="email" defaultValue={u.email} /></Field>
              <Field label="Phone"><Input icon="phone" defaultValue="+1 415 555 0174" /></Field>
              <Field label="Languages"><Input defaultValue="English, Spanish" /></Field>
              <Field label="Emergency contact"><Input defaultValue="Camila Marquez · +1 415 555 0102" /></Field>
            </div>
          </Panel>

          <Panel title="Performance · last 30 days" innerClassName="p-0">
            <div className="grid grid-cols-4 gap-0">
              {[
                { l: 'Jobs done',     v: '41',      sub: '+7 vs prev. month' },
                { l: 'Avg cycle',     v: '1h 42m',  sub: '−9m vs team avg' },
                { l: 'QA pass',       v: '99.4%',   sub: '1 rework' },
                { l: 'Avg rating',    v: '4.9',     sub: '38 reviews' },
              ].map((k,i) => (
                <div key={i} className={`px-5 py-4 ${i < 3 ? 'border-r' : ''} border-line`}>
                  <div className="text-[12px] text-silver mb-2">{k.l}</div>
                  <div className="font-mono text-[24px] text-ink tnum">{k.v}</div>
                  <div className="text-[11px] text-mute mt-1">{k.sub}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-line p-5">
              <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Daily cycle time</div>
              <Sparkline data={[112, 108, 102, 99, 105, 98, 95, 102, 101, 96, 94, 102, 98, 93]} color="#10B981" height={48} />
            </div>
          </Panel>

          <Panel title="Preferences" innerClassName="p-0">
            <ul className="divide-y divide-line text-[12px]">
              {[
                ['Notify on new assignment',    'Push',          true],
                ['Customer messages',            'Push',          true],
                ['Parts request status',         'Push + email',  true],
                ['Daily clock-out reminder',     'Push · 17:55',  true],
                ['Weekly performance report',    'Email · Mon',   false],
              ].map(([label, channel, on], i) => (
                <li key={i} className="flex items-center justify-between px-4 py-3">
                  <div><div className="text-ink text-[13px]">{label}</div><div className="text-[11px] text-mute">{channel}</div></div>
                  <span className={`w-9 h-5 rounded-full border flex items-center transition-colors ${on ? 'bg-teal/20 border-teal/50 justify-end pr-0.5' : 'bg-panel2 border-line2 pl-0.5'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full ${on ? 'bg-teal' : 'bg-mute'}`} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  MechanicJobCardsPage, MechanicJobCardDetailPage,
  MechanicServiceCentersPage, MechanicProfilePage,
});
