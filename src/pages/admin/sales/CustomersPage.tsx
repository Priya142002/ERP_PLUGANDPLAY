import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Mail, MapPin } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Nexus Enterprises', code: 'CUS-001', contact: 'Alex Rivera', email: 'alex@nexus.com', phone: '+1 415 555 0123', location: 'San Francisco, USA', status: 'Active', totalOrders: 42 },
  { id: '2', name: 'Global Trade Corp', code: 'CUS-002', contact: 'Sarah Jenkins', email: 'sarah@globaltrade.com', phone: '+1 212 555 0198', location: 'New York, USA', status: 'Active', totalOrders: 15 },
  { id: '3', name: 'Urban Styles', code: 'CUS-003', contact: 'Marcus Thorne', email: 'marcus@urbanstyles.com', phone: '+44 20 7946 0958', location: 'London, UK', status: 'Inactive', totalOrders: 8 },
  { id: '4', name: 'Tech Sphere Ltd', code: 'CUS-004', contact: 'Elena Gilbert', email: 'elena@techsphere.io', phone: '+49 30 1234567', location: 'Berlin, Germany', status: 'Active', totalOrders: 124 },
  { id: '5', name: 'Blue Sky Retail', code: 'CUS-005', contact: 'James Wilson', email: 'james@bluesky.com', phone: '+61 2 9876 5432', location: 'Sydney, Australia', status: 'Active', totalOrders: 29 },
];

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers] = useState(MOCK_CUSTOMERS);

  const columns = [
    {
      key: 'name' as const,
      label: 'Customer Name',
      sortable: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 font-bold">
            {value.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{value}</div>
            <div className="text-xs text-slate-400 font-medium tracking-wider uppercase">{item.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact' as const,
      label: 'Contact Details',
      render: (value: string, item: any) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-700">{value}</div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium lowercase">
            <Mail size={10} /> {item.email}
          </div>
        </div>
      )
    },
    {
      key: 'location' as const,
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={12} className="text-slate-400" />
          <span className="truncate max-w-[150px]">{value}</span>
        </div>
      )
    },
    {
      key: 'totalOrders' as const,
      label: 'Orders',
      align: 'center' as const,
      render: (val: number) => <span className="font-semibold text-slate-900">{val}</span>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Directory</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/customers/add')}
          >
            New Customer
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {['All Entities', 'Strategic Partners', 'Active Accounts', 'Recent Inbound'].map((chip, idx) => (
          <button key={chip} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
            {chip}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={customers}
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

