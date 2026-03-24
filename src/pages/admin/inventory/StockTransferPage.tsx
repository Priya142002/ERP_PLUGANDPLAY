import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Download, Edit, Trash2, X, Save, Package, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications } from "../../../context/AppContext";
import { exportToExcel } from "../../../utils/reportGenerator";

// Mock data for stock transfers
const MOCK_TRANSFERS = [
  { id: '1', date: '2026-03-15', referenceNo: 'TR-2026-001', fromWarehouse: 'Main Warehouse', toWarehouse: 'West Coast Hub', totalItems: 50, shippingCharge: 120.00, status: 'Completed' },
  { id: '2', date: '2026-03-14', referenceNo: 'TR-2026-002', fromWarehouse: 'Central Distribution', toWarehouse: 'Main Warehouse', totalItems: 100, shippingCharge: 250.00, status: 'Pending' },
  { id: '3', date: '2026-03-12', referenceNo: 'TR-2026-003', fromWarehouse: 'West Coast Hub', toWarehouse: 'South Export Terminal', totalItems: 30, shippingCharge: 85.50, status: 'Sent' },
  { id: '4', date: '2026-03-10', referenceNo: 'TR-2026-004', fromWarehouse: 'East Logistics Center', toWarehouse: 'Central Distribution', totalItems: 75, shippingCharge: 180.00, status: 'Completed' },
  { id: '5', date: '2026-03-08', referenceNo: 'TR-2026-005', fromWarehouse: 'Main Warehouse', toWarehouse: 'East Logistics Center', totalItems: 40, shippingCharge: 95.00, status: 'Completed' },
];

const selCls = "h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-600";
const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const WAREHOUSES = ['Main Warehouse', 'West Coast Hub', 'Central Distribution', 'South Export Terminal', 'East Logistics Center'];
const STATUS_OPTIONS = ['Pending', 'Sent', 'Completed', 'Cancelled'];
const PRODUCTS = ['Premium Wireless Headphones', 'Smart Fitness Tracker', '4K Ultra HD Monitor', 'Ergonomic Office Chair', 'Mechanical Keyboard'];

interface TransferItem {
  id: string;
  product: string;
  sku: string;
  inStock: number;
  quantity: number;
}

interface Transfer {
  id: string;
  date: string;
  referenceNo: string;
  fromWarehouse: string;
  toWarehouse: string;
  totalItems: number;
  shippingCharge: number;
  status: string;
  priority?: string;
  remarks?: string;
  items?: TransferItem[];
}

/* ─────────────────────────────────────────
   Edit Transfer Modal
───────────────────────────────────────── */
interface EditModalProps {
  transfer: Transfer;
  onClose: () => void;
  onSave: (t: Transfer) => void;
}

const EditTransferModal: React.FC<EditModalProps> = ({ transfer, onClose, onSave }) => {
  const [form, setForm] = useState<Transfer>({ 
    ...transfer, 
    priority: transfer.priority || 'Normal',
    remarks: transfer.remarks || '',
    items: transfer.items || [{ id: '1', product: '', sku: '', inStock: 0, quantity: 0 }]
  });
  const set = (k: keyof Transfer, v: any) => setForm(p => ({ ...p, [k]: v }));

  const addItem = () => setForm(p => ({ 
    ...p, 
    items: [...(p.items || []), { id: Date.now().toString(), product: '', sku: '', inStock: 0, quantity: 0 }] 
  }));
  
  const removeItem = (id: string) => setForm(p => ({ 
    ...p, 
    items: (p.items || []).filter(i => i.id !== id) 
  }));
  
  const updateItem = (id: string, k: keyof TransferItem, v: any) =>
    setForm(p => ({ 
      ...p, 
      items: (p.items || []).map(i => i.id === id ? { ...i, [k]: v } : i) 
    }));

  const handleSave = () => {
    const totalItems = (form.items || []).reduce((sum, item) => sum + item.quantity, 0);
    onSave({ ...form, totalItems });
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
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package size={16} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Stock Transfer</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.referenceNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Transfer Routing */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transfer Routing */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><MapPin size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Transfer Routing</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Reference No</label>
                    <input className={fieldCls} value={form.referenceNo} onChange={e => set('referenceNo', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Transfer Date</label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" className={`${fieldCls} pl-8`} value={form.date} onChange={e => set('date', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>From Warehouse <span className="text-rose-400">*</span></label>
                    <select className={fieldCls} value={form.fromWarehouse} onChange={e => set('fromWarehouse', e.target.value)}>
                      <option value="">Select warehouse…</option>
                      {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>To Warehouse <span className="text-rose-400">*</span></label>
                    <select className={fieldCls} value={form.toWarehouse} onChange={e => set('toWarehouse', e.target.value)}>
                      <option value="">Select warehouse…</option>
                      {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Transfer Items */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Package size={14} /></div>
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Transfer Items</h4>
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
                        <th className="px-4 py-2.5">Product Name</th>
                        <th className="px-4 py-2.5 w-28">SKU</th>
                        <th className="px-4 py-2.5 w-24 text-center">In Stock</th>
                        <th className="px-4 py-2.5 w-28">Transfer Qty</th>
                        <th className="px-4 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(form.items || []).map(item => (
                        <tr key={item.id} className="bg-white">
                          <td className="px-4 py-2.5">
                            <select className={fieldCls} value={item.product} onChange={e => updateItem(item.id, 'product', e.target.value)}>
                              <option value="">Select product…</option>
                              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <input className={fieldCls} placeholder="—" value={item.sku} readOnly />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-sm text-slate-600">—</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <input type="number" min={0} className={fieldCls} placeholder="0"
                              value={item.quantity || ''} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => removeItem(item.id)} disabled={(form.items || []).length === 1}
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

            {/* Right Column - Other Details */}
            <div className="space-y-6">
              {/* Other Details */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Package size={14} /></div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Other Details</h4>
                </div>

                <div>
                  <label className={labelCls}>Shipping Charge ($)</label>
                  <input type="number" min={0} step="0.01" className={fieldCls} placeholder="0.00"
                    value={form.shippingCharge || ''} onChange={e => set('shippingCharge', parseFloat(e.target.value) || 0)} />
                </div>

                <div>
                  <label className={labelCls}>Transfer Priority</label>
                  <select className={fieldCls} value={form.priority} onChange={e => set('priority', e.target.value)}>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <label className={labelCls}>Remarks</label>
                <textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`}
                  placeholder="Internal notes for this transfer…" value={form.remarks} onChange={e => set('remarks', e.target.value)} />
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
            <Save size={14} /> Update Transfer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Delete Confirm Modal
───────────────────────────────────────── */
const DeleteModal: React.FC<{ referenceNo: string; onClose: () => void; onConfirm: () => void }> = ({ referenceNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Transfer</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{referenceNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} 
          style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition flex items-center justify-center">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '40px', height: '40px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

export const StockTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [transfers, setTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
  const [editTransfer, setEditTransfer] = useState<Transfer | null>(null);
  const [deleteTransfer, setDeleteTransfer] = useState<Transfer | null>(null);
  const [search, setSearch] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleSave = (updated: Transfer) => setTransfers(prev => prev.map(t => t.id === updated.id ? updated : t));
  const handleDelete = (id: string) => setTransfers(prev => prev.filter(t => t.id !== id));

  const handleExportExcel = () => {
    try {
      const excelData = [
        {
          sheetName: 'Stock Transfers',
          headers: ['Ref No', 'Date', 'From', 'To', 'Quantity', 'Status'],
          data: displayed.map(t => [
            t.referenceNo,
            t.date,
            t.fromWarehouse,
            t.toWarehouse,
            `${t.totalItems} pcs`,
            t.status
          ])
        }
      ];
      exportToExcel(excelData, 'Stock_Transfers');
      
      showNotification({
        type: 'success',
        title: 'Excel Downloaded',
        message: 'Stock transfer data has been exported to Excel successfully.',
        duration: 3000
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export stock transfer data to Excel.',
        duration: 5000
      });
    }
  };

  const fromOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.fromWarehouse))), [transfers]);
  const toOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.toWarehouse))), [transfers]);
  const statusOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.status))), [transfers]);

  const displayed = useMemo(() => transfers.filter(t =>
    (!search || t.referenceNo.toLowerCase().includes(search.toLowerCase())) &&
    (!filterFrom || t.fromWarehouse === filterFrom) &&
    (!filterTo || t.toWarehouse === filterTo) &&
    (!filterStatus || t.status === filterStatus)
  ), [transfers, search, filterFrom, filterTo, filterStatus]);

  const handleClearFilters = () => {
    setSearch('');
    setFilterFrom('');
    setFilterTo('');
    setFilterStatus('');
  };

  const columns = [
    {
      key: 'referenceNo' as const,
      label: 'Ref No',
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
      key: 'fromWarehouse' as const,
      label: 'From',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={13} className="text-rose-400" />
          {value}
        </div>
      )
    },
    {
      key: 'toWarehouse' as const,
      label: 'To',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={13} className="text-emerald-400" />
          {value}
        </div>
      )
    },
    {
      key: 'totalItems' as const,
      label: 'Quantity',
      align: 'center' as const,
      render: (value: number) => (
        <span className="font-medium text-slate-700">{value} pcs</span>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Completed' ? 'success' : 
          value === 'Pending' ? 'warning' : 
          value === 'Sent' ? 'info' : 'default'
        }>
          {value}
        </Badge>
      )
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Transfers</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button 
            onClick={handleExportExcel}
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
            onClick={() => navigate('/admin/inventory/transfer/create')}
          >
            New Transfer
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
            label: 'Filter From',
            value: filterFrom,
            options: fromOptions,
            onChange: setFilterFrom
          },
          {
            label: 'Filter To',
            value: filterTo,
            options: toOptions,
            onChange: setFilterTo
          },
          {
            label: 'Filter Status',
            value: filterStatus,
            options: statusOptions,
            onChange: setFilterStatus
          }
        ]}
        onClearAll={handleClearFilters}
        showClearButton={!!(search || filterFrom || filterTo || filterStatus)}
      />

      {/* Table Section */}
      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          {
            label: 'Edit',
            icon: <Edit size={14} stroke="currentColor" strokeWidth={2} />,
            onClick: (item) => setEditTransfer(item),
            variant: 'primary',
            title: 'Edit'
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} stroke="currentColor" strokeWidth={2} />,
            onClick: (item) => setDeleteTransfer(item),
            variant: 'danger',
            title: 'Delete'
          }
        ]}
        emptyMessage="No transfers found"
      />

      {/* Modals */}
      <AnimatePresence>
        {editTransfer && (
          <EditTransferModal
            key="edit"
            transfer={editTransfer}
            onClose={() => setEditTransfer(null)}
            onSave={handleSave}
          />
        )}
        {deleteTransfer && (
          <DeleteModal
            key="delete"
            referenceNo={deleteTransfer.referenceNo}
            onClose={() => setDeleteTransfer(null)}
            onConfirm={() => handleDelete(deleteTransfer.id)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

