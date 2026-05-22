import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export function useManagerCenter() {
  const { user } = useAuth();
  const [center, setCenter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenter = async () => {
      if (!user || user.role !== "manager") {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/service-centers");
        const centers = res.data.data || [];
        const mine = centers.find((c: any) => c.manager_id === user.id);
        setCenter(mine || null);
      } catch {
        setCenter(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCenter();
  }, [user]);

  return { center, centerId: center?.id, loading };
}
