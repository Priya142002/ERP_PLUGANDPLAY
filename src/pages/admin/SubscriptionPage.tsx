import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Check, Crown, Zap, Building2, Headphones, CreditCard
} from "lucide-react";
import { Button } from "../../components/ui";
import { PLAN_FEATURES } from "../../utils/subscriptionAccess";
import "../../styles/admin-mobile.css";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const PLANS = [
  {
    id: "basic",
    name: "Starter",
    icon: Zap,
    price: 2499,
    description: "Perfect for small businesses getting started with ERP",
    color: "from-blue-500 to-blue-600",
    modules: ['Inventory', 'Purchase', 'Sales', 'Accounts'],
    features: [
      "Up to 10 users",
      "4 core ERP modules",
      "25GB cloud storage",
      "Email & chat support",
      "Basic reports & analytics",
      "Mobile app access",
      "Data backup (weekly)",
      "Standard security"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Professional",
    icon: Crown,
    price: 6499,
    description: "For growing businesses with advanced operational needs",
    color: "from-purple-500 to-pink-500",
    modules: ['Inventory', 'Purchase', 'Sales', 'Accounts', 'CRM', 'HRM', 'Projects', 'Helpdesk', 'Assets', 'Logistics', 'Production', 'Billing'],
    features: [
      "Up to 50 users",
      "All 12 ERP modules",
      "100GB cloud storage",
      "Priority support (24/5)",
      "Advanced analytics & custom reports",
      "Mobile app access",
      "API access & integrations",
      "Data backup (daily)",
      "Multi-branch support",
      "Custom workflows",
      "Role-based permissions"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: 16499,
    description: "For large organizations requiring full control and customization",
    color: "from-orange-500 to-red-500",
    modules: ['All 12 modules', 'Custom modules'],
    features: [
      "Unlimited users",
      "All 12 modules + custom modules",
      "Unlimited cloud storage",
      "24/7 dedicated support",
      "Enterprise analytics & BI tools",
      "Mobile app access",
      "Full API access",
      "Real-time data backup",
      "Multi-company management",
      "White-label options",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee (99.9% uptime)",
      "Advanced security & compliance",
      "On-premise deployment option"
    ],
    popular: false
  }
];

export function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const currentPlan = "pro"; // This would come from context/API

  const getPrice = (basePrice: number) => {
    if (billingCycle === "yearly") {
      return Math.round(basePrice * 12 * 0.9); // 10% discount for yearly
    }
    return basePrice;
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-6xl mx-auto min-h-0">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Choose Your Plan
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Select the perfect plan for your business. Upgrade or downgrade anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 rounded-full transition-colors"
            style={{ backgroundColor: billingCycle === "yearly" ? "var(--primary)" : "#cbd5e1" }}
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: billingCycle === "yearly" ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-500"}`}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Save 10%
            </span>
          )}
        </div>
      </div>

      {/* Current Plan Info */}
      <div className="max-w-2xl mx-auto p-4 rounded-xl border-2 border-dashed"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  Current Plan: Pro
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Next billing: April 30, 2026 • ₹{(6499).toLocaleString('en-IN')}/month
              </p>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ 
              backgroundColor: '#1a2744',
              color: '#ffffff',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#1a2744';
              e.currentTarget.style.border = '1px solid #1a2744';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a2744';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.border = 'none';
            }}
          >
            <CreditCard className="h-4 w-4" />
            Billing History
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto admin-cards-grid">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;
          const price = getPrice(plan.price);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl overflow-hidden ${
                plan.popular ? "ring-2 ring-purple-500 shadow-xl scale-102" : "shadow-md"
              }`}
              style={{ backgroundColor: "var(--card)", maxHeight: "500px" }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}

              {/* Card Header */}
              <div className={`p-4 bg-gradient-to-br ${plan.color} text-white`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-white/80 text-sm">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "300px" }}>
                {/* Modules Included */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Modules ({plan.modules.length})
                  </h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plan.modules.slice(0, 3).map((module, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                        {module}
                      </span>
                    ))}
                    {plan.modules.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        +{plan.modules.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2">
                  {plan.features.slice(0, 6).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-xs text-slate-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 6 && (
                    <li className="text-xs text-slate-500 pl-6">
                      +{plan.features.length - 6} more features
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  <button 
                    className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ 
                      backgroundColor: '#1a2744',
                      color: '#ffffff',
                      opacity: '0.7'
                    }}
                    disabled
                  >
                    Current Plan
                  </button>
                ) : (
                  <button 
                    className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ 
                      backgroundColor: '#1a2744',
                      color: '#ffffff',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0f172a';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a2744';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    {plan.id === "basic" ? "Downgrade" : "Upgrade"} to {plan.name}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-bold text-center mb-6" style={{ color: "var(--text-primary)" }}>
          Compare Plans
        </h2>
        <div className="rounded-lg border overflow-hidden admin-table-container" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", maxHeight: "400px", overflowY: "auto" }}>
          <table className="w-full admin-table">
            <thead className="sticky top-0">
              <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--hover)" }}>
                <th className="p-3 text-left text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Feature</th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Basic</th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Pro</th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Users", basic: "10", pro: "50", enterprise: "Unlimited" },
                { feature: "Storage", basic: "25GB", pro: "100GB", enterprise: "Unlimited" },
                { feature: "ERP Modules", basic: "4 Core", pro: "All 12", enterprise: "All 12 + Custom" },
                { feature: "Support", basic: "Email & Chat", pro: "Priority (24/5)", enterprise: "24/7 Dedicated" },
                { feature: "Data Backup", basic: "Weekly", pro: "Daily", enterprise: "Real-time" },
                { feature: "API Access", basic: "—", pro: "✓", enterprise: "Full Access" },
                { feature: "Multi-branch", basic: "—", pro: "✓", enterprise: "✓" },
                { feature: "Custom Workflows", basic: "—", pro: "✓", enterprise: "✓" }
              ].map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{row.feature}</td>
                  <td className="p-3 text-sm text-center text-slate-600">{row.basic}</td>
                  <td className="p-3 text-sm text-center text-slate-600">{row.pro}</td>
                  <td className="p-3 text-sm text-center text-slate-600">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Need Help Choosing?
        </h2>
        <p className="text-slate-600 mb-4 text-sm">
          Our team is here to help you find the perfect plan for your business needs.
        </p>
        <button 
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ 
            backgroundColor: '#1a2744',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0f172a';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1a2744';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <Headphones className="h-4 w-4" />
          Contact Sales
        </button>
      </div>
    </motion.div>
  );
}

export default SubscriptionPage;
