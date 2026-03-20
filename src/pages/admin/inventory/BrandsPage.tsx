import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bookmark, Download, Edit, Trash2, Globe, ExternalLink } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

// Mock data for brands
const MOCK_BRANDS = [
  { id: '1', name: 'Sony', website: 'www.sony.com', origin: 'Japan', status: 'Active', productsCount: 42 },
  { id: '2', name: 'Fitbit', website: 'www.fitbit.com', origin: 'USA', status: 'Active', productsCount: 12 },
  { id: '3', name: 'Herman Miller', website: 'www.hermanmiller.com', origin: 'USA', status: 'Active', productsCount: 8 },
  { id: '4', name: 'Logitech', website: 'www.logitech.com', origin: 'Switzerland', status: 'Active', productsCount: 35 },
  { id: '5', name: 'Dell', website: 'www.dell.com', origin: 'USA', status: 'Active', productsCount: 56 },
  { id: '6', name: 'Bellroy', website: 'www.bellroy.com', origin: 'Australia', status: 'Active', productsCount: 15 },
  { id: '7', name: 'Hydro Flask', website: 'www.hydroflask.com', origin: 'USA', status: 'Active', productsCount: 22 },
  { id: '8', name: 'Bose', website: 'www.bose.com', origin: 'USA', status: 'Active', productsCount: 18 },
];

export const BrandsPage: React.FC = () => {
  const [brands] = useState(MOCK_BRANDS);

  const columns = [
    {
      key: 'name' as const,
      label: 'Brand Name',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
            <Bookmark size={20} />
          </div>
          <div className="font-semibold text-slate-900">{value}</div>
        </div>
      )
    },
    {
      key: 'website' as const,
      label: 'Website',
      render: (value: string) => (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm">
          {value}
          <ExternalLink size={12} />
        </a>
      )
    },
    {
      key: 'origin' as const,
      label: 'Origin',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Globe size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'productsCount' as const,
      label: 'Total Products',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
          {value} SKUs
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
            <span className="text-[11px] font-bold uppercase tracking-widest">Verified</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brands & Manufacturers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
          >
            Add Brand
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Manufacturers', 'Domestic', 'International', 'Top Performing'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Bookmark size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Bookmark size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Brand Portfolio</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Vendor Identity Index</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-indigo-400 font-bold text-sm">{brands.length} Registered Manufacturers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={brands}
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

