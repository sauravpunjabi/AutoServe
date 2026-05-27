import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import { Card, SectionLabel, Skeleton, SkeletonText } from '../../components/ui';
import { useManagerCenter } from '../../hooks/useManagerCenter';
import { toast } from 'react-toastify';

export default function ManagerProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [centerDetail, setCenterDetail] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCenter, setLoadingCenter] = useState(false);
  const { centerId, loading: centerLoading } = useManagerCenter();

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
    const fetchCenterDetail = async () => {
      if (!centerId) return;
      setLoadingCenter(true);
      try {
        const res = await api.get(`/service-centers/${centerId}`);
        setCenterDetail(res.data.data);
      } catch {
        toast.error('Failed to load service center details');
      } finally {
        setLoadingCenter(false);
      }
    };
    fetchCenterDetail();
  }, [centerId]);

  if (loadingProfile || centerLoading || loadingCenter) {
    return (
      <AppLayout title="Profile" subtitle="View your profile details." navLinks={managerNav}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="100px" height="14px" />
              <SkeletonText lines={4} />
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton width="120px" height="14px" />
              <SkeletonText lines={3} />
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
    <AppLayout title="Profile" subtitle="Your account & service center information." navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <Card>
            <SectionLabel>Personal Info</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={labelStyle}>Full Name</p>
              <p style={valStyle}>{profile?.name || 'N/A'}</p>

              <p style={labelStyle}>Email Address</p>
              <p style={valStyle}>{profile?.email || 'N/A'}</p>

              <p style={labelStyle}>Phone Number</p>
              <p style={{ ...valStyle, marginBottom: 0 }}>{profile?.phone || 'N/A'}</p>
            </div>
          </Card>

          <Card>
            <SectionLabel>Service Center</SectionLabel>
            {centerId ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={labelStyle}>Center Name</p>
                <p style={valStyle}>{centerDetail?.name || 'N/A'}</p>

                <p style={labelStyle}>Address</p>
                <p style={valStyle}>{centerDetail?.address || 'N/A'}</p>

                <p style={labelStyle}>Phone Number</p>
                <p style={valStyle}>{centerDetail?.phone || 'N/A'}</p>

                <p style={labelStyle}>Email Address</p>
                <p style={valStyle}>{centerDetail?.email || 'N/A'}</p>

                <p style={labelStyle}>Average Rating</p>
                <p style={{ ...valStyle, marginBottom: 0 }}>
                  ⭐ {Number(centerDetail?.average_rating || 0).toFixed(1)} / 5.0
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                No service center assigned or created yet.
              </p>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
