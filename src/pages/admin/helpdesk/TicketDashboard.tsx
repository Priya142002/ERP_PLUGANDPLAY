import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Download, 
  Calendar, 
  User, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { TableFilters, DataTableWrapper } from "../../../components/common";

const MOCK_TICKETS = [
  { id: '1', ticketId: 'TKT-001', title: 'Login issue on mobile app', user: 'John Doe', agent: 'Sarah Wilson', priority: 'High', status: 'Open', date: '2026-03-21', category: 'Technical' },
  { id: '2', ticketId: 'TKT-002', title: 'Payment gateway error', user: 'Jane Smith', agent: 'Mike Johnson', priority: 'Critical', status: 'In Progress', date: '2026-03-21', category: 'Billing' },
  { id: '3', ticketId: 'TKT-003', title: 'Feature request: Dark mode', user: 'Bob Wilson', agent: 'Sarah Wilson', priority: 'Low', status: 'Open', date: '2026-03-20', category: 'Feature' },
  { id: '4', ticketId: 'TKT-004', title: 'Cannot access reports', user: 'Alice Brown', agent: 'Mike Johnson', priority: 'Medium', status: 'Resolved', date: '2026-03-20', category: 'Technical' },
  { id: '5', ticketId: 'TKT-005', title: 'Invoice not generated', user: 'Charlie Davis', agent: 'Unassigned', priority: 'High', status: 'Overdue', date: '2026-03-19', category: 'Billing' },
  { id: '6', ticketId: 'TKT-006', title: 'Password reset not working', user: 'Eva Martinez', agent: 'Sarah Wilson', priority: 'Medium', status: 'In Progress', date: '2026-03-21', category: 'Technical' },
];

const TABS = ['All Tickets', 'Open', 'In Progress', 'Resolved', 'Overdue'] as const;
type Tab = typeof TABS[number];

export const TicketDashboard: React.FC = () => {
  const [tickets] = useState(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState<Tab>('All Tickets');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Overdue'];

  const displayed = useMemo(() => {
    let list = [...tickets];
    if (activeTab !== 'All Tickets') {
      list = list.filter(t => t.status === activeTab);
    }
    if (search) {
      list = list.filter(t =>
        t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPriority) list = list.filter(t => t.priority === filterPriority);
    if (filterStatus) list = list.filter(t => t.status === filterStatus);
    return list;
  }, [tickets, activeTab, search, filterPriority, filterStatus]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    overdue: tickets.filter(t => t.status === 'Overdue').length,
  }), [tickets]);

  const columns = [
    {
      key: 'ticketId' as const,
      label: 'Ticket ID',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'title' as const,
      label: 'Title',
      render: (value: string) => <span className="text-slate-700 text-sm">{value}</span>
    },
    {
      key: 'user' as const,
      label: 'User',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User size={13} className="text-slate-400" />
          <span className="text-slate-600 text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'agent' as const,
      label: 'Assigned Agent',
      render: (value: string) => (
        <span className={`text-sm ${value === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-700'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'priority' as const,
      label: 'Priority',
      render: (value: string) => {
        const colors = {
          Critical: 'bg-red-100 text-red-700 border-red-200',
          High: 'bg-orange-100 text-orange-700 border-orange-200',
          Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          Low: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return (
          <span className={`text-xs font-bold px-2 py-1 rounded-md border ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => {
        if (value === 'Resolved') return (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Resolved</span>
          </div>
        );
        if (value === 'In Progress') return (
          <div className="flex items-center gap-1.5 text-blue-600">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">In Progress</span>
          </div>
        );
        if (value === 'Overdue') return (
          <div className="flex items-center gap-1.5 text-red-600">
            <XCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Overdue</span>
          </div>
        );
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Open</span>
          </div>
        );
      }
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" />
          {value}
        </div>
      )
    }
  ];

  const recentActivity = [
    { action: 'Ticket TKT-002 updated', user: 'Mike Johnson', time: '5 min ago' },
    { action: 'New ticket TKT-006 created', user: 'Eva Martinez', time: '12 min ago' },
    { action: 'Ticket TKT-004 resolved', user: 'Sarah Wilson', time: '1 hour ago' },
    { action: 'Ticket TKT-001 assigned', user: 'Admin', time: '2 hours ago' },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Helpdesk Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track support tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" 
            leftIcon={<Download size={14} />}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
          >
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tickets', value: stats.total, icon: Activity, color: 'bg-slate-600' },
          { label: 'Open', value: stats.open, icon: AlertCircle, color: 'bg-amber-600' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-blue-600' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-emerald-600' },
          { label: 'Overdue', value: stats.overdue, icon: XCircle, color: 'bg-red-600' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${stat.color}`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200`}>
                <stat.icon size={18} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Ticket Table */}
        <div className="lg:col-span-2 space-y-4">
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
            searchPlaceholder="Search tickets..."
            onSearchChange={setSearch}
            filters={[
              { label: 'Filter by Priority', value: filterPriority, options: priorityOptions, onChange: setFilterPriority },
              { label: 'Filter by Status', value: filterStatus, options: statusOptions, onChange: setFilterStatus }
            ]}
            onClearAll={() => { setSearch(''); setFilterPriority(''); setFilterStatus(''); }}
            showClearButton={!!(search || filterPriority || filterStatus)}
          />

          <DataTableWrapper
            data={displayed}
            columns={columns}
            actions={[]}
            emptyMessage="No tickets found"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Analytics Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Ticket Status Distribution
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Open', value: stats.open, total: stats.total, color: 'bg-amber-500' },
                { label: 'In Progress', value: stats.inProgress, total: stats.total, color: 'bg-blue-500' },
                { label: 'Resolved', value: stats.resolved, total: stats.total, color: 'bg-emerald-500' },
                { label: 'Overdue', value: stats.overdue, total: stats.total, color: 'bg-red-500' },
              ].map((item, idx) => {
                const percentage = stats.total > 0 ? (item.value / item.total) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900">{item.value} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 font-medium">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-white text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all border border-slate-200 text-left">
                Assign Unassigned Tickets
              </button>
              <button className="w-full py-2 px-4 bg-white text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all border border-slate-200 text-left">
                View Overdue Tickets
              </button>
              <button className="w-full py-2 px-4 bg-white text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all border border-slate-200 text-left">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
