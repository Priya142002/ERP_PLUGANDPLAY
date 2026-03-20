import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, FileMinus, Download, Edit, Trash2, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

const MOCK_CREDIT_NOTES = [
  { id: '1', date: '2026-03-14', noteNo: 'CCN-3001', customer: 'Nexus Enterprises', amount: 450.00, reason: 'Returned Goods', status: 'Approved' },
  { id: '2', date: '2026-03-12', noteNo: 'CCN-3002', customer: 'Global Trade Corp', amount: 120.00, reason: 'Overcharge Correction', status: 'Pending' },
  { id: '3', date: '2026-03-08', noteNo: 'CCN-3003', customer: 'Urban Styles', amount: 85.00, reason: 'Sales Return', status: 'Approved' },
];

export const CustomerCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [notes] = useState(MOCK_CREDIT_NOTES);

  const columns = [
    {
      key: 'noteNo' as const,
      label: 'Credit Note #',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
            <FileMinus size={20} />
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
    },
    {
      key: 'amount' as const,
      label: 'Credit Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-teal-600">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => (
        <Badge variant={value === 'Approved' ? 'success' : 'warning'}>{value}</Badge>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Equity Realignment</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Download size={14} />} className="rounded-xl border-slate-200 h-10 text-xs font-bold px-4">
            Export
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/credit-note/new')}
            className="bg-[#002147] hover:bg-[#003366] text-white h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all px-6"
          >
            New Credit Note
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={notes}
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
