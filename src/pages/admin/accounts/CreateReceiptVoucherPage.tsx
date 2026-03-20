import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  CreditCard,
  Info,
  User,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Building2,
  Calendar
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateReceiptVoucherPage: React.FC = () => {
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
            onClick={() => navigate('/admin/accounts/receipts')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Receipt Voucher</h1>
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
                placeholder="RV-2026-003" 
                value="RV-2026-003"
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
                label="Received In (Debit)" 
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
                  { label: 'Online Transfer', value: 'online' }
                ]} 
                leftIcon={<CreditCard size={14} />}
                required
              />
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Plus size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Revenue & Credits</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
                Add Line
              </Button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Account (Credit)</th>
                    <th className="px-6 py-4">Particulars</th>
                    <th className="px-4 py-4 w-40 text-right">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   <tr>
                    <td className="px-6 py-4 min-w-[250px]">
                      <Select 
                        placeholder="Choose Head"
                        options={[
                          { label: 'Sales Revenue', value: '1' },
                          { label: 'Service Income', value: '2' },
                          { label: 'Commission Received', value: '3' }
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input placeholder="Description..." />
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
                    <td colSpan={2} className="px-6 py-4 text-right text-slate-500 text-xs uppercase tracking-wider">Total Received</td>
                    <td className="px-4 py-4 text-right text-emerald-600">$0.00</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900">Source Information</h3>
            <Select 
              label="Received From"
              options={[
                { label: 'Alex Johnson', value: '1' },
                { label: 'Sarah Williams', value: '2' },
                { label: 'Miscellaneous', value: 'misc' }
              ]}
              leftIcon={<User size={14} />}
            />
            <Input label="External Reference" placeholder="Receipt or Transaction ID" />
            <Textarea 
              label="Narration" 
              placeholder="Record the purpose of this income..." 
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
              Post Receipt
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
