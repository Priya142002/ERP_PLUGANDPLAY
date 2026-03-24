import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Wallet,
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

const ACCOUNTS_STATS = [
  {
    title: "Capital Assets",
    value: "₹12,45,000",
    icon: <Briefcase size={24} />,
    color: "bg-blue-600",
    trend: "+4.2% Growth",
    trendColor: "text-emerald-500",
    description: "Total fixed & current liquidity"
  },
  {
    title: "Net Net Profit",
    value: "₹1,58,400",
    icon: <TrendingUp size={24} />,
    color: "bg-emerald-600",
    trend: "+12.1% Alpha",
    trendColor: "text-emerald-500",
    description: "Final margin after deductions"
  },
  {
    title: "Accounts Payable",
    value: "₹42,500",
    icon: <Wallet size={24} />,
    color: "bg-rose-500",
    trend: "-5.4% Delta",
    trendColor: "text-rose-500",
    description: "Outstanding vendor obligations"
  },
  {
    title: "Liquid Cash",
    value: "₹3,84,200",
    icon: <DollarSign size={24} />,
    color: "bg-amber-500",
    trend: "+2.8% Flow",
    trendColor: "text-emerald-500",
    description: "Consolidated bank balances"
  }
];

const RECENT_VOUCHERS = [
  { id: '1', date: '2026-03-16', voucherNo: 'PV-001', type: 'Payment', ref: 'INV-2026-001', amount: '₹4,410.00', status: 'Approved' },
  { id: '2', date: '2026-03-16', voucherNo: 'RV-001', type: 'Receipt', ref: 'SINV-2026-001', amount: '₹13,020.00', status: 'Authorized' },
  { id: '3', date: '2026-03-15', voucherNo: 'JV-001', type: 'Journal', ref: 'ADJ-101', amount: '₹1,200.00', status: 'Approved' },
  { id: '4', date: '2026-03-15', voucherNo: 'PV-002', type: 'Payment', ref: 'OFF-404', amount: '₹892.50', status: 'Approved' },
  { id: '5', date: '2026-03-14', voucherNo: 'RV-002', type: 'Receipt', ref: 'SINV-2026-002', amount: '₹893.03', status: 'Approved' },
];

export const AccountsDashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Dashboard</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Clock size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Audit: 2m ago</span>
          </div>
          <Button className="bg-[#002147] text-white text-[10px] md:text-xs font-bold rounded-xl hover:bg-[#003366] transition-all shadow-lg shadow-blue-900/10 border-none px-4 md:px-6 h-10">
            Generate Statement
          </Button>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {ACCOUNTS_STATS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 md:p-5 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden bg-white`}
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
        {/* Recent Vouchers */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorization Journal</h3>
            </div>
            <button className="text-[9px] font-bold text-[#334e68] uppercase tracking-widest hover:underline px-3 py-1.5 bg-indigo-50/50 rounded-lg transition-colors">Audit Full Trail</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="px-8 py-5 first:rounded-tl-none">Voucher Reference</th>
                  <th className="px-6 py-5 text-center">Protocol Type</th>
                  <th className="px-6 py-5">Origin/Ref</th>
                  <th className="px-6 py-5 text-right">Value</th>
                  <th className="px-6 py-5 text-right pr-8 last:rounded-tr-none">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_VOUCHERS.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-400" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{voucher.voucherNo}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{voucher.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Badge 
                        variant={voucher.type === 'Payment' ? 'error' : voucher.type === 'Receipt' ? 'success' : 'info'}
                        className="px-3 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-widest group-hover:shadow-sm"
                      >
                        {voucher.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{voucher.ref}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{voucher.amount}</span>
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                      <div className={`flex items-center justify-end gap-1.5 ${voucher.status === 'Approved' || voucher.status === 'Authorized' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-opacity-80">{voucher.status}</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${voucher.status === 'Approved' || voucher.status === 'Authorized' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 animate-pulse'}`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-[#334e68] transition-colors group">
              Review Global Ledger <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <PieChart size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Resource Drainage</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {[
              { label: 'Procurement Gap', percentage: 45, color: 'bg-indigo-500', value: '₹18,500' },
              { label: 'Infrastructure', percentage: 25, color: 'bg-blue-500', value: '₹10,250' },
              { label: 'Payroll & HR', percentage: 20, color: 'bg-emerald-500', value: '₹8,200' },
              { label: 'Taxation Matrix', percentage: 10, color: 'bg-slate-400', value: '₹4,100' },
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                  </div>
                  <Badge variant="default" className="bg-slate-50 text-slate-600 border-slate-100 font-mono text-[10px]">{item.percentage}%</Badge>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={`h-full ${item.color} rounded-full shadow-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-200 relative overflow-hidden group shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-emerald-600 shadow-sm border border-slate-200 group-hover:rotate-6 transition-transform">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight border-b border-slate-200 pb-1 mb-1">Budget Status</p>
                <p className="text-[11px] text-emerald-600 font-bold">In-Compliance Range</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium mt-1">Operational burn rate is within the seasonal projection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountsDashboard;
