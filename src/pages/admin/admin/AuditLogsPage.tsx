import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Download } from "lucide-react";
import Select from "../../../components/ui/Select";
import { adminApi } from "../../../services/api";
import toast from "react-hot-toast";

const getActionBadgeClass = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes('create')) return 'bg-emerald-100 text-emerald-700';
  if (a.includes('update') || a.includes('edit')) return 'bg-blue-100 text-blue-700';
  if (a.includes('delete') || a.includes('remove')) return 'bg-red-500 text-white';
  if (a.includes('login')) return 'bg-slate-100 text-slate-700';
  return 'bg-slate-100 text-slate-700';
};

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, searchTerm, userFilter, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs(currentPage, pageSize, searchTerm);
      if (res.success) {
        setLogs(res.data.items);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => 
        [new Date(log.createdAt).toLocaleString(), log.userName, log.action, `${log.entity} (${log.entityId})`, log.ipAddress].join(',')
      )
    ].join('\n');

    // Create blob and download
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
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-10 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="w-48">
          <Select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            options={[
              { label: 'All Users', value: 'All Users' },
              { label: 'John Doe', value: 'John Doe' },
              { label: 'Jane Smith', value: 'Jane Smith' },
              { label: 'Bob Johnson', value: 'Bob Johnson' },
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { label: 'All Actions', value: 'All Actions' },
              { label: 'Created', value: 'Created' },
              { label: 'Updated', value: 'Updated' },
              { label: 'Deleted', value: 'Deleted' },
              { label: 'Login', value: 'Login' },
            ]}
          />
        </div>
        <input
          type="date"
          className="h-10 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#002147] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-[#002147] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No logs found matching your criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs font-semibold">
                        {log.userName?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {log.entity} <span className="text-slate-400">#{log.entityId}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {log.ipAddress || 'Internal'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            className="px-3 py-1 text-sm font-medium rounded bg-[#002147] text-white"
          >
            {currentPage}
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * pageSize >= totalCount}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogsPage;
