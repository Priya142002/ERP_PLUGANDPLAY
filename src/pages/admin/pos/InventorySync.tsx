import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, RefreshCw, TrendingDown, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { DataTableWrapper } from '../../../components/common';

export const InventorySync: React.FC = () => {
  const [products] = useState([
    { id: '1', name: 'Product A', sku: 'SKU-001', currentStock: 45, soldToday: 12, lowStockAlert: false },
    { id: '2', name: 'Product B', sku: 'SKU-002', currentStock: 8, soldToday: 5, lowStockAlert: true },
    { id: '3', name: 'Product C', sku: 'SKU-003', currentStock: 120, soldToday: 8, lowStockAlert: false },
    { id: '4', name: 'Product D', sku: 'SKU-004', currentStock: 3, soldToday: 15, lowStockAlert: true },
  ]);

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncComplete(false);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSyncModal(false);
        setSyncComplete(false);
      }, 2000);
    }, 2000);
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Product Name',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'sku' as const,
      label: 'SKU',
      render: (value: string) => <span className="text-slate-600 text-sm">{value}</span>
    },
    {
      key: 'currentStock' as const,
      label: 'Current Stock',
      align: 'center' as const,
      render: (value: number, row: any) => (
        <span className={`font-bold text-sm ${row.lowStockAlert ? 'text-red-600' : 'text-slate-900'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'soldToday' as const,
      label: 'Sold Today',
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-1.5">
          <TrendingDown size={14} className="text-blue-600" />
          <span className="font-bold text-blue-600 text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'lowStockAlert' as const,
      label: 'Status',
      render: (value: boolean) => (
        value ? (
          <Badge variant="error" className="text-[10px]">
            <AlertTriangle size={10} className="mr-1" />
            Low Stock
          </Badge>
        ) : (
          <Badge variant="success" className="text-[10px]">In Stock</Badge>
        )
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Sync</h1>
          <p className="text-sm text-slate-500 mt-1">Stock updates after sales and low stock alerts</p>
        </div>
        <Button 
          variant="primary" 
          className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
          leftIcon={<RefreshCw size={14} />}
          onClick={() => {
            setShowSyncModal(true);
            handleSync();
          }}
        >
          Sync Now
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Products', value: '245', icon: Package, color: 'bg-blue-600', hex: '#2563eb' },
          { label: 'In Stock', value: '198', icon: Package, color: 'bg-emerald-600', hex: '#059669' },
          { label: 'Low Stock Alerts', value: '32', icon: AlertTriangle, color: 'bg-amber-600', hex: '#d97706' },
          { label: 'Out of Stock', value: '15', icon: AlertTriangle, color: 'bg-red-600', hex: '#dc2626' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative p-5 rounded-xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: stat.hex }} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200 group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sync Status */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-bold text-blue-900">Last Synced</p>
              <p className="text-xs text-blue-700">2 minutes ago</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px]">Auto-Sync Enabled</Badge>
        </div>
      </div>

      {/* Products Table */}
      <DataTableWrapper
        data={products}
        columns={columns}
        actions={[]}
        emptyMessage="No products found"
      />

      {/* Sync Modal */}
      <Modal
        isOpen={showSyncModal}
        onClose={() => {
          if (!isSyncing) {
            setShowSyncModal(false);
            setSyncComplete(false);
          }
        }}
        title="Inventory Sync"
      >
        <div className="space-y-4 text-center py-6">
          {isSyncing && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto"
              >
                <RefreshCw size={64} className="text-blue-600" />
              </motion.div>
              <div>
                <p className="text-lg font-bold text-slate-900 mb-2">Syncing Inventory...</p>
                <p className="text-sm text-slate-600">Please wait while we update stock levels</p>
              </div>
            </>
          )}
          
          {syncComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle size={64} className="text-emerald-600 mx-auto mb-4" />
              <p className="text-lg font-bold text-emerald-600 mb-2">Sync Complete!</p>
              <p className="text-sm text-slate-600">All inventory data has been updated successfully</p>
            </motion.div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};
