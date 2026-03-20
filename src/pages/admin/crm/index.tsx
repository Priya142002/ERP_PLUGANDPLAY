import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { Calendar, Plus, Download, Edit, Trash2, Search, Filter, MoreHorizontal } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const CRMDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Leads', value: '1,284', icon: 'users', color: 'bg-blue-600', trend: '+12% Growth' },
    { label: 'Opportunities', value: '420', icon: 'presentation-chart-line', color: 'bg-indigo-600', trend: '+8% Yield' },
    { label: 'Conversion Rate', value: '24.5%', icon: 'chart-bar', color: 'bg-emerald-600', trend: '+5% Alpha' },
    { label: 'Deal Value', value: '$845k', icon: 'cash', color: 'bg-amber-500', trend: '+15% High' },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CRM Dashboard</h1>
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
            className={`p-4 md:p-5 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden ${stat.color}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon} size="sm" />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm text-emerald-600 border border-slate-100 transition-colors`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs">Sales Pipeline</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['Qualification', 'Proposal', 'Negotiation', 'Closing'].map((stage, i) => (
              <div key={i} className="flex-1 min-w-[200px] bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{stage}</span>
                  <Badge variant="secondary" className="text-[10px]">{12 - i*2}</Badge>
                </div>
                <div className="space-y-3">
                  {[1, 2].map(j => (
                    <div key={j} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
                      <p className="text-sm font-bold text-slate-900">Enterprise Deal #{i}{j}</p>
                      <p className="text-[11px] text-slate-500 mt-1">$45,000 • High Probability</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon name="calendar" size="xs" className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Follow-up with John Doe</p>
                  <p className="text-[11px] text-slate-500">Scheduled for tomorrow at 10:00 AM</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-xs font-bold rounded-2xl hover:bg-slate-100 transition-all">
            View All Activities
          </button>
        </div>
      </div>
    </motion.div>
  );
};export const LeadsPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lead Management</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Create and manage your business leads</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
          Export
        </Button>
        <Button 
          variant="primary" 
          className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
          leftIcon={<Plus size={14} />}
        >
          New Lead
        </Button>
      </div>
    </div>

    {/* Filter Chips */}
    <div className="flex items-center gap-2 px-1">
      {['All Leads', 'New Leads', 'Contacted', 'Qualified', 'Lost'].map((chip, idx) => (
        <button key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
          {chip}
        </button>
      ))}
    </div>

    {/* Search & Filter Section */}
    <div className="space-y-4">
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search leads by name, email..." className="pl-10 pr-4 py-2 text-[13px] bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-72 transition-all font-medium" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:border-slate-300 transition-all">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Filter By Source</span>
              <Filter size={12} className="text-slate-400" />
            </div>
          </div>
        </div>
        
        {/* Leads Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-[#002147] text-white">
              <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Lead Info</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none text-center">Lead Score</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Assigned Agent</th>
              <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em] border-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                      {i % 2 === 0 ? 'JD' : 'AS'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Lead #{20240 + i}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium tracking-tight">Website • {i * 2} hours ago</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-1.5 ${i % 3 === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${i % 3 === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{i % 3 === 0 ? 'Qualified' : 'Contacted'}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-block px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-sm font-bold text-slate-700 font-mono italic">8{i}/100</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Agent" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 tracking-tight">Admin User #{i}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <button className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all active:scale-90">
                      <Edit size={14} />
                    </button>
                    <button className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all active:scale-90">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

export const OpportunitiesPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Opportunities</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Track your high-value sales pipeline and potential deals</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
          Export
        </Button>
        <Button 
          variant="primary" 
          className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
          leftIcon={<Plus size={14} />}
        >
          New Opportunity
        </Button>
      </div>
    </div>

    {/* Filter Chips */}
    <div className="flex items-center gap-2 px-1">
      {['Active Deals', 'Closing This Week', 'High Probability', 'Pipeline History'].map((chip, idx) => (
        <button key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
          {chip}
        </button>
      ))}
    </div>

    {/* Table Layout like Product */}
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search opportunities..." className="pl-10 pr-4 py-2 text-[13px] bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-72 transition-all font-medium" />
          </div>
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="bg-[#002147] text-white">
            <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Opportunity Details</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Pipeline Stage</th>
            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] border-none">Deal Value</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Probability</th>
            <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em] border-none text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="hover:bg-slate-50/50 transition-all group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                    <Icon name="cash" size="sm" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#002147] transition-colors uppercase tracking-tight">Enterprise Expansion #{i}002</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium italic">Global Retail Group • Exp. Oct 2026</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 rounded-md py-1 px-2.5 inline-block group-hover:bg-blue-600 group-hover:text-white transition-all cursor-default">
                  {['Qualification', 'Proposal', 'Negotiation', 'Closing', 'Contract'][i-1]}
                </span>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block group-hover:border-blue-200 transition-colors">
                  $24,500.00
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Confidence</span>
                    <span className="text-[10px] font-bold text-emerald-600 leading-none">8{i}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `8${i}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                  <button className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all active:scale-90">
                    <Edit size={14} />
                  </button>
                  <button className="p-2 bg-blue-50 text-[#002147] hover:bg-[#002147] hover:text-white rounded-xl border border-[#002147]/10 transition-all active:scale-90">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export const FollowUpsPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activities & Follow-ups</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Manage your task, meeting schedule and customer interactions</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
          Calendar View
        </Button>
        <Button 
          variant="primary" 
          className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
          leftIcon={<Plus size={14} />}
        >
          New Activity
        </Button>
      </div>
    </div>

    {/* Filter Chips */}
    <div className="flex items-center gap-2 px-1">
      {['Today', 'Upcoming', 'Meetings', 'Follow-ups', 'Tasks'].map((chip, idx) => (
        <button key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
          {chip}
        </button>
      ))}
    </div>

    {/* Activity List like Product Row */}
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-4">
          <div className="relative font-bold uppercase tracking-widest text-[#002147] text-[11px] flex items-center gap-2">
            <Calendar size={14} className="text-blue-600" />
            <span>Schedule Interface</span>
          </div>
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="bg-[#002147] text-white">
            <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Timing</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Activity / Event</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none text-center">Source</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Status</th>
            <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em] border-none">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-bold uppercase tracking-widest">
          {[9, 10, 11, 12, 13, 14, 15].map(hour => (
            <tr key={hour} className={`transition-all group ${hour === 10 ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
              <td className="px-8 py-6">
                <div className={`p-2 rounded-xl text-center border font-mono italic ${hour === 10 ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-110' : 'bg-white text-slate-400 border-slate-100'}`}>
                  {hour}:00
                </div>
              </td>
              <td className="px-6 py-6">
                {hour === 10 ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">Sales Pitch - New Client</p>
                    <p className="text-[10px] text-blue-600 font-bold tracking-widest italic lowercase">Google Meet • 10:00 - 11:00 AM</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 font-bold italic lowercase opacity-40 group-hover:opacity-100 transition-opacity">No activity scheduled</p>
                )}
              </td>
              <td className="px-6 py-6 text-center">
                {hour === 10 && (
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-white text-blue-600 border border-blue-200 rounded-md py-1 px-2.5 inline-block shadow-sm">
                    CRM Lead
                  </span>
                )}
              </td>
              <td className="px-6 py-6">
                {hour === 10 ? (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-[10px] font-bold">UPCOMING</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-200 font-bold">AVAILABLE</span>
                )}
              </td>
              <td className="px-8 py-6 text-right">
                <button className={`p-2 rounded-xl transition-all ${hour === 10 ? 'bg-[#002147] text-white hover:bg-blue-900 shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}>
                  {hour === 10 ? <Edit size={14} /> : <Plus size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);
