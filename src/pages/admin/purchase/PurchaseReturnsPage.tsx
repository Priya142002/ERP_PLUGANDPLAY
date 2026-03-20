import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_RETURNS = [
  { id: '1', date: '2026-03-10', returnNo: 'PRET-5001', invoiceNo: 'PINV-2026-001', vendor: 'TechNova Solutions', amount: 450.00, reason: 'Damaged Items', status: 'Completed' },
  { id: '2', date: '2026-03-08', returnNo: 'PRET-5002', invoiceNo: 'PINV-2026-004', vendor: 'Vertex Industries', amount: 1200.00, reason: 'Wrong Specification', status: 'Processing' },
  { id: '3', date: '2026-03-05', returnNo: 'PRET-5003', invoiceNo: 'PINV-2026-012', vendor: 'Office Essentials', amount: 85.00, reason: 'Duplicate Order', status: 'Completed' },
];

export const PurchaseReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [returns] = useState(MOCK_RETURNS);

  const columns = [
    {
      key: 'returnNo' as const,
      label: 'Return No',
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
      key: 'invoiceNo' as const,
      label: 'Ref Invoice',
      render: (val: string) => (
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
          <FileText size={12} /> {val}
        </div>
      )
    },
    {
      key: 'vendor' as const,
      label: 'Vendor',
      filterable: true,
    },
    {
      key: 'amount' as const,
      label: 'Return Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-rose-600">-${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Completed') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Settled</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Restitutions</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/returns/new')}
          >
            New Return
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Restitutions', 'Processed', 'Intake Pending', 'Disputed'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={returns}
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
