import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  CreditCard,
  Building2,
  Info
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreatePaymentVoucherPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/accounts/payments')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Payment Voucher</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Info size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Voucher Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Voucher Number" 
                placeholder="PV-2026-003" 
                value="PV-2026-003"
                required 
              />
              <Input 
                label="Voucher Date" 
                type="date"
                value={new Date().toISOString().split('T')[0]} 
                leftIcon={<Calendar size={14} />}
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Paid From (Credit)" 
                placeholder="Select Account"
                options={[
                  { label: 'Petty Cash', value: 'cash' },
                  { label: 'Main Business A/C', value: 'bank' }
                ]} 
                leftIcon={<Building2 size={14} />}
                required
              />
              <Select 
                label="Payment Method" 
                options={[
                  { label: 'Cash', value: 'cash' },
                  { label: 'Cheque', value: 'cheque' },
                  { label: 'Bank Transfer', value: 'bank' }
                ]} 
                leftIcon={<CreditCard size={14} />}
                required
              />
            </div>
          </div>

          {/* Lines Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Accounts & Ledger</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
                Add Line
              </Button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Account (Debit)</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-4 py-4 w-40 text-right">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   <tr>
                    <td className="px-6 py-4 min-w-[250px]">
                      <Select 
                        placeholder="Choose Account"
                        options={[
                          { label: 'Office Supplies Expense', value: '1' },
                          { label: 'Utility Bills', value: '2' },
                          { label: 'Staff Salaries', value: '3' }
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input placeholder="Line particulars..." />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" placeholder="0.00" className="text-right" leftIcon={<span className="text-[10px]">$</span>} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/50 font-bold">
                    <td colSpan={2} className="px-6 py-4 text-right text-slate-500 text-xs uppercase tracking-wider">Total Payment</td>
                    <td className="px-4 py-4 text-right text-rose-600">$0.00</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900">Supporting Info</h3>
            <Input label="Reference / Cheque #" placeholder="Ref Number" />
            <Textarea 
              label="Overall Remarks" 
              placeholder="Narrative for this voucher..." 
              rows={5} 
            />
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-[#003366] text-white h-11 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Post Voucher
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
