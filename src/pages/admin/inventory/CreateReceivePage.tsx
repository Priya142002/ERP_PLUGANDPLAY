import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Package, 
  Building2, 
  Save, 
  RotateCcw,
  Plus,
  Trash2,
  FileSearch
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";

interface ReceiveItem {
  id: string;
  product: string;
  sku: string;
  expectedQty: number;
  receivedQty: number;
}

export const CreateReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ReceiveItem[]>([
    { id: '1', product: '', sku: 'whp-001', expectedQty: 0, receivedQty: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      product: '', 
      sku: '', 
      expectedQty: 0, 
      receivedQty: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ReceiveItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/inventory/receive')}
            className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Product Receipt</h1>
           
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <FileSearch size={16} />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight text-sm uppercase tracking-wider">Receipt Identification</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Receive No" 
                placeholder="REC-50013" 
                value="REC-50013"
                required 
              />
              <Input 
                label="Receive Date" 
                type="date" 
                value={new Date().toISOString().split('T')[0]}
                leftIcon={<Calendar size={14} />} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Source (Supplier/Warehouse)" 
                placeholder="Select Source"
                options={[
                  { label: 'West Coast Hub (WH)', value: '1' },
                  { label: 'Dell Warehouse (Supplier)', value: '2' },
                  { label: 'Sony Logistics (Supplier)', value: '3' },
                  { label: 'Nike Factory (Supplier)', value: '4' }
                ]} 
                required
              />
              <Select 
                label="Target Warehouse" 
                placeholder="Destination"
                options={[
                  { label: 'Main Warehouse', value: '1' },
                  { label: 'Central Distribution', value: '2' },
                  { label: 'Sub WH-02', value: '3' }
                ]} 
                required
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                  <Package size={16} />
                </div>
                <h3 className="font-bold text-slate-900 tracking-tight text-sm uppercase tracking-wider">Received Items</h3>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={addItem}>
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 w-32">Expected Qty</th>
                    <th className="px-6 py-4 w-32">Received Qty</th>
                    <th className="px-6 py-4 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="px-6 py-4">
                        <Select 
                          placeholder="Search Product"
                          value={item.product}
                          onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                          options={[
                            { label: 'Premium Wireless Headphones', value: '1' },
                            { label: 'Smart Fitness Tracker', value: '2' },
                            { label: '4K Ultra HD Monitor', value: '3' },
                            { label: 'Ergonomic Office Chair', value: '4' }
                          ]}
                        />
                      </td>
                      <td className="px-6 py-4 lowercase tracking-tight">
                        <span className="text-slate-400 text-xs">{item.sku || 'whp-001'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number" 
                          placeholder="0" 
                          value={item.expectedQty || ''}
                          onChange={(e) => updateItem(item.id, 'expectedQty', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number" 
                          placeholder="0" 
                          value={item.receivedQty || ''}
                          onChange={(e) => updateItem(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
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

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Receiver Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                <Building2 size={16} />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight text-sm uppercase tracking-wider">Arrival Info</h3>
            </div>
            <Input 
              label="Received By" 
              placeholder="Full Name" 
              value="John Carter"
            />
            <Input 
              label="Lorry/Vehicle No" 
              placeholder="e.g. ABC-1234" 
            />
          </div>

          {/* Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <Textarea label="Remarks / Observation" placeholder="Add any damages or receipt notes..." rows={4} />
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              className="py-4 bg-[#002147] hover:bg-[#003366] border-none shadow-lg shadow-blue-900/10 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all"
            >
              Finalize Receipt
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={18} />} 
              className="py-4 rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
