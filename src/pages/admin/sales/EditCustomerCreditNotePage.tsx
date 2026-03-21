import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, FileText, Calendar, Plus, Trash2, Save, 
  RotateCcw, AlertTriangle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

const MOCK_CREDIT_NOTES: Record<string, any> = {
  '1': {
    creditNo: 'CN-1001',
    date: '2026-03-12',
    customer: 'Nexus Enterprises',
    invoiceRef: 'INV-2026-001',
    reason: 'Price Correction',
    lines: [{ id: '1', description: 'Price Correction - Bulk Discount', amount: 850.00 }],
    amount: 850.00
  }
};

export const EditCustomerCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const creditNote = id ? MOCK_CREDIT_NOTES[id] : null;

  const [formData, setFormData] = useState(creditNote || {});
  const [lines, setLines] = useState(creditNote?.lines || [{ id: '1', description: '', amount: 0 }]);

  if (!creditNote) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Credit Note not found</h2>
        <Button onClick={() => navigate('/admin/sales/credit-note')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const totalAdjustment = useMemo(() => lines.reduce((acc: number, line: any) => acc + (line.amount || 0), 0), [lines]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/credit-note')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Credit Note: {formData.creditNo}</h1>
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
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Credit Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Credit Note #" value={formData.creditNo} onChange={(e) => setFormData({...formData, creditNo: e.target.value})} />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} leftIcon={<Calendar size={14} />} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Customer" 
                options={[{ label: 'Nexus Enterprises', value: 'Nexus Enterprises' }, { label: 'Sarah Johnson', value: 'Sarah Johnson' }]} 
                value={formData.customer}
                onChange={(e: any) => setFormData({...formData, customer: e.target.value})}
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
                variant="secondary" 
                size="sm" 
                className="rounded-xl h-9 text-[10px] font-bold px-4" 
                leftIcon={<Plus size={14} />}
                onClick={() => setLines([...lines, { id: Date.now().toString(), description: '', amount: 0 }])}
              >
                Add Line
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Description / Reason</th>
                    <th className="px-6 py-4 w-40 text-right">Credit Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line: any, idx: number) => (
                    <tr key={line.id}>
                      <td className="px-6 py-4">
                        <Input 
                          placeholder="Enter reason for credit" 
                          value={line.description} 
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].description = e.target.value;
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number" 
                          value={line.amount} 
                          className="text-right"
                          leftIcon={<span className="text-[10px] uppercase font-bold">$</span>}
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].amount = parseFloat(e.target.value) || 0;
                            setLines(newLines);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-slate-300 hover:text-red-500" onClick={() => setLines(lines.filter((_: any, i: number) => i !== idx))}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Directives</h3>
            </div>
            <Select 
              label="Standard Reason"
              options={[
                { label: 'Sales Return', value: 'Sales Return' },
                { label: 'Price Correction', value: 'Price Correction' },
                { label: 'Damaged Goods', value: 'Damaged Goods' },
                { label: 'Late Delivery Discount', value: 'Late Delivery Discount' }
              ]} 
              value={formData.reason}
              onChange={(e: any) => setFormData({...formData, reason: e.target.value})}
            />
            <Textarea label="Remarks" placeholder="Internal notes for accounting..." rows={4} />
          </div>

          <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex gap-3 text-sm">
             <span className="text-teal-600 font-bold uppercase tracking-tighter">Total Adjustment: ${totalAdjustment.toLocaleString()}</span>
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/credit-note')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent text-white h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Update Alignment
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => navigate('/admin/sales/credit-note')}
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
