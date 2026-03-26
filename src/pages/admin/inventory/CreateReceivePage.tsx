import React, { useState, useEffect } from "react";
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
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi } from "../../../services/api";

interface ReceiveItem {
  id: string;
  productId: string;
  expectedQty: number;
  receivedQty: number;
}

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

export const CreateReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [source, setSource] = useState('');
  const [targetWH, setTargetWH] = useState('');
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedBy, setReceivedBy] = useState((currentUser as any)?.fullName || '');
  const [vehicleNo, setVehicleNo] = useState('');
  const [remarks, setRemarks] = useState('');

  const [items, setItems] = useState<ReceiveItem[]>([
    { id: '1', productId: '', expectedQty: 0, receivedQty: 0 }
  ]);

  useEffect(() => {
    fetchInitialData();
  }, [companyId]);

  const fetchInitialData = async () => {
    try {
      const [prodRes, whRes] = await Promise.all([
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId)
      ]);
      if (prodRes.success) setProducts(prodRes.data.items || []);
      if (whRes.success) setWarehouses(whRes.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      productId: '', 
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

  const handleFinalizeReceipt = async () => {
    if (!source || !targetWH || items.some(i => !i.productId || i.receivedQty <= 0)) {
      showNotification({ type: 'error', title: 'Validation', message: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyId,
        receivedFrom: source,
        receiveDate: new Date(receiveDate).toISOString(),
        notes: `${remarks}${vehicleNo ? ` | Vehicle: ${vehicleNo}` : ''} | Received By: ${receivedBy} | Warehouse: ${targetWH}`,
        items: items.map(i => ({
          productId: parseInt(i.productId),
          quantity: i.receivedQty
        }))
      };

      const res = await inventoryApi.createReceive(payload);
      if (res.success) {
        showNotification({ type: 'success', title: 'Success', message: 'Product receipt (GRN) created!' });
        navigate('/admin/inventory/receive');
      } else {
        showNotification({ type: 'error', title: 'Failed', message: res.message || 'Failed to create receipt.' });
      }
    } catch (err) {
      showNotification({ type: 'error', title: 'Error', message: 'Unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
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
              <div>
                <label className={labelCls}>Receive No</label>
                <input className={fieldCls} readOnly placeholder="Auto-generated (REC-...)" />
              </div>
              <div>
                <label className={labelCls}>Receive Date <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" className={`${fieldCls} pl-8`} value={receiveDate} onChange={e => setReceiveDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Source (Supplier/Warehouse) <span className="text-rose-400">*</span></label>
                <input className={fieldCls} placeholder="e.g. Dell Warehouse" value={source} onChange={e => setSource(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Target Warehouse <span className="text-rose-400">*</span></label>
                <select className={fieldCls} value={targetWH} onChange={e => setTargetWH(e.target.value)}>
                  <option value="">Select destination…</option>
                  {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
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
                    <th className="px-6 py-4 text-center">In Stock</th>
                    <th className="px-6 py-4 w-32">Expected Qty</th>
                    <th className="px-6 py-4 w-32">Received Qty</th>
                    <th className="px-6 py-4 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const selProd = products.find(p => p.id === parseInt(item.productId));
                    return (
                      <tr key={item.id} className="group">
                        <td className="px-6 py-4">
                          <select className={fieldCls} value={item.productId} onChange={(e) => updateItem(item.id, 'productId', e.target.value)}>
                            <option value="">Select Product…</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-medium text-slate-500">{selProd ? selProd.stock : '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" className={fieldCls} placeholder="0" 
                            value={item.expectedQty || ''}
                            onChange={(e) => updateItem(item.id, 'expectedQty', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" className={fieldCls} placeholder="0" 
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
                    );
                  })}
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
            <div>
              <label className={labelCls}>Received By</label>
              <input className={fieldCls} placeholder="Full Name" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Lorry/Vehicle No</label>
              <input className={fieldCls} placeholder="e.g. ABC-1234" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <label className={labelCls}>Remarks / Observation</label>
            <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
              placeholder="Add any damages or receipt notes..." value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Save size={18} />} 
              onClick={handleFinalizeReceipt}
              disabled={loading}
              className="py-4 bg-[#002147] hover:bg-[#003366] border-none shadow-lg shadow-blue-900/10 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all"
            >
              {loading ? 'Finalizing...' : 'Finalize Receipt'}
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              leftIcon={<RotateCcw size={18} />} 
              onClick={() => {
                setSource(''); setTargetWH(''); setVehicleNo(''); setRemarks('');
                setItems([{ id: '1', productId: '', expectedQty: 0, receivedQty: 0 }]);
              }}
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

export default CreateReceivePage;
