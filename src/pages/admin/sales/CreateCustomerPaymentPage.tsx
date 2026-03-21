import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Save, 
  Building2,
  CheckCircle2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateCustomerPaymentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/payments')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">Customer Payment Receipt</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Main Info */}
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 h-full">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payment Configuration</h3>
            </div>
            
            <Input 
              label="Payment Receipt #" 
              placeholder="PAY-2026-004" 
              value="PAY-2026-004"
              required 
            />
            
            <Input 
              label="Payment Date" 
              type="date"
              value={new Date().toISOString().split('T')[0]} 
              leftIcon={<Calendar size={14} />}
              required 
            />

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
              label="Amount Received" 
              type="number" 
              placeholder="0.00" 
              leftIcon={<span className="text-[10px]">Rs.</span>}
              required 
            />
          </div>
        </div>

        {/* Payment Collection */}
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Building2 size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payment Channel</h3>
            </div>
            
            <Select 
              label="Payment Method" 
              options={[
                { label: 'Cash', value: 'cash' },
                { label: 'Bank Transfer', value: 'bank' },
                { label: 'Credit Card', value: 'card' },
                { label: 'Cheque', value: 'cheque' }
              ]} 
              required
            />

            <Select 
              label="Deposit To (Account)" 
              options={[
                { label: 'Main Business A/C', value: 'main' },
                { label: 'Petty Cash', value: 'petty' }
              ]} 
              required
            />

            <Input 
              label="Reference / Auth ID" 
              placeholder="TXN ID or Cheque Number" 
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
             <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
             <p className="text-xs text-blue-700 leading-relaxed">
               Incoming payments will be applied to the customer's outstanding invoices.
             </p>
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Internal Remarks</h3>
        </div>
        <Textarea 
          label="Notes / Remarks" 
          placeholder="Internal record of this transaction..." 
          rows={3} 
        />
        
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/admin/sales/payments')}
              className="h-11 px-8 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black active:scale-95 transition-all"
            >
              Cancel Entry
            </Button>
          <Button 
            variant="primary" 
            leftIcon={<Save size={14} />}
            className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 px-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all"
          >
            Save Payment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
