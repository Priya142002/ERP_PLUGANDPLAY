import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Phone, Mail, Award } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import { DataTableWrapper } from '../../../components/common';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState([
    { id: '1', name: 'John Doe', mobile: '+1 234-567-8900', email: 'john@example.com', loyaltyPoints: 450, totalPurchases: '$2,450', visits: 24 },
    { id: '2', name: 'Jane Smith', mobile: '+1 234-567-8901', email: 'jane@example.com', loyaltyPoints: 320, totalPurchases: '$1,850', visits: 18 },
    { id: '3', name: 'Bob Wilson', mobile: '+1 234-567-8902', email: 'bob@example.com', loyaltyPoints: 180, totalPurchases: '$980', visits: 12 },
    { id: '4', name: 'Alice Brown', mobile: '+1 234-567-8903', email: 'alice@example.com', loyaltyPoints: 520, totalPurchases: '$3,200', visits: 32 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    loyaltyPoints: 0
  });

  const columns = [
    {
      key: 'name' as const,
      label: 'Customer Name',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'mobile' as const,
      label: 'Mobile',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-slate-400" />
          <span className="text-slate-700 text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'email' as const,
      label: 'Email',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-slate-400" />
          <span className="text-slate-600 text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'loyaltyPoints' as const,
      label: 'Loyalty Points',
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-1.5">
          <Award size={14} className="text-amber-500" />
          <span className="font-bold text-amber-600 text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'totalPurchases' as const,
      label: 'Total Purchases',
      align: 'right' as const,
      render: (value: string) => <span className="font-bold text-emerald-600 text-sm">{value}</span>
    },
    {
      key: 'visits' as const,
      label: 'Visits',
      align: 'center' as const,
      render: (value: number) => <Badge variant="info" className="text-[10px]">{value}</Badge>
    }
  ];

  const actions = [
    {
      label: 'Edit',
      icon: <Edit size={14} />,
      onClick: (row: any) => {
        setSelectedCustomer(row);
        setFormData({
          name: row.name,
          mobile: row.mobile,
          email: row.email,
          loyaltyPoints: row.loyaltyPoints
        });
        setShowEditModal(true);
      },
      variant: 'primary' as const
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: (row: any) => {
        setSelectedCustomer(row);
        setShowDeleteModal(true);
      },
      variant: 'danger' as const
    }
  ];

  const handleAddCustomer = () => {
    const newCustomer = {
      id: String(customers.length + 1),
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      loyaltyPoints: formData.loyaltyPoints,
      totalPurchases: '$0',
      visits: 0
    };
    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCustomer = () => {
    setCustomers(customers.map(c => 
      c.id === selectedCustomer.id 
        ? { ...c, ...formData }
        : c
    ));
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteCustomer = () => {
    setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      loyaltyPoints: 0
    });
    setSelectedCustomer(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-1">Add, select customers and track loyalty points</p>
        </div>
        <Button 
          variant="primary" 
          className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
          leftIcon={<Plus size={14} />}
          onClick={() => setShowAddModal(true)}
        >
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Customers', value: '1,245', icon: Phone, color: 'bg-blue-600', hex: '#2563eb' },
          { label: 'Active This Month', value: '856', icon: Award, color: 'bg-emerald-600', hex: '#059669' },
          { label: 'Loyalty Members', value: '432', icon: Award, color: 'bg-purple-600', hex: '#9333ea' },
          { label: 'New This Week', value: '28', icon: Plus, color: 'bg-orange-600', hex: '#ea580c' },
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

      {/* Customer Table */}
      <DataTableWrapper
        data={customers}
        columns={columns}
        actions={actions}
        emptyMessage="No customers found"
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Customer"
      >
        <div className="space-y-4">
          <Input
            label="Customer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder="+1 234-567-8900"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="customer@example.com"
            required
          />
          <Input
            label="Initial Loyalty Points"
            type="number"
            value={String(formData.loyaltyPoints)}
            onChange={(e) => setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })}
            placeholder="0"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Customer"
      >
        <div className="space-y-4">
          <Input
            label="Customer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder="+1 234-567-8900"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="customer@example.com"
            required
          />
          <Input
            label="Loyalty Points"
            type="number"
            value={String(formData.loyaltyPoints)}
            onChange={(e) => setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })}
            placeholder="0"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleEditCustomer}
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
          setSelectedCustomer(null);
        }}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-bold text-slate-900">{selectedCustomer?.name}</span>? This action cannot be undone.
          </p>
          {selectedCustomer && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mobile:</span>
                  <span className="font-medium text-slate-900">{selectedCustomer.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Loyalty Points:</span>
                  <span className="font-bold text-amber-600">{selectedCustomer.loyaltyPoints}</span>
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
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDeleteCustomer}
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
