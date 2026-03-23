import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Building2, Search, Edit, Trash2, Power,
  Users, Download, Filter, X, Save, Upload, Image, Layers
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const ALL_MODULES = [
  { id: "inventory", name: "Inventory Management" },
  { id: "purchase", name: "Purchase Management" },
  { id: "sales", name: "Sales Management" },
  { id: "accounts", name: "Accounts & Finance" },
  { id: "crm", name: "CRM" },
  { id: "hrm", name: "HRM" },
  { id: "projects", name: "Projects" },
  { id: "helpdesk", name: "Helpdesk" },
  { id: "assets", name: "Assets" },
  { id: "logistics", name: "Logistics" },
  { id: "production", name: "Production" },
  { id: "billing", name: "Billing" },
];

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const INDUSTRIES = [
  "Manufacturing", "Construction", "Retail", "Healthcare", 
  "Technology", "Finance", "Education", "Logistics", "Other"
];

const COMPANY_TYPES = [
  { value: 'private_limited', label: 'Private Limited' },
  { value: 'public_limited', label: 'Public Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'opc', label: 'OPC' },
  { value: 'government', label: 'Government' },
  { value: 'non_profit', label: 'Non-Profit' }
];

const COUNTRIES = ["USA", "UK", "India", "Canada", "Australia", "Germany", "France"];

interface CompanyFormData {
  code: string;
  name: string;
  companyType: 'private_limited' | 'public_limited' | 'llp' | 'partnership' | 'sole_proprietorship' | 'opc' | 'government' | 'non_profit';
  industry: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  gstNumber?: string;
  taxNumber?: string;
  status: 'active' | 'inactive';
  logo: string;
  // Admin User Details
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  // Trial module access
  allowedModules: string[];
}

interface FilterState {
  industry: string;
  status: string;
  country: string;
  companyType: string;
}

function CompanyFormModal({ 
  company, 
  onClose, 
  onSave 
}: { 
  company?: any; 
  onClose: () => void; 
  onSave: (data: CompanyFormData) => void;
}) {
  const [formData, setFormData] = useState<CompanyFormData>(() => {
    if (company) {
      return {
        code: company.code || '',
        name: company.name || '',
        companyType: company.companyType || 'private_limited',
        industry: company.industry || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || { street: '', city: '', state: '', country: '', postalCode: '' },
        gstNumber: company.gstNumber || '',
        taxNumber: company.taxNumber || '',
        status: company.status || 'active',
        logo: company.logo || '',
        adminName: company.adminName || '',
        adminEmail: company.adminEmail || '',
        adminPhone: company.adminPhone || '',
        allowedModules: company.allowedModules || ['inventory', 'sales', 'purchase', 'accounts'],
      };
    }
    return {
      code: '',
      name: '',
      companyType: 'private_limited' as const,
      industry: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', country: '', postalCode: '' },
      gstNumber: '',
      taxNumber: '',
      status: 'active' as const,
      logo: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      allowedModules: ['inventory', 'sales', 'purchase', 'accounts'],
    };
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl rounded-xl border shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
      >
        <div className="flex items-center justify-between p-5 border-b sticky top-0 z-10"
          style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--sa-text-primary)" }}>
            {company ? 'Edit Company' : 'Add New Company'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--sa-hover)]">
            <X className="h-5 w-5" style={{ color: "var(--sa-text-secondary)" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Company Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="e.g., COMP001"
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Company Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.companyType}
                  onChange={(e) => setFormData({ ...formData, companyType: e.target.value as any })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                >
                  {COMPANY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
              Company Logo
            </h3>
            
            <div className="flex items-start gap-4">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden"
                  style={{ borderColor: formData.logo ? "var(--sa-success)" : "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                  {formData.logo ? (
                    <img src={formData.logo} alt="Company logo" className="h-full w-full object-cover" />
                  ) : (
                    <Image className="h-8 w-8" style={{ color: "var(--sa-text-secondary)" }} />
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-[var(--sa-hover)] transition text-sm"
                    style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                    <Upload className="h-4 w-4" />
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-4 py-2 rounded-lg border text-sm hover:bg-[var(--sa-hover)] transition"
                      style={{ borderColor: "var(--sa-border)", color: "var(--sa-error)" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                  Square image recommended, max 2MB (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Admin User Details */}
          <div className="space-y-4 p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)", backgroundColor: "rgba(59, 130, 246, 0.05)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--sa-text-primary)" }}>
              <Users className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
              Admin User Details
            </h3>
            <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
              Primary administrator who will manage this company
            </p>
            
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                Admin Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="w-full h-10 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                placeholder="Admin full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Admin Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Admin Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.adminPhone}
                  onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Address</h3>
            
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                className="w-full h-10 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address.state}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.address.country}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Tax Information (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="GST number"
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>Tax Number</label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="Tax number"
                />
              </div>
            </div>
          </div>

          {/* Allowed Modules (Trial Access) */}
          <div className="space-y-3 p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)", backgroundColor: "rgba(99, 102, 241, 0.05)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--sa-text-primary)" }}>
              <Layers className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
              Allowed Modules (Trial Access)
            </h3>
            <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
              Select which modules this company can access during their free trial period.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_MODULES.map(mod => (
                <label key={mod.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--sa-hover)] transition">
                  <input
                    type="checkbox"
                    checked={formData.allowedModules.includes(mod.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.allowedModules, mod.id]
                        : formData.allowedModules.filter(m => m !== mod.id);
                      setFormData({ ...formData, allowedModules: updated });
                    }}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: "var(--sa-primary)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--sa-text-primary)" }}>{mod.name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setFormData({ ...formData, allowedModules: ALL_MODULES.map(m => m.id) })}
                className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: "var(--sa-border)", color: "var(--sa-primary)" }}>
                Select All
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, allowedModules: [] })}
                className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}>
                Clear All
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-10 rounded-lg border px-3 text-sm"
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--sa-border)" }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--sa-primary)" }}
            >
              <Save className="h-4 w-4" />
              {company ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function TrialAccessModal({
  company,
  onClose,
  onSave,
}: {
  company: any;
  onClose: () => void;
  onSave: (modules: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(
    company.allowedModules && company.allowedModules.length > 0
      ? company.allowedModules
      : ['inventory', 'sales', 'purchase', 'accounts']
  );

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-xl border shadow-2xl"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--sa-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--sa-border)" }}>
          <div>
            <h2 className="text-base font-bold text-slate-900">Trial Module Access</h2>
            <p className="text-xs text-slate-500 mt-0.5">{company.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Module list */}
        <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-500 mb-3">
            Choose which modules this company can access during their free trial.
          </p>
          {ALL_MODULES.map(mod => (
            <label
              key={mod.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition"
              style={{
                borderColor: selected.includes(mod.id) ? "#6366f1" : "#e2e8f0",
                backgroundColor: selected.includes(mod.id) ? "rgba(99,102,241,0.06)" : "#f8fafc",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(mod.id)}
                onChange={() => toggle(mod.id)}
                className="h-4 w-4 rounded"
                style={{ accentColor: "#6366f1" }}
              />
              <span className="text-sm font-medium text-slate-800">{mod.name}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--sa-border)" }}>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(ALL_MODULES.map(m => m.id))}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-indigo-600 hover:bg-slate-50"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              None
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selected)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: "#6366f1" }}
            >
              <Save className="h-4 w-4" />
              Save ({selected.length})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CompanyManagementPage() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [trialAccessCompany, setTrialAccessCompany] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    industry: '',
    status: '',
    country: '',
    companyType: ''
  });

  // Get companies with their admin info
  const companiesWithDetails = state.companies.map(company => {
    // Find admin for this company
    const admin = state.admins.find(a => a.companyId === company.id);

    return {
      ...company,
      adminName: admin?.fullName || 'N/A',
      adminEmail: admin?.email || 'N/A',
      adminPhone: admin?.phone || 'N/A'
    };
  });

  // Filter companies
  const filteredCompanies = companiesWithDetails.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                         company.code?.toLowerCase().includes(search.toLowerCase()) ||
                         company.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesIndustry = !filters.industry || company.industry === filters.industry;
    const matchesStatus = !filters.status || company.status === filters.status;
    const matchesCountry = !filters.country || company.address.country === filters.country;
    const matchesType = !filters.companyType || company.companyType === filters.companyType;

    return matchesSearch && matchesIndustry && matchesStatus && matchesCountry && matchesType;
  });

  const handleSaveCompany = (data: CompanyFormData) => {
    if (editingCompany) {
      // Update existing company
      dispatch({
        type: 'UPDATE_COMPANY',
        payload: {
          id: editingCompany.id,
          updates: {
            ...data,
            allowedModules: data.allowedModules,
            updatedAt: new Date(),
          }
        }
      });
    } else {
      // Create new company with trial start date
      const now = new Date();
      const newCompany = {
        id: `company_${Date.now()}`,
        ...data,
        trialStartDate: now,
        allowedModules: data.allowedModules,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_COMPANY', payload: newCompany });
    }
    setShowFormModal(false);
    setEditingCompany(null);
  };

  const handleSaveTrialAccess = (modules: string[]) => {
    if (!trialAccessCompany) return;
    dispatch({
      type: 'UPDATE_COMPANY',
      payload: { id: trialAccessCompany.id, updates: { allowedModules: modules, updatedAt: new Date() } }
    });
    setTrialAccessCompany(null);
  };

  const handleToggleStatus = (companyId: string, currentStatus: 'active' | 'inactive', companyName: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    if (window.confirm(`Are you sure you want to ${action} "${companyName}"?`)) {
      // TODO: Implement actual status toggle with AppContext
      // dispatch(actionCreators.updateCompany(companyId, { status: newStatus }));
      console.log(`Toggling company ${companyId} status to ${newStatus}`);
    }
  };

  const handleDeleteCompany = (companyId: string, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      // TODO: Implement actual delete logic with AppContext
      // dispatch(actionCreators.deleteCompany(companyId));
      console.log('Deleting company:', companyId);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality (CSV/Excel)
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      status: '',
      country: '',
      companyType: ''
    });
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>
            Company Management
          </h1>
          <p className="text-slate-500 mt-1">Manage all companies in the ERP system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-medium border"
            style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowFormModal(true)}
            className="flex items-center gap-2 px-6 h-10 rounded-xl text-xs font-bold text-white transition-all shadow-lg"
            style={{ backgroundColor: "var(--sa-primary)" }}
          >
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="py-4 px-6 rounded-2xl shadow-lg border relative overflow-hidden text-white"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <Building2 size={80} />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-white/60 font-medium text-xs uppercase tracking-wider">Total Companies</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white font-bold text-xl">{filteredCompanies.length}</span>
              <span className="text-white/80 text-sm">registered organizations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          <input
            type="text"
            placeholder="Search by name, code, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border text-sm"
            style={{
              backgroundColor: "var(--sa-card)",
              borderColor: "var(--sa-border)",
              color: "var(--sa-text-primary)"
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium"
          style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filters.industry || filters.status || filters.country || filters.companyType) && (
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--sa-primary)" }} />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl border"
          style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Filter Companies</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-secondary)" }}>Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="w-full h-9 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-secondary)" }}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full h-9 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-secondary)" }}>Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full h-9 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-secondary)" }}>Company Type</label>
              <select
                value={filters.companyType}
                onChange={(e) => setFilters({ ...filters, companyType: e.target.value })}
                className="w-full h-9 rounded-lg border px-3 text-sm"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
              >
                <option value="">All Types</option>
                {COMPANY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Companies Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sa-border)" }}>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Code</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Company Name</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Type</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Industry</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Admin User</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Contact</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Location</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Status</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Trial Modules</th>
                <th className="p-4 text-left text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Created</th>
                <th className="p-4 text-right text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center" style={{ color: "var(--sa-text-secondary)" }}>
                    No companies found
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-[var(--sa-hover)] transition"
                    style={{ borderColor: "var(--sa-border)" }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs" style={{ color: "var(--sa-text-primary)" }}>
                        {company.code || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: company.logo ? 'transparent' : `color-mix(in srgb, var(--sa-primary), transparent 90%)` }}>
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                          )}
                        </div>
                        <span className="font-medium" style={{ color: "var(--sa-text-primary)" }}>{company.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6"
                        }}>
                        {COMPANY_TYPES.find(t => t.value === company.companyType)?.label || 'Private Limited'}
                      </span>
                    </td>
                    <td className="p-4" style={{ color: "var(--sa-text-secondary)" }}>
                      {company.industry || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div className="font-medium" style={{ color: "var(--sa-text-primary)" }}>{company.adminName}</div>
                        <div style={{ color: "var(--sa-text-secondary)" }}>{company.adminEmail}</div>
                        <div style={{ color: "var(--sa-text-secondary)" }}>{company.adminPhone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div style={{ color: "var(--sa-text-primary)" }}>{company.email}</div>
                        <div style={{ color: "var(--sa-text-secondary)" }}>{company.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                        {company.address.city}, {company.address.country}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${company.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs capitalize" style={{ 
                          color: company.status === 'active' ? 'var(--sa-success)' : 'var(--sa-error)'
                        }}>
                          {company.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                        {company.allowedModules && company.allowedModules.length > 0
                          ? <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                              {company.allowedModules.length} modules
                            </span>
                          : <span className="text-slate-400">None</span>
                        }
                      </div>
                    </td>
                    <td className="p-4" style={{ color: "var(--sa-text-secondary)" }}>
                      <div className="text-xs">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setTrialAccessCompany(company)}
                          className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition"
                          title="Set trial module access"
                        >
                          <Layers className="h-4 w-4" style={{ color: "#6366f1" }} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(company.id, company.status, company.name)}
                          className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition"
                          title={company.status === 'active' ? 'Deactivate company' : 'Activate company'}
                        >
                          <Power 
                            className="h-4 w-4" 
                            style={{ color: company.status === 'active' ? 'var(--sa-success)' : 'var(--sa-text-secondary)' }} 
                          />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCompany(company);
                            setShowFormModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition"
                          title="Edit company"
                        >
                          <Edit className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCompany(company.id, company.name)}
                          className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition"
                          title="Delete company"
                        >
                          <Trash2 className="h-4 w-4" style={{ color: "var(--sa-error)" }} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <CompanyFormModal
          company={editingCompany}
          onClose={() => {
            setShowFormModal(false);
            setEditingCompany(null);
          }}
          onSave={handleSaveCompany}
        />
      )}

      {/* Trial Access Modal */}
      {trialAccessCompany && (
        <TrialAccessModal
          company={trialAccessCompany}
          onClose={() => setTrialAccessCompany(null)}
          onSave={handleSaveTrialAccess}
        />
      )}
    </motion.div>
  );
}

export default CompanyManagementPage;
