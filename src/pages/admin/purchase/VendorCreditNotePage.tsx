import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_CREDIT_NOTES = [
  { id: '1', date: '2026-03-12', noteNo: 'VCN-3001', vendor: 'TechNova Solutions', amount: 350.50, reason: 'Price Adjustment', status: 'Approved' },
  { id: '2', date: '2026-03-10', noteNo: 'VCN-3002', vendor: 'Vertex Industries', amount: 800.00, reason: 'Return Credit', status: 'Pending' },
  { id: '3', date: '2026-03-05', noteNo: 'VCN-3003', vendor: 'Global Logistics', amount: 120.00, reason: 'Discount Applied', status: 'Approved' },
];

export const VendorCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [notes] = useState(MOCK_CREDIT_NOTES);

  const columns = [
    {
      key: 'noteNo' as const,
      label: 'Credit Note #',
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
    },
    {
      key: 'amount' as const,
      label: 'Credit Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-teal-600">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Approved') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Authorized</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Credit Ledger</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/credit-note/new')}
          >
            New Credit Note
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Credit Notes', 'Authorized', 'Awaiting Review', 'Adjustment Claims'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
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
