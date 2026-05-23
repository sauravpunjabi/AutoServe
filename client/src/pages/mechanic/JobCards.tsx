import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { mechanicNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableWrap, thStyle, tdStyle, TableRow, TextLink } from '../../components/ui/primitives';
import { Briefcase } from 'lucide-react';

export default function MechanicJobCards() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job-cards');
        setJobs(res.data.data || []);
      } catch {
        toast.error('Failed to load job cards');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Job cards" subtitle="Your assigned service jobs." navLinks={mechanicNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Job cards" subtitle="Your assigned service jobs." navLinks={mechanicNav}>
      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs assigned"
          description="Jobs will appear here once a manager assigns you."
        />
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Job ID</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <td style={tdStyle}>
                    <TextLink to={`/mechanic/job-cards/${j.id}`}>{j.id.slice(0, 8)}</TextLink>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{j.service_type || '—'}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                    {j.booking_date ? new Date(j.booking_date).toLocaleDateString() : '—'}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={j.status} />
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </AppLayout>
  );
}
