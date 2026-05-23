import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { adminNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import { TableWrap, thStyle, tdStyle, TableRow } from '../../components/ui/primitives';
import { Building2 } from 'lucide-react';

export default function AdminServiceCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await api.get('/service-centers');
        setCenters(res.data.data || []);
      } catch {
        toast.error('Failed to load service centers');
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  if (loading) {
    return (
      <AppLayout
        title="Service centers"
        subtitle="Platform-wide center overview."
        navLinks={adminNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Service centers" subtitle="Platform-wide center overview." navLinks={adminNav}>
      {centers.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No service centers"
          description="Centers will appear here once managers create them."
        />
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Manager</th>
                <th style={thStyle}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((c) => (
                <TableRow key={c.id}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{c.address}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{c.manager_name || '—'}</td>
                  <td style={tdStyle}>{Number(c.average_rating).toFixed(1)} ★</td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </AppLayout>
  );
}
