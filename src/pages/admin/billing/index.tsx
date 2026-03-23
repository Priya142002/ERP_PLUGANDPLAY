import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { TableFilters, DataTableWrapper } from '../../../components/common';

export const BillingDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$428,240', icon: 'cash', color: 'bg-slate-600', trend: '+18% MoM' },
    { label: 'Outstanding', value: '$24,500', icon: 'clock', color: 'bg-rose-600', trend: '12 Overdue' },
    { label: 'Recurring Rev.', value: '$86,000', icon: 'refresh', color: 'bg-blue-600', trend: 'Active Subs' },
    { label: 'Avg Payout', value: '$1,240', icon: 'document-text', color: 'bg-indigo-600', trend: 'Per Client' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revenue Dynamics</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Cycle: Mar 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all">
            Generate Meta-Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 md:p-5 rounded-xl md:rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm border border-slate-200 group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon} size="sm" />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm ${stat.trend.includes('Overdue') ? 'text-rose-600' : 'text-emerald-600'} border border-slate-100 transition-colors`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors uppercase tracking-[0.1em]">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[9px] text-slate-400 font-medium italic opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">vs last cycle</span>
              </div>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Revenue Collection Analysis</h3>
            <p className="text-sm text-slate-500">Monthly billing performance across revenue streams</p>
          </div>
          
          <div className="relative h-[300px]">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400 font-medium">
              <span>$140K</span>
              <span>$105K</span>
              <span>$70K</span>
              <span>$35K</span>
              <span>$0</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-12 h-full flex items-end justify-between gap-8 pb-8">
              {[
                { label: 'Subscriptions', value1: 82, value2: 65 },
                { label: 'Invoices', value1: 128, value2: 102 },
                { label: 'Recurring', value1: 70, value2: 55 },
                { label: 'One-Time', value1: 98, value2: 72 },
                { label: 'Overdue', value1: 45, value2: 52 }
              ].map((item, i) => {
                const maxValue = 140;
                const height1 = (item.value1 / maxValue) * 100;
                const height2 = (item.value2 / maxValue) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full flex items-end justify-center gap-2" style={{ height: '240px' }}>
                      {/* Bar 1 - Current Month */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height1}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="flex-1 bg-[#002147] rounded-t-lg hover:bg-blue-900 transition-colors cursor-pointer relative group"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${item.value1}K
                        </span>
                      </motion.div>
                      
                      {/* Bar 2 - Previous Month */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height2}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                        className="flex-1 bg-slate-300 rounded-t-lg hover:bg-slate-400 transition-colors cursor-pointer relative group"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${item.value2}K
                        </span>
                      </motion.div>
                    </div>
                    
                    {/* Label */}
                    <span className="text-xs font-medium text-slate-500">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#002147] p-6 md:p-8 rounded-xl md:rounded-2xl text-white flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Quick Actions</h3>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer">
              <Icon name="cog" size="xs" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: 'Generate Monthly Invoices', icon: 'document-text' },
              { label: 'Send Payment Reminders', icon: 'bell' },
              { label: 'Download Tax Summary', icon: 'cash' },
              { label: 'View Reconciliation Report', icon: 'chart-bar' },
            ].map((action, i) => (
              <button key={i} className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3 hover:bg-white/20 hover:border-white/30 transition-all text-left group/btn">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-white/30 transition-all">
                  <Icon name={action.icon} size="xs" className="text-white" />
                </div>
                <span className="text-xs font-bold text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface BillingInvoice {
  id: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

const MOCK_BILLING_INVOICES: BillingInvoice[] = [
  { id: '1', invoiceNo: 'INV-2023-001', customer: 'Global Partners #1', date: '2023-10-11', amount: 2840.00, status: 'Pending' },
  { id: '2', invoiceNo: 'INV-2023-002', customer: 'Global Partners #2', date: '2023-10-12', amount: 2840.00, status: 'Paid' },
  { id: '3', invoiceNo: 'INV-2023-003', customer: 'Global Partners #3', date: '2023-10-13', amount: 2840.00, status: 'Overdue' },
  { id: '4', invoiceNo: 'INV-2023-004', customer: 'Global Partners #4', date: '2023-10-14', amount: 2840.00, status: 'Paid' },
  { id: '5', invoiceNo: 'INV-2023-005', customer: 'Global Partners #5', date: '2023-10-15', amount: 2840.00, status: 'Pending' },
  { id: '6', invoiceNo: 'INV-2023-006', customer: 'Global Partners #6', date: '2023-10-16', amount: 2840.00, status: 'Overdue' },
];

const TABS = ['All Invoices', 'Paid', 'Pending', 'Overdue'] as const;
type Tab = typeof TABS[number];

const DeleteModal: React.FC<{ invoiceNo: string; onClose: () => void; onConfirm: () => void }> = ({ invoiceNo, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      style={{ backgroundColor: '#ffffff' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
          <Icon name="exclamation" size="sm" />
        </div>
        <h3 className="font-bold text-slate-800">Delete Invoice</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-slate-700">"{invoiceNo}"</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">Delete</button>
      </div>
    </motion.div>
  </div>
);

const CreateInvoiceModal: React.FC<{ onClose: () => void; onSave: (invoice: Omit<BillingInvoice, 'id'>) => void }> = ({ onClose, onSave }) => {
  const [customer, setCustomer] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = React.useState('Pending');

  const handleSave = () => {
    if (!customer || !amount) return;
    onSave({
      invoiceNo: `INV-2023-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      customer,
      date,
      amount: parseFloat(amount),
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
          <h3 className="font-bold text-slate-800 text-lg">Create New Invoice</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Customer Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Enter customer name"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Amount <span className="text-rose-400">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Invoice Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">
            Create Invoice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EditInvoiceModal: React.FC<{ invoice: BillingInvoice; onClose: () => void; onSave: (invoice: BillingInvoice) => void }> = ({ invoice, onClose, onSave }) => {
  const [customer, setCustomer] = React.useState(invoice.customer);
  const [amount, setAmount] = React.useState(String(invoice.amount));
  const [date, setDate] = React.useState(invoice.date);
  const [status, setStatus] = React.useState(invoice.status);

  const handleSave = () => {
    if (!customer || !amount) return;
    onSave({
      ...invoice,
      customer,
      date,
      amount: parseFloat(amount),
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Edit Invoice</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{invoice.invoiceNo}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Customer Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Enter customer name"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Amount <span className="text-rose-400">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Invoice Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">
            Update Invoice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = React.useState<BillingInvoice[]>(MOCK_BILLING_INVOICES);
  const [activeTab, setActiveTab] = React.useState<Tab>('All Invoices');
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [deleteInvoice, setDeleteInvoice] = React.useState<BillingInvoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editInvoice, setEditInvoice] = React.useState<BillingInvoice | null>(null);

  const displayed = React.useMemo(() => {
    let list = [...invoices];
    if (activeTab !== 'All Invoices') {
      list = list.filter(i => i.status === activeTab);
    }
    if (search) {
      list = list.filter(i =>
        i.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus) {
      list = list.filter(i => i.status === filterStatus);
    }
    return list;
  }, [invoices, activeTab, search, filterStatus]);

  const handleDelete = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const handleCreate = (newInvoice: Omit<BillingInvoice, 'id'>) => {
    const invoice: BillingInvoice = {
      ...newInvoice,
      id: String(Date.now())
    };
    setInvoices(prev => [invoice, ...prev]);
  };

  const handleEdit = (updatedInvoice: BillingInvoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };

  const columns = [
    {
      key: 'invoiceNo' as const,
      label: 'Invoice No',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'customer' as const,
      label: 'Customer',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">C</div>
          <span className="text-sm text-slate-700 font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Icon name="calendar" size="xs" className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (value: number) => <span className="font-bold text-slate-900">${value.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Paid') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
          </div>
        );
        if (value === 'Overdue') return (
          <div className="flex items-center gap-1.5 text-red-600">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Overdue</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice Management</h1>
            <p className="text-sm text-slate-500 mt-1">Create and monitor customer billing and receivables</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" 
              leftIcon={<Icon name="download" size="xs" />}
            >
              Export
            </Button>
            <Button 
              variant="primary" 
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
              leftIcon={<Icon name="plus" size="xs" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
                activeTab === tab 
                  ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <TableFilters
          searchValue={search}
          searchPlaceholder="Search invoice # or customer..."
          onSearchChange={setSearch}
          filters={[
            { label: 'Filter by Status', value: filterStatus, options: ['Paid', 'Pending', 'Overdue'], onChange: setFilterStatus }
          ]}
          onClearAll={() => { setSearch(''); setFilterStatus(''); }}
          showClearButton={!!(search || filterStatus)}
        />

        <DataTableWrapper
          data={displayed}
          columns={columns}
          actions={[
            { 
              label: 'Edit', 
              icon: <Edit size={14} />, 
              onClick: (item) => setEditInvoice(item), 
              variant: 'primary', 
              title: 'Edit' 
            },
            { 
              label: 'Delete', 
              icon: <Trash2 size={14} />, 
              onClick: (item) => setDeleteInvoice(item), 
              variant: 'danger', 
              title: 'Delete' 
            }
          ]}
          emptyMessage="No invoices found"
        />
      </motion.div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateInvoiceModal 
            key="create"
            onClose={() => setIsCreateModalOpen(false)} 
            onSave={handleCreate} 
          />
        )}
        {editInvoice && (
          <EditInvoiceModal 
            key="edit"
            invoice={editInvoice}
            onClose={() => setEditInvoice(null)} 
            onSave={handleEdit} 
          />
        )}
        {deleteInvoice && (
          <DeleteModal 
            key="delete" 
            invoiceNo={deleteInvoice.invoiceNo} 
            onClose={() => setDeleteInvoice(null)} 
            onConfirm={() => handleDelete(deleteInvoice.id)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ViewStatementModal: React.FC<{ client: string; amount: string; onClose: () => void }> = ({ client, amount, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]"
      style={{ backgroundColor: '#ffffff' }}
      onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Account Statement</h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{client}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
          <Icon name="x" size="sm" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-6 bg-white">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-slate-900">{amount}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Days Overdue</p>
            <p className="text-2xl font-bold text-slate-900">90+</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Payment</p>
            <p className="text-sm font-bold text-slate-900">Dec 15, 2023</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Transaction History</h4>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#002147] text-white">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-left">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-left">Description</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Amount</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { date: '2023-10-15', desc: 'Invoice #INV-2023-045', amount: '$1,500', balance: '$4,500' },
                { date: '2023-09-20', desc: 'Invoice #INV-2023-032', amount: '$1,200', balance: '$3,000' },
                { date: '2023-08-10', desc: 'Invoice #INV-2023-018', amount: '$1,800', balance: '$1,800' },
              ].map((txn, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                  <td className="px-4 py-3 text-slate-600">{txn.date}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{txn.desc}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{txn.amount}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{txn.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0">
        <button onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
          Close
        </button>
        <button
          className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">
          Download PDF
        </button>
      </div>
    </motion.div>
  </div>
);

const ManualContactModal: React.FC<{ client: string; onClose: () => void }> = ({ client, onClose }) => {
  const [contactMethod, setContactMethod] = React.useState('email');
  const [subject, setSubject] = React.useState('Payment Reminder');
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    console.log('Sending contact:', { client, contactMethod, subject, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
        style={{ backgroundColor: '#ffffff' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Manual Contact</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{client}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Method <span className="text-rose-400">*</span></label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="sms">SMS</option>
              <option value="letter">Registered Mail</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message <span className="text-rose-400">*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={8}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Note:</span> This will send a direct communication to the client regarding their overdue payment of $4,500.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSend}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition">
            Send Contact
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const RemindersPage: React.FC = () => {
  const [settings, setSettings] = React.useState([
    { id: 1, label: '3 Days Before Due', status: 'Enabled', type: 'EMAIL' },
    { id: 2, label: 'On Due Date', status: 'Enabled', type: 'SMS + EMAIL' },
    { id: 3, label: '7 Days After Due', status: 'Disabled', type: 'CALL' },
    { id: 4, label: 'Final Notice (30 Days)', status: 'Enabled', type: 'REGISTERED MAIL' },
  ]);

  const [viewStatementClient, setViewStatementClient] = React.useState<{ client: string; amount: string } | null>(null);
  const [manualContactClient, setManualContactClient] = React.useState<string | null>(null);

  const toggleSetting = (id: number) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Enabled' ? 'Disabled' : 'Enabled' } : s
    ));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Reminders</h1>
          <p className="text-sm text-slate-500 mt-1">Automated alerts and notifications for overdue accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Reminder Settings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Reminder Settings</h3>
          <div className="space-y-3">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-900">{setting.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">{setting.type}</p>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    setting.status === 'Enabled' ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                    setting.status === 'Enabled' ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Overdue Notifications */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Icon name="bell" size="sm" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Critical Overdue Notifications</h3>
              <p className="text-xs text-slate-500 font-medium">8 clients have ignored the second reminder</p>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Corporate Alpha #{i}</h4>
                    <p className="text-xs text-slate-600 font-bold mt-1">$4,500 OVERDUE</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700 border border-blue-200">90 Days+</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewStatementClient({ client: `Corporate Alpha #${i}`, amount: '$4,500' })}
                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition">
                    View Statement
                  </button>
                  <button 
                    onClick={() => setManualContactClient(`Corporate Alpha #${i}`)}
                    className="flex-1 py-2 bg-[#002147] text-white text-xs font-bold rounded-lg hover:bg-[#003366] transition shadow-lg shadow-blue-900/20">
                    Manual Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewStatementClient && (
          <ViewStatementModal 
            key="statement"
            client={viewStatementClient.client}
            amount={viewStatementClient.amount}
            onClose={() => setViewStatementClient(null)} 
          />
        )}
        {manualContactClient && (
          <ManualContactModal 
            key="contact"
            client={manualContactClient}
            onClose={() => setManualContactClient(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
