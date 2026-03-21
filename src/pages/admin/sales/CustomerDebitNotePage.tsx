import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import Badge from "../../../components/ui/Badge";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_DEBIT_NOTES = [
  { 
    id: '1', debitNo: 'DN-1001', date: '2026-03-14', customer: 'Nexus Enterprises', amount: 1200.00, status: 'Draft', invoiceRef: 'INV-2026-001',
    charges: [{ id: '1', description: 'Undercharged Item #A1', amount: 1200.00 }],
    reason: 'Undercharged Invoice'
  },
  { 
    id: '2', debitNo: 'DN-1002', date: '2026-03-12', customer: 'Sarah Johnson', amount: 85.50, status: 'Issued', invoiceRef: 'INV-2026-002',
    charges: [{ id: '1', description: 'Extra Shipping Charge', amount: 85.50 }],
    reason: 'Additional Services'
  },
];

export const CustomerDebitNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [debitNotes, setDebitNotes] = useState(MOCK_DEBIT_NOTES);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const customerOptions = useMemo(() => Array.from(new Set(debitNotes.map(d => d.customer))), [debitNotes]);

  const displayed = useMemo(() => {
    let list = [...debitNotes];
    
    // Search
    if (search) {
      list = list.filter(d => 
        d.debitNo.toLowerCase().includes(search.toLowerCase()) || 
        d.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filters
    if (filterCustomer) list = list.filter(d => d.customer === filterCustomer);
    if (filterMonth) {
      list = list.filter(d => {
        const date = new Date(d.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }
    
    return list;
  }, [debitNotes, search, filterCustomer, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/debit-note/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    if (window.confirm(`Are you sure you want to delete ${item.debitNo}?`)) {
      setDebitNotes(debitNotes.filter(d => d.id !== item.id));
    }
  };

  const columns = [
    {
      key: 'debitNo' as const,
      label: 'Debit Note #',
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
        <Badge variant={value === 'Issued' ? 'success' : 'warning'}>{value}</Badge>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fiscal Calibration</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Download size={14} />} className="rounded-xl border-slate-200 h-10 text-xs font-bold px-4">
            Export
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/debit-note/new')}
            className="bg-[#002147] hover:bg-[#003366] text-white h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all px-6"
          >
            New Debit Note
          </Button>
        </div>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search debit notes..."
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

export default CustomerDebitNotePage;
