import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, Building2, LogOut, Shield } from "lucide-react";
import { cn } from "../lib/utils";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Service Centers", path: "/admin/service-centers", icon: Building2 },
];

export default function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-700">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-56 flex-col border-r border-gray-100 bg-white">
        <div className="flex h-14 items-center gap-2 border-b border-gray-100 px-5">
          <Shield className="h-5 w-5 text-gray-900" />
          <span className="text-sm font-semibold text-gray-900">AutoServe Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-gray-50 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={16} className={isActive ? "text-blue-600" : ""} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-3">
          <p className="truncate px-3 text-xs font-medium text-gray-900">{user?.name}</p>
          <p className="px-3 text-xs text-gray-400">Administrator</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="ml-56 flex flex-1 flex-col">
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">
            <header className="mb-8">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
