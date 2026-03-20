import React from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  AlertTriangle, 
  RefreshCcw, 
  Archive, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar,
  ChevronRight
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { TrendingUp } from "lucide-react";

const STAT_CARDS = [
  {
    title: "Active Products",
    value: "1,248",
    icon: <Package size={24} />,
    color: "bg-indigo-600",
    hoverColor: "group-hover:bg-indigo-50/30",
    accentColor: "group-hover:border-indigo-600",
    trend: "+12.5% Growth",
    trendColor: "text-emerald-500",
    description: "Successfully indexed SKUs"
  },
  {
    title: "Minimum Level",
    value: "42",
    icon: <AlertTriangle size={24} />,
    color: "bg-amber-500",
    hoverColor: "group-hover:bg-amber-50/30",
    accentColor: "group-hover:border-amber-500",
    trend: "8 Attention Items",
    trendColor: "text-amber-600",
    description: "Approaching safety stock"
  },
  {
    title: "Reorder Required",
    value: "15",
    icon: <RefreshCcw size={24} />,
    color: "bg-rose-500",
    hoverColor: "group-hover:bg-rose-50/30",
    accentColor: "group-hover:border-rose-600",
    trend: "Critical Priority",
    trendColor: "text-rose-600",
    description: "Stockouts imminent"
  },
  {
    title: "Zero Inventory",
    value: "05",
    icon: <Archive size={24} />,
    color: "bg-slate-800",
    hoverColor: "group-hover:bg-slate-50/50",
    accentColor: "group-hover:border-slate-800",
    trend: "System Depleted",
    trendColor: "text-slate-500",
    description: "Currently unavailable"
  }
];

const TOP_SELLING_TODAY = [
  { id: '1', name: 'Premium Headphones', category: 'Electronics', amount: '$4,299.00', count: 15, trend: '+12%' },
  { id: '2', name: 'Smart Watch v2', category: 'Wearables', amount: '$2,850.50', count: 12, trend: '+8%' },
  { id: '3', name: 'Coffee Maker', category: 'Appliances', amount: '$1,599.00', count: 8, trend: '+5%' },
  { id: '4', name: 'Wireless Mouse', category: 'Accessories', amount: '$950.00', count: 20, trend: '+15%' },
  { id: '5', name: 'Laptop Stand', category: 'Accessories', amount: '$850.00', count: 10, trend: '+3%' },
];

const RECENT_ACTIVITIES = [
  { id: '1', item: 'Nike Air Max', action: 'Stock In', warehouse: 'Main WH', qty: '+50', time: '10 mins ago', type: 'positive' },
  { id: '2', item: 'iPhone 13 Case', action: 'Dispatch', warehouse: 'Sub WH', qty: '-12', time: '25 mins ago', type: 'negative' },
  { id: '3', item: 'Dell Monitor', action: 'Transfer', warehouse: 'Central', qty: '20', time: '1 hour ago', type: 'neutral' },
  { id: '4', item: 'Sony WH-1000XM4', action: 'Adjustment', warehouse: 'Main WH', qty: '-2', time: '2 hours ago', type: 'negative' },
];

export const InventoryDashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {STAT_CARDS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 md:p-5 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden ${stat.color.replace('bg-', 'bg-')}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
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
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Performance Leaders</h3>
            </div>
            <button className="text-[9px] font-bold text-[#334e68] uppercase tracking-widest hover:underline px-3 py-1.5 bg-indigo-50/50 rounded-lg transition-colors">View Market Data</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="px-4 md:px-8 py-4 md:py-5 first:rounded-tl-none">Product Details</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-center">Velocity</th>
                  <th className="px-4 md:px-6 py-4 md:py-5 text-right pr-4 md:pr-8 last:rounded-tr-none">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TOP_SELLING_TODAY.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <div className="flex items-center">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate group-hover:text-slate-500 transition-colors">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 group-hover:bg-emerald-100/50 transition-colors">
                        <ArrowUpRight size={10} className="font-bold md:size-[12px]" />
                        <span className="text-[10px] md:text-[11px] font-bold">{item.trend}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-right pr-4 md:pr-8">
                      <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.amount}</span>
                      <div className="text-[9px] text-slate-400 font-bold tracking-tighter mt-0.5">{item.count} Units</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inventory Activity */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Activity size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operation Logs</h3>
            </div>
            <button className="text-[9px] font-bold text-amber-600 uppercase tracking-widest hover:underline px-3 py-1.5 bg-amber-50/50 rounded-lg transition-colors">Real-time Stream</button>
          </div>
          <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500" />
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`h-9 w-9 md:h-11 md:w-11 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${
                    activity.type === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    activity.type === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {activity.action === 'Stock In' ? <ArrowUpRight size={22} /> : 
                     activity.action === 'Dispatch' ? <ArrowDownRight size={22} /> : 
                     <RefreshCcw size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{activity.item}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-1.5 py-0.5 rounded-md shadow-sm">
                        {activity.warehouse}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{activity.action}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-mono font-bold ${
                    activity.qty.startsWith('+') ? 'text-emerald-600' : 
                    activity.qty.startsWith('-') ? 'text-rose-600' : 
                    'text-slate-900'
                  }`}>{activity.qty}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-[#334e68] transition-colors group">
              View Detailed Operations <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
