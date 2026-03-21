import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Download, Edit, Trash2, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import Badge from "../../../components/ui/Badge";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-12', paymentNo: 'PAY-1001', customer: 'Nexus Enterprises', amount: 2500.00, method: 'Bank Transfer', reference: 'TXN-887766' },
  { id: '2', date: '2026-03-11', paymentNo: 'PAY-1002', customer: 'Sarah Johnson', amount: 450.50, method: 'Cash', reference: '' },
  { id: '3', date: '2026-03-10', paymentNo: 'PAY-1003', customer: 'Global Trade Corp', amount: 1200.00, method: 'Credit Card', reference: 'AUTH-9988' },
];

export const CustomerPaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const customerOptions = useMemo(() => Array.from(new Set(payments.map(p => p.customer))), [payments]);
  const methodOptions = useMemo(() => Array.from(new Set(payments.map(p => p.method))), [payments]);

  const displayed = useMemo(() => {
    let list = [...payments];
    
    // Search
    if (search) {
      list = list.filter(p => 
        p.paymentNo.toLowerCase().includes(search.toLowerCase()) || 
        p.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filters
    if (filterCustomer) list = list.filter(p => p.customer === filterCustomer);
    if (filterMethod) list = list.filter(p => p.method === filterMethod);
    if (filterMonth) {
      list = list.filter(p => {
        const date = new Date(p.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }
    
    return list;
  }, [payments, search, filterCustomer, filterMethod, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/payments/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.paymentNo}?`)) {
      setPayments(payments.filter(p => p.id !== item.id));
    }
  };

  const columns = [
    {
      key: 'paymentNo' as const,
      label: 'Payment #',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <CreditCard size={20} />
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
    },
    {
      key: 'amount' as const,
      label: 'Amount Paid',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-emerald-600">Rs. {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'method' as const,
      label: 'Method',
      render: (value: string) => (
        <Badge variant="primary">{value}</Badge>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fiscal Ingestion</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 hover:text-black active:scale-95 transition-all" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent px-6 h-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/payments/create')}
          >
            New Payment
          </Button>
        </div>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search payments..."
        filters={[
          { label: 'Filter by Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer },
          { label: 'Filter by Method', value: filterMethod, options: methodOptions, onChange: setFilterMethod },
          { label: 'Filter by Month', value: filterMonth, options: MONTHS, onChange: setFilterMonth }
        ]}
        onClearAll={() => { setSearch(''); setFilterCustomer(''); setFilterMethod(''); setFilterMonth(''); }}
        showClearButton={!!(search || filterCustomer || filterMethod || filterMonth)}
      />

      <DataTableWrapper 
        data={displayed}
        columns={columns}
        onEmptyClick={() => navigate('/admin/sales/payments/create')}
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

export default CustomerPaymentsPage;
