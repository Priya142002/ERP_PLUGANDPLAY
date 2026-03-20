import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Trash2, Calendar, User, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_QUOTATIONS = [
  { id: '1', date: '2026-03-16', quoteNo: 'QTN-2026-001', customer: 'Nexus Enterprises', amount: 12400.00, validUntil: '2026-04-16', status: 'Pending' },
  { id: '2', date: '2026-03-15', quoteNo: 'QTN-2026-002', customer: 'Sarah Johnson', amount: 850.50, validUntil: '2026-04-15', status: 'Accepted' },
  { id: '3', date: '2026-03-14', quoteNo: 'QTN-2026-003', customer: 'Global Trade Corp', amount: 4200.00, validUntil: '2026-03-30', status: 'Expired' },
  { id: '4', date: '2026-03-14', quoteNo: 'QTN-2026-004', customer: 'David Smith', amount: 1120.00, validUntil: '2026-04-14', status: 'Converted' },
  { id: '5', date: '2026-03-13', quoteNo: 'QTN-2026-005', customer: 'Urban Styles', amount: 2900.00, validUntil: '2026-04-20', status: 'Declined' },
];

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotations] = useState(MOCK_QUOTATIONS);

  const columns = [
    {
      key: 'quoteNo' as const,
      label: 'Quotation No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <FileDuplicate size={20} />
          </div>
          <div className="font-semibold text-slate-900">{value}</div>
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
      key: 'amount' as const,
      label: 'Total Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Proposals</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/quotations/create')}
          >
            New Quotation
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Proposals', 'Accepted', 'Pending Intake', 'Expired Vouchers'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={quotations}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'Convert to Bill',
              icon: <FileText size={16} />,
              onClick: (item) => console.log('Convert', item),
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
const FileDuplicate = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>
);
