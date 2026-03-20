import React from 'react';
import { PageTemplate } from '../PageTemplate';
import { Icon } from '../../../components/ui/Icon';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Building2, 
  ClipboardList,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// --- Fleet Intelligence (Dashboard) ---
export const LogisticsDashboard: React.FC = () => {
  const stats = [
    { label: 'Active Shipments', value: '184', icon: Truck, color: 'bg-blue-600', trend: '12 Delayed' },
    { label: 'Delivered Today', value: '42', icon: CheckCircle, color: 'bg-emerald-600', trend: '+15% Eff' },
    { label: 'Avg Delivery Time', value: '2.4 Days', icon: Clock, color: 'bg-indigo-600', trend: '-4h vs. Last' },
    { label: 'Feedback Score', value: '4.8/5', icon: Star, color: 'bg-amber-500', trend: 'Optimal' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fleet Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Global logistics monitoring and delivery optimization</p>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Cycle: Mar 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all">
            Generate Logistics Meta-Report
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
                <stat.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm ${stat.trend.includes('Delayed') ? 'text-rose-600 border-rose-100' : 'text-emerald-600 border-slate-100'} border transition-colors`}>
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
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs relative z-10">Real-time Delivery Performance</h3>
          <div className="space-y-4 relative z-10">
            {[
              { zone: 'Northern Region', performance: 94, status: 'Optimal', count: 42 },
              { zone: 'Southern Hub', performance: 82, status: 'Delayed Fleet', count: 28 },
              { zone: 'Eastern Sector', performance: 88, status: 'Normal', count: 35 },
              { zone: 'Western Coast', performance: 91, status: 'Optimal', count: 39 },
            ].map((zone, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group/zone">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50 group-hover/zone:scale-110 transition-transform">
                    <MapPin size={16} className={zone.performance > 90 ? 'text-emerald-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover/zone:text-blue-600 transition-colors">{zone.zone}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{zone.status} • {zone.count} Orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#002147]">{zone.performance}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">SLA Check</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#002147] p-8 rounded-[2rem] text-white relative overflow-hidden flex flex-col group/map shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-x-20 -translate-y-20 group-hover/map:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6 font-bold uppercase tracking-[0.1em] text-white/40 text-xs">Live Heatmap Tracking</h3>
            <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm mb-6 flex-1">
              <Zap size={32} className="text-blue-400 mb-4 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">Synchronized with 18 drivers in real-time</p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                Monitor Map
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest px-1">
                <span>Fleet Load</span>
                <span className="text-blue-400">72% Capacity</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: '72%' }}
                   transition={{ duration: 1.5 }}
                   className="h-full bg-blue-500 rounded-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Order Processing (Packing & QC) ---
export const LogisticsOrderPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic uppercase">PACKING & ORDER FULFILLMENT</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">PREPARE SHIPMENTS, QUALITY CHECK, AND BARCODE LABELING</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<ClipboardList size={14} />}>Start Batch Packing</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Pending Packing', 'In QC Inspection', 'Ready for Dispatch', 'Recently Dispatched'].map((stage, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-[#002147] transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl ${idx === 0 ? 'bg-amber-50 text-amber-600' : idx === 1 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center font-bold`}><Icon name={idx === 1 ? 'shield-check' : 'package'} size="sm" /></div>
                        <span className="text-sm font-bold text-slate-900">{12 + idx * 5}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stage}</p>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Processing Floor</h3>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500">Live Updates</span>
                </div>
            </div>
            <div className="p-12 text-center text-slate-300 italic text-sm">
                No orders currently in the active packing queue. Synchronize with Inventory to pull new orders.
            </div>
        </div>
    </motion.div>
);

// --- Shipment Tracking ---
export const ShipmentListPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Management</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Coordinate outbound logistics and cross-border movements</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-5 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<ChevronRight size={14} />}>Track Single ID</Button>
        <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all" leftIcon={<Plus size={14} />}>Create Shipment</Button>
      </div>
    </div>

    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="SH-0092..." className="pl-10 pr-4 py-2 text-[13px] bg-slate-50/50 border border-slate-200 rounded-xl w-64 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm text-slate-600 hover:border-slate-300 transition-all cursor-pointer">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Zone Filter</span>
                    <Filter size={12} className="text-slate-400" />
                </div>
            </div>
        </div>
        <table className="w-full">
            <thead>
                <tr className="bg-[#002147] text-white uppercase tracking-[0.15em] text-[10px] font-bold">
                    <th className="px-8 py-4 text-left border-none">Tracking Info</th>
                    <th className="px-6 py-4 text-left border-none">Destination Hub</th>
                    <th className="px-6 py-4 text-left border-none">Carrier Flow</th>
                    <th className="px-6 py-4 text-left border-none">ETA Date</th>
                    <th className="px-8 py-4 text-right border-none italic">Control</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Package size={16} /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 uppercase">SH-009{i}29</p>
                                    <p className="text-[11px] text-slate-500 font-medium">Ref: ORD-293{i}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <p className="text-sm font-bold text-slate-700">North Jersey Distribution</p>
                            <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                                <Badge variant="success" className="text-[9px] py-0 px-1.5">Zone A-2</Badge>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <div className="space-y-1.5 min-w-[140px]">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">In-Transit</span>
                                    <span className="text-[9px] font-bold text-blue-600">{20 * i}%</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${20 * i}%` }} transition={{ duration: 1 }} className="h-full bg-blue-600" />
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5 text-xs text-slate-500 font-medium italic">Oct 1{i}, 2026</td>
                        <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 group-hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </motion.div>
);

// --- Delivery Routes ---
export const DeliveryPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-bold italic">Route Optimization Suite</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">DYNAMIC ASSIGNMENT & REAL-TIME DRIVER COORDINATION</p>
            </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[320px] bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#002147] text-white flex items-center justify-center font-bold italic shadow-lg group-hover:rotate-6 transition-transform">R-{i}</div>
                        <Badge variant="info">D-Fleet {i}</Badge>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assigned Specialist</p>
                             <h4 className="text-sm font-bold text-slate-900 mt-0.5">Michael Henderson {i}</h4>
                        </div>
                        <div className="flex items-center justify-between px-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stops: 12</span>
                             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">In Progress</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-colors ${s < 3 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-300 border-slate-50'}`}>{s}</div>
                            ))}
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 italic text-[10px]">...</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

// --- Carrier Partners ---
export const CarrierPartnersPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Carrier Partners</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">External shipping providers and resource management</p>
            </div>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Plus size={14} />}>Onboard Carrier</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
                { name: 'Global Logistics Inc.', code: 'GLI-99', reliability: 98, status: 'Active' },
                { name: 'Swift Express Co.', code: 'SEC-24', reliability: 92, status: 'Reviewing' },
                { name: 'Oceanic Freight', code: 'OF-102', reliability: 85, status: 'Active' },
             ].map((carrier, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-2 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-150" />
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-indigo-600 group-hover:bg-[#002147] group-hover:text-white transition-all"><Building2 size={24} /></div>
                        <Badge variant={carrier.status === 'Active' ? 'success' : 'warning'}>{carrier.status.toUpperCase()}</Badge>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div>
                             <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{carrier.name}</h4>
                             <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest">Registration ID: {carrier.code}</p>
                        </div>
                        <div className="space-y-1.5 pt-4 border-t border-slate-50">
                             <div className="flex items-center justify-between px-1">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reliability Rating</span>
                                 <span className="text-[10px] font-bold text-emerald-600">{carrier.reliability}%</span>
                             </div>
                             <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${carrier.reliability}%` }} />
                             </div>
                        </div>
                    </div>
                </div>
             ))}
        </div>
    </motion.div>
);

// --- Customer Feedback & Intelligence ---
export const CustomerFeedbackPage: React.FC = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Delivery Feedback</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Customer satisfaction ratings and service quality metrics</p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 h-10 shadow-sm text-slate-600 font-bold text-xs">
                <span>Total Ratings: 1,280</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
                 <div className="bg-[#002147] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">CSAT SCORE</h3>
                    <p className="text-5xl font-bold tracking-tighter">4.92</p>
                    <div className="mt-6 flex gap-1">
                         {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i < 5 ? '#3b82f6' : 'none'} className="text-blue-400" />)}
                    </div>
                    <p className="text-[11px] text-blue-400 mt-6 font-bold uppercase tracking-widest">+0.4% this cycle</p>
                 </div>
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">Satisfaction Breakdown</h4>
                    <div className="space-y-6">
                        {['Service Speed', 'Product Condition', 'Driver Conduct'].map((metric, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{metric}</span>
                                    <span className="text-slate-900">{92 - i * 4}%</span>
                                </div>
                                <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-600 rounded-full" style={{ width: `${92 - i * 4}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Customer Reviews</h3>
                     <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">View All Feedback</button>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[#002147] shadow-sm">U{i}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">User Customer #{i}</h4>
                                        <div className="flex gap-1 mt-0.5">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= (5-i%2) ? '#fbbf24' : 'none'} className="text-amber-400" />)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 hours ago</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed italic">"Extremely satisfied with the delivery speed and the professional conduct of the driver. The items reached in perfect condition!"</p>
                            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 italic">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Shipment: SH-00{i}29</span>
                                <Badge variant="success" className="text-[8px] py-0">VERIFIED DELIVERY</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);
