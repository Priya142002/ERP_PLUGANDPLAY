import React from 'react';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  Briefcase, 
  Users, 
  ArrowRight, 
  DollarSign, 
  FileText, 
  Share2, 
  MessageSquare,
  Zap,
  Layout,
  BarChart3
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// --- Project Dynamics (Dashboard) ---
export const ProjectDashboard: React.FC = () => {
  const stats = [
    { label: 'Active Projects', value: '24', icon: Briefcase, color: 'bg-blue-600', trend: '8 On Track' },
    { label: 'Total Tasks', value: '184', icon: CheckCircle, color: 'bg-indigo-600', trend: '+12 Weekly' },
    { label: 'Resource Util.', value: '88%', icon: Users, color: 'bg-emerald-600', trend: 'Optimal' },
    { label: 'Project Budget', value: '$240K', icon: DollarSign, color: 'bg-amber-500', trend: '72% Used' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Dynamics</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Strategic project management and resource tracking</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm font-bold text-xs text-slate-600">
            <Calendar size={14} className="text-blue-600" />
            <span>Cycle: Q1 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg">
            Project Health Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${stat.color}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm text-emerald-600 border border-slate-100 transition-colors`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 relative z-10">High Priority Initiatives</h3>
          <div className="space-y-8 relative z-10">
            {[
              { name: 'Infrastructure Modernization', progress: 75, color: 'bg-blue-600', status: 'On Track' },
              { name: 'Core ERP Migration', progress: 42, color: 'bg-indigo-600', status: 'In Review' },
              { name: 'Supply Chain Sync', progress: 90, color: 'bg-emerald-600', status: 'Finishing' },
            ].map((prj, i) => (
              <div key={i} className="space-y-3 cursor-pointer group/prj">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover/prj:text-blue-600 transition-colors">{prj.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold italic">{prj.status}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{prj.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${prj.progress}%` }} transition={{ duration: 1 }} className={`h-full ${prj.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#002147] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group/controls">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16 group-hover/controls:scale-150 transition-transform duration-700" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-8 relative z-10">PROJECT CONTROLS</h3>
          <div className="space-y-3 relative z-10">
            {[
              { label: 'New Project Instance', icon: Briefcase, color: 'text-blue-400' },
              { label: 'Dispatch Global Tasks', icon: Zap, color: 'text-amber-400' },
              { label: 'Generate Status Update', icon: Share2, color: 'text-emerald-400' },
              { label: 'Budget Reallocation', icon: DollarSign, color: 'text-rose-400' },
            ].map((act, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:translate-x-1 transition-all text-left">
                <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${act.color}`}><act.icon size={16} /></div>
                <span className="text-[11px] font-bold tracking-wide">{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Projects & Status ---
export const ProjectListPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects & Status</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic">Comprehensive oversight of strategic lifecycle</p>
            </div>
            <div className="flex items-center gap-3">
                <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl shadow-lg border-none active:scale-95 transition-all">+ Create New Project</Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Briefcase size={20} /></div>
                        <Badge variant={i % 3 === 0 ? 'success' : i % 3 === 1 ? 'info' : 'warning'} className="text-[9px] uppercase tracking-widest">{i % 3 === 0 ? 'ON TRACK' : i % 3 === 1 ? 'IN REVIEW' : 'AT RISK'}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Initiative Alpha-0{i}</h3>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium italic leading-relaxed">Strategic modernization of technical assets and operational benchmarks...</p>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                         <div>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Lead Manager</p>
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-50"></div>
                                <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">Jordan T.</span>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Health Score</p>
                             <p className="text-sm font-bold text-emerald-600">92%</p>
                         </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- Task Board (Kanban) ---
export const TasksPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Task Board</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Assign, track, and execute collaborative tasks</p>
            </div>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Plus size={14} />}>Create & Assign Task</Button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-280px)] min-h-[500px]">
             {['Backlog', 'Processing', 'Final Review', 'Done'].map((col, idx) => (
                <div key={idx} className="flex-1 min-w-[320px] bg-slate-50/30 rounded-[2.5rem] border border-slate-100/50 flex flex-col p-6">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-2.5">
                             <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-slate-400' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{col}</h3>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">12</span>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {[1, 2, 3].map(j => (
                            <div key={j} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                                <div className="flex justify-between items-center mb-4">
                                     <Badge variant={j % 2 === 0 ? 'error' : 'warning'} className="text-[9px] uppercase tracking-widest leading-none px-2">{j % 2 === 0 ? 'Urgent' : 'Medium'}</Badge>
                                     <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors uppercase tracking-tight">Sync architecture patterns with core engine standards {idx}{j}</h4>
                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200" />
                                        <span className="text-[10px] font-bold text-slate-400">Jordan T.</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-bold uppercase">Oct 2{j}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             ))}
        </div>
    </motion.div>
);

// --- Timesheets & Expenses ---
export const TimesheetPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic">Project Financials & Time</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium lowercase italic">TRACK BILLABLE HOURS, TIMESHEETS, AND RESOURCE EXPENSES</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="secondary" className="px-5 h-10 rounded-xl" leftIcon={<DollarSign size={14} />}>Add Expense</Button>
                <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Clock size={14} />}>Log Timesheet</Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Weekly Effort Stream</h3>
                <div className="space-y-4 relative z-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#002147] text-white flex items-center justify-center shadow-lg"><Clock size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Architecture Mapping</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">DEV-00{i} • Jordan T.</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-[#002147]">0{i}:20h</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/30 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Pending Expenses</h3>
                <div className="space-y-4 relative z-10">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center"><DollarSign size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Technical Travel {i}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Travel • Oct 1{i}, 2023</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-rose-600">$420.00</span>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center p-8 bg-slate-50/30 rounded-3xl border border-dashed border-slate-100 italic text-slate-400 text-xs">
                    Clear expenses regularly to ensure accurate budget tracking.
                </div>
             </div>
        </div>
    </motion.div>
);

// --- Client Sync (Customer Updates) ---
export const ClientSyncPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Synchronization</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Share progress, share reports, and maintain transparency</p>
            </div>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl shadow-lg border-none" leftIcon={<Share2 size={14} />}>Share Progress Report</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
                 <div className="bg-[#002147] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">SYNC STATUS</h3>
                    <p className="text-4xl font-bold tracking-tighter">OPTIMAL</p>
                    <p className="text-[11px] text-blue-400 mt-6 font-bold uppercase tracking-widest italic">All clients on sync list</p>
                 </div>
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">Share Channels</h4>
                    <div className="space-y-3">
                        {[
                            { label: 'Client Portal', icon: Layout, color: 'text-indigo-500' },
                            { label: 'Email Digest', icon: MessageSquare, color: 'text-blue-500' },
                            { label: 'PDF Export', icon: FileText, color: 'text-rose-500' },
                            { label: 'Live Dashboard', icon: BarChart3, color: 'text-emerald-500' },
                        ].map((ch, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
                                <ch.icon size={14} className={ch.color} />
                                <span className="text-[11px] font-bold text-slate-600">{ch.label}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Feedback Loops</h3>
                     <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">Manage All Feedback</button>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center font-bold text-blue-600 shrink-0 group-hover:bg-[#002147] group-hover:text-white transition-all">C{i}</div>
                             <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                     <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Client Portfolio Alpha {i}</h4>
                                     <span className="text-[10px] text-slate-400 font-bold">Today 09:12 AM</span>
                                </div>
                                <p className="text-[13px] text-slate-500 leading-relaxed italic">"Highly impressed with the progress on the Infrastructure module. The transparency in reporting is helping us align internal stakeholders better."</p>
                                <div className="mt-6 flex items-center gap-4 pt-4 border-t border-slate-100">
                                     <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                         <Share2 size={10} className="text-blue-600" />
                                         <span className="text-[9px] font-bold text-blue-700 uppercase">Shared Oct 1{i}</span>
                                     </div>
                                     <Badge variant="success" className="text-[8px] py-0">SYNCHRONIZED</Badge>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);
