import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, Building2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

// Mock data for Product Receive
const MOCK_RECEIVES = [
  { id: '1', date: '2026-03-16', receiveNo: 'REC-50012', source: 'West Coast Hub', warehouse: 'Main Warehouse', items: 50, receivedBy: 'John Carter', status: 'Completed' },
  { id: '2', date: '2026-03-15', receiveNo: 'REC-50011', source: 'Dell Warehouse', warehouse: 'Central Distribution', items: 120, receivedBy: 'Sarah Doe', status: 'In Transit' },
  { id: '3', date: '2026-03-14', receiveNo: 'REC-50010', source: 'Sony Logistics', warehouse: 'Main Warehouse', items: 34, receivedBy: 'Mike Ross', status: 'Partially Received' },
  { id: '4', date: '2026-03-13', receiveNo: 'REC-50009', source: 'East Terminal', warehouse: 'Sub WH-02', items: 45, receivedBy: 'Rachel Green', status: 'Completed' },
  { id: '5', date: '2026-03-12', receiveNo: 'REC-50008', source: 'Nike Factory', warehouse: 'Main Warehouse', items: 200, receivedBy: 'John Carter', status: 'Pending' },
];

export const ProductReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const [receives] = useState(MOCK_RECEIVES);

  const columns = [
    {
      key: 'receiveNo' as const,
      label: 'Receive No',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
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
      key: 'source' as const,
      label: 'Source',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Building2 size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'items' as const,
      label: 'Qty Received',
      align: 'center' as const,
      render: (val: number) => <span className="font-medium">{val} units</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (value === 'Completed') variant = 'success';
        if (value === 'In Transit') variant = 'info';
        if (value === 'Pending' || value === 'Partially Received') variant = 'warning';
        
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Receiving</h1>
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
            className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 rounded-xl px-4 md:px-8 h-10 text-[10px] md:text-xs font-bold transition-all active:scale-95"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/admin/inventory/receive/create')}
          >
            New Receipt
          </Button>
        </div>
      </div>


      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={receives}
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
