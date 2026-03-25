import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { superAdminApi } from "../../services/api";
import { 
  Database, Settings, Mail, Bell, Shield, Server, HardDrive, Cpu, Activity, 
  Clock, CheckCircle, AlertTriangle, Download, Upload, RefreshCw, Code,
  Key, Globe, Zap, FileText, Palette, Moon, Sun, ArrowUpRight,
  Monitor, Smartphone, Save, RotateCcw, Eye, EyeOff, Copy, Check
} from "lucide-react";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const SYSTEM_TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "backup", label: "Backup & Recovery", icon: Database },
  { id: "email", label: "Email Configuration", icon: Mail },
  { id: "api", label: "API & Integrations", icon: Code },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette }
];

const SYSTEM_HEALTH = [
  { label: "Database", status: "healthy", value: "99.9%", icon: Database, color: "var(--sa-success)" },
  { label: "API Server", status: "healthy", value: "99.8%", icon: Server, color: "var(--sa-success)" },
  { label: "Storage", status: "warning", value: "85% used", icon: HardDrive, color: "var(--sa-warning)" },
  { label: "CPU Usage", status: "healthy", value: "45%", icon: Cpu, color: "var(--sa-success)" }
];

const RECENT_BACKUPS = [
  { id: 1, name: "Auto Backup", date: "Today 02:00 AM", size: "2.4 GB", status: "completed" },
  { id: 2, name: "Auto Backup", date: "Yesterday 02:00 AM", size: "2.3 GB", status: "completed" },
  { id: 3, name: "Manual Backup", date: "Mar 16, 10:30 AM", size: "2.3 GB", status: "completed" }
];

export function SystemPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Vivify ERP",
    platformUrl: "https://erp.vivify.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    maintenanceMode: false,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelist: "",
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@vivify.com",
    smtpPassword: "••••••••",
    emailFrom: "Vivify ERP <noreply@vivify.com>",
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionDays: 30,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Appearance
    theme: "light",
    primaryColor: "#3b82f6",
    headerColor: "#ffffff",
    sidebarColor: "#002147"
  });

  // Load saved theme on mount
  useState(() => {
    const savedTheme = localStorage.getItem("sa-custom-theme");
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setSettings(prev => ({
          ...prev,
          headerColor: theme.header || "#ffffff",
          sidebarColor: theme.sidebar || "#002147",
          primaryColor: theme.primary || "#3b82f6"
        }));
        
        // Apply saved theme
        const root = document.documentElement;
        root.style.setProperty("--sa-header", theme.header);
        root.style.setProperty("--sa-sidebar", theme.sidebar);
        root.style.setProperty("--sa-primary", theme.primary);
      } catch (e) {
        console.error("Failed to load saved theme", e);
      }
    }
  });

  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [hRes, sRes] = await Promise.all([
      superAdminApi.getSystemHealth(),
      superAdminApi.getSystemSettings()
    ]);
    if (hRes.success) setHealth(hRes.data);
    if (sRes.success && Array.isArray(sRes.data)) {
      const dbSettings: any = { ...settings };
      sRes.data.forEach((s: any) => {
        dbSettings[s.key] = s.value === 'true' ? true : s.value === 'false' ? false : s.value;
      });
      setSettings(dbSettings);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("YOUR_API_KEY_HERE");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveSettings = async () => {
    const payload: Record<string, string> = {};
    Object.entries(settings).forEach(([k, v]) => {
      payload[k] = v.toString();
    });
    const res = await superAdminApi.updateSystemSettings(payload);
    if (res.success) alert("Settings saved successfully!");
  };

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>
            System Settings
          </h1>
          <p className="text-slate-500 mt-1">Configure and monitor platform system settings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <Activity className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
            All Systems Operational
          </span>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--sa-success)" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b scrollbar-hide" style={{ borderColor: "var(--sa-border)" }}>
        {SYSTEM_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id ? "shadow-sm" : "hover:bg-[var(--sa-hover)]"
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? "var(--sa-card)" : "transparent",
                color: activeTab === tab.id ? "var(--sa-primary)" : "var(--sa-text-secondary)",
                borderWidth: activeTab === tab.id ? "2px" : "0",
                borderColor: activeTab === tab.id ? "var(--sa-primary)" : "transparent",
                fontWeight: activeTab === tab.id ? "600" : "500"
              }}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* System Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Database", status: health?.database?.toLowerCase() || "healthy", value: health?.databaseUptime || "99.9%", icon: Database, color: "var(--sa-success)" },
              { label: "API Server", status: health?.apiServer?.toLowerCase() || "healthy", value: health?.apiUptime || "99.8%", icon: Server, color: "var(--sa-success)" },
              { label: "Storage", status: "warning", value: health?.storageUsage || "85% used", icon: HardDrive, color: "var(--sa-warning)" },
              { label: "CPU Usage", status: "healthy", value: health?.cpuUsage || "45%", icon: Cpu, color: "var(--sa-success)" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl border hover:shadow-lg transition-all"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, ${item.color}, transparent 90%)` }}>
                      <Icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>{item.label}</p>
                      <p className="text-lg font-bold mt-0.5" style={{ color: "var(--sa-text-primary)" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                    item.status === "healthy" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.status === "healthy" ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    {item.status}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Information */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center gap-2 mb-5">
                <Server className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                  System Information
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Platform Version", value: health?.version || "v2.5.0", icon: Code },
                  { label: "Database Version", value: "PostgreSQL 15.2", icon: Database },
                  { label: "Node Version", value: "v20.11.0", icon: Server },
                  { label: "Last Updated", value: "Mar 25, 2026", icon: Clock },
                  { label: "Environment", value: health?.environment || "Production", icon: Globe },
                  { label: "Uptime", value: health?.apiUptime || "45 days", icon: Activity }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0" 
                      style={{ borderColor: "var(--sa-border)" }}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--sa-text-secondary)" }}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Clear Cache", icon: RefreshCw, color: "var(--sa-info)" },
                  { label: "Optimize Database", icon: Database, color: "var(--sa-success)" },
                  { label: "Export Logs", icon: Download, color: "var(--sa-warning)" },
                  { label: "System Diagnostics", icon: Activity, color: "var(--sa-primary)" },
                  { label: "Generate Report", icon: FileText, color: "var(--sa-info)" },
                  { label: "Restart Services", icon: RotateCcw, color: "var(--sa-error)" }
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-all hover:scale-[1.02]"
                      style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}
                    >
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `color-mix(in srgb, ${action.color}, transparent 90%)` }}>
                        <Icon className="h-4 w-4" style={{ color: action.color }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "var(--sa-text-primary)" }}>
              Platform Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Platform URL
                </label>
                <input
                  type="text"
                  value={settings.platformUrl}
                  onChange={(e) => setSettings({...settings, platformUrl: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                >
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg" 
              style={{ backgroundColor: "var(--sa-hover)" }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" style={{ color: "var(--sa-warning)" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                    Maintenance Mode
                  </p>
                  <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                    Temporarily disable access for maintenance
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => loadData()} className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                <RotateCcw className="h-4 w-4 inline mr-2" />
                Reset
              </button>
              <button onClick={() => saveSettings()} className="px-5 py-2.5 rounded-lg text-sm font-bold !text-white hover:!text-white transition-all hover:brightness-110 active:scale-95 shadow-md flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--sa-primary)" }}>
                <Save className="h-4 w-4" color="#FFFFFF" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                Security Settings
              </h3>
            </div>
            <div className="space-y-5">
              {[
                { 
                  label: "Two-Factor Authentication", 
                  description: "Require 2FA for all admin accounts",
                  checked: settings.twoFactorAuth,
                  onChange: (val: boolean) => setSettings({...settings, twoFactorAuth: val})
                },
                { 
                  label: "Email Notifications", 
                  description: "Send email alerts for security events",
                  checked: settings.emailNotifications,
                  onChange: (val: boolean) => setSettings({...settings, emailNotifications: val})
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: "var(--sa-border)" }}>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                      {item.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-lg text-sm font-bold !text-white hover:!text-white transition-all hover:brightness-110 active:scale-95 shadow-md flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--sa-primary)" }}>
                <Save className="h-4 w-4" color="#FFFFFF" />
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Backup Tab */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Backups", value: "24", icon: Database, color: "var(--sa-primary)" },
              { label: "Last Backup", value: "Today 02:00 AM", icon: CheckCircle, color: "var(--sa-success)" },
              { label: "Next Scheduled", value: "Tomorrow 02:00 AM", icon: Clock, color: "var(--sa-info)" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-5 rounded-xl border" 
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, ${stat.color}, transparent 90%)` }}>
                      <Icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--sa-text-secondary)" }}>{stat.label}</p>
                      <p className="text-lg font-bold mt-0.5" style={{ color: "var(--sa-text-primary)" }}>{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "var(--sa-text-primary)" }}>
              Backup Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border"
                style={{ borderColor: "var(--sa-border)" }}>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>
                    Automatic Backups
                  </p>
                  <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                    Enable scheduled automatic backups
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Backup Time
                  </label>
                  <input
                    type="time"
                    value={settings.backupTime}
                    onChange={(e) => setSettings({...settings, backupTime: e.target.value})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                    Retention (days)
                  </label>
                  <input
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => setSettings({...settings, retentionDays: parseInt(e.target.value)})}
                    className="w-full h-11 px-4 rounded-lg border text-sm"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>Recent Backups</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                  style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                  <Upload className="h-4 w-4 inline mr-2" />
                  Restore
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold !text-white hover:!text-white transition-all hover:brightness-110 active:scale-95 shadow-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--sa-primary)" }}>
                  <Database className="h-4 w-4" color="#FFFFFF" />
                  Create Backup
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {RECENT_BACKUPS.map((backup, index) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition"
                  style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "color-mix(in srgb, var(--sa-success), transparent 90%)" }}>
                      <CheckCircle className="h-5 w-5" style={{ color: "var(--sa-success)" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        {backup.name}
                      </h4>
                      <p className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>
                        {backup.date} • {backup.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg border hover:bg-[var(--sa-hover)] transition"
                      style={{ borderColor: "var(--sa-border)" }}>
                      <Download className="h-4 w-4" style={{ color: "var(--sa-text-primary)" }} />
                    </button>
                    <button className="p-2 rounded-lg border hover:bg-[var(--sa-hover)] transition"
                      style={{ borderColor: "var(--sa-border)" }}>
                      <Upload className="h-4 w-4" style={{ color: "var(--sa-text-primary)" }} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Email Configuration Tab */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Mail className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                SMTP Configuration
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="noreply@vivify.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="••••••••"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--sa-text-primary)" }}>
                  From Email Address
                </label>
                <input
                  type="text"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  placeholder="Vivify ERP <noreply@vivify.com>"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                Test Connection
              </button>
              <button className="px-5 py-2.5 rounded-lg text-sm font-bold !text-white hover:!text-white transition-all hover:brightness-110 active:scale-95 shadow-md flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--sa-primary)" }}>
                <Save className="h-4 w-4" color="#FFFFFF" />
                Save Email Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API & Integrations Tab */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Code className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                API Keys
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                      Production API Key
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>
                      Use this key for production integrations
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value="YOUR_API_KEY_HERE"
                    readOnly
                    className="flex-1 h-10 px-4 rounded-lg border text-sm font-mono"
                    style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2.5 rounded-lg border hover:bg-[var(--sa-hover)] transition"
                    style={{ borderColor: "var(--sa-border)" }}>
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" style={{ color: "var(--sa-text-primary)" }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: "var(--sa-text-primary)" }} />
                    )}
                  </button>
                  <button
                    onClick={handleCopyApiKey}
                    className="p-2.5 rounded-lg border hover:bg-[var(--sa-hover)] transition"
                    style={{ borderColor: "var(--sa-border)" }}>
                    {copied ? (
                      <Check className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
                    ) : (
                      <Copy className="h-4 w-4" style={{ color: "var(--sa-text-primary)" }} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                  style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                  <Key className="h-4 w-4 inline mr-2" />
                  Generate New Key
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "var(--sa-text-primary)" }}>
              API Documentation
            </h3>
            <div className="space-y-3">
              {[
                { label: "REST API Documentation", url: "/api/docs", icon: FileText },
                { label: "Webhook Configuration", url: "/api/webhooks", icon: Globe },
                { label: "Rate Limits", url: "/api/limits", icon: Activity }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.url}
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition"
                    style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                Notification Preferences
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { 
                  label: "Email Notifications", 
                  description: "Receive notifications via email",
                  icon: Mail,
                  checked: settings.emailNotifications,
                  onChange: (val: boolean) => setSettings({...settings, emailNotifications: val})
                },
                { 
                  label: "Push Notifications", 
                  description: "Receive browser push notifications",
                  icon: Monitor,
                  checked: settings.pushNotifications,
                  onChange: (val: boolean) => setSettings({...settings, pushNotifications: val})
                },
                { 
                  label: "SMS Notifications", 
                  description: "Receive notifications via SMS",
                  icon: Smartphone,
                  checked: settings.smsNotifications,
                  onChange: (val: boolean) => setSettings({...settings, smsNotifications: val})
                }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ borderColor: "var(--sa-border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "color-mix(in srgb, var(--sa-primary), transparent 90%)" }}>
                        <Icon className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>
                          {item.label}
                        </p>
                        <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--sa-primary)" }}>
                <Save className="h-4 w-4 inline mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Palette className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
              <h3 className="text-lg font-bold" style={{ color: "var(--sa-text-primary)" }}>
                Theme Settings
              </h3>
            </div>
            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--sa-text-primary)" }}>
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "auto", label: "Auto", icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => setSettings({...settings, theme: theme.value})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === theme.value ? "shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: settings.theme === theme.value ? "var(--sa-primary)" : "var(--sa-border)",
                          backgroundColor: settings.theme === theme.value ? "color-mix(in srgb, var(--sa-primary), transparent 95%)" : "var(--sa-card)"
                        }}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: "var(--sa-text-primary)" }} />
                        <p className="text-sm font-semibold text-center" style={{ color: "var(--sa-text-primary)" }}>
                          {theme.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Color Customization */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--sa-text-primary)" }}>
                  Custom Colors
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Header Color */}
                  <div className="p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "color-mix(in srgb, var(--sa-primary), transparent 90%)" }}>
                        <Monitor className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        Header Color
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.headerColor || "#ffffff"}
                        onChange={(e) => setSettings({...settings, headerColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border cursor-pointer"
                        style={{ borderColor: "var(--sa-border)" }}
                      />
                      <input
                        type="text"
                        value={settings.headerColor || "#ffffff"}
                        onChange={(e) => setSettings({...settings, headerColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border text-xs font-mono"
                        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Color */}
                  <div className="p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "color-mix(in srgb, var(--sa-info), transparent 90%)" }}>
                        <Activity className="h-4 w-4" style={{ color: "var(--sa-info)" }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        Sidebar Color
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.sidebarColor || "#002147"}
                        onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border cursor-pointer"
                        style={{ borderColor: "var(--sa-border)" }}
                      />
                      <input
                        type="text"
                        value={settings.sidebarColor || "#002147"}
                        onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border text-xs font-mono"
                        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Content/Primary Color */}
                  <div className="p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "color-mix(in srgb, var(--sa-success), transparent 90%)" }}>
                        <Palette className="h-4 w-4" style={{ color: "var(--sa-success)" }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        Primary Color
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border cursor-pointer"
                        style={{ borderColor: "var(--sa-border)" }}
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border text-xs font-mono"
                        style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Color Combinations */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--sa-text-primary)" }}>
                  Preset Color Combinations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { 
                      name: "Ocean Blue", 
                      header: "#ffffff", 
                      sidebar: "#002147", 
                      primary: "#3b82f6",
                      preview: ["#ffffff", "#002147", "#3b82f6"]
                    },
                    { 
                      name: "Forest Green", 
                      header: "#f0fdf4", 
                      sidebar: "#064e3b", 
                      primary: "#10b981",
                      preview: ["#f0fdf4", "#064e3b", "#10b981"]
                    },
                    { 
                      name: "Royal Purple", 
                      header: "#faf5ff", 
                      sidebar: "#581c87", 
                      primary: "#a855f7",
                      preview: ["#faf5ff", "#581c87", "#a855f7"]
                    },
                    { 
                      name: "Sunset Orange", 
                      header: "#fff7ed", 
                      sidebar: "#9a3412", 
                      primary: "#f97316",
                      preview: ["#fff7ed", "#9a3412", "#f97316"]
                    },
                    { 
                      name: "Midnight Dark", 
                      header: "#1e293b", 
                      sidebar: "#0f172a", 
                      primary: "#38bdf8",
                      preview: ["#1e293b", "#0f172a", "#38bdf8"]
                    },
                    { 
                      name: "Rose Pink", 
                      header: "#fff1f2", 
                      sidebar: "#881337", 
                      primary: "#f43f5e",
                      preview: ["#fff1f2", "#881337", "#f43f5e"]
                    },
                    { 
                      name: "Teal Fresh", 
                      header: "#f0fdfa", 
                      sidebar: "#115e59", 
                      primary: "#14b8a6",
                      preview: ["#f0fdfa", "#115e59", "#14b8a6"]
                    },
                    { 
                      name: "Amber Warm", 
                      header: "#fffbeb", 
                      sidebar: "#78350f", 
                      primary: "#f59e0b",
                      preview: ["#fffbeb", "#78350f", "#f59e0b"]
                    }
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setSettings({
                        ...settings, 
                        headerColor: preset.header,
                        sidebarColor: preset.sidebar,
                        primaryColor: preset.primary
                      })}
                      className="p-3 rounded-lg border-2 hover:shadow-lg transition-all text-left"
                      style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}
                    >
                      <div className="flex gap-1.5 mb-2">
                        {preset.preview.map((color, j) => (
                          <div
                            key={j}
                            className="h-8 flex-1 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "var(--sa-text-primary)" }}>
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border" style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--sa-text-secondary)" }}>
                  Preview
                </p>
                <div className="flex gap-3 h-32 rounded-lg overflow-hidden border" style={{ borderColor: "var(--sa-border)" }}>
                  {/* Sidebar Preview */}
                  <div className="w-16 flex items-center justify-center" 
                    style={{ backgroundColor: settings.sidebarColor || "#002147" }}>
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  {/* Content Preview */}
                  <div className="flex-1 flex flex-col">
                    {/* Header Preview */}
                    <div className="h-12 flex items-center px-4 border-b" 
                      style={{ backgroundColor: settings.headerColor || "#ffffff", borderColor: "var(--sa-border)" }}>
                      <div className="h-2 w-24 rounded" style={{ backgroundColor: settings.primaryColor }} />
                    </div>
                    {/* Content Preview */}
                    <div className="flex-1 p-4 space-y-2" style={{ backgroundColor: "var(--sa-background)" }}>
                      <div className="h-2 w-full rounded" style={{ backgroundColor: settings.primaryColor, opacity: 0.3 }} />
                      <div className="h-2 w-3/4 rounded" style={{ backgroundColor: settings.primaryColor, opacity: 0.2 }} />
                      <div className="h-2 w-1/2 rounded" style={{ backgroundColor: settings.primaryColor, opacity: 0.1 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setSettings({
                  ...settings,
                  headerColor: "#ffffff",
                  sidebarColor: "#002147",
                  primaryColor: "#3b82f6"
                })}
                className="px-5 py-2.5 rounded-lg border text-sm font-semibold transition hover:bg-[var(--sa-hover)]"
                style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                Reset to Default
              </button>
              <button 
                onClick={() => {
                  // Apply theme by updating CSS variables
                  const root = document.documentElement;
                  root.style.setProperty("--sa-header", settings.headerColor || "#ffffff");
                  root.style.setProperty("--sa-sidebar", settings.sidebarColor || "#002147");
                  root.style.setProperty("--sa-primary", settings.primaryColor);
                  
                  // Save to localStorage
                  localStorage.setItem("sa-custom-theme", JSON.stringify({
                    header: settings.headerColor,
                    sidebar: settings.sidebarColor,
                    primary: settings.primaryColor
                  }));
                  
                  alert("Theme applied successfully!");
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 shadow-lg"
                style={{ backgroundColor: settings.primaryColor }}>
                <Palette className="h-4 w-4 inline mr-2" />
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SystemPage;
