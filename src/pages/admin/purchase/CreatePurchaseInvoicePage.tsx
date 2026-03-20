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
  Percent
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreatePurchaseInvoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/purchase/invoices')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Purchase Transaction</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <FileText size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Voucher Identification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select 
                  label="Vendor" 
                  placeholder="Select Vendor"
                  options={[
                    { label: 'TechNova Solutions', value: '1' },
                    { label: 'Global Logistics', value: '2' },
                    { label: 'Office Essentials', value: '3' }
                  ]} 
                  required
                />
                <Input 
                  label="Invoice Number" 
                  placeholder="PINV-2026-004" 
                  value="PINV-2026-004"
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

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <PlusCircle size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Ledger</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-4 py-4 w-24 text-center">Qty</th>
                    <th className="px-4 py-4 w-32">Rate</th>
                    <th className="px-4 py-4 w-32">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Select 
                          placeholder="Select Product"
                          options={[
                            { label: 'Premium Wireless Headphones', value: '1' },
                            { label: 'Smart Fitness Tracker', value: '2' }
                          ]}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" value="1" className="text-center" />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" placeholder="0.00" leftIcon={<span className="text-[10px]">$</span>} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 py-2">$0.00</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Totals & Notes Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <Calculator size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Aggregation</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Total</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-500">Discount</span>
                <div className="w-24">
                   <Input 
                    type="number" 
                    placeholder="0" 
                    size="sm" 
                    rightIcon={<Percent size={12} />} 
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (VAT 10%)</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-emerald-600">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <RotateCcw size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Post-Transactional</h3>
            </div>
            <Textarea 
              label="Vendor Remarks" 
              placeholder="Add any instructions..." 
              rows={4} 
            />
             <Select 
              label="Payment Status" 
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
                { label: 'Partial', value: 'partial' }
              ]} 
              value="pending"
            />
          </div>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              className="py-6 bg-[#002147] hover:bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all font-bold tracking-tight"
            >
              Authorize Transaction
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={18} />} 
              className="py-6 rounded-xl border-slate-200 text-slate-600 font-bold tracking-tight"
            >
              Reset Calculations
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
