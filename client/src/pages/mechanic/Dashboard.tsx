import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import { GridStats, StatCard, Card } from '../../components/ui/primitives';
import { Briefcase, Building2 } from 'lucide-react';

export default function MechanicDashboard() {
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job-cards');
        const jobs = res.data.data || [];
        setStats({
          total: jobs.length,
          inProgress: jobs.filter((j: { status: string }) => j.status === 'in_progress').length,
          completed: jobs.filter((j: { status: string }) => j.status === 'completed').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Dashboard" subtitle="Your assigned work at a glance." navLinks={mechanicNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  const quickLinks = [
    {
      to: '/mechanic/job-cards',
      icon: Briefcase,
      title: 'View job queue',
      description: 'See and update your assigned jobs',
    },
    {
      to: '/mechanic/service-centers',
      icon: Building2,
      title: 'Service centers',
      description: 'Join or check your center status',
    },
  ];

  return (
    <AppLayout title="Dashboard" subtitle="Your assigned work at a glance." navLinks={mechanicNav}>
      <GridStats>
        <StatCard label="Assigned jobs" value={stats.total} />
        <StatCard label="In progress" value={stats.inProgress} />
        <StatCard label="Completed" value={stats.completed} />
      </GridStats>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {quickLinks.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <Card
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <Icon size={20} color="var(--text-muted)" strokeWidth={1.5} />
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {title}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
