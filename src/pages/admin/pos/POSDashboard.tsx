import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  Download
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { exportSingleSheetToExcel } from '../../../utils/reportGenerator';

export const POSDashboard: React.FC = () => {

  const todayStats = [
    { label: 'Today Sales', value: '$8,450', icon: DollarSign, color: 'slate', change: '+8%' },
    { label: 'Total Orders', value: '156', icon: ShoppingCart, color: 'slate', change: '+12%' },
    { label: 'Customers Served', value: '142', icon: Users, color: 'slate', change: '+5%' },
    { label: 'Avg Order Value', value: '$54.17', icon: TrendingUp, color: 'slate', change: '+3%' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', items: 3, amount: 125.50, payment: 'Cash', status: 'Completed', time: '10:45 AM' },
    { id: 'ORD-002', customer: 'Jane Smith', items: 5, amount: 245.00, payment: 'Card', status: 'Completed', time: '10:42 AM' },
    { id: 'ORD-003', customer: 'Bob Wilson', items: 2, amount: 85.00, payment: 'UPI', status: 'Hold', time: '10:38 AM' },
    { id: 'ORD-004', customer: 'Alice Brown', items: 4, amount: 180.75, payment: 'Card', status: 'Completed', time: '10:35 AM' },
    { id: 'ORD-005', customer: 'Charlie Davis', items: 1, amount: 45.00, payment: 'Cash', status: 'Completed', time: '10:30 AM' },
  ];

  const handleExportReport = () => {
    const headers = ['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Time'];
    const data = recentOrders.map(order => [
      order.id,
      order.customer,
      order.items,
      order.amount,
      order.payment,
      order.status,
      order.time
    ]);
    exportSingleSheetToExcel(headers, data, 'POS_Orders');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">POS Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Point of Sale - Entry Screen</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" 
            leftIcon={<Download size={14} />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Today's Stats - POS Specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {todayStats.map((stat, i) => {
          const colorMap: Record<string, { bg: string; text: string }> = {
            blue: { bg: 'bg-blue-600', text: 'text-blue-600' },
            slate: { bg: 'bg-slate-600', text: 'text-slate-600' },
            purple: { bg: 'bg-purple-600', text: 'text-purple-600' },
          };
          const colors = colorMap[stat.color];
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#002147]" />
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg}/10 flex items-center justify-center ${colors.text} rounded-xl`}>
                  <stat.icon size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-1">Latest POS orders and payments</p>
          </div>
          <Badge variant="info" className="text-[10px]">
            Today: {recentOrders.length} Orders
          </Badge>
        </div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#002147] text-white">
                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Order ID</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Customer</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-widest">Items</th>
                <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest">Amount</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Payment</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-all">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-800 text-sm">{order.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-slate-700 text-sm">{order.customer}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-slate-600 text-sm">{order.items}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-bold text-emerald-600 text-sm">${order.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={order.payment === 'Cash' ? 'success' : order.payment === 'Card' ? 'info' : 'warning'} className="text-[10px]">
                      {order.payment}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={order.status === 'Completed' ? 'success' : 'warning'} className="text-[10px]">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-slate-500 text-xs">{order.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
