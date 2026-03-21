import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
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

// Mock payment data
const MOCK_PAYMENTS = [
  { 
    id: '1', 
    paymentNo: 'PAY-8001', 
    date: '2026-03-16', 
    vendor: '1', 
    amount: 4410.00, 
    method: 'bank', 
    paidThrough: 'op', 
    reference: 'TXN_992201',
    remarks: 'Payment for Invoice INV-2024-001 and INV-2024-002'
  },
  { 
    id: '2', 
    paymentNo: 'PAY-8002', 
    date: '2026-03-14', 
    vendor: '3', 
    amount: 892.50, 
    method: 'card', 
    paidThrough: 'op', 
    reference: 'CARD_0224',
    remarks: 'Office supplies payment'
  },
  { 
    id: '3', 
    paymentNo: 'PAY-8003', 
    date: '2026-03-12', 
    vendor: '4', 
    amount: 126.00, 
    method: 'cash', 
    paidThrough: 'cash', 
    reference: 'CASH_110',
    remarks: 'Monthly water supply payment'
  },
  { 
    id: '4', 
    paymentNo: 'PAY-8004', 
    date: '2026-03-10', 
    vendor: '2', 
    amount: 1000.00, 
    method: 'cheque', 
    paidThrough: 'op', 
    reference: 'CHQ_5502',
    remarks: 'Logistics service payment - pending clearance'
  },
];

export const EditVendorPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [paymentNo, setPaymentNo] = useState('');
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [paidThrough, setPaidThrough] = useState('');
  const [reference, setReference] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    // Load payment data based on ID
    const payment = MOCK_PAYMENTS.find(p => p.id === id);
    if (payment) {
      setPaymentNo(payment.paymentNo);
      setDate(payment.date);
      setVendor(payment.vendor);
      setAmount(payment.amount.toString());
      setMethod(payment.method);
      setPaidThrough(payment.paidThrough);
      setReference(payment.reference);
      setRemarks(payment.remarks || '');
    }
  }, [id]);

  return (
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
              value={paymentNo}
              onChange={(e) => setPaymentNo(e.target.value)}
              required 
            />
            
            <Input 
              label="Payment Date" 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              leftIcon={<Calendar size={14} />}
              required 
            />

            <Select 
              label="Vendor" 
              placeholder="Select Vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              options={[
                { label: 'TechNova Solutions', value: '1' },
                { label: 'Global Logistics', value: '2' },
                { label: 'Office Essentials', value: '3' },
                { label: 'Pure Water Co.', value: '4' }
              ]} 
              required
            />

            <Input 
              label="Amount to Pay" 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<span className="text-[10px] font-bold">$</span>}
              required 
            />
          </div>
        </div>

        {/* Payment Method & Allocation */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Building2 size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Settlement Channel</h3>
            </div>
            
            <Select 
              label="Payment Method" 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
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
              value={paidThrough}
              onChange={(e) => setPaidThrough(e.target.value)}
              options={[
                { label: 'Operational Bank A/C', value: 'op' },
                { label: 'Petty Cash', value: 'cash' }
              ]} 
              required
            />

            <Input 
              label="Reference / Transaction ID" 
              placeholder="Ref No. or Cheque No." 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
             <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
             <p className="text-xs text-indigo-700 leading-relaxed">
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
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
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
            Update Settlement
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
