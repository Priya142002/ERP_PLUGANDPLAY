import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, XCircle, RotateCcw, Edit, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { DataTableWrapper } from '../../../components/common';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState([
    { id: '1', orderId: 'ORD-001', customer: 'John Doe', items: 3, amount: '$125.50', status: 'Completed', date: '2026-03-24 10:45 AM' },
    { id: '2', orderId: 'ORD-002', customer: 'Jane Smith', items: 5, amount: '$245.00', status: 'Hold', date: '2026-03-24 10:42 AM' },
    { id: '3', orderId: 'ORD-003', customer: 'Bob Wilson', items: 2, amount: '$85.00', status: 'Cancelled', date: '2026-03-24 10:38 AM' },
    { id: '4', orderId: 'ORD-004', customer: 'Alice Brown', items: 4, amount: '$180.75', status: 'Returned', date: '2026-03-24 10:35 AM' },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    customer: '',
    items: 0,
    amount: '',
    status: ''
  });

  const columns = [
    {
      key: 'orderId' as const,
      label: 'Order ID',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'customer' as const,
      label: 'Customer',
      render: (value: string) => <span className="text-slate-700 text-sm">{value}</span>
    },
    {
      key: 'items' as const,
      label: 'Items',
      align: 'center' as const,
      render: (value: number) => <span className="text-slate-600 text-sm">{value}</span>
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (value: string) => <span className="font-bold text-emerald-600 text-sm">{value}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        const variants: any = {
          'Completed': 'success',
          'Hold': 'warning',
          'Cancelled': 'error',
          'Returned': 'info'
        };
        return <Badge variant={variants[value]} className="text-[10px]">{value}</Badge>;
      }
    },
    {
      key: 'date' as const,
      label: 'Date & Time',
      render: (value: string) => <span className="text-slate-500 text-xs">{value}</span>
    }
  ];

  const actions = [
    {
      label: 'Edit',
      icon: <Edit size={14} />,
      onClick: (row: any) => {
        setSelectedOrder(row);
        setEditFormData({
          customer: row.customer,
          items: row.items,
          amount: row.amount,
          status: row.status
        });
        setShowEditModal(true);
      },
      variant: 'primary' as const
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: (row: any) => {
        setSelectedOrder(row);
        setShowDeleteModal(true);
      },
      variant: 'danger' as const
    }
  ];

  const handleEditOrder = () => {
    setOrders(orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, ...editFormData }
        : order
    ));
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = () => {
    setOrders(orders.filter(order => order.id !== selectedOrder.id));
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <p className="text-sm text-slate-500 mt-1">Hold, Resume, Cancel orders and process returns & refunds</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'On Hold', value: '12', icon: Clock, color: 'bg-amber-600', hex: '#d97706' },
          { label: 'Completed Today', value: '156', icon: Play, color: 'bg-emerald-600', hex: '#059669' },
          { label: 'Cancelled', value: '8', icon: XCircle, color: 'bg-red-600', hex: '#dc2626' },
          { label: 'Returns', value: '5', icon: RotateCcw, color: 'bg-blue-600', hex: '#2563eb' },
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

      {/* Orders Table */}
      <DataTableWrapper
        data={orders}
        columns={columns}
        actions={actions}
        emptyMessage="No orders found"
      />

      {/* Edit Order Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOrder(null);
        }}
        title="Edit Order"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 mb-1">Order ID</p>
            <p className="text-sm font-bold text-slate-900">{selectedOrder?.orderId}</p>
          </div>
          <Input
            label="Customer Name"
            value={editFormData.customer}
            onChange={(e) => setEditFormData({ ...editFormData, customer: e.target.value })}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Number of Items"
            type="number"
            value={String(editFormData.items)}
            onChange={(e) => setEditFormData({ ...editFormData, items: Number(e.target.value) })}
            placeholder="0"
            required
          />
          <Input
            label="Amount"
            value={editFormData.amount}
            onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
            placeholder="$0.00"
            required
          />
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Status</label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
            >
              <option value="Completed">Completed</option>
              <option value="Hold">Hold</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowEditModal(false);
                setSelectedOrder(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleEditOrder}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedOrder(null);
        }}
        title="Delete Order"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete order <span className="font-bold text-slate-900">{selectedOrder?.orderId}</span>? This action cannot be undone.
          </p>
          {selectedOrder && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium text-slate-900">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Items:</span>
                  <span className="font-medium text-slate-900">{selectedOrder.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-bold text-emerald-600">{selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className="font-medium text-slate-900">{selectedOrder.status}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedOrder(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDeleteOrder}
            >
              Delete Order
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
