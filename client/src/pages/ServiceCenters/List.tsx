import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { managerNav, mechanicNav } from '../../lib/nav';
import { Card, PrimaryButton, StatusBadge, Skeleton, EmptyState } from '../../components/ui';
import { Building2, MapPin, Phone } from 'lucide-react';

interface ServiceCenter {
  id: string;
  name: string;
  location: string;
  contact: string;
  manager_id: string;
  average_rating?: number;
}

const ServiceCenterList = () => {
  const { user } = useAuth();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Set<string>>(new Set());

  const navLinks = user?.role === 'mechanic' ? mechanicNav : managerNav;

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await api.get('/service-centers');
        setServiceCenters(response.data?.data || response.data || []);
      } catch (err) {
        console.error('Error fetching service centers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceCenters();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      await api.post(`/service-centers/${id}/join`);
      setRequests((prev) => new Set(prev).add(id));
    } catch (err: any) {
      console.error(err.response?.data || 'Failed to send request');
    }
  };

  if (loading) {
    return (
      <AppLayout title="Service centers" subtitle="Browse available service centers." navLinks={navLinks}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Skeleton width="24px" height="24px" />
                <Skeleton width="60px" height="18px" borderRadius="4px" />
              </div>
              <Skeleton width="160px" height="14px" style={{ margin: '12px 0 4px' }} />
              <Skeleton width="200px" height="12px" style={{ marginBottom: '8px' }} />
              <Skeleton width="100px" height="10px" />
              <Skeleton width="100%" height="32px" borderRadius="6px" style={{ marginTop: '16px' }} />
            </Card>
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Service centers"
      subtitle="Browse available service centers."
      navLinks={navLinks}
      actions={
        user?.role === 'manager' ? (
          <Link to="/manager/service-center/create" style={{ textDecoration: 'none' }}>
            <PrimaryButton>+ Create new center</PrimaryButton>
          </Link>
        ) : undefined
      }
    >
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        {serviceCenters.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No service centers"
            description="No service centers have been created yet."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {serviceCenters.map((center) => {
              const joined = requests.has(center.id);
              return (
                <Card key={center.id}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Building2 size={20} color="var(--text-muted)" strokeWidth={1.5} />
                    {joined && <StatusBadge status="pending" />}
                  </div>
                  <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {center.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <MapPin size={13} color="var(--text-muted)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      <span>{center.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Phone size={13} color="var(--text-muted)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      <span>{center.contact}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Rating: {center.average_rating ? Number(center.average_rating).toFixed(1) : 'N/A'} / 5
                    </span>
                    <Link
                      to={`/service-centers/${center.id}`}
                      style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      View details →
                    </Link>
                  </div>
                  {user?.role === 'mechanic' && (
                    <div style={{ marginTop: '12px' }}>
                      <PrimaryButton
                        disabled={joined}
                        onClick={() => handleJoin(center.id)}
                        style={{ width: '100%', opacity: joined ? 0.6 : 1 }}
                      >
                        {joined ? 'Request sent' : 'Request to join'}
                      </PrimaryButton>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ServiceCenterList;
