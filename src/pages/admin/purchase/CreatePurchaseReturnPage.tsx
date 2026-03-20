import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  RotateCcw, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  PackageCheck
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

export const CreatePurchaseReturnPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/purchase/returns')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Restitution Protocol</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <FileText size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Restitution Protocol</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Return Number" 
                placeholder="PRET-5004" 
                value="PRET-5004"
                required 
              />
              <Input 
                label="Return Date" 
                type="date"
                value={new Date().toISOString().split('T')[0]} 
                leftIcon={<Calendar size={14} />}
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Vendor" 
                placeholder="Select Vendor"
                options={[
                  { label: 'TechNova Solutions', value: '1' },
                  { label: 'Global Logistics', value: '2' },
                  { label: 'Office Essentials', value: '3' }
                ]} 
                required
              />
              <Select 
                label="Reference Invoice" 
                placeholder="Select Invoice"
                options={[
                  { label: 'PINV-2026-001', value: '1' },
                  { label: 'PINV-2026-002', value: '2' },
                  { label: 'Other', value: '3' }
                ]} 
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <PackageCheck size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Return Logistics Ledger</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />}>
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-4 py-4 w-24 text-center">Qty</th>
                    <th className="px-4 py-4 w-32">Unit Price</th>
                    <th className="px-4 py-4 w-32">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   <tr>
                    <td className="px-6 py-4">
                      <Select 
                        placeholder="Select Product"
                        options={[
                          { label: 'Premium Wireless Headphones', value: '1' },
                          { label: 'Smart Fitness Tracker', value: '2' }
                        ]}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" placeholder="0" className="text-center" />
                    </td>
                    <td className="px-4 py-4">
                      <Input type="number" placeholder="0.00" leftIcon={<span className="text-[10px]">$</span>} />
                    </td>
                    <td className="px-4 py-4 text-rose-600 font-bold">
                      $0.00
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300">
                      <Trash2 size={18} className="cursor-pointer hover:text-red-500" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <AlertCircle size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit Intelligence</h3>
            </div>
            <Select 
              label="Return Reason" 
              options={[
                { label: 'Damaged Product', value: 'damaged' },
                { label: 'Partial Shipment', value: 'partial' },
                { label: 'Wrong Item', value: 'wrong' },
                { label: 'Quality Issues', value: 'quality' },
                { label: 'Other', value: 'other' }
              ]} 
              required
            />
            <Textarea 
              label="Remarks" 
              placeholder="Detailed explanation..." 
              rows={4} 
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
             <AlertCircle size={18} className="text-amber-500 shrink-0" />
             <p className="text-xs text-amber-700 leading-relaxed">
               Returning products will adjust your inventory levels and create a corresponding debt for the vendor.
             </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              className="py-6 bg-[#002147] hover:bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all font-bold tracking-tight"
            >
              Authorize Restitution
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={18} />} 
              className="py-6 rounded-xl border-slate-200 text-slate-600 font-bold tracking-tight"
            >
              Reset Protocol
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
