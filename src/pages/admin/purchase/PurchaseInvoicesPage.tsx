import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, DollarSign } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_INVOICES = [
  { id: '1', date: '2026-03-16', invoiceNo: 'PINV-2026-001', vendor: 'TechNova Solutions', amount: 4200.00, tax: 210.00, total: 4410.00, status: 'Paid', dueDate: '2026-04-16' },
  { id: '2', date: '2026-03-15', invoiceNo: 'PINV-2026-002', vendor: 'Global Logistics', amount: 1850.50, tax: 92.53, total: 1943.03, status: 'Pending', dueDate: '2026-04-15' },
  { id: '3', date: '2026-03-14', invoiceNo: 'PINV-2026-003', vendor: 'Office Essentials', amount: 850.00, tax: 42.50, total: 892.50, status: 'Paid', dueDate: '2026-04-14' },
  { id: '4', date: '2026-03-14', invoiceNo: 'PINV-2026-004', vendor: 'Vertex Industries', amount: 12400.00, tax: 620.00, total: 13020.00, status: 'Partial', dueDate: '2026-04-14' },
  { id: '5', date: '2026-03-13', invoiceNo: 'PINV-2026-005', vendor: 'Pure Water Co.', amount: 120.00, tax: 6.00, total: 126.00, status: 'Paid', dueDate: '2026-03-20' },
];

export const PurchaseInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices] = useState(MOCK_INVOICES);

  const columns = [
    {
      key: 'invoiceNo' as const,
      label: 'Invoice No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
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
      key: 'vendor' as const,
      label: 'Vendor',
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
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Ledger</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/invoices/create')}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Invoices', 'Fully Settled', 'Pending Intake', 'Credit Balances'].map((chip, idx) => (
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
              label: 'Edit',
              icon: <Edit size={16} />,
              onClick: (item) => console.log('Edit', item),
              variant: 'secondary'
            },
            {
              label: 'Record Payment',
              icon: <DollarSign size={16} />,
              onClick: (item) => console.log('Pay', item),
              variant: 'primary'
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
