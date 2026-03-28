import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  FileText,
  Download,
  Calendar,
  Activity,
  Shield
} from "lucide-react";
import Button from "../../../components/ui/Button";
import ReportModal from "../../../components/common/ReportModal";
import { useNotifications } from "../../../context/AppContext";

const STAT_CARDS = [
  {
    title: "Total Shipments",
    value: "145",
    icon: <Package size={24} />,
    color: "bg-[#002147]",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    trend: "+12% Vol",
    trendColor: "text-emerald-500",
    description: "All shipments this month"
  },
  {
    title: "Pending Dispatch",
    value: "12",
    icon: <Clock size={24} />,
    color: "bg-[#002147]",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    trend: "+3 Today",
    trendColor: "text-amber-500",
    description: "Awaiting dispatch"
  },
  {
    title: "In-Transit",
    value: "45",
    icon: <Truck size={24} />,
    color: "bg-[#002147]",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    trend: "+8 Active",
    trendColor: "text-indigo-500",
    description: "Currently in transit"
  },
  {
    title: "Delivered",
    value: "88",
    icon: <CheckCircle size={24} />,
    color: "bg-[#002147]",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    trend: "+15 Today",
    trendColor: "text-emerald-500",
    description: "Successfully delivered"
  },
  {
    title: "Returns",
    value: "3",
    icon: <RotateCcw size={24} />,
    color: "bg-[#002147]",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    trend: "-2 Drop",
    trendColor: "text-rose-500",
    description: "Return requests"
  }
];

const RECENT_ACTIVITIES = [
  { id: '1', type: 'Shipment', action: 'Created', ref: 'SHP-001', detail: 'TechNova Solutions', time: '10 mins ago', status: 'info' },
  { id: '2', type: 'Dispatch', action: 'Completed', ref: 'DSP-002', detail: 'SkyShip Cargo', time: '25 mins ago', status: 'success' },
  { id: '3', type: 'Delivery', action: 'Confirmed', ref: 'DLV-001', detail: 'John Smith', time: '1 hour ago', status: 'success' },
  { id: '4', type: 'Return', action: 'Requested', ref: 'RET-001', detail: 'Damaged Product', time: '2 hours ago', status: 'warning' },
];

const ALERTS_DATA = [
  { id: '1', type: 'Delay', message: 'SHP-004 delayed by 2 hours', severity: 'warning', time: '30 mins ago' },
  { id: '2', type: 'Failed', message: 'Delivery attempt failed for SHP-008', severity: 'error', time: '1 hour ago' },
  { id: '3', type: 'Return', message: 'RET-003 pending approval', severity: 'info', time: '3 hours ago' },
];

export const LogisticsDashboardPage: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showNotification } = useNotifications();

  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
    showNotification({
      type: 'success',
      title: 'Report Generated',
      message: 'Logistics report has been generated successfully.',
      duration: 3000
    });
  };

  const handleExportExcel = () => {
    showNotification({
      type: 'success',
      title: 'Excel Downloaded',
      message: 'Logistics data has been exported to Excel successfully.',
      duration: 3000
    });
  };

  const reportData = {
    metadata: {
      companyName: 'Your Company',
      reportTitle: 'Logistics Operations Report',
      reportType: 'general' as const,
      generatedBy: 'System',
      dateRange: 'March 2026'
    },
    sections: [
      {
        title: 'Shipment Overview',
        type: 'stats' as const,
        data: [
          { title: 'Total Shipments', value: '145', description: 'All shipments this month' },
          { title: 'Pending Dispatch', value: '12', description: 'Awaiting dispatch' },
          { title: 'In-Transit', value: '45', description: 'Currently in transit' },
          { title: 'Delivered', value: '88', description: 'Successfully delivered' },
          { title: 'Returns', value: '3', description: 'Return requests' }
        ]
      }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Logistics Dashboard</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Period: Mar 2026</span>
          </div>
          <Button 
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 md:px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all flex items-center gap-2 hover:!text-black [&_svg]:hover:!text-black [&_span]:hover:!text-black"
            style={{ color: '#ffffff' }}
          >
            <Download size={14} style={{ color: '#ffffff' }} />
            <span className="hidden md:inline" style={{ color: '#ffffff' }}>Export</span>
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="bg-violet-600 hover:bg-violet-700 px-4 md:px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-violet-900/10 active:scale-[0.98] transition-all flex items-center gap-2 hover:!text-black [&_svg]:hover:!text-black [&_span]:hover:!text-black"
            style={{ color: '#ffffff' }}
          >
            <FileText size={14} style={{ color: '#ffffff' }} />
            <span className="hidden md:inline" style={{ color: '#ffffff' }}>Report</span>
          </Button>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={reportData}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {STAT_CARDS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden bg-white"
          >
            <div className={`h-1.5 w-full ${stat.color}`} />
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg md:rounded-xl shadow-sm group-hover:scale-110 transition-transform ${stat.iconBg} ${stat.iconText}`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white shadow-sm ${stat.trendColor} border border-slate-100`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
                <p className="text-[9px] text-slate-400 mt-2 font-medium italic opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">"{stat.description}"</p>
              </div>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipment Status Chart */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Shipment Status</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            {[
              { label: 'Delivered', percentage: 61, color: 'bg-emerald-500', value: '88' },
              { label: 'In-Transit', percentage: 31, color: 'bg-indigo-500', value: '45' },
              { label: 'Pending', percentage: 8, color: 'bg-amber-500', value: '12' },
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value} Shipments</p>
                  </div>
                  <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold">{item.percentage}%</span>
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
        </div>

        {/* Delivery Success Rate */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Shield size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Success Rate</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">96.7%</div>
              <p className="text-xs text-slate-500 font-medium">Delivery Success Rate</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">On-Time Deliveries</span>
                <span className="text-sm font-bold text-emerald-600">85/88</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Failed Attempts</span>
                <span className="text-sm font-bold text-rose-600">3/88</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Avg Delivery Time</span>
                <span className="text-sm font-bold text-indigo-600">2.4 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Trend */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <RotateCcw size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Returns Trend</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-rose-600 mb-2">2.1%</div>
              <p className="text-xs text-slate-500 font-medium">Return Rate</p>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Damaged Products</span>
                <span className="text-sm font-bold text-slate-900">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Wrong Items</span>
                <span className="text-sm font-bold text-slate-900">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600">Customer Requests</span>
                <span className="text-sm font-bold text-slate-900">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Activity size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recent Activities</h3>
            </div>
          </div>
          <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-[#002147]/30 hover:shadow-lg hover:shadow-[#002147]/20 transition-all group relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#002147] group-hover:w-2 transition-all" />
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`h-9 w-9 md:h-11 md:w-11 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${
                    activity.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    activity.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    {activity.type === 'Shipment' ? <Package size={20} /> : 
                     activity.type === 'Dispatch' ? <Truck size={20} /> : 
                     activity.type === 'Delivery' ? <CheckCircle size={20} /> :
                     <RotateCcw size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{activity.ref}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-1.5 py-0.5 rounded-md shadow-sm">
                        {activity.type}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{activity.action}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-600 truncate max-w-[120px]">{activity.detail}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Alerts</h3>
            </div>
          </div>
          <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1">
            {ALERTS_DATA.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                alert.severity === 'error' ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400' :
                alert.severity === 'warning' ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400' :
                'bg-blue-50/50 border-blue-200 hover:border-blue-400'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${
                    alert.severity === 'error' ? 'text-rose-600' :
                    alert.severity === 'warning' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        alert.severity === 'error' ? 'bg-rose-100 text-rose-700' :
                        alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{alert.type}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LogisticsDashboardPage;
