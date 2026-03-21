import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Mail, Phone, Globe, MapPin,
  FileText, Save, RotateCcw, CreditCard, Landmark, Settings2, Plus, X
} from "lucide-react";

const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";
const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const selectCls = `${fieldCls} appearance-none`;

interface CreatableSelectProps {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; onAddNew: (v: string) => void; required?: boolean;
}
const CreatableSelect: React.FC<CreatableSelectProps> = ({ label, value, onChange, options, onAddNew, required }) => {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');
  const handleAdd = () => {
    const t = newVal.trim();
    if (t) { onAddNew(t); onChange(t); setNewVal(''); setAdding(false); }
  };
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-rose-400 ml-0.5">*</span>}</label>
      {adding ? (
        <div className="flex gap-2">
          <input autoFocus value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder={`New ${label.toLowerCase()}…`} className={`${fieldCls} flex-1`} />
          <button type="button" onClick={handleAdd} className="h-10 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">Add</button>
          <button type="button" onClick={() => setAdding(false)} className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"><X size={14} /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select value={value} onChange={e => onChange(e.target.value)} className={`${selectCls} flex-1`}>
            <option value="">Select…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <button type="button" onClick={() => setAdding(true)} title={`Add new ${label}`}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

const SH: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${color}`}>{icon}</div>
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

interface AddVendorModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

export const AddVendorModal: React.FC<AddVendorModalProps> = ({ onClose, onSave }) => {
  const [vendorName, setVendorName] = useState('');
  const [allowCashPay, setAllowCashPay] = useState(false);
  const [autoGL, setAutoGL] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [vendorType, setVendorType] = useState('');
  const [vendorTypeOptions, setVendorTypeOptions] = useState(['Individual', 'Company', 'Partnership', 'Sole Proprietor']);

  const handleSave = () => {
    if (!vendorName.trim()) return;
    onSave(vendorName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col border border-slate-200 max-h-[90vh]"
        onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Building2 size={16} /></div>
              <h3 className="font-bold text-slate-800 text-base">New Vendor</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"><X size={18} /></button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Main */}
              <div className="md:col-span-2 space-y-6">

                {/* Company Architecture */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<Building2 size={15} className="text-indigo-600" />} title="Company Architecture" color="bg-indigo-50 border-indigo-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Vendor Name <span className="text-rose-400">*</span></label>
                      <input className={fieldCls} placeholder="e.g. TechNova Solutions" value={vendorName} onChange={e => setVendorName(e.target.value)} />
                    </div>
                    <div><label className={labelCls}>Vendor Name (Abbr)</label><input className={fieldCls} placeholder="e.g. TechNova" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Vendor No</label><input className={fieldCls} placeholder="@Auto" defaultValue="@Auto" /></div>
                    <div><label className={labelCls}>Vendor Category</label>
                      <select className={selectCls}><option value="">Select…</option><option>Suppliers</option><option>Service Providers</option><option>Manufacturers</option><option>Wholesalers</option></select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Tax Number / VAT</label><input className={fieldCls} placeholder="TRN12345678" /></div>
                    <div><label className={labelCls}>Tax Type <span className="text-rose-400">*</span></label>
                      <select className={selectCls}><option value="">Select…</option><option>GST</option><option>VAT</option><option>None</option></select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Discount (%)</label><input type="number" min={0} max={100} className={fieldCls} placeholder="0" /></div>
                    <div><label className={labelCls}>Company</label><input className={fieldCls} placeholder="Company name" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Website</label>
                      <div className="relative"><Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className={`${fieldCls} pl-8`} placeholder="https://example.com" /></div>
                    </div>
                    <div><label className={labelCls}>GST No</label><input className={fieldCls} placeholder="GST number" /></div>
                  </div>
                </div>

                {/* Strategic Contact */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<Phone size={15} className="text-emerald-600" />} title="Strategic Contact" color="bg-emerald-50 border-emerald-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Contact Person <span className="text-rose-400">*</span></label><input className={fieldCls} placeholder="e.g. John Doe" /></div>
                    <div><label className={labelCls}>Designation</label><input className={fieldCls} placeholder="e.g. Sales Manager" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Email Address <span className="text-rose-400">*</span></label>
                      <div className="relative"><Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" className={`${fieldCls} pl-8`} placeholder="john@example.com" /></div>
                    </div>
                    <div><label className={labelCls}>Phone Number <span className="text-rose-400">*</span></label>
                      <div className="relative"><Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className={`${fieldCls} pl-8`} placeholder="+1 234 567 890" /></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Contact Number</label><input className={fieldCls} placeholder="Alternate contact number" /></div>
                    <div><label className={labelCls}>Address</label><input className={fieldCls} placeholder="Full address" /></div>
                  </div>
                </div>

                {/* Logistics Address */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<MapPin size={15} className="text-amber-600" />} title="Logistics Address" color="bg-amber-50 border-amber-100" />
                  <div><label className={labelCls}>Street Address</label>
                    <textarea rows={2} className={`${fieldCls} h-auto py-2.5 resize-none`} placeholder="123 Business Ave, Suite 100" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>City</label><input className={fieldCls} placeholder="City" /></div>
                    <div><label className={labelCls}>State / Province</label><input className={fieldCls} placeholder="State" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Pin Code</label><input className={fieldCls} placeholder="Postal / Pin code" /></div>
                    <div><label className={labelCls}>Country <span className="text-rose-400">*</span></label>
                      <select className={selectCls}><option>India</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option></select>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<Landmark size={15} className="text-blue-600" />} title="Bank Details" color="bg-blue-50 border-blue-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>A/c Name</label><input className={fieldCls} placeholder="Account holder name" /></div>
                    <div><label className={labelCls}>A/c No</label><input className={fieldCls} placeholder="Bank account number" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>PAN</label><input className={fieldCls} placeholder="PAN number" /></div>
                    <div><label className={labelCls}>Bank</label><input className={fieldCls} placeholder="Bank name" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Branch</label><input className={fieldCls} placeholder="Branch name" /></div>
                    <div><label className={labelCls}>IFSC</label><input className={fieldCls} placeholder="IFSC code" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <CreatableSelect label="Vendor Type" value={vendorType} onChange={setVendorType}
                        options={vendorTypeOptions} onAddNew={v => setVendorTypeOptions(p => p.includes(v) ? p : [...p, v])} />
                    </div>
                    <div><label className={labelCls}>Partner Type</label><input className={fieldCls} placeholder="Partner type" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>CR Number</label><input className={fieldCls} placeholder="CR number" /></div>
                    <div><label className={labelCls}>GST Code</label><input className={fieldCls} placeholder="GST code" /></div>
                  </div>
                </div>

                {/* Accounting */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<Settings2 size={15} className="text-violet-600" />} title="Accounting & Compliance" color="bg-violet-50 border-violet-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>GL Account <span className="text-rose-400">*</span></label><input className={fieldCls} defaultValue="Accounts Payable" /></div>
                    <div><label className={labelCls}>Advance Account Mapped To</label><input className={fieldCls} defaultValue="Vendor Advances" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Average Delivery Delay (days)</label><input type="number" min={0} className={fieldCls} placeholder="0" /></div>
                    <div><label className={labelCls}>Invoice Due Days</label><input type="number" min={0} className={fieldCls} placeholder="30" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Reminder</label><input className={fieldCls} placeholder="Reminder note" /></div>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={autoGL} onChange={e => setAutoGL(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                      <span className="text-xs font-medium text-slate-600">Auto Generate GL Account</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={inactive} onChange={e => setInactive(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-200" />
                      <span className="text-xs font-medium text-slate-600">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<CreditCard size={15} className="text-slate-600" />} title="Procurement Dynamics" color="bg-slate-50 border-slate-200" />
                  <div><label className={labelCls}>Payment Terms</label>
                    <select className={selectCls}><option>Net 30</option><option>Net 60</option><option>Net 90</option><option>Due on Receipt</option></select>
                  </div>
                  <div><label className={labelCls}>Payment Method <span className="text-rose-400">*</span></label>
                    <select className={selectCls}><option>Credit</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option></select>
                  </div>
                  <div><label className={labelCls}>Currency <span className="text-rose-400">*</span></label>
                    <select className={selectCls}><option>Indian Rupee</option><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
                  </div>
                  <div><label className={labelCls}>Pay All Payments From</label><input className={fieldCls} placeholder="Account / bank" /></div>
                  <div><label className={labelCls}>Status</label>
                    <select className={selectCls}><option>Active</option><option>Inactive</option></select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                    <input type="checkbox" checked={allowCashPay} onChange={e => setAllowCashPay(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                    <span className="text-xs font-medium text-slate-600">Allow Cash Pay</span>
                  </label>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <SH icon={<FileText size={15} className="text-slate-400" />} title="Internal Intelligence" color="bg-slate-50 border-slate-200" />
                  <div><label className={labelCls}>Internal Remarks</label>
                    <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`} placeholder="Add any internal notes..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-white flex-shrink-0">
            <button onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!vendorName.trim()}
              className="flex-1 h-11 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10">
              <Save size={14} /> Register & Select Vendor
            </button>
          </div>
        </motion.div>
    </div>
  );
};

export default AddVendorModal;
