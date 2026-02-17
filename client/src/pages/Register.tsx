import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "customer", // Default role
    });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/register", formData);
            login(response.data.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Create an Account
                </h2>
                {error && (
                    <div className="mb-4 rounded bg-red-100 p-2 text-center text-red-700">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="customer">Customer</option>
                            <option value="mechanic">Mechanic</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
