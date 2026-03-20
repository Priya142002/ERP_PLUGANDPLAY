import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Mail, Calendar, Trash2, 
  Clock, Users
} from "lucide-react";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Mock data
const ALL_USERS = [
  { id: 1, name: "David Kim", email: "david@buildsafe.co", role: "CompanyAdmin", joined: "Jan 2025", status: "Active", lastActive: "2h ago", avatar: "DK" },
  { id: 2, name: "Jamie Park", email: "jamie@buildsafe.co", role: "Employee", joined: "Feb 2025", status: "Active", lastActive: "5m ago", avatar: "JP" },
  { id: 3, name: "Sarah Lee", email: "sarah@buildsafe.co", role: "Employee", joined: "Mar 2025", status: "Active", lastActive: "1d ago", avatar: "SL" },
  { id: 4, name: "Sarah Moore", email: "sarah@steelworks.co", role: "CompanyAdmin", joined: "Mar 2025", status: "Active", lastActive: "1d ago", avatar: "SM" },
  { id: 5, name: "Tom Wilson", email: "tom@steelworks.co", role: "Employee", joined: "Apr 2025", status: "Active", lastActive: "3h ago", avatar: "TW" },
  { id: 6, name: "Tom Walsh", email: "tom@greenfield.co", role: "CompanyAdmin", joined: "Mar 2026", status: "Trial", lastActive: "Just now", avatar: "TW" },
  { id: 7, name: "Morgan Fox", email: "morgan@greenfield.co", role: "Employee", joined: "Mar 2026", status: "Active", lastActive: "30m ago", avatar: "MF" },
];

const textStyles = {
  heading: { color: 'var(--sa-text-primary)' },
  subheading: { color: 'var(--sa-text-primary)' },
  label: { color: 'var(--sa-text-primary)', fontSize: '0.75rem' },
  description: { color: 'var(--sa-text-secondary)', fontSize: '0.75rem' },
  value: { color: 'var(--sa-text-primary)' }
};

export function AdminManagementPage() {
  const [search, setSearch] = useState("");
  
  const filteredUsers = ALL_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: ALL_USERS.length,
    admins: ALL_USERS.filter(u => u.role === "CompanyAdmin").length,
    employees: ALL_USERS.filter(u => u.role === "Employee").length,
    active: ALL_USERS.filter(u => u.status === "Active").length,
    suspended: ALL_USERS.filter(u => u.status === "Suspended").length,
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Global Identity Index</h1>
          <p className="text-slate-500 mt-1">Unified directory for all users and administrative roles cross-platform</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <Users className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>Total active nodes: {stats.active}</span>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--sa-success)" }} />
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden text-white"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <Users size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <Users size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Human Capital Registry</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Personnel Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">{stats.total} Digital Identities Authenticated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-text-primary)" }}>{stats.total}</div>
          <div className="text-xs mt-1" style={textStyles.description}>Total Users</div>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-primary)" }}>{stats.admins}</div>
          <div className="text-xs mt-1" style={textStyles.description}>Admins</div>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-success)" }}>{stats.employees}</div>
          <div className="text-xs mt-1" style={textStyles.description}>Employees</div>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-success)" }}>{stats.active}</div>
          <div className="text-xs mt-1" style={textStyles.description}>Active</div>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-error)" }}>{stats.suspended}</div>
          <div className="text-xs mt-1" style={textStyles.description}>Suspended</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border text-sm transition focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--sa-card)",
            borderColor: "var(--sa-border)",
            color: "var(--sa-text-primary)"
          }}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sa-border)" }}>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>User</th>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>Email</th>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>Role</th>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>Joined</th>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>Status</th>
                <th className="p-4 text-left text-xs font-medium" style={textStyles.description}>Last Active</th>
                <th className="p-4 text-right text-xs font-medium" style={textStyles.description}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b hover:bg-[var(--sa-hover)] transition"
                  style={{ borderColor: "var(--sa-border)" }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center font-medium text-sm"
                        style={{ 
                          backgroundColor: `color-mix(in srgb, var(--sa-primary), transparent 90%)`,
                          color: "var(--sa-primary)"
                        }}>
                        {user.avatar}
                      </div>
                      <span className="font-medium" style={textStyles.value}>{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <span style={textStyles.description}>{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: user.role === "CompanyAdmin" ? "rgba(44, 110, 213, 0.1)" : "rgba(40, 167, 69, 0.1)",
                        color: user.role === "CompanyAdmin" ? "var(--sa-primary)" : "var(--sa-success)"
                      }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <span style={textStyles.description}>{user.joined}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span style={{ color: user.status === "Active" ? "var(--sa-success)" : "var(--sa-error)" }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <span style={textStyles.description}>{user.lastActive}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition">
                      <Trash2 className="h-4 w-4" style={{ color: "var(--sa-error)" }} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminManagementPage;
