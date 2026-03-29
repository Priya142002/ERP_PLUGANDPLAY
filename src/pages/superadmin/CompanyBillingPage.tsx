import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, CheckCircle, Clock, AlertTriangle,
  Bell, BellOff, Download, RefreshCw, X, Save, CreditCard
} from "lucide-react";
import { superAdminApi } from "../../services/api";

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Paid:    { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  Pending: { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: Clock },
  Overdue: { color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200',       icon: AlertTriangle },
  Waived:  { color: 'text-slate-500',   bg: 'bg-slate-50 border-slate-200',     icon: BellOff },
};

// ── Record Payment Modal ──────────────────────────────────────────────────────
function RecordPaymentModal({ companyId, activePlan, onClose, onSaved }: {
  companyId: number; activePlan?: string; onClose: () => void; onSaved: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    planName: activePlan || '', planType: 'Monthly',
    amount: '', taxAmount: '0',
    billingPeriodStart: today, billingPeriodEnd: nextMonth,
    dueDate: nextMonth, status: 'Pending',
    paymentMode: '', transactionRef: '', notes: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.amount) return;
    setSaving(true);
    try {
      await superAdminApi.recordPayment({
        companyId,
        planName: form.planName, planType: form.planType,
        amount: parseFloat(form.amount), taxAmount: parseFloat(form.taxAmount || '0'),
        billingPeriodStart: form.billingPeriodStart, billingPeriodEnd: form.billingPeriodEnd,
        dueDate: form.dueDate, status: form.status,
        paymentMode: form.paymentMode, transactionRef: form.transactionRef, notes: form.notes,
      });
      onSaved(); onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-xl border shadow-2xl bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Record Payment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Name</label>
              <input value={form.planName} onChange={e => set('planName', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Type</label>
              <select value={form.planType} onChange={e => set('planType', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none">
                <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder="0.00" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tax Amount (₹)</label>
              <input type="number" value={form.taxAmount} onChange={e => set('taxAmount', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Period Start</label>
              <input type="date" value={form.billingPeriodStart} onChange={e => set('billingPeriodStart', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Period End</label>
              <input type="date" value={form.billingPeriodEnd} onChange={e => set('billingPeriodEnd', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none">
                <option>Pending</option><option>Paid</option><option>Overdue</option>
              </select>
            </div>
          </div>
          {form.status === 'Paid' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
                <select value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none">
                  <option value="">Select...</option>
                  <option>Cash</option><option>Bank Transfer</option><option>UPI</option><option>Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref</label>
                <input value={form.transactionRef} onChange={e => set('transactionRef', e.target.value)}
                  placeholder="UTR / Ref No." className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-100 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.amount}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-bold hover:bg-[#003366] transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <RefreshCw size={13} className="animate-spin" />}
            <Save size={13} /> Record Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Mark Paid Modal ───────────────────────────────────────────────────────────
function MarkPaidModal({ payment, onClose, onSaved }: { payment: any; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState('');
  const [ref, setRef] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try { await superAdminApi.markPaymentPaid(payment.id, { paymentMode: mode, transactionRef: ref, notes }); onSaved(); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-xl border shadow-2xl bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Mark as Paid</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
            Invoice: <strong>{payment.invoiceNumber}</strong> — {fmt(payment.totalAmount)}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none">
              <option value="">Select...</option>
              <option>Cash</option><option>Bank Transfer</option><option>UPI</option><option>Card</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref</label>
            <input value={ref} onChange={e => setRef(e.target.value)} placeholder="UTR / Ref No."
              className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-100 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <RefreshCw size={13} className="animate-spin" />}
            <CheckCircle size={13} /> Confirm Paid
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function CompanyBillingPage({ companyId, companyName, onBack }: {
  companyId: number; companyName: string; onBack: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRecord, setShowRecord] = useState(false);
  const [markPaidPayment, setMarkPaidPayment] = useState<any>(null);
  const [sendingReminder, setSendingReminder] = useState<number | null>(null);
  const [sendingBulk, setSendingBulk] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getCompanyBilling(companyId);
      if (res.success) setData(res.data);
    } finally { setLoading(false); }
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const handleSendReminder = async (paymentId: number) => {
    setSendingReminder(paymentId);
    try { await superAdminApi.sendPaymentReminder(paymentId); await load(); }
    finally { setSendingReminder(null); }
  };

  const handleBulkReminder = async () => {
    setSendingBulk(true);
    try { await superAdminApi.sendBulkReminders(); await load(); }
    finally { setSendingBulk(false); }
  };

  const overdueCount = data?.payments?.filter((p: any) => p.status === 'Overdue' || (p.status === 'Pending' && new Date(p.dueDate) < new Date())).length ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{companyName} — Billing History</h1>
          <p className="text-sm text-slate-500 mt-0.5">Subscription payments, invoices & reminders</p>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <button onClick={handleBulkReminder} disabled={sendingBulk}
              className="flex items-center gap-2 px-4 h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition disabled:opacity-60">
              {sendingBulk ? <RefreshCw size={13} className="animate-spin" /> : <Bell size={13} />}
              Send Reminders ({overdueCount})
            </button>
          )}
          <button onClick={() => setShowRecord(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition shadow-lg">
            <Plus size={13} /> Record Payment
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <RefreshCw size={20} className="animate-spin mr-2" /> Loading billing history...
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Paid',    value: fmt(data.summary.totalPaid),    color: 'text-emerald-700', bg: 'bg-emerald-50', count: data.summary.paidCount },
              { label: 'Pending',       value: fmt(data.summary.totalPending), color: 'text-amber-700',   bg: 'bg-amber-50',   count: data.summary.pendingCount },
              { label: 'Overdue',       value: fmt(data.summary.totalOverdue), color: 'text-rose-700',    bg: 'bg-rose-50',    count: data.summary.overdueCount },
              { label: 'Active Plan',   value: data.activePlan || 'None',      color: 'text-blue-700',    bg: 'bg-blue-50',    count: null },
            ].map(({ label, value, color, bg, count }) => (
              <div key={label} className={`p-4 rounded-xl border ${bg} border-current/10`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
                {count !== null && <p className="text-xs text-slate-400 mt-0.5">{count} invoice{count !== 1 ? 's' : ''}</p>}
              </div>
            ))}
          </div>

          {/* Subscription Info */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap gap-6 text-sm">
            <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Company Email</span><p className="font-medium text-slate-800 mt-0.5">{data.companyEmail}</p></div>
            <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Plan</span><p className="font-medium text-slate-800 mt-0.5">{data.activePlan || '—'}</p></div>
            <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span><p className={`font-bold mt-0.5 ${data.activeStatus === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>{data.activeStatus || '—'}</p></div>
            <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Next Billing</span><p className="font-medium text-slate-800 mt-0.5">{data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString('en-IN') : '—'}</p></div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Payment History</h3>
              <span className="text-xs text-slate-400">{data.payments.length} records</span>
            </div>

            {data.payments.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No payment records yet</p>
                <p className="text-xs mt-1">Click "Record Payment" to add the first entry</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#002147] text-white text-xs uppercase">
                    <th className="px-5 py-3 text-left">Invoice</th>
                    <th className="px-5 py-3 text-left">Plan</th>
                    <th className="px-5 py-3 text-left">Period</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-left">Due Date</th>
                    <th className="px-5 py-3 text-left">Paid Date</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Reminder</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.payments.map((p: any) => {
                      const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.Pending;
                      const StatusIcon = cfg.icon;
                      const isOverdue = p.status !== 'Paid' && new Date(p.dueDate) < new Date();
                      return (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${isOverdue && p.status !== 'Paid' ? 'bg-rose-50/30' : ''}`}>
                          <td className="px-5 py-4 font-mono text-xs font-bold text-slate-700">{p.invoiceNumber}</td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-800">{p.planName}</div>
                            <div className="text-[10px] text-slate-400">{p.planType}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {new Date(p.billingPeriodStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            {' – '}
                            {new Date(p.billingPeriodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-slate-800">{fmt(p.totalAmount)}</td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            <span className={isOverdue && p.status !== 'Paid' ? 'text-rose-600 font-bold' : ''}>
                              {new Date(p.dueDate).toLocaleDateString('en-IN')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {p.paidDate ? new Date(p.paidDate).toLocaleDateString('en-IN') : '—'}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon size={10} />
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {p.status !== 'Paid' ? (
                              p.reminderSent ? (
                                <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                  <BellOff size={11} /> Sent
                                </span>
                              ) : (
                                <button onClick={() => handleSendReminder(p.id)} disabled={sendingReminder === p.id}
                                  className="flex items-center justify-center gap-1 mx-auto px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold hover:bg-amber-100 transition disabled:opacity-60">
                                  {sendingReminder === p.id ? <RefreshCw size={10} className="animate-spin" /> : <Bell size={10} />}
                                  Remind
                                </button>
                              )
                            ) : <span className="text-[10px] text-slate-300">—</span>}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {p.status !== 'Paid' && (
                              <button onClick={() => setMarkPaidPayment(p)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100 transition">
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-slate-400">Failed to load billing data</div>
      )}

      <AnimatePresence>
        {showRecord && (
          <RecordPaymentModal companyId={companyId} activePlan={data?.activePlan}
            onClose={() => setShowRecord(false)} onSaved={load} />
        )}
        {markPaidPayment && (
          <MarkPaidModal payment={markPaidPayment}
            onClose={() => setMarkPaidPayment(null)} onSaved={load} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CompanyBillingPage;
