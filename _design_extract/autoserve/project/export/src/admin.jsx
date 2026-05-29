// Admin view — system-wide monitoring, analytics, centers, live feed
const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo } = React;

function MultiBars({ data, labels, height = 140 }) {
  const max = Math.max(...data.flat());
  const cols = data[0].length;
  return (
    <div className="flex items-end gap-1 px-1" style={{ height }}>
      {Array.from({ length: cols }).map((_, i) => {
        const a = data[0][i], b = data[1][i];
        const ha = (a / max) * (height - 24);
        const hb = (b / max) * (height - 24);
        return (
          <div key={i} className="flex-1 flex items-end gap-[2px]">
            <div className="flex-1 bg-teal/80 hover:bg-teal transition-colors" style={{ height: ha }} />
            <div className="flex-1 bg-white/15 hover:bg-white/30 transition-colors" style={{ height: hb }} />
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart() {
  const series = DB.revenue30;
  const max = Math.max(...series);
  return (
    <Panel
      title="Revenue"
      subtitle="All centers · daily gross"
      action={
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-silver"><span className="w-2 h-2 bg-teal" /> 2026</span>
          <span className="flex items-center gap-1.5 text-[11px] text-mute"><span className="w-2 h-2 bg-white/30" /> 2025</span>
          <Segmented value="30d" onChange={()=>{}} options={[
            { label: '7D', value: '7d' }, { label: '30D', value: '30d' }, { label: '90D', value: '90d' }, { label: '1Y', value: '1y' }
          ]} />
        </div>
      }
    >
      <div className="flex items-baseline gap-8 mb-5">
        <div>
          <div className="text-[12px] text-silver mb-1.5">Total</div>
          <div className="font-mono text-[28px] text-ink tnum">{fmtMoney(series.reduce((s,n)=>s+n,0) * 1000)}</div>
        </div>
        <div>
          <div className="text-[12px] text-silver mb-1.5">vs previous</div>
          <div className="font-mono text-[20px] text-teal tnum">+18.4%</div>
        </div>
        <div>
          <div className="text-[12px] text-silver mb-1.5">Daily avg</div>
          <div className="font-mono text-[20px] text-ink tnum">{fmtMoney((series.reduce((s,n)=>s+n,0) / series.length) * 1000)}</div>
        </div>
        <div>
          <div className="text-[12px] text-silver mb-1.5">Peak</div>
          <div className="font-mono text-[20px] text-ink tnum">{fmtMoney(max * 1000)}</div>
        </div>
      </div>
      <MultiBars data={[series, series.map(v => v * 0.82 - 4)]} height={160} />
      <div className="flex justify-between text-[11px] text-mute tnum font-mono mt-2">
        <span>30d ago</span><span>21d</span><span>14d</span><span>7d</span><span>today</span>
      </div>
    </Panel>
  );
}

function CentersGrid() {
  return (
    <Panel
      title="Service centers"
      subtitle={`${DB.centers.length} active · West region`}
      action={<Button size="sm" variant="ghost" icon="map">Map view</Button>}
      innerClassName="p-0"
    >
      <DataTable
        columns={[
          { header: 'Center',     cellClass: 'whitespace-nowrap', render: r => (
              <div>
                <div className="text-[13px] text-ink">{r.name}</div>
                <div className="font-mono text-[11px] text-mute">{r.id}</div>
              </div>
          )},
          { header: 'City',       cellClass: 'text-silver whitespace-nowrap', render: r => r.city },
          { header: 'Bays',       cellClass: 'whitespace-nowrap', render: r => (
              <div className="flex items-center gap-2 w-32">
                <span className="font-mono text-[13px] text-ink tnum w-10 text-right">{r.occ}/{r.bays}</span>
                <div className="flex-1"><CapacityBar value={(r.occ/r.bays)*100} /></div>
              </div>
          )},
          { header: 'Mechanics', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.mechs },
          { header: 'Jobs today', cellClass: 'font-mono text-silver tnum whitespace-nowrap', render: r => r.jobs },
          { header: 'Revenue', cellClass: 'font-mono text-ink tnum text-right whitespace-nowrap', render: r => <div className="text-right">{fmtMoney(r.revenue)}</div> },
          { header: 'SLA', cellClass: 'whitespace-nowrap', render: r => (
              <span className={`font-mono text-[13px] tnum ${r.sla < 95 ? 'text-warn' : 'text-teal'}`}>{r.sla}%</span>
          )},
          { header: '', cellClass: 'whitespace-nowrap text-right', render: () => (
              <button className="text-silver hover:text-teal transition-colors text-[12px]">Inspect →</button>
          )},
        ]}
        rows={DB.centers}
      />
    </Panel>
  );
}

function ActivityFeed() {
  const [items, setItems] = aUseState(DB.feed);

  // Append a new event every few seconds
  aUseEffect(() => {
    const pool = [
      { msg: 'Mechanic Diego Marquez · task complete on JC-2026-08471', sev: 'info',  center: 'SF-MISSION-01' },
      { msg: 'Customer Anika Rao · booking BK-2026-1142 approved',      sev: 'ok',    center: 'SF-MISSION-01' },
      { msg: 'WebSocket reconnect · 14 sessions resumed',               sev: 'info',  center: 'PLATFORM' },
      { msg: 'Inventory critical · SKU BAT-12V-OPT-3 at 0 units',       sev: 'crit',  center: 'OAK-DOWNTOWN-01' },
      { msg: 'QA pass · job JC-2026-08469 cleared for handoff',         sev: 'ok',    center: 'SF-MISSION-01' },
    ];
    const i = setInterval(() => {
      const ev = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const pad = n => String(n).padStart(2,'0');
      const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setItems(arr => [{ ...ev, t }, ...arr].slice(0, 30));
    }, 4500);
    return () => clearInterval(i);
  }, []);

  const sevMap = {
    ok:   { fg: '#10B981', label: 'OK' },
    info: { fg: '#3b82f6', label: 'Info' },
    warn: { fg: '#eab308', label: 'Warn' },
    crit: { fg: '#ef4444', label: 'Crit' },
  };

  return (
    <Panel
      title="Activity"
      subtitle="Live across all centers"
      action={<span className="text-[11px] text-teal flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal" />Connected</span>}
      innerClassName="p-0"
    >
      <ul className="divide-y divide-line max-h-[420px] overflow-y-auto scroll-thin">
        {items.map((ev, i) => {
          const s = sevMap[ev.sev];
          return (
            <li key={i} className="px-5 py-2.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
              <span className="font-mono text-[11px] text-mute tnum w-16 shrink-0 mt-px">{ev.t}</span>
              <span
                className="text-[11px] w-10 shrink-0 mt-px"
                style={{ color: s.fg }}
              >{s.label}</span>
              <span className="font-mono text-[11px] text-silver w-32 shrink-0 mt-px truncate">{ev.center}</span>
              <span className="text-[12px] text-ink flex-1 leading-relaxed">{ev.msg}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function TopServices() {
  const rows = [
    { name: 'Full Synthetic Oil & Filter Change',  count: 412, revenue: 36680 },
    { name: '4-Wheel Laser Alignment',             count: 187, revenue: 35343 },
    { name: 'Brake Pad Replacement (Front)',       count: 142, revenue: 45440 },
    { name: 'Tire Rotation & Pressure Balance',    count: 318, revenue: 15582 },
    { name: 'Full OBD-II Diagnostic Scan',         count: 96,  revenue: 13920 },
    { name: 'High Voltage Battery Health (EV)',    count: 41,  revenue: 9020  },
  ];
  const max = Math.max(...rows.map(r => r.revenue));
  return (
    <Panel title="Top services" subtitle="Last 30 days, by revenue" innerClassName="p-0">
      <ul className="divide-y divide-line">
        {rows.map(r => (
          <li key={r.name} className="px-5 py-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[13px] text-ink truncate pr-2">{r.name}</div>
              <div className="font-mono text-[13px] text-ink tnum">{fmtMoney(r.revenue)}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/[0.04] border border-line rounded-xs overflow-hidden">
                <div className="h-full bg-teal/70" style={{ width: (r.revenue / max) * 100 + '%' }} />
              </div>
              <span className="font-mono text-[11px] text-silver tnum w-12 text-right">{r.count}×</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function SystemHealth() {
  const items = [
    { name: 'API Gateway',        status: 'ok',   latency: '42ms',  uptime: '99.99%' },
    { name: 'PostgreSQL Primary', status: 'ok',   latency: '8ms',   uptime: '99.97%' },
    { name: 'WebSocket Cluster',  status: 'ok',   latency: '11ms',  uptime: '99.98%' },
    { name: 'Payment (Stripe)',   status: 'warn', latency: '780ms', uptime: '99.42%' },
    { name: 'Object Storage',     status: 'ok',   latency: '23ms',  uptime: '99.99%' },
    { name: 'Diagnostic ECU Svc', status: 'ok',   latency: '67ms',  uptime: '99.91%' },
  ];
  const sev = { ok: '#10B981', warn: '#eab308', crit: '#ef4444' };
  return (
    <Panel title="System health" subtitle="All regions · live" innerClassName="p-0">
      <ul className="divide-y divide-line">
        {items.map(s => (
          <li key={s.name} className="px-5 py-3.5 flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sev[s.status] }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink truncate">{s.name}</div>
            </div>
            <div className="font-mono text-[12px] text-silver tnum w-16 text-right">{s.latency}</div>
            <div className="font-mono text-[12px] text-mute tnum w-16 text-right">{s.uptime}</div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function AdminDashboard({ pushToast }) {
  const [loading, setLoading] = aUseState(true);
  aUseEffect(() => { const t = setTimeout(()=>setLoading(false), 650); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonBlock h={92} />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><SkeletonBlock h={320} /></div>
          <SkeletonBlock h={320} />
        </div>
        <SkeletonBlock h={300} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-panel rounded-md grid grid-cols-2 md:grid-cols-6">
        <KPI label="Active centers"   value="6"        sub="All online" accent="#10B981" />
        <KPI label="Jobs in progress" value="22"       sub="Across all centers" />
        <KPI label="Revenue today"    value={fmtMoney(93540)} trend="+18%" sub="vs $79.2K yesterday" mono />
        <KPI label="Mechanics online" value="36"       sub="of 42 staff" />
        <KPI label="Average SLA"      value="96.4%"    sub="Target 95%" accent="#10B981" />
        <KPI label="Critical alerts"  value="3"        sub="2 inventory · 1 SLA"  accent="#ef4444" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <ActivityFeed />
      </div>

      <CentersGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopServices />
        <SystemHealth />
      </div>
    </div>
  );
}

Object.assign(window, { AdminDashboard });
