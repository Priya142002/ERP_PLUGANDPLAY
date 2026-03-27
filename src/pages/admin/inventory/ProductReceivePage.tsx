import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, Building2, X, Save, Package, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi } from "../../../services/api";
import { exportToExcel } from "../../../utils/reportGenerator";

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

interface ReceiveItem {
  id: string;
  productId: string;
  expectedQty: number;
  receivedQty: number;
}

interface Receive {
  id: string;
  date: string;
  receiveNo: string;
  source: string;
  warehouse: string;
  items: number;
  receivedBy: string;
  status: string;
  vehicleNo?: string;
  remarks?: string;
  itemsList?: ReceiveItem[];
}

interface EditModalProps {
  receive: Receive;
  products: any[];
  warehouses: any[];
  onClose: () => void;
  onSave: (r: Receive) => void;
}

const EditReceiveModal: React.FC<EditModalProps> = ({ receive, products, warehouses, onClose, onSave }) => {
  const [form, setForm] = useState<Receive>({ 
    ...receive,
    vehicleNo: receive.vehicleNo || '',
    remarks: receive.remarks || '',
    itemsList: receive.itemsList || [{ id: '1', productId: '', expectedQty: 0, receivedQty: 0 }]
  });
  const set = (k: keyof Receive, v: any) => setForm(p => ({ ...p, [k]: v }));

  const addItem = () => setForm(p => ({ 
    ...p, 
    itemsList: [...(p.itemsList || []), { id: Date.now().toString(), productId: '', expectedQty: 0, receivedQty: 0 }] 
  }));
  
  const removeItem = (id: string) => setForm(p => ({ 
    ...p, 
    itemsList: (p.itemsList || []).filter(i => i.id !== id) 
  }));
  
  const updateItem = (id: string, k: keyof ReceiveItem, v: any) =>
    setForm(p => ({ 
      ...p, 
      itemsList: (p.itemsList || []).map(i => i.id === id ? { ...i, [k]: v } : i) 
    }));

  const handleSave = () => {
    const totalItems = (form.itemsList || []).reduce((sum, item) => sum + item.receivedQty, 0);
    onSave({ ...form, items: totalItems });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl relative max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#ffffff', opacity: 1 }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Package size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Product Receipt</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.receiveNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Package size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Receipt Identification</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Receive No <span className="text-rose-400">*</span></label>
                    <input className={fieldCls} value={form.receiveNo} onChange={e => set('receiveNo', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Receive Date <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" className={`${fieldCls} pl-8`} value={form.date} onChange={e => set('date', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Source (Supplier/Warehouse) <span className="text-rose-400">*</span></label>
                    <input className={fieldCls} value={form.source} onChange={e => set('source', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Target Warehouse <span className="text-rose-400">*</span></label>
                    <select className={fieldCls} value={form.warehouse} onChange={e => set('warehouse', e.target.value)}>
                      <option value="">Select destination…</option>
                      {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Package size={14} /></div>
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Received Items</h4>
                  </div>
                  <button onClick={addItem}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition">
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-4 py-2.5">Product</th>
                        <th className="px-4 py-2.5 w-28">Expected Qty</th>
                        <th className="px-4 py-2.5 w-28">Received Qty</th>
                        <th className="px-4 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(form.itemsList || []).map(item => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.productId} onChange={e => updateItem(item.id, 'productId', e.target.value)}>
                              <option value="">Select product…</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <input type="number" min={0} className={fieldCls} placeholder="0"
                              value={item.expectedQty || ''} onChange={e => updateItem(item.id, 'expectedQty', parseInt(e.target.value) || 0)} />
                          </td>
                          <td className="px-4 py-2.5">
                            <input type="number" min={0} className={fieldCls} placeholder="0"
                              value={item.receivedQty || ''} onChange={e => updateItem(item.id, 'receivedQty', parseInt(e.target.value) || 0)} />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => removeItem(item.id)} disabled={(form.itemsList || []).length === 1}
                              className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition">
                              <Trash2 size={15} />
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
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600"><Building2 size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Arrival Info</h4>
                </div>

                <div>
                  <label className={labelCls}>Received By</label>
                  <input className={fieldCls} placeholder="Full Name" value={form.receivedBy} onChange={e => set('receivedBy', e.target.value)} />
                </div>

                <div>
                  <label className={labelCls}>Lorry/Vehicle No</label>
                  <input className={fieldCls} placeholder="e.g. ABC-1234" value={form.vehicleNo} onChange={e => set('vehicleNo', e.target.value)} />
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Partially Received">Partially Received</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <label className={labelCls}>Remarks / Observation</label>
                <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                  placeholder="Add any damages or receipt notes…" value={form.remarks} onChange={e => set('remarks', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl sticky bottom-0">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2">
            <Save size={14} /> Update Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteModal: React.FC<{ receiveNo: string; onClose: () => void; onConfirm: () => void }> = ({ receiveNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Receipt</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{receiveNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} 
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

export const ProductReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [receives, setReceives] = useState<Receive[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [editReceive, setEditReceive] = useState<Receive | null>(null);
  const [deleteReceive, setDeleteReceive] = useState<Receive | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchReceives();
  }, [companyId]);

  const fetchReceives = async () => {
    setLoading(true);
    try {
      const [recRes, prodRes, whRes] = await Promise.all([
        inventoryApi.getReceives(companyId),
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId)
      ]);

      if (prodRes.success) setProducts(prodRes.data.items || []);
      if (whRes.success) setWarehouses(whRes.data.items || []);

      if (recRes.success) {
        const mapped = (recRes.data.items || []).map((r: any) => ({
          id: r.id.toString(),
          date: r.receiveDate ? r.receiveDate.split('T')[0] : '—',
          receiveNo: `REC-${r.id.toString().padStart(5, '0')}`,
          source: r.receivedFrom,
          warehouse: 'Target WH',
          items: (r.items || []).reduce((sum: number, i: any) => sum + i.quantity, 0),
          receivedBy: 'System',
          status: 'Completed'
        }));
        setReceives(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (updated: Receive) => setReceives(prev => prev.map(r => r.id === updated.id ? updated : r));
  const handleDelete = (id: string) => setReceives(prev => prev.filter(r => r.id !== id));

  const handleExportExcel = () => {
    try {
      const exportData = displayed.map(receive => [
        receive.receiveNo, receive.date, receive.source, receive.warehouse, receive.items, receive.status
      ]);
      exportToExcel(
        [{ sheetName: 'Product Receiving', headers: ['Receive No', 'Date', 'Source', 'Warehouse', 'Qty Received', 'Status'], data: exportData }],
        'Product_Receiving'
      );
      showNotification({ type: 'success', title: 'Excel Downloaded', message: 'Product receiving data exported successfully' });
    } catch (error) {
      showNotification({ type: 'error', title: 'Export Failed', message: 'Failed to export Excel file' });
    }
  };

  const statusOptions = useMemo(() => Array.from(new Set(receives.map(r => r.status))), [receives]);

  const displayed = useMemo(() => receives.filter(r =>
    (!search || r.receiveNo.toLowerCase().includes(search.toLowerCase()) || r.source.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || r.status === filterStatus)
  ), [receives, search, filterStatus]);

  const handleClearFilters = () => { setSearch(''); setFilterStatus(''); };

  const columns = [
    { key: 'receiveNo' as const, label: 'Receive No', render: (value: string) => <span className="font-semibold text-slate-800">{value}</span> },
    { key: 'date' as const, label: 'Date', render: (value: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><Calendar size={13} className="text-slate-400" />{value}</div> },
    { key: 'source' as const, label: 'Source', render: (value: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><Building2 size={13} className="text-slate-400" />{value}</div> },
    { key: 'items' as const, label: 'Qty Received', align: 'center' as const, render: (value: number) => <span className="font-medium text-slate-700">{value} units</span> },
    { key: 'status' as const, label: 'Status', render: (value: string) => {
      let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
      if (value === 'Completed') variant = 'success';
      if (value === 'In Transit') variant = 'info';
      if (value === 'Pending' || value === 'Partially Received') variant = 'warning';
      return <Badge variant={variant}>{value}</Badge>;
    }}
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Receiving</h1></div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button variant="secondary" className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all border-slate-200"
            leftIcon={<Download size={14} />} onClick={handleExportExcel}>Export</Button>
          <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 rounded-xl px-4 md:px-8 h-10 text-[10px] md:text-xs font-bold transition-all active:scale-95"
            leftIcon={<Plus size={16} />} onClick={() => navigate('/admin/inventory/receive/create')}>New Receive</Button>
        </div>
      </div>
      <TableFilters searchValue={search} searchPlaceholder="Search..." onSearchChange={setSearch} filters={[{ label: 'Filter Status', value: filterStatus, options: statusOptions, onChange: setFilterStatus }]} onClearAll={handleClearFilters} showClearButton={!!(search || filterStatus)} />
      <DataTableWrapper loading={loading} data={displayed} columns={columns} actions={[{ label: 'Edit', icon: <Edit size={14} />, onClick: (item) => setEditReceive(item), variant: 'primary', title: 'Edit' }, { label: 'Delete', icon: <Trash2 size={14} />, onClick: (item) => setDeleteReceive(item), variant: 'danger', title: 'Delete' }]} emptyMessage="No receipts found" />
      <AnimatePresence>
        {editReceive && <EditReceiveModal key="edit" receive={editReceive} products={products} warehouses={warehouses} onClose={() => setEditReceive(null)} onSave={handleSave} />}
        {deleteReceive && <DeleteModal key="delete" receiveNo={deleteReceive.receiveNo} onClose={() => setDeleteReceive(null)} onConfirm={() => handleDelete(deleteReceive.id)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductReceivePage;
