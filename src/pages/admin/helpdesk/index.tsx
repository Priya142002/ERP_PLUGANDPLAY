import React, { useState, useMemo } from 'react';
import { PageTemplate } from '../PageTemplate';
import { Icon } from '../../../components/ui/Icon';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import Button from '../../../components/ui/Button';

const MOCK_TICKETS = [
  { id: '1', ticketId: 'TKT-001', title: 'Login issue on mobile app', user: 'John Doe', agent: 'Sarah Wilson', priority: 'High', status: 'Open', date: '2026-03-21', category: 'Technical' },
  { id: '2', ticketId: 'TKT-002', title: 'Payment gateway error', user: 'Jane Smith', agent: 'Mike Johnson', priority: 'Critical', status: 'In Progress', date: '2026-03-21', category: 'Billing' },
  { id: '3', ticketId: 'TKT-003', title: 'Feature request: Dark mode', user: 'Bob Wilson', agent: 'Sarah Wilson', priority: 'Low', status: 'Open', date: '2026-03-20', category: 'Feature' },
  { id: '4', ticketId: 'TKT-004', title: 'Cannot access reports', user: 'Alice Brown', agent: 'Mike Johnson', priority: 'Medium', status: 'Resolved', date: '2026-03-20', category: 'Technical' },
  { id: '5', ticketId: 'TKT-005', title: 'Invoice not generated', user: 'Charlie Davis', agent: 'Unassigned', priority: 'High', status: 'Overdue', date: '2026-03-19', category: 'Billing' },
  { id: '6', ticketId: 'TKT-006', title: 'Password reset not working', user: 'Eva Martinez', agent: 'Sarah Wilson', priority: 'Medium', status: 'In Progress', date: '2026-03-21', category: 'Technical' },
];

export const HelpdeskDashboard: React.FC = () => {
  const [tickets] = useState(MOCK_TICKETS);

  const displayed = useMemo(() => {
    return [...tickets];
  }, [tickets]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    overdue: tickets.filter(t => t.status === 'Overdue').length,
  }), [tickets]);

  const STAT_CARDS = [
    {
      title: "Total Tickets",
      value: stats.total.toString(),
      icon: <Activity size={24} />,
      color: "bg-slate-600",
      trend: "All Issues",
      trendColor: "text-slate-600",
      description: "System-wide support requests"
    },
    {
      title: "Open",
      value: stats.open.toString(),
      icon: <AlertCircle size={24} />,
      color: "bg-amber-500",
      trend: "Awaiting Response",
      trendColor: "text-amber-600",
      description: "Requires immediate attention"
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      icon: <Clock size={24} />,
      color: "bg-blue-600",
      trend: "Active Resolution",
      trendColor: "text-blue-600",
      description: "Currently being handled"
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
      icon: <CheckCircle size={24} />,
      color: "bg-emerald-600",
      trend: "Completed",
      trendColor: "text-emerald-600",
      description: "Successfully closed"
    },
    {
      title: "Overdue",
      value: stats.overdue.toString(),
      icon: <XCircle size={24} />,
      color: "bg-rose-500",
      trend: "Critical Priority",
      trendColor: "text-rose-600",
      description: "Exceeded SLA timeline"
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
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Intelligence</h1>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {STAT_CARDS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-4 md:p-5 rounded-xl md:rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden bg-white"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm border border-slate-200 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm ${stat.trendColor} border border-slate-100 transition-colors`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
              <p className="text-[9px] text-slate-400 mt-2 font-medium italic opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">"{stat.description}"</p>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket List Table */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Activity size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Support Queue</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="px-4 md:px-8 py-4 md:py-5 first:rounded-tl-none">Ticket ID</th>
                  <th className="px-4 md:px-6 py-4 md:py-5">Title</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-center">Priority</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-center last:rounded-tr-none">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayed.slice(0, 5).map((ticket, index) => (
                  <tr 
                    key={ticket.id} 
                    className={`group cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-indigo-600 hover:bg-indigo-50/30 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.ticketId}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.title}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                      <span className={`inline-block text-[10px] font-bold px-3 py-1.5 rounded-lg border ${
                        ticket.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                        ticket.status === 'Resolved' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                        ticket.status === 'In Progress' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                        ticket.status === 'Overdue' ? 'text-red-600 bg-red-50 border border-red-100' :
                        'text-amber-600 bg-amber-50 border border-amber-100'
                      }`}>
                        {ticket.status === 'Resolved' && <CheckCircle size={12} />}
                        {ticket.status === 'In Progress' && <Clock size={12} />}
                        {ticket.status === 'Overdue' && <XCircle size={12} />}
                        {ticket.status === 'Open' && <AlertCircle size={12} />}
                        {ticket.status}
                      </div>
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Analytics Chart */}
          <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status Distribution</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Open', value: stats.open, total: stats.total, color: 'bg-amber-500' },
                { label: 'In Progress', value: stats.inProgress, total: stats.total, color: 'bg-blue-500' },
                { label: 'Resolved', value: stats.resolved, total: stats.total, color: 'bg-emerald-500' },
                { label: 'Overdue', value: stats.overdue, total: stats.total, color: 'bg-red-500' },
              ].map((item, idx) => {
                const percentage = stats.total > 0 ? (item.value / item.total) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900">{item.value} <span className="text-slate-400">({percentage.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Activity size={18} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h3>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{activity.action}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        by {activity.user}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const TicketsPage: React.FC = () => {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Technical'
  });
  const [assignAgent, setAssignAgent] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleCreateTicket = () => {
    console.log('Creating ticket:', newTicket);
    setIsNewTicketModalOpen(false);
    setNewTicket({ title: '', description: '', priority: 'Medium', category: 'Technical' });
  };

  const handleAssignTicket = () => {
    console.log('Assigning ticket to:', assignAgent);
    setIsAssignModalOpen(false);
    setAssignAgent('');
  };

  const handleResolveTicket = () => {
    console.log('Resolving ticket with notes:', resolutionNotes);
    setIsResolveModalOpen(false);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Custom Header with New Ticket Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ticket Management</h1>
          <p className="text-slate-500 mt-1">Track and resolve customer support issues</p>
        </div>
        <button 
          onClick={() => setIsNewTicketModalOpen(true)}
          className="px-6 h-10 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded-xl shadow-lg border-none flex items-center gap-2 transition-colors"
        >
          <Icon name="plus" size="xs" /> New Ticket
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative">
          <Icon name="search" size="xs" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 shadow-sm text-slate-900 placeholder:text-slate-400" 
          />
        </div>
        <select className="px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700 font-medium">
          <option>Open Tickets</option>
          <option>Resolved</option>
          <option>All Tasks</option>
        </select>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-340px)] min-h-[600px]">
        <div className="flex-1 flex min-h-0">
          <div className="w-96 border-r border-slate-200 overflow-y-auto bg-slate-50">
            <div className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`p-5 hover:bg-white transition-all cursor-pointer border-l-4 ${
                  i === 1 ? 'border-blue-600 bg-white shadow-sm' : 'border-transparent'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-600">TICKET-00{i}</span>
                    <Badge variant={i === 1 ? 'error' : 'info'} className="text-[9px] py-0.5 px-2 font-bold">URGENT</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug mb-3">Application crashes on checkout sequence {i}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">T</div>
                      <span className="text-xs font-medium text-slate-600">TECH SUPPORT</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">2h ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-slate-50">
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">#</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Application crashes on checkout sequence</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant="error" className="text-[9px] font-bold">URGENT</Badge>
                    <span className="text-xs font-medium text-slate-600">CLIENT: ENTERPRISE CORP</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ASSIGN
                </button>
                <button 
                  onClick={() => setIsResolveModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  RESOLVE
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 border border-slate-200 shrink-0">C</div>
                <div className="max-w-xl bg-white p-5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The system throws a NullReferenceException every time a user clicks on the "Proceed to Payment" button when using the mobile application. This is blocking all mobile sales for the past hour.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <div className="bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors">crash_log.txt</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#002147] shadow-sm flex items-center justify-center font-bold text-white shrink-0">A</div>
                <div className="max-w-xl bg-[#002147] p-5 rounded-2xl rounded-tr-sm shadow-sm">
                  <p style={{ color: '#ffffff' }} className="text-sm leading-relaxed">
                    Understand the urgency. I've escalated this to the mobile dev team and we're investigating the logs. Will update you within 30 minutes.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-200">
              <div className="relative">
                <textarea 
                  placeholder="Reply to customer..." 
                  className="w-full pl-4 pr-24 py-3 min-h-[100px] bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none text-slate-900 placeholder:text-slate-400" 
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <Icon name="support" size="xs" />
                  </button>
                  <button className="px-6 h-10 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded-xl shadow-lg transition-colors">SEND REPLY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Create New Ticket</h2>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ticket Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  rows={6}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium"
                  >
                    <option>Technical</option>
                    <option>Billing</option>
                    <option>Feature</option>
                    <option>General</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 flex-shrink-0 bg-white">
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#002147] hover:bg-[#003366] rounded-xl shadow-lg transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assign Ticket Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Assign Ticket</h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Agent</label>
                <select
                  value={assignAgent}
                  onChange={(e) => setAssignAgent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-medium bg-white"
                >
                  <option value="">Select an agent...</option>
                  <option value="Sarah Wilson">Sarah Wilson</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#002147] hover:bg-[#003366] rounded-xl shadow-lg transition-colors"
              >
                Assign Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resolve Ticket Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Resolve Ticket</h2>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how the issue was resolved..."
                  rows={6}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none text-slate-900 placeholder:text-slate-400 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-colors"
              >
                Mark as Resolved
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const SLAPage: React.FC = () => (
  <PageTemplate title="SLA Monitoring" description="Monitor service level compliance and breach alerts" icon="clock">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Time Compliance Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Response Time Compliance</h3>
        <div className="space-y-6">
          {[
            { label: 'Critical Priority (1h Limit)', value: '100%', color: 'bg-emerald-500' },
            { label: 'High Priority (4h Limit)', value: '94%', color: 'bg-emerald-500' },
            { label: 'Medium Priority (12h Limit)', value: '88%', color: 'bg-amber-500' },
            { label: 'Low Priority (24h Limit)', value: '98%', color: 'bg-emerald-500' },
          ].map((sla, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">{sla.label}</span>
                <span className="text-sm font-bold text-slate-900">{sla.value}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${sla.color} rounded-full transition-all duration-500`} style={{ width: sla.value }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Breach Alerts Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Icon name="bell" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">SLA Breach Alerts</h3>
            <p className="text-xs text-slate-600 font-medium">3 active breaches require immediate attention</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-900">TICKET-0098{i}</h4>
                <Badge variant="error" className="text-[9px] font-bold">-42m Over</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">Response time exceeded for critical billing issue. Escalated to Dept. Lead.</p>
              <button className="w-full py-2 bg-[#002147] hover:bg-[#003366] text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all">
                Take Over Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageTemplate>
);
