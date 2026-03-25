import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Download, Edit, Trash2, Phone, Mail, X, Save,
  AlertTriangle, Building2, MapPin, Globe, Landmark, Settings2,
  CreditCard, FileText
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications } from "../../../context/AppContext";
import { exportToExcel } from "../../../utils/reportGenerator";

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";
const selectCls = `${fieldCls} appearance-none`;

interface Vendor {
  id: string;
  name: string; nameAbbr: string; code: string; category: string;
  taxNumber: string; taxType: string; discount: string; company: string;
  website: string; gstNo: string;
  contact: string; designation: string; email: string; phone: string;
  contactNumber: string; address: string;
  street: string; city: string; state: string; pinCode: string; country: string;
  acName: string; acNo: string; pan: string; bank: string; branch: string;
  ifsc: string; vendorType: string; partnerType: string; crNumber: string; gstCode: string;
  glAccount: string; advanceAccount: string; avgDeliveryDelay: string;
  invoiceDueDays: string; reminder: string; autoGL: boolean; inactive: boolean;
  paymentTerms: string; paymentMethod: string; currency: string;
  payFrom: string; status: string; allowCashPay: boolean;
  internalRemarks: string; balance: string; location: string;
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: '1', name: 'TechNova Solutions', nameAbbr: 'TechNova', code: 'VND-001',
    category: 'Suppliers', taxNumber: 'TRN001', taxType: 'GST', discount: '5',
    company: 'TechNova Inc', website: 'https://technova.com', gstNo: 'GST001',
    contact: 'John Carter', designation: 'Sales Manager', email: 'john@technova.com',
    phone: '+1 234 567 890', contactNumber: '', address: '123 Tech Ave',
    street: '123 Tech Ave', city: 'New York', state: 'NY', pinCode: '10001', country: 'United States',
    acName: 'TechNova Solutions', acNo: '1234567890', pan: 'ABCDE1234F',
    bank: 'Chase Bank', branch: 'Manhattan', ifsc: 'CHAS0001234',
    vendorType: 'Company', partnerType: 'Primary', crNumber: 'CR001', gstCode: 'GST001',
    glAccount: 'Accounts Payable', advanceAccount: 'Vendor Advances',
    avgDeliveryDelay: '2', invoiceDueDays: '30', reminder: '',
    autoGL: false, inactive: false,
    paymentTerms: 'Net 30', paymentMethod: 'Bank Transfer', currency: 'USD ($)',
    payFrom: '', status: 'Active', allowCashPay: false,
    internalRemarks: '', balance: '₹2,400.00', location: 'Mumbai, India',
  },
  {
    id: '2', name: 'Global Logistics', nameAbbr: 'GlobalLog', code: 'VND-002',
    category: 'Service Providers', taxNumber: '', taxType: 'VAT', discount: '0',
    company: 'Global Logistics Ltd', website: '', gstNo: '',
    contact: 'Sarah Jenkins', designation: 'Account Manager', email: 'sarah@globallog.com',
    phone: '+1 987 654 321', contactNumber: '', address: '456 Logistics Blvd',
    street: '456 Logistics Blvd', city: 'London', state: 'England', pinCode: 'EC1A 1BB', country: 'United Kingdom',
    acName: 'Global Logistics', acNo: '9876543210', pan: '',
    bank: 'Barclays', branch: 'London City', ifsc: '',
    vendorType: 'Company', partnerType: '', crNumber: '', gstCode: '',
    glAccount: 'Accounts Payable', advanceAccount: 'Vendor Advances',
    avgDeliveryDelay: '0', invoiceDueDays: '30', reminder: '',
    autoGL: false, inactive: false,
    paymentTerms: 'Net 60', paymentMethod: 'Bank Transfer', currency: 'GBP (£)',
    payFrom: '', status: 'Active', allowCashPay: false,
    internalRemarks: '', balance: '₹0.00', location: 'London, UK',
  },
  {
    id: '3', name: 'Office Essentials', nameAbbr: 'OfficeEss', code: 'VND-003',
    category: 'Wholesalers', taxNumber: '', taxType: 'None', discount: '10',
    company: 'Office Essentials Corp', website: '', gstNo: '',
    contact: 'Michael Ross', designation: 'Director', email: 'mike@office.com',
    phone: '+44 20 7946 0958', contactNumber: '', address: '789 Office Park',
    street: '789 Office Park', city: 'Toronto', state: 'Ontario', pinCode: 'M5H 2N2', country: 'Canada',
    acName: 'Office Essentials', acNo: '1122334455', pan: '',
    bank: 'TD Bank', branch: 'Toronto Downtown', ifsc: '',
    vendorType: 'Company', partnerType: '', crNumber: '', gstCode: '',
    glAccount: 'Accounts Payable', advanceAccount: 'Vendor Advances',
    avgDeliveryDelay: '5', invoiceDueDays: '45', reminder: '',
    autoGL: false, inactive: true,
    paymentTerms: 'Net 30', paymentMethod: 'Cheque', currency: 'USD ($)',
    payFrom: '', status: 'Inactive', allowCashPay: false,
    internalRemarks: '', balance: '₹850.00', location: 'Toronto, CA',
  },
];

const TABS = ['All Suppliers', 'Critical Partners', 'Active Vendors', 'Recent Contracts'] as const;
type Tab = typeof TABS[number];

/* ── Section Header ── */
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-1">
    <div className={`h-7 w-7 rounded-lg flex items-center justify-center border ${color}`}>{icon}</div>
    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
  </div>
);

/* ── Creatable Select ── */
const CreatableSelect: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; onAddNew: (v: string) => void; required?: boolean;
}> = ({ label, value, onChange, options, onAddNew, required }) => {
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
          <button type="button" onClick={handleAdd}
            className="h-10 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">Add</button>
          <button type="button" onClick={() => setAdding(false)}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"><X size={14} /></button>
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

/* ── Edit Modal ── */
const EditModal: React.FC<{ vendor: Vendor; onClose: () => void; onSave: (v: Vendor) => void }> = ({ vendor, onClose, onSave }) => {
  const [form, setForm] = useState<Vendor>({ ...vendor });
  const [vendorTypeOptions, setVendorTypeOptions] = useState(['Individual', 'Company', 'Partnership', 'Sole Proprietor']);
  const set = (k: keyof Vendor, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
          style={{ backgroundColor: '#ffffff' }}
          onClick={e => e.stopPropagation()}>

          {/* Sticky Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Building2 size={16} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Edit Vendor</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.code}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* ── Left / Main ── */}
              <div className="md:col-span-2 space-y-5">

                {/* Company Architecture */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<Building2 size={13} className="text-indigo-600" />} title="Company Architecture" color="bg-indigo-50 border-indigo-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Vendor Name <span className="text-rose-400">*</span></label>
                      <input className={fieldCls} value={form.name} onChange={e => set('name', e.target.value)} /></div>
                    <div><label className={labelCls}>Vendor Name (Abbr)</label>
                      <input className={fieldCls} value={form.nameAbbr} onChange={e => set('nameAbbr', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Vendor No</label>
                      <input className={fieldCls} value={form.code} onChange={e => set('code', e.target.value)} /></div>
                    <div><label className={labelCls}>Vendor Category</label>
                      <select className={selectCls} value={form.category} onChange={e => set('category', e.target.value)}>
                        <option value="">Select…</option>
                        <option>Suppliers</option><option>Service Providers</option>
                        <option>Manufacturers</option><option>Wholesalers</option>
                      </select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Tax Number / VAT</label>
                      <input className={fieldCls} value={form.taxNumber} onChange={e => set('taxNumber', e.target.value)} /></div>
                    <div><label className={labelCls}>Tax Type</label>
                      <select className={selectCls} value={form.taxType} onChange={e => set('taxType', e.target.value)}>
                        <option value="">Select…</option><option>GST</option><option>VAT</option><option>None</option>
                      </select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Discount (%)</label>
                      <input type="number" className={fieldCls} value={form.discount} onChange={e => set('discount', e.target.value)} /></div>
                    <div><label className={labelCls}>Company</label>
                      <input className={fieldCls} value={form.company} onChange={e => set('company', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Website</label>
                      <div className="relative"><Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className={`${fieldCls} pl-8`} value={form.website} onChange={e => set('website', e.target.value)} /></div></div>
                    <div><label className={labelCls}>GST No</label>
                      <input className={fieldCls} value={form.gstNo} onChange={e => set('gstNo', e.target.value)} /></div>
                  </div>
                </div>

                {/* Strategic Contact */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<Phone size={13} className="text-blue-600" />} title="Strategic Contact" color="bg-blue-50 border-blue-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Contact Person <span className="text-rose-400">*</span></label>
                      <input className={fieldCls} value={form.contact} onChange={e => set('contact', e.target.value)} /></div>
                    <div><label className={labelCls}>Designation</label>
                      <input className={fieldCls} value={form.designation} onChange={e => set('designation', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Email Address <span className="text-rose-400">*</span></label>
                      <div className="relative"><Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" className={`${fieldCls} pl-8`} value={form.email} onChange={e => set('email', e.target.value)} /></div></div>
                    <div><label className={labelCls}>Phone Number</label>
                      <div className="relative"><Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className={`${fieldCls} pl-8`} value={form.phone} onChange={e => set('phone', e.target.value)} /></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Contact Number</label>
                      <input className={fieldCls} value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} /></div>
                    <div><label className={labelCls}>Address</label>
                      <input className={fieldCls} value={form.address} onChange={e => set('address', e.target.value)} /></div>
                  </div>
                </div>

                {/* Logistics Address */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<MapPin size={13} className="text-amber-600" />} title="Logistics Address" color="bg-amber-50 border-amber-100" />
                  <div><label className={labelCls}>Street Address</label>
                    <textarea rows={2} className={`${fieldCls} h-auto py-2.5 resize-none`} value={form.street} onChange={e => set('street', e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>City</label>
                      <input className={fieldCls} value={form.city} onChange={e => set('city', e.target.value)} /></div>
                    <div><label className={labelCls}>State / Province</label>
                      <input className={fieldCls} value={form.state} onChange={e => set('state', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Pin Code</label>
                      <input className={fieldCls} value={form.pinCode} onChange={e => set('pinCode', e.target.value)} /></div>
                    <div><label className={labelCls}>Country</label>
                      <select className={selectCls} value={form.country} onChange={e => set('country', e.target.value)}>
                        <option>India</option><option>United States</option>
                        <option>United Kingdom</option><option>Canada</option><option>Australia</option>
                      </select></div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<Landmark size={13} className="text-blue-600" />} title="Bank Details" color="bg-blue-50 border-blue-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>A/c Name</label>
                      <input className={fieldCls} value={form.acName} onChange={e => set('acName', e.target.value)} /></div>
                    <div><label className={labelCls}>A/c No</label>
                      <input className={fieldCls} value={form.acNo} onChange={e => set('acNo', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>PAN</label>
                      <input className={fieldCls} value={form.pan} onChange={e => set('pan', e.target.value)} /></div>
                    <div><label className={labelCls}>Bank</label>
                      <input className={fieldCls} value={form.bank} onChange={e => set('bank', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Branch</label>
                      <input className={fieldCls} value={form.branch} onChange={e => set('branch', e.target.value)} /></div>
                    <div><label className={labelCls}>IFSC</label>
                      <input className={fieldCls} value={form.ifsc} onChange={e => set('ifsc', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <CreatableSelect label="Vendor Type" value={form.vendorType} onChange={v => set('vendorType', v)}
                        options={vendorTypeOptions} onAddNew={v => setVendorTypeOptions(p => p.includes(v) ? p : [...p, v])} />
                    </div>
                    <div><label className={labelCls}>Partner Type</label>
                      <input className={fieldCls} value={form.partnerType} onChange={e => set('partnerType', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>CR Number</label>
                      <input className={fieldCls} value={form.crNumber} onChange={e => set('crNumber', e.target.value)} /></div>
                    <div><label className={labelCls}>GST Code</label>
                      <input className={fieldCls} value={form.gstCode} onChange={e => set('gstCode', e.target.value)} /></div>
                  </div>
                </div>

                {/* Accounting & Compliance */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<Settings2 size={13} className="text-violet-600" />} title="Accounting & Compliance" color="bg-violet-50 border-violet-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>GL Account <span className="text-rose-400">*</span></label>
                      <input className={fieldCls} value={form.glAccount} onChange={e => set('glAccount', e.target.value)} /></div>
                    <div><label className={labelCls}>Advance Account Mapped To</label>
                      <input className={fieldCls} value={form.advanceAccount} onChange={e => set('advanceAccount', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Avg Delivery Delay (days)</label>
                      <input type="number" className={fieldCls} value={form.avgDeliveryDelay} onChange={e => set('avgDeliveryDelay', e.target.value)} /></div>
                    <div><label className={labelCls}>Invoice Due Days</label>
                      <input type="number" className={fieldCls} value={form.invoiceDueDays} onChange={e => set('invoiceDueDays', e.target.value)} /></div>
                  </div>
                  <div><label className={labelCls}>Reminder</label>
                    <input className={fieldCls} value={form.reminder} onChange={e => set('reminder', e.target.value)} /></div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form.autoGL} onChange={e => set('autoGL', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                      <span className="text-xs font-medium text-slate-600">Auto Generate GL Account</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={form.inactive} onChange={e => set('inactive', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-200" />
                      <span className="text-xs font-medium text-slate-600">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-5">

                {/* Procurement Dynamics */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<CreditCard size={13} className="text-slate-600" />} title="Procurement Dynamics" color="bg-slate-100 border-slate-200" />
                  <div><label className={labelCls}>Payment Terms</label>
                    <select className={selectCls} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
                      <option>Net 30</option><option>Net 60</option><option>Net 90</option><option>Due on Receipt</option>
                    </select></div>
                  <div><label className={labelCls}>Payment Method <span className="text-rose-400">*</span></label>
                    <select className={selectCls} value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
                      <option>Credit</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option>
                    </select></div>
                  <div><label className={labelCls}>Currency <span className="text-rose-400">*</span></label>
                    <select className={selectCls} value={form.currency} onChange={e => set('currency', e.target.value)}>
                      <option>Indian Rupee</option><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
                    </select></div>
                  <div><label className={labelCls}>Pay All Payments From</label>
                    <input className={fieldCls} value={form.payFrom} onChange={e => set('payFrom', e.target.value)} /></div>
                  <div><label className={labelCls}>Status</label>
                    <select className={selectCls} value={form.status} onChange={e => set('status', e.target.value)}>
                      <option>Active</option><option>Inactive</option>
                    </select></div>
                  <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                    <input type="checkbox" checked={form.allowCashPay} onChange={e => set('allowCashPay', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                    <span className="text-xs font-medium text-slate-600">Allow Cash Pay</span>
                  </label>
                </div>

                {/* Internal Intelligence */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <SectionHeader icon={<FileText size={13} className="text-slate-400" />} title="Internal Intelligence" color="bg-slate-100 border-slate-200" />
                  <div><label className={labelCls}>Internal Remarks</label>
                    <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                      value={form.internalRemarks} onChange={e => set('internalRemarks', e.target.value)} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
            <button onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button onClick={() => { onSave(form); onClose(); }}
              className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2">
              <Save size={14} /> Update Vendor
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ name: string; onClose: () => void; onConfirm: () => void }> = ({ name, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Vendor</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{name}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose}
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }}
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Page ── */
export const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [activeTab, setActiveTab] = useState<Tab>('All Suppliers');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);

  const displayed = useMemo(() => {
    let list = [...vendors];
    if (activeTab === 'Active Vendors') list = list.filter(v => v.status === 'Active');
    if (search) list = list.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.contact.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus) list = list.filter(v => v.status === filterStatus);
    return list;
  }, [vendors, activeTab, search, filterStatus]);

  const handleSave = (updated: Vendor) => setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
  const handleDelete = (id: string) => setVendors(prev => prev.filter(v => v.id !== id));

  const handleExportExcel = () => {
    try {
      const exportData = displayed.map(vendor => [
        vendor.name,
        vendor.code,
        vendor.contact,
        vendor.email,
        vendor.phone,
        vendor.balance,
        vendor.status
      ]);

      exportToExcel(
        [
          {
            sheetName: 'Vendors',
            headers: ['Vendor Name', 'Code', 'Contact Person', 'Email', 'Phone', 'Outstanding Balance', 'Status'],
            data: exportData
          }
        ],
        'Vendors_Data_Mar_2026'
      );

      showNotification({
        type: 'success',
        title: 'Excel Downloaded',
        message: 'Vendor data exported successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export vendor data'
      });
      console.error('Export error:', error);
    }
  };

  const columns = [
    {
      key: 'name' as const, label: 'Vendor Name',
      render: (value: string, item: Vendor) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{item.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact' as const, label: 'Contact Person',
      render: (value: string, item: Vendor) => (
        <div>
          <div className="text-sm font-medium text-slate-700">{value}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Mail size={9} /> {item.email}
          </div>
        </div>
      )
    },
    {
      key: 'phone' as const, label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Phone size={12} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'balance' as const, label: 'Outstanding Balance', align: 'right' as const,
      render: (val: string) => (
        <span className={`font-bold ${parseFloat(val.replace(/[$,]/g, '')) > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{val}</span>
      )
    },
    {
      key: 'status' as const, label: 'Status',
      render: (value: string) => value === 'Active' ? (
        <div className="flex items-center gap-1.5 text-blue-600">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Inactive</span>
        </div>
      )
    }
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor</h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200 [&_svg]:!stroke-black" 
              leftIcon={<Download size={14} />}
              onClick={handleExportExcel}
            >
              Export
            </Button>
            <Button variant="primary"
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 [&_svg]:!stroke-white"
              leftIcon={<Plus size={14} style={{ stroke: 'white' }} />}
              onClick={() => navigate('/admin/purchase/vendors/add')}>
              New Vendor
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
                activeTab === tab ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <TableFilters
          searchValue={search}
          searchPlaceholder="Search vendors..."
          onSearchChange={setSearch}
          filters={[{ label: 'Filter Status', value: filterStatus, options: ['Active', 'Inactive'], onChange: setFilterStatus }]}
          onClearAll={() => { setSearch(''); setFilterStatus(''); }}
          showClearButton={!!(search || filterStatus)}
        />

        <DataTableWrapper
          data={displayed}
          columns={columns}
          actions={[
            { label: 'Edit', icon: <Edit size={14} />, onClick: () => navigate('/admin/purchase/vendors/add'), variant: 'primary', title: 'Edit' },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: item => setDeleteVendor(item), variant: 'danger', title: 'Delete' }
          ]}
          emptyMessage="No vendors found"
        />
      </motion.div>

      <AnimatePresence>
        {editVendor && (
          <EditModal key="edit" vendor={editVendor} onClose={() => setEditVendor(null)} onSave={handleSave} />
        )}
        {deleteVendor && (
          <DeleteModal key="delete" name={deleteVendor.name} onClose={() => setDeleteVendor(null)} onConfirm={() => handleDelete(deleteVendor.id)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default VendorsPage;
