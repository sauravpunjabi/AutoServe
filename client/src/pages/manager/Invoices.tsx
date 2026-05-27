import { useState, useEffect } from 'react';
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
import { FileText } from 'lucide-react';

export default function ManagerInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/misc/invoices/manager');
        setInvoices(res.data.data || []);
      } catch {
        toast.error('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Invoices" subtitle="Billing for completed jobs." navLinks={managerNav}>
        <SkeletonTable rows={6} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Invoices" subtitle="Billing for completed jobs." navLinks={managerNav}>
      <div style={{ animation: 'fadeInUp 0.25s ease forwards' }}>
        {invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices"
            description="Generate invoices from completed job cards."
          />
        ) : (
          <TableWrap>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Invoice ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Service</th>
                  <th style={thStyle}>Labor</th>
                  <th style={thStyle}>Parts</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <td style={{ ...tdStyle, fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                      {inv.id.slice(0, 8)}
                    </td>
                    <td style={tdStyle}>{inv.customer_name}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      {inv.booking_date ? new Date(inv.booking_date).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      {inv.service_type || '—'}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      ${Number(inv.labor_cost).toFixed(2)}
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                      ${Number(inv.parts_cost).toFixed(2)}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      ${Number(inv.total_amount).toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={inv.status} />
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
