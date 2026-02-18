import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateServiceCenter = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        contact: ""
    });
    const [error, setError] = useState("");

    if (user?.role !== "manager") {
        return <div className="p-8 text-red-500">Access Denied: Managers Only</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/service-centers", formData); // Note: BaseURL is /api/auth currently, need to fix
            // Actually, axios instance base URL is problematic if hardcoded to /auth
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data || "Failed to create service center");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create Service Center</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Contact</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Create</button>
            </form>
        </div>
    );
};

export default CreateServiceCenter;
