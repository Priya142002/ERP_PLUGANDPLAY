import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Trash2, Calendar, User, CreditCard } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', payNo: 'PPAY-1001', vendor: 'TechNova Solutions', amount: 4410.00,  method: 'Swift Transfer',  status: 'Completed'  },
  { id: '2', date: '2026-03-14', payNo: 'PPAY-1002', vendor: 'Office Essentials',  amount: 892.50,   method: 'Corporate Card',  status: 'Completed'  },
  { id: '3', date: '2026-03-10', payNo: 'PPAY-1003', vendor: 'Global Logistics',   amount: 1000.00,  method: 'Cheque',          status: 'Processing' },
  { id: '4', date: '2026-03-08', payNo: 'PPAY-1004', vendor: 'Vertex Industries',  amount: 5000.00,  method: 'ACH',             status: 'Flagged'    },
];

const TABS = ['All Payments', 'Completed', 'Processing', 'Flagged'] as const;
type Tab = typeof TABS[number];

export const PurchasePaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('All Payments');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const vendorOptions = useMemo(() => Array.from(new Set(MOCK_PAYMENTS.map(p => p.vendor))), []);

  const displayed = useMemo(() => {
    let list = [...MOCK_PAYMENTS];
    if (activeTab === 'Completed')  list = list.filter(p => p.status === 'Completed');
    if (activeTab === 'Processing') list = list.filter(p => p.status === 'Processing');
    if (activeTab === 'Flagged')    list = list.filter(p => p.status === 'Flagged');
    if (search) list = list.filter(p =>
      p.payNo.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(p => p.vendor === filterVendor);
    if (filterStatus) list = list.filter(p => p.status === filterStatus);
    return list;
  }, [activeTab, search, filterVendor, filterStatus]);

  const handleExport = () => {
    const headers = ['Payment #', 'Date', 'Vendor', 'Amount', 'Method', 'Status'];
    const data = displayed.map(payment => [
      payment.payNo,
      payment.date,
      payment.vendor,
      payment.amount,
      payment.method,
      payment.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Purchase_Payments');
  };

  const columns = [
    {
      key: 'payNo' as const,
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
      label: 'Amount',
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
      render: (value: string) => {
        if (value === 'Completed') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
          </div>
        );
        if (value === 'Flagged') return (
          <div className="flex items-center gap-1.5 text-rose-600">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Flagged</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
          </div>
        );
      }
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Payment</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>Export</Button>
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
          { label: 'Filter by Status', value: filterStatus, options: ['Completed', 'Processing', 'Flagged'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterVendor || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No payments found"
      />
    </motion.div>
  );
};

export default PurchasePaymentsPage;
