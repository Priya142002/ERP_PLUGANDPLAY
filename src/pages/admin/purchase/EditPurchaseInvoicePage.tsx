import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, FileText, Calendar, Plus, Trash2, Save,
  RotateCcw, PlusCircle, Calculator, Percent
} from "lucide-react";
import { AddVendorModal } from "./AddVendorModal";

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

const PRODUCTS = [
  'Premium Wireless Headphones', 'Smart Fitness Tracker', 'Office Chair',
  'Laptop Stand', 'USB-C Hub', 'Mechanical Keyboard', 'Monitor 27"',
];
const VENDORS_DEFAULT = ['TechNova Solutions', 'Global Logistics', 'Office Essentials', 'Vertex Industries', 'Pure Water Co.'];

interface LineItem { id: number; product: string; qty: number; rate: number; }

// Mock invoice data keyed by id
const MOCK_INVOICES: Record<string, {
  invoiceNo: string; date: string; dueDate: string; vendor: string;
  status: string; discount: number; remarks: string;
  items: LineItem[];
}> = {
  '1': { invoiceNo: 'PINV-2026-001', date: '2026-03-16', dueDate: '2026-04-15', vendor: 'TechNova Solutions', status: 'paid', discount: 5, remarks: '', items: [{ id: 1, product: 'Premium Wireless Headphones', qty: 3, rate: 1470 }] },
  '2': { invoiceNo: 'PINV-2026-002', date: '2026-03-15', dueDate: '2026-04-14', vendor: 'Global Logistics', status: 'pending', discount: 0, remarks: '', items: [{ id: 1, product: 'Laptop Stand', qty: 5, rate: 388.61 }] },
  '3': { invoiceNo: 'PINV-2026-003', date: '2026-03-14', dueDate: '2026-04-13', vendor: 'Office Essentials', status: 'paid', discount: 0, remarks: '', items: [{ id: 1, product: 'USB-C Hub', qty: 2, rate: 446.25 }] },
  '4': { invoiceNo: 'PINV-2026-004', date: '2026-03-14', dueDate: '2026-04-13', vendor: 'Vertex Industries', status: 'partial', discount: 10, remarks: '', items: [{ id: 1, product: 'Monitor 27"', qty: 4, rate: 3255 }] },
  '5': { invoiceNo: 'PINV-2026-005', date: '2026-03-13', dueDate: '2026-04-12', vendor: 'Pure Water Co.', status: 'paid', discount: 0, remarks: '', items: [{ id: 1, product: 'Office Chair', qty: 1, rate: 126 }] },
};

export const EditPurchaseInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const existing = id ? MOCK_INVOICES[id] : null;

  const [vendorOptions, setVendorOptions] = useState([...VENDORS_DEFAULT]);
  const [showNewVendor, setShowNewVendor] = useState(false);
  const [vendor, setVendor] = useState(existing?.vendor ?? '');
  const [invoiceNo] = useState(existing?.invoiceNo ?? '');
  const [invoiceDate, setInvoiceDate] = useState(existing?.date ?? new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [discount, setDiscount] = useState(existing?.discount ?? 0);
  const [remarks, setRemarks] = useState(existing?.remarks ?? '');
  const [paymentStatus, setPaymentStatus] = useState(existing?.status ?? 'pending');
  const [items, setItems] = useState<LineItem[]>(
    existing?.items ?? [{ id: 1, product: '', qty: 1, rate: 0 }]
  );

  const addItem = () => setItems(p => [...p, { id: Date.now(), product: '', qty: 1, rate: 0 }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string | number) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.rate, 0), [items]);
  const discountAmt = subtotal * (discount / 100);
  const tax = (subtotal - discountAmt) * 0.1;
  const total = subtotal - discountAmt + tax;
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
          <button onClick={() => navigate('/admin/purchase/invoices')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition border border-slate-200 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Purchase Transaction</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Voucher Identification */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <FileText size={14} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Voucher Identification</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Vendor <span className="text-rose-400">*</span></label>
                  <div className="flex gap-2">
                    <select className={`${fieldCls} flex-1`} value={vendor} onChange={e => setVendor(e.target.value)}>
                      <option value="">Select Vendor…</option>
                      {vendorOptions.map(v => <option key={v}>{v}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowNewVendor(true)} title="Add new vendor"
                      className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition">
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Invoice Date <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" className={`${fieldCls} pl-8`} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Invoice Number <span className="text-rose-400">*</span></label>
                  <input className={`${fieldCls} bg-slate-50 text-slate-500`} value={invoiceNo} readOnly />
                </div>
                <div>
                  <label className={labelCls}>Due Date <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" className={`${fieldCls} pl-8`} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Ledger */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <PlusCircle size={14} />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Ledger</h3>
                </div>
                <button onClick={addItem}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#002147] text-white text-xs font-bold transition hover:bg-[#003366] shadow-sm">
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-5 py-3.5">Item Details</th>
                      <th className="px-4 py-3.5 w-24 text-center">Qty</th>
                      <th className="px-4 py-3.5 w-32">Rate</th>
                      <th className="px-4 py-3.5 w-32">Amount</th>
                      <th className="px-5 py-3.5 w-14"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                        <td className="px-5 py-3">
                          <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                            <option value="">Select Product…</option>
                            {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min={1} className={`${fieldCls} text-center`} value={item.qty}
                            onChange={e => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                            <input type="number" min={0} step="0.01" className={`${fieldCls} pl-6`} value={item.rate}
                              onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-800 text-sm">${(item.qty * item.rate).toFixed(2)}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">No items. Click "Add Item".</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Financial Aggregation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                  <Calculator size={14} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Aggregation</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sub Total</span>
                  <span className="font-semibold text-slate-800">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Discount</span>
                  <div className="flex items-center gap-1.5">
                    <input type="number" min={0} max={100} className="w-14 h-7 px-2 text-xs border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-300"
                      value={discount} onChange={e => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))} />
                    <Percent size={12} className="text-slate-400" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax (VAT 10%)</span>
                  <span className="font-semibold text-slate-800">{fmt(tax)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-blue-600 text-lg">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Post-Transactional */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                  <RotateCcw size={14} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Post-Transactional</h3>
              </div>
              <div>
                <label className={labelCls}>Vendor Remarks</label>
                <textarea rows={3} className={`${fieldCls} h-auto py-2.5 resize-none`}
                  placeholder="Add any instructions..." value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Payment Status</label>
                <select className={fieldCls} value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#002147] hover:bg-[#003366] text-white text-sm font-bold transition shadow-lg shadow-blue-900/10">
                <Save size={16} /> Update Invoice
              </button>
              <button onClick={() => navigate('/admin/purchase/invoices')}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNewVendor && (
          <AddVendorModal key="new-vendor" onClose={() => setShowNewVendor(false)} onSave={handleNewVendorSave} />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default EditPurchaseInvoicePage;
