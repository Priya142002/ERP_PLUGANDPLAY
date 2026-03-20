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
  Clock
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateQuotationPage: React.FC = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/admin/sales/quotations')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">Pro-forma Proposition</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quotation Architecture</h3>
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
                />
                <Input 
                  label="Quotation Number" 
                  placeholder="QTN-2026-004" 
                  value="QTN-2026-004"
                  required 
                />
              </div>
              <div className="space-y-4">
                <Input 
                  label="Quotation Date" 
                  type="date"
                  value={new Date().toISOString().split('T')[0]} 
                  leftIcon={<Calendar size={14} />}
                  required 
                />
                <Input 
                  label="Expiry Date" 
                  type="date"
                  value={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
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
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inventory Selection</h3>
              </div>
              <Button variant="secondary" size="sm" className="rounded-xl h-9 text-[10px] font-bold px-4" leftIcon={<Plus size={14} />}>
                Add Line
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
                      <Select 
                        placeholder="Choose Item"
                        options={[
                          { label: 'Ultra-Wide Monitor 34"', value: '1' },
                          { label: 'Mechanical Keyboard RGB', value: '2' }
                        ]}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" value="1" className="text-center" />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" placeholder="0.00" leftIcon={<span className="text-[10px]">$</span>} />
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 py-2">$0.00</td>
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

        {/* Totals & Options */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
             <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calculator size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Computation</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Total</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (15%)</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="font-bold text-blue-600">$0.00</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Clock size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Legal Provisions</h3>
            </div>
            <Textarea 
              label="Public Notes" 
              placeholder="e.g. Terms of payment, shipping details..." 
              rows={4} 
            />
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-[#003366] text-white h-11 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Issue Proposition
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Reset Interface
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
