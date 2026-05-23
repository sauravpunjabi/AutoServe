import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { adminNav } from '../../lib/nav';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  TableWrap,
  thStyle,
  tdStyle,
  TableRow,
  SuccessTextButton,
  DangerTextButton,
} from '../../components/ui/primitives';
import { Users } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/misc/admin/users');
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user: any) => {
    const next = user.status === 'active' ? 'rejected' : 'active';
    try {
      await api.patch(`/misc/admin/users/${user.id}/status`, { status: next });
      toast.success(`User ${next === 'active' ? 'activated' : 'suspended'}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <AppLayout title="Users" subtitle="Manage platform accounts." navLinks={adminNav}>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Users" subtitle="Manage platform accounts." navLinks={adminNav}>
      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users" description="No users in the system." />
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{u.name}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-hover)',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={u.status === 'rejected' ? 'suspended' : u.status} />
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {u.status === 'active' ? (
                      <DangerTextButton onClick={() => toggleStatus(u)}>Suspend</DangerTextButton>
                    ) : (
                      <SuccessTextButton onClick={() => toggleStatus(u)}>Activate</SuccessTextButton>
                    )}
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
