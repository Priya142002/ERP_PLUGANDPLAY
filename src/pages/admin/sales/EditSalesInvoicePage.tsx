import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, FileText, Calendar, Plus, Trash2, Save, 
  RotateCcw, PlusCircle, Calculator, CheckCircle2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const MOCK_INVOICES: Record<string, any> = {
  '1': {
    invoiceNo: 'INV-2026-001',
    date: '2026-03-20',
    dueDate: '2026-04-20',
    customer: 'Nexus Enterprises',
    status: 'Settled',
    items: [
      { id: '1', name: 'Premium Wireless Headphones', qty: 10, rate: 150.00, amount: 1500.00 }
    ],
    amount: 1500.00
  },
  '2': {
    invoiceNo: 'INV-2026-002',
    date: '2026-03-18',
    dueDate: '2026-04-18',
    customer: 'Sarah Johnson',
    status: 'Active Accounts',
    items: [
      { id: '1', name: 'Smart Fitness Tracker', qty: 5, rate: 85.00, amount: 425.00 }
    ],
    amount: 425.00
  }
};

export const EditSalesInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const invoice = id ? MOCK_INVOICES[id] : null;

  const [formData, setFormData] = useState(invoice || {});
  const [items, setItems] = useState(invoice?.items || [{ id: '1', name: '', qty: 1, rate: 0, amount: 0 }]);

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Invoice not found</h2>
        <Button onClick={() => navigate('/admin/sales/invoices')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const subtotal = useMemo(() => items.reduce((acc: number, item: any) => acc + (item.qty * item.rate), 0), [items]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/invoices')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Sales Invoice: {formData.invoiceNo}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Invoice Number" value={formData.invoiceNo} onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})} />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} leftIcon={<Calendar size={14} />} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Customer" 
                options={[{ label: 'Nexus Enterprises', value: 'Nexus Enterprises' }, { label: 'Sarah Johnson', value: 'Sarah Johnson' }]} 
                value={formData.customer}
                onChange={(e: any) => setFormData({...formData, customer: e.target.value})}
                onAddNew={() => navigate('/admin/sales/customers/add')}
                addNewLabel="Add New Customer"
              />
              <Input label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} leftIcon={<Calendar size={14} />} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <PlusCircle size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Billing Lines</h3>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-xl h-9 text-[10px] font-bold px-4 hover:bg-white hover:text-black hover:border-[#002147] border border-transparent shadow-sm" 
                leftIcon={<Plus size={14} />}
                onClick={() => setItems([...items, { id: Date.now().toString(), name: '', qty: 1, rate: 0, amount: 0 }])}
              >
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4 w-24 text-center">Qty</th>
                    <th className="px-6 py-4 w-32">Rate</th>
                    <th className="px-6 py-4 w-32">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <tr 
                      className="cursor-pointer hover:bg-slate-50 transition-colors group h-[150px]"
                      onClick={() => setItems([...items, { id: Date.now().toString(), name: '', qty: 1, rate: 0, amount: 0 }])}
                    >
                      <td colSpan={5} className="px-6 h-[150px] text-center text-slate-400 italic">
                        <div className="flex flex-col items-center gap-2">
                          <span>No items added yet.</span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest group-hover:scale-110 transition-transform">
                            Click to add first item
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item: any, idx: number) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <Input 
                            placeholder="Select Product" 
                            value={item.name} 
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].name = e.target.value;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            value={item.qty} 
                            className="text-center"
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].qty = parseInt(e.target.value) || 0;
                              newItems[idx].amount = newItems[idx].qty * newItems[idx].rate;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            value={item.rate} 
                            leftIcon={<span className="text-[10px] uppercase font-bold">$</span>}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].rate = parseFloat(e.target.value) || 0;
                              newItems[idx].amount = newItems[idx].qty * newItems[idx].rate;
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-700">${item.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-300 hover:text-red-500" onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calculator size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Ingestion</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Total</span>
                <span className="font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax Total</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">${subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
             <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Billing Status</h3>
            </div>
             <Select 
                label="Payment Status" 
                options={[{ label: 'Settled', value: 'Settled' }, { label: 'Active Accounts', value: 'Active Accounts' }, { label: 'Overdue Receipts', value: 'Overdue Receipts' }]} 
                value={formData.status}
                onChange={(e: any) => setFormData({...formData, status: e.target.value})}
              />
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/invoices')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Update Invoice
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => navigate('/admin/sales/invoices')}
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black active:scale-[0.98] transition-all"
            >
              Cancel Edit
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
