import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Download } from "lucide-react";
import Select from "../../../components/ui/Select";

const MOCK_LOGS = [
  {
    id: 1,
    timestamp: '2 mins ago',
    user: 'John Doe',
    userInitials: 'JD',
    action: 'Created',
    resource: 'Invoice #1234',
    status: 'Success'
  },
  {
    id: 2,
    timestamp: '15 mins ago',
    user: 'Jane Smith',
    userInitials: 'JS',
    action: 'Updated',
    resource: 'Product SKU-789',
    status: 'Success'
  },
  {
    id: 3,
    timestamp: '1 hour ago',
    user: 'Bob Johnson',
    userInitials: 'BJ',
    action: 'Deleted',
    resource: 'Customer Record',
    status: 'Success'
  },
  {
    id: 4,
    timestamp: '2 hours ago',
    user: 'John Doe',
    userInitials: 'JD',
    action: 'Login',
    resource: 'System Access',
    status: 'Success'
  },
  {
    id: 5,
    timestamp: '3 hours ago',
    user: 'Jane Smith',
    userInitials: 'JS',
    action: 'Updated',
    resource: 'Company Profile',
    status: 'Success'
  },
];

const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'Created':
      return 'bg-slate-100 text-slate-700';
    case 'Updated':
      return 'bg-blue-100 text-blue-700';
    case 'Deleted':
      return 'bg-red-500 text-white';
    case 'Login':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [currentPage, setCurrentPage] = useState(1);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Status'];
    const csvContent = [
      headers.join(','),
      ...MOCK_LOGS.map(log =>
        [log.timestamp, log.user, log.action, log.resource, log.status].join(',')
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
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">{log.timestamp}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs font-semibold">
                      {log.userInitials}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{log.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{log.resource}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Showing 1 to 5 of 50 entries</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm font-medium rounded ${currentPage === page
                ? 'bg-[#002147] text-white'
                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogsPage;