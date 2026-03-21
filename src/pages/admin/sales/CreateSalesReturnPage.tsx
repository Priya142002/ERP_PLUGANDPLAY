import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  RotateCcw, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  PackageX
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateSalesReturnPage: React.FC = () => {
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
            onClick={() => navigate('/admin/sales/returns')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Sales Return</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Return Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Return Number" 
                placeholder="SRET-2026-003" 
                value="SRET-2026-003"
                required 
              />
              <Input 
                label="Return Date" 
                type="date"
                value={new Date().toISOString().split('T')[0]} 
                leftIcon={<Calendar size={14} />}
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Ref Sales Invoice" 
                placeholder="SINV-2026-001" 
              />
            </div>
          </div>

          {/* Returned Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <PackageX size={18} />
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
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-4 py-4 w-24 text-center">Qty</th>
                    <th className="px-4 py-4 w-32">Refund Rate</th>
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
                            placeholder="Select Product"
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
                            placeholder="0" 
                            className="text-center" 
                            value={item.qty}
                            onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            leftIcon={<span className="text-[10px]">Rs.</span>} 
                            value={item.rate}
                            onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-4 text-orange-600 font-bold">
                          Rs. {item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-300 hover:text-red-500" onClick={() => removeItem(idx)}>
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
                <AlertCircle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Return Options</h3>
            </div>
            <Select 
              label="Reason for Return" 
              options={[
                { label: 'Defective Product', value: 'defective' },
                { label: 'Changed Mind', value: 'mind' },
                { label: 'Wrong Item Delivered', value: 'wrong' },
                { label: 'Quality Dissatisfaction', value: 'quality' }
              ]} 
              required
            />
             <Select 
              label="Restock Option" 
              options={[
                { label: 'Restock to Warehouse', value: 'restock' },
                { label: 'Mark as Damaged/Scrap', value: 'scrap' }
              ]} 
              value="restock"
            />
            <Textarea 
              label="Internal Remarks" 
              placeholder="Notes for sales team..." 
              rows={4} 
            />
          </div>

          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
             <AlertCircle size={18} className="text-orange-500 shrink-0" />
             <p className="text-xs text-orange-700 leading-relaxed">
               This return will increase your warehouse stock and create a credit for the customer (Total: Rs. {subtotal.toLocaleString()}).
             </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Save Return
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
