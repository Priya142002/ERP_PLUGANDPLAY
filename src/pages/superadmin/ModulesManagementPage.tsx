import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Puzzle, ToggleLeft, ToggleRight, Archive, ShoppingCart, 
  TrendingUp, BookOpen, Users, Briefcase, Headphones, 
  Truck, Factory, Receipt, Search, Building2, ChevronRight,
  CheckCircle2, XCircle, Package
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

export function ModulesManagementPage() {
  const { state } = useApp();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyModules, setCompanyModules] = useState<CompanyModules>({});
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
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
    </motion.div>
  );
}

export default ModulesManagementPage;
