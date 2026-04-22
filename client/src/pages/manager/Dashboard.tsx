import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { 
  Building, 
  Calendar, 
  Settings, 
  LogOut,
  Users,
  Package,
  FileText,
  Briefcase
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white shadow-sm flex flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Building size={18} />
          </div>
          <span className="text-lg font-bold text-slate-900">Manager Portal</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link to="/manager/dashboard" className="flex items-center gap-3 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
            <Settings size={18} />
            Dashboard
          </Link>
          <Link to="/manager/bookings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Calendar size={18} />
            Schedule
          </Link>
          <Link to="/manager/job-cards" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Briefcase size={18} />
            Job Cards
          </Link>
          <Link to="/manager/mechanics" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Users size={18} />
            Mechanics
          </Link>
          <Link to="/manager/inventory" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Package size={18} />
            Inventory
          </Link>
          <Link to="/manager/invoices" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <FileText size={18} />
            Invoices
          </Link>
        </nav>
        <div className="border-t p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
          <p className="mt-2 text-slate-500">Welcome, {user?.name}. Here's an overview of your service center.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Pending Bookings</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">4</p>
                </div>
                <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
                    <Calendar size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Active Jobs</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Briefcase size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Low Stock Items</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">3</p>
                </div>
                <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                    <Package size={24} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}