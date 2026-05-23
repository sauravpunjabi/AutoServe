import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { Users } from 'lucide-react';
import {
  SectionLabel,
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  SuccessTextButton,
  DangerTextButton,
} from '../../components/ui/primitives';

export default function ManagerMechanics() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMechanics = async () => {
    if (!centerId) return;
    try {
      const res = await api.get(`/service-centers/${centerId}/mechanics`);
      setMechanics(res.data.data || []);
    } catch {
      toast.error('Failed to load mechanics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!centerLoading && centerId) fetchMechanics();
    else if (!centerLoading) setLoading(false);
  }, [centerId, centerLoading]);

  const updateStatus = async (userId: string, status: 'active' | 'rejected') => {
    setUpdatingId(userId);
    try {
      await api.patch(`/service-centers/${centerId}/mechanics/${userId}`, { status });
      toast.success(`Mechanic ${status}`);
      fetchMechanics();
    } catch {
      toast.error('Failed to update mechanic');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || centerLoading) {
    return (
      <AppLayout title="Mechanics" subtitle="Approve and manage your team." navLinks={managerNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  if (!centerId) {
    return (
      <AppLayout title="Mechanics" subtitle="Approve and manage your team." navLinks={managerNav}>
        <EmptyState
          icon={Users}
          title="No service center"
          description="Create a service center first."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </AppLayout>
    );
  }

  const pending = mechanics.filter((m) => m.status === 'pending');
  const active = mechanics.filter((m) => m.status === 'active');

  const MechanicCells = ({ m, showActions }: { m: any; showActions?: boolean }) => (
    <>
      <td style={tdStyle}>{m.name}</td>
      <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{m.email}</td>
      <td style={tdStyle}>
        <StatusBadge status={m.status} />
      </td>
      {showActions && (
        <td style={{ ...tdStyle, textAlign: 'right' }}>
          <SuccessTextButton
            onClick={() => updateStatus(m.id, 'active')}
            disabled={updatingId === m.id}
          >
            {updatingId === m.id ? 'Updating…' : 'Approve'}
          </SuccessTextButton>
          <DangerTextButton
            onClick={() => updateStatus(m.id, 'rejected')}
            disabled={updatingId === m.id}
          >
            Reject
          </DangerTextButton>
        </td>
      )}
    </>
  );

  return (
    <AppLayout title="Mechanics" subtitle="Approve and manage your team." navLinks={managerNav}>
      <section style={{ marginBottom: '32px' }}>
        <SectionLabel>Pending approval</SectionLabel>
        {pending.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No pending requests.</p>
        ) : (
          <TableWrap>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((m) => (
                  <TableRow key={m.id}>
                    <MechanicCells m={m} showActions />
                  </TableRow>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </section>

      <section>
        <SectionLabel>Active mechanics</SectionLabel>
        {active.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No active mechanics yet.</p>
        ) : (
          <TableWrap>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {active.map((m) => (
                  <TableRow key={m.id}>
                    <MechanicCells m={m} />
                  </TableRow>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </section>
    </AppLayout>
  );
}
