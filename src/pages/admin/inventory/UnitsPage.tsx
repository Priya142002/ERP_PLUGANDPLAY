import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Scale, Download, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

// Mock data for units
const MOCK_UNITS = [
  { id: '1', name: 'Piece', shortName: 'pc', allowDecimal: 'No', status: 'Active' },
  { id: '2', name: 'Kilogram', shortName: 'kg', allowDecimal: 'Yes', status: 'Active' },
  { id: '3', name: 'Gram', shortName: 'g', allowDecimal: 'Yes', status: 'Active' },
  { id: '4', name: 'Liter', shortName: 'L', allowDecimal: 'Yes', status: 'Active' },
  { id: '5', name: 'Meter', shortName: 'm', allowDecimal: 'Yes', status: 'Active' },
  { id: '6', name: 'Box', shortName: 'box', allowDecimal: 'No', status: 'Active' },
  { id: '7', name: 'Dozen', shortName: 'dz', allowDecimal: 'No', status: 'Active' },
  { id: '8', name: 'Pack', shortName: 'pk', allowDecimal: 'No', status: 'Active' },
];

export const UnitsPage: React.FC = () => {
  const [units] = useState(MOCK_UNITS);

  const handleExport = () => {
    const headers = ['Unit Name', 'Short Name', 'Allow Decimal', 'Status'];
    const data = units.map(unit => [
      unit.name,
      unit.shortName,
      unit.allowDecimal,
      unit.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Units_of_Measure');
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Unit Name',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
            <Scale size={20} />
          </div>
          <div className="font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
        </div>
      )
    },
    {
      key: 'shortName' as const,
      label: 'Short Name',
      sortable: true,
      render: (value: string) => (
        <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest">
          {value}
        </span>
      )
    },
    {
      key: 'allowDecimal' as const,
      label: 'Allow Decimal',
      render: (value: string) => (
        <span className={`text-sm ${value === 'Yes' ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Active') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Active</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Inactive</span>
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
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Units of Measure</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
          >
            Add Unit
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Definitions', 'Base Units', 'Compound Units', 'Recently Defined'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Scale size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Scale size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Standardization Matrix</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Measurement Units</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{units.length} Unit Definitions Registered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={units}
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

