import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, FileText, Calendar, CreditCard, Save, 
  RotateCcw, AlertCircle, Building2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const MOCK_PAYMENTS: Record<string, any> = {
  '1': {
    paymentNo: 'PAY-2026-001',
    date: '2026-03-20',
    customer: 'Nexus Enterprises',
    amount: 1500.00,
    method: 'Bank Transfer',
    reference: 'REF-99881',
    notes: 'Standard payment for Invoice #INV-2026-001'
  }
};

export const EditCustomerPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const payment = id ? MOCK_PAYMENTS[id] : null;

  const [formData, setFormData] = useState(payment || {});

  if (!payment) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Payment not found</h2>
        <Button onClick={() => navigate('/admin/sales/payments')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/payments')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Payment: {formData.paymentNo}</h1>
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
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Remittance Identification</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Payment Number" value={formData.paymentNo} onChange={(e) => setFormData({...formData, paymentNo: e.target.value})} />
              <Input label="Payment Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} leftIcon={<Calendar size={14} />} />
            </div>

            <Select 
              label="Customer" 
              options={[{ label: 'Nexus Enterprises', value: 'Nexus Enterprises' }, { label: 'Sarah Johnson', value: 'Sarah Johnson' }]} 
              value={formData.customer}
              onChange={(e: any) => setFormData({...formData, customer: e.target.value})}
              leftIcon={<Building2 size={14} />}
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction Logistics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Amount Received" 
                type="number" 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                leftIcon={<span className="text-[10px] font-bold">$</span>}
              />
              <Select 
                label="Payment Method" 
                options={[{ label: 'Cash', value: 'Cash' }, { label: 'Bank Transfer', value: 'Bank Transfer' }, { label: 'Credit Card', value: 'Credit Card' }, { label: 'Cheque', value: 'Cheque' }]} 
                value={formData.method}
                onChange={(e: any) => setFormData({...formData, method: e.target.value})}
              />
            </div>
            
            <Input 
              label="Reference Number" 
              placeholder="e.g. TXN-998877" 
              value={formData.reference} 
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Narrative</h3>
            </div>
            <Textarea 
              label="Internal Remarks" 
              placeholder="Explanation for management..." 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4} 
            />
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/payments')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Update Remittance
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => navigate('/admin/sales/payments')}
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
