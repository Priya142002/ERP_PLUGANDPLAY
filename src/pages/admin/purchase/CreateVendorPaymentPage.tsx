import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Save, 
  Wallet,
  Building2,
  CheckCircle2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { AddVendorModal } from "./AddVendorModal";

export const CreateVendorPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendors, setVendors] = useState([
    { label: 'TechNova Solutions', value: '1' },
    { label: 'Global Logistics', value: '2' },
    { label: 'Office Essentials', value: '3' }
  ]);

  const handleAddVendor = (vendorName: string) => {
    const newVendor = {
      label: vendorName,
      value: (vendors.length + 1).toString()
    };
    setVendors([...vendors, newVendor]);
    setSelectedVendor(newVendor.value);
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/purchase/payments')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Outgoing Settlement Protocol</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Details */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <CreditCard size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction Architecture</h3>
            </div>
            
            <Input 
              label="Payment Number" 
              placeholder="PAY-8004" 
              value="PAY-8004"
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
              label="Vendor" 
              placeholder="Select Vendor"
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              options={vendors}
              onAddNew={() => setShowAddVendorModal(true)}
              addNewLabel="Add new vendor"
              required
            />

            <Input 
              label="Amount to Pay" 
              type="number" 
              placeholder="0.00" 
              leftIcon={<span className="text-[10px] font-bold">$</span>}
              required 
            />
          </div>
        </div>

        {/* Payment Method & Allocation */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Building2 size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Settlement Channel</h3>
            </div>
            
            <Select 
              label="Payment Method" 
              options={[
                { label: 'Bank Transfer', value: 'bank' },
                { label: 'Cash', value: 'cash' },
                { label: 'Corporate Card', value: 'card' },
                { label: 'Cheque', value: 'cheque' }
              ]} 
              required
            />

            <Select 
              label="Paid Through (Bank Account)" 
              options={[
                { label: 'Operational Bank A/C', value: 'op' },
                { label: 'Petty Cash', value: 'cash' }
              ]} 
              required
            />

            <Input label="Reference / Transaction ID" placeholder="Ref No. or Cheque No." />
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3">
             <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
             <p className="text-xs text-emerald-700 leading-relaxed">
               This payment will be allocated to the oldest outstanding invoices for this vendor automatically.
             </p>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Wallet size={16} />
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Intelligence</h3>
        </div>
        <Textarea 
          label="Payment Remarks" 
          placeholder="Add any internal briefing about this transaction..." 
          rows={3} 
        />
        
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-slate-50">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/admin/purchase/payments')}
            className="px-8 h-12 rounded-xl border-slate-200 text-slate-600 font-bold"
          >
            Cancel Protocol
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Save size={18} />}
            className="px-12 h-12 bg-[#002147] hover:bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all font-bold"
          >
            Authorize Settlement
          </Button>
        </div>
      </div>
    </motion.div>
      
      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <AddVendorModal
          onClose={() => setShowAddVendorModal(false)}
          onSave={handleAddVendor}
        />
      )}
    </>
  );
};
