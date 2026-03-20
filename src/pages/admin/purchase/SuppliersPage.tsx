import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_SUPPLIERS = [
  { id: '1', name: 'TechNova Solutions', contact: 'John Smith', email: 'john@technova.com', phone: '+1 234 567 890', location: 'San Francisco, CA', category: 'Hardware', status: 'Active' },
  { id: '2', name: 'Office Essentials', contact: 'Sarah Jenkins', email: 'sarah@office.com', phone: '+1 987 654 321', location: 'Chicago, IL', category: 'Stationery', status: 'Active' },
  { id: '3', name: 'Global Logistics', contact: 'Mike Ross', email: 'mike@global.com', phone: '+1 456 789 012', location: 'New York, NY', category: 'Services', status: 'Inactive' },
  { id: '4', name: 'Vertex Industries', contact: 'Emma Wilson', email: 'emma@vertex.com', phone: '+1 321 654 098', location: 'Austin, TX', category: 'Manufacturing', status: 'Active' },
];

export const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers] = useState(MOCK_SUPPLIERS);

  const columns = [
    {
      key: 'name' as const,
      label: 'Corporate Entity',
      sortable: true,
      render: (value: string, item: any) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</span>
          <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={10} /> {item.location}
          </div>
        </div>
      )
    },
    {
      key: 'contact' as const,
      label: 'Primary Liason',
      render: (value: string, item: any) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-600">{value}</div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Mail size={10} /> {item.email}</span>
            <span className="flex items-center gap-1"><Phone size={10} /> {item.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category' as const,
      label: 'Business Sector',
      filterable: true,
      render: (val: string) => (
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-widest">
          {val}
        </span>
      )
    },
    {
      key: 'status' as const,
      label: 'Operational Status',
      filterable: true,
      render: (value: string) => {
        if (value === 'Active') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Qualified</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Strategic Suppliers</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/vendors/new')}
          >
            Register Entity
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Suppliers', 'Qualified Assets', 'Awaiting Verification', 'Blacklisted'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          data={suppliers}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'Edit Entity',
              icon: <Edit size={16} />,
              onClick: (item) => console.log('Edit', item),
              variant: 'secondary'
            },
            {
              label: 'Archive Supplier',
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
