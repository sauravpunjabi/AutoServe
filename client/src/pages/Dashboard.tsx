import { useAuth } from "../context/AuthContext";
import CustomerDashboard from "./CustomerDashboard";
import MechanicDashboard from "./MechanicDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow-md mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">AutoServe Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.full_name || "User"} ({user?.role})</p>
                </div>
                <div className="flex gap-4 items-center">
                    <a href="/service-centers" className="text-blue-600 hover:underline">Service Centers</a>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {user?.role === "customer" && <CustomerDashboard />}
                {user?.role === "mechanic" && <MechanicDashboard />}
                {user?.role === "manager" && <ManagerDashboard />}
                {user?.role === "admin" && <AdminDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
