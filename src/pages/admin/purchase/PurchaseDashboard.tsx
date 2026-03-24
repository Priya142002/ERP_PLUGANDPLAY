import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag,
  Users, 
  CreditCard, 
  Clock,
  FileText,
  TrendingUp,
  Package,
  ChevronRight,
  ShieldCheck,
  Download
} from "lucide-react";
import Button from "../../../components/ui/Button";
import ReportModal from "../../../components/common/ReportModal";
import { generatePurchaseMetaReport, generatePurchaseExcelData } from "../../../utils/purchaseReportData";
import { exportToExcel } from "../../../utils/reportGenerator";
import { useNotifications } from "../../../context/AppContext";

const STAT_CARDS = [
  {
    title: "Procurement Capital",
    value: "₹1,24,500",
    icon: <ShoppingBag size={24} />,
    color: "bg-blue-600",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    trend: "+8.4% Rise",
    trendColor: "text-emerald-500",
    description: "Gross purchase expenditure"
  },
  {
    title: "Strategic Vendors",
    value: "48",
    icon: <Users size={24} />,
    color: "bg-indigo-600",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    trend: "+2 Active",
    trendColor: "text-indigo-500",
    description: "Qualified supplier base"
  },
  {
    title: "Capital Outflow",
    value: "₹12,380",
    icon: <CreditCard size={24} />,
    color: "bg-rose-500",
    iconBg: "bg-rose-50",
    iconText: "text-rose-500",
    trend: "-5.2% Drop",
    trendColor: "text-rose-500",
    description: "Pending settlements"
  },
  {
    title: "Doc Compliance",
    value: "156",
    icon: <FileText size={24} />,
    color: "bg-violet-600",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    trend: "+12% Vol",
    trendColor: "text-violet-500",
    description: "Verified monthly invoices"
  }
];

const RECENT_PURCHASES = [
  { id: '1', invoice: 'PINV-2026-001', vendor: 'TechNova Solutions', date: '2026-03-16', amount: '₹4,200.00', status: 'Settled' },
  { id: '2', invoice: 'PINV-2026-002', vendor: 'Global Logistics', date: '2026-03-15', amount: '₹1,850.50', status: 'Pending' },
  { id: '3', invoice: 'PINV-2026-003', vendor: 'Office Essentials', date: '2026-03-14', amount: '₹850.00', status: 'Settled' },
  { id: '4', invoice: 'PINV-2026-004', vendor: 'Vertex Industries', date: '2026-03-14', amount: '₹12,400.00', status: 'Partial' },
  { id: '5', invoice: 'PINV-2026-005', vendor: 'Pure Water Co.', date: '2026-03-13', amount: '₹120.00', status: 'Settled' },
];

export const PurchaseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showNotification } = useNotifications();

  // Get company name - use a default since CompanyProvider might not be available
  const companyName = 'Your Company';

  const handleGenerateMetaReport = () => {
    setIsReportModalOpen(true);
    showNotification({
      type: 'success',
      title: 'Report Generated',
      message: 'Purchase meta report has been generated successfully.',
      duration: 3000
    });
  };

  const handleExportExcel = () => {
    try {
      const excelData = generatePurchaseExcelData();
      exportToExcel(excelData, 'Purchase_Data');
      
      showNotification({
        type: 'success',
        title: 'Excel Downloaded',
        message: 'Purchase data has been exported to Excel successfully.',
        duration: 3000
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export purchase data to Excel.',
        duration: 5000
      });
    }
  };

  const reportData = generatePurchaseMetaReport(companyName);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Dashboard</h1>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Clock size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600">Ops Sync: Live</span>
          </div>
          <Button 
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 md:px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all flex items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            <Download size={14} style={{ color: '#ffffff' }} />
            <span className="hidden md:inline" style={{ color: '#ffffff' }}>Export</span>
          </Button>
          <Button 
            onClick={handleGenerateMetaReport}
            className="bg-violet-600 hover:bg-violet-700 px-4 md:px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-violet-900/10 active:scale-[0.98] transition-all flex items-center gap-2"
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


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Purchases */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-[#334e68]">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Procurement Stream</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="px-8 py-5 first:rounded-tl-none">Origin Ref (PINV)</th>
                  <th className="px-6 py-5">Strategic Vendor</th>
                  <th className="px-6 py-5">Timestamp</th>
                  <th className="px-6 py-5 text-right">Volume</th>
                  <th className="px-6 py-5 text-right pr-8 last:rounded-tr-none">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_PURCHASES.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-indigo-50/30 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{purchase.invoice}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400" />
                        {purchase.vendor}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{purchase.date}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-mono font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{purchase.amount}</span>
                    </td>
                    <td className="px-6 py-5 text-right pr-8 uppercase tracking-widest font-bold">
                      {purchase.status === 'Settled' ? (
                        <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                          <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <span className="text-[10px]">Settled</span>
                        </div>
                      ) : purchase.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5 text-amber-600">
                          <div className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px]">Pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5 text-blue-600">
                          <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                          <span className="text-[10px]">Partial</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Package size={18} />
              </div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Asset Mix</h3>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {[
              { label: 'Raw Materials', percentage: 65, color: 'bg-blue-500', value: '₹80,925' },
              { label: 'Finished Goods', percentage: 20, color: 'bg-indigo-500', value: '₹24,900' },
              { label: 'Critical Supplies', percentage: 10, color: 'bg-blue-400', value: '₹12,450' },
              { label: 'Cloud Services', percentage: 5, color: 'bg-slate-400', value: '₹6,225' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cat.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{cat.value}</p>
                  </div>
                  <span className="bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold">{cat.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={`h-full ${cat.color} rounded-full shadow-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseDashboard;
