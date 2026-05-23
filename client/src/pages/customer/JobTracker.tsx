import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import { Card, SectionLabel, TextLink } from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { CheckCircle, Clock, Wrench, Package, Briefcase } from 'lucide-react';

const STEPS = [
  { key: 'created', title: 'Vehicle dropped off', desc: 'Your vehicle has been checked in and a job card is created.', icon: Clock },
  { key: 'in_progress', title: 'Service in progress', desc: 'Our mechanics are currently working on your vehicle.', icon: Wrench },
  { key: 'completed', title: 'Ready for pickup', desc: 'Service is fully completed and your vehicle is ready to go.', icon: CheckCircle },
];

export default function CustomerJobTracker() {
  const { id } = useParams();
  const [jobCard, setJobCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/job-cards/${id}`);
        setJobCard(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <AppLayout
        title="Job tracker"
        subtitle="Real-time status of your vehicle's service."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  if (!jobCard) {
    return (
      <AppLayout
        title="Job tracker"
        subtitle="Real-time status of your vehicle's service."
        navLinks={customerNav}
      >
        <EmptyState
          icon={Briefcase}
          title="Job card not found"
          description="This job may not exist or you may not have access."
          actionLabel="Back to appointments"
          actionTo="/customer/bookings"
        />
      </AppLayout>
    );
  }

  const steps = ['created', 'in_progress', 'completed'];
  const currentStepIndex = steps.indexOf(jobCard.status);

  return (
    <AppLayout
      title={`Tracking job #${id?.slice(0, 8)}`}
      subtitle="Real-time status of your vehicle's service."
      navLinks={customerNav}
    >
      <div style={{ marginBottom: '24px' }}>
        <TextLink to="/customer/bookings">← Back to appointments</TextLink>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <p style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Service progress
            </p>

            <div style={{ position: 'relative', paddingLeft: '8px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '19px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  backgroundColor: 'var(--border)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '19px',
                  top: '12px',
                  width: '2px',
                  backgroundColor: 'var(--accent)',
                  height:
                    currentStepIndex <= 0
                      ? '10%'
                      : currentStepIndex === 1
                        ? '50%'
                        : '100%',
                  transition: 'height 0.5s ease',
                }}
              />

              <ul style={{ margin: 0, padding: 0, listStyle: 'none', position: 'relative' }}>
                {STEPS.map((step, index) => {
                  const done = currentStepIndex >= index;
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.key}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: index < STEPS.length - 1 ? '32px' : 0,
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: done ? 'var(--accent)' : 'var(--bg-hover)',
                          border: `2px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
                          color: done ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div style={{ paddingTop: '4px' }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: done ? 'var(--text-primary)' : 'var(--text-muted)',
                          }}
                        >
                          {step.title}
                        </p>
                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>

          <Card>
            <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Service tasks
            </p>
            {!jobCard.tasks || jobCard.tasks.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  padding: '24px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                No specific tasks added yet.
              </p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {jobCard.tasks.map((task: any, i: number) => (
                  <li
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom:
                        i < jobCard.tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {task.task_description}
                    </span>
                    <StatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <SectionLabel>Mechanic notes</SectionLabel>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {jobCard.notes || 'No notes provided yet.'}
            </p>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Package size={14} color="var(--text-muted)" />
              <SectionLabel>Used parts</SectionLabel>
            </div>
            {!jobCard.parts || jobCard.parts.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>No parts required.</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {jobCard.parts.map((p: any, i: number) => (
                  <li
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      padding: '8px 0',
                      borderBottom:
                        i < jobCard.parts.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.part_name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Qty: {p.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
