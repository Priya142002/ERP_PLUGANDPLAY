import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Search, Download, 
  Info, AlertTriangle, AlertOctagon,
  User, Building, ChevronRight
} from "lucide-react";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const LOGS = [
  { id: "LOG-001", action: "Company Created", actor: "Super Admin", target: "PineCrest Safety", severity: "info", time: "2026-03-09 10:32:11", details: "New company registered on platform" },
  { id: "LOG-002", action: "User Suspended", actor: "Super Admin", target: "alex@harbor.co", severity: "warn", time: "2026-03-09 09:14:55", details: "User account suspended due to policy violation" },
  { id: "LOG-003", action: "Plan Upgraded", actor: "david@buildsafe.co", target: "BuildSafe Corp → Enterprise", severity: "info", time: "2026-03-08 16:45:02", details: "Subscription upgraded from Basic to Enterprise" },
  { id: "LOG-004", action: "Company Deleted", actor: "Super Admin", target: "OldCo Inc", severity: "danger", time: "2026-03-08 15:22:41", details: "Company permanently removed from platform" },
  { id: "LOG-005", action: "Admin Password Reset", actor: "Super Admin", target: "sarah@steelworks.co", severity: "warn", time: "2026-03-08 11:08:33", details: "Password reset requested and completed" },
  { id: "LOG-006", action: "Safety Plan Published", actor: "avery@aeroc.co", target: "Roof Access Plan v2.1", severity: "info", time: "2026-03-08 09:55:17", details: "New safety plan version published" },
  { id: "LOG-007", action: "API Key Regenerated", actor: "Super Admin", target: "Global API Config", severity: "warn", time: "2026-03-07 14:30:00", details: "Platform API key was regenerated" },
  { id: "LOG-008", action: "Storage Limit Breach", actor: "System", target: "Harbor Logistics", severity: "danger", time: "2026-03-07 11:12:44", details: "Company exceeded storage limit (19/20GB)" },
  { id: "LOG-009", action: "Employee Invited", actor: "tom@greenfield.co", target: "morgan@greenfield.co", severity: "info", time: "2026-03-07 08:40:21", details: "New employee invitation sent" },
  { id: "LOG-010", action: "Subscription Cancelled", actor: "ben@harbor.co", target: "Harbor Logistics", severity: "danger", time: "2026-03-06 17:55:08", details: "Subscription cancelled by company admin" },
];

const SEVERITY_STYLES = {
  info: {
    color: "var(--sa-info)",
    bg: "rgba(44, 110, 213, 0.1)",
    border: "rgba(44, 110, 213, 0.2)",
    icon: Info,
    label: "Info"
  },
  warn: {
    color: "var(--sa-warning)",
    bg: "rgba(255, 159, 67, 0.1)",
    border: "rgba(255, 159, 67, 0.2)",
    icon: AlertTriangle,
    label: "Warning"
  },
  danger: {
    color: "var(--sa-error)",
    bg: "rgba(220, 53, 69, 0.1)",
    border: "rgba(220, 53, 69, 0.2)",
    icon: AlertOctagon,
    label: "Danger"
  },
};

export function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");

  const filteredLogs = LOGS.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
                         log.actor.toLowerCase().includes(search.toLowerCase()) ||
                         log.target.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severity === "All" || log.severity === severity.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const stats: Record<string, number> = {
    total: LOGS.length,
    info: LOGS.filter(l => l.severity === "info").length,
    warn: LOGS.filter(l => l.severity === "warn").length,
    danger: LOGS.filter(l => l.severity === "danger").length,
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Audit Trail</h1>
          <p className="text-slate-500 mt-1">Immutable record of all system events and administrative maneuvers</p>
        </div>
        <button
          className="flex items-center gap-2 px-6 h-10 rounded-xl text-xs font-bold border transition-all hover:bg-[var(--sa-hover)] shadow-sm"
          style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}
        >
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden text-white"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <ClipboardList size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Compliance Engine</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Security Ledger</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">{stats.total} Cryptographically Logged Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--sa-text-primary)" }}>{stats.total}</div>
          <div className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>Total Events</div>
        </div>
        {(Object.entries(SEVERITY_STYLES) as [keyof typeof SEVERITY_STYLES, typeof SEVERITY_STYLES.info][]).map(([key, style]) => {
          const Icon = style.icon;
          return (
            <div 
              key={key} 
              className="p-4 rounded-[12px] border" 
              style={{ backgroundColor: style.bg, borderColor: style.border }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: style.color }} />
                <span className="text-sm font-medium" style={{ color: style.color }}>{style.label}</span>
              </div>
              <div className="text-xl font-bold mt-2" style={{ color: style.color }}>{stats[key]}</div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          <input
            type="text"
            placeholder="Search logs..."
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

        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Info", "Warn", "Danger"].map((f) => (
            <button
              key={f}
              onClick={() => setSeverity(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{
                backgroundColor: severity === f ? "var(--sa-primary)" : "var(--sa-hover)",
                color: severity === f ? "white" : "var(--sa-text-secondary)"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>System Activity Timeline</h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredLogs.map((log, index) => {
              const severityStyle = SEVERITY_STYLES[log.severity as keyof typeof SEVERITY_STYLES];
              const Icon = severityStyle.icon;
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative pl-8 pb-6 last:pb-0"
                >
                  {index < filteredLogs.length - 1 && (
                    <div className="absolute left-3 top-6 bottom-0 w-px" style={{ backgroundColor: "var(--sa-border)" }} />
                  )}
                  
                  <div 
                    className="absolute left-0 top-1.5 h-6 w-6 rounded-full flex items-center justify-center border-2"
                    style={{ 
                      backgroundColor: severityStyle.bg,
                      borderColor: severityStyle.color
                    }}
                  >
                    <Icon className="h-3 w-3" style={{ color: severityStyle.color }} />
                  </div>

                  <div className="p-4 rounded-xl border" style={{ borderColor: "var(--sa-border)" }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>{log.action}</span>
                        <span 
                          className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: severityStyle.bg, color: severityStyle.color }}
                        >
                          {log.severity}
                        </span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: "var(--sa-text-secondary)" }}>{log.time}</span>
                    </div>

                    <p className="text-sm mb-2" style={{ color: "var(--sa-text-secondary)" }}>{log.details}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                        <span style={{ color: "var(--sa-text-secondary)" }}>{log.actor}</span>
                      </div>
                      <ChevronRight className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" style={{ color: "var(--sa-text-secondary)" }} />
                        <span style={{ color: "var(--sa-text-secondary)" }}>{log.target}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default AuditLogsPage;
