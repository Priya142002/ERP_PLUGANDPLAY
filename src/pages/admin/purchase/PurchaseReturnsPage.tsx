import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Download, Edit, Trash2, Calendar, FileText,
  AlertTriangle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

interface PReturn {
  id: string; date: string; returnNo: string; invoiceNo: string;
  vendor: string; amount: number; reason: string; status: string;
}

const MOCK_RETURNS: PReturn[] = [
  { id: '1', date: '2026-03-10', returnNo: 'PRET-5001', invoiceNo: 'PINV-2026-001', vendor: 'TechNova Solutions', amount: 450.00,  reason: 'Damaged Items',       status: 'Completed'  },
  { id: '2', date: '2026-03-08', returnNo: 'PRET-5002', invoiceNo: 'PINV-2026-004', vendor: 'Vertex Industries',  amount: 1200.00, reason: 'Wrong Specification', status: 'Processing' },
  { id: '3', date: '2026-03-05', returnNo: 'PRET-5003', invoiceNo: 'PINV-2026-012', vendor: 'Office Essentials',  amount: 85.00,   reason: 'Duplicate Order',     status: 'Completed'  },
];

const TABS = ['All Returns', 'Completed', 'Processing', 'Disputed'] as const;
type Tab = typeof TABS[number];

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ returnNo: string; onClose: () => void; onConfirm: () => void }> = ({ returnNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Return</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{returnNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

/* ── Main Page ── */
export const PurchaseReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState<PReturn[]>(MOCK_RETURNS);
  const [activeTab, setActiveTab] = useState<Tab>('All Returns');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteReturn, setDeleteReturn] = useState<PReturn | null>(null);

  const vendorOptions = useMemo(() => Array.from(new Set(returns.map(r => r.vendor))), [returns]);

  const displayed = useMemo(() => {
    let list = [...returns];
    if (activeTab === 'Completed')  list = list.filter(r => r.status === 'Completed');
    if (activeTab === 'Processing') list = list.filter(r => r.status === 'Processing');
    if (search) list = list.filter(r =>
      r.returnNo.toLowerCase().includes(search.toLowerCase()) ||
      r.vendor.toLowerCase().includes(search.toLowerCase()) ||
      r.invoiceNo.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(r => r.vendor === filterVendor);
    if (filterStatus) list = list.filter(r => r.status === filterStatus);
    return list;
  }, [returns, activeTab, search, filterVendor, filterStatus]);

  const handleDelete = (id: string) =>
    setReturns(prev => prev.filter(r => r.id !== id));

  const columns = [
    {
      key: 'returnNo' as const, label: 'Return No',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'date' as const, label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'invoiceNo' as const, label: 'Ref Invoice',
      render: (val: string) => (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <FileText size={11} /> {val}
        </div>
      )
    },
    {
      key: 'vendor' as const, label: 'Vendor',
      render: (value: string) => <span className="text-sm text-slate-600 font-medium">{value}</span>
    },
    {
      key: 'amount' as const, label: 'Return Amount', align: 'right' as const,
      render: (val: number) => <span className="font-bold text-rose-600">-${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const, label: 'Status',
      render: (value: string) => value === 'Completed' ? (
        <div className="flex items-center gap-1.5 text-blue-600">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-amber-600">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
        </div>
      )
    }
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Return</h1>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export</Button>
            <Button variant="primary"
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate('/admin/purchase/returns/new')}>
              New Return
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
                activeTab === tab ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <TableFilters
          searchValue={search}
          searchPlaceholder="Search return no, invoice or vendor..."
          onSearchChange={setSearch}
          filters={[
            { label: 'Filter by Vendor', value: filterVendor, options: vendorOptions, onChange: setFilterVendor },
            { label: 'Filter by Status', value: filterStatus, options: ['Completed', 'Processing'], onChange: setFilterStatus }
          ]}
          onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
          showClearButton={!!(search || filterVendor || filterStatus)}
        />

        <DataTableWrapper
          data={displayed}
          columns={columns}
          actions={[
            { label: 'Edit', icon: <Edit size={14} />, onClick: item => navigate(`/admin/purchase/returns/${item.id}/edit`), variant: 'primary', title: 'Edit' },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: item => setDeleteReturn(item), variant: 'danger', title: 'Delete' }
          ]}
          emptyMessage="No returns found"
        />
      </motion.div>

      <AnimatePresence>
        {deleteReturn && (
          <DeleteModal key="delete" returnNo={deleteReturn.returnNo} onClose={() => setDeleteReturn(null)} onConfirm={() => handleDelete(deleteReturn.id)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseReturnsPage;
