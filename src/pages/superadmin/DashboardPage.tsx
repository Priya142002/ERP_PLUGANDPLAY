import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, CreditCard, ArrowUpRight, Server, Activity,
  Globe, Award, DollarSign, TrendingUp, Package, CheckCircle2,
  AlertCircle, Clock, Zap, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { superAdminApi } from "../../services/api";
import "../../styles/superadmin-mobile.css";

const pageMotion = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const CHART_COLORS = { primary: "var(--sa-primary)", info: "var(--sa-info)", success: "var(--sa-success)", warning: "var(--sa-warning)", error: "var(--sa-error)" };

const GROWTH_DATA = [
  { month: "Oct", users: 2100, companies: 98, revenue: 18200 },
  { month: "Nov", users: 2650, companies: 109, revenue: 21400 },
  { month: "Dec", users: 2900, companies: 115, revenue: 23800 },
  { month: "Jan", users: 3200, companies: 124, revenue: 26100 },
  { month: "Feb", users: 3550, companies: 133, revenue: 27900 },
  { month: "Mar", users: 3841, companies: 142, revenue: 28400 },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      superAdminApi.getCompanies(1, 100),
      superAdminApi.getAnalytics(),
    ]).then(([companiesRes, analyticsRes]) => {
      if (companiesRes.success) {
        const items = companiesRes.data?.items ?? companiesRes.data ?? [];
        setCompanies(Array.isArray(items) ? items : []);
      }
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const inactiveCompanies = totalCompanies - activeCompanies;
  const recentCompanies = [...companies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const companyStatusData = [
    { name: 'Active', value: activeCompanies, color: CHART_COLORS.success },
    { name: 'Inactive', value: inactiveCompanies, color: CHART_COLORS.error },
  ];

  const STATS = [
    { label: "Total Companies", value: loading ? "..." : totalCompanies.toString(), delta: `${activeCompanies} active`, icon: Building2, color: CHART_COLORS.primary, trend: "+8%" },
    { label: "Total Users", value: loading ? "..." : (analytics?.totalUsers ?? "—").toString(), delta: "registered users", icon: Users, color: CHART_COLORS.info, trend: "+12%" },
    { label: "Active Subscriptions", value: loading ? "..." : (analytics?.activeSubscriptions ?? activeCompanies).toString(), delta: "paid plans", icon: CreditCard, color: CHART_COLORS.success, trend: "+5%" },
    { label: "Platform Revenue", value: loading ? "..." : `₹${(analytics?.monthlyRevenue ?? 0).toLocaleString('en-IN')}`, delta: "this month", icon: DollarSign, color: CHART_COLORS.warning, trend: "+12%" },
  ];

  const QUICK_ACTIONS = [
    { label: "Add Company", icon: Building2, path: "/superadmin/companies", color: CHART_COLORS.primary },
    { label: "Manage Modules", icon: Package, path: "/superadmin/modules", color: CHART_COLORS.info },
    { label: "View Analytics", icon: TrendingUp, path: "/superadmin/analytics", color: CHART_COLORS.success },
    { label: "System Settings", icon: Server, path: "/superadmin/system", color: CHART_COLORS.warning },
  ];

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 superadmin-header">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 px-3 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider"
              style={{ backgroundColor: "var(--sa-primary)", color: "white" }}>
              <Award className="h-3 w-3" /> Super Admin
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Platform Overview</h1>
          <p className="text-slate-500 mt-1">Monitor and manage your entire ERP ecosystem</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <Globe className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>System Status</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--sa-success), transparent 90%)' }}>
            <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--sa-success)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--sa-success)" }}>Online</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative py-6 px-8 rounded-2xl shadow-xl border overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--sa-primary) 0%, color-mix(in srgb, var(--sa-primary), #000 20%) 100%)`, borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10"><Activity className="w-full h-full" /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
              <Zap className="h-6 w-6 text-white" fill="white" />
            </div>
            <div>
              <p className="!text-white/90 font-bold text-xs uppercase tracking-wider">Enterprise Platform</p>
              <h2 className="!text-white font-bold text-2xl tracking-tight">Vivify ERP Management System</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-4">
            {[`${totalCompanies} Organizations`, "12 ERP Modules", "99.9% Uptime"].map(t => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 !text-white" />
                <span className="!text-white/90 font-semibold text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 superadmin-stats-grid">
        {[
          { label: "Total Companies", value: analytics?.totalCompanies?.toLocaleString() || "0", trend: "+12%", color: "#3B82F6", icon: Globe, delta: "+48 this month" },
          { label: "Active Subscriptions", value: analytics?.activeCompanies?.toLocaleString() || "0", trend: "+8%", color: "#10B981", icon: Activity, delta: "92% retention rate" },
          { label: "Monthly Revenue", value: `₹${((analytics?.monthlyRevenue || 0) / 100000).toFixed(1)}L`, trend: "+15%", color: "#8B5CF6", icon: TrendingUp, delta: "7 new enterprise" },
          { label: "System Health", value: "99.9%", trend: "Stable", color: "#F59E0B", icon: Shield, delta: "All systems online" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group">
              <div className="p-5 rounded-xl border hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `color-mix(in srgb, ${stat.color}, transparent 90%)` }}>
                    <Icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "color-mix(in srgb, var(--sa-success), transparent 90%)", color: "var(--sa-success)" }}>
                    <ArrowUpRight className="h-3 w-3" />{stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--sa-text-primary)" }}>{stat.value}</div>
                <div className="text-sm font-medium mb-1" style={{ color: "var(--sa-text-secondary)" }}>{stat.label}</div>
                <div className="text-xs font-medium" style={{ color: stat.color }}>{stat.delta}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button key={action.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }} onClick={() => navigate(action.path)}
              className="p-4 rounded-xl border hover:shadow-lg transition-all hover:-translate-y-1 group"
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `color-mix(in srgb, ${action.color}, transparent 90%)` }}>
                  <Icon className="h-5 w-5" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-semibold text-center" style={{ color: "var(--sa-text-primary)" }}>{action.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--sa-text-primary)" }}>Growth Analytics</h3>
          <p className="text-xs mb-4" style={{ color: "var(--sa-text-secondary)" }}>Last 6 months performance</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics?.monthlyGrowth || GROWTH_DATA}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sa-border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--sa-text-secondary)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--sa-text-secondary)", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", borderRadius: 12, color: "var(--sa-text-primary)" }} />
              <Area type="monotone" dataKey="users" stroke={CHART_COLORS.primary} strokeWidth={3} fill="url(#userGradient)" />
              <Area type="monotone" dataKey="companies" stroke={CHART_COLORS.info} strokeWidth={3} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--sa-text-primary)" }}>Company Status</h3>
          <p className="text-xs mb-4" style={{ color: "var(--sa-text-secondary)" }}>Active vs Inactive</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={companyStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {companyStatusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {companyStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm" style={{ color: "var(--sa-text-secondary)" }}>{item.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Companies & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-base font-bold" style={{ color: "var(--sa-text-primary)" }}>Recent Companies</h3>
            </div>
            <button onClick={() => navigate('/superadmin/companies')} className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition" style={{ color: "var(--sa-primary)" }}>View All</button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-sm" style={{ color: "var(--sa-text-secondary)" }}>Loading...</div>
            ) : recentCompanies.length > 0 ? recentCompanies.map((company, i) => (
              <motion.div key={company.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate('/superadmin/companies')}
                className="flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: `color-mix(in srgb, var(--sa-primary), transparent 90%)` }}>
                    {company.logo ? <img src={company.logo} alt={company.name} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>{company.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--sa-text-secondary)" }}>{company.industry} • {company.code || 'No code'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${company.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium capitalize" style={{ color: company.status === 'active' ? 'var(--sa-success)' : 'var(--sa-error)' }}>{company.status}</span>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto mb-2" style={{ color: "var(--sa-text-secondary)" }} />
                <p className="text-sm" style={{ color: "var(--sa-text-secondary)" }}>No companies yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
            <h3 className="text-base font-bold" style={{ color: "var(--sa-text-primary)" }}>System Health</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "API Response Time", value: "124ms", status: "excellent", percentage: 95 },
              { label: "Database Performance", value: "98%", status: "good", percentage: 98 },
              { label: "Server Uptime", value: "99.9%", status: "excellent", percentage: 99.9 },
              { label: "Storage Usage", value: "61%", status: "warning", percentage: 61 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: "var(--sa-text-secondary)" }}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: item.status === 'excellent' ? CHART_COLORS.success : item.status === 'good' ? CHART_COLORS.info : CHART_COLORS.warning }}>{item.value}</span>
                    {item.status === 'warning' ? <AlertCircle className="h-4 w-4" style={{ color: CHART_COLORS.warning }} /> : <CheckCircle2 className="h-4 w-4" style={{ color: CHART_COLORS.success }} />}
                  </div>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--sa-hover)" }}>
                  <motion.div className="h-full rounded-full"
                    style={{ backgroundColor: item.status === 'excellent' ? CHART_COLORS.success : item.status === 'good' ? CHART_COLORS.info : CHART_COLORS.warning }}
                    initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardPage;
