import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Download, Trash2, Calendar, User } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

const MOCK_PAYMENTS = [
  { id: '1', date: '2026-03-16', paymentNo: 'RCPT-8001', customer: 'Nexus Enterprises', amount: 13020.00, method: 'Bank Transfer', reference: 'TXN_992201', status: 'Completed' },
  { id: '2', date: '2026-03-15', paymentNo: 'RCPT-8002', customer: 'Sarah Johnson', amount: 893.03, method: 'Online Payment', reference: 'STRIPE_0224', status: 'Completed' },
  { id: '3', date: '2026-03-14', paymentNo: 'RCPT-8003', customer: 'Urban Styles', amount: 3045.00, method: 'Cash', reference: 'CASH_110', status: 'Completed' },
  { id: '4', date: '2026-03-12', paymentNo: 'RCPT-8004', customer: 'Global Trade Corp', amount: 4410.00, method: 'Cheque', reference: 'CHQ_5502', status: 'Processing' },
];

export const CustomerPaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments] = useState(MOCK_PAYMENTS);

  const columns = [
    {
      key: 'paymentNo' as const,
      label: 'Receipt No',
      sortable: true,
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
      label: 'Received Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
      render: (value: string) => (
        <Badge variant={value === 'Completed' ? 'success' : 'warning'}>{value}</Badge>
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
          <Button variant="secondary" leftIcon={<Download size={14} />} className="rounded-xl border-slate-200 h-10 text-xs font-bold px-4">
            Export
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/payments/new')}
            className="bg-[#002147] hover:bg-[#003366] text-white h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all px-6"
          >
            New Payment
          </Button>
        </div>
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
