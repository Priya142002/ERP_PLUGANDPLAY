import { motion } from "framer-motion";
import { useState } from "react";
import { Check, X, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import "../../styles/admin-mobile.css";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// All 14 ERP modules
const ALL_MODULES = [
  { id: "admin", name: "Admin" },
  { id: "accounts", name: "Accounts" },
  { id: "purchase", name: "Purchase" },
  { id: "sales", name: "Sales" },
  { id: "inventory", name: "Inventory" },
  { id: "project", name: "Project" },
  { id: "hr", name: "HR" },
  { id: "payroll", name: "Payroll" },
  { id: "crm", name: "CRM" },
  { id: "pos", name: "POS" },
  { id: "helpdesk", name: "Helpdesk" },
  { id: "assets", name: "Assets" },
  { id: "logistics", name: "Logistics" },
  { id: "production", name: "Production" }
];

const PLANS = [
  {
    id: "basic",
    name: "BASIC",
    price: 0,
    priceLabel: "FREE",
    subtitle: "For 1 User",
    buttonText: "TRY NOW",
    modules: ["admin", "accounts", "purchase", "sales", "inventory", "crm"]
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    monthlyPrice: 300,
    buttonText: "TRY NOW",
    modules: ["admin", "accounts", "purchase", "sales", "inventory", "project", "crm"]
  },
  {
    id: "premium",
    name: "PREMIUM",
    monthlyPrice: 400,
    buttonText: "TRY NOW",
    modules: ["admin", "accounts", "purchase", "sales", "inventory", "project", "hr", "crm"]
  },
  {
    id: "ultimate",
    name: "ULTIMATE",
    monthlyPrice: 550,
    buttonText: "TRY NOW",
    modules: ALL_MODULES.map(m => m.id)
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: null,
    subtitle: "Fully Customizable Plan",
    buttonText: "BUILD YOUR PLAN",
    isCustom: true,
    modules: ALL_MODULES.map(m => m.id)
  }
];

// Detailed features for comparison table based on actual project structure
const MODULE_FEATURES = {
  admin: {
    name: "Admin",
    features: [
      "Company Management",
      "User Management",
      "User Access Control",
      "Role-based Permissions",
      "Audit Logs & Activity Tracking",
      "System Configuration",
      "Security Settings"
    ]
  },
  accounts: {
    name: "Accounts",
    features: [
      "Chart of Accounts",
      "Payment Voucher",
      "Receipt Voucher",
      "Journal Voucher",
      "Financial Reports",
      "Account Management",
      "Fiscal Year & Accounting Period",
      "Tax Management",
      "Balance Sheet",
      "Profit & Loss Statement",
      "Cash Flow Reports",
      "Trial Balance"
    ]
  },
  purchase: {
    name: "Purchase",
    features: [
      "Vendor Management",
      "Purchase Invoice",
      "Purchase Return",
      "Vendor Payment",
      "Vendor Credit Note",
      "Vendor Debit Note",
      "Purchase Reports",
      "Purchase Dashboard",
      "Supplier Analytics",
      "Payment History Tracking",
      "Purchase Trends Analysis"
    ]
  },
  sales: {
    name: "Sales",
    features: [
      "Customer Management",
      "Quotation Management",
      "Sales Invoice",
      "Sales Return",
      "Customer Payment",
      "Customer Credit Note",
      "Customer Debit Note",
      "Sales Reports",
      "Sales Dashboard",
      "Sales Analytics",
      "Customer Insights"
    ]
  },
  inventory: {
    name: "Inventory",
    features: [
      "Product Management",
      "Material Dispatch",
      "Product Transfer",
      "Product Receive",
      "Stock Management",
      "Inventory Reports",
      "Inventory Dashboard",
      "Stock Alerts",
      "Warehouse Management",
      "Batch & Serial Tracking"
    ]
  },
  project: {
    name: "Project",
    features: [
      "Project Dashboard",
      "Project Management",
      "Task Board",
      "Project Status Tracking",
      "Team Collaboration",
      "Milestone Tracking",
      "Time Tracking",
      "Project Reports"
    ]
  },
  hr: {
    name: "HR",
    features: [
      "Employee Directory",
      "Attendance Calendar",
      "Leave Management",
      "HR Dashboard",
      "Employee Records",
      "Department Management",
      "Designation Management",
      "Performance Tracking"
    ]
  },
  payroll: {
    name: "Payroll",
    features: [
      "Payroll Dashboard",
      "Salary Processing",
      "Tax Calculations",
      "Payslip Generation",
      "Salary Structure",
      "Deductions & Benefits",
      "Payroll Reports"
    ]
  },
  crm: {
    name: "CRM",
    features: [
      "CRM Dashboard",
      "Leads Management",
      "Opportunities Tracking",
      "Activities & Follow-ups",
      "Customer Interaction Logs",
      "Sales Pipeline",
      "Lead Conversion Tracking",
      "Customer Engagement"
    ]
  },
  pos: {
    name: "POS",
    features: [
      "POS Dashboard",
      "Billing / Sales Screen",
      "Customer Management",
      "Payment Management",
      "Order Management",
      "Inventory Sync",
      "Invoice & Receipt",
      "Multi-payment Methods",
      "Quick Checkout",
      "Sales Reports"
    ]
  },
  helpdesk: {
    name: "Helpdesk",
    features: [
      "Ticket Dashboard",
      "Ticket Management",
      "SLA Monitoring",
      "Priority Management",
      "Ticket Assignment",
      "Customer Support",
      "Response Tracking",
      "Helpdesk Reports"
    ]
  },
  assets: {
    name: "Assets",
    features: [
      "Asset Intelligence Dashboard",
      "Asset Management & Allocation",
      "Depreciation Engine",
      "Maintenance Logs",
      "Asset Disposal",
      "Asset Reports",
      "Asset Tracking",
      "Asset Lifecycle Management"
    ]
  },
  logistics: {
    name: "Logistics",
    features: [
      "Fleet Intelligence Dashboard",
      "Order Processing",
      "Shipment Tracking",
      "Delivery Routes",
      "Carrier Partners",
      "Customer Feedback",
      "Delivery Management",
      "Logistics Reports"
    ]
  },
  production: {
    name: "Production",
    features: [
      "Production Dashboard",
      "Bill of Materials (BOM)",
      "Production Planning",
      "Work Orders",
      "Inventory Movement",
      "Quality Check",
      "Production Reports",
      "Manufacturing Process"
    ]
  },
  billing: {
    name: "Billing",
    features: [
      "Billing Dashboard",
      "Invoice Management",
      "Payment Reminders",
      "Recurring Billing",
      "Payment Tracking",
      "Billing Reports"
    ]
  }
};

export function SubscriptionPage() {
  const [viewMode, setViewMode] = useState<"features" | "compare">("features");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [userCount, setUserCount] = useState(5);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const expandAll = () => {
    if (expandedModules.length === Object.keys(MODULE_FEATURES).length) {
      setExpandedModules([]);
    } else {
      setExpandedModules(Object.keys(MODULE_FEATURES));
    }
  };

  const calculatePrice = (pricePerUser: number, users: number) => {
    if (pricePerUser === 0) return 0;
    return pricePerUser * users;
  };

  const getPrice = (plan: typeof PLANS[0]) => {
    if (plan.price === 0) return "FREE";
    if (plan.price === null) return null;
    
    const monthlyTotal = calculatePrice(plan.monthlyPrice || 0, userCount);
    const yearlyTotal = monthlyTotal * 12;
    const yearlyWithDiscount = Math.round(yearlyTotal * 0.92);
    
    if (billingCycle === "annually") {
      return `₹ ${yearlyWithDiscount.toLocaleString('en-IN')}`;
    }
    return `₹ ${monthlyTotal.toLocaleString('en-IN')}`;
  };

  const getSubtitle = (plan: typeof PLANS[0]) => {
    if (plan.id === "basic") return plan.subtitle;
    if (plan.id === "enterprise") return null;
    
    if (billingCycle === "annually") {
      return `/year for ${userCount} ${userCount === 1 ? 'user' : 'users'}`;
    }
    return `/month for ${userCount} ${userCount === 1 ? 'user' : 'users'}`;
  };

  const getPricePerUser = (plan: typeof PLANS[0]) => {
    if (plan.price === 0 || plan.price === null) return null;
    return `₹${plan.monthlyPrice}/user/month`;
  };

  const hasFeature = (planId: string, moduleId: string, featureIndex: number) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return false;
    
    // Check if module is included in plan
    if (!plan.modules.includes(moduleId)) return false;
    
    const moduleFeatures = MODULE_FEATURES[moduleId as keyof typeof MODULE_FEATURES];
    if (!moduleFeatures) return false;
    
    const totalFeatures = moduleFeatures.features.length;
    
    // Basic plan: Limited features (40% of features)
    if (planId === "basic") {
      return featureIndex < Math.ceil(totalFeatures * 0.4);
    }
    
    // Professional plan: More features (60% of features)
    if (planId === "professional") {
      return featureIndex < Math.ceil(totalFeatures * 0.6);
    }
    
    // Premium plan: Most features (80% of features)
    if (planId === "premium") {
      return featureIndex < Math.ceil(totalFeatures * 0.8);
    }
    
    // Ultimate and Enterprise: All features
    return true;
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with View Toggle */}
      <div className="flex flex-col items-center gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-0 bg-white rounded-full shadow-md overflow-hidden border-2 border-[#FF9800]">
          <button
            onClick={() => setViewMode("features")}
            className={`px-8 py-2.5 text-sm font-medium transition-all ${
              viewMode === "features"
                ? "bg-white text-slate-700 border-r-2 border-[#FF9800]"
                : "bg-[#FF9800] text-white"
            }`}
          >
            Features List
          </button>
          <button
            onClick={() => setViewMode("compare")}
            className={`px-8 py-2.5 text-sm font-medium transition-all ${
              viewMode === "compare"
                ? "bg-[#FF9800] text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Compare Plans
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-0 bg-white rounded-full shadow-md overflow-hidden border border-slate-200">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-8 py-2.5 text-sm font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-[#002147] text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-2 ${
              billingCycle === "annually"
                ? "bg-[#002147] text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Annually
            {billingCycle === "annually" && (
              <span className="text-xs">(1 Month Free Trial)</span>
            )}
          </button>
        </div>

        {/* User Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Select Users :</label>
          <select
            value={userCount}
            onChange={(e) => setUserCount(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#002147]"
          >
            {[1, 3, 5, 10, 20, 50, 100].map(count => (
              <option key={count} value={count}>{count} {count === 1 ? 'User' : 'Users'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Features List View */}
      {viewMode === "features" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${
                plan.id === "enterprise" 
                  ? "border-2 border-[#FF9800] shadow-lg" 
                  : "border border-slate-200 shadow-md hover:border-[#002147]/30"
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                
                {plan.isCustom ? (
                  <div className="mb-4">
                    <div className="flex justify-center mb-3">
                      <Briefcase className="h-16 w-16 text-slate-700" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Tailor Your ERP</p>
                    <p className="text-xs text-slate-600">{plan.subtitle}</p>
                  </div>
                ) : (
                  <>
                    {plan.price === 0 ? (
                      <>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{plan.priceLabel}</div>
                        <div className="text-xs text-slate-600">{plan.subtitle}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{getPrice(plan)}</div>
                        <div className="text-xs text-slate-600 mb-1">{getSubtitle(plan)}</div>
                        {getPricePerUser(plan) && (
                          <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                            {getPricePerUser(plan)}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              <button
                className="w-full py-3 rounded-lg text-sm font-bold text-white mb-4 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 bg-[#002147] hover:bg-[#003366]"
              >
                {plan.buttonText}
              </button>

              {!plan.isCustom && (
                <div className="space-y-2 flex-1">
                  {ALL_MODULES.map(module => {
                    const isIncluded = plan.modules.includes(module.id);
                    return (
                      <div key={module.id} className="flex items-center gap-2">
                        {isIncluded ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" strokeWidth={3} />
                        ) : (
                          <X className="h-4 w-4 text-red-500 flex-shrink-0" strokeWidth={3} />
                        )}
                        <span className={`text-sm ${isIncluded ? "text-slate-700" : "text-slate-400"}`}>
                          {module.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Compare Plans View */}
      {viewMode === "compare" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50">
            <div className="p-4 flex items-center">
              <button
                onClick={expandAll}
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
              >
                <input type="checkbox" checked={expandedModules.length === Object.keys(MODULE_FEATURES).length} readOnly />
                <span>Expand all</span>
              </button>
            </div>
            {PLANS.map(plan => (
              <div key={plan.id} className="p-4 text-center border-l border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{plan.name}</h3>
                <button className="px-4 py-2 border-2 border-slate-900 rounded-lg text-sm font-medium hover:bg-slate-900 hover:text-white transition-colors">
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Module Features */}
          {Object.entries(MODULE_FEATURES).map(([moduleId, moduleData]) => {
            const isExpanded = expandedModules.includes(moduleId);
            
            return (
              <div key={moduleId} className="border-b border-slate-200">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(moduleId)}
                  className="w-full grid grid-cols-6 p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {moduleData.name}
                  </div>
                  {PLANS.map(plan => (
                    <div key={plan.id} className="flex items-center justify-center border-l border-slate-200">
                      {plan.modules.includes(moduleId) ? (
                        <Check className="h-5 w-5 text-green-500" strokeWidth={3} />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  ))}
                </button>

                {/* Feature Details */}
                {isExpanded && (
                  <div className="bg-slate-50/50">
                    {moduleData.features.map((feature, idx) => (
                      <div key={idx} className="grid grid-cols-6 p-3 border-t border-slate-100">
                        <div className="text-sm text-slate-600 pl-8">{feature}</div>
                        {PLANS.map(plan => (
                          <div key={plan.id} className="flex items-center justify-center border-l border-slate-100">
                            {hasFeature(plan.id, moduleId, idx) ? (
                              <Check className="h-4 w-4 text-green-500" strokeWidth={2} />
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center text-xs text-slate-600 mt-6">
        * Local taxes (VAT, GST etc.) will be charged in addition to the prices mentioned.
      </div>
    </motion.div>
  );
}

export default SubscriptionPage;
