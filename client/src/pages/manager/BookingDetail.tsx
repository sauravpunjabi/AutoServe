import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";
import LoadingPage from "../../components/ui/LoadingPage";
import StatusBadge from "../../components/ui/StatusBadge";
import { ArrowLeft } from "lucide-react";

export default function ManagerBookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [jobCardId, setJobCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data);
        if (res.data.data?.status === "approved") {
          const jobsRes = await api.get("/job-cards");
          const job = (jobsRes.data.data || []).find(
            (j: any) => j.booking_id === id
          );
          if (job) setJobCardId(job.id);
        }
      } catch {
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.data);
      if (status === "approved") {
        const jobsRes = await api.get("/job-cards");
        const job = (jobsRes.data.data || []).find((j: any) => j.booking_id === id);
        if (job) setJobCardId(job.id);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <ManagerLayout title="Booking" subtitle="Booking details.">
        <LoadingPage />
      </ManagerLayout>
    );
  }

  if (!booking) {
    return (
      <ManagerLayout title="Booking" subtitle="Booking details.">
        <p className="text-sm text-gray-400">Booking not found.</p>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Booking" subtitle={`#${id?.slice(0, 8)}`}>
      <Link
        to="/manager/bookings"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to schedule
      </Link>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Booking
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-400">Service</dt>
              <dd className="text-gray-900">{booking.service_type}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Date</dt>
              <dd className="text-gray-900">
                {new Date(booking.booking_date).toLocaleDateString()} · {booking.time_slot?.slice?.(0, 5)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={booking.status} />
              </dd>
            </div>
            {booking.notes && (
              <div>
                <dt className="text-gray-400">Notes</dt>
                <dd className="text-gray-700">{booking.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Customer & vehicle
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-400">Customer</dt>
              <dd className="text-gray-900">{booking.customer_name}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Email</dt>
              <dd className="text-gray-500">{booking.customer_email}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Vehicle</dt>
              <dd className="font-mono text-xs text-gray-900">
                {booking.year} {booking.make} {booking.model} · {booking.license_plate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <select
          value={booking.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        {jobCardId && (
          <Link
            to={`/manager/job-cards/${jobCardId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View job card →
          </Link>
        )}
      </div>
    </ManagerLayout>
  );
}
