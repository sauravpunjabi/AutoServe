import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { Star } from 'lucide-react';
import { Card } from '../../components/ui/primitives';

export default function ManagerReviews() {
  const { centerId, loading: centerLoading } = useManagerCenter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!centerId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/service-centers/${centerId}`);
        setReviews(res.data.data?.reviews || []);
      } catch {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    if (!centerLoading) fetchReviews();
  }, [centerId, centerLoading]);

  if (loading || centerLoading) {
    return (
      <AppLayout title="Reviews" subtitle="Customer feedback for your center." navLinks={managerNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Reviews" subtitle="Customer feedback for your center." navLinks={managerNav}>
      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews from customers will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r) => (
            <Card key={r.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {r.customer_name}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: 500, color: 'var(--accent)' }}>
                {r.rating} / 5
              </p>
              {r.comment && (
                <p style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {r.comment}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
