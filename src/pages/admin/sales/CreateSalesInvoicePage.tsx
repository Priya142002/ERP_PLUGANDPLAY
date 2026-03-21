import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  PlusCircle,
  Calculator,
  CreditCard,
  Percent
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateSalesInvoicePage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = React.useState<any[]>([]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    if (field === 'qty' || field === 'rate') {
      newItems[idx].amount = (newItems[idx].qty || 0) * (newItems[idx].rate || 0);
    }
    setItems(newItems);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = React.useMemo(() => items.reduce((acc, item) => acc + (item.amount || 0), 0), [items]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/invoices')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Sales Invoice</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select 
                  label="Customer" 
                  placeholder="Select Customer"
                  options={[
                    { label: 'Alex Johnson', value: '1' },
                    { label: 'Sarah Williams', value: '2' },
                    { label: 'Tech Solutions Inc', value: '3' }
                  ]} 
                  required
                  onAddNew={() => navigate('/admin/sales/customers/add')}
                  addNewLabel="Add New Customer"
                />
                <Input 
                  label="Invoice Number" 
                  placeholder="SINV-2026-004" 
                  value="SINV-2026-004"
                  required 
                />
              </div>
              <div className="space-y-4">
                <Input 
                  label="Invoice Date" 
                  type="date"
                  value={new Date().toISOString().split('T')[0]} 
                  leftIcon={<Calendar size={14} />}
                  required 
                />
                <Input 
                  label="Due Date" 
                  type="date"
                  value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  leftIcon={<Calendar size={14} />}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <PlusCircle size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Add Items</h3>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-xl h-9 text-[10px] font-bold px-4 hover:bg-white hover:text-black hover:border-[#002147] border border-transparent shadow-sm" 
                leftIcon={<Plus size={14} />}
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Product / Service</th>
                    <th className="px-4 py-4 w-24 text-center">Qty</th>
                    <th className="px-4 py-4 w-32">Price</th>
                    <th className="px-4 py-4 w-32">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <tr 
                      className="cursor-pointer hover:bg-slate-50 transition-colors group h-[150px]"
                      onClick={addItem}
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
                    items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <Select 
                            placeholder="Search Product"
                            value={item.name}
                            onChange={(e: any) => updateItem(idx, 'name', e.target.value)}
                            options={[
                              { label: 'Ultra-Wide Monitor 34"', value: 'Ultra-Wide Monitor 34"' },
                              { label: 'Mechanical Keyboard RGB', value: 'Mechanical Keyboard RGB' }
                            ]}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            value={item.qty} 
                            className="text-center" 
                            onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            value={item.rate}
                            placeholder="0.00" 
                            leftIcon={<span className="text-[10px]">Rs.</span>} 
                            onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-900">Rs. {item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-300 hover:text-red-500 p-1" onClick={() => removeItem(idx)}>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
             <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calculator size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Summary</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Total</span>
                <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-500">Discount</span>
                <div className="w-24">
                  <Input type="number" placeholder="0" size="sm" rightIcon={<Percent size={12} />} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (15%)</span>
                <span className="font-bold text-slate-900">Rs. {(subtotal * 0.15).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Total Due</span>
                <span className="font-bold text-indigo-600">Rs. {(subtotal * 1.15).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payment & Notes</h3>
            </div>
            <Select 
              label="Payment Status" 
              options={[
                { label: 'Unpaid', value: 'unpaid' },
                { label: 'Partially Paid', value: 'partial' },
                { label: 'Paid', value: 'paid' }
              ]} 
              value="unpaid"
            />
            <Textarea 
              label="Customer Note" 
              placeholder="Included on PDF invoice..." 
              rows={3} 
            />
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Save Invoice
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black active:scale-[0.98] transition-all"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
