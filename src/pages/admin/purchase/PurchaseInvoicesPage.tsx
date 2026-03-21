import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Download, Edit, Trash2, Calendar, User, DollarSign,
  X, Save, FileText, PlusCircle, Calculator, Percent, AlertTriangle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const VENDORS = ['TechNova Solutions', 'Global Logistics', 'Office Essentials', 'Vertex Industries', 'Pure Water Co.'];
const PRODUCTS = ['Premium Wireless Headphones', 'Smart Fitness Tracker', 'Office Chair', 'Laptop Stand', 'USB-C Hub'];

interface Invoice {
  id: string; date: string; invoiceNo: string; vendor: string;
  amount: number; tax: number; total: number; status: string; dueDate: string;
}
interface LineItem { id: number; product: string; qty: number; rate: number; }

const MOCK_INVOICES: Invoice[] = [
  { id: '1', date: '2026-03-16', invoiceNo: 'PINV-2026-001', vendor: 'TechNova Solutions', amount: 4200.00, tax: 210.00, total: 4410.00, status: 'Paid',    dueDate: '2026-04-16' },
  { id: '2', date: '2026-03-15', invoiceNo: 'PINV-2026-002', vendor: 'Global Logistics',   amount: 1850.50, tax: 92.53,  total: 1943.03, status: 'Pending', dueDate: '2026-04-15' },
  { id: '3', date: '2026-03-14', invoiceNo: 'PINV-2026-003', vendor: 'Office Essentials',  amount: 850.00,  tax: 42.50,  total: 892.50,  status: 'Paid',    dueDate: '2026-04-14' },
  { id: '4', date: '2026-03-14', invoiceNo: 'PINV-2026-004', vendor: 'Vertex Industries',  amount: 12400.00,tax: 620.00, total: 13020.00,status: 'Partial', dueDate: '2026-04-14' },
  { id: '5', date: '2026-03-13', invoiceNo: 'PINV-2026-005', vendor: 'Pure Water Co.',     amount: 120.00,  tax: 6.00,   total: 126.00,  status: 'Paid',    dueDate: '2026-03-20' },
];

const TABS = ['All Invoices', 'Fully Settled', 'Pending Intake', 'Credit Balances'] as const;
type Tab = typeof TABS[number];

/* ── Edit Invoice Modal ── */
const EditInvoiceModal: React.FC<{ invoice: Invoice; onClose: () => void; onSave: (inv: Invoice) => void }> = ({ invoice, onClose, onSave }) => {
  const [vendor, setVendor] = useState(invoice.vendor);
  const [invoiceDate, setInvoiceDate] = useState(invoice.date);
  const [dueDate, setDueDate] = useState(invoice.dueDate);
  const [status, setStatus] = useState(invoice.status);
  const [discount, setDiscount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, product: PRODUCTS[0], qty: 1, rate: invoice.amount }
  ]);

  const addItem = () => setItems(p => [...p, { id: Date.now(), product: '', qty: 1, rate: 0 }]);
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string | number) =>
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.rate, 0), [items]);
  const discountAmt = subtotal * (discount / 100);
  const tax = (subtotal - discountAmt) * 0.1;
  const total = subtotal - discountAmt + tax;
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const handleSave = () => {
    onSave({ ...invoice, vendor, date: invoiceDate, dueDate, status, amount: subtotal, tax, total });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
          style={{ backgroundColor: '#ffffff' }}
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FileText size={16} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Edit Invoice</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{invoice.invoiceNo}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main */}
              <div className="lg:col-span-2 space-y-5">

                {/* Voucher Identification */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600"><FileText size={13} /></div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Voucher Identification</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Vendor <span className="text-rose-400">*</span></label>
                      <select className={fieldCls} value={vendor} onChange={e => setVendor(e.target.value)}>
                        {VENDORS.map(v => <option key={v}>{v}</option>)}
                      </select></div>
                    <div><label className={labelCls}>Invoice Date <span className="text-rose-400">*</span></label>
                      <div className="relative"><Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="date" className={`${fieldCls} pl-8`} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div></div>
                    <div><label className={labelCls}>Invoice Number</label>
                      <input className={`${fieldCls} bg-slate-100 text-slate-500`} value={invoice.invoiceNo} readOnly /></div>
                    <div><label className={labelCls}>Due Date <span className="text-rose-400">*</span></label>
                      <div className="relative"><Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="date" className={`${fieldCls} pl-8`} value={dueDate} onChange={e => setDueDate(e.target.value)} /></div></div>
                  </div>
                </div>

                {/* Invoice Ledger */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"><PlusCircle size={13} /></div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Ledger</h4>
                    </div>
                    <button onClick={addItem}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold transition">
                      <Plus size={13} /> Add Item
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#002147] text-white text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-4 py-3">Item Details</th>
                        <th className="px-3 py-3 w-20 text-center">Qty</th>
                        <th className="px-3 py-3 w-28">Rate</th>
                        <th className="px-3 py-3 w-28">Amount</th>
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                              <option value="">Select Product…</option>
                              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <input type="number" min={1} className={`${fieldCls} text-center`} value={item.qty}
                              onChange={e => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))} />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                              <input type="number" min={0} step="0.01" className={`${fieldCls} pl-6`} value={item.rate}
                                onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} />
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="font-bold text-slate-800 text-sm">{fmt(item.qty * item.rate)}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => removeItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No items. Click "Add Item".</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Financial Aggregation */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600"><Calculator size={13} /></div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Aggregation</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sub Total</span>
                      <span className="font-bold text-slate-900">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Discount</span>
                      <div className="relative w-20">
                        <input type="number" min={0} max={100} className={`${fieldCls} h-8 text-xs pr-6`}
                          value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                        <Percent size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax (VAT 10%)</span>
                      <span className="font-bold text-slate-900">{fmt(tax)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="font-bold text-indigo-600 text-base">{fmt(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Post-Transactional */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400"><DollarSign size={13} /></div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Post-Transactional</h4>
                  </div>
                  <div><label className={labelCls}>Vendor Remarks</label>
                    <textarea rows={3} className={`${fieldCls} h-auto py-2.5 resize-none`}
                      placeholder="Add any instructions..." value={remarks} onChange={e => setRemarks(e.target.value)} /></div>
                  <div><label className={labelCls}>Payment Status</label>
                    <select className={fieldCls} value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                    </select></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
            <button onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2">
              <Save size={14} /> Update Invoice
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Record Payment Modal ── */
const RecordPaymentModal: React.FC<{ invoice: Invoice; onClose: () => void; onSave: (inv: Invoice) => void }> = ({ invoice, onClose, onSave }) => {
  const [amount, setAmount] = useState(invoice.total.toFixed(2));
  const [method, setMethod] = useState('Bank Transfer');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave({ ...invoice, status: 'Paid' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ backgroundColor: '#ffffff' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><DollarSign size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Record Payment</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{invoice.invoiceNo} · {invoice.vendor}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Invoice summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Invoice Total</p>
              <p className="text-xl font-bold text-slate-900">${invoice.total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Status</p>
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                invoice.status === 'Paid' ? 'bg-blue-50 text-blue-600' :
                invoice.status === 'Partial' ? 'bg-violet-50 text-violet-600' :
                'bg-amber-50 text-amber-600'
              }`}>{invoice.status}</span>
            </div>
          </div>

          <div>
            <label className={labelCls}>Payment Amount <span className="text-rose-400">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
              <input type="number" min={0} step="0.01" className={`${fieldCls} pl-7`}
                value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Payment Method <span className="text-rose-400">*</span></label>
            <select className={fieldCls} value={method} onChange={e => setMethod(e.target.value)}>
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Cheque</option>
              <option>Credit Card</option>
              <option>Online Payment</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Payment Date <span className="text-rose-400">*</span></label>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" className={`${fieldCls} pl-8`} value={payDate} onChange={e => setPayDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Reference / Transaction ID</label>
            <input className={fieldCls} placeholder="e.g. TXN-20260320-001" value={reference} onChange={e => setReference(e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea rows={2} className={`${fieldCls} h-auto py-2.5 resize-none`}
              placeholder="Any additional notes..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2">
            <Save size={14} /> Confirm Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ invoiceNo: string; onClose: () => void; onConfirm: () => void }> = ({ invoiceNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Invoice</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{invoiceNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Page ── */
export const PurchaseInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState<Tab>('All Invoices');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [deleteInvoice, setDeleteInvoice] = useState<Invoice | null>(null);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);

  const vendorOptions = useMemo(() => Array.from(new Set(invoices.map(i => i.vendor))), [invoices]);

  const displayed = useMemo(() => {
    let list = [...invoices];
    if (activeTab === 'Fully Settled') list = list.filter(i => i.status === 'Paid');
    if (activeTab === 'Pending Intake') list = list.filter(i => i.status === 'Pending');
    if (search) list = list.filter(i =>
      i.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      i.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(i => i.vendor === filterVendor);
    if (filterStatus) list = list.filter(i => i.status === filterStatus);
    return list;
  }, [invoices, activeTab, search, filterVendor, filterStatus]);

  const handleSave = (updated: Invoice) =>
    setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
  const handleDelete = (id: string) =>
    setInvoices(prev => prev.filter(i => i.id !== id));

  const columns = [
    {
      key: 'invoiceNo' as const, label: 'Invoice No',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'date' as const, label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'vendor' as const, label: 'Vendor',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'total' as const, label: 'Total Amount', align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const, label: 'Status',
      render: (value: string) => {
        if (value === 'Paid') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Settled</span>
          </div>
        );
        if (value === 'Partial') return (
          <div className="flex items-center gap-1.5 text-violet-600">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Partial</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Invoice</h1>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export</Button>
            <Button variant="primary"
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate('/admin/purchase/invoices/create')}>
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
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
          searchPlaceholder="Search invoice no or vendor..."
          onSearchChange={setSearch}
          filters={[
            { label: 'Filter by Vendor', value: filterVendor, options: vendorOptions, onChange: setFilterVendor },
            { label: 'Filter by Status', value: filterStatus, options: ['Paid', 'Pending', 'Partial'], onChange: setFilterStatus }
          ]}
          onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
          showClearButton={!!(search || filterVendor || filterStatus)}
        />

        <DataTableWrapper
          data={displayed}
          columns={columns}
          actions={[
            { label: 'Edit', icon: <Edit size={14} />, onClick: item => navigate(`/admin/purchase/invoices/${item.id}/edit`), variant: 'primary', title: 'Edit' },
            { label: 'Record Payment', icon: <DollarSign size={14} />, onClick: item => setPayInvoice(item), variant: 'primary', title: 'Record Payment' },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: item => setDeleteInvoice(item), variant: 'danger', title: 'Delete' }
          ]}
          emptyMessage="No invoices found"
        />
      </motion.div>

      <AnimatePresence>
        {payInvoice && (
          <RecordPaymentModal key="pay" invoice={payInvoice} onClose={() => setPayInvoice(null)} onSave={handleSave} />
        )}
        {editInvoice && (
          <EditInvoiceModal key="edit" invoice={editInvoice} onClose={() => setEditInvoice(null)} onSave={handleSave} />
        )}
        {deleteInvoice && (
          <DeleteModal key="delete" invoiceNo={deleteInvoice.invoiceNo} onClose={() => setDeleteInvoice(null)} onConfirm={() => handleDelete(deleteInvoice.id)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseInvoicesPage;
