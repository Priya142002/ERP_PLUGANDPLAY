import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Factory, 
  Settings, 
  ClipboardList, 
  Cpu, 
  ClipboardCheck, 
  PackageCheck, 
  Hammer,
  Truck,
  Package
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// --- Production Dashboard ---
export const ProductionDashboard: React.FC = () => {
  const stats = [
    { label: 'Active Work Orders', value: '24', icon: 'clipboard-list', color: 'bg-blue-600', trend: '8 Urgent' },
    { label: 'Daily Output', value: '840 Units', icon: 'factory', color: 'bg-emerald-600', trend: '+12% Today' },
    { label: 'OEE Rate', value: '84.5%', icon: 'cpu', color: 'bg-indigo-600', trend: 'Optimal' },
    { label: 'Maintenance Pending', value: '3 Machines', icon: 'refresh', color: 'bg-amber-500', trend: 'Scheduled' },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Real-time manufacturing monitoring and output control</p>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Shift: A (06:00 - 14:00)</span>
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
                {stat.icon === 'clipboard-list' && <ClipboardList size={20} />}
                {stat.icon === 'factory' && <Factory size={20} />}
                {stat.icon === 'cpu' && <Cpu size={20} />}
                {stat.icon === 'refresh' && <Icon name="refresh" size="sm" />}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm text-slate-600 border border-slate-100 transition-colors`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors uppercase tracking-[0.1em]">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs relative z-10">Live Work-Order Pipeline</h3>
          <div className="space-y-4 relative z-10">
            {[
              { order: 'WO-2024-001', product: 'Premium Headphones X1', progress: 85, stage: 'Final Assembly' },
              { order: 'WO-2024-002', product: 'Smart Fitness Tracker', progress: 40, stage: 'Circuit Bonding' },
              { order: 'WO-2024-003', product: 'Noise Cancelling Earbuds', progress: 15, stage: 'Molding' },
              { order: 'WO-2024-004', product: 'Ultra HD Monitor', progress: 65, stage: 'Quality Check' },
            ].map((wo, i) => (
              <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group/wo">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm group-hover/wo:scale-110 transition-transform">
                      <ClipboardList size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover/wo:text-blue-600 transition-colors uppercase tracking-tight">{wo.order}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{wo.product}</p>
                    </div>
                  </div>
                  <Badge variant={wo.progress > 70 ? 'success' : wo.progress > 30 ? 'info' : 'warning'} className="text-[9px] uppercase tracking-widest">{wo.stage}</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Progress Bar</span>
                    <span className="text-[9px] font-bold text-slate-700">{wo.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${wo.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full rounded-full shadow-sm ${wo.progress > 70 ? 'bg-emerald-500' : wo.progress > 30 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#002147] p-8 rounded-[2rem] text-white flex flex-col relative overflow-hidden group/actions shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 group-hover/actions:scale-150 transition-transform duration-700" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold font-bold uppercase tracking-[0.1em] text-white/40 text-xs">Production Controls</h3>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover/actions:rotate-90 transition-transform duration-500">
              <Settings size={18} />
            </div>
          </div>
          <div className="flex-1 space-y-3 relative z-10">
            {[
              { label: 'Issue Raw Materials', icon: Package, color: 'text-blue-400' },
              { label: 'Register Finished Goods', icon: PackageCheck, color: 'text-emerald-400' },
              { label: 'Submit Quality Report', icon: ClipboardCheck, color: 'text-indigo-400' },
              { label: 'Create Maintenance log', icon: Hammer, color: 'text-rose-400' },
            ].map((action, i) => (
              <button key={i} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 hover:translate-x-1 transition-all text-left group/btn">
                <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${action.color} group-hover/btn:scale-110 transition-transform`}>
                  <action.icon size={16} />
                </div>
                <span className="text-xs font-bold tracking-wide">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Bill of Materials (BOM) ---
export const BOMPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bill of Materials</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Define and manage product engineering recipes</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>Export BOM</Button>
        <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg active:scale-95 transition-all" leftIcon={<Plus size={14} />}>Create New BOM</Button>
      </div>
    </div>

    <div className="flex items-center gap-2 px-1">
      {['All BOMs', 'Active Recipes', 'Under Revision', 'Discontinued'].map((chip, idx) => (
        <button key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all border ${idx === 0 ? 'bg-[#002147] text-white border-[#002147] shadow-lg shadow-blue-910/10' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>{chip}</button>
      ))}
    </div>

    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-white/50 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search by Product Name, Code..." className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm text-slate-600 hover:border-slate-300 transition-all cursor-pointer">
                <span className="text-[11px] font-bold uppercase tracking-widest">Recipe Version</span>
                <Filter size={12} className="text-slate-400" />
            </div>
        </div>
        <table className="w-full">
            <thead>
                <tr className="bg-[#002147] text-white">
                    <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Produced Product</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none text-center">Material Count</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Last Updated</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em] border-none">Status</th>
                    <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em] border-none">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform"><Cpu size={16} /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Product XYZ-0{i}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">Main Circuitry & Audio Driver Pack</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5 text-center"><span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{12 + i} Items</span></td>
                        <td className="px-6 py-5 text-xs text-slate-500 font-medium">March {10+i}, 2026</td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5 text-emerald-600">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">ACTIVE V{i}.0</span>
                            </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                <button className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-100 transition-all active:scale-90"><Edit size={14} /></button>
                                <button className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl border border-rose-100 transition-all active:scale-90"><Trash2 size={14} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </motion.div>
);

// --- Production Planning ---
export const ProductionPlanningPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic">Production Master Planning</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium lowercase">FORECAST-BASED MANUFACTURING SCHEDULING</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg active:scale-95 transition-all" leftIcon={<Plus size={14} />}>New Schedule</Button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-20">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-blue-100 rotate-12 group-hover:rotate-0 transition-transform"><Calendar size={32} /></div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs">NO PLANNING ACTIVE FOR THIS CYCLE</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm italic">Production scheduling is currently synchronized with Sales orders. Initiate a new planning block to start manual scheduling.</p>
          <div className="mt-10 flex justify-center gap-4">
              <Button className="bg-[#002147] text-white px-8">START PLANNING</Button>
          </div>
      </div>
    </motion.div>
);

// --- Work Orders ---
export const WorkOrdersPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Work Orders</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Dispatch and track floor-level production orders</p>
            </div>
            <div className="flex items-center gap-3">
                <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg active:scale-95 transition-all" leftIcon={<Factory size={14} />}>Generate Work Order</Button>
            </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#002147] text-white uppercase tracking-widest text-[11px] font-bold">
                        <th className="px-8 py-4 text-left border-none">WO Number</th>
                        <th className="px-6 py-4 text-left border-none">Product Title</th>
                        <th className="px-6 py-4 text-center border-none">Quantity</th>
                        <th className="px-6 py-4 text-left border-none">Release Date</th>
                        <th className="px-6 py-4 text-left border-none">Floor Status</th>
                        <th className="px-8 py-4 text-right border-none">Tracking</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                            <td className="px-8 py-5 font-bold text-slate-900 italic text-sm">WO-2024-0{i}82</td>
                            <td className="px-6 py-5">
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Audio Processor Unit v2</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ref: SO-2024-991</p>
                            </td>
                            <td className="px-6 py-5 text-center"><span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">500 PCS</span></td>
                            <td className="px-6 py-5 text-xs text-slate-500 font-medium whitespace-nowrap">March {i*2}, 2026</td>
                            <td className="px-6 py-5">
                                <Badge variant={i % 2 === 0 ? 'success' : 'info'} className="text-[10px] tracking-widest">{i % 2 === 0 ? 'RUNNING' : 'QUEUED'}</Badge>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 group-hover:text-blue-600 transition-colors"><MoreHorizontal size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

// --- Job Cards ---
export const JobCardsPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operator Job Cards</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Task-level tracking for station operators and shift logs</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#002147] text-white flex items-center justify-center shadow-lg font-bold">OP-{i}</div>
                        <Badge variant="secondary" className="text-[10px]">STATION {i*2}</Badge>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Employee Assigned</p>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">Richard Thompson {i}</h4>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Task</p>
                            <h4 className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-tight">Main Board Soldering</h4>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Elapsed: 04:20:12</span>
                            <button className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-all">Mark as Done</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- Material Issue ---
export const MaterialIssuePage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Raw Material Issue</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Allocate and deduct materials from Warehouse for Work Orders</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" className="bg-[#002147] hover:bg-[#003366] text-white" leftIcon={<Truck size={14} />}>Issue Material</Button>
            </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6"><Package size={32} /></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Inventory linkage active. Ready for new material requisition.</p>
        </div>
    </motion.div>
);

// --- Finished Goods ---
export const FinishedGoodsPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-bold italic">Finished Goods Entry</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">REGISTER COMPLETED PRODUCTS FOR AUTOMATIC INVENTORY ADDITION</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10" leftIcon={<PackageCheck size={14} />}>Register Output</Button>
            </div>
        </div>
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 text-center bg-slate-50/30">
                <p className="text-slate-400 text-sm italic">Production logging is currently active. All entries will automatically update the Product Catalog in the Inventory module.</p>
            </div>
        </div>
    </motion.div>
);

// --- Quality Check ---
export const QualityCheckPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quality Inspection (QC)</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Verify manufactured items against engineering standards</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-blue-500 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-all"><ClipboardCheck size={16} /></div>
                        <Badge variant={i % 4 === 0 ? 'error' : 'success'}>{i % 4 === 0 ? 'REJECTED' : 'PASSED'}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">BATCH #{i}0029</p>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 uppercase tracking-tight">Inspected by QA-Sys {i}</h4>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- Machine Tracking ---
export const MachineTrackingPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Machine & Maintenance Tracking</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Monitor equipment runtime, health and scheduled downtime</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Hammer size={14} />}>Schedule Downtime</Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="p-6 flex items-center justify-between bg-slate-50/50 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm"><Cpu size={16} /></div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase">System-B{i} Node</h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                             <span className="text-[10px] font-bold">ONLINE</span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mechanical Health</span>
                                <span className="text-[10px] font-bold text-slate-700">9{8-i}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-200/20">
                                <motion.div initial={{ width: 0 }} whileInView={{ width: `9${8-i}%` }} transition={{ duration: 1 }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active Runtime</p>
                                <p className="text-sm font-bold text-slate-900 mt-1 italic">420 Hours</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Next Service</p>
                                <p className="text-sm font-bold text-rose-500 mt-1 uppercase tracking-tight">12 Days</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);
