import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, DollarSign } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_INVOICES = [
  { id: '1', date: '2026-03-16', invoiceNo: 'SINV-2026-001', customer: 'Nexus Enterprises', amount: 12400.00, tax: 620.00, total: 13020.00, status: 'Paid', dueDate: '2026-04-16' },
  { id: '2', date: '2026-03-15', invoiceNo: 'SINV-2026-002', customer: 'Sarah Johnson', amount: 850.50, tax: 42.53, total: 893.03, status: 'Pending', dueDate: '2026-04-15' },
  { id: '3', date: '2026-03-14', invoiceNo: 'SINV-2026-003', customer: 'Global Trade Corp', amount: 4200.00, tax: 210.00, total: 4410.00, status: 'Paid', dueDate: '2026-04-14' },
  { id: '4', date: '2026-03-14', invoiceNo: 'SINV-2026-004', customer: 'David Smith', amount: 1120.00, tax: 56.00, total: 1176.00, status: 'Partial', dueDate: '2026-04-14' },
  { id: '5', date: '2026-03-13', invoiceNo: 'SINV-2026-005', customer: 'Urban Styles', amount: 2900.00, tax: 145.00, total: 3045.00, status: 'Paid', dueDate: '2026-03-20' },
];

export const SalesInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices] = useState(MOCK_INVOICES);

  const columns = [
    {
      key: 'invoiceNo' as const,
      label: 'Invoice No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-[#002147] border border-slate-100 shadow-sm">
            <ReceiptTax size={18} />
          </div>
          <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
      sortable: true,
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
      filterable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'total' as const,
      label: 'Total Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Paid') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Settled</span>
          </div>
        );
        if (value === 'Partial') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Partial</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Pending</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Invoices</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/invoices/create')}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Invoices', 'Fully Settled', 'Pending Balance', 'Overdue Accounts'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          data={invoices}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'Receive Payment',
              icon: <DollarSign size={16} />,
              onClick: (item) => console.log('Pay', item),
              variant: 'secondary'
            },
            {
              label: 'Edit',
              icon: <Edit size={16} />,
              onClick: (item) => console.log('Edit', item),
              variant: 'secondary'
            },
            {
              label: 'Delete',
              icon: <Trash2 size={16} />,
              onClick: (item) => console.log('Delete', item),
              variant: 'danger'
            }
          ]}
        />
      </div>
    </motion.div>
  );
};
const ReceiptTax = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
  </svg>
);
