import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_CREDIT_NOTES = [
  { id: '1', date: '2026-03-12', noteNo: 'VCN-3001', vendor: 'TechNova Solutions', amount: 350.50, reason: 'Price Adjustment', status: 'Approved' },
  { id: '2', date: '2026-03-10', noteNo: 'VCN-3002', vendor: 'Vertex Industries',  amount: 800.00, reason: 'Return Credit',    status: 'Pending'  },
  { id: '3', date: '2026-03-05', noteNo: 'VCN-3003', vendor: 'Global Logistics',   amount: 120.00, reason: 'Discount Applied', status: 'Approved' },
];

const TABS = ['All Credit Notes', 'Authorized', 'Awaiting Review', 'Adjustment Claims'] as const;
type Tab = typeof TABS[number];

export const VendorCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('All Credit Notes');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const vendorOptions = useMemo(() => Array.from(new Set(MOCK_CREDIT_NOTES.map(n => n.vendor))), []);

  const displayed = useMemo(() => {
    let list = [...MOCK_CREDIT_NOTES];
    if (activeTab === 'Authorized')     list = list.filter(n => n.status === 'Approved');
    if (activeTab === 'Awaiting Review') list = list.filter(n => n.status === 'Pending');
    if (search) list = list.filter(n =>
      n.noteNo.toLowerCase().includes(search.toLowerCase()) ||
      n.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(n => n.vendor === filterVendor);
    if (filterStatus) list = list.filter(n => n.status === filterStatus);
    return list;
  }, [activeTab, search, filterVendor, filterStatus]);

  const columns = [
    {
      key: 'noteNo' as const,
      label: 'Credit Note #',
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
      render: (value: string) => <span className="text-sm text-slate-600 font-medium">{value}</span>
    },
    {
      key: 'reason' as const,
      label: 'Reason',
      render: (value: string) => <span className="text-sm text-slate-500">{value}</span>
    },
    {
      key: 'amount' as const,
      label: 'Credit Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-teal-600">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => value === 'Approved' ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Approved</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-amber-600">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Credit Note</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export</Button>
          <Button variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/credit-note/new')}>
            New Credit Note
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
        searchPlaceholder="Search note no or vendor..."
        onSearchChange={setSearch}
        filters={[
          { label: 'Filter by Vendor', value: filterVendor, options: vendorOptions, onChange: setFilterVendor },
          { label: 'Filter by Status', value: filterStatus, options: ['Approved', 'Pending'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterVendor || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: () => {}, variant: 'primary', title: 'Edit' },
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No credit notes found"
      />
    </motion.div>
  );
};

export default VendorCreditNotePage;
