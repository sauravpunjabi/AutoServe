import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { managerNav } from '../../lib/nav';
import {
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  EmptyState,
  StatusBadge,
  SkeletonTable,
} from '../../components/ui';
import { Briefcase } from 'lucide-react';

export default function ManagerJobCards() {
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
      <AppLayout title="Job cards" subtitle="Track active service work." navLinks={managerNav}>
        <SkeletonTable rows={6} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Job cards" subtitle="Track active service work." navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job cards"
            description="Job cards are created when bookings are approved."
          />
        ) : (
          <TableWrap>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Job ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Service</th>
                  <th style={thStyle}>Mechanic</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <TableRow key={j.id}>
                    <td style={tdStyle}>
                      <Link
                        to={`/manager/job-cards/${j.id}`}
                        style={{
                          fontFamily: 'Geist Mono, monospace',
                          fontSize: '12px',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        {j.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      {j.booking_date ? new Date(j.booking_date).toLocaleDateString() : '—'}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                        {j.services?.[0]?.name || j.service_type || 'N/A'}
                      </span>
                      {(j.services?.length || 0) > 1 && (
                        <span style={{
                          marginLeft: '6px', fontSize: '10px',
                          color: 'var(--accent)', fontWeight: 500
                        }}>+{j.services.length - 1} more</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      {j.mechanic_name || 'Unassigned'}
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
      </div>
    </AppLayout>
  );
}
