import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import { Card, SecondaryButton, Mono } from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { FileText, Download } from 'lucide-react';

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/misc/invoices/me');
        setInvoices(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <AppLayout
        title="Billing & invoices"
        subtitle="View and download your service receipts."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Billing & invoices"
      subtitle="View and download your service receipts."
      navLinks={customerNav}
    >
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="When your services are completed, invoices will appear here."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {invoices.map((inv) => (
            <Card key={inv.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Invoice
                  </p>
                  <Mono style={{ display: 'block', marginTop: '4px' }}>
                    #{inv.id.split('-')[0].toUpperCase()}
                  </Mono>
                </div>
                <StatusBadge status={inv.status} />
              </div>

              <div style={{ flex: 1, marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Date issued</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {new Date(inv.issued_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total amount</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>
                    ${Number(inv.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <SecondaryButton
                type="button"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={14} />
                Download PDF
              </SecondaryButton>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
