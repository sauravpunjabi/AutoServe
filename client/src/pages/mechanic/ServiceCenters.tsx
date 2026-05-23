import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import StatusBadge from '../../components/ui/StatusBadge';
import { Card, PrimaryButton } from '../../components/ui/primitives';
import { Building2 } from 'lucide-react';

export default function MechanicServiceCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [centersRes, meRes] = await Promise.all([
          api.get('/service-centers'),
          api.get('/auth/me'),
        ]);
        setCenters(centersRes.data.data || []);
        setProfile(meRes.data.data ?? meRes.data);
      } catch {
        toast.error('Failed to load centers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const requestJoin = async (centerId: string) => {
    setJoiningId(centerId);
    try {
      await api.post(`/service-centers/${centerId}/join`);
      toast.success('Join request sent');
      const meRes = await api.get('/auth/me');
      setProfile(meRes.data.data ?? meRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Service centers" subtitle="Find a center to join." navLinks={mechanicNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  const joinedCenterId = profile?.service_center_id;

  return (
    <AppLayout title="Service centers" subtitle="Find a center to join." navLinks={mechanicNav}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {centers.map((c) => {
          const isJoined = joinedCenterId === c.id;
          const isPending = isJoined && profile?.status === 'pending';
          const isActive = isJoined && profile?.status === 'active';

          return (
            <Card key={c.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Building2 size={20} color="var(--text-muted)" strokeWidth={1.5} />
                {isActive && <StatusBadge status="active" />}
                {isPending && <StatusBadge status="pending" />}
              </div>
              <h3
                style={{
                  margin: '12px 0 4px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {c.name}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{c.address}</p>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Rating: {Number(c.average_rating).toFixed(1)} / 5
              </p>
              {!joinedCenterId && (
                <div style={{ marginTop: '16px' }}>
                  <PrimaryButton
                    disabled={joiningId === c.id}
                    onClick={() => requestJoin(c.id)}
                  >
                    {joiningId === c.id ? 'Sending request…' : 'Request to join'}
                  </PrimaryButton>
                </div>
              )}
              {isPending && (
                <p style={{ margin: '16px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Awaiting manager approval
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
