import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Puzzle, ToggleLeft, ToggleRight, Archive, ShoppingCart, 
  TrendingUp, BookOpen, Users, Briefcase, Headphones, 
  Truck, Factory, Receipt, Search, Building2, ChevronRight,
  CheckCircle2, XCircle, Package, Clock, X, Save
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const MODULE_ICONS: Record<string, any> = {
  "Inventory Management": Archive,
  "Purchase Management": ShoppingCart,
  "Sales Management": TrendingUp,
  "Accounts & Finance": BookOpen,
  "CRM": Users,
  "HRM": Users,
  "Projects": Briefcase,
  "Helpdesk": Headphones,
  "Assets": Package,
  "Logistics": Truck,
  "Production": Factory,
  "Billing": Receipt
};

const ALL_MODULES = [
  { id: "inventory", name: "Inventory Management", description: "Products, stock, warehouses, transfers", category: "Operations" },
  { id: "purchase", name: "Purchase Management", description: "Vendors, POs, invoices, payments", category: "Operations" },
  { id: "sales", name: "Sales Management", description: "Customers, quotations, invoices", category: "Operations" },
  { id: "accounts", name: "Accounts & Finance", description: "Chart of accounts, vouchers, reports", category: "Finance" },
  { id: "crm", name: "CRM", description: "Leads, opportunities, follow-ups", category: "Sales" },
  { id: "hrm", name: "HRM", description: "Employees, attendance, payroll", category: "HR" },
  { id: "projects", name: "Projects", description: "Project management, tasks, timesheets", category: "Operations" },
  { id: "helpdesk", name: "Helpdesk", description: "Ticket management, SLA monitoring", category: "Support" },
  { id: "assets", name: "Assets", description: "Asset tracking, depreciation, maintenance", category: "Finance" },
  { id: "logistics", name: "Logistics", description: "Shipment tracking, delivery management", category: "Operations" },
  { id: "production", name: "Production", description: "BOM, work orders, quality control", category: "Manufacturing" },
  { id: "billing", name: "Billing", description: "Invoice management, payment reminders", category: "Finance" }
];

interface CompanyModules {
  [companyId: string]: {
    [moduleId: string]: boolean;
  };
}

function TrialAccessModal({
  company,
  defaultModules,
  onClose,
  onSave,
}: {
  company?: any;
  defaultModules: string[];
  onClose: () => void;
  onSave: (modules: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(
    company
      ? (company.allowedModules && company.allowedModules.length > 0 ? company.allowedModules : defaultModules)
      : defaultModules
  );

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const isGlobal = !company;
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#1a2744" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Trial Access Modules</h2>
              <p className="text-xs text-white/60">
                {isGlobal ? 'Default — applies to all companies' : company.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Subheader */}
        <div className={`px-6 py-3 border-b ${isGlobal ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'}`}>
          <p className={`text-xs ${isGlobal ? 'text-amber-700' : 'text-indigo-700'}`}>
            {isGlobal
              ? 'Setting default trial modules — these will apply to all companies that have no specific assignment.'
              : `Select which modules ${company.name} can access during their 30-day free trial.`}
          </p>
        </div>

        {/* Module grid */}
        <div className="p-5 grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
          {ALL_MODULES.map(mod => {
            const IconComponent = MODULE_ICONS[mod.name] || Puzzle;
            const isOn = selected.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => toggle(mod.id)}
                className="flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: isOn ? "#6366f1" : "#e2e8f0",
                  backgroundColor: isOn ? "rgba(99,102,241,0.07)" : "#f8fafc",
                }}
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isOn ? "rgba(99,102,241,0.15)" : "#e2e8f0" }}>
                  <IconComponent className="h-4 w-4" style={{ color: isOn ? "#6366f1" : "#94a3b8" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: isOn ? "#4338ca" : "#475569" }}>
                    {mod.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{mod.category}</p>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isOn ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'
                }`}>
                  {isOn && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(ALL_MODULES.map(m => m.id))}
              onMouseEnter={() => setHoveredBtn('all')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium transition"
              style={{ color: hoveredBtn === 'all' ? '#000000' : '#6366f1', backgroundColor: hoveredBtn === 'all' ? '#e0e7ff' : '#ffffff' }}
            >
              All
            </button>
            <button
              onClick={() => setSelected([])}
              onMouseEnter={() => setHoveredBtn('none')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition"
              style={{ color: hoveredBtn === 'none' ? '#000000' : '#64748b', backgroundColor: hoveredBtn === 'none' ? '#f1f5f9' : '#ffffff' }}
            >
              None
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{selected.length} selected</span>
            <button
              onClick={onClose}
              onMouseEnter={() => setHoveredBtn('cancel')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-4 py-2 rounded-lg text-sm border border-slate-200 transition"
              style={{ color: hoveredBtn === 'cancel' ? '#000000' : '#374151', backgroundColor: hoveredBtn === 'cancel' ? '#f1f5f9' : '#ffffff' }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selected)}
              onMouseEnter={() => setHoveredBtn('save')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition"
              style={{
                backgroundColor: hoveredBtn === 'save' ? '#e2e8f0' : '#1a2744',
                color: hoveredBtn === 'save' ? '#000000' : '#ffffff'
              }}
            >
              <Save className="h-4 w-4" />
              {isGlobal ? 'Save Default' : 'Save Access'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ModulesManagementPage() {
  const { state, dispatch } = useApp();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyModules, setCompanyModules] = useState<CompanyModules>({});
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [defaultTrialModules, setDefaultTrialModules] = useState<string[]>(
    () => {
      try {
        const stored = localStorage.getItem('default_trial_modules');
        if (stored) return JSON.parse(stored);
      } catch {}
      return ['inventory', 'sales', 'purchase', 'accounts'];
    }
  );
  const [trialBtnHover, setTrialBtnHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCompany = state.companies.find(c => c.id === selectedCompanyId);

  const filteredCompanies = state.companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.code?.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.email.toLowerCase().includes(companySearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleModule = (moduleId: string) => {
    if (!selectedCompanyId) return;
    
    setCompanyModules(prev => ({
      ...prev,
      [selectedCompanyId]: {
        ...(prev[selectedCompanyId] || {}),
        [moduleId]: !(prev[selectedCompanyId]?.[moduleId] ?? true)
      }
    }));
  };

  const isModuleEnabled = (moduleId: string): boolean => {
    if (!selectedCompanyId) return false;
    return companyModules[selectedCompanyId]?.[moduleId] ?? true;
  };

  const handleSaveTrialAccess = (modules: string[]) => {
    if (selectedCompanyId) {
      // Save to specific company
      dispatch({
        type: 'UPDATE_COMPANY',
        payload: { id: selectedCompanyId, updates: { allowedModules: modules, updatedAt: new Date() } }
      });
    } else {
      // Save as global default — persist to localStorage + update ALL companies that have no specific assignment
      localStorage.setItem('default_trial_modules', JSON.stringify(modules));
      setDefaultTrialModules(modules);
      // Apply to all companies that don't have a custom allowedModules set
      state.companies.forEach(company => {
        if (!company.allowedModules || company.allowedModules.length === 0) {
          dispatch({
            type: 'UPDATE_COMPANY',
            payload: { id: company.id, updates: { allowedModules: modules, updatedAt: new Date() } }
          });
        }
      });
    }
    setShowTrialModal(false);
  };

  const filteredModules = ALL_MODULES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "all" || m.category === filterCategory)
  );

  const categories = ["all", ...Array.from(new Set(ALL_MODULES.map(m => m.category)))];

  const enabledCount = selectedCompanyId 
    ? ALL_MODULES.filter(m => isModuleEnabled(m.id)).length 
    : 0;

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>
            Company Module Management
          </h1>
          <p className="text-slate-500 mt-1">Select a company and manage their ERP modules</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!selectedCompany) {
                setShowCompanyDropdown(true);
                (dropdownRef.current?.querySelector('input') as HTMLInputElement)?.focus();
              }
              setShowTrialModal(true);
            }}
            onMouseEnter={() => setTrialBtnHover(true)}
            onMouseLeave={() => setTrialBtnHover(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
            style={{
              backgroundColor: trialBtnHover ? "#e2e8f0" : "#1a2744",
              color: trialBtnHover ? "#000000" : "#ffffff"
            }}
          >
            <Clock className="h-4 w-4" />
            Trial Access
          </button>
          {selectedCompany && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
              style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
              <Puzzle className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>
                {enabledCount} / {ALL_MODULES.length} Modules Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Company Selection Dropdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--sa-text-primary)" }}>
            Select Company
          </h2>
        </div>
        
        <div className="relative max-w-md" ref={dropdownRef}>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
            <input
              type="text"
              placeholder="Search and select company..."
              value={selectedCompany ? selectedCompany.name : companySearch}
              onChange={(e) => {
                setCompanySearch(e.target.value);
                setShowCompanyDropdown(true);
                if (selectedCompany) setSelectedCompanyId(null);
              }}
              onFocus={() => setShowCompanyDropdown(true)}
              className="w-full h-12 pl-10 pr-10 rounded-xl border-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--sa-primary)]"
              style={{
                backgroundColor: "var(--sa-card)",
                borderColor: selectedCompany ? "var(--sa-primary)" : "var(--sa-border)",
                color: "var(--sa-text-primary)"
              }}
            />
            {selectedCompany && (
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  setCompanySearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--sa-hover)] transition"
              >
                <XCircle className="h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
              </button>
            )}
          </div>

          {/* Dropdown List */}
          {showCompanyDropdown && !selectedCompany && state.companies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-2 rounded-xl border shadow-lg overflow-hidden max-h-80 overflow-y-auto"
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
            >
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setShowCompanyDropdown(false);
                      setCompanySearch("");
                    }}
                    className="w-full p-3 text-left hover:bg-[var(--sa-hover)] transition border-b last:border-b-0"
                    style={{ borderColor: "var(--sa-border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: company.logo ? 'transparent' : 'color-mix(in srgb, var(--sa-primary), transparent 90%)' }}>
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: "var(--sa-text-primary)" }}>
                          {company.name}
                        </div>
                        <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                          {company.code || 'No code'} • {company.industry}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${company.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>
                  No companies found
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Selected Company Display */}
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border-2"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--sa-primary), transparent 95%)',
              borderColor: "var(--sa-primary)"
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ backgroundColor: selectedCompany.logo ? 'transparent' : 'color-mix(in srgb, var(--sa-primary), transparent 90%)' }}>
                {selectedCompany.logo ? (
                  <img src={selectedCompany.logo} alt={selectedCompany.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6" style={{ color: "var(--sa-primary)" }} />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: "var(--sa-text-primary)" }}>
                  {selectedCompany.name}
                </div>
                <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                  {selectedCompany.code || 'No code'} • {selectedCompany.industry}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${selectedCompany.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs capitalize font-medium" style={{ 
                  color: selectedCompany.status === 'active' ? 'var(--sa-success)' : 'var(--sa-error)'
                }}>
                  {selectedCompany.status}
                </span>
              </div>
              <CheckCircle2 className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
            </div>
          </motion.div>
        )}

        {state.companies.length === 0 && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
            <Building2 className="h-12 w-12 mx-auto mb-3" style={{ color: "var(--sa-text-secondary)" }} />
            <p className="text-sm font-medium mb-1" style={{ color: "var(--sa-text-primary)" }}>
              No Companies Found
            </p>
            <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
              Add companies to manage their modules
            </p>
          </div>
        )}
      </div>

      {/* Module Management Section */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Selected Company Info */}
            <div className="p-5 rounded-xl border shadow-sm"
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: selectedCompany.logo ? 'transparent' : 'color-mix(in srgb, var(--sa-primary), transparent 90%)' }}>
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt={selectedCompany.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-7 w-7" style={{ color: "var(--sa-primary)" }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                        {selectedCompany.name}
                      </h3>
                      <ChevronRight className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--sa-primary)" }}>
                        Module Configuration
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                      {selectedCompany.email} • {selectedCompany.address.city}, {selectedCompany.address.country}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: "var(--sa-primary)" }}>
                    {enabledCount}
                  </div>
                  <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                    Active Modules
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--sa-success), transparent 90%)' }}>
                    <CheckCircle2 className="h-5 w-5" style={{ color: "var(--sa-success)" }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>Enabled Modules</div>
                    <div className="text-xl font-bold" style={{ color: "var(--sa-success)" }}>{enabledCount}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--sa-error), transparent 90%)' }}>
                    <XCircle className="h-5 w-5" style={{ color: "var(--sa-error)" }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>Disabled Modules</div>
                    <div className="text-xl font-bold" style={{ color: "var(--sa-error)" }}>
                      {ALL_MODULES.length - enabledCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--sa-primary), transparent 90%)' }}>
                    <Puzzle className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>Total Available</div>
                    <div className="text-xl font-bold" style={{ color: "var(--sa-primary)" }}>{ALL_MODULES.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
                <input
                  type="text"
                  placeholder="Search modules..."
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
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-10 px-4 rounded-xl border text-sm transition focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--sa-card)",
                  borderColor: "var(--sa-border)",
                  color: "var(--sa-text-primary)"
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module, index) => {
                const IconComponent = MODULE_ICONS[module.name] || Puzzle;
                const enabled = isModuleEnabled(module.id);
                
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      enabled ? 'border-[var(--sa-success)]' : 'border-[var(--sa-border)]'
                    }`}
                    style={{ 
                      backgroundColor: enabled 
                        ? 'color-mix(in srgb, var(--sa-success), transparent 97%)' 
                        : 'var(--sa-card)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: enabled 
                            ? 'color-mix(in srgb, var(--sa-success), transparent 85%)' 
                            : 'color-mix(in srgb, var(--sa-primary), transparent 90%)'
                        }}>
                        <IconComponent 
                          className="h-6 w-6" 
                          style={{ color: enabled ? "var(--sa-success)" : "var(--sa-primary)" }} 
                        />
                      </div>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="transition-transform hover:scale-110"
                      >
                        {enabled ? (
                          <ToggleRight className="h-8 w-8" style={{ color: "var(--sa-success)" }} />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-slate-300" />
                        )}
                      </button>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--sa-text-primary)" }}>
                        {module.name}
                      </h4>
                      <p className="text-xs mb-2" style={{ color: "var(--sa-text-secondary)" }}>
                        {module.description}
                      </p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: 'color-mix(in srgb, var(--sa-primary), transparent 90%)',
                          color: "var(--sa-primary)"
                        }}>
                        {module.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-12 rounded-xl border-2 border-dashed"
                style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                <Search className="h-12 w-12 mx-auto mb-3" style={{ color: "var(--sa-text-secondary)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>
                  No modules found
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!selectedCompany && state.companies.length > 0 && (
        <div className="text-center py-16 rounded-xl border-2 border-dashed"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
          <Puzzle className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--sa-text-secondary)" }} />
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
            Select a Company
          </p>
          <p className="text-sm" style={{ color: "var(--sa-text-secondary)" }}>
            Choose a company from above to manage their ERP modules
          </p>
        </div>
      )}
      {/* Trial Access Modal */}
      {showTrialModal && (
        <TrialAccessModal
          company={selectedCompany}
          defaultModules={defaultTrialModules}
          onClose={() => setShowTrialModal(false)}
          onSave={handleSaveTrialAccess}
        />
      )}
    </motion.div>
  );
}

export default ModulesManagementPage;
