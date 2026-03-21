import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_SUPPLIERS = [
  { id: '1', name: 'TechNova Solutions', contact: 'John Carter',   email: 'JOHN@TECHNOVA.COM',    phone: '+1 234 567 890', location: 'San Francisco, CA', status: 'Available',  outstanding: '$2,400.00', vendorNo: 'VND-001' },
  { id: '2', name: 'Global Logistics',   contact: 'Sarah Jenkins', email: 'SARAH@GLOBALLOG.COM',  phone: '+1 987 654 321', location: 'Chicago, IL',       status: 'Available',  outstanding: '$0.00',     vendorNo: 'VND-002' },
  { id: '3', name: 'Office Essentials',  contact: 'Michael Ross',  email: 'MIKE@OFFICE.COM',      phone: '+44 20 7946 0958',location: 'New York, NY',      status: 'Inactive',   outstanding: '$850.00',   vendorNo: 'VND-003' },
  { id: '4', name: 'Vertex Industries',  contact: 'Harvey Specter', email: 'HARVEY@VERTEX.COM',   phone: '+1 555 010 999', location: 'Austin, TX',        status: 'Available',  outstanding: '$12,400.00',vendorNo: 'VND-004' },
  { id: '5', name: 'Pure Water Co.',     contact: 'Donna Paulsen', email: 'DONNA@PUREWATER.COM',  phone: '+1 555 010 888', location: 'Miami, FL',         status: 'Available',  outstanding: '$0.00',     vendorNo: 'VND-005' },
];

const TABS = ['All Suppliers', 'Critical Partners', 'Active Vendors', 'Recent Contracts'] as const;
type Tab = typeof TABS[number];

export const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('All Suppliers');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const displayed = useMemo(() => {
    let list = [...MOCK_SUPPLIERS];
    if (activeTab === 'Active Vendors') list = list.filter(s => s.status === 'Available');
    if (search) list = list.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.vendorNo.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus) list = list.filter(s => s.status === filterStatus);
    return list;
  }, [activeTab, search, filterStatus]);

  const columns = [
    {
      key: 'name' as const,
      label: 'Vendor Name',
      render: (value: string, item: typeof MOCK_SUPPLIERS[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
            {value[0]}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">{item.vendorNo}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact' as const,
      label: 'Contact Person',
      render: (value: string, item: typeof MOCK_SUPPLIERS[0]) => (
        <div>
          <div className="text-sm font-medium text-slate-700">{value}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Mail size={9} /> {item.email}
          </div>
        </div>
      )
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Phone size={12} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'outstanding' as const,
      label: 'Outstanding Balance',
      align: 'right' as const,
      render: (value: string) => <span className="font-bold text-slate-800">{value}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => value === 'Available' ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Available</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Inactive</span>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export</Button>
          <Button variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/vendors/new')}>
            New Vendor
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
        searchPlaceholder="Search vendors..."
        onSearchChange={setSearch}
        filters={[{ label: 'Filter Status', value: filterStatus, options: ['Available', 'Inactive'], onChange: setFilterStatus }]}
        onClearAll={() => { setSearch(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: () => {}, variant: 'primary', title: 'Edit' },
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => {}, variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No vendors found"
      />
    </motion.div>
  );
};

export default SuppliersPage;
