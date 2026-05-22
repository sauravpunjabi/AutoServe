import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import ManagerLayout from "../../components/ManagerLayout";

export default function CreateServiceCenter() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/service-centers", form);
      toast.success("Service center created");
      navigate("/manager/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create service center");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ManagerLayout title="Create service center" subtitle="Set up your center to start accepting bookings.">
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 rounded-xl border border-gray-100 bg-white p-6"
      >
        {(["name", "address", "phone", "email"] as const).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-400">
              {field}
            </label>
            <input
              required
              type={field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create center"}
        </button>
      </form>
    </ManagerLayout>
  );
}
