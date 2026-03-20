import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Download, Edit, Trash2, Calendar, User } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', voucherNo: 'PV-02201', payTo: 'Vertex Industries', account: 'Accounts Payable', amount: 4410.00, method: 'Bank Transfer', status: 'Approved' },
  { id: '2', date: '2026-03-16', voucherNo: 'PV-02202', payTo: 'Global Logistics', account: 'Accounts Payable', amount: 1943.03, method: 'Cheque', status: 'Pending' },
  { id: '3', date: '2026-03-15', voucherNo: 'PV-02203', payTo: 'Office Essentials', account: 'Stationery Expense', amount: 892.50, method: 'Cash', status: 'Approved' },
  { id: '4', date: '2026-03-14', voucherNo: 'PV-02204', payTo: 'Power Grid Co', account: 'Electricity Expense', amount: 1540.00, method: 'Online', status: 'Approved' },
];

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);

  const columns = [
    {
      key: 'voucherNo' as const,
      label: 'Voucher #',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
            <CreditCard size={20} />
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
      key: 'payTo' as const,
      label: 'Paid To',
      filterable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <User size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'account' as const,
      label: 'Debit Account',
      render: (val: string) => <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{val}</span>
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Approved') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Settled</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Vouchers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/accounts/payments/create')}
          >
            New Voucher
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Payments', 'Verified', 'Due Settlement', 'Disputed'].map((chip, idx) => (
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
              label: 'Edit',
              icon: <Edit size={16} />,
              onClick: (item) => console.log('Edit', item),
              variant: 'secondary'
            },
            {
              label: 'Void',
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
