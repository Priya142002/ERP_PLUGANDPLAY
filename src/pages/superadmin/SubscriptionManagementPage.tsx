import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Clock, DollarSign, Users, Building, 
  Search, X, Calendar, Save, Edit
} from "lucide-react";
import { superAdminApi } from "../../services/api";
import "../../styles/superadmin-mobile.css";

function ChangePlanModal({ subscription, onClose, onSave }: { subscription: any; onClose: () => void; onSave: (id: string, newPlan: string, prorated: boolean) => void }) {
  const [newPlan, setNewPlan] = useState(subscription.plan);
  const [prorated, setProrated] = useState(true);
  
  const planDetails = {
    Basic: { price: 49, seats: 50, color: "var(--sa-info)" },
    Pro: { price: 149, seats: 200, color: "var(--sa-success)" },
    Enterprise: { price: 499, seats: "∞", color: "var(--sa-primary)" }
  };

  const currentPrice = subscription.plan === "Enterprise" ? 499 : subscription.plan === "Pro" ? 149 : 49;
  const newPrice = planDetails[newPlan as keyof typeof planDetails].price;
  const priceDiff = newPrice - currentPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-xl border shadow-2xl"
        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--sa-border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--sa-text-primary)" }}>Change Plan</h2>
            <p className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>{subscription.company}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--sa-hover)]">
            <X className="h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>Select New Plan</label>
            {Object.entries(planDetails).map(([plan, details]) => (
              <button
                key={plan}
                onClick={() => setNewPlan(plan)}
                className={`w-full p-4 rounded-xl border mb-2 text-left transition ${
                  newPlan === plan ? 'border-[var(--sa-primary)]' : ''
                }`}
                style={{ 
                  borderColor: newPlan === plan ? 'var(--sa-primary)' : 'var(--sa-border)',
                  backgroundColor: newPlan === plan ? 'color-mix(in srgb, var(--sa-primary), transparent 90%)' : 'var(--sa-card)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: newPlan === plan ? 'var(--sa-primary)' : 'var(--sa-text-primary)' }}>
                      {plan}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--sa-text-secondary)' }}>
                      ₹{details.price}/mo · {details.seats === "∞" ? "Unlimited seats" : `Up to ${details.seats} seats`}
                    </div>
                  </div>
                  {newPlan === plan && (
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--sa-primary)' }} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Price Comparison */}
          {subscription.plan !== newPlan && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--sa-hover)' }}>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--sa-text-secondary)' }}>Current price:</span>
                <span style={{ color: 'var(--sa-text-primary)' }}>₹{currentPrice}/mo</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--sa-text-secondary)' }}>New price:</span>
                <span style={{ color: 'var(--sa-text-primary)' }}>₹{newPrice}/mo</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                <span style={{ color: 'var(--sa-text-secondary)' }}>Difference:</span>
                <span style={{ color: priceDiff > 0 ? 'var(--sa-success)' : 'var(--sa-error)' }}>
                  {priceDiff > 0 ? '+' : ''}₹{priceDiff}/mo
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--sa-hover)' }}>
            <input 
              type="checkbox" 
              id="prorated"
              checked={prorated} 
              onChange={(e) => setProrated(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="prorated" className="text-xs" style={{ color: 'var(--sa-text-primary)' }}>
              Apply prorated charges for remaining days in billing cycle
            </label>
          </div>

          {subscription.plan === "Basic" && newPlan !== "Basic" && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
              <p className="text-xs" style={{ color: 'var(--sa-success)' }}>
                Upgrading from Basic: Changes will take effect immediately
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t" style={{ borderColor: "var(--sa-border)" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--sa-border)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(subscription.company, newPlan, prorated);
              onClose();
            }}
            disabled={subscription.plan === newPlan}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--sa-primary)" }}
          >
            <Save className="h-4 w-4" />
            Confirm Change
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ManagePlansModal({ onClose }: { onClose: () => void }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', monthlyPrice: 0, planType: 'Monthly', maxSeats: 0, maxModules: 0, description: '' });

  const loadPlans = () => {
    superAdminApi.getPlans().then(res => { if (res.success) setPlans(res.data || []); });
  };

  useEffect(() => { loadPlans(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await superAdminApi.updatePlan(editingPlan.id, formData as any);
      } else {
        await superAdminApi.createPlan(formData as any);
      }
      setIsAdding(false);
      setEditingPlan(null);
      loadPlans();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl rounded-xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--sa-border)" }}>
           <h2 className="text-lg font-semibold" style={{ color: "var(--sa-text-primary)" }}>Manage Subscription Plans</h2>
           <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--sa-hover)]">
             <X className="h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
           </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          {/* List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>Existing Plans</h3>
              <button 
                onClick={() => { setIsAdding(true); setEditingPlan(null); setFormData({ name: '', monthlyPrice: 0, planType: 'Monthly', maxSeats: 0, maxModules: 0, description: '' }); }}
                className="text-xs text-[var(--sa-primary)] hover:underline"
              >
                + Create New
              </button>
            </div>
            {plans.map(p => (
              <div key={p.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: "var(--sa-border)" }}>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--sa-text-primary)" }}>{p.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--sa-text-secondary)" }}>
                    ₹{p.monthlyPrice} / {p.planType} · {p.maxSeats || '∞'} seats
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingPlan(p); setIsAdding(true); setFormData({ ...p }); }}
                  className="p-1.5 rounded-lg border hover:bg-[var(--sa-hover)]" style={{ borderColor: "var(--sa-border)" }}>
                  <Edit className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Form Section */}
          {isAdding && (
            <form onSubmit={handleSave} className="space-y-4 p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-hover)", borderColor: "var(--sa-border)" }}>
               <h3 className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{editingPlan ? 'Update Plan' : 'Create Plan'}</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--sa-text-secondary)" }}>Plan Name</label>
                    <input required className="w-full h-9 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--sa-text-secondary)" }}>Price</label>
                    <input type="number" required className="w-full h-9 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      value={formData.monthlyPrice} onChange={e => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--sa-text-secondary)" }}>Plan Cycle</label>
                    <select className="w-full h-9 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      value={formData.planType} onChange={e => setFormData({ ...formData, planType: e.target.value })}>
                       <option value="Monthly">Monthly</option>
                       <option value="Quarterly">Quarterly</option>
                       <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--sa-text-secondary)" }}>Seats</label>
                    <input type="number" className="w-full h-9 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      value={formData.maxSeats} onChange={e => setFormData({ ...formData, maxSeats: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--sa-text-secondary)" }}>Modules</label>
                    <input type="number" className="w-full h-9 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      value={formData.maxModules} onChange={e => setFormData({ ...formData, maxModules: Number(e.target.value) })} />
                  </div>
               </div>
               <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-1.5 rounded-lg border text-xs" style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}>Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-[var(--sa-primary)] text-white text-xs font-semibold">Save Plan</button>
               </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AssignSubscriptionModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    superAdminApi.getCompanies(1, 500).then(res => { if (res.success) setCompanies(res.data?.items || []); });
    superAdminApi.getPlans().then(res => { if (res.success) setPlans(res.data || []); });
  }, []);

  const handleAssign = async () => {
    if (!selectedCompany || !selectedPlanId) return;
    setLoading(true);
    try {
      await superAdminApi.assignPlan({
        companyId: selectedCompany.id,
        planId: Number(selectedPlanId),
        endDate: endDate || null
      });
      onSave();
      onClose();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-xl border shadow-2xl"
        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--sa-border)" }}>
           <h2 className="text-lg font-semibold" style={{ color: "var(--sa-text-primary)" }}>Assign New Subscription</h2>
           <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--sa-hover)]">
             <X className="h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
           </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>Find Company</label>
            <select 
              className="w-full h-10 rounded-lg border px-3 text-sm" 
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              onChange={(e) => {
                const company = companies.find(c => c.id === Number(e.target.value));
                setSelectedCompany(company);
              }}
              value={selectedCompany?.id || ''}
            >
              <option value="">Select a company...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>

          {selectedCompany && (
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-hover)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>Current Status</span>
                <span className="text-xs font-bold" style={{ color: selectedCompany.subscriptionStatus === 'Active' ? 'var(--sa-success)' : 'var(--sa-text-secondary)' }}>
                  {selectedCompany.activePlan || 'No Active Plan'} ({selectedCompany.subscriptionStatus || 'None'})
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>Select Plan</label>
            <div className="grid grid-cols-1 gap-2">
              {plans.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id.toString())}
                  className={`p-3 rounded-lg border text-left transition ${selectedPlanId === p.id.toString() ? 'ring-2 ring-[var(--sa-primary)]' : ''}`}
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm" style={{ color: "var(--sa-text-primary)" }}>{p.name}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--sa-primary)" }}>₹{p.monthlyPrice}/{p.planType}</span>
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: "var(--sa-text-secondary)" }}>Seats: {p.maxSeats || '∞'} · Modules: {p.maxModules}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>End Date (Optional)</label>
            <input type="date" className="w-full h-10 rounded-lg border px-3 text-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              value={endDate} onChange={e => setEndDate(e.target.value)} />
            <p className="text-[9px] mt-1" style={{ color: "var(--sa-text-secondary)" }}>If empty, the subscription will renew automatically based on the cycle.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t" style={{ borderColor: "var(--sa-border)" }}>
           <button onClick={onClose} className="px-5 py-2 rounded-xl border text-sm" style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}>Discard</button>
           <button 
             disabled={loading || !selectedCompany || !selectedPlanId}
             onClick={handleAssign}
             className="px-6 py-2 rounded-xl bg-[var(--sa-primary)] text-white text-sm font-bold shadow-lg disabled:opacity-50"
           >
             {loading ? 'Processing...' : 'Assign Subscription'}
           </button>
        </div>
      </motion.div>
    </div>
  );
}

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export function SubscriptionManagementPage() {
  const [search, setSearch] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showManagePlansModal, setShowManagePlansModal] = useState(false);

  const loadSubscriptions = () => {
    setLoading(true);
    superAdminApi.getSubscriptions().then(res => {
      if (res.success) {
        const items = res.data?.items ?? res.data ?? [];
        setSubscriptions(Array.isArray(items) ? items : []);
      }
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const filtered = subscriptions.filter(s =>
    !search || s.company?.toLowerCase().includes(search.toLowerCase()) ||
    s.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = subscriptions.reduce((acc, sub) => {
    const plan = sub.plan || sub.planName || '';
    if (plan === "Enterprise") return acc + 499;
    if (plan === "Pro") return acc + 149;
    if (plan === "Basic") return acc + 49;
    return acc;
  }, 0);

  const activeCount = subscriptions.filter(s => s.status === "Active").length;
  const paidCount = subscriptions.filter(s => (s.plan || s.planName) === "Enterprise" || (s.plan || s.planName) === "Pro").length;
  const proCount = subscriptions.filter(s => (s.plan || s.planName) === "Pro").length;

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 superadmin-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Subscription Ledger</h1>
          <p className="text-slate-500 mt-1">Manage global billing cycles, plan conversions, and revenue flow</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <DollarSign className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>Projected MRR: ₹{totalMRR.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowAssignModal(true)}
             className="px-4 h-10 rounded-xl bg-[var(--sa-primary)] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
           >
             + New Subscription
           </button>
           <button 
             onClick={() => setShowManagePlansModal(true)}
             className="px-4 h-10 rounded-xl border flex items-center gap-2 text-xs font-bold bg-white transition-all active:scale-95 shadow-sm"
             style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}
           >
             Manage Plans
           </button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <TrendingUp size={80} color="#FFFFFF" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <TrendingUp size={22} color="#FFFFFF" />
            </div>
            <div>
              <p className="!text-white/90 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Financial Intelligence</p>
              <div className="flex items-center gap-2">
                <span className="!text-[#FFFFFF] font-bold text-sm">Revenue Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="!text-white/95 font-bold text-sm">{activeCount} Productive Business Subscriptions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 superadmin-stats-grid">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(44, 110, 213, 0.1)" }}>
              <DollarSign className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-text-primary)" }}>₹{totalMRR.toLocaleString('en-IN')}</div>
          <div className="text-xs mt-1" style={{ color: "var(--sa-success)" }}>+12% from last month</div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(44, 110, 213, 0.1)" }}>
              <Building className="h-4 w-4" style={{ color: "var(--sa-info)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Active Companies</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-info)" }}>{activeCount}</div>
          <div className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>out of {subscriptions.length} total</div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(44, 110, 213, 0.1)" }}>
              <TrendingUp className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Pro & Enterprise</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-primary)" }}>{paidCount}</div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(40, 167, 69, 0.1)" }}>
              <Clock className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Pro Plans</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-success)" }}>{proCount}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border text-sm transition focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--sa-card)",
            borderColor: "var(--sa-border)",
            color: "var(--sa-text-primary)"
          }}
        />
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-xl border overflow-hidden superadmin-table-container" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full superadmin-table">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sa-border)" }}>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Company</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Plan</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Price</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Seats</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Next Billing</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Status</th>
                <th className="p-4 text-right text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>No subscriptions found</td></tr>
              ) : filtered.map((sub, index) => {
                const planName = sub.plan || sub.planName || 'Basic';
                const companyName = sub.company || sub.companyName || 'Unknown';
                const nextBilling = sub.nextBilling || sub.nextBillingDate
                  ? new Date(sub.nextBilling || sub.nextBillingDate).toLocaleDateString() : '—';
                const price = sub.price || `₹${sub.monthlyPrice || 0}/${sub.planType || 'mo'}`;
                return (
                  <motion.tr key={sub.id || index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }} className="border-b hover:bg-[var(--sa-hover)] transition"
                    style={{ borderColor: "var(--sa-border)" }}>
                    <td className="p-4 font-medium" style={{ color: "var(--sa-text-primary)" }}>{companyName}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold w-fit mb-1"
                          style={{ backgroundColor: planName === "Enterprise" ? "rgba(44,110,213,0.1)" : planName === "Pro" ? "rgba(40,167,69,0.1)" : "rgba(44,110,213,0.1)", color: planName === "Enterprise" ? "var(--sa-primary)" : planName === "Pro" ? "var(--sa-success)" : "var(--sa-info)" }}>
                          {planName}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 pl-1">{sub.planType || 'Monthly'}</span>
                      </div>
                    </td>
                    <td className="p-4" style={{ color: "var(--sa-text-primary)" }}>{price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                        <span style={{ color: "var(--sa-text-secondary)" }}>{sub.usedSeats ?? 0} / {sub.maxSeats ?? 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                        <span style={{ color: "var(--sa-text-secondary)" }}>{nextBilling}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span style={{ color: sub.status === "Active" ? "var(--sa-success)" : sub.status === "Suspended" ? "var(--sa-error)" : "var(--sa-warning)" }}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setChangingPlan({ ...sub, company: companyName, plan: planName }); setShowPlanModal(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition border hover:bg-[var(--sa-hover)]"
                        style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)", backgroundColor: "var(--sa-card)" }}>
                        Change Plan
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPlanModal && changingPlan && (
        <ChangePlanModal
          subscription={changingPlan}
          onClose={() => {
            setShowPlanModal(false);
            setChangingPlan(null);
          }}
          onSave={(id, newPlan, prorated) => {
            console.log("Changing plan for", id, "to", newPlan, "prorated:", prorated);
            setShowPlanModal(false);
            setChangingPlan(null);
          }}
        />
      )}

      {showAssignModal && (
        <AssignSubscriptionModal 
          onClose={() => setShowAssignModal(false)}
          onSave={() => loadSubscriptions()}
        />
      )}

      {showManagePlansModal && (
        <ManagePlansModal
          onClose={() => setShowManagePlansModal(false)}
        />
      )}
    </motion.div>
  );
}

export default SubscriptionManagementPage;
