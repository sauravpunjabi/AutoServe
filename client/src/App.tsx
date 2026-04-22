import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateServiceCenter from "./pages/ServiceCenters/Create";
import ServiceCenterList from "./pages/ServiceCenters/List";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/service-centers" element={<ServiceCenterList />} />
                            <Route path="/create-service-center" element={<CreateServiceCenter />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Route>

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
