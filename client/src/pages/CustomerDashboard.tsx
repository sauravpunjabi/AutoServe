import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [license, setLicense] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVehicle = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", { make, model, year, license_plate: license });
      fetchVehicles();
      setMake(""); setModel(""); setYear(""); setLicense("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Vehicles</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <form onSubmit={handleAddVehicle} className="flex gap-4">
          <input className="border p-2 rounded" placeholder="Make" value={make} onChange={(e)=>setMake(e.target.value)} required />
          <input className="border p-2 rounded" placeholder="Model" value={model} onChange={(e)=>setModel(e.target.value)} required />
          <input className="border p-2 rounded" type="number" placeholder="Year" value={year} onChange={(e)=>setYear(e.target.value)} required />
          <input className="border p-2 rounded" placeholder="License Plate" value={license} onChange={(e)=>setLicense(e.target.value)} required />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {vehicles.map((v: any) => (
          <div key={v.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{v.make} {v.model}</h3>
            <p>Year: {v.year}</p>
            <p>Plate: {v.license_plate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
