import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import { Card, SectionLabel, TextLink, StatusBadge, Skeleton, SkeletonText } from '../../components/ui';
import { toast } from 'react-toastify';

export default function MechanicProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [centerName, setCenterName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCenter, setLoadingCenter] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data.data);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCenterName = async () => {
      if (!profile?.service_center_id) return;
      setLoadingCenter(true);
      try {
        const res = await api.get(`/service-centers/${profile.service_center_id}`);
        setCenterName(res.data.data?.name || null);
      } catch {
        setCenterName('Unknown Center');
      } finally {
        setLoadingCenter(false);
      }
    };
    fetchCenterName();
  }, [profile?.service_center_id]);

  if (loadingProfile || loadingCenter) {
    return (
      <AppLayout title="Profile" subtitle="View your profile details." navLinks={mechanicNav}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="120px" height="14px" />
              <SkeletonText lines={4} />
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: '0 0 4px',
  };

  const valStyle = {
    fontSize: '14px',
    color: 'var(--text-primary)',
    margin: '0 0 16px',
    fontWeight: 500,
  };

  return (
    <AppLayout title="Profile" subtitle="Your account & assignment status." navLinks={mechanicNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <SectionLabel>Mechanic Profile</SectionLabel>
              <StatusBadge status={profile?.status || 'pending'} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={labelStyle}>Full Name</p>
              <p style={valStyle}>{profile?.name || 'N/A'}</p>

              <p style={labelStyle}>Email Address</p>
              <p style={valStyle}>{profile?.email || 'N/A'}</p>

              <p style={labelStyle}>Phone Number</p>
              <p style={valStyle}>{profile?.phone || 'N/A'}</p>

              <p style={labelStyle}>Assigned Service Center</p>
              {profile?.service_center_id ? (
                <p style={{ ...valStyle, marginBottom: 0 }}>{centerName || 'Loading...'}</p>
              ) : (
                <div style={{ marginTop: '4px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                    Not assigned to a service center
                  </p>
                  <TextLink to="/mechanic/service-centers">Browse Service Centers →</TextLink>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
