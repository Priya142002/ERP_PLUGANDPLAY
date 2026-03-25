import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

const MOCK_RECEIPTS = [
  { id: '1', date: '2026-03-16', voucherNo: 'RV-10201', receivedFrom: 'Nexus Enterprises', account: 'Accounts Receivable', amount: 13020.00, method: 'Bank Transfer', status: 'Recognized' },
  { id: '2', date: '2026-03-16', voucherNo: 'RV-10202', receivedFrom: 'Sarah Johnson', account: 'Accounts Receivable', amount: 893.03, method: 'Online Payment', status: 'Uncleared' },
  { id: '3', date: '2026-03-15', voucherNo: 'RV-10203', receivedFrom: 'Urban Styles', account: 'Accounts Receivable', amount: 3045.00, method: 'Cash', status: 'Recognized' },
  { id: '4', date: '2026-03-14', voucherNo: 'RV-10204', receivedFrom: 'Global Trade Corp', account: 'Accounts Receivable', amount: 4410.00, method: 'Cheque', status: 'Recognized' },
];

const TABS = ['All Receipts', 'Recognized', 'Uncleared', 'Returned'] as const;
type Tab = typeof TABS[number];

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ voucherNo: string; onClose: () => void; onConfirm: () => void }> = ({ voucherNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Receipt Voucher</h3>
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

export const ReceiptsPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
  const [activeTab, setActiveTab] = useState<Tab>('All Receipts');
  const [search, setSearch] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteReceipt, setDeleteReceipt] = useState<typeof MOCK_RECEIPTS[0] | null>(null);

  const fromOptions = useMemo(() => Array.from(new Set(receipts.map(r => r.receivedFrom))), [receipts]);

  const displayed = useMemo(() => {
    let list = [...receipts];
    if (activeTab === 'Recognized') list = list.filter(r => r.status === 'Recognized');
    if (activeTab === 'Uncleared') list = list.filter(r => r.status === 'Uncleared');
    if (search) list = list.filter(r =>
      r.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      r.receivedFrom.toLowerCase().includes(search.toLowerCase())
    );
    if (filterFrom) list = list.filter(r => r.receivedFrom === filterFrom);
    if (filterStatus) list = list.filter(r => r.status === filterStatus);
    return list;
  }, [receipts, activeTab, search, filterFrom, filterStatus]);

  const handleDelete = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  const handleExport = () => {
    const headers = ['Voucher #', 'Date', 'Received From', 'Credit Account', 'Amount', 'Method', 'Status'];
    const data = displayed.map(receipt => [
      receipt.voucherNo,
      receipt.date,
      receipt.receivedFrom,
      receipt.account,
      receipt.amount,
      receipt.method,
      receipt.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Receipt_Vouchers');
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
      key: 'receivedFrom' as const,
      label: 'From',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={13} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'account' as const,
      label: 'Credit Account',
      render: (val: string) => <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{val}</span>
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Recognized') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Recognized</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Uncleared</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Receipt Vouchers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/accounts/receipts/create')}
          >
            New Receipt
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
          { label: 'Filter From', value: filterFrom, options: fromOptions, onChange: setFilterFrom },
          { label: 'Filter Status', value: filterStatus, options: ['Recognized', 'Uncleared'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterFrom(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterFrom || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: (item) => navigate('/admin/accounts/receipts/create'), variant: 'primary', title: 'Edit' },
          { label: 'Void', icon: <Trash2 size={14} />, onClick: (item) => setDeleteReceipt(item), variant: 'danger', title: 'Void' }
        ]}
        emptyMessage="No receipt vouchers found"
      />

      <AnimatePresence>
        {deleteReceipt && (
          <DeleteModal 
            key="delete" 
            voucherNo={deleteReceipt.voucherNo} 
            onClose={() => setDeleteReceipt(null)} 
            onConfirm={() => handleDelete(deleteReceipt.id)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
const ReceiptRefund = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
  </svg>
);
