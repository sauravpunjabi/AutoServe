import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "./ui/LoadingPage";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const roleHome: Record<string, string> = {
  customer: "/customer/dashboard",
  mechanic: "/mechanic/dashboard",
  manager: "/manager/dashboard",
  admin: "/admin/dashboard",
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingPage />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
