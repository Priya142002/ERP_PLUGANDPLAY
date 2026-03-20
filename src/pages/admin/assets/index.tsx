import React from 'react';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Archive, 
  MapPin, 
  TrendingDown, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  DollarSign, 
  FileText,
  UserCheck,
  Zap,
  Hammer
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// --- Asset Intelligence (Dashboard) ---
export const AssetDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Enterprise Assets', value: '1,240', icon: Archive, color: 'bg-blue-600', trend: 'Val: $2.4M' },
    { label: 'Asset Allocation', value: '842', icon: UserCheck, color: 'bg-emerald-600', trend: '68% Utilized' },
    { label: 'Critical Servicing', value: '12', icon: Hammer, color: 'bg-amber-500', trend: 'Scheduled' },
    { label: 'Net Book Value', value: '$1.8M', icon: RefreshCw, color: 'bg-indigo-600', trend: 'Synced' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Intelligence Hub</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">FULL-LIFECYCLE RESOURCE TRACKING & DEPRECIATION MONITORING</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-slate-600 font-bold text-xs">
            <Calendar size={14} className="text-blue-600" />
            <span>Fiscal Cycle: Mar 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg">
            Generate Asset Inventory
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
            className={`p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden ${stat.color}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm text-slate-600 border border-slate-100 transition-colors`}>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Asset Performance & Conditioning</h3>
            <div className="space-y-6 relative z-10">
                {[
                  { label: 'Optimized Flow', status: 'Excellent', count: 720, progress: 92, color: 'bg-emerald-500' },
                  { label: 'Stable Usage', status: 'Good', count: 340, progress: 75, color: 'bg-blue-500' },
                  { label: 'Servicing Pending', status: 'Fair', count: 120, progress: 45, color: 'bg-amber-500' },
                  { label: 'Critical Health', status: 'Poor', count: 60, progress: 15, color: 'bg-rose-500' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all cursor-pointer group/item">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50 group-hover/item:scale-110 transition-transform`}><Zap size={16} className={item.color.replace('bg-', 'text-')} /></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 transition-colors">{item.label}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.status} Conditioning</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-bold text-slate-900">{item.count}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Asset Count</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-[#002147] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden flex flex-col group/actions">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 translate-y-12 transition-transform duration-700 group-hover/actions:scale-150" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-8 relative z-10">STRATEGIC ASSET ACTIONS</h3>
            <div className="flex-1 space-y-3 relative z-10">
                {[
                    { label: 'Initialize New Asset', icon: Plus, color: 'text-blue-400' },
                    { label: 'Dispatch Global Allocation', icon: UserCheck, color: 'text-emerald-400' },
                    { label: 'Schedule Fleet Maintenance', icon: Hammer, color: 'text-amber-400' },
                    { label: 'Process Financial Disposal', icon: Trash2, color: 'text-rose-400' },
                ].map((act, i) => (
                    <button key={i} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 hover:translate-x-1 transition-all group/btn">
                         <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${act.color} group-hover/btn:scale-110 transition-transform`}><act.icon size={16} /></div>
                         <span className="text-[11px] font-bold tracking-wide">{act.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Asset Management & Allocation ---
export const AssetManagePage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Management Suite</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Create, edit, and allocate corporate resources across departments</p>
            </div>
            <div className="flex items-center gap-3">
                 <Button variant="secondary" className="px-5 h-10 rounded-xl" leftIcon={<Filter size={14} />}>Advanced Filters</Button>
                 <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Plus size={14} />}>Onboard Asset</Button>
            </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-4 border-b border-slate-50 bg-white/50">
                <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search by Asset Code, Name, Serials..." className="pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
                </div>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#002147] text-white uppercase tracking-[0.15em] text-[10px] font-bold">
                        <th className="px-8 py-4 text-left border-none">Asset Catalog Info</th>
                        <th className="px-6 py-4 text-left border-none">Condition & Utilization</th>
                        <th className="px-6 py-4 text-left border-none">Active Location</th>
                        <th className="px-6 py-4 text-left border-none">Allocation Status</th>
                        <th className="px-8 py-4 text-right border-none">Control</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center font-mono text-[9px] font-bold text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                        <span>ASST</span>
                                        <span className="text-slate-400">-{i}00{i}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">Enterprise Workstation M-0{i}</p>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Category: IT Hardware</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <Badge variant={i % 3 === 0 ? 'success' : 'info'} className="text-[9px] tracking-widest">ECO-SYSTEM {i % 2 === 0 ? 'OPTIMAL' : 'GOOD'}</Badge>
                                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Usage: {85 - i*4}%</p>
                            </td>
                            <td className="px-6 py-5 font-bold text-slate-700 text-xs italic"><div className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> Main HUB, Floor {i}</div></td>
                            <td className="px-6 py-5"><Badge variant={i % 2 === 0 ? 'primary' : 'secondary'}>{i % 2 === 0 ? 'ALLOCATED' : 'AVAILABLE'}</Badge></td>
                            <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 group-hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

// --- Asset Depreciation Engine ---
export const AssetDepreciationPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold">
            <div>
                <h1 className="text-2xl tracking-tight text-slate-900 italic">Financial Asset Depreciation</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium lowercase">AUTOMATED CALCULATION & RESIDUAL VALUE MONITORING</p>
            </div>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl shadow-lg border-none" leftIcon={<RefreshCw size={14} />}>Recalculate Net Book Value</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Historical Depreciation Stream</h3>
                 <div className="aspect-[16/9] bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center text-slate-300 italic text-sm relative z-10">
                      Visualizing depreciation trends...
                 </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Depreciation Setup Metrics</h3>
                 <div className="space-y-4">
                     {[
                        { label: 'Calculated Residual Value', value: '$840,200', desc: 'Net asset value after current cycle' },
                        { label: 'Cycle Depreciation Charge', value: '$42,300', desc: 'Debit to operational expenses' },
                        { label: 'Active Asset Base', value: '420 Units', desc: 'Subject to straight-line reduction' },
                     ].map((st, i) => (
                        <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">{st.label}</p>
                             <h4 className="text-lg font-bold text-[#002147]">{st.value}</h4>
                             <p className="text-[10px] text-slate-500 font-medium italic mt-1">{st.desc}</p>
                        </div>
                     ))}
                 </div>
            </div>
        </div>
    </motion.div>
);

// --- Asset Maintenance & Repair ---
export const MaintenancePage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance & Repair Logs</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Coordinate scheduled servicing and log maintenance events</p>
            </div>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Hammer size={14} />}>Schedule Service</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="p-6 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform"><Hammer size={18} /></div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase">Service B-{i}02</h4>
                         </div>
                         <Badge variant="warning">PENDING</Badge>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Associated Asset</p>
                             <h4 className="text-sm font-bold text-slate-900 mt-1 italic">Enterprise Chassis-Q{i}</h4>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Last Service: Mar 10</span>
                            <span className="text-blue-600 italic">ETA: Oct 1{i}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- Asset Disposal ---
export const AssetDisposalPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold">
            <div>
                <h1 className="text-2xl tracking-tight text-slate-900 italic uppercase">Asset Disposal Control</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">PROCESS ASSET SALES, SCRAPPING, AND FINANCIAL DE-REGISTRATION</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="secondary" className="px-5 h-10 rounded-xl text-rose-500 border-rose-100" leftIcon={<Trash2 size={14} />}>Scrap Asset</Button>
                <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<DollarSign size={14} />}>Sell Asset Product</Button>
            </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm border-dashed">
             <div className="w-20 h-20 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><TrendingDown size={40} /></div>
             <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium lowercase italic">NO DISPOSAL EVENTS TRIGGERED IN THE CURRENT AUDIT CYCLE. ALL RETIRED ASSETS MUST UNDERGO FINANCIAL SCRUTINY BEFORE DE-REGISTRATION.</p>
        </div>
    </motion.div>
);

// --- Asset Reports ---
export const AssetReportsPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset & Value Insights</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Analytical reports on asset distribution, valuation, and lifetime cycles</p>
            </div>
            <Button variant="secondary" className="px-5 h-10 rounded-xl" leftIcon={<FileText size={14} />}>Export PDF Suite</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
                { label: 'Lifetime Value Report', icon: TrendingDown, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Depreciation Summary', icon: RefreshCw, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Asset Utilization', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Maintenance ROI', icon: Hammer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             ].map((rep, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group">
                     <div className={`w-12 h-12 ${rep.bg} ${rep.color} flex items-center justify-center rounded-2xl mb-6 shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}><rep.icon size={24} /></div>
                     <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{rep.label}</h4>
                </div>
             ))}
        </div>
    </motion.div>
);

const BarChart3 = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
);
