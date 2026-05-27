import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import {
  Card,
  SectionLabel,
  SecondaryButton,
  TextSelect,
  StatusBadge,
  Skeleton,
  SkeletonText,
} from '../../components/ui';
import { ArrowLeft } from 'lucide-react';

const TASK_CYCLE: Record<string, string> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
};

const listItemStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '12px 0',
  borderBottom: '1px solid var(--border-subtle)',
};

export default function MechanicJobCardDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [updatingJob, setUpdatingJob] = useState(false);

  const fetchJob = async () => {
    const res = await api.get(`/job-cards/${id}`);
    setJob(res.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchJob();
      } catch {
        toast.error('Failed to load job card');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const cycleTaskStatus = async (task: { id: string; status: string }) => {
    const next = TASK_CYCLE[task.status] || 'in_progress';
    setUpdatingTask(task.id);
    try {
      await api.patch(`/job-cards/tasks/${task.id}/status`, { status: next });
      toast.success('Task updated');
      await fetchJob();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setUpdatingTask(null);
    }
  };

  const updateJobStatus = async (status: string) => {
    setUpdatingJob(true);
    try {
      await api.patch(`/job-cards/${id}/status`, { status });
      toast.success('Job status updated');
      await fetchJob();
    } catch {
      toast.error('Failed to update job status');
    } finally {
      setUpdatingJob(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Job card" subtitle="Job details." navLinks={mechanicNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="120px" height="14px" />
              <SkeletonText lines={3} />
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="100px" height="14px" />
              <SkeletonText lines={4} />
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout title="Job card" subtitle="Job details." navLinks={mechanicNav}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Job card not found.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Job card" subtitle={`#${id?.slice(0, 8)}`} navLinks={mechanicNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Link
          to="/mechanic/job-cards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          Back to job cards
        </Link>

        <Card style={{ marginBottom: '24px' }}>
          <SectionLabel>Vehicle & service</SectionLabel>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-primary)' }}>
            {job.year} {job.make} {job.model} · {job.license_plate}
          </p>
          {Array.isArray(job.services) && job.services.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
              {job.services.map((s: any, i: number) => (
                <span
                  key={s.id || i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    backgroundColor: 'var(--accent-subtle)',
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{job.service_type}</p>
          )}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <StatusBadge status={job.status} />
            <TextSelect
              value={job.status}
              disabled={updatingJob}
              onChange={(e) => updateJobStatus(e.target.value)}
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </TextSelect>
          </div>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <SectionLabel>Tasks</SectionLabel>
          {(job.tasks || []).length === 0 ? (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>No tasks assigned yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {(job.tasks || []).map((t: any) => (
                <li key={t.id} style={listItemStyle}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{t.description}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={t.status} />
                    <SecondaryButton
                      disabled={updatingTask === t.id}
                      onClick={() => cycleTaskStatus(t)}
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      {updatingTask === t.id ? 'Updating…' : 'Toggle status'}
                    </SecondaryButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <SectionLabel>Parts used</SectionLabel>
          {(job.parts || []).length === 0 ? (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>No parts recorded.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {(job.parts || []).map((p: any) => (
                <li key={p.id} style={listItemStyle}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.part_name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Qty {p.quantity_used}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
