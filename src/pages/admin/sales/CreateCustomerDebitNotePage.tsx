import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Save, 
  RotateCcw,
  Plus, 
  Trash2, 
  AlertCircle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreateCustomerDebitNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [charges, setCharges] = React.useState<any[]>([]);

  const addCharge = () => {
    setCharges([...charges, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const updateCharge = (idx: number, field: string, value: any) => {
    const newCharges = [...charges];
    newCharges[idx][field] = value;
    setCharges(newCharges);
  };

  const removeCharge = (idx: number) => {
    setCharges(charges.filter((_, i) => i !== idx));
  };

  const totalDebit = React.useMemo(() => charges.reduce((acc, charge) => acc + (charge.amount || 0), 0), [charges]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/sales/debit-notes')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">New Customer Debit Note</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Debit Note Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Debit Note #" 
                placeholder="CDN-2026-004" 
                value="CDN-2026-004"
                required 
              />
              <Input 
                label="Date" 
                type="date"
                value={new Date().toISOString().split('T')[0]} 
                leftIcon={<Calendar size={14} />}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Ref Invoice" 
                placeholder="SINV-2026-003" 
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Plus size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Add Items</h3>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-xl h-9 text-[10px] font-bold px-4 hover:bg-white hover:text-black hover:border-[#002147] border border-transparent shadow-sm" 
                leftIcon={<Plus size={14} />}
                onClick={addCharge}
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
                      onClick={addCharge}
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
                    charges.map((charge, idx) => (
                      <tr key={charge.id}>
                        <td className="px-6 py-4">
                          <Input 
                            placeholder="Extra shipping, undercharged item, etc." 
                            value={charge.description}
                            onChange={(e) => updateCharge(idx, 'description', e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="text-right"
                            value={charge.amount}
                            leftIcon={<span className="text-[10px] uppercase font-bold">$</span>}
                            onChange={(e) => updateCharge(idx, 'amount', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-slate-300 hover:text-red-500" onClick={() => removeCharge(idx)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                   <tr className="bg-slate-50/50 text-sm font-bold">
                    <td className="px-6 py-4 text-right text-slate-500">Increase In Balance</td>
                    <td className="px-6 py-4 text-right text-indigo-600">${totalDebit.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-50">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <AlertCircle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reason & Notes</h3>
            </div>
            <Select 
              options={[
                { label: 'Undercharged Invoice', value: 'undercharge' },
                { label: 'Additional Services', value: 'srv' },
                { label: 'Price Hike Adjustment', value: 'hike' },
                { label: 'Unrecorded Item', value: 'misc' }
              ]} 
              placeholder="Select Reason"
            />
            <Textarea label="Internal Remarks" placeholder="Explanation for management..." rows={4} />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
             <AlertCircle size={18} className="text-indigo-500 shrink-0" />
             <p className="text-xs text-indigo-700 leading-relaxed">
               Providing a debit note will increase the amount that the customer owes to your company.
             </p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={14} />} 
              onClick={() => navigate('/admin/sales/debit-notes')}
              className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Save Debit Note
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={14} />} 
              onClick={() => window.location.reload()}
              className="h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-black active:scale-[0.98] transition-all"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
