import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import { Card, SecondaryButton, PrimaryButton, Mono, TextInput } from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { FileText, Download } from 'lucide-react';

function downloadInvoicePDF(inv: any) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('AutoServe', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Professional Auto Service', 14, 27);

  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(`#${inv.id.split('-')[0].toUpperCase()}`, pageW - 14, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  const dateStr = inv.issued_at
    ? new Date(inv.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '-';
  doc.text(`Date: ${dateStr}`, pageW - 14, 27, { align: 'right' });

  doc.setDrawColor(210);
  doc.line(14, 32, pageW - 14, 32);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('CUSTOMER', 14, 41);
  doc.text('VEHICLE', 110, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(inv.customer_name || '-', 14, 48);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(inv.customer_email || '-', 14, 54);

  const vehicleLine = inv.vehicle_make
    ? `${inv.vehicle_year} ${inv.vehicle_make} ${inv.vehicle_model}`
    : '-';
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(vehicleLine, 110, 48);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(inv.vehicle_license_plate || '-', 110, 54);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('SERVICE', 14, 64);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(inv.service_type || '-', 14, 71);
  doc.setFontSize(9);
  doc.setTextColor(80);
  const bookingDateStr = inv.booking_date
    ? new Date(inv.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '-';
  doc.text(`Booking date: ${bookingDateStr}`, 14, 77);

  const parts: any[] = Array.isArray(inv.parts) ? inv.parts : [];
  const tableRows = parts.map((p) => [
    p.name,
    String(p.quantity),
    `$${Number(p.unit_price).toFixed(2)}`,
    `$${Number(p.subtotal).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 86,
    head: [['Part', 'Qty', 'Unit Price', 'Subtotal']],
    body: tableRows.length > 0 ? tableRows : [['No parts used', '', '', '']],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [25, 25, 25], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  });

  const afterTable = (doc as any).lastAutoTable.finalY + 12;
  const labelX = pageW - 75;
  const valueX = pageW - 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Labor cost', labelX, afterTable);
  doc.text(`$${Number(inv.labor_cost).toFixed(2)}`, valueX, afterTable, { align: 'right' });

  doc.text('Parts total', labelX, afterTable + 7);
  doc.text(`$${Number(inv.parts_cost).toFixed(2)}`, valueX, afterTable + 7, { align: 'right' });

  doc.setDrawColor(200);
  doc.line(labelX, afterTable + 10, valueX, afterTable + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('Grand Total', labelX, afterTable + 17);
  doc.setFont('courier', 'bold');
  doc.text(`$${Number(inv.total_amount).toFixed(2)}`, valueX, afterTable + 17, { align: 'right' });

  const isPaid = inv.status === 'paid';
  const badgeColor: [number, number, number] = isPaid ? [22, 163, 74] : [220, 38, 38];
  const badgeText = isPaid ? 'PAID' : 'UNPAID';
  const badgeW = isPaid ? 22 : 32;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(14, afterTable + 9, badgeW, 8, 2, 2, 'F');
  doc.setTextColor(255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(badgeText, 14 + badgeW / 2, afterTable + 14.5, { align: 'center' });

  doc.setDrawColor(220);
  doc.line(14, pageH - 18, pageW - 14, pageH - 18);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text('Thank you for choosing AutoServe', pageW / 2, pageH - 10, { align: 'center' });

  doc.save(`invoice-${inv.id.split('-')[0].toUpperCase()}.pdf`);
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function PaymentModal({
  inv,
  onClose,
  onPaid,
}: {
  inv: any;
  onClose: () => void;
  onPaid: (id: string) => void;
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length >= 3;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.patch(`/misc/invoices/${inv.id}/pay`);
      toast.success('Payment successful!');
      onPaid(inv.id);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Title */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Pay Invoice
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Enter your card details to complete payment.
          </p>
        </div>

        {/* Invoice summary */}
        <div
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Service</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{inv.service_type || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Date</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '-'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: 600,
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '4px',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace' }}>
              ${Number(inv.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
              Card Number
            </p>
            <TextInput
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                Expiry
              </p>
              <TextInput
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                CVV
              </p>
              <TextInput
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                type="password"
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
          <SecondaryButton type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleConfirm} disabled={!canSubmit || submitting}>
            {submitting ? 'Processing…' : `Pay $${Number(inv.total_amount).toFixed(2)}`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState<any | null>(null);

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

  const markPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  };

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

              <div style={{ display: 'flex', gap: '8px' }}>
                {inv.status === 'unpaid' && (
                  <PrimaryButton
                    type="button"
                    onClick={() => setPayingInvoice(inv)}
                    style={{ flex: 1 }}
                  >
                    Pay Now
                  </PrimaryButton>
                )}
                <SecondaryButton
                  type="button"
                  onClick={() => downloadInvoicePDF(inv)}
                  style={{
                    flex: inv.status === 'unpaid' ? '0 0 auto' : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Download size={14} />
                  {inv.status === 'unpaid' ? null : 'Download PDF'}
                </SecondaryButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      {payingInvoice && (
        <PaymentModal
          inv={payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onPaid={markPaid}
        />
      )}
    </AppLayout>
  );
}
