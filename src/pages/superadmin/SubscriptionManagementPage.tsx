import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Clock, DollarSign, Users, Building, 
  Search, X, Calendar, Save 
} from "lucide-react";

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
                      ${details.price}/mo · {details.seats === "∞" ? "Unlimited seats" : `Up to ${details.seats} seats`}
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
                <span style={{ color: 'var(--sa-text-primary)' }}>${currentPrice}/mo</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--sa-text-secondary)' }}>New price:</span>
                <span style={{ color: 'var(--sa-text-primary)' }}>${newPrice}/mo</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                <span style={{ color: 'var(--sa-text-secondary)' }}>Difference:</span>
                <span style={{ color: priceDiff > 0 ? 'var(--sa-success)' : 'var(--sa-error)' }}>
                  {priceDiff > 0 ? '+' : ''}{priceDiff}/mo
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

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const SUBSCRIPTIONS = [
  { company: "BuildSafe Corp", plan: "Enterprise", price: "$499/mo", nextBilling: "Apr 1 2026", status: "Active", seats: 248, maxSeats: null },
  { company: "SteelWorks Ltd", plan: "Pro", price: "$149/mo", nextBilling: "Mar 30 2026", status: "Active", seats: 78, maxSeats: 200 },
  { company: "GreenField Mining", plan: "Basic", price: "$49/mo", nextBilling: "Apr 9 2026", status: "Active", seats: 18, maxSeats: 50 },
  { company: "AeroCraft Inc", plan: "Enterprise", price: "$499/mo", nextBilling: "Apr 15 2026", status: "Active", seats: 519, maxSeats: null },
  { company: "Harbor Logistics", plan: "Pro", price: "$149/mo", nextBilling: "—", status: "Suspended", seats: 87, maxSeats: 200 },
];

export function SubscriptionManagementPage() {
  const [search, setSearch] = useState("");
  const [changingPlan, setChangingPlan] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const totalMRR = SUBSCRIPTIONS.reduce((acc, sub) => {
    if (sub.plan === "Enterprise") return acc + 499;
    if (sub.plan === "Pro") return acc + 149;
    if (sub.plan === "Basic") return acc + 49;
    return acc;
  }, 0);

  const activeCount = SUBSCRIPTIONS.filter(s => s.status === "Active").length;
  const paidCount = SUBSCRIPTIONS.filter(s => s.plan === "Enterprise" || s.plan === "Pro").length;
  const proCount = SUBSCRIPTIONS.filter(s => s.plan === "Pro").length;

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Subscription Ledger</h1>
          <p className="text-slate-500 mt-1">Manage global billing cycles, plan conversions, and revenue flow</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <DollarSign className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>Projected MRR: ${totalMRR.toLocaleString()}</span>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden text-white"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <TrendingUp size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Financial Intelligence</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Revenue Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">{activeCount} Productive Business Subscriptions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(44, 110, 213, 0.1)" }}>
              <DollarSign className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-text-primary)" }}>${totalMRR}</div>
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
          <div className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>out of {SUBSCRIPTIONS.length} total</div>
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
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
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
              {SUBSCRIPTIONS.map((sub, index) => (
                <motion.tr
                  key={sub.company}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-[var(--sa-hover)] transition"
                  style={{ borderColor: "var(--sa-border)" }}
                >
                  <td className="p-4 font-medium" style={{ color: "var(--sa-text-primary)" }}>{sub.company}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: sub.plan === "Enterprise" ? "rgba(44, 110, 213, 0.1)" :
                                       sub.plan === "Pro" ? "rgba(40, 167, 69, 0.1)" :
                                       "rgba(44, 110, 213, 0.1)",
                        color: sub.plan === "Enterprise" ? "var(--sa-primary)" :
                               sub.plan === "Pro" ? "var(--sa-success)" :
                               "var(--sa-info)"
                      }}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="p-4" style={{ color: "var(--sa-text-primary)" }}>{sub.price}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <span style={{ color: "var(--sa-text-secondary)" }}>{sub.seats} / {sub.maxSeats ?? "∞"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <span style={{ color: "var(--sa-text-secondary)" }}>{sub.nextBilling}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span style={{ 
                      color: sub.status === "Active" ? "var(--sa-success)" :
                             sub.status === "Suspended" ? "var(--sa-error)" :
                             "var(--sa-warning)"
                    }}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setChangingPlan(sub);
                        setShowPlanModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition border hover:bg-[var(--sa-hover)]"
                      style={{ 
                        borderColor: "var(--sa-border)",
                        color: "var(--sa-text-secondary)",
                        backgroundColor: "var(--sa-card)"
                      }}
                    >
                      Change Plan
                    </button>
                  </td>
                </motion.tr>
              ))}
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
    </motion.div>
  );
}

export default SubscriptionManagementPage;
