import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Download, Edit, Trash2, Calendar, User,
  Truck, Package, MapPin, Save, X,
  ExternalLink, AlertTriangle
} from "lucide-react";
import Button from "../../../components/ui/Button";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface DispatchItem { id: string; product: string; warehouse: string; stock: string; qty: number; }
interface Customer { id: string; name: string; phone?: string; email?: string; }

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

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Global Tech Solutions',  phone: '+1 234 567 890', email: 'billing@globaltech.com' },
  { id: '2', name: 'Vertex Industries',       phone: '+1 345 678 901', email: 'accounts@vertex.com'    },
  { id: '3', name: 'Apex Manufacturing',      phone: '+1 456 789 012', email: 'ap@apexmfg.com'         },
  { id: '4', name: 'Blue Horizon Ltd',        phone: '+1 567 890 123', email: 'info@bluehorizon.com'   },
  { id: '5', name: 'Metropulse Corp',         phone: '+1 678 901 234', email: 'info@metropulse.com'    },
];
const PRODUCTS   = ['Premium Wireless Headphones', 'Smart Fitness Tracker', '4K Ultra HD Monitor', 'Ergonomic Office Chair'];
const WAREHOUSES = ['Main Warehouse', 'West Coast Hub', 'Central Distribution', 'South Terminal'];
const CARRIERS   = ['FedEx', 'UPS', 'DHL', 'Express Freight', 'Self Pickup'];

const MOCK_DISPATCHES: Dispatch[] = [
  { id: '1', date: '2026-03-16', dispatchNo: 'DISP-10024', customer: 'Global Tech Solutions',  customerId: '1', sourceWH: 'Main Warehouse',        carrier: 'FedEx',          tracking: 'FX-9821034', notes: '',                    itemCount: 12, status: 'Shipped',    items: [{ id: '1', product: 'Premium Wireless Headphones', warehouse: 'Main Warehouse',        stock: '45', qty: 12 }] },
  { id: '2', date: '2026-03-15', dispatchNo: 'DISP-10023', customer: 'Vertex Industries',       customerId: '2', sourceWH: 'West Coast Hub',         carrier: 'UPS',            tracking: 'UP-4421098', notes: 'Handle with care',    itemCount: 5,  status: 'Processing', items: [{ id: '1', product: 'Smart Fitness Tracker',        warehouse: 'West Coast Hub',         stock: '12', qty: 5  }] },
  { id: '3', date: '2026-03-14', dispatchNo: 'DISP-10022', customer: 'Apex Manufacturing',      customerId: '3', sourceWH: 'Central Distribution',   carrier: 'DHL',            tracking: 'DH-7731245', notes: '',                    itemCount: 25, status: 'Delivered',  items: [{ id: '1', product: '4K Ultra HD Monitor',          warehouse: 'Central Distribution',   stock: '25', qty: 25 }] },
  { id: '4', date: '2026-03-14', dispatchNo: 'DISP-10021', customer: 'Blue Horizon Ltd',        customerId: '4', sourceWH: 'Main Warehouse',        carrier: 'Self Pickup',    tracking: '',           notes: 'Customer will collect', itemCount: 8,  status: 'Pending',    items: [{ id: '1', product: 'Ergonomic Office Chair',       warehouse: 'Main Warehouse',        stock: '8',  qty: 8  }] },
  { id: '5', date: '2026-03-13', dispatchNo: 'DISP-10020', customer: 'Metropulse Corp',         customerId: '5', sourceWH: 'South Terminal',        carrier: 'Express Freight', tracking: 'EF-3310987', notes: '',                   itemCount: 15, status: 'Shipped',    items: [{ id: '1', product: 'Smart Fitness Tracker',        warehouse: 'South Terminal',        stock: '20', qty: 15 }] },
];

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

/* ─────────────────────────────────────────
   Edit Dispatch Modal
───────────────────────────────────────── */
interface EditModalProps {
  dispatch: Dispatch;
  customers: Customer[];
  onClose: () => void;
  onSave: (d: Dispatch) => void;
}

const EditDispatchModal: React.FC<EditModalProps> = ({ dispatch, customers, onClose, onSave }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Dispatch>({ ...dispatch, items: dispatch.items.map(i => ({ ...i })) });
  const set = (k: keyof Dispatch, v: any) => setForm(p => ({ ...p, [k]: v }));

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { id: Date.now().toString(), product: '', warehouse: '', stock: '—', qty: 0 }] }));
  const removeItem = (id: string) => setForm(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
  const updateItem = (id: string, k: keyof DispatchItem, v: any) =>
    setForm(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [k]: v } : i) }));

  const selectedCustomer = customers.find(c => c.id === form.customerId);

  const handleSave = () => {
    const customerName = customers.find(c => c.id === form.customerId)?.name || form.customer;
    onSave({ ...form, customer: customerName, itemCount: form.items.reduce((s, i) => s + i.qty, 0) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/45 overflow-y-auto"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mb-8 relative"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Truck size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Dispatch</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.dispatchNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ── Left: Main Details ── */}
            <div className="md:col-span-2 space-y-6">

              {/* Shipment Details */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600"><Truck size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Shipment Details</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Dispatch No</label>
                    <input className={fieldCls} value={form.dispatchNo} onChange={e => set('dispatchNo', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Dispatch Date</label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" className={`${fieldCls} pl-8`} value={form.date} onChange={e => set('date', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Customer <span className="text-rose-400">*</span></label>
                    <div className="flex gap-2">
                      <select className={`${fieldCls} flex-1`} value={form.customerId}
                        onChange={e => set('customerId', e.target.value)}>
                        <option value="">Select customer…</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <button type="button" title="Open full customer form"
                        onClick={() => { onClose(); navigate('/admin/sales/customers/add'); }}
                        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
                        <ExternalLink size={14} />
                      </button>
                    </div>
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
                    <select className={fieldCls} value={form.carrier} onChange={e => set('carrier', e.target.value)}>
                      <option value="">Select carrier…</option>
                      {CARRIERS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Dispatch Items */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Package size={14} /></div>
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Dispatch Items</h4>
                  </div>
                  <button onClick={addItem}
                    className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-4 py-2.5">Product</th>
                        <th className="px-4 py-2.5">Warehouse</th>
                        <th className="px-4 py-2.5 w-28">Qty</th>
                        <th className="px-4 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {form.items.map(item => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                              <option value="">Select product…</option>
                              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.warehouse} onChange={e => updateItem(item.id, 'warehouse', e.target.value)}>
                              <option value="">Select warehouse…</option>
                              {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <input type="number" min={0} className={fieldCls} placeholder="0"
                              value={item.qty || ''} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => removeItem(item.id)} disabled={form.items.length === 1}
                              className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition">
                              <Trash2 size={15} />
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
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><MapPin size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Logistics</h4>
                </div>
                <div>
                  <label className={labelCls}>Source Warehouse <span className="text-rose-400">*</span></label>
                  <select className={fieldCls} value={form.sourceWH} onChange={e => set('sourceWH', e.target.value)}>
                    <option value="">Select source…</option>
                    {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tracking Number</label>
                  <input className={fieldCls} placeholder="Enter tracking ID" value={form.tracking} onChange={e => set('tracking', e.target.value)} />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <label className={labelCls}>Special Instructions</label>
                <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                  placeholder="Add any shipping notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2">
            <Save size={14} /> Update Dispatch
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Delete Confirm Modal
───────────────────────────────────────── */
const DeleteModal: React.FC<{ dispatchNo: string; onClose: () => void; onConfirm: () => void }> = ({ dispatchNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Dispatch</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{dispatchNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} 
          style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const selCls = "h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600";

export const MaterialDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [dispatches, setDispatches]         = useState<Dispatch[]>(MOCK_DISPATCHES);
  const [editDispatch, setEditDispatch]     = useState<Dispatch | null>(null);
  const [deleteDispatch, setDeleteDispatch] = useState<Dispatch | null>(null);
  const [search, setSearch]                 = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterDate, setFilterDate]         = useState('');

  const handleSave   = (updated: Dispatch) => setDispatches(prev => prev.map(d => d.id === updated.id ? updated : d));
  const handleDelete = (id: string)        => setDispatches(prev => prev.filter(d => d.id !== id));

  const customerOptions = useMemo(() => Array.from(new Set(dispatches.map(d => d.customer))), [dispatches]);

  const displayed = useMemo(() => dispatches.filter(d =>
    (!search         || d.dispatchNo.toLowerCase().includes(search.toLowerCase()) ||
                        d.customer.toLowerCase().includes(search.toLowerCase())) &&
    (!filterCustomer || d.customer === filterCustomer) &&
    (!filterDate     || d.date === filterDate)
  ), [dispatches, search, filterCustomer, filterDate]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Material Dispatch</h1>
          <div className="flex flex-row items-center gap-2 md:gap-3">
            <Button variant="secondary"
              className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all border-slate-200"
              leftIcon={<Download size={14} />}>Export</Button>
            <Button variant="primary"
              className="bg-[#334e68] hover:bg-[#243b53] text-white border-none shadow-lg shadow-indigo-500/10 rounded-xl px-4 md:px-8 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate('/admin/inventory/dispatch/create')}>Create Dispatch</Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dispatch no or customer…"
              className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white" />
          </div>
          <select value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} className={selCls}>
            <option value="">Filter by Customer</option>
            {customerOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              className="h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600" />
          </div>
          {(search || filterCustomer || filterDate) && (
            <button onClick={() => { setSearch(''); setFilterCustomer(''); setFilterDate(''); }}
              className="h-9 px-3 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#002147] text-white">
                  {['Dispatch No','Date','Customer','Items Qty','Actions'].map(h => (
                    <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left ${h === 'Actions' ? 'text-right' : ''} ${h === 'Items Qty' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayed.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-slate-400 text-sm">No dispatches found</td></tr>
                ) : displayed.map((d, i) => (
                  <tr key={d.id} className={`group transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{d.dispatchNo}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar size={13} className="text-slate-400" />{d.date}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <User size={13} className="text-slate-400" />{d.customer}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-medium text-slate-700">{d.itemCount} units</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditDispatch(d)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#002147] hover:bg-[#003366] text-white border border-[#002147] transition" title="Edit">
                          <Edit size={14} stroke="currentColor" strokeWidth={2} />
                        </button>
                        <button onClick={() => setDeleteDispatch(d)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white border border-red-600 transition" title="Delete">
                          <Trash2 size={14} stroke="currentColor" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400 font-medium">{displayed.length} dispatch{displayed.length !== 1 ? 'es' : ''} shown</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editDispatch && (
          <EditDispatchModal key="edit"
            dispatch={editDispatch}
            customers={CUSTOMERS}
            onClose={() => setEditDispatch(null)}
            onSave={handleSave} />
        )}
        {deleteDispatch && (
          <DeleteModal key="delete"
            dispatchNo={deleteDispatch.dispatchNo}
            onClose={() => setDeleteDispatch(null)}
            onConfirm={() => handleDelete(deleteDispatch.id)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default MaterialDispatchPage;
