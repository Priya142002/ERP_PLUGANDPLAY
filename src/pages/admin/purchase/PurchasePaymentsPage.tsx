import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Trash2, Calendar, User, CreditCard } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', payNo: 'PPAY-1001', vendor: 'TechNova Solutions', amount: 4410.00, method: 'Swift Transfer', status: 'Completed' },
  { id: '2', date: '2026-03-14', payNo: 'PPAY-1002', vendor: 'Office Essentials', amount: 892.50, method: 'Corporate Card', status: 'Completed' },
  { id: '3', date: '2026-03-10', payNo: 'PPAY-1003', vendor: 'Global Logistics', amount: 1000.00, method: 'Cheque', status: 'Processing' },
  { id: '4', date: '2026-03-08', payNo: 'PPAY-1004', vendor: 'Vertex Industries', amount: 5000.00, method: 'ACH', status: 'Flagged' },
];

export const PurchasePaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);

  const columns = [
    {
      key: 'payNo' as const,
      label: 'Voucher ID',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Settlement Date',
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
      label: 'Beneficiary',
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
      label: 'Cash Flow',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'method' as const,
      label: 'Channel',
      render: (val: string) => (
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <CreditCard size={12} /> {val}
        </div>
      )
    },
    {
      key: 'status' as const,
      label: 'Audit Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Completed') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Authorized</span>
          </div>
        );
        if (value === 'Flagged') return (
          <div className="flex items-center gap-1.5 text-rose-600">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Review Case</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">In Pipeline</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Procurement Settlements</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/payments/new')}
          >
            New Settlement
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Settlements', 'Authorized', 'In Pipeline', 'Audit Exceptions'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          data={payments}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'Delete Transaction',
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
