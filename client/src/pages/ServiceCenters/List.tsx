import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface ServiceCenter {
    id: string;
    name: string;
    location: string;
    contact: string;
    manager_id: string;
}

const ServiceCenterList = () => {
    const { user } = useAuth();
    const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<Set<string>>(new Set()); // Track joined centers

    useEffect(() => {
        const fetchServiceCenters = async () => {
            try {
                const response = await api.get("/service-centers");
                setServiceCenters(response.data);
            } catch (err) {
                console.error("Error fetching service centers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceCenters();
    }, []);

    const handleJoin = async (id: string) => {
        try {
            await api.post(`/service-centers/${id}/join`);
            setRequests(prev => new Set(prev).add(id));
            alert("Request sent successfully!");
        } catch (err: any) {
            alert(err.response?.data || "Failed to send request");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Service Centers</h2>

            {user?.role === "manager" && (
                <Link to="/create-service-center" className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Create New Service Center
                </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceCenters.map((center) => (
                    <div key={center.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{center.name}</h3>
                        <p className="text-gray-600 mb-2">📍 {center.location}</p>
                        <p className="text-gray-600 mb-4">📞 {center.contact}</p>

                        {user?.role === "mechanic" && (
                            <button
                                onClick={() => handleJoin(center.id)}
                                disabled={requests.has(center.id)}
                                className={`w-full py-2 rounded font-medium ${requests.has(center.id)
                                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {requests.has(center.id) ? "Request Sent" : "Request to Join"}
                            </button>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Ratings: ⭐ N/A</span>
                            <Link to={`/service-centers/${center.id}`} className="text-blue-500 hover:underline">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>

            {serviceCenters.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No service centers found.</p>
            )}
        </div>
    );
};

export default ServiceCenterList;
