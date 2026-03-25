import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, FileText, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_QUOTATIONS = [
  { 
    id: '1', date: '2026-03-16', quoteNo: 'QTN-2026-001', customer: 'Nexus Enterprises', amount: 12400.00, validUntil: '2026-04-16', status: 'Pending',
    items: [{ id: '1', name: 'Ultra-Wide Monitor 34"', qty: 10, rate: 1240.00, amount: 12400.00 }],
    notes: 'Standard bulk discount applied.'
  },
  { 
    id: '2', date: '2026-03-15', quoteNo: 'QTN-2026-002', customer: 'Sarah Johnson', amount: 850.50, validUntil: '2026-04-15', status: 'Accepted',
    items: [{ id: '1', name: 'Mechanical Keyboard RGB', qty: 5, rate: 170.10, amount: 850.50 }],
    notes: ''
  },
  { 
    id: '3', date: '2026-03-14', quoteNo: 'QTN-2026-003', customer: 'Global Trade Corp', amount: 4200.00, validUntil: '2026-03-30', status: 'Expired',
    items: [{ id: '1', name: 'Office Chair Pro', qty: 6, rate: 700.00, amount: 4200.00 }],
    notes: 'Expired proposal.'
  },
  { id: '4', date: '2026-03-14', quoteNo: 'QTN-2026-004', customer: 'David Smith', amount: 1120.00, validUntil: '2026-04-14', status: 'Converted',
    items: [{ id: '1', name: 'Wireless Mouse', qty: 10, rate: 50.00, amount: 500.00 }, { id: '2', name: 'Ergonomic Keyboard', qty: 2, rate: 310.00, amount: 620.00 }],
    notes: 'Converted to invoice #INV-2026-001.'
  },
  { id: '5', date: '2026-03-13', quoteNo: 'QTN-2026-005', customer: 'Urban Styles', amount: 2900.00, validUntil: '2026-04-20', status: 'Declined',
    items: [{ id: '1', name: 'Designer Desk Lamp', qty: 4, rate: 725.00, amount: 2900.00 }],
    notes: 'Customer found a cheaper alternative.'
  },
];

const TABS = ['All Proposals', 'Accepted', 'Pending Intake', 'Expired Vouchers'] as const;
type Tab = typeof TABS[number];

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState(MOCK_QUOTATIONS);
  const [activeTab, setActiveTab] = useState<Tab>('All Proposals');
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; quotation: any | null }>({ 
    isOpen: false, 
    quotation: null 
  });

  const customerOptions = useMemo(() => Array.from(new Set(quotations.map(q => q.customer))), [quotations]);

  const displayed = useMemo(() => {
    let list = [...quotations];
    
    // Static tab filtering
    if (activeTab === 'Accepted') list = list.filter(q => q.status === 'Accepted');
    if (activeTab === 'Pending Intake') list = list.filter(q => q.status === 'Pending');
    if (activeTab === 'Expired Vouchers') list = list.filter(q => q.status === 'Expired');
    
    // Search
    if (search) {
      list = list.filter(q => 
        q.quoteNo.toLowerCase().includes(search.toLowerCase()) || 
        q.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filters
    if (filterCustomer) list = list.filter(q => q.customer === filterCustomer);
    if (filterMonth) {
      list = list.filter(q => {
        const date = new Date(q.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }
    
    return list;
  }, [quotations, activeTab, search, filterCustomer, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/quotations/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, quotation: item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.quotation) {
      setQuotations(quotations.filter(q => q.id !== deleteModal.quotation.id));
      setDeleteModal({ isOpen: false, quotation: null });
    }
  };

  const handleExport = () => {
    const headers = ['Quotation No', 'Date', 'Customer', 'Total Amount', 'Valid Until', 'Status'];
    const data = displayed.map(q => [
      q.quoteNo,
      q.date,
      q.customer,
      q.amount,
      q.validUntil,
      q.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Quotations');
  };

  const columns = [
    {
      key: 'quoteNo' as const,
      label: 'Quotation No',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <FileText size={20} />
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
      key: 'customer' as const,
      label: 'Customer',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'amount' as const,
      label: 'Total Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">Rs. {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Accepted') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Accepted</span>
          </div>
        );
        if (value === 'Converted') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Invoiced</span>
          </div>
        );
        if (value === 'Pending') return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Pending</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-rose-600">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">{value}</span>
          </div>
        );
      }
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quotation</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 hover:text-black active:scale-95 transition-all" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent px-6 h-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/quotations/create')}
          >
            New Quotation
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
        searchPlaceholder="Search quotations..."
        filters={[
          { label: 'Filter by Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer },
          { label: 'Filter by Month', value: filterMonth, options: MONTHS, onChange: setFilterMonth }
        ]}
        onClearAll={() => { setSearch(''); setFilterCustomer(''); setFilterMonth(''); }}
        showClearButton={!!(search || filterCustomer || filterMonth)}
      />

      <DataTableWrapper 
        data={displayed}
        columns={columns}
        onEmptyClick={() => navigate('/admin/sales/quotations/create')}
        actions={[
          {
            label: 'Convert',
            icon: <FileText size={14} />,
            onClick: (item) => console.log('Convert', item),
            variant: 'primary'
          },
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quotation: null })}
        title="Delete Quotation"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4">
            <AlertTriangle className="text-slate-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="text-base font-semibold text-slate-900">
                Are you sure you want to delete "{deleteModal.quotation?.quoteNo}"?
              </p>
              <p className="text-sm text-slate-600 mt-2">This cannot be undone.</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2 px-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, quotation: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default QuotationsPage;
