import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_JOURNALS = [
  { id: '1', date: '2026-03-15', voucherNo: 'JV-30201', reference: 'ADJ/2026/01', totalAmount: 1200.00, createdBy: 'Admin', status: 'Authorized', description: 'Depreciation adjustment for Q1' },
  { id: '2', date: '2026-03-14', voucherNo: 'JV-30202', reference: 'TX-OFF-11', totalAmount: 450.00, createdBy: 'Admin', status: 'Pending', description: 'Internal account transfer' },
  { id: '3', date: '2026-03-12', voucherNo: 'JV-30203', reference: 'RE-CLS-04', totalAmount: 2850.00, createdBy: 'Finance Lead', status: 'Authorized', description: 'Year-end closing entry' },
];

const TABS = ['All Entries', 'Approved', 'Pending Approval', 'Adjustment Type'] as const;
type Tab = typeof TABS[number];

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ voucherNo: string; onClose: () => void; onConfirm: () => void }> = ({ voucherNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Journal Voucher</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{voucherNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

export const JournalVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState(MOCK_JOURNALS);
  const [activeTab, setActiveTab] = useState<Tab>('All Entries');
  const [search, setSearch] = useState('');
  const [filterReference, setFilterReference] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteJournal, setDeleteJournal] = useState<typeof MOCK_JOURNALS[0] | null>(null);

  const referenceOptions = useMemo(() => Array.from(new Set(journals.map(j => j.reference))), [journals]);

  const displayed = useMemo(() => {
    let list = [...journals];
    if (activeTab === 'Approved') list = list.filter(j => j.status === 'Authorized');
    if (activeTab === 'Pending Approval') list = list.filter(j => j.status === 'Pending');
    if (search) list = list.filter(j =>
      j.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      j.reference.toLowerCase().includes(search.toLowerCase())
    );
    if (filterReference) list = list.filter(j => j.reference === filterReference);
    if (filterStatus) list = list.filter(j => j.status === filterStatus);
    return list;
  }, [journals, activeTab, search, filterReference, filterStatus]);

  const handleDelete = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
  };

  const columns = [
    {
      key: 'voucherNo' as const,
      label: 'Voucher #',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
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
      key: 'reference' as const,
      label: 'Reference',
      render: (val: string) => <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{val}</span>
    },
    {
      key: 'totalAmount' as const,
      label: 'Total Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Authorized') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Authorized</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
          </div>
        );
      }
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Journal Vouchers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/accounts/journal/create')}
          >
            New Entry
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
        searchPlaceholder="Search..."
        onSearchChange={setSearch}
        filters={[
          { label: 'Filter Reference', value: filterReference, options: referenceOptions, onChange: setFilterReference },
          { label: 'Filter Status', value: filterStatus, options: ['Authorized', 'Pending'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterReference(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterReference || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: (item) => navigate('/admin/accounts/journal/create'), variant: 'primary', title: 'Edit' },
          { label: 'Void', icon: <Trash2 size={14} />, onClick: (item) => setDeleteJournal(item), variant: 'danger', title: 'Void' }
        ]}
        emptyMessage="No journal vouchers found"
      />

      <AnimatePresence>
        {deleteJournal && (
          <DeleteModal 
            key="delete" 
            voucherNo={deleteJournal.voucherNo} 
            onClose={() => setDeleteJournal(null)} 
            onConfirm={() => handleDelete(deleteJournal.id)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
const PencilAlt = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
