import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, FilePlus, Download, Edit, Trash2, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

const MOCK_DEBIT_NOTES = [
  { id: '1', date: '2026-03-15', noteNo: 'CDN-4001', customer: 'Nexus Enterprises', amount: 250.00, reason: 'Underbilling Correction', status: 'Sent' },
  { id: '2', date: '2026-03-11', noteNo: 'CDN-4002', customer: 'Sarah Johnson', amount: 45.00, reason: 'Additional Services', status: 'Recorded' },
  { id: '3', date: '2026-03-09', noteNo: 'CDN-4003', customer: 'Global Trade Corp', amount: 115.00, reason: 'Price Difference', status: 'Sent' },
];

export const CustomerDebitNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [notes] = useState(MOCK_DEBIT_NOTES);

  const columns = [
    {
      key: 'noteNo' as const,
      label: 'Debit Note #',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
            <FilePlus size={20} />
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
      label: 'Debit Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-orange-600">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => (
        <Badge variant={value === 'Sent' ? 'info' : 'default'}>{value}</Badge>
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
