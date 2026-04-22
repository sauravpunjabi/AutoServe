import { useState, useEffect } from "react";
import api from "../api/axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "calendar">("calendar");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bRes = await api.get("/bookings");
      setBookings(bRes.data);
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

  const events = bookings.map((b) => {
    // Assuming time_slot is something like "09:00" and booking_date is a valid date string
    const start = new Date(`${b.booking_date.split('T')[0]}T${b.time_slot}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour

    return {
      id: b.id,
      title: `${b.service_type} - ${b.status}`,
      start,
      end,
      resource: b,
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manager Operations</h2>
        <div className="flex gap-2 bg-white rounded shadow p-1">
          <button 
            className={`px-4 py-1 rounded ${view === 'calendar' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600'}`}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`px-4 py-1 rounded ${view === 'list' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600'}`}
            onClick={() => setView('list')}
          >
            List
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="bg-white p-6 rounded shadow-md h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={(event) => {
              const status = event.resource.status;
              let backgroundColor = "#3174ad"; // default pending
              if (status === "approved") backgroundColor = "#10b981"; // green
              if (status === "completed") backgroundColor = "#6b7280"; // gray
              return { style: { backgroundColor } };
            }}
            onSelectEvent={(event) => alert(`Booking Details:\nService: ${event.resource.service_type}\nStatus: ${event.resource.status}`)}
          />
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-2">Pending Bookings</h3>
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="p-4 border rounded bg-white flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-gray-500 text-sm">{b.booking_date.split('T')[0]} at {b.time_slot}</p>
                  <p className="font-semibold text-lg">{b.service_type}</p>
                  <p>
                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                      b.status === 'approved' ? 'bg-green-100 text-green-700' :
                      b.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {b.status}
                    </span>
                  </p>
                </div>
                {b.status === 'pending' && (
                  <button onClick={() => approveBooking(b.id)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                    Approve & Create Job Card
                  </button>
                )}
              </div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
