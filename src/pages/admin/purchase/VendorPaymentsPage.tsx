import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, CreditCard, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { useNotifications } from "../../../context/AppContext";
import { exportToExcel } from "../../../utils/reportGenerator";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', paymentNo: 'PAY-8001', vendor: 'TechNova Solutions', amount: 4410.00, method: 'Bank Transfer',  reference: 'TXN_992201', status: 'Completed'  },
  { id: '2', date: '2026-03-14', paymentNo: 'PAY-8002', vendor: 'Office Essentials',  amount: 892.50,  method: 'Corporate Card', reference: 'CARD_0224',  status: 'Completed'  },
  { id: '3', date: '2026-03-12', paymentNo: 'PAY-8003', vendor: 'Pure Water Co.',     amount: 126.00,  method: 'Cash',           reference: 'CASH_110',   status: 'Completed'  },
  { id: '4', date: '2026-03-10', paymentNo: 'PAY-8004', vendor: 'Global Logistics',   amount: 1000.00, method: 'Cheque',         reference: 'CHQ_5502',   status: 'Processing' },
];

const TABS = ['All Payments', 'Completed', 'Processing', 'Flagged'] as const;
type Tab = typeof TABS[number];

/* ── Delete Modal ── */
const DeleteModal: React.FC<{ paymentNo: string; onClose: () => void; onConfirm: () => void }> = ({ paymentNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle size={18} /></div>
        <h3 className="font-bold text-slate-800">Delete Payment</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{paymentNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} 
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} 
          style={{ minHeight: '36px', height: '36px', borderRadius: '12px' }}
          className="flex-1 bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

export const VendorPaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [activeTab, setActiveTab] = useState<Tab>('All Payments');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deletePayment, setDeletePayment] = useState<typeof MOCK_PAYMENTS[0] | null>(null);

  const vendorOptions = useMemo(() => Array.from(new Set(payments.map(p => p.vendor))), [payments]);

  const displayed = useMemo(() => {
    let list = [...payments];
    if (activeTab === 'Completed')  list = list.filter(p => p.status === 'Completed');
    if (activeTab === 'Processing') list = list.filter(p => p.status === 'Processing');
    if (search) list = list.filter(p =>
      p.paymentNo.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(p => p.vendor === filterVendor);
    if (filterStatus) list = list.filter(p => p.status === filterStatus);
    return list;
  }, [payments, activeTab, search, filterVendor, filterStatus]);

  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    showNotification({
      type: 'success',
      title: 'Payment Deleted',
      message: 'Vendor payment has been deleted successfully'
    });
  };

  const handleExportExcel = () => {
    try {
      const exportData = displayed.map(payment => [
        payment.paymentNo,
        payment.date,
        payment.vendor,
        `$${payment.amount.toFixed(2)}`,
        payment.method,
        payment.status
      ]);

      exportToExcel(
        [
          {
            sheetName: 'Vendor Payments',
            headers: ['Payment No', 'Date', 'Vendor', 'Amount Paid', 'Method', 'Status'],
            data: exportData
          }
        ],
        'Vendor_Payments_Mar_2026'
      );

      showNotification({
        type: 'success',
        title: 'Excel Downloaded',
        message: 'Vendor payments exported successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export vendor payments'
      });
      console.error('Export error:', error);
    }
  };

  const columns = [
    {
      key: 'paymentNo' as const,
      label: 'Payment No',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'vendor' as const,
      label: 'Vendor',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'amount' as const,
      label: 'Amount Paid',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'method' as const,
      label: 'Method',
      render: (val: string) => (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <CreditCard size={11} /> {val}
        </div>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => value === 'Completed' ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Authorized</span>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Payment</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" 
            leftIcon={<Download size={14} />}
            onClick={handleExportExcel}
          >
            Export
          </Button>
          <Button variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/payments/new')}>
            New Payment
          </Button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Search + Filter */}
      <TableFilters
        searchValue={search}
        searchPlaceholder="Search payment no or vendor..."
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
          { label: 'Edit', icon: <Edit size={14} />, onClick: item => navigate(`/admin/purchase/payments/${item.id}/edit`), variant: 'primary', title: 'Edit' },
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: item => setDeletePayment(item), variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No payments found"
      />

      <AnimatePresence>
        {deletePayment && (
          <DeleteModal 
            key="delete" 
            paymentNo={deletePayment.paymentNo} 
            onClose={() => setDeletePayment(null)} 
            onConfirm={() => handleDelete(deletePayment.id)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VendorPaymentsPage;
