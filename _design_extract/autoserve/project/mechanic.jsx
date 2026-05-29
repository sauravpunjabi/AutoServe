// Mechanic view — assigned cards + active job with step-by-step task control
const { useState: meUseState, useEffect: meUseEffect, useMemo: meUseMemo } = React;

function JobCardItem({ job, active, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border-b border-line transition-colors ${active ? 'bg-ink/[0.04]' : 'hover:bg-white/[0.03]'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-mono text-[12px] text-ink">{job.id}</div>
        <PriorityChip p={job.priority} />
      </div>
      <div className="text-[13px] text-ink mb-0.5 truncate">{job.vehicle.split(' · ')[0]}</div>
      <div className="font-mono text-[11px] text-silver mb-3">{job.vehicle.split(' · ')[1]}</div>

      {job.status === 'in_progress' ? (
        <>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-mute">Progress</span>
            <span className="text-ink tnum font-mono">{job.progress}%</span>
          </div>
          <div className="h-1 bg-white/[0.04] border border-line rounded-xs overflow-hidden">
            <div className="h-full bg-teal" style={{ width: job.progress + '%' }} />
          </div>
          <div className="flex justify-between text-[11px] mt-2 text-silver">
            <span>Bay <span className="font-mono">{job.bay}</span></span>
            <span>ETA <span className="font-mono tnum">{job.eta}</span></span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <StatusBadge status="pending" />
          <span className="text-[11px] text-silver">ETA <span className="font-mono tnum">{job.eta}</span></span>
        </div>
      )}
    </button>
  );
}

function ActiveJobWorkspace({ pushToast }) {
  const job = DB.activeJob;
  const veh = vehicleById(job.vehicleId);
  const [tasks, setTasks] = meUseState(job.tasks);
  const [notes, setNotes] = meUseState('');

  const complete = (idx) => {
    setTasks(arr => arr.map((t, i) => {
      if (i === idx) return { ...t, status: 'done', at: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) };
      if (i === idx + 1 && t.status === 'pending') return { ...t, status: 'in_progress', at: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) };
      return t;
    }));
    pushToast({ title: 'Step complete', body: `${job.id} · advanced to next task` });
  };

  const completed = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((completed / tasks.length) * 100);

  return (
    <Panel
      title={`${veh.year} ${veh.make} ${veh.model}`}
      subtitle={<span><span className="font-mono">{job.id}</span> · Bay <span className="font-mono">{job.bayId.replace('BAY-','')}</span> · Customer Marcus Holloway · Started <span className="font-mono tnum">{tasks[0]?.at}</span></span>}
      action={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" icon="message-square">Notify customer</Button>
          <Button size="sm" variant="warn" icon="pause">Pause</Button>
        </div>
      }
      innerClassName="p-0"
    >
      {/* sub header strip */}
      <div className="grid grid-cols-4 gap-0 border-b border-line">
        <div className="px-5 py-3.5 border-r border-line">
          <div className="text-[11px] text-mute mb-1">Plate</div>
          <div className="font-mono text-[13px] text-ink">{veh.plate}</div>
        </div>
        <div className="px-5 py-3.5 border-r border-line">
          <div className="text-[11px] text-mute mb-1">VIN</div>
          <div className="font-mono text-[13px] text-ink truncate">{veh.vin}</div>
        </div>
        <div className="px-5 py-3.5 border-r border-line">
          <div className="text-[11px] text-mute mb-1">Odometer</div>
          <div className="text-[13px] text-ink"><span className="font-mono tnum">{fmtCount(veh.miles)}</span> mi</div>
        </div>
        <div className="px-5 py-3.5">
          <div className="text-[11px] text-mute mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] text-teal tnum">{progress}%</span>
            <div className="flex-1"><CapacityBar value={progress} color="#10B981" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Task checklist */}
        <div className="col-span-12 lg:col-span-8 border-r border-line">
          <div className="px-5 h-11 flex items-center justify-between border-b border-line">
            <div className="text-[13px] text-ink">Task sequence</div>
            <div className="text-[11px] text-silver"><span className="font-mono tnum">{completed}</span> of <span className="font-mono tnum">{tasks.length}</span> complete</div>
          </div>
          <ul className="divide-y divide-line">
            {tasks.map((t, i) => {
              const done = t.status === 'done';
              const inProg = t.status === 'in_progress';
              const pending = t.status === 'pending';
              return (
                <li key={t.id} className={`flex items-center gap-4 px-5 py-3.5 ${inProg ? 'bg-info/[0.04]' : ''}`}>
                  <div className="font-mono text-[11px] text-mute tnum w-6">{String(i+1).padStart(2,'0')}</div>
                  <div
                    className={`w-5 h-5 border rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'border-teal bg-teal/10' :
                      inProg ? 'border-info bg-info/10' :
                      'border-line2'
                    }`}
                  >
                    {done && <Icon name="check" size={12} className="text-teal" />}
                    {inProg && <span className="w-1.5 h-1.5 rounded-full bg-info" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] leading-snug ${done ? 'text-silver' : inProg ? 'text-ink' : 'text-mute'}`}>{t.label}</div>
                    <div className="text-[11px] text-mute mt-0.5">
                      {t.at ? <>Logged at <span className="font-mono tnum">{t.at}</span></> : <>Awaiting prior step</>}
                    </div>
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
        </div>

        {/* Right side: parts + notes */}
        <div className="col-span-12 lg:col-span-4">
          <div className="px-5 h-11 flex items-center border-b border-line">
            <div className="text-[13px] text-ink">Parts drawn</div>
          </div>
          <ul className="divide-y divide-line">
            {[
              { sku: 'FLT-AIR-K&N-1', qty: 1, name: 'K&N High-Flow Air Filter' },
              { sku: 'WIP-BLD-BSH-22',qty: 2, name: 'Bosch ICON Wiper Blade · 22"' },
            ].map(p => (
              <li key={p.sku} className="px-5 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-mono text-[12px] text-ink">{p.sku}</div>
                  <div className="text-[12px] text-silver truncate">{p.name}</div>
                </div>
                <span className="font-mono text-[13px] text-ink tnum">×{p.qty}</span>
              </li>
            ))}
          </ul>

          <div className="px-5 py-3 border-t border-line">
            <Button size="sm" variant="default" icon="plus" className="w-full">Draw part</Button>
          </div>

          <div className="px-5 h-11 flex items-center border-b border-t border-line">
            <div className="text-[13px] text-ink">Diagnostic notes</div>
          </div>
          <div className="p-5">
            <textarea
              value={notes}
              onChange={e=>setNotes(e.target.value)}
              rows={5}
              placeholder="Battery cell 47 reading 3.81V (nominal 3.92V) — flagged for monitoring. No corrosion observed on HV connector…"
              className="w-full bg-panel2 border border-line2 rounded-md p-3 text-[13px] text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-mute"><span className="font-mono tnum">{notes.length}</span>/2000 · autosaved</span>
              <Button size="sm" variant="ghost" icon="save">Save draft</Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MechanicSchedule() {
  const blocks = [
    { time: '09:00', label: 'JC-2026-08471 · Tesla Model 3', tag: 'in_progress', span: 3 },
    { time: '12:30', label: 'Lunch', tag: 'normal', span: 1 },
    { time: '13:30', label: 'JC-2026-08475 · Toyota Tacoma', tag: 'pending', span: 2 },
    { time: '15:30', label: 'Open', tag: 'open', span: 1 },
    { time: '16:30', label: 'JC-2026-08478 · Honda Civic Si', tag: 'pending', span: 2 },
  ];
  return (
    <Panel title="Today's schedule" subtitle="Diego Marquez · Bay 3 priority" innerClassName="p-5">
      <div className="grid grid-cols-12 gap-0 border border-line rounded-md overflow-hidden">
        {Array.from({length: 12}).map((_, i) => (
          <div key={i} className="border-r border-line last:border-r-0 px-2 py-1.5 font-mono text-[11px] text-mute tnum text-center">
            {String(9 + i).padStart(2,'0')}:00
          </div>
        ))}
      </div>
      <div className="relative mt-px h-16 border border-line rounded-md overflow-hidden">
        {(() => {
          let offset = 0;
          return blocks.map((b, i) => {
            const widthPct = (b.span / 12) * 100;
            const left = (offset / 12) * 100;
            offset += b.span;
            const colorMap = {
              in_progress: { bg: 'rgba(59,130,246,0.18)', bd: 'rgba(59,130,246,0.50)', fg: '#3b82f6' },
              pending:     { bg: 'rgba(234,179,8,0.12)',  bd: 'rgba(234,179,8,0.40)',  fg: '#eab308' },
              open:        { bg: 'rgba(16,185,129,0.08)', bd: 'rgba(16,185,129,0.30)', fg: '#10B981' },
              normal:      { bg: 'rgba(255,255,255,0.04)',bd: 'rgba(255,255,255,0.10)', fg: '#94A3B8' },
            };
            const c = colorMap[b.tag];
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r flex items-center px-3 overflow-hidden"
                style={{ left: left + '%', width: widthPct + '%', backgroundColor: c.bg, borderColor: c.bd, borderRightWidth: i < blocks.length - 1 ? 1 : 0 }}
              >
                <div className="min-w-0">
                  <div className="text-[12px] truncate" style={{ color: c.fg }}>{b.label}</div>
                  <div className="font-mono text-[11px] text-mute tnum">{b.time}</div>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </Panel>
  );
}

function MechanicDashboard({ pushToast }) {
  const [loading, setLoading] = meUseState(true);
  const [active, setActive] = meUseState(DB.jobCards[0].id);
  meUseEffect(() => { const t = setTimeout(()=>setLoading(false), 500); return ()=>clearTimeout(t); }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonBlock h={92} />
        <div className="grid grid-cols-4 gap-4">
          <SkeletonBlock h={420} />
          <div className="col-span-3"><SkeletonBlock h={420} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-5">
        <KPI label="Assigned jobs"    value={DB.jobCards.length} sub="1 active · 2 queued" />
        <KPI label="Active job"       value="JC-08471" sub="Bay 3 · ETA 12:30" mono accent="#3b82f6" />
        <KPI label="Hours today"      value="3.2h"     sub="of 8h shift" />
        <KPI label="Avg job time"     value="1h 42m"   sub="vs 1h 51m team avg" accent="#10B981" />
        <KPI label="QA pass rate"     value="99.4%"    sub="Last 30 days" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Job list rail */}
        <aside className="lg:col-span-3">
          <Panel
            title="My job cards"
            subtitle={`${DB.jobCards.length} assigned`}
            innerClassName="p-0"
          >
            <div>
              {DB.jobCards.map(j => (
                <JobCardItem key={j.id} job={j} active={active === j.id} onSelect={() => setActive(j.id)} />
              ))}
            </div>
            <div className="px-4 py-3 border-t border-line">
              <Button size="sm" variant="ghost" icon="check-circle" className="w-full">View completed (12)</Button>
            </div>
          </Panel>
        </aside>

        {/* Active workspace */}
        <div className="lg:col-span-9">
          <ActiveJobWorkspace pushToast={pushToast} />
        </div>
      </div>

      <MechanicSchedule />
    </div>
  );
}

Object.assign(window, { MechanicDashboard });
