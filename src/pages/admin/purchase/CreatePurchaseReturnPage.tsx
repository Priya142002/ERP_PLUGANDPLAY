import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, RotateCcw, Calendar, FileText, Plus, Trash2,
  Save, AlertCircle, PackageCheck
} from "lucide-react";
import { AddVendorModal } from "./AddVendorModal";

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

const selectCls = `${fieldCls} appearance-none`;

const VENDORS_DEFAULT = ['TechNova Solutions', 'Global Logistics', 'Office Essentials'];
const INVOICES = ['PINV-2026-001', 'PINV-2026-002', 'PINV-2026-003'];
const PRODUCTS = ['Premium Wireless Headphones', 'Smart Fitness Tracker', 'Office Chair', 'Laptop Stand'];

interface LineItem { id: number; product: string; qty: number; rate: number; }

const today = new Date().toISOString().split('T')[0];

export const CreatePurchaseReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendorOptions, setVendorOptions] = useState([...VENDORS_DEFAULT]);
  const [showNewVendor, setShowNewVendor] = useState(false);
  const [returnNo] = useState('PRET-5004');
  const [returnDate, setReturnDate] = useState(today);
  const [vendor, setVendor] = useState('TechNova Solutions');
  const [refInvoice, setRefInvoice] = useState('PINV-2026-001');
  const [reason, setReason] = useState('Damaged Product');
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ id: 1, product: '', qty: 0, rate: 0 }]);

  const addItem = () => setItems(p => [...p, { id: Date.now(), product: '', qty: 0, rate: 0 }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string | number) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  const total = useMemo(() => items.reduce((s, i) => s + i.qty * i.rate, 0), [items]);
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const handleNewVendorSave = (name: string) => {
    setVendorOptions(p => p.includes(name) ? p : [...p, name]);
    setVendor(name);
  };

  return (
    <React.Fragment>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => navigate('/admin/purchase/returns')}
          className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition border border-slate-200 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Restitution Protocol</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Restitution Protocol */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <FileText size={15} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Restitution Protocol</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Return Number <span className="text-rose-400">*</span></label>
                <input className={`${fieldCls} bg-slate-100 text-slate-500`} value={returnNo} readOnly />
              </div>
              <div>
                <label className={labelCls}>Return Date <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" className={`${fieldCls} pl-8`} value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Vendor <span className="text-rose-400">*</span></label>
                <div className="flex gap-2">
                  <select className={`${fieldCls} flex-1`} value={vendor} onChange={e => setVendor(e.target.value)}>
                    {vendorOptions.map(v => <option key={v}>{v}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowNewVendor(true)} title="Add new vendor"
                    className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Reference Invoice</label>
                <select className={fieldCls} value={refInvoice} onChange={e => setRefInvoice(e.target.value)}>
                  {INVOICES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Return Logistics Ledger */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                  <PackageCheck size={15} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Return Logistics Ledger</h3>
              </div>
              <button onClick={addItem}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold transition shadow-sm">
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-5 py-3.5">Product Name</th>
                    <th className="px-4 py-3.5 w-24 text-center">Qty</th>
                    <th className="px-4 py-3.5 w-32">Unit Price</th>
                    <th className="px-4 py-3.5 w-32">Amount</th>
                    <th className="px-5 py-3.5 w-14"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                      <td className="px-5 py-3">
                        <select className={fieldCls} value={item.product}
                          onChange={e => updateItem(item.id, 'product', e.target.value)}>
                          <option value="">Select Product…</option>
                          {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min={0} className={`${fieldCls} text-center`} value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', Math.max(0, Number(e.target.value)))} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input type="number" min={0} step="0.01" className={`${fieldCls} pl-6`} value={item.rate}
                            onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-rose-600 text-sm">{fmt(item.qty * item.rate)}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                      No items added. Click "Add Item" to start.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Audit Intelligence */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <AlertCircle size={15} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit Intelligence</h3>
            </div>
            <div>
              <label className={labelCls}>Return Reason <span className="text-rose-400">*</span></label>
              <select className={fieldCls} value={reason} onChange={e => setReason(e.target.value)}>
                <option>Damaged Product</option>
                <option>Partial Shipment</option>
                <option>Wrong Item</option>
                <option>Quality Issues</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Remarks</label>
              <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                placeholder="Detailed explanation..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Total Return Value</span>
                <span className="font-bold text-rose-600 text-base">{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Returning products will adjust your inventory levels and create a corresponding debt for the vendor.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#002147] hover:bg-[#003366] text-white text-sm font-bold transition shadow-lg shadow-blue-900/10">
              <Save size={16} /> Authorize Restitution
            </button>
            <button onClick={() => navigate('/admin/purchase/returns')}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition">
              <RotateCcw size={16} /> Reset Protocol
            </button>
          </div>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {showNewVendor && (
        <AddVendorModal
          key="new-vendor"
          onClose={() => setShowNewVendor(false)}
          onSave={handleNewVendorSave}
        />
      )}
    </AnimatePresence>
    </React.Fragment>
  );
};

export default CreatePurchaseReturnPage;
