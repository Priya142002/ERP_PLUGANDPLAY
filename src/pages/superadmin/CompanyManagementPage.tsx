import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Building2, Search, Edit, Trash2,
  Users, Download, Filter, X, Save, Upload, Image, Layers, ToggleLeft, ToggleRight, List, RefreshCw, CheckCircle, Lock
} from "lucide-react";
import { superAdminApi } from "../../services/api";
import "../../styles/superadmin-mobile.css";

// Modules are loaded from DB — this is just the fallback
const FALLBACK_MODULES = [
  { id: "inventory", name: "Inventory Management" },
  { id: "purchase",  name: "Purchase Management"  },
  { id: "sales",     name: "Sales Management"     },
  { id: "accounts",  name: "Accounts & Finance"   },
  { id: "crm",       name: "CRM"                  },
  { id: "hrm",       name: "HRM"                  },
  { id: "projects",  name: "Projects"             },
  { id: "helpdesk",  name: "Helpdesk"             },
  { id: "assets",    name: "Assets"               },
  { id: "logistics", name: "Logistics"            },
  { id: "production",name: "Production"           },
  { id: "billing",   name: "Billing"              },
  { id: "pos",       name: "POS"                  },
];

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// ── EditableDropdown ──────────────────────────────────────────────────────────
// Dropdown with + to add custom items and pencil to edit them inline.
// Custom items are persisted to the DB via SystemSettings (key: dropdown.{dbKey})
interface DropdownOption { value: string; label: string; custom?: boolean; }

function EditableDropdown({
  label, required, value, onChange, options, placeholder = 'Select...', dbKey
}: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  dbKey: 'company_types' | 'industries' | 'countries';
}) {
  const [allOptions, setAllOptions] = useState<DropdownOption[]>(options);
  const [mode, setMode] = useState<'select' | 'add' | 'edit'>('select');
  const [inputVal, setInputVal] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Load custom items from DB on mount
  useEffect(() => {
    superAdminApi.getDropdownOptions(dbKey).then(res => {
      if (res.success && res.data && res.data.length > 0) {
        const customOpts: DropdownOption[] = res.data.map((item: string) => ({
          value: item.toLowerCase().replace(/\s+/g, '_'),
          label: item,
          custom: true,
        }));
        setAllOptions(() => {
          const base = options.filter(o => !customOpts.find(c => c.value === o.value));
          return [...base, ...customOpts];
        });
      }
    }).catch(() => {/* ignore — use base options */});
  }, [dbKey]);

  const persistCustomItems = async (opts: DropdownOption[]) => {
    const customLabels = opts.filter(o => o.custom).map(o => o.label);
    try { await superAdminApi.saveDropdownOptions(dbKey, customLabels); }
    catch { /* non-blocking */ }
  };

  const handleAdd = async () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    setSaving(true);
    const val = trimmed.toLowerCase().replace(/\s+/g, '_');
    const newOpt: DropdownOption = { value: val, label: trimmed, custom: true };
    const updated = [...allOptions, newOpt];
    setAllOptions(updated);
    onChange(val);
    setInputVal('');
    setMode('select');
    await persistCustomItems(updated);
    setSaving(false);
  };

  const handleEditSave = async () => {
    const trimmed = inputVal.trim();
    if (!trimmed) { setMode('select'); return; }
    setSaving(true);
    const newVal = trimmed.toLowerCase().replace(/\s+/g, '_');
    const updated = allOptions.map(o =>
      o.value === editingValue ? { ...o, label: trimmed, value: newVal } : o
    );
    setAllOptions(updated);
    if (value === editingValue) onChange(newVal);
    setInputVal('');
    setMode('select');
    await persistCustomItems(updated);
    setSaving(false);
  };

  const startEdit = (opt: DropdownOption) => {
    setEditingValue(opt.value);
    setInputVal(opt.label);
    setMode('edit');
  };

  const selectedLabel = allOptions.find(o => o.value === value)?.label || '';

  if (mode === 'add' || mode === 'edit') {
    return (
      <div>
        <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); mode === 'add' ? handleAdd() : handleEditSave(); }
              if (e.key === 'Escape') setMode('select');
            }}
            className="flex-1 h-10 rounded-lg border px-3 text-sm"
            style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-primary)", color: "var(--sa-text-primary)" }}
            placeholder={mode === 'add' ? `New ${label.toLowerCase()}...` : `Edit "${selectedLabel}"...`}
          />
          <button type="button" onClick={mode === 'add' ? handleAdd : handleEditSave} disabled={saving}
            className="px-4 h-10 rounded-lg text-sm font-semibold flex items-center gap-1.5 disabled:opacity-60"
            style={{ backgroundColor: "var(--sa-primary)", color: "#fff" }}>
            {saving && <RefreshCw size={12} className="animate-spin" />}
            {mode === 'add' ? 'Add' : 'Save'}
          </button>
          <button type="button" onClick={() => { setMode('select'); setInputVal(''); }}
            className="p-2 h-10 rounded-lg hover:bg-[var(--sa-hover)]">
            <X className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          </button>
        </div>
        {mode === 'add' && <p className="text-[10px] mt-1" style={{ color: "var(--sa-text-secondary)" }}>Will be saved to database</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 h-10 rounded-lg border px-3 text-sm"
          style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
        >
          {!value && <option value="">{placeholder}</option>}
          {allOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}{opt.custom ? ' ✎' : ''}</option>
          ))}
        </select>
        {/* Edit — only for custom items */}
        {value && allOptions.find(o => o.value === value)?.custom && (
          <button type="button" onClick={() => startEdit(allOptions.find(o => o.value === value)!)}
            className="flex items-center justify-center h-10 w-10 rounded-lg border hover:bg-[var(--sa-hover)] transition"
            style={{ borderColor: "var(--sa-border)" }} title={`Edit "${selectedLabel}"`}>
            <Edit className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          </button>
        )}
        {/* Add new */}
        <button type="button" onClick={() => { setInputVal(''); setMode('add'); }}
          className="flex items-center justify-center h-10 w-10 rounded-lg border hover:bg-[var(--sa-hover)] transition"
          style={{ borderColor: "var(--sa-border)" }} title={`Add new ${label.toLowerCase()}`}>
          <Plus className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
        </button>
      </div>
    </div>
  );
}

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
  whatsapp: string;
  whatsappSameAsPhone: boolean;
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
  adminPassword: string;
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
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>(() => {
    if (company) {
      return {
        code: company.code || '',
        name: company.name || '',
        companyType: company.companyType || 'private_limited',
        industry: company.industry || '',
        email: company.email || '',
        phone: company.phone || '',
        whatsapp: company.whatsapp || '',
        whatsappSameAsPhone: company.whatsappSameAsPhone || false,
        address: company.address || { street: '', city: '', state: '', country: '', postalCode: '' },
        gstNumber: company.gstNumber || '',
        taxNumber: company.taxNumber || '',
        status: company.status || 'active',
        logo: company.logo || '',
        adminName: company.adminName || '',
        adminEmail: company.adminEmail || '',
        adminPhone: company.adminPhone || '',
        adminPassword: '',  // blank = keep existing on edit
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
      whatsapp: '',
      whatsappSameAsPhone: false,
      address: { street: '', city: '', state: '', country: '', postalCode: '' },
      gstNumber: '',
      taxNumber: '',
      status: 'active' as const,
      logo: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      adminPassword: 'Admin@123',
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

  const handleWhatsappCheckbox = (checked: boolean) => {
    setFormData({
      ...formData,
      whatsappSameAsPhone: checked,
      whatsapp: checked ? formData.phone : formData.whatsapp
    });
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({
      ...formData,
      phone,
      whatsapp: formData.whatsappSameAsPhone ? phone : formData.whatsapp
    });
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
              <EditableDropdown
                label="Company Type"
                required
                value={formData.companyType}
                onChange={v => setFormData({ ...formData, companyType: v as any })}
                options={COMPANY_TYPES}
                placeholder="Select type"
                dbKey="company_types"
              />
              <EditableDropdown
                label="Industry"
                required
                value={formData.industry}
                onChange={v => setFormData({ ...formData, industry: v })}
                options={INDUSTRIES.map(i => ({ value: i, label: i }))}
                placeholder="Select industry"
                dbKey="industries"
              />
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2" style={{ color: "var(--sa-text-primary)" }}>
                WhatsApp Number
              </label>
              <div className="space-y-2">
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  disabled={formData.whatsappSameAsPhone}
                  className="w-full h-10 rounded-lg border px-3 text-sm"
                  style={{ 
                    backgroundColor: formData.whatsappSameAsPhone ? "var(--sa-hover)" : "var(--sa-card)", 
                    borderColor: "var(--sa-border)", 
                    color: "var(--sa-text-primary)",
                    cursor: formData.whatsappSameAsPhone ? "not-allowed" : "text"
                  }}
                  placeholder="+1 234 567 8900"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.whatsappSameAsPhone}
                    onChange={(e) => handleWhatsappCheckbox(e.target.checked)}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: "var(--sa-primary)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                    Same as phone number
                  </span>
                </label>
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

            <div className="grid grid-cols-2 gap-4">
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
                  Admin Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required={!company}
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full h-10 rounded-lg border px-3 text-sm font-mono"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder={company ? "Leave blank to keep existing" : "Enter login password"}
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
              <EditableDropdown
                label="Country"
                required
                value={formData.address.country}
                onChange={v => setFormData({ ...formData, address: { ...formData.address, country: v } })}
                options={COUNTRIES.map(c => ({ value: c, label: c }))}
                placeholder="Select Country"
                dbKey="countries"
              />

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
              {FALLBACK_MODULES.map(mod => (
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
              <button type="button" onClick={() => setFormData({ ...formData, allowedModules: FALLBACK_MODULES.map(m => m.id) })}
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
              onMouseEnter={() => setIsSubmitHovered(true)}
              onMouseLeave={() => setIsSubmitHovered(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-transparent hover:border-slate-200"
              style={{
                backgroundColor: isSubmitHovered ? "#FFFFFF" : "var(--sa-primary)",
                color: isSubmitHovered ? "#000000" : "#FFFFFF"
              }}
            >
              <Save className="h-4 w-4" style={{ color: isSubmitHovered ? "#000000" : "#FFFFFF" }} />
              <span style={{ color: isSubmitHovered ? "#000000" : "#FFFFFF" }}>
                {company ? 'Update Company' : 'Create Company'}
              </span>
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
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [globalModules, setGlobalModules] = useState<{ id: string; name: string }[]>(FALLBACK_MODULES);
  const [companyModules, setCompanyModules] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Determine if company has active subscription
  const hasSubscription = company.hasActiveSubscription || company.subscriptionStatus === 'Active';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 1. Load all global modules from DB
        const globalRes = await superAdminApi.getGlobalModules();
        if (globalRes.success && globalRes.data) {
          const mods = (globalRes.data as any[]).map((m: any) => ({ id: m.moduleId, name: m.name }));
          if (mods.length > 0) setGlobalModules(mods);
        }

        // 2. Load current company module assignments from DB
        const companyRes = await superAdminApi.getCompanyModules(company.id);
        if (companyRes.success && companyRes.data) {
          setCompanyModules(companyRes.data as any[]);
          // Pre-select currently enabled modules
          const enabled = (companyRes.data as any[])
            .filter((m: any) => m.isEnabled && (hasSubscription ? true : m.isTrialAccess))
            .map((m: any) => m.moduleId);
          setSelected(enabled.length > 0 ? enabled : ['inventory', 'sales', 'purchase', 'accounts']);
        } else {
          // Fallback to company.allowedModules
          setSelected(company.allowedModules?.length > 0
            ? company.allowedModules
            : ['inventory', 'sales', 'purchase', 'accounts']);
        }
      } catch {
        setSelected(company.allowedModules?.length > 0
          ? company.allowedModules
          : ['inventory', 'sales', 'purchase', 'accounts']);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [company.id]);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(selected); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-xl border shadow-2xl flex flex-col max-h-[90vh]"
        style={{ backgroundColor: "#ffffff", borderColor: "var(--sa-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: "var(--sa-border)" }}>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {hasSubscription ? 'Subscription Module Access' : 'Trial Module Access'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{company.name}</p>
            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              hasSubscription ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {hasSubscription ? <CheckCircle size={10} /> : <Lock size={10} />}
              {hasSubscription ? 'Subscribed — Full Access Control' : 'Trial — Limited Access'}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Module list */}
        <div className="p-5 space-y-2 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <RefreshCw size={18} className="animate-spin mr-2" /> Loading modules from database...
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-3">
                {hasSubscription
                  ? 'Select which modules this subscribed company can access. All selected modules will be enabled.'
                  : 'Select which modules this company can access during their free trial period.'}
              </p>
              {globalModules.map(mod => {
                const dbEntry = companyModules.find((m: any) => m.moduleId === mod.id);
                const isChecked = selected.includes(mod.id);
                return (
                  <label
                    key={mod.id}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition"
                    style={{
                      borderColor: isChecked ? "#6366f1" : "#e2e8f0",
                      backgroundColor: isChecked ? "rgba(99,102,241,0.06)" : "#f8fafc",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(mod.id)}
                      className="h-4 w-4 rounded flex-shrink-0"
                      style={{ accentColor: "#6366f1" }}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-800">{mod.name}</span>
                      {dbEntry && (
                        <div className="flex gap-1 mt-0.5">
                          {dbEntry.isTrialAccess && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">TRIAL</span>
                          )}
                          {dbEntry.isEnabled && !dbEntry.isTrialAccess && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">SUBSCRIBED</span>
                          )}
                        </div>
                      )}
                    </div>
                    {isChecked && <CheckCircle size={14} className="text-indigo-500 flex-shrink-0" />}
                  </label>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between gap-3 flex-shrink-0" style={{ borderColor: "var(--sa-border)" }}>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(globalModules.map(m => m.id))}
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
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-slate-200 text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              onMouseEnter={() => setIsSaveHovered(true)}
              onMouseLeave={() => setIsSaveHovered(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-transparent hover:border-slate-200 disabled:opacity-60"
              style={{
                backgroundColor: isSaveHovered ? "#FFFFFF" : "var(--sa-primary)",
                color: isSaveHovered ? "#000000" : "#FFFFFF"
              }}
            >
              {saving
                ? <RefreshCw size={14} className="animate-spin" style={{ color: isSaveHovered ? "#000000" : "#FFFFFF" }} />
                : <Save className="h-4 w-4" style={{ color: isSaveHovered ? "#000000" : "#FFFFFF" }} />
              }
              <span style={{ color: isSaveHovered ? "#000000" : "#FFFFFF" }}>
                Save ({selected.length})
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CompanyManagementPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [trialAccessCompany, setTrialAccessCompany] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isAddBtnHovered, setIsAddBtnHovered] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filters, setFilters] = useState<FilterState>({ industry: '', status: '', country: '', companyType: '' });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getCompanies(1, 100, debouncedSearch);
      if (res.success) {
        const items = res.data?.items ?? res.data ?? [];
        setCompanies(Array.isArray(items) ? items : []);
      }
    } catch (e) { 
      console.error(e); 
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !search || company.name?.toLowerCase().includes(search.toLowerCase()) ||
      company.code?.toLowerCase().includes(search.toLowerCase()) ||
      company.email?.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = !filters.industry || company.industry === filters.industry;
    const matchesStatus = !filters.status || company.status === filters.status;
    const matchesCountry = !filters.country || company.country === filters.country || company.address?.country === filters.country;
    const matchesType = !filters.companyType || company.companyType === filters.companyType;
    return matchesSearch && matchesIndustry && matchesStatus && matchesCountry && matchesType;
  });

  const handleSaveCompany = async (data: CompanyFormData) => {
    try {
      const payload = {
        code: data.code, name: data.name, companyType: data.companyType,
        industry: data.industry, email: data.email, phone: data.phone,
        street: data.address.street, city: data.address.city,
        state: data.address.state, country: data.address.country,
        postalCode: data.address.postalCode,
        gstNumber: data.gstNumber, taxNumber: data.taxNumber,
        status: data.status, logo: data.logo,
        adminName: data.adminName, adminEmail: data.adminEmail,
        adminPhone: data.adminPhone, adminPassword: data.adminPassword || 'Admin@123',
        allowedModules: data.allowedModules,
      };
      if (editingCompany) {
        await superAdminApi.updateCompany(editingCompany.id, payload);
      } else {
        await superAdminApi.createCompany(payload);
      }
      await loadCompanies();
    } catch (e) { console.error(e); }
    setShowFormModal(false);
    setEditingCompany(null);
  };

  const handleSaveTrialAccess = async (modules: string[]) => {
    if (!trialAccessCompany) return;
    try {
      const hasSubscription = trialAccessCompany.hasActiveSubscription || trialAccessCompany.subscriptionStatus === 'Active';
      if (hasSubscription) {
        // For subscribed companies: update all enabled modules (not just trial)
        await superAdminApi.toggleCompanyModule(trialAccessCompany.id, '', true); // handled below
        // Set all selected as enabled, unselected as disabled
        const allModuleIds = FALLBACK_MODULES.map(m => m.id);
        for (const moduleId of allModuleIds) {
          await superAdminApi.toggleCompanyModule(
            trialAccessCompany.id,
            moduleId,
            modules.includes(moduleId)
          );
        }
      } else {
        // For trial companies: update trial module access
        await superAdminApi.setTrialModules(trialAccessCompany.id, modules);
      }
      await loadCompanies();
    } catch (e) { console.error(e); }
    setTrialAccessCompany(null);
  };

  const handleToggleStatus = async (companyId: number, currentStatus: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'active' ? 'deactivate' : 'activate'} "${companyName}"?`)) return;
    try {
      await superAdminApi.toggleCompanyStatus(companyId);
      await loadCompanies();
    } catch (e) { console.error(e); }
  };

  const handleDeleteCompany = async (companyId: number, companyName: string) => {
    if (!window.confirm(`Delete "${companyName}"? This cannot be undone.`)) return;
    try {
      await superAdminApi.deleteCompany(companyId);
      await loadCompanies();
    } catch (e) { console.error(e); }
  };

  const handleExport = () => {
    const csv = ['Code,Name,Industry,Email,Status,Created']
      .concat(filteredCompanies.map(c => `${c.code},${c.name},${c.industry},${c.email},${c.status},${c.createdAt}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'companies.csv'; a.click();
  };

  const clearFilters = () => setFilters({ industry: '', status: '', country: '', companyType: '' });

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
            onMouseEnter={() => setIsAddBtnHovered(true)}
            onMouseLeave={() => setIsAddBtnHovered(false)}
            className="group flex items-center gap-2 px-6 h-10 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 border border-transparent hover:border-slate-200"
            style={{
              backgroundColor: isAddBtnHovered ? "#FFFFFF" : "var(--sa-primary)",
              color: isAddBtnHovered ? "#000000" : "#FFFFFF"
            }}
          >
            <Plus className="h-4 w-4" style={{ color: isAddBtnHovered ? "#000000" : "#FFFFFF" }} />
            <span style={{ color: isAddBtnHovered ? "#000000" : "#FFFFFF" }}>Add Company</span>
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="py-4 px-6 rounded-2xl shadow-lg border relative overflow-hidden"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <Building2 size={80} color="#FFFFFF" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
            <Building2 size={24} color="#FFFFFF" />
          </div>
          <div>
            <p className="font-bold text-xs uppercase tracking-wider" style={{ color: "#FFFFFF" }}>Total Companies</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-2xl tracking-tighter" style={{ color: "#FFFFFF" }}>{filteredCompanies.length}</span>
              <span className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.9)" }}>registered organizations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
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

        {/* Status Toggle Icon */}
        <button
          onClick={() => {
            if (filters.status === '') setFilters({ ...filters, status: 'active' });
            else if (filters.status === 'active') setFilters({ ...filters, status: 'inactive' });
            else setFilters({ ...filters, status: '' });
          }}
          className="flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all"
          style={{
            borderColor: filters.status ? (filters.status === 'active' ? 'var(--sa-success)' : 'var(--sa-error)') : "var(--sa-border)",
            backgroundColor: filters.status ? (filters.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : "transparent",
            color: filters.status ? (filters.status === 'active' ? 'var(--sa-success)' : 'var(--sa-error)') : "var(--sa-text-primary)"
          }}
          title={`Status: ${filters.status === '' ? 'All' : filters.status === 'active' ? 'Active' : 'Inactive'}`}
        >
          {filters.status === 'active' ? (
            <ToggleRight className="h-5 w-5" />
          ) : filters.status === 'inactive' ? (
            <ToggleLeft className="h-5 w-5" />
          ) : (
            <List className="h-4 w-4" />
          )}
          {filters.status === '' ? 'All' : filters.status === 'active' ? 'Active' : 'Inactive'}
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium"
          style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
        >
          <Filter className="h-4 w-4" />
          Filters
          {(filters.industry || filters.country || filters.companyType) && (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {loading && companies.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center" style={{ color: "var(--sa-text-secondary)" }}>
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                      <div className="h-8 w-8 border-4 border-[var(--sa-primary)] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium">Synchronizing company records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center" style={{ color: "var(--sa-text-secondary)" }}>
                    <p className="text-sm font-medium">No results found matching your current filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.4) }}
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
                          {company.status === 'active' ? (
                            <ToggleRight
                              className="h-5 w-5"
                              style={{ color: 'var(--sa-success)' }}
                            />
                          ) : (
                            <ToggleLeft
                              className="h-5 w-5"
                              style={{ color: 'var(--sa-text-secondary)' }}
                            />
                          )}
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
