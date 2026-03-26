import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Package, MapPin, Save, RotateCcw,
  Plus, Trash2, AlertCircle, X, IndianRupee
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi } from "../../../services/api";

/* ─────────────────────────────────────────
   Types
 ───────────────────────────────────────── */
interface TransferItem { id: string; productId: string; qty: number; }

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

/* ─────────────────────────────────────────
   Creatable Warehouse Select
 ───────────────────────────────────────── */
interface CreatableWHProps {
  label: string; value: string; onChange: (v: string) => void;
  warehouses: any[]; onAddWarehouse: (v: string) => void; required?: boolean;
}
const CreatableWHSelect: React.FC<CreatableWHProps> = ({ label, value, onChange, warehouses, onAddWarehouse, required }) => {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');
  const handleAdd = () => {
    if (newVal.trim()) { onAddWarehouse(newVal.trim()); setAdding(false); }
  };
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-rose-400 ml-0.5">*</span>}</label>
      {adding ? (
        <div className="flex gap-2">
          <input autoFocus value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="New warehouse name…"
            className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white" />
          <button type="button" onClick={handleAdd}
            className="h-10 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">Add</button>
          <button type="button" onClick={() => setAdding(false)}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"><X size={14} /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select value={value} onChange={e => onChange(e.target.value)} className={`${fieldCls} flex-1`}>
            <option value="">Select warehouse…</option>
            {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
          </select>
          <button type="button" onClick={() => setAdding(true)} title="Add new warehouse"
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
            <Plus size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Page
 ───────────────────────────────────────── */
export const CreateTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [fromWH, setFromWH] = useState('');
  const [toWH, setToWH]     = useState('');
  const [date, setDate]      = useState(new Date().toISOString().split('T')[0]);
  const [shippingCharge, setShippingCharge] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [remarks, setRemarks]   = useState('');

  const [items, setItems] = useState<TransferItem[]>([
    { id: '1', productId: '', qty: 0 }
  ]);

  useEffect(() => {
    fetchInitialData();
  }, [companyId]);

  const fetchInitialData = async () => {
    try {
      const [prodRes, whRes] = await Promise.all([
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId)
      ]);
      if (prodRes.success) setProducts(prodRes.data.items || []);
      if (whRes.success) setWarehouses(whRes.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addWarehouse = async (v: string) => {
    try {
      const res = await inventoryApi.createWarehouse({ companyId, name: v, location: 'Unknown' });
      if (res.success) {
        setWarehouses(p => [...p, res.data]);
        showNotification({ type: 'success', title: 'Success', message: 'Warehouse added.' });
      } else {
        showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed to add warehouse.' });
      }
    } catch (err) {
      showNotification({ type: 'error', title: 'Error', message: 'Unexpected error.' });
    }
  };

  const addItem = () => setItems(p => [...p, { id: Date.now().toString(), productId: '', qty: 0 }]);
  const removeItem = (id: string) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: string, k: keyof TransferItem, v: any) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const handleExecuteTransfer = async () => {
    if (!fromWH || !toWH || items.some(i => !i.productId || i.qty <= 0)) {
      showNotification({ type: 'error', title: 'Validation', message: 'Please select warehouses and add valid items.' });
      return;
    }
    if (fromWH === toWH) {
      showNotification({ type: 'error', title: 'Validation', message: 'Source and destination warehouses cannot be the same.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyId,
        fromLocation: fromWH,
        toLocation: toWH,
        transferDate: new Date(date).toISOString(),
        notes: `${remarks}${shippingCharge ? ` | Shipping: Rs. ${shippingCharge}` : ''} | Priority: ${priority}`,
        items: items.map(i => ({
          productId: parseInt(i.productId),
          quantity: i.qty
        }))
      };

      const res = await inventoryApi.createTransfer(payload);
      if (res.success) {
        showNotification({ type: 'success', title: 'Success', message: 'Product transfer confirmed!' });
        navigate('/admin/inventory/transfer');
      } else {
        showNotification({ type: 'error', title: 'Failed', message: res.message || 'Failed to create transfer.' });
      }
    } catch (err) {
        showNotification({ type: 'error', title: 'Error', message: 'Unexpected error occurred.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12">

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/inventory/transfer')}
          className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Product Transfer</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><MapPin size={16} /></div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Transfer Routing</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Reference No</label>
                <input className={fieldCls} readOnly placeholder="Auto-generated (TRF-...)" />
              </div>
              <div>
                <label className={labelCls}>Transfer Date</label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" className={`${fieldCls} pl-8`} value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CreatableWHSelect label="From Warehouse" value={fromWH} onChange={setFromWH}
                warehouses={warehouses} onAddWarehouse={addWarehouse} required />
              <CreatableWHSelect label="To Warehouse" value={toWH} onChange={setToWH}
                warehouses={warehouses} onAddWarehouse={addWarehouse} required />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Package size={16} /></div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Transfer Items</h3>
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
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-5 py-3 text-center">In Stock</th>
                    <th className="px-5 py-3 w-32">Transfer Qty</th>
                    <th className="px-5 py-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => {
                    const selProd = products.find(p => p.id === item.productId);
                    return (
                      <tr key={item.id} className="group">
                        <td className="px-5 py-3">
                          <select className={fieldCls} value={item.productId}
                            onChange={e => updateItem(item.id, 'productId', e.target.value)}>
                            <option value="">Select product…</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-sm font-medium text-slate-500">{selProd ? selProd.stock : '—'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <input type="number" min={0} className={fieldCls} placeholder="0"
                            value={item.qty || ''}
                            onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} />
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button onClick={() => removeItem(item.id)} disabled={items.length === 1}
                            className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Ensure the destination warehouse has sufficient capacity. Inventory levels will be adjusted upon confirmation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><IndianRupee size={16} /></div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Other Details</h3>
            </div>
            <div>
              <label className={labelCls}>Shipping Charge (Rs.)</label>
              <input type="number" min={0} className={fieldCls} placeholder="0.00"
                value={shippingCharge} onChange={e => setShippingCharge(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Transfer Priority</label>
              <select className={fieldCls} value={priority} onChange={e => setPriority(e.target.value)}>
                {['Normal', 'Urgent', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <Textarea label="Remarks" placeholder="Internal notes for this transfer…" rows={4}
              value={remarks} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)} />
          </div>

          <div className="space-y-3">
            <Button variant="primary" fullWidth leftIcon={<Save size={18} />} onClick={handleExecuteTransfer} disabled={loading}
              className="py-4 bg-[#002147] hover:bg-[#003366] border-none shadow-lg rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
              {loading ? 'Moving Goods...' : 'Execute Transfer'}
            </Button>
            <Button variant="secondary" fullWidth leftIcon={<RotateCcw size={18} />}
              onClick={() => {
                  setFromWH(''); setToWH(''); setShippingCharge(''); setPriority('Normal'); setRemarks('');
                  setItems([{ id: '1', productId: '', qty: 0 }]);
              }}
              className="py-4 rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateTransferPage;
