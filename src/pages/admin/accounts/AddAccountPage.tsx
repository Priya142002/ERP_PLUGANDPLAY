import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FolderTree, 
  Info, 
  Save, 
  Layers,
  RotateCcw,
  Hash,
  CheckCircle2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const AddAccountPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/accounts/chart-of-accounts')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">Register Fiscal Head</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Info size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fiscal Identity</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Account Code" 
                placeholder="e.g. 1001" 
                leftIcon={<Hash size={14} />} 
                required 
              />
              <Select 
                label="Account Category" 
                options={[
                  { label: 'Asset', value: 'asset' },
                  { label: 'Liability', value: 'liability' },
                  { label: 'Equity', value: 'equity' },
                  { label: 'Revenue', value: 'revenue' },
                  { label: 'Expense', value: 'expense' }
                ]} 
                required
              />
            </div>

            <Input 
              label="Account Name" 
              placeholder="e.g. Cash in Hand" 
              required 
            />

            <Select 
              label="Parent Account" 
              placeholder="Select Parent"
              options={[
                { label: 'Current Assets', value: 'ca' },
                { label: 'Fixed Assets', value: 'fa' },
                { label: 'Operating Expenses', value: 'oe' }
              ]} 
              leftIcon={<FolderTree size={14} />}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Layers size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Opening Metrics</h3>
            </div>
            
            <Textarea 
              label="Description" 
              placeholder="Purpose of this account..." 
              rows={4} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Opening Balance" 
                type="number" 
                placeholder="0.00" 
                leftIcon={<span className="text-[10px] font-bold">$</span>}
              />
              <Input 
                label="Effective Date" 
                type="date"
                value={new Date().toISOString().split('T')[0]} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900">Status & Permissions</h3>
            
            <Select 
              label="Account Status" 
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]} 
              value="active"
            />

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
               <input type="checkbox" id="allow_vouchers" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
               <label htmlFor="allow_vouchers" className="text-xs text-slate-600 font-medium">Allow Direct Vouchers</label>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
             <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
             <p className="text-xs text-indigo-700 leading-relaxed">
               New accounts must be correctly categorized under the appropriate parent for accurate financial reporting.
             </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              className="bg-[#002147] hover:bg-[#003366] text-white h-11 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Finalize Ledger
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
