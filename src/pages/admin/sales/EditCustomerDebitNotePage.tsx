import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, FileText, Calendar, Plus, Trash2, Save, 
  RotateCcw, AlertCircle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const MOCK_DEBIT_NOTES: Record<string, any> = {
  '1': {
    debitNo: 'DN-1001',
    date: '2026-03-14',
    customer: 'Nexus Enterprises',
    invoiceRef: 'INV-2026-001',
    reason: 'Undercharged Invoice',
    charges: [{ id: '1', description: 'Undercharged Item #A1', amount: 1200.00 }],
    amount: 1200.00
  }
};

export const EditCustomerDebitNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const debitNote = id ? MOCK_DEBIT_NOTES[id] : null;

  const [formData, setFormData] = useState(debitNote || {});
  const [charges, setCharges] = useState(debitNote?.charges || [{ id: '1', description: '', amount: 0 }]);

  if (!debitNote) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Debit Note not found</h2>
        <Button onClick={() => navigate('/admin/sales/debit-notes')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const totalDebit = useMemo(() => charges.reduce((acc: number, charge: any) => acc + (charge.amount || 0), 0), [charges]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/debit-notes')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Debit Note: {formData.debitNo}</h1>
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
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Debit Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Debit Note #" value={formData.debitNo} onChange={(e) => setFormData({...formData, debitNo: e.target.value})} />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} leftIcon={<Calendar size={14} />} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Customer" 
                options={[{ label: 'Nexus Enterprises', value: 'Nexus Enterprises' }, { label: 'Sarah Johnson', value: 'Sarah Johnson' }]} 
                value={formData.customer}
                onChange={(e: any) => setFormData({...formData, customer: e.target.value})}
                onAddNew={() => navigate('/admin/sales/customers/add')}
                addNewLabel="Add New Customer"
              />
              <Input label="Ref Invoice" value={formData.invoiceRef} onChange={(e) => setFormData({...formData, invoiceRef: e.target.value})} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Plus size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Asset Calibration</h3>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-xl h-9 text-[10px] font-bold px-4 hover:bg-white hover:text-black hover:border-[#002147] border border-transparent" 
                leftIcon={<Plus size={14} />}
                onClick={() => setCharges([...charges, { id: Date.now().toString(), description: '', amount: 0 }])}
              >
                Add Charge
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Charge Description</th>
                    <th className="px-6 py-4 w-40 text-right">Debit Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {charges.length === 0 ? (
                    <tr 
                      className="cursor-pointer hover:bg-slate-50 transition-colors group h-[150px]"
                      onClick={() => setCharges([...charges, { id: Date.now().toString(), description: '', amount: 0 }])}
                    >
                      <td colSpan={3} className="px-6 h-[150px] text-center text-slate-400 italic">
                        <div className="flex flex-col items-center gap-2">
                          <span>No charges added yet.</span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest group-hover:scale-110 transition-transform">
                            Click to add first charge
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    charges.map((charge: any, idx: number) => (
                      <tr key={charge.id}>
                        <td className="px-6 py-4">
                          <Input 
                            placeholder="Extra shipping, undercharged item, etc." 
                            value={charge.description} 
                            onChange={(e) => {
                              const newCharges = [...charges];
                              newCharges[idx].description = e.target.value;
                              setCharges(newCharges);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            value={charge.amount} 
                            className="text-right"
                            leftIcon={<span className="text-[10px] uppercase font-bold">$</span>}
                            onChange={(e) => {
                              const newCharges = [...charges];
                              newCharges[idx].amount = parseFloat(e.target.value) || 0;
                              setCharges(newCharges);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-300 hover:text-red-500" onClick={() => setCharges(charges.filter((_: any, i: number) => i !== idx))}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Directives</h3>
            </div>
            <Select 
              label="Select Reason"
              options={[
                { label: 'Undercharged Invoice', value: 'Undercharged Invoice' },
                { label: 'Additional Services', value: 'Additional Services' },
                { label: 'Price Hike Adjustment', value: 'Price Hike Adjustment' },
                { label: 'Unrecorded Item', value: 'Unrecorded Item' }
              ]} 
              value={formData.reason}
              onChange={(e: any) => setFormData({...formData, reason: e.target.value})}
            />
            <Textarea label="Internal Remarks" placeholder="Explanation for management..." rows={4} />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-sm">
             <span className="text-indigo-600 font-bold uppercase tracking-tighter">Debit Total: ${totalDebit.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/debit-notes')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Commit Ingestion
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => navigate('/admin/sales/debit-notes')}
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
