import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Save, RotateCcw, CreditCard, User, 
  Phone, Mail, Globe, Plus, X 
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { salesApi } from "../../../services/api";

/* ── tiny inline select with + button ── */
interface CreatableSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onAdd: () => void;
  placeholder?: string;
  required?: boolean;
}
const CreatableSelect: React.FC<CreatableSelectProps> = ({
  label, value, onChange, options, onAdd, placeholder = "Highlight selection…", required
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label} {required && <span className="text-rose-400">*</span>}</label>
    <div className="flex gap-2 items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 h-11 px-4 text-[13px] border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <button
        type="button"
        onClick={onAdd}
        title={`Add new ${label}`}
        className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition active:scale-90"
      >
        <Plus size={18} />
      </button>
    </div>
  </div>
);

/* ── quick-add modal ── */
const QuickAddModal: React.FC<{ title: string; onClose: () => void; onSave: (v: string) => void }> = ({ title, onClose, onSave }) => {
  const [val, setVal] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-base">New {title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title} Name</label>
          <input autoFocus className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && val.trim() && onSave(val.trim())} />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold">Cancel</button>
          <button onClick={() => val.trim() && onSave(val.trim())} disabled={!val.trim()} className="flex-1 h-11 rounded-xl bg-[#002147] text-white text-sm font-semibold disabled:opacity-50">Create</button>
        </div>
      </motion.div>
    </div>
  );
};

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    contactPerson: '',
    creditLimit: '0',
    isActive: true,
    code: '',
    type: 'Business',
    website: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    creditTerms: 'Net 30',
    currency: 'USD ($)',
    priceList: 'Standard Price'
  });

  // Dynamic Options
  const [types, setTypes] = useState(['Business', 'Individual', 'Reseller', 'Strategic Partner']);
  const [countries, setCountries] = useState(['United States', 'United Kingdom', 'Canada', 'India', 'Australia', 'Germany']);
  const [showModal, setShowModal] = useState<'Type' | 'Country' | null>(null);

  useEffect(() => {
    generateCustomerCode();
  }, [companyId]);

  const generateCustomerCode = async () => {
    try {
      const res = await salesApi.getCustomers(companyId);
      if (res.success) {
        const customers = res.data.items || res.data || [];
        const codes = customers.map((c: any) => c.code || '').filter((c: string) => c.startsWith('CUST-'));
        let next = 1;
        if (codes.length > 0) {
          const nums = codes.map((c: string) => parseInt(c.replace('CUST-', ''))).filter((n: number) => !isNaN(n));
          if (nums.length > 0) next = Math.max(...nums) + 1;
        }
        setForm(p => ({ ...p, code: `CUST-${next.toString().padStart(3, '0')}` }));
      }
    } catch (e) {
      setForm(p => ({ ...p, code: 'CUST-001' }));
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.email) {
      showNotification({ type: 'error', title: 'Validation', message: 'Name, Email, and Phone are required.' });
      return;
    }
    setLoading(true);
    try {
      // Mapping the complex FE form to the existing BE Customer DTO
      const payload = {
        companyId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        gstNumber: form.gstNumber,
        contactPerson: form.contactPerson,
        creditLimit: parseFloat(form.creditLimit) || 0,
        isActive: form.isActive,
        customerCode: form.code,
        customerType: form.type,
        country: form.country,
        creditTerms: form.creditTerms,
        currency: form.currency,
        priceList: form.priceList,
        website: form.website
      };
      
      const res = await salesApi.createCustomer(payload);
      if (res.success) {
        showNotification({ type: 'success', title: 'Success', message: 'Customer registered successfully!' });
        
        // Handle redirect back to dispatch if requested
        const query = new URLSearchParams(window.location.search);
        if (query.get('from') === 'dispatch') {
          localStorage.setItem('lastCreatedCustomerId', res.data.id.toString());
          navigate('/admin/inventory/dispatch/new');
        } else {
          navigate('/admin/sales/customers');
        }
      } else {
        showNotification({ type: 'error', title: 'Error', message: res.message || 'Operation failed' });
      }
    } catch (e) {
      showNotification({ type: 'error', title: 'Error', message: 'Unexpected API error' });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(p => ({
      ...p,
      name: '', email: '', phone: '', address: '', gstNumber: '', contactPerson: '',
      creditLimit: '0', website: '', city: '', state: '', postalCode: ''
    }));
    generateCustomerCode();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-4 pb-12 px-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20 py-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/sales/customers')} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition active:scale-90">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Customer</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20" /> Active Entity: Hari Silks
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Architecture */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><User size={18} /></div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Architecture</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <CreatableSelect label="Customer Type" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={types} onAdd={() => setShowModal('Type')} required />
              <Input label="Customer Code" value={form.code} readOnly required />
            </div>

            <Input label="Customer Name" placeholder="e.g. Acme Corp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            
            <div className="grid grid-cols-2 gap-5">
              <Input label="Tax ID / VAT Number" placeholder="TAX-998877" value={form.gstNumber} onChange={e => setForm(p => ({ ...p, gstNumber: e.target.value }))} />
              <Input label="Website" placeholder="https://example.com" leftIcon={<Globe size={14} />} value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Phone size={18} /></div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <Input label="Contact Person" placeholder="Manager Name" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} />
              <Input label="Phone Number" placeholder="+1 234 567 890" leftIcon={<Phone size={14} />} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
            </div>
            
            <Input label="Email Address" type="email" placeholder="billing@customer.com" leftIcon={<Mail size={14} />} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>

          {/* Section 3: Address */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><MapPin size={18} /></div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Address Details</h3>
            </div>
            <Textarea label="Street Address" placeholder="456 Avenue, Building A" rows={2} value={form.address} onChange={v => setForm(p => ({ ...p, address: v.target.value }))} className="rounded-xl border-slate-200" />
            <div className="grid grid-cols-2 gap-5">
              <Input label="City" placeholder="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              <Input label="State / Province" placeholder="State" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Postal Code" placeholder="Postal Code" value={form.postalCode} onChange={e => setForm(p => ({ ...p, postalCode: e.target.value }))} />
              <CreatableSelect label="Country" placeholder="Select country…" value={form.country} onChange={v => setForm(p => ({ ...p, country: v }))} options={countries} onAdd={() => setShowModal('Country')} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6 sticky top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600"><CreditCard size={18} /></div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Sales Info</h3>
            </div>
            <Select label="Credit Terms" options={['Net 15', 'Net 30', 'Net 45', 'Due on Receipt'].map(o => ({ label: o, value: o }))} value={form.creditTerms} onChange={e => setForm(p => ({ ...p, creditTerms: e.target.value }))} className="h-11 rounded-xl" />
            <Select label="Currency" options={['USD ($)', 'EUR (€)', 'INR (₹)', 'GBP (£)'].map(o => ({ label: o, value: o }))} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} className="h-11 rounded-xl" />
            <Select label="Price List" options={['Standard Price', 'Wholesale Price', 'Dealer Price'].map(o => ({ label: o, value: o }))} value={form.priceList} onChange={e => setForm(p => ({ ...p, priceList: e.target.value }))} className="h-11 rounded-xl" />
            
            <div className="pt-4 border-t border-slate-50">
              <Select label="Account Status" options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} value={form.isActive ? 'Active' : 'Inactive'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'Active' }))} className="h-11 rounded-xl" />
            </div>

            <div className="space-y-3 pt-4">
              <Button variant="primary" fullWidth leftIcon={loading ? null : <Save size={18} />} onClick={handleSave} disabled={loading} className="bg-[#002147] hover:bg-[#003366] h-14 text-[13px] font-bold rounded-2xl shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                {loading ? 'Registering…' : 'Save Customer'}
              </Button>
              <Button variant="secondary" fullWidth leftIcon={<RotateCcw size={18} />} onClick={reset} className="h-14 text-[13px] font-bold rounded-2xl border-slate-100 text-slate-500 hover:bg-slate-50 active:scale-95 transition-all">
                Reset Interface
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <QuickAddModal 
          title={showModal} 
          onClose={() => setShowModal(null)} 
          onSave={v => {
            if (showModal === 'Type') { setTypes(p => [...p, v]); setForm(p => ({ ...p, type: v })); }
            else { setCountries(p => [...p, v]); setForm(p => ({ ...p, country: v })); }
            setShowModal(null);
            showNotification({ type: 'success', title: 'Option Added', message: `"${v}" added to ${showModal === 'Type' ? 'Customer Types' : 'Countries'}.` });
          }} 
        />
      )}
    </motion.div>
  );
};

export default AddCustomerPage;
