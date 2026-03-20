import { motion } from "framer-motion";
import { useMemo } from "react";
import { 
  Puzzle, ToggleLeft, ToggleRight, Archive, ShoppingCart, 
  TrendingUp, BookOpen, Users, Briefcase, Headphones, 
  Truck, Factory, Receipt, Lock, Crown
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useModulesSafe } from "../../context/ModuleContext";
import type { SubscriptionPlan } from "../../utils/subscriptionAccess";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const MODULE_ICONS: Record<string, any> = {
  "archive": Archive,
  "shopping-cart": ShoppingCart,
  "presentation-chart-line": TrendingUp,
  "book-open": BookOpen,
  "user-group": Users,
  "clipboard-list": Briefcase,
  "support": Headphones,
  "truck": Truck,
  "factory": Factory,
  "receipt-tax": Receipt
};

const ALL_MODULES = [
  { id: "inventory", name: "Inventory Management", description: "Products, stock, warehouses, transfers", icon: "archive", plan: "basic" as SubscriptionPlan },
  { id: "purchase", name: "Purchase Management", description: "Vendors, POs, invoices, payments", icon: "shopping-cart", plan: "basic" as SubscriptionPlan },
  { id: "sales", name: "Sales Management", description: "Customers, quotations, invoices", icon: "presentation-chart-line", plan: "basic" as SubscriptionPlan },
  { id: "accounts", name: "Accounts & Finance", description: "Chart of accounts, vouchers, reports", icon: "book-open", plan: "basic" as SubscriptionPlan },
  { id: "crm", name: "CRM", description: "Leads, opportunities, follow-ups", icon: "user-group", plan: "pro" as SubscriptionPlan },
  { id: "hrm", name: "HRM", description: "Employees, attendance, payroll", icon: "user-group", plan: "pro" as SubscriptionPlan },
  { id: "projects", name: "Projects", description: "Project management, tasks, timesheets", icon: "clipboard-list", plan: "pro" as SubscriptionPlan },
  { id: "helpdesk", name: "Helpdesk", description: "Ticket management, SLA monitoring", icon: "support", plan: "pro" as SubscriptionPlan },
  { id: "assets", name: "Assets", description: "Asset tracking, depreciation, maintenance", icon: "archive", plan: "pro" as SubscriptionPlan },
  { id: "logistics", name: "Logistics", description: "Shipment tracking, delivery management", icon: "truck", plan: "pro" as SubscriptionPlan },
  { id: "production", name: "Production", description: "BOM, work orders, quality control", icon: "factory", plan: "pro" as SubscriptionPlan },
  { id: "billing", name: "Billing", description: "Invoice management, payment reminders", icon: "receipt-tax", plan: "pro" as SubscriptionPlan }
];

const PLAN_INFO: Record<SubscriptionPlan, { name: string; color: string; maxModules: number }> = {
  basic: { name: "Basic", color: "blue", maxModules: 4 },
  pro: { name: "Pro", color: "purple", maxModules: 12 },
  enterprise: { name: "Enterprise", color: "orange", maxModules: 12 }
};

export function ModulesPage() {
  const { state } = useApp();
  const { toggleModule, isModuleEnabled } = useModulesSafe();

  // Get current user's subscription plan
  // For demo purposes, defaulting to 'pro'. In production, this would come from:
  // 1. Get user's companyId
  // 2. Find active CompanySubscription for that company
  // 3. Get the subscription plan from that
  const CURRENT_PLAN: SubscriptionPlan = useMemo(() => {
    if (state.user?.role === 'admin' && state.user.companyId) {
      const companySubscription = state.companySubscriptions.find(
        cs => cs.companyId === state.user?.companyId && cs.status === 'active'
      );
      
      if (companySubscription) {
        const subscription = state.subscriptions.find(
          s => s.id === companySubscription.subscriptionId
        );
        
        // Map subscription plan name to our plan type
        if (subscription) {
          const planName = subscription.planName.toLowerCase();
          if (planName.includes('basic')) return 'basic';
          if (planName.includes('enterprise')) return 'enterprise';
          return 'pro';
        }
      }
    }
    // Default to pro for demo
    return 'pro';
  }, [state.user, state.companySubscriptions, state.subscriptions]);

  const currentPlanInfo = PLAN_INFO[CURRENT_PLAN];

  // Merge module definitions with enabled states
  const modules = ALL_MODULES.map(module => ({
    ...module,
    enabled: isModuleEnabled(module.id)
  }));

  const handleToggleModule = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (!module) return;

    // Check if module is available in current plan
    if (!isModuleAvailable(module)) {
      return; // Can't toggle locked modules
    }

    toggleModule(id);
  };

  const isModuleAvailable = (module: typeof ALL_MODULES[0]) => {
    if (CURRENT_PLAN === "basic") {
      return module.plan === "basic";
    }
    return true; // Pro and Enterprise have access to all modules
  };

  const availableModules = modules.filter(m => isModuleAvailable(m));
  const lockedModules = modules.filter(m => !isModuleAvailable(m));
  const enabledCount = availableModules.filter(m => m.enabled).length;

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            My Modules
          </h1>
          <p className="text-slate-500 mt-1">Enable or disable modules for your company</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <Puzzle className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {enabledCount} / {availableModules.length} Active
          </span>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className="p-6 rounded-2xl border-2 relative overflow-hidden"
        style={{ 
          borderColor: "var(--border)", 
          background: `linear-gradient(135deg, ${
            currentPlanInfo.color === 'blue' ? '#3b82f6' : 
            currentPlanInfo.color === 'purple' ? '#a855f7' : '#f97316'
          } 0%, ${
            currentPlanInfo.color === 'blue' ? '#2563eb' : 
            currentPlanInfo.color === 'purple' ? '#9333ea' : '#ea580c'
          } 100%)`
        }}>
        <div className="relative z-10 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Current Plan: {currentPlanInfo.name}</h3>
              <p className="text-white/90 text-sm mt-1">
                You have access to {currentPlanInfo.maxModules} modules
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/subscription'}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-medium text-sm transition"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Available Modules", value: availableModules.length, color: "var(--primary)" },
          { label: "Enabled Modules", value: enabledCount, color: "var(--success)" },
          { label: "Locked Modules", value: lockedModules.length, color: "var(--warning)" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Available Modules */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Available Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModules.map((module, index) => {
            const IconComponent = MODULE_ICONS[module.icon] || Puzzle;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl border hover:shadow-lg transition-all"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, var(--primary), transparent 90%)` }}>
                      <IconComponent className="h-5 w-5" style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {module.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleModule(module.id)}
                    className="transition-transform hover:scale-110"
                  >
                    {module.enabled ? (
                      <ToggleRight className="h-8 w-8" style={{ color: "var(--success)" }} />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-slate-300" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex ${
                  module.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {module.enabled ? "Enabled" : "Disabled"}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Locked Modules */}
      {lockedModules.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Locked Modules
            <span className="text-sm font-normal text-slate-500 ml-2">
              (Upgrade to unlock)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedModules.map((module, index) => {
              const IconComponent = MODULE_ICONS[module.icon] || Puzzle;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-xl border relative overflow-hidden opacity-60"
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="absolute top-2 right-2">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-slate-100">
                        <IconComponent className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-600">
                          {module.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{module.description}</p>
                  <div className="px-2 py-1 rounded-full text-xs font-medium inline-flex bg-orange-100 text-orange-700">
                    Requires {module.plan === "pro" ? "Pro" : "Enterprise"} Plan
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Disabling a module will hide it from your navigation menu. 
          You can re-enable it anytime. Locked modules require a plan upgrade.
        </p>
      </div>
    </motion.div>
  );
}

export default ModulesPage;
