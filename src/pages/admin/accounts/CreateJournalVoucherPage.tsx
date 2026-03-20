import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  Scale,
  Hash,
  Info
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateJournalVoucherPage: React.FC = () => {
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
            onClick={() => navigate('/admin/accounts/journal')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Journal Entry</h1>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Voucher Number" 
              placeholder="JV-2026-004" 
              value="JV-2026-004"
              leftIcon={<Hash size={14} />}
              required 
            />
            <Input 
              label="Date" 
              type="date"
              value={new Date().toISOString().split('T')[0]} 
              leftIcon={<Calendar size={14} />}
              required 
            />
            <Select 
              label="Adjustment Category" 
              options={[
                { label: 'General Adjustment', value: 'gen' },
                { label: 'Accrual / Deferral', value: 'accrual' },
                { label: 'Correction of Error', value: 'error' },
                { label: 'Year-End Closing', value: 'closing' }
              ]} 
              value="gen"
            />
          </div>
        </div>

        {/* Double Entry Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Scale size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ledger Synchronicity</h3>
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
              Add Entry
            </Button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Account Head</th>
                  <th className="px-6 py-4">Narration / Details</th>
                  <th className="px-4 py-4 w-40 text-right">Debit ($)</th>
                  <th className="px-4 py-4 w-40 text-right">Credit ($)</th>
                  <th className="px-6 py-4 text-center w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 <tr>
                  <td className="px-6 py-4 min-w-[280px]">
                    <Select 
                      placeholder="Account"
                      options={[
                        { label: 'Inventory Assets', value: '1' },
                        { label: 'Cost of Goods Sold', value: '2' },
                        { label: 'Prepaid Expenses', value: '3' }
                      ]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Input placeholder="Line specific notes..." />
                  </td>
                  <td className="px-4 py-4">
                    <Input type="number" placeholder="0.00" className="text-right" />
                  </td>
                  <td className="px-4 py-4">
                    <Input type="number" placeholder="0.00" className="text-right font-medium text-slate-400" disabled />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 min-w-[280px]">
                    <Select 
                      placeholder="Account"
                      options={[
                        { label: 'Trade Payables', value: '4' },
                        { label: 'Accrued Liabilities', value: '5' }
                      ]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Input placeholder="Line specific notes..." />
                  </td>
                  <td className="px-4 py-4">
                    <Input type="number" placeholder="0.00" className="text-right font-medium text-slate-400" disabled />
                  </td>
                  <td className="px-4 py-4">
                    <Input type="number" placeholder="0.00" className="text-right" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/50 font-bold border-t border-slate-200">
                  <td colSpan={2} className="px-6 py-5 text-right text-slate-500 text-xs uppercase tracking-wider items-center gap-2">
                    <div className="flex items-center justify-end gap-2">
                       <Scale size={14} className="text-indigo-400" />
                       Sum of Entries
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right text-indigo-600">$0.00</td>
                  <td className="px-4 py-5 text-right text-indigo-600">$0.00</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Remarks & Footer */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Info size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Voucher Narrative</h3>
            </div>
          <Textarea 
            placeholder="Provide a comprehensive explanation for this journal entry..." 
            rows={4} 
          />
          
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={() => navigate('/admin/accounts/journal')} className="rounded-xl border-slate-200 h-10 text-xs font-bold px-4">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-[#003366] text-white h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all px-6"
            >
              Post Journal Entry
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
