import React from 'react';
import { PageTemplate } from '../PageTemplate';
import { Icon } from '../../../components/ui/Icon';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const BillingDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$428,240', icon: 'cash', color: 'bg-emerald-600', trend: '+18% MoM' },
    { label: 'Outstanding', value: '$24,500', icon: 'clock', color: 'bg-rose-600', trend: '12 Overdue' },
    { label: 'Recurring Rev.', value: '$86,000', icon: 'refresh', color: 'bg-blue-600', trend: 'Active Subs' },
    { label: 'Avg Payout', value: '$1,240', icon: 'document-text', color: 'bg-indigo-600', trend: 'Per Client' },
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revenue Dynamics</h1>
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
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm ${stat.trend.includes('Overdue') ? 'text-rose-600' : 'text-emerald-600'} border border-slate-100 transition-colors`}>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-lg font-bold text-slate-900 mb-8 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs relative z-10">Payment Collection Status</h3>
          <div className="flex items-end justify-between gap-4 h-[250px] pt-8 relative z-10">
            {[65, 82, 45, 94, 72, 88].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div className="w-full bg-slate-50 rounded-2xl relative group/bar overflow-hidden" style={{ height: `${v}%` }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute inset-x-0 bottom-0 bg-[#002147] opacity-80 group-hover/bar:opacity-100 transition-all font-bold" 
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#002147] p-8 rounded-[2rem] text-white flex flex-col relative overflow-hidden group/actions">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 group-hover/actions:scale-150 transition-transform duration-700" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold font-bold uppercase tracking-[0.1em] text-white/40 text-xs text-xs">Quick Actions</h3>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover/actions:rotate-90 transition-transform duration-500">
              <Icon name="cog" size="sm" />
            </div>
          </div>
          <div className="flex-1 space-y-3 relative z-10">
            {[
              { label: 'Generate Monthly Invoices', icon: 'document-text' },
              { label: 'Send Payment Reminders', icon: 'bell' },
              { label: 'Download Tax Summary', icon: 'cash' },
              { label: 'View Reconciliation Report', icon: 'chart-bar' },
            ].map((action, i) => (
              <button key={i} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 hover:translate-x-1 transition-all text-left group/btn">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 group-hover/btn:scale-110 transition-transform">
                  <Icon name={action.icon} size="xs" />
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

export const InvoicesPage: React.FC = () => (
  <PageTemplate title="Invoice Management" description="Create and monitor customer billing and receivables" icon="receipt-tax">
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <div className="flex gap-4">
          <div className="relative">
            <Icon name="search" size="xs" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search Invoice #" className="pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none w-64 shadow-sm" />
          </div>
          <select className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none shadow-sm">
            <option>All Payments</option>
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
        <button className="px-6 h-10 bg-[#002147] text-white text-xs font-bold rounded-xl shadow-lg border-none flex items-center gap-2">
          <Icon name="plus" size="xs" /> Create Invoice
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <th className="px-8 py-4 text-left">Invoice No.</th>
            <th className="px-6 py-4 text-left">Customer</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Amount</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-8 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <tr key={i} className="hover:bg-slate-50 transition-all cursor-pointer">
              <td className="px-8 py-4 text-sm font-bold text-slate-900 italic">INV-2023-00{i}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">C</div>
                  <span className="text-xs font-medium text-slate-700">Global Partners #{i}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">Oct {10 + i}, 2023</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">$2,840.00</td>
              <td className="px-6 py-4">
                <Badge variant={i % 3 === 0 ? 'error' : i % 2 === 0 ? 'success' : 'warning'} className="text-[10px]">
                  {i % 3 === 0 ? 'Overdue' : i % 2 === 0 ? 'Paid' : 'Pending'}
                </Badge>
              </td>
              <td className="px-8 py-4 text-right">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                  <Icon name="chevron-right" size="xs" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </PageTemplate>
);

export const RemindersPage: React.FC = () => (
  <PageTemplate title="Payment Reminders" description="Automated alerts and notifications for overdue accounts" icon="bell">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-8">Reminder Settings</h3>
        <div className="flex-1 space-y-6">
          {[
            { label: '3 Days Before Due', status: 'Enabled', type: 'Email' },
            { label: 'On Due Date', status: 'Enabled', type: 'SMS + Email' },
            { label: '7 Days After Due', status: 'Disabled', type: 'Call' },
            { label: 'Final Notice (30 Days)', status: 'Enabled', type: 'Registered Mail' },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 transition-all hover:border-blue-200">
              <div>
                <p className="text-sm font-bold text-slate-900">{setting.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">{setting.type}</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
                setting.status === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                  setting.status === 'Enabled' ? 'right-1' : 'left-1'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center">
            <Icon name="bell" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-900">Critical Overdue Notifications</h3>
            <p className="text-xs text-rose-600 font-medium">8 clients have ignored the second reminder</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Corporate Alpha #{i}</h4>
                  <p className="text-[11px] text-rose-600 font-bold uppercase mt-1 tracking-widest">$4,500 Overdue</p>
                </div>
                <Badge variant="error" className="text-[10px]">90 Days+</Badge>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white border border-slate-200 text-[#002147] text-[10px] font-bold uppercase rounded-xl hover:bg-slate-50">View Statement</button>
                <button className="flex-1 py-3 bg-[#002147] text-white text-[10px] font-bold uppercase rounded-xl hover:bg-blue-900 shadow-lg">Manual Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageTemplate>
);
