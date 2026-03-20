import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Check, Crown, Zap, Building2, Headphones, CreditCard
} from "lucide-react";
import { Button } from "../../components/ui";
import { PLAN_FEATURES } from "../../utils/subscriptionAccess";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    icon: Zap,
    price: 49,
    description: "Perfect for small businesses getting started",
    color: "from-blue-500 to-blue-600",
    modules: PLAN_FEATURES.basic.moduleList,
    features: [
      "Up to 50 users",
      `${PLAN_FEATURES.basic.modules} core ERP modules`,
      "10GB storage",
      "Email support",
      "Basic reporting",
      "Mobile app access"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    price: 149,
    description: "For growing businesses with advanced needs",
    color: "from-purple-500 to-pink-500",
    modules: PLAN_FEATURES.pro.moduleList,
    features: [
      "Up to 200 users",
      `All ${PLAN_FEATURES.pro.modules} ERP modules`,
      "100GB storage",
      "Priority support",
      "Advanced analytics",
      "API access",
      "Custom workflows",
      "Multi-location support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: 499,
    description: "For large organizations requiring full control",
    color: "from-orange-500 to-red-500",
    modules: PLAN_FEATURES.enterprise.moduleList,
    features: [
      "Unlimited users",
      `All ${PLAN_FEATURES.enterprise.modules} ERP modules`,
      "Unlimited storage",
      "24/7 dedicated support",
      "Custom reports",
      "White-label options",
      "Dedicated account manager",
      "SLA guarantees",
      "Advanced security"
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
    <motion.div {...pageMotion} className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Choose Your Plan
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select the perfect plan for your business. Upgrade or downgrade anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
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
      <div className="max-w-3xl mx-auto p-6 rounded-2xl border-2 border-dashed"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Current Plan: Pro
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Next billing: April 30, 2026 • $149/month • {PLAN_FEATURES.pro.modules} modules enabled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing History
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular ? "ring-2 ring-purple-500 shadow-2xl scale-105" : "shadow-lg"
              }`}
              style={{ backgroundColor: "var(--card)" }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-bl-xl">
                  MOST POPULAR
                </div>
              )}

              {/* Card Header */}
              <div className={`p-6 bg-gradient-to-br ${plan.color} text-white`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-white/80">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                {/* Modules Included */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Modules Included ({plan.modules.length})
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.modules.slice(0, 4).map((module, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                        {module}
                      </span>
                    ))}
                    {plan.modules.length > 4 && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        +{plan.modules.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    variant={plan.popular ? "primary" : "secondary"} 
                    className="w-full"
                  >
                    {plan.id === "basic" ? "Downgrade" : "Upgrade"} to {plan.name}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
          Compare Plans
        </h2>
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--hover)" }}>
                <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Feature</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Basic</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Pro</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Users", basic: "50", pro: "200", enterprise: "Unlimited" },
                { feature: "Storage", basic: "10GB", pro: "100GB", enterprise: "Unlimited" },
                { feature: "ERP Modules", basic: "Core (4)", pro: "All (12)", enterprise: "All (12)" },
                { feature: "Support", basic: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
                { feature: "API Access", basic: "—", pro: "✓", enterprise: "✓" },
                { feature: "White Label", basic: "—", pro: "—", enterprise: "✓" },
                { feature: "SLA", basic: "—", pro: "—", enterprise: "✓" }
              ].map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="p-4 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{row.feature}</td>
                  <td className="p-4 text-sm text-center text-slate-600">{row.basic}</td>
                  <td className="p-4 text-sm text-center text-slate-600">{row.pro}</td>
                  <td className="p-4 text-sm text-center text-slate-600">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Need Help Choosing?
        </h2>
        <p className="text-slate-600 mb-6">
          Our team is here to help you find the perfect plan for your business needs.
        </p>
        <Button variant="primary">
          <Headphones className="h-4 w-4 mr-2" />
          Contact Sales
        </Button>
      </div>
    </motion.div>
  );
}

export default SubscriptionPage;
