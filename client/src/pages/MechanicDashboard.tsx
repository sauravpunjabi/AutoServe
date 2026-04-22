import { useState, useEffect } from "react";
import api from "../api/axios";

export default function MechanicDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/job-cards");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/job-cards/${id}/status`, { status });
      const res = await api.get("/job-cards");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Assigned Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job: any) => (
          <div key={job.id} className="p-4 border rounded shadow bg-white">
            <h3 className="font-bold">Job #{job.id.slice(0, 8)}</h3>
            <p>Status: <span className="font-semibold uppercase">{job.status}</span></p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => updateStatus(job.id, "in_progress")} className="bg-yellow-500 text-white px-3 py-1 rounded">Start Job</button>
              <button onClick={() => updateStatus(job.id, "completed")} className="bg-green-600 text-white px-3 py-1 rounded">Complete Job</button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p>No assigned jobs right now.</p>}
      </div>
    </div>
  );
}
