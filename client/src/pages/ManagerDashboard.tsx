import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bRes = await api.get("/bookings");
      setBookings(bRes.data);
      // Assume manager is linked to a center, getting inventory for their center might require center ID, but for now we skip exact fetching logic due to time
    } catch (err) {
      console.error(err);
    }
  };

  const approveBooking = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: "approved" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manager Operations</h2>
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">Pending Bookings</h3>
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="p-4 border rounded bg-white flex justify-between items-center">
              <div>
                <p><strong>Date:</strong> {b.booking_date} | <strong>Time:</strong> {b.time_slot}</p>
                <p><strong>Type:</strong> {b.service_type}</p>
                <p><strong>Status:</strong> {b.status}</p>
              </div>
              {b.status === 'pending' && (
                <button onClick={() => approveBooking(b.id)} className="bg-green-600 text-white px-4 py-2 rounded">Approve & Create Job Card</button>
              )}
            </div>
          ))}
          {bookings.length === 0 && <p>No bookings.</p>}
        </div>
      </div>
    </div>
  );
}
