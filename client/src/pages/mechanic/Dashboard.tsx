import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Wrench, 
  Settings, 
  LogOut,
  ListTodo,
  CheckCircle,
  Building
} from "lucide-react";

export default function MechanicDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-slate-900 text-slate-300 flex flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 text-white">
            <Wrench size={18} />
          </div>
          <span className="text-lg font-bold text-white">Mechanic Bay</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link to="/mechanic/dashboard" className="flex items-center gap-3 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white">
            <Settings size={18} />
            Dashboard
          </Link>
          <Link to="/mechanic/job-cards" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <ListTodo size={18} />
            My Job Cards
          </Link>
          <Link to="/mechanic/service-centers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <Building size={18} />
            Service Centers
          </Link>
        </nav>
        <div className="border-t border-slate-800 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Mechanic Dashboard</h1>
          <p className="mt-2 text-slate-500">Welcome, {user?.name}. Let's get to work.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                        <Wrench size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Active Jobs</h2>
                        <p className="text-slate-500 text-sm">Jobs currently assigned to you</p>
                    </div>
                </div>
                <Link to="/mechanic/job-cards" className="mt-4 block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition">View Work Queue</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Completed</h2>
                        <p className="text-slate-500 text-sm">Jobs you finished this week</p>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-3xl font-black text-slate-900">8</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}