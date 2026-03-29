import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Download, Loader2 } from "lucide-react";
import { adminApi } from "../../../services/api";
import { useNotifications } from "../../../context/AppContext";

const getActionBadgeClass = (action: string) => {
  switch (action.toUpperCase()) {
    case 'CREATE':
    case 'CREATED':
      return 'bg-green-100 text-green-700';
    case 'UPDATE':
    case 'UPDATED':
      return 'bg-blue-100 text-blue-700';
    case 'DELETE':
    case 'DELETED':
      return 'bg-red-500 text-white';
    case 'LOGIN':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const AuditLogsPage: React.FC = () => {
  const { showNotification } = useNotifications();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, searchTerm]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs(currentPage, pageSize, searchTerm);
      if (res.success) {
        setLogs(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      showNotification({ type: 'error', title: 'Error', message: 'Failed to fetch audit logs', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Entity', 'Entity ID'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log =>
        [new Date(log.createdAt).toLocaleString(), log.userName, log.action, log.entity, log.entityId || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-slate-700" />
          <h1 className="text-xl font-semibold text-slate-900">Audit Logs</h1>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-stretch gap-4">
        <div className="relative flex-1">
           <input
            type="text"
            placeholder="Search by user, action or entity..."
            value={searchTerm}
            onChange={(e) => {
               setSearchTerm(e.target.value);
               setCurrentPage(1);
            }}
            className="w-full h-10 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#002147] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                         <Loader2 className="animate-spin mb-2" size={24} />
                         <span>Loading logs...</span>
                      </div>
                   </td>
                </tr>
            ) : logs.length === 0 ? (
               <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400">
                     No audit records found.
                  </td>
               </tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                   {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#E8EBF5] text-[#002147] flex items-center justify-center text-xs font-bold">
                      {log.userName?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-900">{log.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getActionBadgeClass(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{log.entity}</td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.newValues}>
                   ID: {log.entityId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-slate-600">
           Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogsPage;