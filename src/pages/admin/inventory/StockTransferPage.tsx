import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Download, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

// Mock data for stock transfers
const MOCK_TRANSFERS = [
  { id: '1', date: '2026-03-15', referenceNo: 'TR-2026-001', fromWarehouse: 'Main Warehouse', toWarehouse: 'West Coast Hub', totalItems: 50, shippingCharge: 120.00, status: 'Completed' },
  { id: '2', date: '2026-03-14', referenceNo: 'TR-2026-002', fromWarehouse: 'Central Distribution', toWarehouse: 'Main Warehouse', totalItems: 100, shippingCharge: 250.00, status: 'Pending' },
  { id: '3', date: '2026-03-12', referenceNo: 'TR-2026-003', fromWarehouse: 'West Coast Hub', toWarehouse: 'South Export Terminal', totalItems: 30, shippingCharge: 85.50, status: 'Sent' },
  { id: '4', date: '2026-03-10', referenceNo: 'TR-2026-004', fromWarehouse: 'East Logistics Center', toWarehouse: 'Central Distribution', totalItems: 75, shippingCharge: 180.00, status: 'Completed' },
  { id: '5', date: '2026-03-08', referenceNo: 'TR-2026-005', fromWarehouse: 'Main Warehouse', toWarehouse: 'East Logistics Center', totalItems: 40, shippingCharge: 95.00, status: 'Completed' },
];

export const StockTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const [transfers] = useState(MOCK_TRANSFERS);

  const columns = [
    {
      key: 'referenceNo' as const,
      label: 'Ref No',
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
      key: 'fromWarehouse' as const,
      label: 'From',
      filterable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={14} className="text-rose-400" />
          {value}
        </div>
      )
    },
    {
      key: 'toWarehouse' as const,
      label: 'To',
      filterable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <MapPin size={14} className="text-emerald-400" />
          {value}
        </div>
      )
    },
    {
      key: 'totalItems' as const,
      label: 'Quantity',
      align: 'center' as const,
      render: (value: number) => <span className="font-medium text-slate-700">{value} pcs</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (value === 'Completed') variant = 'success';
        if (value === 'Pending') variant = 'warning';
        if (value === 'Sent') variant = 'info';
        
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Transfers</h1>
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
            onClick={() => navigate('/admin/inventory/transfer/create')}
          >
            New Transfer
          </Button>
        </div>
      </div>


      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={transfers}
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

