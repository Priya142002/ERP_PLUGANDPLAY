import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Save, 
  CreditCard,
  Hash,
  Clock,
  Briefcase,
  Calendar,
  Database,
  Plus,
  X
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const CompanyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: <Building2 size={16} /> },
    { id: 'branches', label: 'Branches', icon: <MapPin size={16} /> },
    { id: 'about', label: 'About', icon: <Briefcase size={16} /> },
    { id: 'shipping', label: 'Shipping Details', icon: <MapPin size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Clock size={16} /> },
  ];

  const [branches, setBranches] = useState([{ id: 1, name: '', location: '', contact: '' }]);

  const addBranch = () => {
    setBranches([...branches, { id: Date.now(), name: '', location: '', contact: '' }]);
  };

  const removeBranch = (id: number) => {
    setBranches(branches.filter(b => b.id !== id));
  };

  const updateBranch = (id: number, field: string, value: string) => {
    setBranches(branches.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Identity</h1>
          <p className="text-slate-500 mt-1">Configure your legal entity details, branding, and regional preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 font-bold px-8 h-10 rounded-xl"
            leftIcon={<Save size={18} />}
          >
            Update Profile
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] rounded-2xl md:rounded-[1.5rem] py-3 px-6 md:py-4 md:px-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none text-white">
          <Building2 size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Corporate Profile</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Entity Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="text-white font-bold text-sm">Global Organizational Data Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Interface */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl w-fit border border-slate-200/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-[#3b4cb8] shadow-md ring-1 ring-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }
            `}
          >
            <span className={activeTab === tab.id ? 'text-[#3b4cb8]' : 'text-slate-400'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Primary Information</h3>
                </div>
                
                <Input 
                  label="Company Name" 
                  placeholder="Enter full legal name" 
                  required 
                  leftIcon={<Building2 size={16} />}
                />

                <Input 
                  label="Local Company Name (Arabic/Others)" 
                  placeholder="اسم الشركة" 
                  leftIcon={<FileText size={16} />}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Company Code" 
                    value="COMP-101" 
                    readOnly 
                    leftIcon={<Hash size={16} />}
                  />
                  <Input 
                    label="Short Name" 
                    placeholder="Brief name" 
                    leftIcon={<FileText size={16} />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Responsible Person" 
                    placeholder="Manager Name" 
                    leftIcon={<Briefcase size={16} />}
                  />
                  <Input 
                    label="CR Number / Reg No" 
                    placeholder="Enter registration #" 
                    leftIcon={<FileText size={16} />}
                  />
                </div>

                <Input 
                  label="Website URL" 
                  placeholder="https://example.com" 
                  leftIcon={<Globe size={16} />}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Contact Details</h3>
                </div>

                <Input 
                  label="Email Address" 
                  type="email" 
                  placeholder="admin@company.com" 
                  leftIcon={<Mail size={16} />}
                />
                
                <Input 
                  label="Phone Number 1" 
                  placeholder="+1 (555) 000-0000" 
                  leftIcon={<Phone size={16} />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Phone Number 2" 
                    placeholder="+1 (555) 000-0001" 
                    leftIcon={<Phone size={16} />}
                  />
                  <Input 
                    label="Fax Number" 
                    placeholder="Fax details" 
                    leftIcon={<FileText size={16} />}
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    These contact details will be displayed on all outgoing invoices and purchase orders generated by the system.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Branch Offices</h3>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={addBranch}
                  className="text-[#3b4cb8] border-[#3b4cb8] hover:bg-indigo-50 font-bold rounded-xl"
                  leftIcon={<Plus size={14} />}
                >
                  Add New Branch
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {branches.map((branch, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={branch.id} 
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group"
                  >
                    <button 
                      onClick={() => removeBranch(branch.id)}
                      className="absolute -top-2 -right-2 h-8 w-8 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-rose-50"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100 text-[#3b4cb8] flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-slate-700">Branch Details</h4>
                    </div>

                    <div className="space-y-4">
                      <Input 
                        label="Branch Name" 
                        placeholder="e.g. Downtown Office" 
                        value={branch.name}
                        onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                        leftIcon={<Building2 size={14} />}
                      />
                      <Input 
                        label="Location" 
                        placeholder="Street, City, Country" 
                        value={branch.location}
                        onChange={(e) => updateBranch(branch.id, 'location', e.target.value)}
                        leftIcon={<MapPin size={14} />}
                      />
                      <Input 
                        label="Contact Number" 
                        placeholder="+1 (555) 000-0000" 
                        value={branch.contact}
                        onChange={(e) => updateBranch(branch.id, 'contact', e.target.value)}
                        leftIcon={<Phone size={14} />}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Founded Year" type="number" placeholder="YYYY" />
                <Input label="Tax ID / VAT Number" placeholder="TAX-001122" leftIcon={<FileText size={16} />} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Company Vision & Mission</label>
                <textarea 
                  className="w-full rounded-xl border border-slate-200 p-4 min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-100 focus:border-[#3b4cb8] transition-all text-sm"
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Shipping Information</h3>
                </div>
                
                <Input label="Shipping Full Name" placeholder="Contact person at warehouse" leftIcon={<Building2 size={16} />} />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Street Name" placeholder="Main Street, 123" leftIcon={<MapPin size={16} />} />
                  <Input label="Apartment / Suite" placeholder="Bldg 4, Suite 12" leftIcon={<Building2 size={16} />} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input label="City" placeholder="City" />
                  <Input label="State" placeholder="State/Region" />
                  <Input label="ZIP Code" placeholder="ZIP" />
                </div>

                <Input label="Warehouse Phone" placeholder="+1 (555) 999-0000" leftIcon={<Phone size={16} />} />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Currency & Regional</h3>
                </div>
                <Select 
                  label="Default Currency" 
                  options={[
                    { label: 'US Dollar (USD)', value: 'usd' },
                    { label: 'Euro (EUR)', value: 'eur' },
                    { label: 'Pound (GBP)', value: 'gbp' }
                  ]} 
                  leftIcon={<CreditCard size={16} />}
                />
                <Select 
                  label="Time Zone" 
                  options={[
                    { label: 'UTC +00:00', value: 'utc' },
                    { label: 'EST -05:00', value: 'est' },
                    { label: 'IST +05:30', value: 'ist' }
                  ]} 
                  leftIcon={<Clock size={16} />}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Financial Year Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Financial Year Configuration</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="FY Start Date" 
                    type="date" 
                    value="2026-01-01" 
                    leftIcon={<Calendar size={16} />} 
                  />
                  <Input 
                    label="FY End Date" 
                    type="date" 
                    value="2026-12-31" 
                    leftIcon={<Calendar size={16} />} 
                  />
                </div>
              </div>

              {/* Tax & Compliance Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Tax & Compliance Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Tax Registration Name" placeholder="Legal tax entity name" leftIcon={<FileText size={16} />} />
                  <Input label="Tax Registration No" placeholder="VAT/GST Number" leftIcon={<FileText size={16} />} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select 
                    label="Tax Type" 
                    options={[
                      { label: 'VAT', value: 'vat' },
                      { label: 'GST', value: 'gst' },
                      { label: 'Sales Tax', value: 'sales' }
                    ]} 
                    leftIcon={<Database size={16} />}
                  />
                  <Select 
                    label="Tax Category" 
                    options={[
                      { label: 'Standard Code', value: 'std' },
                      { label: 'Zero Rated', value: 'zero' },
                      { label: 'Exempt', value: 'exempt' }
                    ]} 
                    leftIcon={<Database size={16} />}
                  />
                </div>
              </div>

              {/* System Preferences */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Environment Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Select 
                    label="Time Zone" 
                    value="ist"
                    options={[
                      { label: '(UTC+05:30) Mumbai, New Delhi', value: 'ist' },
                      { label: '(UTC+00:00) London, Lisbon', value: 'utc' },
                      { label: '(UTC-05:00) Eastern Time', value: 'est' }
                    ]} 
                    leftIcon={<Clock size={16} />}
                  />
                  <Input 
                    label="Decimal Places" 
                    type="number" 
                    value="2" 
                    leftIcon={<Hash size={16} />} 
                  />
                  <Select 
                    label="System Language" 
                    value="en"
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Arabic', value: 'ar' },
                      { label: 'Spanish', value: 'es' }
                    ]} 
                    leftIcon={<Globe size={16} />}
                  />
                </div>
              </div>

              {/* Advanced Identifiers */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <div className="h-2 w-2 rounded-full bg-[#3b4cb8]" />
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Advanced Identifiers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Company System ID" 
                    value="26000101" 
                    readOnly 
                    leftIcon={<Database size={16} />}
                    className="bg-slate-50"
                  />
                  <Select 
                    label="Default Operating Bank" 
                    options={[
                      { label: 'Main Savings - **** 4421', value: 'bank1' },
                      { label: 'Corporate Current - **** 8829', value: 'bank2' }
                    ]} 
                    leftIcon={<CreditCard size={16} />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Last updated: March 16, 2026 at 3:15 PM
          </p>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">System Online</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyPage;
