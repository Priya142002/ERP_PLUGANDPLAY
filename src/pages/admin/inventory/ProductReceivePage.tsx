import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, Building2, X, Save, Package, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableFilters, DataTableWrapper } from "../../../components/common";

// Mock data for Product Receive
const MOCK_RECEIVES = [
  { id: '1', date: '2026-03-16', receiveNo: 'REC-50012', source: 'West Coast Hub', warehouse: 'Main Warehouse', items: 50, receivedBy: 'John Carter', status: 'Completed' },
  { id: '2', date: '2026-03-15', receiveNo: 'REC-50011', source: 'Dell Warehouse', warehouse: 'Central Distribution', items: 120, receivedBy: 'Sarah Doe', status: 'In Transit' },
  { id: '3', date: '2026-03-14', receiveNo: 'REC-50010', source: 'Sony Logistics', warehouse: 'Main Warehouse', items: 34, receivedBy: 'Mike Ross', status: 'Partially Received' },
  { id: '4', date: '2026-03-13', receiveNo: 'REC-50009', source: 'East Terminal', warehouse: 'Sub WH-02', items: 45, receivedBy: 'Rachel Green', status: 'Completed' },
  { id: '5', date: '2026-03-12', receiveNo: 'REC-50008', source: 'Nike Factory', warehouse: 'Main Warehouse', items: 200, receivedBy: 'John Carter', status: 'Pending' },
];

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const PRODUCTS = ['Premium Wireless Headphones', 'Smart Fitness Tracker', '4K Ultra HD Monitor', 'Ergonomic Office Chair'];

interface ReceiveItem {
  id: string;
  product: string;
  sku: string;
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

/* ─────────────────────────────────────────
   Edit Receive Modal
───────────────────────────────────────── */
interface EditModalProps {
  receive: Receive;
  onClose: () => void;
  onSave: (r: Receive) => void;
}

const EditReceiveModal: React.FC<EditModalProps> = ({ receive, onClose, onSave }) => {
  const [form, setForm] = useState<Receive>({ 
    ...receive,
    vehicleNo: receive.vehicleNo || '',
    remarks: receive.remarks || '',
    itemsList: receive.itemsList || [{ id: '1', product: '', sku: 'whp-001', expectedQty: 0, receivedQty: 0 }]
  });
  const set = (k: keyof Receive, v: any) => setForm(p => ({ ...p, [k]: v }));

  const addItem = () => setForm(p => ({ 
    ...p, 
    itemsList: [...(p.itemsList || []), { id: Date.now().toString(), product: '', sku: '', expectedQty: 0, receivedQty: 0 }] 
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

        {/* Header */}
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
            {/* Left Column - Receipt Details & Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Receipt Identification */}
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
                    <input className={fieldCls} value={form.warehouse} onChange={e => set('warehouse', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Received Items */}
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
                        <th className="px-4 py-2.5 w-24">SKU</th>
                        <th className="px-4 py-2.5 w-28">Expected Qty</th>
                        <th className="px-4 py-2.5 w-28">Received Qty</th>
                        <th className="px-4 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(form.itemsList || []).map(item => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                              <option value="">Select product…</option>
                              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-slate-400 text-xs">{item.sku || 'whp-001'}</span>
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

            {/* Right Column - Arrival Info & Other Details */}
            <div className="space-y-6">
              {/* Arrival Info */}
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

              {/* Remarks */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <label className={labelCls}>Remarks / Observation</label>
                <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                  placeholder="Add any damages or receipt notes…" value={form.remarks} onChange={e => set('remarks', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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

/* ─────────────────────────────────────────
   Delete Confirm Modal
───────────────────────────────────────── */
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
          style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
          className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '48px', height: '48px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

export const ProductReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const [receives, setReceives] = useState<Receive[]>(MOCK_RECEIVES);
  const [editReceive, setEditReceive] = useState<Receive | null>(null);
  const [deleteReceive, setDeleteReceive] = useState<Receive | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleSave = (updated: Receive) => setReceives(prev => prev.map(r => r.id === updated.id ? updated : r));
  const handleDelete = (id: string) => setReceives(prev => prev.filter(r => r.id !== id));

  const statusOptions = useMemo(() => Array.from(new Set(receives.map(r => r.status))), [receives]);

  const displayed = useMemo(() => receives.filter(r =>
    (!search || r.receiveNo.toLowerCase().includes(search.toLowerCase()) ||
                r.source.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || r.status === filterStatus)
  ), [receives, search, filterStatus]);

  const handleClearFilters = () => {
    setSearch('');
    setFilterStatus('');
  };

  const columns = [
    {
      key: 'receiveNo' as const,
      label: 'Receive No',
      render: (value: string) => (
        <span className="font-semibold text-slate-800">{value}</span>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'source' as const,
      label: 'Source',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Building2 size={13} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'items' as const,
      label: 'Qty Received',
      align: 'center' as const,
      render: (value: number) => (
        <span className="font-medium text-slate-700">{value} units</span>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (value === 'Completed') variant = 'success';
        if (value === 'In Transit') variant = 'info';
        if (value === 'Pending' || value === 'Partially Received') variant = 'warning';
        
        return <Badge variant={variant}>{value}</Badge>;
      }
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Receiving</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button 
            variant="secondary" 
            className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all border-slate-200"
            leftIcon={<Download size={14} />}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 rounded-xl px-4 md:px-8 h-10 text-[10px] md:text-xs font-bold transition-all active:scale-95"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/admin/inventory/receive/create')}
          >
            New Receipt
          </Button>
        </div>
      </div>
      {/* Search + Filters */}
      <TableFilters
        searchValue={search}
        searchPlaceholder="Search..."
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Filter Status',
            value: filterStatus,
            options: statusOptions,
            onChange: setFilterStatus
          }
        ]}
        onClearAll={handleClearFilters}
        showClearButton={!!(search || filterStatus)}
      />

      {/* Table Section */}
      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          {
            label: 'Edit',
            icon: <Edit size={14} stroke="currentColor" strokeWidth={2} />,
            onClick: (item) => setEditReceive(item),
            variant: 'primary',
            title: 'Edit'
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} stroke="currentColor" strokeWidth={2} />,
            onClick: (item) => setDeleteReceive(item),
            variant: 'danger',
            title: 'Delete'
          }
        ]}
        emptyMessage="No receipts found"
      />

      {/* Modals */}
      <AnimatePresence>
        {editReceive && (
          <EditReceiveModal
            key="edit"
            receive={editReceive}
            onClose={() => setEditReceive(null)}
            onSave={handleSave}
          />
        )}
        {deleteReceive && (
          <DeleteModal
            key="delete"
            receiveNo={deleteReceive.receiveNo}
            onClose={() => setDeleteReceive(null)}
            onConfirm={() => handleDelete(deleteReceive.id)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
