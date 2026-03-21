import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Save, 
  RotateCcw,
  FileBadge,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import { AddVendorModal } from "./AddVendorModal";

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

export const CreateVendorCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendors, setVendors] = useState([
    { label: 'TechNova Solutions', value: '1' },
    { label: 'Vertex Industries', value: '2' },
    { label: 'Global Logistics', value: '3' }
  ]);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', amount: 0 }
  ]);

  const handleAddVendor = (vendorName: string) => {
    const newVendor = {
      label: vendorName,
      value: (vendors.length + 1).toString()
    };
    setVendors([...vendors, newVendor]);
    setSelectedVendor(newVendor.value);
  };

  const addLine = () => {
    const newLine: LineItem = {
      id: Date.now().toString(),
      description: '',
      amount: 0
    };
    setLineItems([...lineItems, newLine]);
  };

  const removeLine = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLine = (id: string, field: 'description' | 'amount', value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [lineItems]);

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/purchase/credit-note')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Credit Authorization</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <FileBadge size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Credit Architecture</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Credit Note #" 
                placeholder="VCN-3004" 
                value="VCN-3004"
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

            <div className="grid grid-cols-2 gap-4">
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
                label="Reference Invoice" 
                placeholder="e.g. PINV-2026-001" 
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Plus size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Adjustment Ledger</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={addLine}>
                Add Line
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Account / Description</th>
                    <th className="px-6 py-4 w-40 text-right">Amount</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <Input 
                          placeholder="Enter reason or item description" 
                          value={item.description}
                          onChange={(e) => updateLine(item.id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="text-right"
                          value={item.amount || ''}
                          onChange={(e) => updateLine(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          leftIcon={<span className="text-[10px]">$</span>}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => removeLine(item.id)}
                          disabled={lineItems.length === 1}
                          className={`transition ${
                            lineItems.length === 1 
                              ? 'text-slate-200 cursor-not-allowed' 
                              : 'text-slate-300 hover:text-red-500'
                          }`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                   <tr className="bg-slate-50/50 border-t-2 border-slate-200">
                    <td className="px-6 py-5 text-right font-bold text-slate-700 text-sm">Total Credit Amount</td>
                    <td className="px-6 py-5 text-right bg-transparent">
                      <span className="font-bold text-slate-800 text-lg bg-transparent">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="bg-transparent"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <AlertTriangle size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rational Intelligence</h3>
            </div>
            <Select 
              options={[
                { label: 'Price Adjustment', value: 'price' },
                { label: 'Return of Goods', value: 'return' },
                { label: 'Promotional Discount', value: 'promo' },
                { label: 'Tax Adjustment', value: 'tax' }
              ]} 
              placeholder="Select Reason"
            />
            <Textarea label="Remarks" placeholder="Internal notes..." rows={4} />
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
             <AlertTriangle size={18} className="text-blue-500 shrink-0" />
             <p className="text-xs text-blue-700 leading-relaxed">
               Applying a credit note will reduce your total outstanding balance with this vendor.
             </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              className="py-6 bg-[#002147] hover:bg-[#003366] text-white rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all font-bold tracking-tight"
            >
              Issue Credit Note
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
