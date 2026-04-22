import { useState, useEffect } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          api.get("/misc/admin/users"),
          api.get("/misc/admin/analytics")
        ]);
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Admin Control Panel</h2>
      
      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Users</h3>
              <p className="text-3xl font-bold">{analytics.stats.users}</p>
            </div>
            <div className="bg-white p-6 rounded shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Bookings</h3>
              <p className="text-3xl font-bold">{analytics.stats.bookings}</p>
            </div>
            <div className="bg-white p-6 rounded shadow-md border-l-4 border-purple-500">
              <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Revenue</h3>
              <p className="text-3xl font-bold">${analytics.stats.revenue}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="font-bold mb-4">Revenue Per Service Center</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.revenuePerCenter}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="font-bold mb-4">Bookings Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.bookingsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <h3 className="font-bold text-lg mb-4">User Management</h3>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-gray-600 font-semibold">Name</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Email</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.user_id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{u.full_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                    u.role === 'mechanic' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
