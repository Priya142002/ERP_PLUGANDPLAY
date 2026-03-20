import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Truck, Calendar, Package, MapPin, Save,
  RotateCcw, Plus, Trash2, X, User, Phone, Mail, ExternalLink
} from "lucide-react";
import Button from "../../../components/ui/Button";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Customer { id: string; name: string; phone?: string; email?: string; }
interface DispatchItem { id: string; product: string; warehouse: string; stock: string; qty: number; }

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Global Tech Solutions',  phone: '+1 234 567 890', email: 'billing@globaltech.com' },
  { id: '2', name: 'Vertex Industries',       phone: '+1 345 678 901', email: 'accounts@vertex.com'    },
  { id: '3', name: 'Apex Manufacturing',      phone: '+1 456 789 012', email: 'ap@apexmfg.com'         },
  { id: '4', name: 'Blue Horizon Ltd',        phone: '+1 567 890 123', email: 'info@bluehorizon.com'   },
];

const PRODUCTS = ['Premium Wireless Headphones', 'Smart Fitness Tracker', '4K Ultra HD Monitor', 'Ergonomic Office Chair'];
const WAREHOUSES = ['Main Warehouse', 'West Coast Hub', 'Central Distribution', 'South Terminal'];
const CARRIERS   = ['FedEx', 'UPS', 'DHL', 'Express Freight', 'Self Pickup'];

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

/* ─────────────────────────────────────────
   Add Customer Modal (mirrors AddCustomerPage)
───────────────────────────────────────── */
interface AddCustomerModalProps {
  onClose: () => void;
  onSave: (c: Customer) => void;
}
const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'Business', code: '', contactPerson: '', city: '', country: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ id: Date.now().toString(), name: form.name.trim(), phone: form.phone, email: form.email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><User size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">New Customer</h3>
              <p className="text-[10px] text-slate-400">Fill details to register a new customer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Open full page */}
            <button onClick={() => { onClose(); navigate('/admin/sales/customers/add'); }}
              title="Open full customer form"
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition">
              <ExternalLink size={12} /> Full Form
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Customer Type</label>
              <select className={fieldCls} value={form.type} onChange={e => set('type', e.target.value)}>
                <option>Business</option><option>Individual</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Customer Code</label>
              <input className={fieldCls} placeholder="CUST-007" value={form.code} onChange={e => set('code', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Customer Name <span className="text-rose-400">*</span></label>
            <input className={fieldCls} placeholder="e.g. Acme Corp" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Contact Person</label>
              <input className={fieldCls} placeholder="Manager Name" value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Phone <span className="text-rose-400">*</span></label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={`${fieldCls} pl-8`} placeholder="+1 234 567 890" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Email <span className="text-rose-400">*</span></label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className={`${fieldCls} pl-8`} type="email" placeholder="billing@customer.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input className={fieldCls} placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <select className={fieldCls} value={form.country} onChange={e => set('country', e.target.value)}>
                <option value="">Select country</option>
                <option>United States</option><option>United Kingdom</option><option>Canada</option><option>India</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <button onClick={onClose} 
            style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
            className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!form.name.trim()}
            style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
            className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            <Save size={14} /> Save Customer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export const CreateDispatchPage: React.FC = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [customerId, setCustomerId] = useState('');
  const [carrier, setCarrier] = useState('');
  const [sourceWH, setSourceWH] = useState('');
  const [tracking, setTracking] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [items, setItems] = useState<DispatchItem[]>([
    { id: '1', product: '', warehouse: '', stock: '—', qty: 0 }
  ]);

  const addItem = () => setItems(p => [...p, { id: Date.now().toString(), product: '', warehouse: '', stock: '—', qty: 0 }]);
  const removeItem = (id: string) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: string, k: keyof DispatchItem, v: any) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const selectedCustomer = customers.find(c => c.id === customerId);

  const handleAddCustomer = (c: Customer) => {
    setCustomers(p => [...p, c]);
    setCustomerId(c.id);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6 pb-12">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/inventory/dispatch')}
            className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Material Dispatch</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ── Left: Main Details ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Shipment Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600"><Truck size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Shipment Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Dispatch No</label>
                  <input className={fieldCls} defaultValue="DISP-10025" />
                </div>
                <div>
                  <label className={labelCls}>Dispatch Date</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" className={`${fieldCls} pl-8`} defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
              </div>

              {/* Customer with + button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Customer <span className="text-rose-400">*</span></label>
                  <div className="flex gap-2">
                    <select className={`${fieldCls} flex-1`} value={customerId} onChange={e => setCustomerId(e.target.value)}>
                      <option value="">Select customer…</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowAddCustomer(true)} title="Add new customer"
                      className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
                      <Plus size={15} />
                    </button>
                  </div>
                  {/* Selected customer info */}
                  {selectedCustomer && (
                    <div className="mt-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <User size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-indigo-800 truncate">{selectedCustomer.name}</p>
                        {selectedCustomer.phone && <p className="text-[10px] text-indigo-500">{selectedCustomer.phone}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Carrier / Shipping Method</label>
                  <select className={fieldCls} value={carrier} onChange={e => setCarrier(e.target.value)}>
                    <option value="">Select carrier…</option>
                    {CARRIERS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Dispatch Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Package size={16} /></div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Dispatch Items</h3>
                </div>
                <button onClick={addItem}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition">
                  <Plus size={13} /> Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Warehouse</th>
                      <th className="px-5 py-3 text-center">Stock</th>
                      <th className="px-5 py-3 w-28">Qty to Ship</th>
                      <th className="px-5 py-3 text-center w-14"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map(item => (
                      <tr key={item.id} className="group">
                        <td className="px-5 py-3">
                          <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                            <option value="">Select product…</option>
                            {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <select className={fieldCls} value={item.warehouse} onChange={e => updateItem(item.id, 'warehouse', e.target.value)}>
                            <option value="">Select warehouse…</option>
                            {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-sm font-medium text-slate-500">{item.stock}</span>
                        </td>
                        <td className="px-5 py-3">
                          <input type="number" min={0} className={fieldCls} placeholder="0"
                            value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} />
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><MapPin size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Logistics</h3>
              </div>
              <div>
                <label className={labelCls}>Source Warehouse <span className="text-rose-400">*</span></label>
                <select className={fieldCls} value={sourceWH} onChange={e => setSourceWH(e.target.value)}>
                  <option value="">Select source…</option>
                  {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tracking Number</label>
                <input className={fieldCls} placeholder="Enter tracking ID" value={tracking} onChange={e => setTracking(e.target.value)} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className={labelCls}>Special Instructions</label>
              <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                placeholder="Add any shipping notes…" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div className="space-y-3">
              <Button variant="primary" fullWidth leftIcon={<Save size={16} />}
                className="py-4 bg-[#002147] hover:bg-[#003366] border-none shadow-lg rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                Confirm Dispatch
              </Button>
              <Button variant="secondary" fullWidth leftIcon={<RotateCcw size={16} />}
                className="py-4 rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                Reset Form
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomer && (
          <AddCustomerModal key="add-customer"
            onClose={() => setShowAddCustomer(false)}
            onSave={handleAddCustomer} />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateDispatchPage;
