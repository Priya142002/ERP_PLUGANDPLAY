import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, FileCheck } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_ORDERS = [
  { id: '1', date: '2026-03-16', orderNo: 'PO-9001', vendor: 'TechNova Solutions', amount: 3500.00,  expectedDate: '2026-03-25', status: 'Approved'  },
  { id: '2', date: '2026-03-15', orderNo: 'PO-9002', vendor: 'Office Essentials',  amount: 1250.50,  expectedDate: '2026-03-22', status: 'Pending'   },
  { id: '3', date: '2026-03-14', orderNo: 'PO-9003', vendor: 'Global Logistics',   amount: 450.00,   expectedDate: '2026-03-20', status: 'Received'  },
  { id: '4', date: '2026-03-12', orderNo: 'PO-9004', vendor: 'Vertex Industries',  amount: 8900.00,  expectedDate: '2026-03-30', status: 'Cancelled' },
];

const TABS = ['All Orders', 'Active Supply', 'Pending Authorization', 'Voided Entries'] as const;
type Tab = typeof TABS[number];

export const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('All Orders');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const vendorOptions = useMemo(() => Array.from(new Set(MOCK_ORDERS.map(o => o.vendor))), []);

  const displayed = useMemo(() => {
    let list = [...MOCK_ORDERS];
    if (activeTab === 'Active Supply') list = list.filter(o => o.status === 'Approved' || o.status === 'Received');
    if (activeTab === 'Pending Authorization') list = list.filter(o => o.status === 'Pending');
    if (activeTab === 'Voided Entries') list = list.filter(o => o.status === 'Cancelled');
    if (search) list = list.filter(o =>
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(o => o.vendor === filterVendor);
    if (filterStatus) list = list.filter(o => o.status === filterStatus);
    return list;
  }, [activeTab, search, filterVendor, filterStatus]);

  const columns = [
    {
      key: 'orderNo' as const,
      label: 'Order ID',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'date' as const,
      label: 'Order Date',
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
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Approved') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Approved</span>
          </div>
        );
        if (value === 'Received') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Received</span>
          </div>
        );
        if (value === 'Cancelled') return (
          <div className="flex items-center gap-1.5 text-rose-600">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cancelled</span>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export</Button>
          <Button variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/orders/new')}>
            New Order
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
        searchPlaceholder="Search order no or vendor..."
        onSearchChange={setSearch}
        filters={[
          { label: 'Filter by Vendor', value: filterVendor, options: vendorOptions, onChange: setFilterVendor },
          { label: 'Filter by Status', value: filterStatus, options: ['Approved', 'Pending', 'Received', 'Cancelled'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterVendor || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: () => {}, variant: 'primary', title: 'Edit' },
          { label: 'Convert to Invoice', icon: <FileCheck size={14} />, onClick: () => {}, variant: 'primary', title: 'Convert to Invoice' },
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No orders found"
      />
    </motion.div>
  );
};

export default PurchaseOrdersPage;
