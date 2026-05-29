// Public pages — Landing, Login, Register, ForgotPassword, ResetPassword
const { useState: pUseState, useEffect: pUseEffect } = React;

function AuthShell({ children, className = '' }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand pane */}
      <aside className="hidden lg:flex w-[44%] xl:w-[40%] border-r border-line bg-panel relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-obsidian/90" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 border border-teal/70 rounded-md flex items-center justify-center">
              <span className="block w-3 h-3 bg-teal rounded-[1px]" />
            </div>
            <div>
              <div className="text-[16px] font-semibold text-ink tracking-tight">AutoServe</div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-mute uppercase">Workshop OS</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-3">v4.2 · live</div>
              <h2 className="text-[40px] leading-[1.05] font-medium tracking-tight text-ink">
                The operating layer<br />for modern service bays.
              </h2>
              <p className="text-[13px] text-silver mt-4 max-w-md leading-relaxed">
                Live job telemetry, parts inventory, mechanic capacity, customer billing — all on one terminal. No spreadsheets, no clipboards.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-0 border border-line2 rounded-md overflow-hidden max-w-md">
              <div className="px-4 py-3 border-r border-line">
                <div className="text-[10px] text-mute uppercase tracking-wider mb-1">Centers</div>
                <div className="font-mono text-[18px] text-ink tnum">142</div>
              </div>
              <div className="px-4 py-3 border-r border-line">
                <div className="text-[10px] text-mute uppercase tracking-wider mb-1">Jobs/day</div>
                <div className="font-mono text-[18px] text-ink tnum">8,210</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-[10px] text-mute uppercase tracking-wider mb-1">SLA</div>
                <div className="font-mono text-[18px] text-teal tnum">97.4%</div>
              </div>
            </div>
          </div>

          <div className="font-mono text-[10px] text-mute tracking-wider uppercase">
            © 2026 AutoServe Systems · SOC 2 Type II
          </div>
        </div>
      </aside>

      {/* Right form pane */}
      <main className={`flex-1 flex items-center justify-center p-6 lg:p-10 ${className}`}>
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </main>
    </div>
  );
}

function AuthHeader({ kicker, title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <div className="relative w-7 h-7 border border-teal/70 rounded-md flex items-center justify-center">
          <span className="block w-2.5 h-2.5 bg-teal rounded-[1px]" />
        </div>
        <div className="text-[14px] font-semibold text-ink tracking-tight">AutoServe</div>
      </div>
      {kicker && <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-3">{kicker}</div>}
      <h1 className="text-[26px] font-medium tracking-tight text-ink leading-tight">{title}</h1>
      {subtitle && <p className="text-[13px] text-silver mt-2 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] text-silver">{label}</span>
        {hint && <span className="text-[11px] text-mute">{hint}</span>}
      </div>
      {children}
      {error && <div className="text-[11px] text-danger mt-1.5">{error}</div>}
    </label>
  );
}

// LANDING — marketing one-pager
function LandingPage({ go }) {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-line bg-obsidian/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1320px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 border border-teal/70 rounded-md flex items-center justify-center">
              <span className="block w-2.5 h-2.5 bg-teal rounded-[1px]" />
            </div>
            <div className="text-[14px] font-semibold text-ink tracking-tight">AutoServe</div>
            <span className="hidden md:inline-block font-mono text-[10px] tracking-[0.22em] text-mute uppercase ml-2">Workshop OS</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-[12px] text-silver">
            <a className="hover:text-ink transition-colors">Product</a>
            <a className="hover:text-ink transition-colors">Centers</a>
            <a className="hover:text-ink transition-colors">Pricing</a>
            <a className="hover:text-ink transition-colors">Docs</a>
            <a className="hover:text-ink transition-colors">Changelog</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => go('login')}>Sign in</Button>
            <Button size="sm" variant="primary" onClick={() => go('register')}>Open account</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative border-b border-line">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative max-w-[1320px] mx-auto px-6 py-20 lg:py-28">
          <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-6">
            <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-teal mr-2 align-middle" />
            142 service centers live across NORAM
          </div>
          <h1 className="text-[56px] lg:text-[80px] leading-[0.95] font-medium tracking-tight text-ink max-w-5xl">
            Run the service bay,<br />
            <span className="text-silver">not the spreadsheet.</span>
          </h1>
          <p className="text-[15px] text-silver mt-7 max-w-2xl leading-relaxed">
            AutoServe is the operating layer for modern automotive service centers. Live job telemetry, mechanic capacity, parts inventory and customer billing — on one terminal, for everyone in the workflow.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="primary" icon="arrow-right" onClick={() => go('register')}>Start free trial</Button>
            <Button size="lg" variant="default" icon="play" onClick={() => go('login')}>Watch the 4-min tour</Button>
            <div className="ml-3 font-mono text-[11px] text-mute tracking-wider">14-day trial · no card</div>
          </div>
        </div>

        {/* Mock dashboard tile */}
        <div className="max-w-[1320px] mx-auto px-6 pb-20">
          <div className="border border-line2 rounded-md bg-panel overflow-hidden">
            <div className="flex items-center justify-between px-5 h-11 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-danger/70" />
                <span className="w-2 h-2 rounded-full bg-warn/70" />
                <span className="w-2 h-2 rounded-full bg-teal/70" />
                <span className="font-mono text-[11px] text-mute ml-3">autoserve · sf-mission-01 · live</span>
              </div>
              <span className="font-mono text-[11px] text-silver">10:42:18 PDT</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-8 p-6 border-r border-line">
                <div className="text-[12px] text-silver mb-4">Active bays · 6 of 6 instrumented</div>
                <div className="grid grid-cols-3 gap-3">
                  {DB.bays.map(b => {
                    const s = STATUS_MAP[b.status];
                    return (
                      <div key={b.id} className="border border-line rounded-md p-3" style={{ borderColor: s?.bd }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[11px] text-silver">{b.id}</span>
                          <StatusBadge status={b.status} />
                        </div>
                        <div className="text-[12px] text-ink truncate">{b.vehicle || '— available —'}</div>
                        <div className="font-mono text-[10px] text-mute mt-1 tnum">{b.eta || '—:—'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-4 p-6 space-y-3">
                <div className="text-[12px] text-silver mb-3">Today · revenue ladder</div>
                <Sparkline data={DB.revenue30.slice(-14)} height={64} />
                <div className="grid grid-cols-2 gap-0 border border-line rounded-md overflow-hidden mt-4">
                  <div className="px-3 py-2.5 border-r border-line">
                    <div className="text-[11px] text-mute">Booked</div>
                    <div className="font-mono text-[16px] text-ink tnum">$18,420</div>
                  </div>
                  <div className="px-3 py-2.5">
                    <div className="text-[11px] text-mute">Goal</div>
                    <div className="font-mono text-[16px] text-teal tnum">$22,000</div>
                  </div>
                </div>
                <div className="border border-line rounded-md p-3 mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] text-mute">SLA today</div>
                    <div className="font-mono text-[12px] text-teal tnum">98.2%</div>
                  </div>
                  <CapacityBar value={98.2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-line">
        <div className="max-w-[1320px] mx-auto px-6 py-20">
          <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-4">Modules</div>
          <h2 className="text-[40px] leading-tight font-medium tracking-tight text-ink max-w-2xl mb-12">
            Five surfaces. One source of truth.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-line rounded-md overflow-hidden">
            {[
              { icon: 'gauge',          k: '01', t: 'Operations dashboard',  d: 'Bay occupancy, SLA, revenue, mechanic utilization in one tactical view. Refreshes every 4 seconds.' },
              { icon: 'inbox',          k: '02', t: 'Approval inbox',         d: 'Triage incoming bookings with priority and customer history. One-tap mechanic assignment.' },
              { icon: 'clipboard-list', k: '03', t: 'Job cards',              d: 'Step-by-step task lists with timestamps, parts consumption, photos and customer sign-off.' },
              { icon: 'package',        k: '04', t: 'Parts inventory',        d: 'Live stock counts, reorder triggers, supplier ledger. Auto-consume on job complete.' },
              { icon: 'receipt',        k: '05', t: 'Customer billing',       d: 'Itemized invoices issued automatically. Card on file, ACH or counter pay.' },
              { icon: 'shield-check',   k: '06', t: 'Admin command',          d: 'Regional rollout, audit log, user provisioning, SOC 2 controls. Built for multi-tenant.' },
            ].map((f, i) => (
              <div key={i} className="p-6 border-r border-b border-line">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 border border-line2 rounded-md flex items-center justify-center text-teal">
                    <Icon name={f.icon} size={16} />
                  </div>
                  <span className="font-mono text-[10px] text-mute tracking-wider">{f.k}</span>
                </div>
                <div className="text-[15px] font-medium text-ink mb-2">{f.t}</div>
                <div className="text-[12px] text-silver leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="border-b border-line bg-panel/40">
        <div className="max-w-[1320px] mx-auto px-6 py-20">
          <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-4">Who it's for</div>
          <h2 className="text-[40px] leading-tight font-medium tracking-tight text-ink max-w-2xl mb-12">
            Built for four kinds of operator.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-line rounded-md overflow-hidden">
            {[
              { r: 'Customer', icon: 'user',          d: 'Book service, track jobs in real time, pay invoices, manage your garage.' },
              { r: 'Mechanic', icon: 'wrench',        d: 'Workbench-style task list, parts requisition, on-shift dispatch from a phone.' },
              { r: 'Manager',  icon: 'gauge-circle', d: 'Floor command center: bays, mechanics, approvals, inventory, reviews.' },
              { r: 'Admin',    icon: 'shield-check',  d: 'Multi-center fleet view, audit log, user provisioning and regional SLA.' },
            ].map((x, i) => (
              <div key={i} className="p-6 border-r border-line bg-panel">
                <div className="flex items-center gap-2.5 mb-4">
                  <Icon name={x.icon} size={14} className="text-teal" />
                  <span className="text-[14px] font-medium text-ink">{x.r}</span>
                </div>
                <div className="text-[12px] text-silver leading-relaxed">{x.d}</div>
                <button onClick={() => go('login')} className="text-[12px] text-teal mt-5 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                  View workspace <Icon name="arrow-right" size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-line">
        <div className="max-w-[1320px] mx-auto px-6 py-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-teal uppercase mb-4">Ready</div>
            <h2 className="text-[44px] leading-[1] font-medium tracking-tight text-ink max-w-2xl">
              Spin up a center<br />in 12 minutes.
            </h2>
            <p className="text-[13px] text-silver mt-5 max-w-lg">Onboarding wizard handles bays, mechanics, services and inventory seed in one pass.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="primary" icon="arrow-right" onClick={() => go('register')}>Open account</Button>
            <Button size="lg" variant="default" onClick={() => go('login')}>Sign in</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-[1320px] mx-auto px-6 py-6 flex items-center justify-between font-mono text-[11px] text-mute tracking-wider uppercase">
          <span>© 2026 AutoServe Systems</span>
          <span>San Francisco · Berlin · Singapore</span>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ go, onAuth }) {
  const [role, setRole] = pUseState('customer');
  return (
    <AuthShell>
      <AuthHeader kicker="Sign in" title="Welcome back." subtitle="Continue to your AutoServe workspace." />

      <div className="mb-5">
        <div className="text-[12px] text-silver mb-2">Continue as</div>
        <div className="grid grid-cols-4 gap-0 border border-line2 rounded-md overflow-hidden">
          {[
            { id: 'customer', label: 'Customer', icon: 'user' },
            { id: 'manager',  label: 'Manager',  icon: 'gauge-circle' },
            { id: 'mechanic', label: 'Mechanic', icon: 'wrench' },
            { id: 'admin',    label: 'Admin',    icon: 'shield-check' },
          ].map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} className={`flex flex-col items-center gap-1.5 py-3 border-r border-line last:border-r-0 transition-colors ${role === r.id ? 'bg-ink text-obsidian' : 'text-silver hover:text-ink hover:bg-white/[0.04]'}`}>
              <Icon name={r.icon} size={14} />
              <span className="text-[11px]">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuth(role); }}>
        <Field label="Email">
          <Input icon="mail" type="email" placeholder={`you@${role === 'customer' ? 'protonmail.com' : 'autoserve.io'}`} defaultValue={DB.user[role].email} />
        </Field>
        <Field label="Password" hint={<button type="button" onClick={() => go('forgot')} className="hover:text-teal transition-colors">Forgot?</button>}>
          <Input icon="lock" type="password" defaultValue="••••••••••••" />
        </Field>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <span className="w-4 h-4 border border-line2 rounded-xs bg-panel2 flex items-center justify-center">
            <Icon name="check" size={10} className="text-teal" />
          </span>
          <span className="text-[12px] text-silver">Keep me signed in on this device</span>
        </label>

        <Button variant="primary" size="lg" icon="arrow-right" className="w-full mt-2" type="submit">
          Sign in to {role === 'customer' ? 'My Garage' : role === 'manager' ? 'Operations' : role === 'mechanic' ? 'Workbench' : 'Command'}
        </Button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-line flex-1" />
          <span className="font-mono text-[10px] text-mute tracking-wider uppercase">or</span>
          <div className="h-px bg-line flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" icon="github">GitHub</Button>
          <Button variant="default" icon="chrome">Google</Button>
        </div>
      </form>

      <div className="text-[12px] text-silver mt-8 text-center">
        New to AutoServe? <button onClick={() => go('register')} className="text-teal hover:underline">Open an account →</button>
      </div>
    </AuthShell>
  );
}

function RegisterPage({ go, onAuth }) {
  const [role, setRole] = pUseState('customer');
  return (
    <AuthShell>
      <AuthHeader kicker="Open account" title="Create your AutoServe account." subtitle="Two minutes to set up. No card required for trial." />

      <div className="mb-5">
        <div className="text-[12px] text-silver mb-2">I am a</div>
        <div className="grid grid-cols-2 gap-0 border border-line2 rounded-md overflow-hidden">
          {[
            { id: 'customer', label: 'Vehicle owner', sub: 'Book service · track jobs', icon: 'user' },
            { id: 'manager',  label: 'Center operator',sub: 'Run a service center',     icon: 'gauge-circle' },
          ].map(r => (
            <button key={r.id} onClick={() => setRole(r.id)} className={`text-left p-3.5 border-r border-line last:border-r-0 transition-colors ${role === r.id ? 'bg-ink text-obsidian' : 'text-silver hover:text-ink hover:bg-white/[0.04]'}`}>
              <Icon name={r.icon} size={14} />
              <div className="text-[13px] font-medium mt-1.5">{r.label}</div>
              <div className={`text-[11px] mt-0.5 ${role === r.id ? 'text-obsidian/70' : 'text-mute'}`}>{r.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuth(role); }}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name"><Input placeholder="Marcus" /></Field>
          <Field label="Last name"><Input placeholder="Holloway" /></Field>
        </div>
        <Field label="Email" hint="we'll send a verification link">
          <Input icon="mail" type="email" placeholder="you@email.com" />
        </Field>
        <Field label="Password" hint="min 12 chars · 1 number · 1 symbol">
          <Input icon="lock" type="password" placeholder="••••••••••••" />
        </Field>

        {role === 'manager' && (
          <Field label="Service center name">
            <Input icon="building-2" placeholder="e.g. SF · Mission" />
          </Field>
        )}

        <label className="flex items-start gap-2.5 cursor-pointer mt-2">
          <span className="w-4 h-4 mt-0.5 border border-line2 rounded-xs bg-panel2 flex items-center justify-center shrink-0">
            <Icon name="check" size={10} className="text-teal" />
          </span>
          <span className="text-[11px] text-silver leading-snug">I agree to the <a className="text-teal hover:underline">Terms of Service</a> and acknowledge the <a className="text-teal hover:underline">Privacy Policy</a>. AutoServe is SOC 2 Type II certified.</span>
        </label>

        <Button variant="primary" size="lg" icon="arrow-right" className="w-full mt-2" type="submit">Create account</Button>
      </form>

      <div className="text-[12px] text-silver mt-8 text-center">
        Already have an account? <button onClick={() => go('login')} className="text-teal hover:underline">Sign in →</button>
      </div>
    </AuthShell>
  );
}

function ForgotPasswordPage({ go }) {
  const [sent, setSent] = pUseState(false);
  return (
    <AuthShell>
      <AuthHeader kicker="Account recovery" title="Reset your password." subtitle="Enter the email associated with your account. We'll send a one-time link." />

      {!sent ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <Field label="Email">
            <Input icon="mail" type="email" placeholder="you@email.com" autoFocus />
          </Field>
          <Button variant="primary" size="lg" icon="send" className="w-full" type="submit">Send reset link</Button>
        </form>
      ) : (
        <div className="border border-teal/30 bg-teal/[0.06] rounded-md p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 border border-teal/40 bg-teal/10 rounded-md flex items-center justify-center text-teal shrink-0">
              <Icon name="mail-check" size={16} />
            </div>
            <div>
              <div className="text-[13px] font-medium text-ink mb-1">Check your inbox</div>
              <div className="text-[12px] text-silver leading-relaxed">If an account exists for that address, we've sent a link valid for 30 minutes. Don't see it? Check spam or <button onClick={() => setSent(false)} className="text-teal hover:underline">try another address</button>.</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-line pt-5 space-y-2">
        <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-2">Other options</div>
        <button className="flex items-center justify-between w-full text-left text-[12px] text-silver hover:text-ink py-1.5 group">
          <span className="flex items-center gap-2"><Icon name="message-square" size={13} /> Text me a recovery code</span>
          <Icon name="arrow-right" size={11} className="opacity-0 group-hover:opacity-100" />
        </button>
        <button className="flex items-center justify-between w-full text-left text-[12px] text-silver hover:text-ink py-1.5 group">
          <span className="flex items-center gap-2"><Icon name="key" size={13} /> Use a security key (WebAuthn)</span>
          <Icon name="arrow-right" size={11} className="opacity-0 group-hover:opacity-100" />
        </button>
        <button className="flex items-center justify-between w-full text-left text-[12px] text-silver hover:text-ink py-1.5 group">
          <span className="flex items-center gap-2"><Icon name="life-buoy" size={13} /> Talk to support</span>
          <Icon name="arrow-right" size={11} className="opacity-0 group-hover:opacity-100" />
        </button>
      </div>

      <div className="text-[12px] text-silver mt-8 text-center">
        Remembered? <button onClick={() => go('login')} className="text-teal hover:underline">Back to sign in</button>
      </div>
    </AuthShell>
  );
}

function ResetPasswordPage({ go }) {
  const [pwd, setPwd] = pUseState('');
  const [pwd2, setPwd2] = pUseState('');
  const checks = [
    { label: '12 characters minimum',  ok: pwd.length >= 12 },
    { label: 'One number',             ok: /\d/.test(pwd) },
    { label: 'One symbol',             ok: /[^\w\s]/.test(pwd) },
    { label: 'Matches confirmation',   ok: pwd.length > 0 && pwd === pwd2 },
  ];
  const allOk = checks.every(c => c.ok);

  return (
    <AuthShell>
      <AuthHeader kicker="One-time link · 28m remaining" title="Set a new password." subtitle="Choose something strong. We'll sign you in once it's saved." />

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (allOk) go('login'); }}>
        <Field label="New password">
          <Input icon="lock" type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••••••" />
        </Field>
        <Field label="Confirm new password">
          <Input icon="lock-keyhole" type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} placeholder="••••••••••••" />
        </Field>

        <div className="border border-line2 rounded-md p-4 bg-panel2 space-y-2">
          <div className="text-[11px] text-mute uppercase tracking-wider font-mono mb-1.5">Strength</div>
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[12px]">
              <span className={`w-4 h-4 border rounded-xs flex items-center justify-center ${c.ok ? 'bg-teal/15 border-teal/40' : 'border-line2 bg-panel'}`}>
                {c.ok ? <Icon name="check" size={10} className="text-teal" /> : <span className="w-1 h-1 rounded-full bg-mute" />}
              </span>
              <span className={c.ok ? 'text-ink' : 'text-silver'}>{c.label}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" size="lg" icon="check" className="w-full mt-2" type="submit" disabled={!allOk}>
          Save and sign in
        </Button>
      </form>

      <div className="text-[12px] text-silver mt-8 text-center">
        Need a fresh link? <button onClick={() => go('forgot')} className="text-teal hover:underline">Request again</button>
      </div>
    </AuthShell>
  );
}

Object.assign(window, { LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage });
