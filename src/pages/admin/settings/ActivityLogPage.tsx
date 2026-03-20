import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Clock,
  Monitor,
  Shield, 
  Activity,
  ChevronRight,
  Database,
  ArrowRightLeft,
  FileText
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

const MOCK_LOGS = [
  { 
    id: 1, 
    user: 'Admin User', 
    action: 'Modified Chart of Accounts', 
    details: 'Enabled nested group "Current Assets"',
    time: '2026-03-16 15:45:10',
    type: 'Security',
    ip: '192.168.1.104',
    module: 'Accounts'
  },
  { 
    id: 2, 
    user: 'Sarah Johnson', 
    action: 'Created Payment Voucher', 
    details: 'Voucher #PV-2026-001 created for Vendor "Global Solutions"',
    time: '2026-03-16 15:30:22',
    type: 'Transaction',
    ip: '192.168.1.112',
    module: 'Accounts'
  },
  { 
    id: 3, 
    user: 'Michael Chen', 
    action: 'Inventory Adjustment', 
    details: 'Decreased "Laptop Dell XPS" stock by 2 units (Reason: Damage)',
    time: '2026-03-16 14:15:05',
    type: 'Update',
    ip: '10.0.0.45',
    module: 'Inventory'
  },
  { 
    id: 4, 
    user: 'Admin User', 
    action: 'User Logout', 
    details: 'Session closed normally',
    time: '2026-03-16 13:00:00',
    type: 'System',
    ip: '192.168.1.104',
    module: 'Auth'
  },
  { 
    id: 5, 
    user: 'Emily Davis', 
    action: 'Updated Customer Profile', 
    details: 'Changed contact number for "Tech Corp Ltd"',
    time: '2026-03-16 12:45:55',
    type: 'Update',
    ip: '172.16.2.89',
    module: 'Sales'
  },
];

const MOCK_LOGIN_LOGS = [
  {
    id: 1,
    user: 'Admin User',
    time: '2026-03-16 09:00:22',
    ip: '192.168.1.104',
    device: 'Chrome / Windows 11',
    status: 'Success',
    location: 'Dubai, UAE'
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    time: '2026-03-16 08:45:10',
    ip: '192.168.1.112',
    device: 'Safari / iPhone 15 Pro',
    status: 'Success',
    location: 'Abu Dhabi, UAE'
  },
  {
    id: 3,
    user: 'Michael Chen',
    time: '2026-03-15 14:20:05',
    ip: '10.0.0.45',
    device: 'Firefox / macOS Sonoma',
    status: 'Success',
    location: 'London, UK'
  },
  {
    id: 4,
    user: 'Root System',
    time: '2026-03-15 03:00:00',
    ip: '127.0.0.1',
    device: 'Node.js / Linux Server',
    status: 'System Auth',
    location: 'Internal'
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Security': return 'error';
    case 'Transaction': return 'success';
    case 'System': return 'secondary';
    case 'Update': return 'info';
    default: return 'primary';
  }
};

const getModuleIcon = (module: string) => {
  switch (module) {
    case 'Accounts': return <Database size={14} />;
    case 'Inventory': return <Activity size={14} />;
    case 'Sales': return <ArrowRightLeft size={14} />;
    case 'Auth': return <Shield size={14} />;
    default: return <ClipboardList size={14} />;
  }
};

export const ActivityLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'screen' | 'login'>('screen');

  const closeDetails = () => setSelectedLog(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity</h1>
            <p className="text-slate-500 mt-1">Manage your ERP system efficiently</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Calendar size={18} />}>
            March 2026
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Download size={18} />}
            className="bg-[#3b4cb8]"
          >
            Export Logs
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('screen')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'screen' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          Screen Activity
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          Login sessions
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Events', value: '142', color: 'bg-blue-500' },
          { label: 'Security Alerts', value: '3', color: 'bg-rose-500' },
          { label: 'Data Changes', value: '89', color: 'bg-emerald-500' },
          { label: 'System Tasks', value: '12', color: 'bg-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
            </div>
            <div className={`h-2 w-10 rounded-full ${stat.color} opacity-20`} />
          </div>
        ))}
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by user or action..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            leftIcon={<Filter size={14} />}
            className="rounded-xl border-slate-200 h-10 px-4 text-slate-700 font-bold"
          >
            Advanced Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              {activeTab === 'screen' ? (
                <tr>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-6 py-5">Operator</th>
                  <th className="px-6 py-5">Activity</th>
                  <th className="px-6 py-5">Module</th>
                  <th className="px-6 py-5 text-right pr-8">Source</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-8 py-5">Session Start</th>
                  <th className="px-6 py-5">User Account</th>
                  <th className="px-6 py-5">Device / OS</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-right pr-8">Status</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTab === 'screen' ? (
                MOCK_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-[13px] font-medium text-slate-500 font-mono tracking-tight">{log.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border-2 border-white shadow-sm shrink-0">
                          {log.user.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-slate-900 leading-tight block w-20">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 min-w-[320px]">
                      <div className="flex gap-4">
                        <div className="pt-1">
                          <Badge 
                            variant={getTypeColor(log.type)} 
                            className="text-[10px] py-0.5 px-2.5 font-bold uppercase tracking-wider rounded-md h-fit whitespace-nowrap"
                          >
                            {log.type}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <span className="text-sm font-bold text-slate-800 leading-tight block">
                            {log.action}
                          </span>
                          <p className="text-[12px] text-slate-500 font-medium leading-relaxed max-w-xs group-hover:text-slate-700 transition-colors">
                            {log.details}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#3b4cb8] uppercase tracking-wider bg-[#3b4cb8]/5 w-fit px-3 py-1.5 rounded-lg border border-[#3b4cb8]/10">
                        {getModuleIcon(log.module)}
                        {log.module}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right pr-8">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 font-mono bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer shrink-0"
                      >
                        <Monitor size={12} />
                        {log.ip}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                MOCK_LOGIN_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-[13px] font-medium text-slate-500 font-mono tracking-tight">{log.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border-2 border-white shadow-sm shrink-0">
                          {log.user.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-slate-900 leading-tight">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-800">{log.device}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-medium text-slate-600">{log.location}</span>
                    </td>
                    <td className="px-6 py-6 text-right pr-8">
                      <Badge variant={log.status === 'Success' ? 'success' : 'secondary'} className="text-[10px] py-0.5 px-2.5 font-bold uppercase tracking-wider rounded-md">
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex justify-center">
          <button className="text-[12px] font-bold text-[#3b4cb8] hover:text-[#2d3a8c] hover:underline flex items-center gap-2 transition-colors">
            View full {activeTab === 'screen' ? 'log screen activity' : 'login session'} history 
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {/* Details Modal (Ported from original logScreenActivity.js) */}
      <Modal
        isOpen={!!selectedLog}
        onClose={closeDetails}
        title={selectedLog?.action || "Log Details"}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Form</p>
                <p className="text-sm font-bold text-slate-900">{selectedLog?.module}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p>
              <p className="text-xs font-medium text-slate-600">{selectedLog?.time}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Detailed Logs (xDataLog)</label>
            <div className="w-full bg-slate-900 rounded-xl p-4 font-mono text-xs text-indigo-300 leading-relaxed border border-slate-800 shadow-inner min-h-[200px] overflow-auto">
              <pre className="whitespace-pre-wrap">
                {selectedLog?.details || "No extended logs available for this entry."}
              </pre>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="secondary" onClick={closeDetails} className="px-8">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
