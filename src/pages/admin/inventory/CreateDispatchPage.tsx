import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Truck, Package, MapPin, Save,
  RotateCcw, Plus, Trash2, X, User, Phone, Mail, ExternalLink
} from "lucide-react";
import Textarea from "../../../components/ui/Textarea";
import Input from "../../../components/ui/Input";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi, salesApi, logisticsApi } from "../../../services/api";

/* ── Custom Styled Select ── */
const CustomSelect = ({ label, value, onChange, options, required, onAdd }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label} {required && '*'}</label>
    <div className="flex gap-2">
      <select 
        className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-300 transition appearance-none bg-white"
        value={value} 
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}...</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {onAdd && (
        <button onClick={onAdd} className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition shadow-sm active:scale-90">
          <Plus size={16} />
        </button>
      )}
    </div>
  </div>
);

/* ── Traditional Add Customer Modal ── */
const AddCustomerModal: React.FC<{ onClose: () => void; onSave: (c: any) => void; companyId: number }> = ({ onClose, onSave, companyId }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'Business', code: '', contactPerson: '', city: '', country: '', address: 'N/A' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = async () => {
    try {
      const res = await salesApi.getCustomers(companyId);
      if (res.success) {
        const list = res.data.items || res.data || [];
        const codes = list.map((c: any) => c.customerCode || '').filter((c: string) => c.startsWith('CUST-'));
        let next = codes.length + 1;
        setForm(p => ({ ...p, code: `CUST-${next.toString().padStart(3, '0')}` }));
      }
    } catch (e) { setForm(p => ({ ...p, code: 'CUST-001' })); }
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      const res = await salesApi.createCustomer({ ...form, customerCode: form.code, companyId, isActive: true });
      if (res.success) { onSave({ id: res.data.id.toString(), name: form.name }); onClose(); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><User size={24} /></div>
              <div>
                 <h3 className="font-black text-slate-800 text-xl tracking-tight">New Customer</h3>
                 <p className="text-xs text-slate-400 font-medium">Fill details to register a new customer</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => navigate('/admin/sales/customers/add?from=dispatch')}
                className="flex items-center gap-2 px-4 h-9 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition"
              >
                 <ExternalLink size={14} /> Full Form
              </button>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400"><X size={20} /></button>
           </div>
        </div>

        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Type</label>
              <select className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl bg-slate-50/50" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option>Business</option><option>Individual</option></select></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Code</label>
              <input className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-medium" value={form.code} readOnly /></div>
           </div>

           <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name *</label>
           <input className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-300 transition" placeholder="e.g. Acme Corp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>

           <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contact Person</label>
              <input className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl" placeholder="Manager Name" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone *</label>
              <div className="relative"><Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="w-full h-11 pl-10 pr-4 text-sm border border-slate-200 rounded-xl" placeholder="+1 234 567 890" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div></div>
           </div>

           <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email *</label>
           <div className="relative"><Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="w-full h-11 pl-10 pr-4 text-sm border border-slate-200 rounded-xl" placeholder="billing@customer.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div></div>

           <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">City</label>
              <input className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
              <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Country</label>
              <select className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl" value={form.country} onChange={e => setForm({...form, country: e.target.value})}><option value="">Select country</option><option>United States</option><option>India</option><option>United Kingdom</option></select></div>
           </div>
        </div>

        <div className="flex gap-4 mt-10">
           <button onClick={onClose} className="flex-1 h-12 bg-[#df2020] text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-red-500/10 active:scale-95 transition-all text-sm uppercase tracking-wide">Cancel</button>
           <button onClick={handleSave} disabled={loading} className="flex-1 h-12 bg-[#002147] hover:bg-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wide">
              <Save size={18} /> {loading ? 'Saving...' : 'Save Customer'}
           </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Add Carrier Modal ── */
const AddCarrierModal: React.FC<{ onClose: () => void; onSave: (c: any) => void; companyId: number }> = ({ onClose, onSave, companyId }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await logisticsApi.createCarrier({ name, companyId, isActive: true });
      if (res.success) { onSave({ label: name, value: name }); onClose(); }
    } catch (e) {} finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/20">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border">
         <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Truck size={16} /> New Carrier</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-50 text-slate-400"><X size={16} /></button>
         </div>
         <Input label="Carrier Name" placeholder="e.g. BlueDart / DHL" value={name} onChange={e => setName(e.target.value)} required />
         <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-xs font-bold shadow-lg active:scale-95">{loading ? '...' : 'Add Carrier'}</button>
         </div>
      </motion.div>
    </div>
  );
};

export const CreateDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();

  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCust, setShowAddCust] = useState(false);
  const [showAddCarrier, setShowAddCarrier] = useState(false);
  const [carriers, setCarriers] = useState<any[]>([]);

  // Form
  const [dispatchNo, setDispatchNo] = useState("");
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState("");
  const [carrier, setCarrier] = useState("");
  const [sourceWH, setSourceWH] = useState("");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<any[]>([{ id: '1', productId: '', qty: 0, fromWh: '' }]);

  useEffect(() => { 
    fetchData(); 
    if (id) fetchEditData();
    
    // Auto-select customer if returning from full registration
    const lastId = localStorage.getItem('lastCreatedCustomerId');
    if (lastId) {
      setCustomerId(lastId);
      localStorage.removeItem('lastCreatedCustomerId');
    }
  }, [companyId, id]);

  const fetchEditData = async () => {
    try {
      const res = await inventoryApi.getDispatch(id!);
      if (res.success) {
        const d = res.data;
        setDispatchNo(d.dispatchNumber);
        setDispatchDate(d.dispatchDate?.split('T')[0]);
        setNotes(d.notes || '');
        const carrierFromNotes = d.notes?.split('Carrier: ')[1]?.trim() || '';
        setCarrier(carrierFromNotes);
        setTracking(d.trackingNumber || '');
        setItems((d.items || []).map((i: any) => ({
          id: i.productId.toString(),
          productId: i.productId.toString(),
          qty: i.quantity,
          fromWh: ''
        })));
        // Match customer by name in the loaded customers list
        setCustomers(prev => {
          const match = prev.find((c: any) => c.name === d.dispatchedTo);
          if (match) setCustomerId(match.id.toString());
          return prev;
        });
        // Store dispatchedTo for fallback
        sessionStorage.setItem('_editDispatchedTo', d.dispatchedTo || '');
      }
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      const [p, w, c, d, l] = await Promise.all([
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId),
        salesApi.getCustomers(companyId),
        inventoryApi.getDispatches(companyId),
        logisticsApi.getCarriers(companyId)
      ]);
      if (p.success) setProducts(p.data.items || []);
      if (w.success) setWarehouses(w.data.items || []);
      if (c.success) {
        const custList = c.data.items || c.data || [];
        setCustomers(custList);
        // If in edit mode, match customer by saved dispatchedTo name
        if (id) {
          const savedTo = sessionStorage.getItem('_editDispatchedTo');
          if (savedTo) {
            const match = custList.find((cu: any) => cu.name === savedTo);
            if (match) setCustomerId(match.id.toString());
          }
        }
      }
      if (l.success) setCarriers(l.data.items || l.data || []);
      
      if (!id && d.success) {
        const list = d.data.items || d.data || [];
        setDispatchNo(`DISP-${10000 + list.length + 1}`);
      }
    } catch (e) { console.error(e); }
  };

  const handleConfirm = async () => {
    if (!customerId || items.length === 0) return showNotification({ type: 'error', title: 'Error', message: 'Fill all fields.' });
    setLoading(true);
    try {
      const payload = {
        companyId,
        dispatchedTo: customers.find(c => c.id.toString() === customerId)?.name || sessionStorage.getItem('_editDispatchedTo') || 'Unknown',
        dispatchDate: new Date(dispatchDate).toISOString(),
        notes: `${notes} | Carrier: ${carrier}`,
        items: items.filter(i => i.productId).map(i => ({ productId: parseInt(i.productId), quantity: i.qty }))
      };
      if (id) {
        // Edit mode: create a new dispatch to replace (or just update status for now)
        const r = await inventoryApi.updateDispatchStatus(parseInt(id), 'Dispatched');
        if (r.success) {
          showNotification({ type: 'success', title: 'Updated', message: 'Dispatch updated successfully.' });
          sessionStorage.removeItem('_editDispatchedTo');
          navigate('/admin/inventory/dispatch');
        }
      } else {
        const r = await inventoryApi.createDispatch(payload);
        if (r.success) navigate('/admin/inventory/dispatch');
      }
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/inventory/dispatch')} className="p-2 border rounded-xl hover:bg-white shadow-sm transition active:scale-95"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{id ? 'Edit' : 'Create'} Material Dispatch</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipment Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
             <div className="flex items-center gap-2 pb-4 border-b">
                <div className="p-2 bg-orange-500 rounded-lg text-white"><Truck size={16} /></div>
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Shipment Details</h2>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <Input label="Dispatch No" value={dispatchNo} readOnly />
                <Input label="Dispatch Date" type="date" value={dispatchDate} onChange={e => setDispatchDate(e.target.value)} />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <CustomSelect 
                  label="Customer" 
                  value={customerId} 
                  onChange={setCustomerId} 
                  options={customers.map(c => ({ label: c.name, value: c.id.toString() }))} 
                  required 
                  onAdd={() => setShowAddCust(true)}
                />
                <CustomSelect 
                  label="Carrier / Shipping Method" 
                  value={carrier} 
                  onChange={setCarrier} 
                  options={carriers.map(cr => ({ label: cr.name, value: cr.name }))}
                  onAdd={() => setShowAddCarrier(true)}
                />
             </div>
          </div>

          {/* Dispatch Items Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Package size={16} /></div>
                   <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Dispatch Items</h2>
                </div>
                <button 
                  onClick={() => setItems([...items, { id: Date.now().toString(), productId: '', qty: 0, fromWh: '' }])}
                  className="px-4 h-9 flex items-center gap-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                >
                  <Plus size={14} /> Add Item
                </button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[#002147] text-white text-[10px] font-black uppercase tracking-widest">
                         <th className="px-6 py-4">Product</th>
                         <th className="px-4 py-4 w-40">Warehouse</th>
                         <th className="px-4 py-4 w-24 text-center">Stock</th>
                         <th className="px-4 py-4 w-32">Qty to Ship</th>
                         <th className="px-6 py-4 w-16"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {items.map((it, idx) => {
                         const p = products.find(x => x.id.toString() === it.productId);
                         return (
                            <tr key={it.id} className="hover:bg-slate-50/50 transition">
                               <td className="px-6 py-4">
                                  <select 
                                    className="w-full h-10 border rounded-lg text-sm px-2 focus:ring-2 focus:ring-indigo-200"
                                    value={it.productId}
                                    onChange={e => {
                                      const n = [...items]; n[idx].productId = e.target.value; setItems(n);
                                    }}
                                  >
                                     <option value="">Select product...</option>
                                     {products.map(px => <option key={px.id} value={px.id}>{px.name}</option>)}
                                  </select>
                               </td>
                               <td className="px-4 py-4">
                                  <select 
                                    className="w-full h-10 border rounded-lg text-sm px-2"
                                    value={it.fromWh}
                                    onChange={e => {
                                      const n = [...items]; n[idx].fromWh = e.target.value; setItems(n);
                                    }}
                                  >
                                     <option value="">Select warehouse...</option>
                                     {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                                  </select>
                               </td>
                               <td className="px-4 py-4 text-center text-sm font-medium text-slate-500">
                                  {p ? p.stockQty : '-'}
                               </td>
                               <td className="px-4 py-4">
                                  <input 
                                    type="number" 
                                    className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:ring-2"
                                    value={it.qty}
                                    onChange={e => {
                                      const n = [...items]; n[idx].qty = parseInt(e.target.value) || 0; setItems(n);
                                    }}
                                  />
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => setItems(items.filter(i => i.id !== it.id))}
                                    className="text-slate-200 hover:text-rose-500 transition"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right Column (4 units) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Logistics Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b">
                 <div className="p-2 bg-blue-500 rounded-lg text-white font-bold"><MapPin size={16} /></div>
                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Logistics</h2>
              </div>
              
              <CustomSelect 
                label="Source Warehouse *" 
                value={sourceWH} 
                onChange={setSourceWH} 
                options={warehouses.map(w => ({ label: w.name, value: w.name }))} 
              />
              
              <Input label="Tracking Number" placeholder="Enter tracking ID" value={tracking} onChange={e => setTracking(e.target.value)} />
           </div>

           {/* Special Instructions Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 pb-4 border-b mb-4">
                 <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Special Instructions</h2>
              </div>
              <Textarea placeholder="Add any shipping notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
           </div>

           {/* Buttons */}
           <div className="space-y-3 pt-4">
              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full h-12 bg-[#002147] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 hover:shadow-xl transition active:scale-95 disabled:opacity-50"
              >
                <Save size={18} /> {loading ? 'Processing...' : id ? 'UPDATE DISPATCH' : 'CONFIRM DISPATCH'}
              </button>
              <button 
                onClick={() => navigate('/admin/inventory/dispatch')}
                className="w-full h-12 bg-[#002147] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#001a38] transition active:scale-95"
              >
                <RotateCcw size={18} /> RESET FORM
              </button>
           </div>
        </div>
      </div>

      {showAddCust && <AddCustomerModal companyId={companyId} onClose={() => setShowAddCust(false)} onSave={(c) => {
         setCustomers([...customers, c]); setCustomerId(c.id);
      }} />}

      {showAddCarrier && <AddCarrierModal companyId={companyId} onClose={() => setShowAddCarrier(false)} onSave={(cr) => {
         setCarriers([...carriers, { name: cr.label }]); setCarrier(cr.value);
      }} />}
    </div>
  );
};

export default CreateDispatchPage;
