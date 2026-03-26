import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, Truck, Package, MapPin, Save, X, ExternalLink, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi, salesApi } from "../../../services/api";
import { exportToExcel } from "../../../utils/reportGenerator";

interface DispatchItem { id: string; productId: string; warehouseId: string; qty: number; }
interface Dispatch {
  id: string;
  date: string;
  dispatchNo: string;
  customer: string;
  customerId: string;
  sourceWH: string;
  carrier: string;
  tracking: string;
  notes: string;
  items: DispatchItem[];
  itemCount: number;
  status: string;
}

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const CARRIERS = ['FedEx', 'UPS', 'DHL', 'Express Freight', 'Self Pickup'];

interface EditModalProps {
  dispatch: Dispatch;
  products: any[];
  warehouses: any[];
  onClose: () => void;
  onSave: (d: Dispatch) => void;
}

const EditDispatchModal: React.FC<EditModalProps> = ({ dispatch, products, warehouses, onClose, onSave }) => {
  const [form, setForm] = useState<Dispatch>({ ...dispatch, items: dispatch.items.map(i => ({ ...i })) });
  const set = (k: keyof Dispatch, v: any) => setForm(p => ({ ...p, [k]: v }));

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { id: Date.now().toString(), productId: '', warehouseId: '', qty: 0 }] }));
  const removeItem = (id: string) => setForm(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
  const updateItem = (id: string, k: keyof DispatchItem, v: any) =>
    setForm(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [k]: v } : i) }));

  const handleSave = () => {
    onSave({ ...form, itemCount: form.items.reduce((s, i) => s + i.qty, 0) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col max-h-[90vh]" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Truck size={16} /></div>
            <div><h3 className="font-bold text-slate-800 text-base">Edit Dispatch</h3><p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.dispatchNo}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200"><div className="p-1.5 bg-orange-50 rounded-lg text-orange-600"><Truck size={14} /></div><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Shipment Details</h4></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Dispatch No</label><input className={fieldCls} value={form.dispatchNo} onChange={e => set('dispatchNo', e.target.value)} /></div>
                  <div><label className={labelCls}>Dispatch Date</label><div className="relative"><Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="date" className={`${fieldCls} pl-8`} value={form.date} onChange={e => set('date', e.target.value)} /></div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Customer</label><input className={fieldCls} value={form.customer} onChange={e => set('customer', e.target.value)} /></div>
                  <div><label className={labelCls}>Carrier</label><select className={fieldCls} value={form.carrier} onChange={e => set('carrier', e.target.value)}><option value="">Select carrier…</option>{CARRIERS.map(c => <option key={c}>{c}</option>)}</select></div>
                </div>
                <div><label className={labelCls}>Status</label><select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between"><div className="flex items-center gap-2"><div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Package size={14} /></div><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Dispatch Items</h4></div><button onClick={addItem} className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition"><Plus size={12} /> Add Item</button></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold"><th className="px-4 py-2.5">Product</th><th className="px-4 py-2.5">Warehouse</th><th className="px-4 py-2.5 w-28">Qty</th><th className="px-4 py-2.5 w-10"></th></tr></thead>
                    <tbody className="divide-y divide-slate-200">
                      {form.items.map(item => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.productId} onChange={e => updateItem(item.id, 'productId', e.target.value)}>
                              <option value="">Select product…</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.warehouseId} onChange={e => updateItem(item.id, 'warehouseId', e.target.value)}>
                              <option value="">Select warehouse…</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5"><input type="number" min={0} className={fieldCls} value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} /></td>
                          <td className="px-4 py-2.5 text-center"><button onClick={() => removeItem(item.id)} disabled={form.items.length === 1} className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition"><Trash2 size={15} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200"><div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><MapPin size={14} /></div><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Logistics</h4></div>
                <div><label className={labelCls}>Source Warehouse</label><select className={fieldCls} value={form.sourceWH} onChange={e => set('sourceWH', e.target.value)}><option value="">Select source…</option>{warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}</select></div>
                <div><label className={labelCls}>Tracking Number</label><input className={fieldCls} value={form.tracking} onChange={e => set('tracking', e.target.value)} /></div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200"><label className={labelCls}>Special Instructions</label><textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`} value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl flex-shrink-0">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button>
          <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2"><Save size={14} /> Update Dispatch</button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteModal: React.FC<{ dispatchNo: string; onClose: () => void; onConfirm: () => void }> = ({ dispatchNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div><h3 className="font-bold text-slate-800">Delete</h3></div>
      <p className="text-sm text-slate-500 mb-6">Delete <span className="font-semibold text-slate-700">"{dispatchNo}"</span>?</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm">Cancel</button>
        <button onClick={onConfirm} className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold">Delete</button>
      </div>
    </motion.div>
  </div>
);

export const MaterialDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [editDispatch, setEditDispatch] = useState<Dispatch | null>(null);
  const [deleteDispatch, setDeleteDispatch] = useState<Dispatch | null>(null);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [allCustomers, setAllCustomers] = useState<any[]>([]);

  useEffect(() => { loadData(); }, [companyId]);
  const loadData = async () => {
    setLoading(true);
    try {
      const [dispRes, prodRes, whRes, custRes] = await Promise.all([
        inventoryApi.getDispatches(companyId),
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId),
        salesApi.getCustomers(companyId)
      ]);

      if (custRes.success) setAllCustomers(custRes.data.items || custRes.data || []);
      if (prodRes.success) setProducts(prodRes.data.items || []);
      if (whRes.success) setWarehouses(whRes.data.items || []);

      if (dispRes.success) {
        const list = dispRes.data.items || dispRes.data || [];
        const mapped = list.map((d: any) => ({
          id: d.id.toString(),
          date: d.dispatchDate?.split('T')[0] || '—',
          dispatchNo: d.dispatchNumber || `DSP-${d.id.toString().padStart(5, '0')}`,
          customer: d.dispatchedTo || 'Unknown Customer',
          customerId: d.customerId?.toString() || '',
          sourceWH: 'Main Warehouse',
          carrier: d.notes?.split('Carrier: ')[1] || 'N/A',
          tracking: d.trackingNumber || '',
          notes: d.notes || '',
          itemCount: (d.items || []).reduce((s: number, i: any) => s + (i.quantity || 0), 0),
          status: d.status || 'Dispatched',
          items: (d.items || []).map((i: any) => ({ 
            id: (i.id || i.productId || '').toString(), 
            productId: (i.productId || '').toString(), 
            warehouseId: '', 
            qty: i.quantity || 0 
          }))
        }));
        setDispatches(mapped);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const displayed = useMemo(() => dispatches.filter(d => (!search || d.dispatchNo.toLowerCase().includes(search.toLowerCase()) || d.customer.toLowerCase().includes(search.toLowerCase())) && (!filterCustomer || d.customer === filterCustomer)), [dispatches, search, filterCustomer]);
  const customerOptions = useMemo(() => Array.from(new Set(allCustomers.map(c => c.name))), [allCustomers]);

  const columns = [
    { key: 'dispatchNo' as const, label: 'Dispatch No', render: (v: string) => <span className="font-semibold text-slate-800">{v}</span> },
    { key: 'date' as const, label: 'Date', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><Calendar size={13} className="text-slate-400" />{v}</div> },
    { key: 'customer' as const, label: 'Customer', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><User size={13} className="text-slate-400" />{v}</div> },
    { key: 'itemCount' as const, label: 'Items Qty', align: 'center' as const, render: (v: number) => <span className="font-medium text-slate-700">{v} units</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Material Dispatch</h1>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button variant="secondary" className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-xs font-bold border-slate-200" leftIcon={<Download size={14} />} onClick={() => exportToExcel([{ sheetName: 'Dispatches', headers: ['No', 'Date', 'Customer', 'Qty'], data: displayed.map(d => [d.dispatchNo, d.date, d.customer, d.itemCount]) }], 'Dispatch_Mar_2026')}>Export</Button>
          <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white shadow-lg rounded-xl px-4 md:px-8 h-10 text-xs font-bold transition-all" leftIcon={<Plus size={16} />} onClick={() => navigate('/admin/inventory/dispatch/create')}>Create Dispatch</Button>
        </div>
      </div>
      <TableFilters searchValue={search} searchPlaceholder="Search..." onSearchChange={setSearch} filters={[{ label: 'Filter Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer }]} onClearAll={() => { setSearch(''); setFilterCustomer(''); }} showClearButton={!!(search || filterCustomer)} />
      <DataTableWrapper loading={loading} data={displayed} columns={columns} actions={[{ label: 'Edit', icon: <Edit size={14} />, onClick: (d) => navigate(`/admin/inventory/dispatch/edit/${d.id}`), variant: 'primary' }, { label: 'Delete', icon: <Trash2 size={14} />, onClick: setDeleteDispatch, variant: 'danger' }]} emptyMessage="No dispatches found" />
      <AnimatePresence>
        {deleteDispatch && (
          <DeleteModal dispatchNo={deleteDispatch.dispatchNo} onClose={() => setDeleteDispatch(null)} onConfirm={() => setDispatches(p => p.filter(d => d.id !== deleteDispatch.id))} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MaterialDispatchPage;
