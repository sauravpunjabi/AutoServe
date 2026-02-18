import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="bg-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="mb-4">Welcome, {user?.full_name || "User"}!</p>
                <p className="mb-4 text-gray-600">Role: <span className="font-semibold uppercase">{user?.role}</span></p>

                <div className="mb-6">
                    <a href="/service-centers" className="text-blue-600 hover:underline">Browse Service Centers</a>
                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
