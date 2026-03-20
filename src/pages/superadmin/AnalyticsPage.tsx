import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from "recharts";
import { Users, HardDrive, PieChart as PieIcon, Activity, FileText, Image } from "lucide-react";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const USER_GROWTH = [
  { month: "Oct", users: 2100, companies: 98 },
  { month: "Nov", users: 2650, companies: 109 },
  { month: "Dec", users: 2900, companies: 115 },
  { month: "Jan", users: 3200, companies: 124 },
  { month: "Feb", users: 3550, companies: 133 },
  { month: "Mar", users: 3841, companies: 142 },
];

const STORAGE_DATA = [
  { month: "Oct", used: 4.2 },
  { month: "Nov", used: 5.8 },
  { month: "Dec", used: 6.5 },
  { month: "Jan", used: 7.1 },
  { month: "Feb", used: 7.9 },
  { month: "Mar", used: 8.7 },
];

const PLAN_DIST = [
  { name: "Enterprise", value: 28, color: "var(--sa-primary)" },
  { name: "Basic", value: 74, color: "var(--sa-info)" },
  { name: "Trial", value: 40, color: "var(--sa-warning)" },
];

const METRICS = [
  { label: "Avg Users per Company", value: "27", change: "+12%", color: "var(--sa-primary)" },
  { label: "Avg Storage per Company", value: "61GB", change: "+8%", color: "var(--sa-info)" },
  { label: "Trial Conversion Rate", value: "83%", change: "+5%", color: "var(--sa-success)" },
  { label: "Monthly Active Rate", value: "74%", change: "+3%", color: "var(--sa-warning)" },
];

export function AnalyticsPage() {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const userChartRef = useRef<HTMLDivElement>(null);
  const storageChartRef = useRef<HTMLDivElement>(null);

  const exportCompanyReport = () => {
    if (selectedCompany === "all") {
      alert("Please select a specific company to export report");
      return;
    }
  };

  const exportChartAsPNG = (_chartRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    console.log("Exporting chart as PNG:", filename);
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Intelligence Hub</h1>
          <p className="text-slate-500 mt-1">Advanced reporting and cross-platform growth diagnostics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <Activity className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>Platform Health: Optimal</span>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--sa-success)" }} />
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden text-white"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <PieIcon size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <PieIcon size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Analytical Framework</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Data Core</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">{USER_GROWTH[USER_GROWTH.length-1].users} Total Active User Identities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border" 
        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="flex items-center gap-2">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="h-9 px-3 rounded-lg border text-sm"
            style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
          >
            <option value="all">All Companies</option>
            <option value="BuildSafe Corp">BuildSafe Corp</option>
            <option value="SteelWorks Ltd">SteelWorks Ltd</option>
            <option value="AeroCraft Inc">AeroCraft Inc</option>
          </select>
          <button
            onClick={exportCompanyReport}
            disabled={selectedCompany === "all"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 transition hover:bg-[var(--sa-hover)]"
            style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
          >
            <FileText className="h-4 w-4" />
            Export Report
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportChartAsPNG(userChartRef, 'user-growth')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition hover:bg-[var(--sa-hover)]"
            style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
          >
            <Image className="h-3.5 w-3.5" />
            Save Users Chart
          </button>
          <button
            onClick={() => exportChartAsPNG(storageChartRef, 'storage-usage')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition hover:bg-[var(--sa-hover)]"
            style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
          >
            <Image className="h-3.5 w-3.5" />
            Save Storage Chart
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>{metric.label}</span>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--sa-hover)", color: "var(--sa-success)" }}>
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>User Growth</h3>
            <span className="ml-auto text-xs" style={{ color: "var(--sa-text-secondary)" }}>Monthly active users</span>
          </div>
          <div ref={userChartRef}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={USER_GROWTH}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--sa-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--sa-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--sa-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--sa-text-secondary)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--sa-text-secondary)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--sa-card)",
                    borderColor: "var(--sa-border)",
                    borderRadius: 8,
                    color: "var(--sa-text-primary)"
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="var(--sa-primary)" strokeWidth={2} fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="h-4 w-4" style={{ color: "var(--sa-info)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Storage Consumption</h3>
            <span className="ml-auto text-xs" style={{ color: "var(--sa-text-secondary)" }}>Platform-wide (TB)</span>
          </div>
          <div ref={storageChartRef}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={STORAGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--sa-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--sa-text-secondary)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--sa-text-secondary)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--sa-card)",
                    borderColor: "var(--sa-border)",
                    borderRadius: 8,
                    color: "var(--sa-text-primary)"
                  }}
                />
                <Bar dataKey="used" fill="var(--sa-info)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Plan Distribution</h3>
            <span className="ml-auto text-xs" style={{ color: "var(--sa-text-secondary)" }}>Companies by plan</span>
          </div>
          <div className="flex items-center justify-center h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLAN_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PLAN_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--sa-card)",
                    borderColor: "var(--sa-border)",
                    borderRadius: 8,
                    color: "var(--sa-text-primary)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {PLAN_DIST.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{item.name}</span>
                <span className="text-xs font-bold" style={{ color: "var(--sa-text-primary)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4" style={{ color: "var(--sa-warning)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>Performance Metrics</h3>
          </div>
          <div className="space-y-4">
            {METRICS.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{metric.label}</span>
                  <span className="text-xs font-bold" style={{ color: metric.color }}>{metric.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--sa-hover)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                    initial={{ width: 0 }}
                    animate={{ width: metric.value.toString().replace('%', '') + '%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsPage;
