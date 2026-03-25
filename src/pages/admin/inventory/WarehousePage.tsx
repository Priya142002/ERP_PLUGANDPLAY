import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Building2, MapPin, Phone, User, Download, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

// Mock data for warehouses
const MOCK_WAREHOUSES = [
  { id: '1', name: 'Main Warehouse', code: 'WH-001', location: 'New York, NY', phone: '+1 212-555-0198', manager: 'John Doe', status: 'Active' },
  { id: '2', name: 'West Coast Hub', code: 'WH-002', location: 'Los Angeles, CA', phone: '+1 310-555-0124', manager: 'Jane Smith', status: 'Active' },
  { id: '3', name: 'Central Distribution', code: 'WH-003', location: 'Chicago, IL', phone: '+1 312-555-0145', manager: 'Mike Johnson', status: 'Active' },
  { id: '4', name: 'South Export Terminal', code: 'WH-004', location: 'Miami, FL', phone: '+1 305-555-0176', manager: 'Sarah Williams', status: 'Maintenance' },
  { id: '5', name: 'East Logistics Center', code: 'WH-005', location: 'Boston, MA', phone: '+1 617-555-0132', manager: 'Robert Brown', status: 'Active' },
];

export const WarehousePage: React.FC = () => {
  const [warehouses] = useState(MOCK_WAREHOUSES);

  const handleExport = () => {
    const headers = ['Warehouse Code', 'Warehouse Name', 'Location', 'Manager', 'Phone', 'Status'];
    const data = warehouses.map(wh => [
      wh.code,
      wh.name,
      wh.location,
      wh.manager,
      wh.phone,
      wh.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Warehouses');
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Warehouse',
      sortable: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#002147] shadow-sm border border-slate-100">
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'location' as const,
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'manager' as const,
      label: 'Manager',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <User size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'phone' as const,
      label: 'Contact',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Phone size={14} className="text-slate-400" />
          {value}
        </div>
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
            <span className="text-[11px] font-bold uppercase tracking-widest">Available</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Maintenance</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Warehouses</h1>
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
            Add Warehouse
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Locations', 'Active Hubs', 'Under Maintenance', 'Export Terminals'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Building2 size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Infrastructure Hub</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Storage Network</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{warehouses.length} Active Storage Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={warehouses}
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

