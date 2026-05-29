import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  SectionLabel,
  TextInput,
  TextSelect,
  PrimaryButton,
  SecondaryButton,
  Mono,
  StatusBadge,
  Skeleton,
  SkeletonText,
} from '../../components/ui';

export default function ManagerJobCardDetail() {
  const { id } = useParams();
  const { centerId } = useManagerCenter();
  const [job, setJob] = useState<any>(null);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDesc, setTaskDesc] = useState('');
  const [partId, setPartId] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [laborCost, setLaborCost] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);
  const [submittingPart, setSubmittingPart] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [submittingMechanic, setSubmittingMechanic] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const fetchJob = async () => {
    const res = await api.get(`/job-cards/${id}`);
    setJob(res.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchJob();
        if (centerId) {
          const [mechRes, invRes] = await Promise.all([
            api.get(`/service-centers/${centerId}/mechanics`),
            api.get(`/inventory/${centerId}`),
          ]);
          setMechanics((mechRes.data.data || []).filter((m: any) => m.status === 'active'));
          setInventory(invRes.data.data || []);
        }
      } catch {
        toast.error('Failed to load job card');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, centerId]);

  const assignMechanic = async (mechanicId: string) => {
    setSubmittingMechanic(true);
    try {
      await api.patch(`/job-cards/${id}/mechanic`, { mechanic_id: mechanicId });
      toast.success('Mechanic assigned');
      fetchJob();
    } catch {
      toast.error('Failed to assign mechanic');
    } finally {
      setSubmittingMechanic(false);
    }
  };

  const updateJobStatus = async (status: string) => {
    setSubmittingStatus(true);
    try {
      await api.patch(`/job-cards/${id}/status`, { status });
      toast.success('Status updated');
      fetchJob();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;
    setSubmittingTask(true);
    try {
      await api.post(`/job-cards/${id}/tasks`, { description: taskDesc });
      toast.success('Task added');
      setTaskDesc('');
      await fetchJob();
    } catch {
      toast.error('Failed to add task');
    } finally {
      setSubmittingTask(false);
    }
  };

  const addPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId || !centerId) return;
    setSubmittingPart(true);
    try {
      await api.post(`/inventory/job-parts/${id}`, {
        part_id: partId,
        quantity_used: partQty,
        service_center_id: centerId,
      });
      toast.success('Part added');
      setPartId('');
      setPartQty(1);
      await fetchJob();
      const invRes = await api.get(`/inventory/${centerId}`);
      setInventory(invRes.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add part');
    } finally {
      setSubmittingPart(false);
    }
  };

  const generateInvoice = async () => {
    setSubmittingInvoice(true);
    try {
      await api.post('/misc/invoices', {
        job_card_id: id,
        booking_id: job.booking_id,
        customer_id: job.customer_id,
        labor_cost: Number(laborCost) || 0,
      });
      toast.success('Invoice generated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setSubmittingInvoice(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Job card" subtitle="Job details." navLinks={managerNav}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="100px" height="14px" />
              <SkeletonText lines={4} />
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="120px" height="14px" />
              <SkeletonText lines={3} />
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout title="Job card" subtitle="Job details." navLinks={managerNav}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Job card not found.</p>
      </AppLayout>
    );
  }

  const rowDivider: React.CSSProperties = {
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    fontSize: '13px',
  };

  return (
    <AppLayout title="Job card" subtitle={`#${id?.slice(0, 8)}`} navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Link
          to="/manager/job-cards"
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
          <ArrowLeft size={16} />
          Back to job cards
        </Link>

        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <SectionLabel>Booking ref</SectionLabel>
              <Mono>{job.booking_id?.slice(0, 8)}</Mono>
              <p style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                {job.year} {job.make} {job.model} · {job.license_plate}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {job.customer_name}
              </p>
              {Array.isArray(job.services) && job.services.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  {job.services.map((s: any) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        padding: '3px 0',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span>{s.name}</span>
                      <span style={{ fontFamily: 'Geist Mono, monospace' }}>
                        ₹{Number(s.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <TextSelect
              value={job.mechanic_id || ''}
              disabled={submittingMechanic}
              onChange={(e) => e.target.value && assignMechanic(e.target.value)}
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="">Assign mechanic</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </TextSelect>
            <TextSelect
              value={job.status}
              disabled={submittingStatus}
              onChange={(e) => updateJobStatus(e.target.value)}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </TextSelect>
            {(submittingMechanic || submittingStatus) && (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                Updating…
              </span>
            )}
          </div>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <SectionLabel>Tasks</SectionLabel>
          <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0 }}>
            {(job.tasks || []).map((t: any) => (
              <li key={t.id} style={rowDivider}>
                <span style={{ color: 'var(--text-primary)' }}>{t.description}</span>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
          <form onSubmit={addTask} style={{ display: 'flex', gap: '8px' }}>
            <TextInput
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="New task description"
              style={{ flex: 1 }}
            />
            <PrimaryButton type="submit" disabled={submittingTask}>
              {submittingTask ? 'Adding…' : 'Add'}
            </PrimaryButton>
          </form>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <SectionLabel>Parts used</SectionLabel>
          <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0 }}>
            {(job.parts || []).map((p: any) => (
              <li key={p.id} style={rowDivider}>
                <span style={{ color: 'var(--text-primary)' }}>{p.part_name}</span>
                <span style={{ color: 'var(--text-muted)' }}>Qty {p.quantity_used}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={addPart} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <TextSelect
              value={partId}
              onChange={(e) => setPartId(e.target.value)}
              style={{ flex: '1 1 200px' }}
            >
              <option value="">Select part</option>
              {inventory.map((i) => (
                <option key={i.part_id} value={i.part_id}>
                  {i.name} (stock: {i.quantity})
                </option>
              ))}
            </TextSelect>
            <TextInput
              type="number"
              min={1}
              value={partQty}
              onChange={(e) => setPartQty(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <SecondaryButton type="submit" disabled={submittingPart}>
              {submittingPart ? 'Adding…' : 'Add part'}
            </SecondaryButton>
          </form>
        </Card>

        {job.status === 'completed' && (
          <Card>
            <SectionLabel>Generate invoice</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <TextInput
                type="number"
                placeholder="Labor cost"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
                style={{ width: '160px' }}
              />
              <PrimaryButton type="button" onClick={generateInvoice} disabled={submittingInvoice}>
                {submittingInvoice ? 'Generating…' : 'Generate invoice'}
              </PrimaryButton>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
