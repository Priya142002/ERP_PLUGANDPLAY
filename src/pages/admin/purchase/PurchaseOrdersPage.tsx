import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, User, FileCheck } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_ORDERS = [
  { id: '1', date: '2026-03-16', orderNo: 'PO-9001', vendor: 'TechNova Solutions', amount: 3500.00, expectedDate: '2026-03-25', status: 'Approved' },
  { id: '2', date: '2026-03-15', orderNo: 'PO-9002', vendor: 'Office Essentials', amount: 1250.50, expectedDate: '2026-03-22', status: 'Pending' },
  { id: '3', date: '2026-03-14', orderNo: 'PO-9003', vendor: 'Global Logistics', amount: 450.00, expectedDate: '2026-03-20', status: 'Received' },
  { id: '4', date: '2026-03-12', orderNo: 'PO-9004', vendor: 'Vertex Industries', amount: 8900.00, expectedDate: '2026-03-30', status: 'Cancelled' },
];

export const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState(MOCK_ORDERS);

  const columns = [
    {
      key: 'orderNo' as const,
      label: 'Order ID',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Order Date',
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
      label: 'Strategic Vendor',
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
      label: 'Planned Value',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Pipeline Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Approved') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Authorized</span>
          </div>
        );
        if (value === 'Received') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Fulfilled</span>
          </div>
        );
        if (value === 'Cancelled') return (
          <div className="flex items-center gap-1.5 text-rose-600">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Voided</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Awaiting Review</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Procurement Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/orders/new')}
          >
            New Procurement Order
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Orders', 'Active Supply', 'Pending Authorization', 'Voided Entries'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          data={orders}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'View / Edit',
              icon: <Edit size={16} />,
              onClick: (item) => console.log('Edit', item),
              variant: 'secondary'
            },
            {
              label: 'Convert to Invoice',
              icon: <FileCheck size={16} />,
              onClick: (item) => console.log('Convert', item),
              variant: 'primary'
            },
            {
              label: 'Discard',
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
