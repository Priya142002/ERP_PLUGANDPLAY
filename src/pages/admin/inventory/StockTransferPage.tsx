import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Download, Edit, Trash2, X, Save, Package, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications, useCurrentUser } from "../../../context/AppContext";
import { inventoryApi } from "../../../services/api";
import { exportToExcel } from "../../../utils/reportGenerator";

interface TransferItem { id: string; productId: string; quantity: number; }
interface Transfer { id: string; date: string; referenceNo: string; fromWarehouse: string; toWarehouse: string; totalItems: number; shippingCharge: number; status: string; priority?: string; remarks?: string; items?: TransferItem[]; }

const fieldCls = "w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";
const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const STATUS_OPTIONS = ['Pending', 'Sent', 'Completed', 'Cancelled'];

interface EditModalProps { transfer: Transfer; products: any[]; warehouses: any[]; onClose: () => void; onSave: (t: Transfer) => void; }

const EditTransferModal: React.FC<EditModalProps> = ({ transfer, products, warehouses, onClose, onSave }) => {
  const [form, setForm] = useState<Transfer>({ ...transfer, items: transfer.items || [{ id: '1', productId: '', quantity: 0 }] });
  const set = (k: keyof Transfer, v: any) => setForm(p => ({ ...p, [k]: v }));
  const addItem = () => setForm(p => ({ ...p, items: [...(p.items || []), { id: Date.now().toString(), productId: '', quantity: 0 }] }));
  const removeItem = (id: string) => setForm(p => ({ ...p, items: (p.items || []).filter(i => i.id !== id) }));
  const updateItem = (id: string, k: keyof TransferItem, v: any) => setForm(p => ({ ...p, items: (p.items || []).map(i => i.id === id ? { ...i, [k]: v } : i) }));
  const handleSave = () => { onSave({ ...form, totalItems: (form.items || []).reduce((s, i) => s + i.quantity, 0) }); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl relative max-h-[90vh] flex flex-col overflow-hidden" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl z-10 sticky top-0 flex-shrink-0">
          <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package size={16} /></div><div><h3 className="font-bold text-slate-800 text-base">Edit Transfer</h3><p className="text-[10px] text-slate-400 uppercase tracking-wider">{form.referenceNo}</p></div></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1"><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200"><div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><MapPin size={14} /></div><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Routing</h4></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Reference No</label><input className={fieldCls} value={form.referenceNo} onChange={e => set('referenceNo', e.target.value)} /></div>
                <div><label className={labelCls}>Date</label><div className="relative"><Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="date" className={`${fieldCls} pl-8`} value={form.date} onChange={e => set('date', e.target.value)} /></div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>From WH</label><select className={fieldCls} value={form.fromWarehouse} onChange={e => set('fromWarehouse', e.target.value)}><option value="">Select source…</option>{warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}</select></div>
                <div><label className={labelCls}>To WH</label><select className={fieldCls} value={form.toWarehouse} onChange={e => set('toWarehouse', e.target.value)}><option value="">Select destination…</option>{warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}</select></div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between"><div className="flex items-center gap-2"><div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Package size={14} /></div><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Items</h4></div><button onClick={addItem} className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold">Add Item</button></div>
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-widest"><th className="px-4 py-2.5">Product</th><th className="px-4 py-2.5 w-28">Qty</th><th className="px-4 py-2.5 w-10"></th></tr></thead><tbody className="divide-y divide-slate-200">{form.items?.map(item => (<tr key={item.id} className="bg-white"><td className="px-4 py-2.5"><select className={fieldCls} value={item.productId} onChange={e => updateItem(item.id, 'productId', e.target.value)}><option value="">Select product…</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td><td className="px-4 py-2.5"><input type="number" className={fieldCls} value={item.quantity || ''} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} /></td><td className="px-4 py-2.5 text-center"><button onClick={() => removeItem(item.id)} disabled={form.items?.length === 1} className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition"><Trash2 size={15} /></button></td></tr>))}</tbody></table></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4"><div className="flex items-center gap-2 pb-2 border-b border-slate-200"><h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider text-indigo-600">Financials & Meta</h4></div><div><label className={labelCls}>Shipping Charge (Rs.)</label><input type="number" className={fieldCls} value={form.shippingCharge || ''} onChange={e => set('shippingCharge', parseFloat(e.target.value) || 0)} /></div><div><label className={labelCls}>Priority</label><select className={fieldCls} value={form.priority} onChange={e => set('priority', e.target.value)}><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option></select></div><div><label className={labelCls}>Status</label><select className={fieldCls} value={form.status} onChange={e => set('status', e.target.value)}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div></div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs"><label className={labelCls}>Remarks</label><textarea rows={4} className={`${fieldCls} h-auto py-2.5 resize-none`} value={form.remarks} onChange={e => set('remarks', e.target.value)} /></div>
          </div>
        </div></div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl flex-shrink-0 z-10"><button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button><button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition flex items-center justify-center gap-2"><Save size={14} /> Update Transfer</button></div>
      </motion.div>
    </div>
  );
};

const DeleteModal: React.FC<{ referenceNo: string; onClose: () => void; onConfirm: () => void }> = ({ referenceNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff', opacity: 1 }}><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div><h3 className="font-bold text-slate-800 text-base">Delete Transfer</h3></div><p className="text-sm text-slate-500 mb-6 font-medium">Delete transfer <span className="text-slate-900 font-bold">"{referenceNo}"</span>?</p><div className="flex gap-3"><button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm text-slate-500">Cancel</button><button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-bold">Delete</button></div></motion.div></div>
);

export const StockTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [editTransfer, setEditTransfer] = useState<Transfer | null>(null);
  const [deleteTransfer, setDeleteTransfer] = useState<Transfer | null>(null);
  const [search, setSearch] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadData(); }, [companyId]);
  const loadData = async () => {
    setLoading(true);
    try {
      const [transRes, prodRes, whRes] = await Promise.all([
        inventoryApi.getTransfers(companyId),
        inventoryApi.getProducts(companyId),
        inventoryApi.getWarehouses(companyId)
      ]);
      if (prodRes.success) setProducts(prodRes.data.items || []);
      if (whRes.success) setWarehouses(whRes.data.items || []);
      if (transRes.success) {
        const mapped = (transRes.data.items || []).map((t: any) => ({
          id: t.id.toString(),
          date: t.transferDate?.split('T')[0] || '—',
          referenceNo: `TR-${t.id.toString().padStart(5, '0')}`,
          fromWarehouse: 'Main WH',
          toWarehouse: 'Target WH',
          totalItems: (t.items || []).reduce((s: number, i: any) => s + i.quantity, 0),
          shippingCharge: 0,
          status: 'Pending',
          items: (t.items || []).map((i: any) => ({ id: i.id.toString(), productId: i.productId.toString(), quantity: i.quantity }))
        }));
        setTransfers(mapped);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const displayed = useMemo(() => transfers.filter(t => (!search || t.referenceNo.toLowerCase().includes(search.toLowerCase())) && (!filterFrom || t.fromWarehouse === filterFrom) && (!filterTo || t.toWarehouse === filterTo) && (!filterStatus || t.status === filterStatus)), [transfers, search, filterFrom, filterTo, filterStatus]);
  const fromOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.fromWarehouse))), [transfers]);
  const toOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.toWarehouse))), [transfers]);
  const statusOptions = useMemo(() => Array.from(new Set(transfers.map(t => t.status))), [transfers]);

  const columns = [
    { key: 'referenceNo' as const, label: 'Ref No', render: (v: string) => <span className="font-semibold text-slate-800">{v}</span> },
    { key: 'date' as const, label: 'Date', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><Calendar size={13} className="text-slate-400" />{v}</div> },
    { key: 'fromWarehouse' as const, label: 'From', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold"><MapPin size={13} className="text-rose-400" />{v}</div> },
    { key: 'toWarehouse' as const, label: 'To', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold"><MapPin size={13} className="text-emerald-400" />{v}</div> },
    { key: 'totalItems' as const, label: 'Quantity', align: 'center' as const, render: (v: number) => <span className="font-medium text-slate-700">{v} pcs</span> },
    { key: 'status' as const, label: 'Status', render: (v: string) => <Badge variant={v === 'Completed' ? 'success' : v === 'Pending' ? 'warning' : 'info'}>{v}</Badge> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Transfers</h1>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button variant="secondary" className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-xs font-bold border-slate-200" leftIcon={<Download size={14} />} onClick={() => exportToExcel([{ sheetName: 'Transfers', headers: ['Ref No', 'Date', 'From', 'To', 'Qty', 'Status'], data: displayed.map(t => [t.referenceNo, t.date, t.fromWarehouse, t.toWarehouse, t.totalItems, t.status]) }], 'Stock_Transfers')}>Export</Button>
          <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white shadow-lg rounded-xl px-4 md:px-8 h-10 text-xs font-bold active:scale-95 transition-all" leftIcon={<Plus size={16} />} onClick={() => navigate('/admin/inventory/transfer/create')}>New Transfer</Button>
        </div>
      </div>
      <TableFilters searchValue={search} searchPlaceholder="Search..." onSearchChange={setSearch} filters={[{ label: 'From', value: filterFrom, options: fromOptions, onChange: setFilterFrom }, { label: 'To', value: filterTo, options: toOptions, onChange: setFilterTo }, { label: 'Status', value: filterStatus, options: statusOptions, onChange: setFilterStatus }]} onClearAll={() => { setSearch(''); setFilterFrom(''); setFilterTo(''); setFilterStatus(''); }} showClearButton={!!(search || filterFrom || filterTo || filterStatus)} />
      <DataTableWrapper loading={loading} data={displayed} columns={columns} actions={[{ label: 'Edit', icon: <Edit size={14} />, onClick: setEditTransfer, variant: 'primary' }, { label: 'Delete', icon: <Trash2 size={14} />, onClick: setDeleteTransfer, variant: 'danger' }]} emptyMessage="No transfers found" />
      <AnimatePresence>
        {editTransfer && <EditTransferModal transfer={editTransfer} products={products} warehouses={warehouses} onClose={() => setEditTransfer(null)} onSave={(u) => setTransfers(p => p.map(t => t.id === u.id ? u : t))} />}
        {deleteTransfer && <DeleteModal referenceNo={deleteTransfer.referenceNo} onClose={() => setDeleteTransfer(null)} onConfirm={() => setTransfers(p => p.filter(t => t.id !== deleteTransfer.id))} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default StockTransferPage;
