import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Download, Edit, Trash2, Calendar, User, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', voucherNo: 'PV-02201', payTo: 'Vertex Industries', account: 'Accounts Payable', amount: 4410.00, method: 'Bank Transfer', status: 'Settled' },
  { id: '2', date: '2026-03-16', voucherNo: 'PV-02202', payTo: 'Global Logistics', account: 'Accounts Payable', amount: 1943.03, method: 'Cheque', status: 'Pending' },
  { id: '3', date: '2026-03-15', voucherNo: 'PV-02203', payTo: 'Office Essentials', account: 'Stationery Expense', amount: 892.50, method: 'Cash', status: 'Settled' },
  { id: '4', date: '2026-03-14', voucherNo: 'PV-02204', payTo: 'Power Grid Co', account: 'Electricity Expense', amount: 1540.00, method: 'Online', status: 'Settled' },
];

const TABS = ['All Payments', 'Verified', 'Due Settlement', 'Disputed'] as const;
type Tab = typeof TABS[number];

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ voucherNo: string; onClose: () => void; onConfirm: () => void }> = ({ voucherNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Payment Voucher</h3>
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

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [activeTab, setActiveTab] = useState<Tab>('All Payments');
  const [search, setSearch] = useState('');
  const [filterPayTo, setFilterPayTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deletePayment, setDeletePayment] = useState<typeof MOCK_PAYMENTS[0] | null>(null);

  const payToOptions = useMemo(() => Array.from(new Set(payments.map(p => p.payTo))), [payments]);

  const displayed = useMemo(() => {
    let list = [...payments];
    if (activeTab === 'Verified') list = list.filter(p => p.status === 'Settled');
    if (activeTab === 'Due Settlement') list = list.filter(p => p.status === 'Pending');
    if (search) list = list.filter(p =>
      p.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      p.payTo.toLowerCase().includes(search.toLowerCase())
    );
    if (filterPayTo) list = list.filter(p => p.payTo === filterPayTo);
    if (filterStatus) list = list.filter(p => p.status === filterStatus);
    return list;
  }, [payments, activeTab, search, filterPayTo, filterStatus]);

  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
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
      key: 'payTo' as const,
      label: 'Paid To',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={13} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'account' as const,
      label: 'Debit Account',
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
        if (value === 'Settled') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Settled</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Vouchers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/accounts/payments/create')}
          >
            New Voucher
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
          { label: 'Filter Paid To', value: filterPayTo, options: payToOptions, onChange: setFilterPayTo },
          { label: 'Filter Status', value: filterStatus, options: ['Settled', 'Pending'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterPayTo(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterPayTo || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: (item) => navigate('/admin/accounts/payments/create'), variant: 'primary', title: 'Edit' },
          { label: 'Void', icon: <Trash2 size={14} />, onClick: (item) => setDeletePayment(item), variant: 'danger', title: 'Void' }
        ]}
        emptyMessage="No payment vouchers found"
      />

      <AnimatePresence>
        {deletePayment && (
          <DeleteModal 
            key="delete" 
            voucherNo={deletePayment.voucherNo} 
            onClose={() => setDeletePayment(null)} 
            onConfirm={() => handleDelete(deletePayment.id)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
