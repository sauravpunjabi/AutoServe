import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FileText, Download, DollarSign } from "lucide-react";
import CustomerLayout from "../../components/CustomerLayout";

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/misc/invoices");
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
      <CustomerLayout title="Billing & Invoices" subtitle="View and download your service receipts.">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Billing & Invoices" subtitle="View and download your service receipts.">
      
      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No invoices yet</h3>
          <p className="mt-1 text-sm text-slate-500">When your services are completed, invoices will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((inv: any) => (
            <div key={inv.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col transition-all hover:shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Invoice</h3>
                    <p className="text-xs text-slate-500 font-mono">#{inv.id.split('-')[0].toUpperCase()}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${inv.status === 'paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  {inv.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date Issued:</span>
                  <span className="font-medium text-slate-900">{new Date(inv.issued_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Labor Cost:</span>
                  <span className="font-medium text-slate-900">${Number(inv.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-auto">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}