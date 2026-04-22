import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft, CheckCircle, Clock, Wrench, Settings, Package } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

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
      <CustomerLayout title="Job Tracker" subtitle="Real-time status of your vehicle's service.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!jobCard) {
    return (
      <CustomerLayout title="Job Tracker" subtitle="Real-time status of your vehicle's service.">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Job card not found or access denied.</p>
          <Link to="/customer/bookings" className="mt-4 text-blue-600 hover:underline">Back to Appointments</Link>
        </div>
      </CustomerLayout>
    );
  }

  const steps = ["created", "in_progress", "completed"];
  const currentStepIndex = steps.indexOf(jobCard.status);

  return (
    <CustomerLayout title={`Tracking Job #${id?.slice(0,8)}`} subtitle="Real-time status of your vehicle's service.">
      <Link to="/customer/bookings" className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft size={16} className="mr-2" />
        Back to Appointments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Status Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Progress Tracker */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-8">Service Progress</h2>
            
            <div className="relative">
              <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
              <div 
                className="absolute left-[28px] top-0 w-1 bg-blue-600 rounded-full transition-all duration-1000"
                style={{ height: currentStepIndex === 0 ? '10%' : currentStepIndex === 1 ? '50%' : '100%' }}
              ></div>

              <ul className="space-y-12 relative z-10">
                <li className="flex items-start gap-6">
                  <div className={`h-14 w-14 shrink-0 rounded-full border-4 flex items-center justify-center ${currentStepIndex >= 0 ? 'border-white bg-blue-600 text-white' : 'border-white bg-slate-200 text-slate-400'}`}>
                    <Clock size={24} />
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-lg font-bold ${currentStepIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Vehicle Dropped Off</h3>
                    <p className="text-sm text-slate-500 mt-1">Your vehicle has been checked in and a job card is created.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className={`h-14 w-14 shrink-0 rounded-full border-4 flex items-center justify-center ${currentStepIndex >= 1 ? 'border-white bg-blue-600 text-white' : 'border-white bg-slate-200 text-slate-400'}`}>
                    <Wrench size={24} />
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-lg font-bold ${currentStepIndex >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Service In Progress</h3>
                    <p className="text-sm text-slate-500 mt-1">Our mechanics are currently working on your vehicle.</p>
                  </div>
                </li>

                <li className="flex items-start gap-6">
                  <div className={`h-14 w-14 shrink-0 rounded-full border-4 flex items-center justify-center ${currentStepIndex >= 2 ? 'border-white bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'border-white bg-slate-200 text-slate-400'}`}>
                    <CheckCircle size={24} />
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-lg font-bold ${currentStepIndex >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>Ready for Pickup</h3>
                    <p className="text-sm text-slate-500 mt-1">Service is fully completed and your vehicle is ready to go!</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Tasks List */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Service Tasks</h2>
            {(!jobCard.tasks || jobCard.tasks.length === 0) ? (
              <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-200 rounded-lg">No specific tasks added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {jobCard.tasks.map((task: any) => (
                  <li key={task.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Settings size={20} className="text-slate-300 shrink-0" />
                      )}
                      <span className={`font-medium ${task.status === 'completed' ? 'text-slate-800' : 'text-slate-600'}`}>{task.task_description}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${task.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 shadow-sm text-white">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Mechanic Notes</h2>
            <p className="text-sm leading-relaxed text-slate-200">
              {jobCard.notes || "No notes provided yet."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Package size={16} /> Used Parts
            </h2>
            {(!jobCard.parts || jobCard.parts.length === 0) ? (
              <p className="text-sm text-slate-500">No parts required.</p>
            ) : (
              <ul className="space-y-3">
                {jobCard.parts.map((p: any) => (
                  <li key={p.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700">{p.part_name}</span>
                    <span className="text-slate-500 bg-slate-100 px-2 rounded-md">Qty: {p.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </CustomerLayout>
  );
}