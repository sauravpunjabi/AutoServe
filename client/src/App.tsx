import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Customer
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerVehicles from "./pages/customer/Vehicles";
import CustomerBookService from "./pages/customer/BookService";
import CustomerBookings from "./pages/customer/Bookings";
import CustomerJobTracker from "./pages/customer/JobTracker";
import CustomerInvoices from "./pages/customer/Invoices";
import CustomerServiceCenters from "./pages/customer/ServiceCenters";

// Mechanic
import MechanicDashboard from "./pages/mechanic/Dashboard";
import MechanicServiceCenters from "./pages/mechanic/ServiceCenters";
import MechanicJobCards from "./pages/mechanic/JobCards";
import MechanicJobCardDetail from "./pages/mechanic/JobCardDetail";

// Manager
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerCreateServiceCenter from "./pages/manager/CreateServiceCenter";
import ManagerManageServiceCenter from "./pages/manager/ManageServiceCenter";
import ManagerMechanics from "./pages/manager/Mechanics";
import ManagerBookings from "./pages/manager/Bookings";
import ManagerBookingDetail from "./pages/manager/BookingDetail";
import ManagerJobCards from "./pages/manager/JobCards";
import ManagerJobCardDetail from "./pages/manager/JobCardDetail";
import ManagerInventory from "./pages/manager/Inventory";
import ManagerInvoices from "./pages/manager/Invoices";
import ManagerReviews from "./pages/manager/Reviews";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminServiceCenters from "./pages/admin/ServiceCenters";

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
                            {/* Customer Routes */}
                            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                            <Route path="/customer/vehicles" element={<CustomerVehicles />} />
                            <Route path="/customer/book-service" element={<CustomerBookService />} />
                            <Route path="/customer/bookings" element={<CustomerBookings />} />
                            <Route path="/customer/job-tracker/:id" element={<CustomerJobTracker />} />
                            <Route path="/customer/invoices" element={<CustomerInvoices />} />
                            <Route path="/customer/service-centers" element={<CustomerServiceCenters />} />

                            {/* Mechanic Routes */}
                            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                            <Route path="/mechanic/service-centers" element={<MechanicServiceCenters />} />
                            <Route path="/mechanic/job-cards" element={<MechanicJobCards />} />
                            <Route path="/mechanic/job-cards/:id" element={<MechanicJobCardDetail />} />

                            {/* Manager Routes */}
                            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                            <Route path="/manager/service-center/create" element={<ManagerCreateServiceCenter />} />
                            <Route path="/manager/service-center/manage" element={<ManagerManageServiceCenter />} />
                            <Route path="/manager/mechanics" element={<ManagerMechanics />} />
                            <Route path="/manager/bookings" element={<ManagerBookings />} />
                            <Route path="/manager/bookings/:id" element={<ManagerBookingDetail />} />
                            <Route path="/manager/job-cards" element={<ManagerJobCards />} />
                            <Route path="/manager/job-cards/:id" element={<ManagerJobCardDetail />} />
                            <Route path="/manager/inventory" element={<ManagerInventory />} />
                            <Route path="/manager/invoices" element={<ManagerInvoices />} />
                            <Route path="/manager/reviews" element={<ManagerReviews />} />

                            {/* Admin Routes */}
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/service-centers" element={<AdminServiceCenters />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
