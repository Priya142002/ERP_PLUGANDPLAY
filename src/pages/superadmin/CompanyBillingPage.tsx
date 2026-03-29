import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, CheckCircle, Clock, AlertTriangle, Edit, Eye, BarChart3,
  Bell, BellOff, Download, RefreshCw, X, Save, CreditCard, Calendar, TrendingUp,
  Users, Package, Trash2, Filter, DollarSign
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", backdropFilter: "blur(2px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{ 
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h3 className="text-xl font-bold" style={{ color: "#1F2937" }}>Record Payment</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
            style={{ color: "#6B7280" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Plan Name
              </label>
              <input 
                value={form.planName} 
                onChange={e => set('planName', e.target.value)}
                placeholder="Enter plan name"
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Plan Type
              </label>
              <select 
                value={form.planType} 
                onChange={e => set('planType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Amount (₹) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input 
                type="number" 
                value={form.amount} 
                onChange={e => set('amount', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Tax Amount (₹)
              </label>
              <input 
                type="number" 
                value={form.taxAmount} 
                onChange={e => set('taxAmount', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
          </div>

          {/* Period Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Period Start
              </label>
              <input 
                type="date" 
                value={form.billingPeriodStart} 
                onChange={e => set('billingPeriodStart', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Period End
              </label>
              <input 
                type="date" 
                value={form.billingPeriodEnd} 
                onChange={e => set('billingPeriodEnd', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
          </div>

          {/* Due Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Due Date
              </label>
              <input 
                type="date" 
                value={form.dueDate} 
                onChange={e => set('dueDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Status
              </label>
              <select 
                value={form.status} 
                onChange={e => set('status', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D1D5DB",
                  color: "#111827"
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Payment Details (shown only when status is Paid) */}
          {form.status === 'Paid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                  Payment Mode
                </label>
                <select 
                  value={form.paymentMode} 
                  onChange={e => set('paymentMode', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D1D5DB",
                    color: "#111827"
                  }}
                >
                  <option value="">Select payment mode...</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                  Transaction Reference
                </label>
                <input 
                  value={form.transactionRef} 
                  onChange={e => set('transactionRef', e.target.value)}
                  placeholder="UTR / Reference Number"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D1D5DB",
                    color: "#111827"
                  }}
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
              Notes
            </label>
            <textarea 
              value={form.notes} 
              onChange={e => set('notes', e.target.value)} 
              rows={3}
              placeholder="Add any additional notes or comments..."
              className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ 
                backgroundColor: "#FFFFFF",
                borderColor: "#D1D5DB",
                color: "#111827"
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-5 border-t" style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}>
          <button 
            onClick={onClose} 
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 border"
            style={{ 
              backgroundColor: "#F3F4F6",
              color: "#374151",
              borderColor: "#D1D5DB"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E5E7EB";
              e.currentTarget.style.color = "#1D4ED8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
              e.currentTarget.style.color = "#374151";
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || !form.amount}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: "#2563EB",
              color: "#FFFFFF"
            }}
            onMouseEnter={(e) => {
              if (!saving && form.amount) {
                e.currentTarget.style.backgroundColor = "#1D4ED8";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
            onMouseLeave={(e) => {
              if (!saving && form.amount) {
                e.currentTarget.style.backgroundColor = "#2563EB";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
          >
            {saving && <RefreshCw size={16} className="animate-spin" />}
            <Save size={16} />
            Record Payment
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

// ── Subscription Management Modal ────────────────────────────────────────────
function SubscriptionManagementModal({ 
  companyId, 
  currentSubscription, 
  onClose, 
  onSaved 
}: { 
  companyId: number; 
  currentSubscription: any; 
  onClose: () => void; 
  onSaved: () => void; 
}) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await superAdminApi.getPlans();
        if (res.success) {
          setPlans(res.data || []);
          if (currentSubscription) {
            setSelectedPlan(currentSubscription.plan);
            setBillingCycle(currentSubscription.planType || 'Monthly');
            setSeats(currentSubscription.usedSeats || 1);
          }
        }
      } catch (e) {
        console.error('Failed to load plans:', e);
      }
    };
    loadPlans();
  }, [currentSubscription]);

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    const basePrice = selectedPlan.monthlyPrice || 0;
    const perUserPrice = (selectedPlan.pricePerUser || 0) * seats;
    const total = basePrice + perUserPrice;
    
    if (billingCycle === 'Yearly') return total * 12 * 0.9;
    if (billingCycle === 'Quarterly') return total * 3 * 0.95;
    return total;
  };

  const handleSave = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    try {
      const payload = {
        companyId,
        planId: selectedPlan.id,
        planType: billingCycle,
        startDate,
        seats
      };
      
      if (currentSubscription) {
        await superAdminApi.updateSubscription?.(currentSubscription.id, payload);
      } else {
        await superAdminApi.assignPlan(payload);
      }
      
      onSaved();
      onClose();
    } catch (e) {
      console.error('Failed to save subscription:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", backdropFilter: "blur(2px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl rounded-xl max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-xl font-bold" style={{ color: "#1F2937" }}>
            Assign Subscription Plan
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg transition-colors hover:bg-gray-50"
            style={{ color: "#6B7280" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Plan Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: "#111827" }}>Select Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: selectedPlan?.id === plan.id ? "#3B82F6" : "#E5E7EB",
                    boxShadow: selectedPlan?.id === plan.id 
                      ? "0px 4px 12px rgba(59, 130, 246, 0.15)" 
                      : "0px 1px 3px rgba(0, 0, 0, 0.05)",
                    transform: selectedPlan?.id === plan.id ? "translateY(-2px)" : "translateY(0px)"
                  }}
                >
                  {/* Plan Badge */}
                  {selectedPlan?.id === plan.id && (
                    <div className="flex justify-end mb-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#3B82F6" }}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <h4 className="font-bold text-lg mb-3" style={{ color: "#111827" }}>
                    {plan.name}
                  </h4>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold" style={{ color: "#2563EB" }}>
                      ₹{plan.monthlyPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm ml-1" style={{ color: "#6B7280" }}>/month</span>
                  </div>
                  
                  {plan.pricePerUser > 0 && (
                    <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
                      + ₹{plan.pricePerUser?.toLocaleString('en-IN')} per user
                    </p>
                  )}
                  
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {plan.description || "Perfect for growing businesses"}
                  </p>
                  
                  {/* Features list could go here */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
                      <span>Up to {plan.maxSeats || 'Unlimited'} users</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
                      <span>{plan.maxModules || 'All'} modules included</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPlan && (
            <>
              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#374151" }}>
                    Billing Cycle
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D1D5DB",
                      color: "#111827"
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly (5% discount)</option>
                    <option value="Yearly">Yearly (10% discount)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#374151" }}>
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D1D5DB",
                      color: "#111827"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#374151" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ 
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D1D5DB",
                      color: "#111827"
                    }}
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="p-6 rounded-xl" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <h4 className="font-semibold text-lg mb-4" style={{ color: "#111827" }}>Price Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: "#6B7280" }}>Base Price ({billingCycle})</span>
                    <span className="font-medium" style={{ color: "#111827" }}>
                      ₹{(selectedPlan.monthlyPrice * (billingCycle === 'Yearly' ? 12 : billingCycle === 'Quarterly' ? 3 : 1))?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {selectedPlan.pricePerUser > 0 && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#6B7280" }}>Per User ({seats} seats)</span>
                      <span className="font-medium" style={{ color: "#111827" }}>
                        ₹{(selectedPlan.pricePerUser * seats * (billingCycle === 'Yearly' ? 12 : billingCycle === 'Quarterly' ? 3 : 1))?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  
                  {billingCycle !== 'Monthly' && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: "#10B981" }}>Discount ({billingCycle === 'Yearly' ? '10%' : '5%'})</span>
                      <span className="font-medium" style={{ color: "#10B981" }}>
                        -₹{(calculatePrice() * (billingCycle === 'Yearly' ? 0.1111 : 0.0526))?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold" style={{ color: "#111827" }}>Total Amount</span>
                      <span className="text-2xl font-bold" style={{ color: "#2563EB" }}>
                        ₹{calculatePrice()?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors hover:bg-gray-200"
            style={{ 
              backgroundColor: "#F3F4F6",
              color: "#374151"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPlan || loading}
            className="px-8 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center gap-2"
            style={{ 
              backgroundColor: "#2563EB",
              color: "#FFFFFF"
            }}
            onMouseEnter={(e) => {
              if (!loading && selectedPlan) {
                e.currentTarget.style.backgroundColor = "#1D4ED8";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && selectedPlan) {
                e.currentTarget.style.backgroundColor = "#2563EB";
              }
            }}
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            {currentSubscription ? 'Update Subscription' : 'Assign Plan'}
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<number | null>(null);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

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
          <button onClick={() => setShowSubscriptionModal(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition">
            <Edit size={13} /> Manage Subscription
          </button>
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

          {/* Subscription Info & Controls */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-slate-800">Subscription Details</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">View:</span>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1 text-xs font-medium transition ${
                      viewMode === 'monthly' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setViewMode('yearly')}
                    className={`px-3 py-1 text-xs font-medium transition ${
                      viewMode === 'yearly' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-wrap gap-6 text-sm">
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Company Email</span><p className="font-medium text-slate-800 mt-0.5">{data.companyEmail}</p></div>
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Plan</span><p className="font-medium text-slate-800 mt-0.5">{data.activePlan || '—'}</p></div>
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span><p className={`font-bold mt-0.5 ${data.activeStatus === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>{data.activeStatus || '—'}</p></div>
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Next Billing</span><p className="font-medium text-slate-800 mt-0.5">{data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString('en-IN') : '—'}</p></div>
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Seats Used</span><p className="font-medium text-slate-800 mt-0.5">{data.usedSeats || 0}</p></div>
              <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Modules</span><p className="font-medium text-slate-800 mt-0.5">{data.allowedModules?.length || 0} active</p></div>
            </div>
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
        {showSubscriptionModal && (
          <SubscriptionManagementModal 
            companyId={companyId}
            currentSubscription={data?.currentSubscription}
            onClose={() => setShowSubscriptionModal(false)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CompanyBillingPage;
