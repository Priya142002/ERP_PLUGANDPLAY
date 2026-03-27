import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useCurrentUser } from "../../../context/AppContext";
import { inventoryApi, salesApi } from "../../../services/api";
import { exportToExcel } from "../../../utils/reportGenerator";

interface DispatchItem { id: string; productId: string; warehouseId: string; qty: number; }
interface Dispatch {
  id: string;
  date: string;
  dispatchNo: string;
  customer: string;
  customerId: string;
  sourceWH: string;
  carrier: string;
  tracking: string;
  notes: string;
  items: DispatchItem[];
  itemCount: number;
  status: string;
}





const DeleteModal: React.FC<{ dispatchNo: string; onClose: () => void; onConfirm: () => void }> = ({ dispatchNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
      <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div><h3 className="font-bold text-slate-800">Delete</h3></div>
      <p className="text-sm text-slate-500 mb-6">Delete <span className="font-semibold text-slate-700">"{dispatchNo}"</span>?</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm text-slate-500">Cancel</button>
        <button onClick={onConfirm} className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-semibold">Delete</button>
      </div>
    </motion.div>
  </div>
);

export const MaterialDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const companyId = parseInt((currentUser as any)?.companyId || '1');
  const [loading, setLoading] = useState(false);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [deleteDispatch, setDeleteDispatch] = useState<Dispatch | null>(null);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [allCustomers, setAllCustomers] = useState<any[]>([]);

  useEffect(() => { loadData(); }, [companyId]);
  const loadData = async () => {
    setLoading(true);
    try {
      const [dispRes, custRes] = await Promise.all([
        inventoryApi.getDispatches(companyId),
        salesApi.getCustomers(companyId)
      ]);

      if (custRes.success) setAllCustomers(custRes.data.items || custRes.data || []);

      if (dispRes.success) {
        const list = dispRes.data.items || dispRes.data || [];
        const mapped = list.map((d: any) => ({
          id: d.id.toString(),
          date: d.dispatchDate?.split('T')[0] || '—',
          dispatchNo: d.dispatchNumber || `DSP-${d.id.toString().padStart(5, '0')}`,
          customer: d.dispatchedTo || 'Unknown Customer',
          customerId: d.customerId?.toString() || '',
          sourceWH: d.notes?.split('Source: ')[1]?.split('|')[0]?.trim() || 'Warehouse',
          carrier: d.notes?.split('Carrier: ')[1]?.split('|')[0]?.trim() || 'N/A',
          tracking: d.trackingNumber || '',
          notes: d.notes || '',
          itemCount: (d.items || []).reduce((s: number, i: any) => s + (i.quantity || 0), 0),
          status: d.status || 'Dispatched',
          items: (d.items || []).map((i: any) => ({ 
            id: (i.id || i.productId || Math.random()).toString(), 
            productId: (i.productId || '').toString(), 
            productName: i.productName || '',
            qty: i.quantity || 0 
          }))
        }));
        setDispatches(mapped);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const displayed = useMemo(() => dispatches.filter(d => (!search || d.dispatchNo.toLowerCase().includes(search.toLowerCase()) || d.customer.toLowerCase().includes(search.toLowerCase())) && (!filterCustomer || d.customer === filterCustomer)), [dispatches, search, filterCustomer]);
  const customerOptions = useMemo(() => Array.from(new Set(allCustomers.map(c => c.name))), [allCustomers]);

  const columns = [
    { 
      key: 'dispatchNo' as const, 
      label: 'Dispatch No', 
      render: (v: string, item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{v}</span>
          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
            {item.items?.map((i: any) => i.productName || i.productId).join(', ') || 'No items'}
          </span>
        </div>
      )
    },
    { key: 'date' as const, label: 'Date', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><Calendar size={13} className="text-slate-400" />{v}</div> },
    { key: 'customer' as const, label: 'Customer', render: (v: string) => <div className="flex items-center gap-2 text-slate-600 text-sm"><User size={13} className="text-slate-400" />{v}</div> },
    { key: 'itemCount' as const, label: 'Items Qty', align: 'center' as const, render: (v: number) => <span className="font-medium text-slate-700">{v} units</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Material Dispatch</h1>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button variant="secondary" className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-xs font-bold border-slate-200" leftIcon={<Download size={14} />} onClick={() => exportToExcel([{ sheetName: 'Dispatches', headers: ['No', 'Date', 'Customer', 'Qty'], data: displayed.map(d => [d.dispatchNo, d.date, d.customer, d.itemCount]) }], 'Dispatch_Mar_2026')}>Export</Button>
          <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white shadow-lg rounded-xl px-4 md:px-8 h-10 text-xs font-bold transition-all" leftIcon={<Plus size={16} />} onClick={() => navigate('/admin/inventory/dispatch/create')}>Create Dispatch</Button>
        </div>
      </div>
      <TableFilters searchValue={search} searchPlaceholder="Search..." onSearchChange={setSearch} filters={[{ label: 'Filter Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer }]} onClearAll={() => { setSearch(''); setFilterCustomer(''); }} showClearButton={!!(search || filterCustomer)} />
      <DataTableWrapper loading={loading} data={displayed} columns={columns} actions={[{ label: 'Edit', icon: <Edit size={14} />, onClick: (d) => navigate(`/admin/inventory/dispatch/edit/${d.id}`), variant: 'primary' }, { label: 'Delete', icon: <Trash2 size={14} />, onClick: setDeleteDispatch, variant: 'danger' }]} emptyMessage="No dispatches found" />
      <AnimatePresence>
        {deleteDispatch && (
          <DeleteModal dispatchNo={deleteDispatch.dispatchNo} onClose={() => setDeleteDispatch(null)} onConfirm={() => setDispatches(p => p.filter(d => d.id !== deleteDispatch.id))} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MaterialDispatchPage;
