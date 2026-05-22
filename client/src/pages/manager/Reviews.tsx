import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import EmptyState from "../../components/ui/EmptyState";
import { useManagerCenter } from "../../hooks/useManagerCenter";
import { Star } from "lucide-react";

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
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (!centerLoading) fetchReviews();
  }, [centerId, centerLoading]);

  if (loading || centerLoading) {
    return (
      <ManagerLayout title="Reviews" subtitle="Customer feedback for your center.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Reviews" subtitle="Customer feedback for your center.">
      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews from customers will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-100 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{r.customer_name}</p>
                <p className="text-sm text-gray-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-amber-600">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </p>
              {r.comment && (
                <p className="mt-3 text-sm text-gray-700">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </ManagerLayout>
  );
}
