import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCcw, Download, Edit, Trash2, Calendar, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import Badge from "../../../components/ui/Badge";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_RETURNS = [
  {
    id: '1', returnNo: 'SR-1001', date: '2026-03-15', customer: 'Nexus Enterprises', amount: 450.00, status: 'Completed', invoiceRef: 'INV-2026-001',
    items: [{ id: '1', name: 'Ultra-Wide Monitor 34"', qty: 1, rate: 450.00, amount: 450.00 }],
    reason: 'Defective Product'
  },
  {
    id: '2', returnNo: 'SR-1002', date: '2026-03-12', customer: 'Global Trade Corp', amount: 120.00, status: 'Processing', invoiceRef: 'INV-2026-002',
    items: [{ id: '1', name: 'Mechanical Keyboard RGB', qty: 1, rate: 120.00, amount: 120.00 }],
    reason: 'Wrong Item Delivered'
  },
  {
    id: '3', returnNo: 'SR-1003', date: '2026-03-08', customer: 'Urban Styles', amount: 85.00, status: 'Completed', invoiceRef: 'INV-2026-003',
    items: [{ id: '1', name: 'Designer Desk Lamp', qty: 1, rate: 85.00, amount: 85.00 }],
    reason: 'Quality Dissatisfaction'
  },
];

const TABS = ['All Restitutions', 'Fully Processed', 'Intake Pending', 'Disputed Claims'] as const;
type Tab = typeof TABS[number];

export const SalesReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState(MOCK_RETURNS);
  const [activeTab, setActiveTab] = useState<Tab>('All Restitutions');
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const customerOptions = useMemo(() => Array.from(new Set(returns.map(r => r.customer))), [returns]);

  const displayed = useMemo(() => {
    let list = [...returns];

    // Static tab filtering
    if (activeTab === 'Fully Processed') list = list.filter(r => r.status === 'Completed');
    if (activeTab === 'Intake Pending') list = list.filter(r => r.status === 'Processing');

    // Search
    if (search) {
      list = list.filter(r =>
        r.returnNo.toLowerCase().includes(search.toLowerCase()) ||
        r.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filters
    if (filterCustomer) list = list.filter(r => r.customer === filterCustomer);
    if (filterMonth) {
      list = list.filter(r => {
        const date = new Date(r.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }

    return list;
  }, [returns, activeTab, search, filterCustomer, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/returns/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.returnNo}?`)) {
      setReturns(returns.filter(r => r.id !== item.id));
    }
  };

  const columns = [
    {
      key: 'returnNo' as const,
      label: 'Return #',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
            <RotateCcw size={20} />
          </div>
          <div className="font-semibold text-slate-900">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'invoiceRef' as const,
      label: 'Ref Invoice',
      render: (val: string) => (
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <FileText size={12} /> {val}
        </div>
      )
    },
    {
      key: 'customer' as const,
      label: 'Customer',
    },
    {
      key: 'amount' as const,
      label: 'Refund Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-orange-600">Rs. {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'success' : 'warning'}>{value}</Badge>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Restitution</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button
            variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/returns/new')}
          >
            New Return
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${
              activeTab === tab
                ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search returns..."
        filters={[
          { label: 'Filter by Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer },
          { label: 'Filter by Month', value: filterMonth, options: MONTHS, onChange: setFilterMonth }
        ]}
        onClearAll={() => { setSearch(''); setFilterCustomer(''); setFilterMonth(''); }}
        showClearButton={!!(search || filterCustomer || filterMonth || activeTab !== 'All Restitutions')}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          {
            label: 'Edit',
            icon: <Edit size={14} />,
            onClick: (item) => handleEditClick(item),
            variant: 'primary'
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: (item) => handleDeleteClick(item),
            variant: 'danger'
          }
        ]}
      />
    </motion.div>
  );
};

export default SalesReturnsPage;
