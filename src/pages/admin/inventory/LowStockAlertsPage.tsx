import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bell, AlertTriangle, Package, Warehouse, ShoppingCart, Send } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";

// Mock data for Low Stock Alerts
const MOCK_LOW_STOCK = [
  { id: '1', sku: 'ELEC-HD-001', name: 'Premium Headphones', warehouse: 'Main Warehouse', currentStock: 5, minLevel: 10, priority: 'High', status: 'Pending Order' },
  { id: '2', sku: 'WEAR-SW-002', name: 'Smart Watch v2', warehouse: 'West Coast Hub', currentStock: 2, minLevel: 15, priority: 'Critical', status: 'Out of Stock' },
  { id: '3', sku: 'APPL-CM-003', name: 'Coffee Maker', warehouse: 'Central Distribution', currentStock: 8, minLevel: 10, priority: 'Medium', status: 'In Procurement' },
  { id: '4', sku: 'ACC-WM-004', name: 'Wireless Mouse', warehouse: 'Main Warehouse', currentStock: 12, minLevel: 25, priority: 'Low', status: 'Check Needed' },
  { id: '5', sku: 'ACC-LS-005', name: 'Laptop Stand', warehouse: 'East Terminal', currentStock: 3, minLevel: 12, priority: 'High', status: 'Pending Order' },
];

export const LowStockAlertsPage: React.FC = () => {
  const [alerts] = useState(MOCK_LOW_STOCK);

  const columns = [
    {
      key: 'name' as const,
      label: 'Product Name',
      sortable: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
            <Package size={20} />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{value}</div>
            <div className="text-xs text-slate-400">{item.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'warehouse' as const,
      label: 'Warehouse',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Warehouse size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'currentStock' as const,
      label: 'Current Stock',
      align: 'center' as const,
      render: (val: number, item: any) => (
        <div className="flex flex-col items-center">
          <span className={`font-bold ${val <= item.minLevel / 2 ? 'text-rose-600' : 'text-amber-600'}`}>
            {val}
          </span>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Min: {item.minLevel}</span>
        </div>
      )
    },
    {
      key: 'priority' as const,
      label: 'Priority',
      filterable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'info' | 'default' | 'error' = 'default';
        if (value === 'Critical') variant = 'error';
        if (value === 'High') variant = 'warning';
        if (value === 'Medium') variant = 'info';
        
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: 'status' as const,
      label: 'Status',
      filterable: true,
      render: (value: string) => (
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {value}
        </span>
      )
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Low Stock Alerts</h1>
          <p className="text-slate-500 mt-1">Monitor items that are running low and need replenishment</p>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <Button 
            variant="secondary" 
            className="rounded-xl px-4 md:px-6 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all border-slate-200"
            leftIcon={<ShoppingCart size={14} />}
          >
            Purchase Orders
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#334e68] hover:bg-[#243b53] text-white border-none shadow-lg shadow-indigo-500/10 rounded-xl px-4 md:px-8 h-9 md:h-10 text-[10px] md:text-xs font-bold transition-all"
            leftIcon={<Plus size={16} />}
          >
            New Reorder
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12 pointer-events-none">
          <Bell size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300 border border-indigo-500/10 shadow-inner">
              <Bell size={22} />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Replenishment Engine</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Critical Watchlist</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-rose-400 font-bold text-sm">{alerts.length} Items Below Safety Level</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border-l-4 border-rose-500 shadow-sm overflow-hidden relative">
          <p className="text-slate-500 text-sm font-medium">Critical Stock</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">12 Items</p>
          <AlertTriangle className="absolute -right-2 -bottom-2 text-rose-500 opacity-5" size={80} />
        </div>
        <div className="bg-white p-6 rounded-2xl border-l-4 border-amber-500 shadow-sm overflow-hidden relative">
          <p className="text-slate-500 text-sm font-medium">Low Stock</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">28 Items</p>
          <Package className="absolute -right-2 -bottom-2 text-amber-500 opacity-5" size={80} />
        </div>
        <div className="bg-white p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm overflow-hidden relative">
          <p className="text-slate-500 text-sm font-medium">Under Procurement</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">15 Items</p>
          <Send className="absolute -right-2 -bottom-2 text-indigo-500 opacity-5" size={80} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <DataTable 
          data={alerts}
          columns={columns}
          searchable
          filterable
          paginated
          pageSize={10}
          actions={[
            {
              label: 'Reorder',
              icon: <Plus size={16} />,
              onClick: (item) => console.log('Reorder', item),
              variant: 'primary'
            }
          ]}
        />
      </div>
    </motion.div>
  );
};

