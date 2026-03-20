import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  ShoppingCart,
  Clock,
  Briefcase,
  ChevronRight,
  Target
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

const SALES_STATS = [
  {
    title: "Projected Revenue",
    value: "$425,800",
    icon: <DollarSign size={24} />,
    color: "bg-blue-600",
    trend: "+12.5% High",
    trendColor: "text-emerald-500",
    description: "Total invoice throughput"
  },
  {
    title: "Processed Orders",
    value: "1,240",
    icon: <ShoppingCart size={24} />,
    color: "bg-indigo-600",
    trend: "+5.2% Yield",
    trendColor: "text-indigo-500",
    description: "Order fulfillment volume"
  },
  {
    title: "Market Expansion",
    value: "+85",
    icon: <Users size={24} />,
    color: "bg-emerald-600",
    trend: "+18% Alpha",
    trendColor: "text-emerald-500",
    description: "Unique new client entities"
  },
  {
    title: "Avg. Transaction",
    value: "$2,450",
    icon: <Briefcase size={24} />,
    color: "bg-amber-500",
    trend: "-2.1% Swing",
    trendColor: "text-rose-500",
    description: "Average gross deal value"
  }
];

const RECENT_SALES = [
  { id: '1', invoice: 'SINV-2026-001', customer: 'Nexus Enterprises', date: '2026-03-16', amount: '$12,400.00', status: 'Settled' },
  { id: '2', invoice: 'SINV-2026-002', customer: 'Sarah Johnson', date: '2026-03-16', amount: '$850.50', status: 'Pending' },
  { id: '3', invoice: 'SINV-2026-003', customer: 'Global Trade Corp', date: '2026-03-15', amount: '$4,200.00', status: 'Settled' },
  { id: '4', invoice: 'SINV-2026-004', customer: 'David Smith', date: '2026-03-15', amount: '$1,120.00', status: 'Partial' },
  { id: '5', invoice: 'SINV-2026-005', customer: 'Urban Styles', date: '2026-03-14', amount: '$2,900.00', status: 'Settled' },
];

export const SalesDashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revenue Intelligence</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Clock size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Sync: Just Now</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all">
            Export Financials
          </Button>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {SALES_STATS.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction Ledger</h3>
            </div>
            <button className="text-[9px] font-bold text-[#334e68] uppercase tracking-widest hover:underline px-3 py-1.5 bg-indigo-50/50 rounded-lg transition-colors">View Detailed Journal</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="px-8 py-5 first:rounded-tl-none">Invoice Reference</th>
                  <th className="px-6 py-5">Customer Origin</th>
                  <th className="px-6 py-5">Timestamp</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-right pr-8 last:rounded-tr-none">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{sale.invoice}</span>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-600">
                      <div className="flex items-center gap-2 group-hover:text-slate-800 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400" />
                        {sale.customer}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{sale.date}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{sale.amount}</span>
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                      <Badge 
                        variant={sale.status === 'Settled' ? 'success' : sale.status === 'Pending' ? 'warning' : 'info'}
                        className="px-3 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider group-hover:shadow-sm"
                      >
                        {sale.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-[#3b4cb8] transition-colors group">
              Explore Full Sales Matrix <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Channel Alpha</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {[
              { label: 'Direct Enterprise', percentage: 55, color: 'bg-blue-500', value: '$234,190' },
              { label: 'B2B Partners', percentage: 30, color: 'bg-indigo-500', value: '$127,740' },
              { label: 'Retail Agents', percentage: 10, color: 'bg-emerald-500', value: '$42,580' },
              { label: 'Others', percentage: 5, color: 'bg-slate-400', value: '$21,290' },
            ].map((channel) => (
              <div key={channel.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{channel.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{channel.value}</p>
                  </div>
                  <Badge variant="default" className="bg-slate-50 text-slate-600 border-slate-100 font-mono text-[10px]">{channel.percentage}%</Badge>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${channel.percentage}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={`h-full ${channel.color} rounded-full shadow-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl text-[#3b4cb8] shadow-sm border border-indigo-50 group-hover:rotate-6 transition-transform">
                <Target size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight border-b border-indigo-100/50 pb-1 mb-1">Growth Forecast</p>
                <p className="text-[11px] text-[#3b4cb8] font-bold">14% Projected Upswing</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium mt-1">Direct Enterprise channel is scaling rapidly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesDashboard;
