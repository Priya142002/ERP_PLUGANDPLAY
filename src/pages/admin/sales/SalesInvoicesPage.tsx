import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import Badge from "../../../components/ui/Badge";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_INVOICES = [
  { 
    id: '1', invoiceNo: 'INV-2026-001', customer: 'Nexus Enterprises', date: '2026-03-14', amount: 4500.00, status: 'Settled', dueDate: '2026-04-14',
    items: [{ id: '1', name: 'Ultra-Wide Monitor 34"', qty: 3, rate: 1500.00, amount: 4500.00 }],
    paymentStatus: 'paid'
  },
  { 
    id: '2', invoiceNo: 'INV-2026-002', customer: 'Global Trade Corp', date: '2026-03-12', amount: 1200.00, status: 'Active', dueDate: '2026-04-12',
    items: [{ id: '1', name: 'Mechanical Keyboard RGB', qty: 10, rate: 120.00, amount: 1200.00 }],
    paymentStatus: 'unpaid'
  },
  { 
    id: '3', invoiceNo: 'INV-2026-003', customer: 'Urban Styles', date: '2026-03-08', amount: 850.00, status: 'Settled', dueDate: '2026-04-08',
    items: [{ id: '1', name: 'Designer Desk Lamp', qty: 1, rate: 850.00, amount: 850.00 }],
    paymentStatus: 'paid'
  },
];


export const SalesInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const customerOptions = useMemo(() => Array.from(new Set(invoices.map(i => i.customer))), [invoices]);

  const displayed = useMemo(() => {
    let list = [...invoices];
    
    // Search
    if (search) {
      list = list.filter(i => 
        i.invoiceNo.toLowerCase().includes(search.toLowerCase()) || 
        i.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filters
    if (filterCustomer) list = list.filter(i => i.customer === filterCustomer);
    if (filterMonth) {
      list = list.filter(i => {
        const date = new Date(i.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }
    
    return list;
  }, [invoices, search, filterCustomer, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/invoices/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.invoiceNo}?`)) {
      setInvoices(invoices.filter(i => i.id !== item.id));
    }
  };

  const columns = [
    {
      key: 'invoiceNo' as const,
      label: 'Invoice #',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <FileText size={20} />
          </div>
          <div className="font-semibold text-slate-900">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
    },
    {
      key: 'customer' as const,
      label: 'Customer',
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">Rs. {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Settled' ? 'success' : 'warning'}>{value === 'Settled' ? 'Settled' : 'Active'}</Badge>
      )
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Voucher Extraction</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl border-slate-200 h-10 text-xs font-bold px-4" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all px-6"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/invoices/create')}
          >
            New Invoice
          </Button>
        </div>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoices..."
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

export default SalesInvoicesPage;
