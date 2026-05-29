import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import {
  KpiStrip,
  KpiCell,
  Panel,
  EmptyState,
  StatusBadge,
  SkeletonStatCard,
  Mono,
  PrimaryButton,
  GhostButton,
  CapacityBar,
} from '../../components/ui';
import { Briefcase, Check, Play, Paperclip, MessageSquare, PauseCircle } from 'lucide-react';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Job Card Item ────────────────────────────────────────────────────────────
function JobCardItem({ job, active, onSelect }: { job: any; active: boolean; onSelect: () => void }) {
  const progress = job.tasks?.length > 0
    ? Math.round((job.tasks.filter((t: any) => t.status === 'completed').length / job.tasks.length) * 100)
    : 0;

  return (
    <button
      onClick={onSelect}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '14px 16px',
        background: active ? 'var(--accent-subtle)' : 'transparent',
        borderTop: 'none', borderRight: 'none',
        borderBottom: '1px solid var(--border)',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer', transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <Mono style={{ fontSize: 12, color: 'var(--text-primary)' }}>{job.id?.slice(0, 12)}</Mono>
        <StatusBadge status={job.status} />
      </div>
      <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {job.year} {job.make} {job.model}
      </p>
      <Mono style={{ fontSize: 11, display: 'block', marginBottom: 10 }}>
        {job.license_plate || '—'} · {job.customer_name || 'Customer'}
      </Mono>

      {job.status === 'in_progress' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
            <Mono style={{ fontSize: 11, color: 'var(--text-primary)' }}>{progress}%</Mono>
          </div>
          <CapacityBar value={progress} color="var(--accent)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {fmtDate(job.booking_date)}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {job.time_slot}
            </span>
          </div>
        </>
      )}
      {job.status !== 'in_progress' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{fmtDate(job.booking_date)} · {job.time_slot}</span>
        </div>
      )}
    </button>
  );
}

// ─── Active Job Workspace ─────────────────────────────────────────────────────
function ActiveJobWorkspace({ job, onTaskUpdate }: { job: any; onTaskUpdate: (jobId: string, taskId: string, status: string) => void }) {
  const [notes, setNotes] = useState('');
  const tasks = job.tasks || [];
  const completed = tasks.filter((t: any) => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const handleComplete = async (taskId: string) => {
    try {
      await api.patch(`/job-cards/tasks/${taskId}/status`, { status: 'completed' });
      onTaskUpdate(job.id, taskId, 'completed');
    } catch (err) { console.error(err); }
  };

  const handleStart = async (taskId: string) => {
    try {
      await api.patch(`/job-cards/tasks/${taskId}/status`, { status: 'in_progress' });
      onTaskUpdate(job.id, taskId, 'in_progress');
    } catch (err) { console.error(err); }
  };

  return (
    <Panel
      title={`${job.year} ${job.make} ${job.model}`}
      subtitle={
        <span>
          <Mono style={{ fontSize: 12 }}>{job.id?.slice(0, 12)}</Mono>
          {' · '}Customer {job.customer_name}
          {' · '}Booked {fmtDate(job.booking_date)}
        </span>
      }
      action={
        <div style={{ display: 'flex', gap: 6 }}>
          <GhostButton style={{ height: 28, padding: '0 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageSquare size={12} strokeWidth={1.5} />Notify
          </GhostButton>
          <button style={{ height: 28, padding: '0 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--warning)', borderRadius: 6, color: 'var(--warning)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <PauseCircle size={12} strokeWidth={1.5} />Pause
          </button>
        </div>
      }
      noPad
    >
      {/* Sub-header strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Plate', value: job.license_plate || '—', mono: true },
          { label: 'VIN', value: job.vin || '—', mono: true },
          { label: 'Odometer', value: job.mileage ? `${Number(job.mileage).toLocaleString()} mi` : '—', mono: false },
          { label: 'Progress', progress: true },
        ].map((item, i) => (
          <div key={item.label} style={{ padding: '12px 16px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</p>
            {item.progress ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mono style={{ fontSize: 13, color: 'var(--accent)' }}>{progress}%</Mono>
                <div style={{ flex: 1 }}><CapacityBar value={progress} color="var(--accent)" /></div>
              </div>
            ) : item.mono ? (
              <Mono style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.value}</Mono>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)' }}>{item.value}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}>
        {/* Task checklist */}
        <div style={{ borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '0 16px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Task sequence</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              <Mono style={{ fontSize: 11 }}>{completed}</Mono> of <Mono style={{ fontSize: 11 }}>{tasks.length}</Mono> complete
            </span>
          </div>
          {tasks.length === 0 ? (
            <div style={{ padding: 20 }}>
              <EmptyState icon={Briefcase} title="No tasks defined" description="Tasks will appear here once the manager creates them." />
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {tasks.map((t: any, i: number) => {
                const done = t.status === 'completed';
                const inProg = t.status === 'in_progress';
                return (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      background: inProg ? 'rgba(59,130,246,0.04)' : 'transparent',
                    }}
                  >
                    <Mono style={{ fontSize: 11, color: 'var(--text-muted)', width: 24, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </Mono>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `1px solid ${done ? 'var(--accent)' : inProg ? 'var(--info)' : 'var(--border-strong)'}`,
                      background: done ? 'rgba(16,185,129,0.1)' : inProg ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done && <Check size={12} color="var(--accent)" strokeWidth={2.5} />}
                      {inProg && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--info)', display: 'block' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, color: done ? 'var(--text-secondary)' : inProg ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                        {t.title || t.description || `Task ${i + 1}`}
                      </p>
                      {t.created_at && (
                        <Mono style={{ fontSize: 11, display: 'block', marginTop: 2, color: 'var(--text-muted)' }}>
                          {done ? `Completed` : inProg ? 'In progress' : 'Pending'}
                        </Mono>
                      )}
                    </div>
                    {inProg ? (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button style={{ height: 28, padding: '0 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Paperclip size={11} strokeWidth={1.5} />Attach
                        </button>
                        <PrimaryButton onClick={() => handleComplete(t.id)} style={{ height: 28, padding: '0 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={11} strokeWidth={2.5} />Done
                        </PrimaryButton>
                      </div>
                    ) : done ? (
                      <StatusBadge status="completed" />
                    ) : (
                      <button
                        onClick={() => handleStart(t.id)}
                        style={{ height: 28, padding: '0 10px', fontSize: 11, background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
                      >
                        <Play size={11} strokeWidth={1.5} />Start
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Parts + Notes */}
        <div>
          <div style={{ padding: '0 16px', height: 44, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Parts drawn</span>
          </div>
          {job.parts?.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {job.parts.map((p: any) => (
                <li key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ minWidth: 0 }}>
                    <Mono style={{ fontSize: 12, color: 'var(--text-primary)', display: 'block' }}>{p.part_name || p.name}</Mono>
                  </div>
                  <Mono style={{ fontSize: 13, color: 'var(--text-primary)', flexShrink: 0 }}>×{p.quantity_used || p.quantity}</Mono>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>No parts drawn yet.</p>
          )}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <Link to={`/mechanic/job-cards/${job.id}`}>
              <button style={{ width: '100%', height: 32, border: '1px solid var(--border-strong)', borderRadius: 6, background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
                + Draw part
              </button>
            </Link>
          </div>

          <div style={{ padding: '0 16px', height: 44, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Notes</span>
          </div>
          <div style={{ padding: 16 }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add diagnostic notes…"
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--text-primary)',
                fontFamily: 'Geist, sans-serif', resize: 'none', outline: 'none',
                boxSizing: 'border-box', lineHeight: 1.5,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <Mono style={{ fontSize: 11, color: 'var(--text-muted)' }}>{notes.length}/2000</Mono>
              <button style={{ height: 26, padding: '0 8px', fontSize: 11, background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function MechanicDashboard() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [detailMap, setDetailMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job-cards');
        const jobs = res.data.data || [];
        setJobCards(jobs);
        const inProg = jobs.find((j: any) => j.status === 'in_progress') || jobs[0];
        if (inProg) setActiveJobId(inProg.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch detail for active job
  useEffect(() => {
    if (!activeJobId || detailMap[activeJobId]) return;
    api.get(`/job-cards/${activeJobId}`)
      .then((res) => setDetailMap((m) => ({ ...m, [activeJobId]: res.data.data })))
      .catch(console.error);
  }, [activeJobId]);

  const handleTaskUpdate = (jobId: string, taskId: string, status: string) => {
    setDetailMap((m) => {
      const job = m[jobId];
      if (!job) return m;
      return {
        ...m,
        [jobId]: {
          ...job,
          tasks: job.tasks.map((t: any) => t.id === taskId ? { ...t, status } : t),
        },
      };
    });
  };

  const inProgress = jobCards.filter((j) => j.status === 'in_progress').length;
  const completed = jobCards.filter((j) => j.status === 'completed').length;
  const activeJob = activeJobId ? (detailMap[activeJobId] || jobCards.find((j) => j.id === activeJobId)) : null;

  if (loading) {
    return (
      <AppLayout title="Dashboard" subtitle="Your assigned work at a glance." navLinks={mechanicNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
            <div style={{ height: 420, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
            <div style={{ height: 420, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Workbench" subtitle="Your assigned job cards and active workspace." navLinks={mechanicNav}>
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI strip */}
        <KpiStrip cols={4} style={{ marginBottom: 0 }}>
          <KpiCell label="Assigned jobs" value={jobCards.length} sub="Total assigned" />
          <KpiCell label="In progress" value={inProgress} sub="Currently active" accent={inProgress > 0 ? 'var(--accent)' : undefined} />
          <KpiCell label="Completed" value={completed} sub="Finished jobs" accent={completed > 0 ? 'var(--success)' : undefined} />
          <KpiCell label="Pending" value={jobCards.length - inProgress - completed} sub="Queued up" />
        </KpiStrip>

        {/* Job card rail + active workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Rail */}
          <Panel title="My job cards" subtitle={`${jobCards.length} assigned`} noPad>
            {jobCards.length === 0 ? (
              <EmptyState icon={Briefcase} title="No jobs assigned" description="Job cards assigned to you will appear here." />
            ) : (
              <>
                <div>
                  {jobCards.map((j) => (
                    <JobCardItem
                      key={j.id}
                      job={j}
                      active={activeJobId === j.id}
                      onSelect={() => setActiveJobId(j.id)}
                    />
                  ))}
                </div>
                <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
                  <Link to="/mechanic/job-cards" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', height: 32, border: '1px solid var(--border-strong)', borderRadius: 6, background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
                      View completed →
                    </button>
                  </Link>
                </div>
              </>
            )}
          </Panel>

          {/* Workspace */}
          {activeJob ? (
            <ActiveJobWorkspace job={activeJob} onTaskUpdate={handleTaskUpdate} />
          ) : (
            <Panel title="No job selected" subtitle="Select a job card from the left to start working.">
              <EmptyState icon={Briefcase} title="Select a job" description="Click a job card on the left to open the workspace." />
            </Panel>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
