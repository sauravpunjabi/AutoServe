import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Wrench, 
  Settings, 
  LogOut,
  Car,
  Calendar,
  Search,
  Bell,
  FileText,
  User,
  Zap
} from "lucide-react";

export default function CustomerLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Overview", path: "/customer/dashboard", icon: Settings },
    { name: "My Vehicles", path: "/customer/vehicles", icon: Car },
    { name: "Appointments", path: "/customer/bookings", icon: Calendar },
    { name: "Invoices", path: "/customer/invoices", icon: FileText },
    { name: "Find a Center", path: "/customer/service-centers", icon: Search },
  ];

  return (
    <div className="flex min-h-screen bg-surface-darker font-sans text-slate-200 selection:bg-primary-500/30 overflow-hidden relative">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Sidebar - Premium Glass Panel */}
      <aside className="relative z-20 w-64 glass-panel flex flex-col shadow-2xl shrink-0 h-screen">
        <div className="flex h-20 items-center gap-3 px-6 border-b border-white/5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-indigo-600 text-white shadow-lg shadow-primary-500/30">
            <Wrench size={20} className="relative z-10" />
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Auto<span className="text-primary-400">Serve</span></span>
        </div>
        
        <div className="p-4 mt-2">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? "text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent border-l-4 border-primary-500 rounded-xl"></div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  )}
                  <Icon size={18} className={`relative z-10 ${isActive ? "text-primary-400" : "group-hover:text-primary-400 transition-colors"}`} />
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 text-slate-300 flex items-center justify-center font-bold shadow-inner">
                {user?.name?.charAt(0) || <User size={18} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-primary-400 flex items-center gap-1"><Zap size={10} /> Premium User</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Top Header Glass */}
        <header className="h-20 flex items-center justify-between px-8 bg-surface-darker/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            {/* Breadcrumb could go here */}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative h-10 w-10 bg-surface-dark border border-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-6xl mx-auto w-full animate-fade-in">
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-white font-sans">{title}</h1>
              {subtitle && <p className="mt-2 text-lg text-slate-400">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
