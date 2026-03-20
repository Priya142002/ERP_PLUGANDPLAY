import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Icon } from '../ui/Icon';

// Common Chart Colors
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, rightElement, className = '' }) => (
  <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col ${className}`}>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {rightElement}
    </div>
    <div className="flex-1 w-full min-h-[300px]">
      {children}
    </div>
  </div>
);

// Mini Sparkline Component
const Sparkline: React.FC<{ data: any[]; color: string }> = ({ data, color }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false} 
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: string;
  sparkData: any[];
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon, color, sparkData }) => (
  <div className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${color}/5 bg-white`}>
    <div className={`absolute top-0 left-0 right-0 h-1.5 ${color} opacity-100`} />
    <div className="flex items-center justify-between mb-5">
      <div className={`w-12 h-12 ${color}/10 flex items-center justify-center ${color.replace('bg-', 'text-')} rounded-2xl shadow-sm border border-current/5 group-hover:scale-110 transition-transform`}>
        <Icon name={icon} size="sm" />
      </div>
      <Sparkline data={sparkData} color={color === 'bg-emerald-500' ? '#10b981' : color === 'bg-blue-500' ? '#3b82f6' : color === 'bg-indigo-500' ? '#6366f1' : '#f43f5e'} />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{label}</p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{value}</h2>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[10px] font-bold flex items-center px-1.5 py-0.5 rounded-md bg-white border border-slate-100 shadow-sm ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">vs last month</span>
        </div>
      </div>
    </div>
    <div className={`absolute bottom-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-2xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-bold text-slate-900">
              {entry.name}: {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SalesTrendChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartCard 
    title="Revenue & Performance Growth" 
    subtitle="Tracking net revenue and sales volume over time"
    rightElement={
      <select className="bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-all">
        <option>This Month</option>
        <option>Last Quarter</option>
      </select>
    }
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#6366f1" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorValue)" 
          animationDuration={1500}
        />
        <Area 
          type="monotone" 
          dataKey="orders" 
          stroke="#10b981" 
          strokeWidth={3} 
          fillOpacity={0}
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const ComparisonBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartCard 
    title="Department Performance" 
    subtitle="Monthly efficiency comparison across core units"
    className="lg:col-span-2"
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={24} animationDuration={1000} />
        <Bar dataKey="purchase" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={24} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const DistributionDonutChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ChartCard title="Revenue Distribution" subtitle="Income breakdown by business category">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          paddingAngle={8}
          dataKey="value"
          animationDuration={1500}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          align="center" 
          iconType="circle"
          content={({ payload }) => (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {payload?.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
);
