import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Phone, Mail } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_VENDORS = [
  { id: '1', name: 'TechNova Solutions', code: 'VND-001', contact: 'John Carter', email: 'john@technova.com', phone: '+1 234 567 890', location: 'New York, USA', status: 'Active', balance: '$2,400.00' },
  { id: '2', name: 'Global Logistics', code: 'VND-002', contact: 'Sarah Jenkins', email: 'sarah@globallog.com', phone: '+1 987 654 321', location: 'London, UK', status: 'Active', balance: '$0.00' },
  { id: '3', name: 'Office Essentials', code: 'VND-003', contact: 'Michael Ross', email: 'mike@office.com', phone: '+44 20 7946 0958', location: 'Toronto, CA', status: 'Inactive', balance: '$850.00' },
  { id: '4', name: 'Vertex Industries', code: 'VND-004', contact: 'Harvey Specter', email: 'harvey@vertex.com', phone: '+1 555 010 999', location: 'Chicago, USA', status: 'Active', balance: '$12,400.00' },
  { id: '5', name: 'Pure Water Co.', code: 'VND-005', contact: 'Donna Paulsen', email: 'donna@purewater.com', phone: '+1 555 010 888', location: 'Miami, USA', status: 'Active', balance: '$0.00' },
];

export const VendorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [vendors] = useState(MOCK_VENDORS);

  const columns = [
    {
      key: 'name' as const,
      label: 'Vendor Name',
      sortable: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-[#002147] border border-slate-100 font-bold text-sm">
            {value.charAt(0)}
          </div>
          <div>
            <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#002147] transition-colors">{value}</div>
            <div className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-1">{item.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact' as const,
      label: 'Contact Person',
      render: (value: string, item: any) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-700">{value}</div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
            <Mail size={10} /> {item.email}
          </div>
        </div>
      )
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Phone size={12} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'balance' as const,
      label: 'Outstanding Balance',
      align: 'right' as const,
      render: (val: string) => <span className={`font-bold ${parseFloat(val.replace(/[$,]/g, '')) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{val}</span>
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
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
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
            onClick={() => navigate('/admin/purchase/vendors/add')}
          >
            New Vendor
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Suppliers', 'Critical Partners', 'Active Vendors', 'Recent Contracts'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <DataTable 
          data={vendors}
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
