import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings2, Calendar, ClipboardCheck, ArrowUpRight, ArrowDownRight, Download, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

// Mock data for stock adjustments
const MOCK_ADJUSTMENTS = [
  { id: '1', date: '2026-03-15', referenceNo: 'ADJ-2026-001', warehouse: 'Main Warehouse', type: 'Addition', totalItems: 12, reason: 'Found during inventory count', status: 'Completed' },
  { id: '2', date: '2026-03-14', referenceNo: 'ADJ-2026-002', warehouse: 'West Coast Hub', type: 'Subtraction', totalItems: 5, reason: 'Damaged during handling', status: 'Completed' },
  { id: '3', date: '2026-03-12', referenceNo: 'ADJ-2026-003', warehouse: 'Central Distribution', type: 'Addition', totalItems: 24, reason: 'Stock correction', status: 'Pending' },
  { id: '4', date: '2026-03-10', referenceNo: 'ADJ-2026-004', warehouse: 'Main Warehouse', type: 'Subtraction', totalItems: 3, reason: 'Expired products', status: 'Completed' },
  { id: '5', date: '2026-03-08', referenceNo: 'ADJ-2026-005', warehouse: 'South Export Terminal', type: 'Addition', totalItems: 8, reason: 'Unrecorded return', status: 'Completed' },
];

export const StockAdjustmentPage: React.FC = () => {
  const [adjustments] = useState(MOCK_ADJUSTMENTS);

  const columns = [
    {
      key: 'referenceNo' as const,
      label: 'Ref No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
            <ClipboardCheck size={20} />
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
      key: 'warehouse' as const,
      label: 'Warehouse',
      filterable: true,
    },
    {
      key: 'type' as const,
      label: 'Type',
      filterable: true,
      render: (value: string) => (
        <div className={`flex items-center gap-1.5 font-medium ${value === 'Addition' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {value === 'Addition' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {value}
        </div>
      )
    },
    {
      key: 'totalItems' as const,
      label: 'Total Items',
      align: 'center' as const,
      render: (value: number) => <span className="font-medium text-slate-700">{value}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        const variant = value === 'Completed' ? 'success' : 'warning';
        return <Badge variant={variant}>{value}</Badge>;
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Adjustments</h1>
          <p className="text-slate-500 mt-1">Adjust inventory levels for corrections and damage</p>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button 
            variant="secondary" 
            className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all border-slate-200"
            leftIcon={<Download size={14} />}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#334e68] hover:bg-[#243b53] text-white border-none shadow-lg shadow-indigo-500/10 rounded-xl px-4 md:px-8 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all"
            leftIcon={<Plus size={16} />}
          >
            Add Adjustment
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Settings2 size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Settings2 size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Inventory Alignment</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Correction Ledger</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{adjustments.length} Stock Adjustments Documented</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={adjustments}
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

