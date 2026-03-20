import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Trash2, Calendar, User } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', paymentNo: 'PAY-8001', vendor: 'TechNova Solutions', amount: 4410.00, method: 'Bank Transfer', reference: 'TXN_992201', status: 'Completed' },
  { id: '2', date: '2026-03-14', paymentNo: 'PAY-8002', vendor: 'Office Essentials', amount: 892.50, method: 'Corporate Card', reference: 'CARD_0224', status: 'Completed' },
  { id: '3', date: '2026-03-12', paymentNo: 'PAY-8003', vendor: 'Pure Water Co.', amount: 126.00, method: 'Cash', reference: 'CASH_110', status: 'Completed' },
  { id: '4', date: '2026-03-10', paymentNo: 'PAY-8004', vendor: 'Global Logistics', amount: 1000.00, method: 'Cheque', reference: 'CHQ_5502', status: 'Processing' },
];

export const VendorPaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);

  const columns = [
    {
      key: 'paymentNo' as const,
      label: 'Payment No',
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
      key: 'amount' as const,
      label: 'Amount Paid',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'method' as const,
      label: 'Method',
      filterable: true,
      render: (val: string) => (
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {val}
        </span>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Completed') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Authorized</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Processing</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Disbursements</h1>
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
            New Payment
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Settlements', 'Authorized', 'Processing', 'Flagged Entries'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={payments}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
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

