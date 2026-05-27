import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { Card, SectionLabel, TextLink, Mono, EmptyState, Skeleton, SkeletonText } from '../../components/ui';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import api from '../../api/axios';
import { Building2 } from 'lucide-react';

export default function ManageServiceCenter() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [center, setCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenter = async () => {
      if (!centerId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/service-centers/${centerId}`);
        setCenter(res.data.data);
      } catch {
        setCenter(null);
      } finally {
        setLoading(false);
      }
    };
    if (!centerLoading) fetchCenter();
  }, [centerId, centerLoading]);

  if (centerLoading || loading) {
    return (
      <AppLayout title="Service center" subtitle="Your center details." navLinks={managerNav}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton width="100px" height="14px" />
            <SkeletonText lines={4} />
          </div>
        </Card>
      </AppLayout>
    );
  }

  if (!centerId || !center) {
    return (
      <AppLayout title="Service center" subtitle="Your center details." navLinks={managerNav}>
        <EmptyState
          icon={Building2}
          title="No service center"
          description="Create a service center to start managing bookings and staff."
          actionLabel="Create center"
          actionTo="/manager/service-center/create"
        />
      </AppLayout>
    );
  }

  const fields = [
    { label: 'Name', value: center.name },
    { label: 'Address', value: center.address },
    { label: 'Phone', value: center.phone },
    { label: 'Email', value: center.email },
    {
      label: 'Average rating',
      value: `${Number(center.average_rating || 0).toFixed(1)} / 5`,
    },
  ];

  const dtStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: 0,
  };

  const ddStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--text-primary)',
    margin: '6px 0 0',
  };

  return (
    <AppLayout title="Service center" subtitle="Your center details." navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <Card>
          <SectionLabel>Details</SectionLabel>
          <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fields.map(({ label, value }) => (
              <div key={label}>
                <dt style={dtStyle}>{label}</dt>
                <dd style={ddStyle}>{value}</dd>
              </div>
            ))}
          </dl>
          <p style={{ margin: '24px 0 0', fontSize: '12px' }}>
            <Mono>ID: {center.id}</Mono>
          </p>
          <div style={{ marginTop: '16px' }}>
            <TextLink to="/manager/reviews">View customer reviews →</TextLink>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
