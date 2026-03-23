import React, { useState } from 'react';
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
  BarChart3,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// Mobile responsive styles
const mobileStyles = `
  @media (max-width: 768px) {
    .project-header-buttons {
      flex-direction: column;
      width: 100%;
    }
    .project-header-buttons > * {
      width: 100%;
      justify-content: center;
    }
    .project-stats-grid {
      grid-template-columns: 1fr !important;
    }
    .project-cards-grid {
      grid-template-columns: 1fr !important;
    }
    .project-kanban-container {
      flex-direction: column;
      height: auto !important;
      min-height: auto !important;
    }
    .project-kanban-column {
      min-width: 100% !important;
      max-height: 400px;
    }
    .project-modal {
      max-width: 95% !important;
      margin: 0 auto;
    }
    .project-modal-content {
      padding: 16px !important;
    }
    .project-modal-header {
      padding: 12px 16px !important;
    }
  }
  @media (max-width: 640px) {
    .project-title {
      font-size: 1.5rem !important;
    }
    .project-subtitle {
      font-size: 0.75rem !important;
    }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleId = 'projects-mobile-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = mobileStyles;
    document.head.appendChild(style);
  }
}

// --- Project Health Report Modal ---
const ProjectHealthReportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [exportHover, setExportHover] = useState(false);
  const projects = [
    { name: 'Infrastructure Modernization', progress: 75, status: 'On Track', health: 92, budget: '$80K / $110K', lead: 'Jordan T.', color: '#22c55e' },
    { name: 'Core ERP Migration', progress: 42, status: 'In Review', health: 67, budget: '$45K / $70K', lead: 'Alex M.', color: '#f59e0b' },
    { name: 'Supply Chain Sync', progress: 90, status: 'Finishing', health: 95, budget: '$55K / $60K', lead: 'Sara K.', color: '#22c55e' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Health Report</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Q1 2026 — Generated {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-100">
          {[
            { label: 'Active Projects', value: '24', icon: Briefcase, color: '#3b82f6' },
            { label: 'Avg Health Score', value: '85%', icon: TrendingUp, color: '#22c55e' },
            { label: 'Budget Used', value: '72%', icon: DollarSign, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Project rows */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Initiative Breakdown</p>
          {projects.map((prj, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{prj.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lead: {prj.lead} · Budget: {prj.budget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: prj.health >= 80 ? '#dcfce7' : '#fef9c3', color: prj.health >= 80 ? '#16a34a' : '#ca8a04' }}>
                    {prj.health}% Health
                  </span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{prj.status}</span>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prj.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: prj.color }}
                />
              </div>
              <p className="text-xs text-slate-500 text-right">{prj.progress}% complete</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
          <p className="text-xs text-slate-400">Auto-generated · Q1 2026 Cycle</p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
              Close
            </button>
            <button
              onMouseEnter={() => setExportHover(true)}
              onMouseLeave={() => setExportHover(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition"
              style={{ backgroundColor: exportHover ? '#e2e8f0' : '#1a2744', color: exportHover ? '#000000' : '#ffffff' }}>
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Project Dynamics (Dashboard) ---
export const ProjectDashboard: React.FC = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportBtnHover, setReportBtnHover] = useState(false);

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
          <button
            onClick={() => setShowReport(true)}
            onMouseEnter={() => setReportBtnHover(true)}
            onMouseLeave={() => setReportBtnHover(false)}
            className="flex items-center gap-2 px-6 h-10 text-xs font-bold rounded-xl shadow-lg transition"
            style={{ backgroundColor: reportBtnHover ? '#e2e8f0' : '#1a2744', color: reportBtnHover ? '#000000' : '#ffffff' }}
          >
            <BarChart3 size={14} />
            Project Health Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 project-stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden bg-white"
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
          <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2rem]" style={{ backgroundColor: '#1a2744' }} />
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

        <div className="p-8 rounded-[2rem] shadow-sm relative overflow-hidden group/controls"
          style={{ backgroundColor: '#1a2744' }}>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 group-hover/controls:scale-150 transition-transform duration-700"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 relative z-10"
            style={{ color: 'rgba(255,255,255,0.45)' }}>PROJECT CONTROLS</h3>
          <div className="space-y-3 relative z-10">
            {[
              { label: 'New Project Instance', icon: Briefcase, color: 'text-blue-400' },
              { label: 'Dispatch Global Tasks', icon: Zap, color: 'text-amber-400' },
              { label: 'Generate Status Update', icon: Share2, color: 'text-emerald-400' },
              { label: 'Budget Reallocation', icon: DollarSign, color: 'text-rose-400' },
            ].map((act, i) => (
              <button key={i}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:translate-x-1 transition-all text-left"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${act.color}`}
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <act.icon size={16} />
                </div>
                <span className="text-[11px] font-bold tracking-wide text-white">{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showReport && <ProjectHealthReportModal onClose={() => setShowReport(false)} />}
    </motion.div>
  );
};

// --- Projects & Status ---
export const ProjectListPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', lead: '', status: 'On Track', budget: '', deadline: '' });
  const [createBtnHover, setCreateBtnHover] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm({ name: '', lead: '', status: 'On Track', budget: '', deadline: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects & Status</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">Comprehensive oversight of strategic lifecycle</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setCreateBtnHover(true)}
          onMouseLeave={() => setCreateBtnHover(false)}
          className="flex items-center gap-2 px-6 h-10 rounded-xl shadow-lg text-sm font-bold transition"
          style={{ backgroundColor: createBtnHover ? '#e2e8f0' : '#1a2744', color: createBtnHover ? '#000000' : '#ffffff' }}
        >
          <Plus size={14} /> Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 project-cards-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2rem]" style={{ backgroundColor: '#1a2744' }} />
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
                  <span className="text-[10px] font-bold text-slate-600">Jordan T.</span>
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

      {/* Create New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-white">Create New Project</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Project Name', key: 'name', type: 'text', placeholder: 'e.g. Infrastructure Modernization' },
                { label: 'Lead Manager', key: 'lead', type: 'text', placeholder: 'e.g. Jordan T.' },
                { label: 'Budget', key: 'budget', type: 'text', placeholder: 'e.g. $50,000' },
                { label: 'Deadline', key: 'deadline', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input required type={f.type} placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none">
                  {['On Track', 'In Review', 'At Risk', 'Finishing'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                  style={{ backgroundColor: '#1a2744', color: '#ffffff' }}>Create Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// --- Task Board (Kanban) ---
export const TasksPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ title: string; col: string; priority: string; assignee: string; due: string } | null>(null);
  const [form, setForm] = useState({ title: '', assignee: '', priority: 'Medium', column: 'Backlog', due: '' });
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm({ title: '', assignee: '', priority: 'Medium', column: 'Backlog', due: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Task Board</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Assign, track, and execute collaborative tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          className="flex items-center gap-2 px-6 h-10 rounded-xl text-sm font-bold transition"
          style={{ backgroundColor: btnHover ? '#e2e8f0' : '#1a2744', color: btnHover ? '#000000' : '#ffffff' }}
        >
          <Plus size={14} /> Create & Assign Task
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-280px)] min-h-[500px] project-kanban-container">
        {['Backlog', 'Processing', 'Final Review', 'Done'].map((col, idx) => (
          <div key={idx} className="flex-1 min-w-[320px] bg-slate-50/30 rounded-[2.5rem] border border-slate-100/50 flex flex-col p-6 project-kanban-column">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-slate-400' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{col}</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">12</span>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {[1, 2, 3].map(j => {
                const taskTitle = `Sync architecture patterns with core engine standards ${idx}${j}`;
                const priority = j % 2 === 0 ? 'Urgent' : 'Medium';
                return (
                  <div key={j} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#1a2744' }} />
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant={j % 2 === 0 ? 'error' : 'warning'} className="text-[9px] uppercase tracking-widest leading-none px-2">{priority}</Badge>
                      <button
                        onClick={() => setSelectedTask({ title: taskTitle, col, priority, assignee: 'Jordan T.', due: `Oct 2${j}` })}
                        className="p-1 rounded-lg hover:bg-slate-100 transition"
                      >
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors uppercase tracking-tight">{taskTitle}</h4>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
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
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-white">Task Details</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Task</p>
                <p className="text-sm font-bold text-slate-900 uppercase">{selectedTask.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Column', value: selectedTask.col },
                  { label: 'Priority', value: selectedTask.priority },
                  { label: 'Assignee', value: selectedTask.assignee },
                  { label: 'Due Date', value: selectedTask.due },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedTask(null)}
                  className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                  style={{ backgroundColor: '#1a2744', color: '#ffffff' }}>Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create & Assign Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-white">Create & Assign Task</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Task Title</label>
                <input required type="text" placeholder="e.g. Sync architecture patterns"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Assign To</label>
                <input required type="text" placeholder="e.g. Jordan T."
                  value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none">
                    {['Urgent', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Column</label>
                  <select value={form.column} onChange={e => setForm({ ...form, column: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none">
                    {['Backlog', 'Processing', 'Final Review', 'Done'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                <input required type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                  style={{ backgroundColor: '#1a2744', color: '#ffffff' }}>Assign Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// --- Timesheets & Expenses ---
export const TimesheetPage: React.FC = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ title: '', category: 'Travel', amount: '', date: '', notes: '' });
  const [timesheetForm, setTimesheetForm] = useState({ project: '', task: '', hours: '', date: '', notes: '' });
  const [expenseBtnHover, setExpenseBtnHover] = useState(false);
  const [timesheetBtnHover, setTimesheetBtnHover] = useState(false);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExpenseModal(false);
    setExpenseForm({ title: '', category: 'Travel', amount: '', date: '', notes: '' });
  };

  const handleTimesheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTimesheetModal(false);
    setTimesheetForm({ project: '', task: '', hours: '', date: '', notes: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic">Project Financials & Time</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium lowercase italic">TRACK BILLABLE HOURS, TIMESHEETS, AND RESOURCE EXPENSES</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowExpenseModal(true)}
                  onMouseEnter={() => setExpenseBtnHover(true)}
                  onMouseLeave={() => setExpenseBtnHover(false)}
                  className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold transition"
                  style={{ backgroundColor: expenseBtnHover ? '#e2e8f0' : '#1a2744', color: expenseBtnHover ? '#000000' : '#ffffff' }}
                >
                  <DollarSign size={14} /> Add Expense
                </button>
                <button
                  onClick={() => setShowTimesheetModal(true)}
                  onMouseEnter={() => setTimesheetBtnHover(true)}
                  onMouseLeave={() => setTimesheetBtnHover(false)}
                  className="flex items-center gap-2 px-6 h-10 rounded-xl text-sm font-bold transition"
                  style={{ backgroundColor: timesheetBtnHover ? '#e2e8f0' : '#1a2744', color: timesheetBtnHover ? '#000000' : '#ffffff' }}
                >
                  <Clock size={14} /> Log Timesheet
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2rem]" style={{ backgroundColor: '#1a2744' }} />
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Weekly Effort Stream</h3>
                <div className="space-y-4 relative z-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1a2744' }}><Clock size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Architecture Mapping</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">DEV-00{i} • Jordan T.</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold" style={{ color: '#1a2744' }}>0{i}:20h</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-md relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2rem]" style={{ backgroundColor: '#1a2744' }} />
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

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">Add Expense</h2>
                </div>
                <button onClick={() => setShowExpenseModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expense Title</label>
                  <input required type="text" placeholder="e.g. Technical Travel"
                    value={expenseForm.title} onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none">
                    {['Travel', 'Equipment', 'Software', 'Consulting', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Amount</label>
                    <input required type="number" step="0.01" placeholder="e.g. 420.00"
                      value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                    <input required type="date" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                  <textarea placeholder="Additional details..."
                    value={expenseForm.notes} onChange={e => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                    className="w-full h-20 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowExpenseModal(false)}
                    className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                    style={{ backgroundColor: '#1a2744', color: '#ffffff' }}>Add Expense</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Log Timesheet Modal */}
        {showTimesheetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">Log Timesheet</h2>
                </div>
                <button onClick={() => setShowTimesheetModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <form onSubmit={handleTimesheetSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Project</label>
                  <input required type="text" placeholder="e.g. Infrastructure Modernization"
                    value={timesheetForm.project} onChange={e => setTimesheetForm({ ...timesheetForm, project: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Task</label>
                  <input required type="text" placeholder="e.g. Architecture Mapping"
                    value={timesheetForm.task} onChange={e => setTimesheetForm({ ...timesheetForm, task: e.target.value })}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Hours</label>
                    <input required type="number" step="0.25" placeholder="e.g. 2.5"
                      value={timesheetForm.hours} onChange={e => setTimesheetForm({ ...timesheetForm, hours: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                    <input required type="date" value={timesheetForm.date} onChange={e => setTimesheetForm({ ...timesheetForm, date: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                  <textarea placeholder="Work description..."
                    value={timesheetForm.notes} onChange={e => setTimesheetForm({ ...timesheetForm, notes: e.target.value })}
                    className="w-full h-20 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowTimesheetModal(false)}
                    className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                    style={{ backgroundColor: '#1a2744', color: '#ffffff' }}>Log Time</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
    </motion.div>
  );
};

// --- Client Sync (Customer Updates) ---
export const ClientSyncPage: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<{ client: string; message: string; date: string } | null>(null);
  const [shareBtnHover, setShareBtnHover] = useState(false);
  const [shareForm, setShareForm] = useState({
    clients: [] as string[],
    reportType: 'Full Progress',
    channel: 'Email Digest',
    includeFinancials: true,
    includeTimeline: true,
    message: ''
  });

  const availableClients = [
    'Client Portfolio Alpha 1',
    'Client Portfolio Alpha 2',
    'Client Portfolio Alpha 3',
    'Enterprise Client Beta',
    'Strategic Partner Gamma'
  ];

  const toggleClient = (client: string) => {
    setShareForm(prev => ({
      ...prev,
      clients: prev.clients.includes(client)
        ? prev.clients.filter(c => c !== client)
        : [...prev.clients, client]
    }));
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowShareModal(false);
    setShareForm({
      clients: [],
      reportType: 'Full Progress',
      channel: 'Email Digest',
      includeFinancials: true,
      includeTimeline: true,
      message: ''
    });
  };

  const handleChannelClick = (channel: string) => {
    setSelectedChannel(channel);
    setShowChannelModal(true);
  };

  const handleFeedbackClick = (client: string, message: string, date: string) => {
    setSelectedFeedback({ client, message, date });
    setShowFeedbackModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Synchronization</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Share progress, share reports, and maintain transparency</p>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              onMouseEnter={() => setShareBtnHover(true)}
              onMouseLeave={() => setShareBtnHover(false)}
              className="flex items-center gap-2 px-6 h-10 rounded-xl shadow-lg text-sm font-bold transition"
              style={{ backgroundColor: shareBtnHover ? '#e2e8f0' : '#1a2744', color: shareBtnHover ? '#000000' : '#ffffff' }}
            >
              <Share2 size={14} /> Share Progress Report
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
                 <div className="p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group" style={{ backgroundColor: '#1a2744' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>SYNC STATUS</h3>
                    <p className="text-4xl font-bold tracking-tighter" style={{ color: '#ffffff' }}>OPTIMAL</p>
                    <p className="text-[11px] mt-6 font-bold uppercase tracking-widest italic" style={{ color: '#60a5fa' }}>All clients on sync list</p>
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
                            <button
                              key={i}
                              onClick={() => handleChannelClick(ch.label)}
                              className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <ch.icon size={14} className={ch.color} />
                                <span className="text-[11px] font-bold text-slate-600">{ch.label}</span>
                            </button>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Feedback Loops</h3>
                     <button
                       onClick={() => alert('Manage All Feedback - Feature coming soon!')}
                       className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline"
                     >
                       Manage All Feedback
                     </button>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <button
                          key={i}
                          onClick={() => handleFeedbackClick(
                            `Client Portfolio Alpha ${i}`,
                            "Highly impressed with the progress on the Infrastructure module. The transparency in reporting is helping us align internal stakeholders better.",
                            `Today 09:1${i} AM`
                          )}
                          className="w-full flex gap-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group text-left"
                        >
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
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Channel Details Modal */}
        {showChannelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-visible" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl" style={{ backgroundColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedChannel}</h2>
                </div>
                <button onClick={() => setShowChannelModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4 rounded-b-2xl" style={{ backgroundColor: '#ffffff' }}>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Channel</p>
                  <p className="text-sm font-bold text-slate-900">{selectedChannel}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Description</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedChannel === 'Client Portal' && 'Share reports directly through the secure client portal with real-time updates.'}
                    {selectedChannel === 'Email Digest' && 'Send automated email summaries with project progress and key metrics.'}
                    {selectedChannel === 'PDF Export' && 'Generate and download comprehensive PDF reports for offline sharing.'}
                    {selectedChannel === 'Live Dashboard' && 'Provide clients with access to live, interactive project dashboards.'}
                  </p>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowChannelModal(false)}
                    className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                    style={{ backgroundColor: '#1a2744', color: '#ffffff' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Feedback Details Modal */}
        {showFeedbackModal && selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl overflow-visible" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl" style={{ backgroundColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">Client Feedback</h2>
                </div>
                <button onClick={() => setShowFeedbackModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4 rounded-b-2xl" style={{ backgroundColor: '#ffffff' }}>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Client</p>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.client}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.date}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Feedback</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{selectedFeedback.message}"</p>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Synchronized</span>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => alert('Reply feature coming soon!')}
                    className="px-5 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                    style={{ backgroundColor: '#1a2744', color: '#ffffff' }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Share Progress Report Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-visible" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl" style={{ backgroundColor: '#1a2744' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">Share Progress Report</h2>
                </div>
                <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <form onSubmit={handleShareSubmit} className="p-6 space-y-5 rounded-b-2xl overflow-y-auto max-h-[70vh]" style={{ backgroundColor: '#ffffff' }}>
                {/* Select Clients */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Select Clients</label>
                  <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                    {availableClients.map(client => (
                      <label key={client} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shareForm.clients.includes(client)}
                          onChange={() => toggleClient(client)}
                          className="w-4 h-4 rounded border-slate-300 text-[#1a2744] focus:ring-[#1a2744]"
                        />
                        <span className="text-xs font-medium text-slate-700">{client}</span>
                      </label>
                    ))}
                  </div>
                  {shareForm.clients.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">{shareForm.clients.length} client(s) selected</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Report Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Report Type</label>
                    <select
                      value={shareForm.reportType}
                      onChange={e => setShareForm({ ...shareForm, reportType: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                    >
                      {['Full Progress', 'Executive Summary', 'Financial Only', 'Timeline Only', 'Custom'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Share Channel */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Share Channel</label>
                    <select
                      value={shareForm.channel}
                      onChange={e => setShareForm({ ...shareForm, channel: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                    >
                      {['Email Digest', 'Client Portal', 'PDF Export', 'Live Dashboard'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Include Options */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Include in Report</label>
                  <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareForm.includeFinancials}
                        onChange={e => setShareForm({ ...shareForm, includeFinancials: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#1a2744] focus:ring-[#1a2744]"
                      />
                      <span className="text-xs font-medium text-slate-700">Financial Metrics & Budget Status</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareForm.includeTimeline}
                        onChange={e => setShareForm({ ...shareForm, includeTimeline: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#1a2744] focus:ring-[#1a2744]"
                      />
                      <span className="text-xs font-medium text-slate-700">Project Timeline & Milestones</span>
                    </label>
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Message (Optional)</label>
                  <textarea
                    placeholder="Add a personalized message for your clients..."
                    value={shareForm.message}
                    onChange={e => setShareForm({ ...shareForm, message: e.target.value })}
                    className="w-full h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] resize-none"
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Report will be sent immediately</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowShareModal(false)}
                      className="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={shareForm.clients.length === 0}
                      className="px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#1a2744', color: '#ffffff' }}
                    >
                      Share Report
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
    </motion.div>
  );
};
