import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Download, Edit, Trash2, Calendar, Warehouse } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

// Mock data for Opening Stock
const MOCK_OPENING_STOCK = [
  { id: '1', date: '2026-01-01', entryNo: 'OS-2026-001', warehouse: 'Main Warehouse', totalItems: 120, totalValue: 45000.00, status: 'Posted' },
  { id: '2', date: '2026-01-02', entryNo: 'OS-2026-002', warehouse: 'West Coast Hub', totalItems: 85, totalValue: 28400.00, status: 'Draft' },
  { id: '3', date: '2026-01-05', entryNo: 'OS-2026-003', warehouse: 'Central Distribution', totalItems: 200, totalValue: 92000.00, status: 'Posted' },
];

export const OpeningStockPage: React.FC = () => {
  const [entries] = useState(MOCK_OPENING_STOCK);

  const columns = [
    {
      key: 'entryNo' as const,
      label: 'Entry No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <Play size={20} />
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
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Warehouse size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'totalItems' as const,
      label: 'Total Items',
      align: 'center' as const,
      render: (val: number) => <span className="font-medium">{val} units</span>
    },
    {
      key: 'totalValue' as const,
      label: 'Total Value',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (value === 'Posted') variant = 'success';
        if (value === 'Draft') variant = 'warning';
        
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Opening Stock</h1>
          <p className="text-slate-500 mt-1">Initialize your inventory levels for the new financial year</p>
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
            New Entry
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Play size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Play size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Fiscal Initialization</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Opening Records</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{entries.length} Initial Balances Documented</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={entries}
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
