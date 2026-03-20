import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Settings, User, Users, Shield, Activity, Bell, Palette, 
  Building, Mail, Phone, MapPin, Globe, Calendar, Clock,
  Save, RotateCcw, Eye, EyeOff, Key, Lock, Monitor, Sun, Moon,
  Smartphone, FileText, Download, Upload, CheckCircle, AlertTriangle
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAdminTheme } from "../../app/admin-theme";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const SETTINGS_TABS = [
  { id: "company", label: "Company Profile", icon: Building },
  { id: "users", label: "User Management", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "audit", label: "Audit Logs", icon: Activity }
];

export function SettingsPage() {
  const { state } = useApp();
  const { mode, setMode } = useAdminTheme();
  const currentCompany = state.companies && state.companies.length > 0 ? state.companies[0] : null;
  const [activeTab, setActiveTab] = useState("company");
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    // Company Profile
    companyName: currentCompany?.name || "",
    companyEmail: currentCompany?.email || "",
    companyPhone: currentCompany?.phone || "",
    companyWebsite: "",
    companyAddress: currentCompany?.address?.street || "",
    companyCity: currentCompany?.address?.city || "",
    companyState: currentCompany?.address?.state || "",
    companyCountry: currentCompany?.address?.country || "",
    companyZip: currentCompany?.address?.postalCode || "",
    
    // Preferences
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "English",
    currency: "USD",
    fiscalYearStart: "January",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyOnInvoice: true,
    notifyOnPayment: true,
    notifyOnLowStock: true,
    
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Appearance
    theme: mode,
    headerColor: "#ffffff",
    sidebarColor: "#002147",
    primaryColor: "#3b82f6"
  });

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-custom-theme");
    const savedMode = localStorage.getItem("admin-theme") as "light" | "dark" | "auto" | null;
    
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setSettings(prev => ({
          ...prev,
          headerColor: theme.header || "#ffffff",
          sidebarColor: theme.sidebar || "#002147",
          primaryColor: theme.primary || "#3b82f6",
          theme: savedMode || mode || "light"
        }));
        
        // Apply saved theme immediately
        const root = document.documentElement;
        root.style.setProperty("--admin-header", theme.header);
        root.style.setProperty("--admin-sidebar", theme.sidebar);
        root.style.setProperty("--admin-primary", theme.primary);
      } catch (e) {
        console.error("Failed to load saved theme", e);
      }
    } else if (savedMode) {
      // If only mode is saved, update settings
      setSettings(prev => ({
        ...prev,
        theme: savedMode
      }));
    }
    
    // Apply saved mode to theme provider
    if (savedMode && savedMode !== "auto") {
      setMode(savedMode);
    }
  }, []);

  // Update CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--admin-header", settings.headerColor || "#ffffff");
    root.style.setProperty("--admin-sidebar", settings.sidebarColor || "#002147");
    root.style.setProperty("--admin-primary", settings.primaryColor);
  }, [settings.headerColor, settings.sidebarColor, settings.primaryColor]);

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your account and preferences</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-slate-900">
            All Settings Saved
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-hide">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-white shadow-sm border-2 border-[#002147] text-[#002147]" 
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Company Profile Tab */}
      {activeTab === "company" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Building className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">Company Information</h3>
            </div>
            
            {/* Company Logo */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <label className="block text-sm font-semibold mb-3 text-slate-900">Company Logo</label>
              <div className="flex items-center gap-4">
                {currentCompany?.logo ? (
                  <img src={currentCompany.logo} alt="Company Logo" className="h-20 w-20 rounded-lg object-cover border-2 border-slate-200" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                    <Building className="h-10 w-10 text-slate-400" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload New
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-red-600 hover:bg-red-50 transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Email Address</label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="company@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Phone Number</label>
                <input
                  type="tel"
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Website</label>
                <input
                  type="url"
                  value={settings.companyWebsite}
                  onChange={(e) => setSettings({...settings, companyWebsite: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="https://www.example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-slate-900">Street Address</label>
                <input
                  type="text"
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">City</label>
                <input
                  type="text"
                  value={settings.companyCity}
                  onChange={(e) => setSettings({...settings, companyCity: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">State/Province</label>
                <input
                  type="text"
                  value={settings.companyState}
                  onChange={(e) => setSettings({...settings, companyState: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Country</label>
                <select
                  value={settings.companyCountry}
                  onChange={(e) => setSettings({...settings, companyCountry: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={settings.companyZip}
                  onChange={(e) => setSettings({...settings, companyZip: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                <RotateCcw className="h-4 w-4 inline mr-2" />
                Reset
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#002147]" />
                <h3 className="text-lg font-bold text-slate-900">User Management</h3>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                <User className="h-4 w-4 inline mr-2" />
                Add New User
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "John Doe", email: "john@acme.com", role: "Admin", status: "Active" },
                    { name: "Jane Smith", email: "jane@acme.com", role: "Manager", status: "Active" },
                    { name: "Bob Johnson", email: "bob@acme.com", role: "User", status: "Inactive" }
                  ].map((user, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-sm font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded hover:bg-slate-100 transition">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-slate-100 transition">
                            <Settings className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#002147]" />
                <h3 className="text-lg font-bold text-slate-900">Roles & Permissions</h3>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                Create New Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Admin", users: 5, color: "red", permissions: ["Full Access", "User Management", "Settings"] },
                { name: "Manager", users: 12, color: "blue", permissions: ["View Reports", "Manage Inventory", "Approve Orders"] },
                { name: "User", users: 45, color: "green", permissions: ["View Dashboard", "Create Orders", "View Reports"] }
              ].map((role, i) => (
                <div key={i} className="p-5 rounded-xl border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 rounded-lg bg-${role.color}-100 flex items-center justify-center`}>
                      <Shield className={`h-5 w-5 text-${role.color}-600`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{role.users} users</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">{role.name}</h4>
                  <div className="space-y-2">
                    {role.permissions.map((perm, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-slate-600">{perm}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    Edit Role
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">General Preferences</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Time Format</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => setSettings({...settings, timeFormat: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Fiscal Year Start</label>
                <select
                  value={settings.fiscalYearStart}
                  onChange={(e) => setSettings({...settings, fiscalYearStart: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                >
                  <option value="January">January</option>
                  <option value="April">April</option>
                  <option value="July">July</option>
                  <option value="October">October</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                <Save className="h-4 w-4 inline mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
            </div>

            <div className="space-y-4">
              {/* Notification Channels */}
              <div className="pb-4 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Notification Channels</h4>
                <div className="space-y-3">
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
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
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
              </div>

              {/* Notification Types */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    { 
                      label: "Invoice Created", 
                      description: "Get notified when a new invoice is created",
                      checked: settings.notifyOnInvoice,
                      onChange: (val: boolean) => setSettings({...settings, notifyOnInvoice: val})
                    },
                    { 
                      label: "Payment Received", 
                      description: "Get notified when a payment is received",
                      checked: settings.notifyOnPayment,
                      onChange: (val: boolean) => setSettings({...settings, notifyOnPayment: val})
                    },
                    { 
                      label: "Low Stock Alert", 
                      description: "Get notified when inventory is running low",
                      checked: settings.notifyOnLowStock,
                      onChange: (val: boolean) => setSettings({...settings, notifyOnLowStock: val})
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
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
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                <Save className="h-4 w-4 inline mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                    className="w-full h-11 px-4 pr-12 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">New Password</label>
                <input
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-900">Confirm New Password</label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                  className="w-full h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                Update Password
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-semibold mb-2 text-slate-900">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full max-w-xs h-11 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                  min="5"
                  max="120"
                />
                <p className="text-xs text-slate-500 mt-2">Automatically log out after this period of inactivity</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg bg-[#002147] text-sm font-semibold text-white hover:bg-[#001a38] transition shadow-lg">
                <Save className="h-4 w-4 inline mr-2" />
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Palette className="h-5 w-5 text-[#002147]" />
              <h3 className="text-lg font-bold text-slate-900">Appearance Settings</h3>
            </div>

            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-900">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light" as const, label: "Light", icon: Sun },
                    { value: "dark" as const, label: "Dark", icon: Moon },
                    { value: "auto" as const, label: "Auto", icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => {
                          setSettings({...settings, theme: theme.value});
                          setMode(theme.value);
                          // Save immediately
                          localStorage.setItem("admin-theme", theme.value);
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === theme.value 
                            ? "border-[#002147] bg-blue-50 shadow-lg" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2 text-slate-700" />
                        <p className="text-sm font-semibold text-center text-slate-900">{theme.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Customization */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-900">Custom Colors</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Header Color */}
                  <div className="p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">Header Color</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.headerColor || "#ffffff"}
                        onChange={(e) => setSettings({...settings, headerColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.headerColor || "#ffffff"}
                        onChange={(e) => setSettings({...settings, headerColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Sidebar Color */}
                  <div className="p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">Sidebar Color</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.sidebarColor || "#002147"}
                        onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.sidebarColor || "#002147"}
                        onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Primary/Content Color */}
                  <div className="p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <Palette className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">Primary Color</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="h-10 w-16 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#002147] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Color Combinations */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-900">Preset Color Combinations</label>
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
                      className="p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-left"
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
                      <p className="text-xs font-semibold text-slate-900">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-xs font-semibold mb-3 text-slate-600">Preview</p>
                <div className="flex gap-3 h-32 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  {/* Sidebar Preview */}
                  <div className="w-16 flex items-center justify-center" 
                    style={{ backgroundColor: settings.sidebarColor || "#002147" }}>
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  {/* Content Preview */}
                  <div className="flex-1 flex flex-col">
                    {/* Header Preview */}
                    <div className="h-12 flex items-center px-4 border-b border-slate-200" 
                      style={{ backgroundColor: settings.headerColor || "#ffffff" }}>
                      <div className="h-2 w-24 rounded" style={{ backgroundColor: settings.primaryColor }} />
                    </div>
                    {/* Content Preview */}
                    <div className="flex-1 p-4 space-y-2 bg-slate-50">
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
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Reset to Default
              </button>
              <button 
                onClick={() => {
                  // Apply theme by updating CSS variables
                  const root = document.documentElement;
                  root.style.setProperty("--admin-header", settings.headerColor || "#ffffff");
                  root.style.setProperty("--admin-sidebar", settings.sidebarColor || "#002147");
                  root.style.setProperty("--admin-primary", settings.primaryColor);
                  
                  // Save to localStorage
                  localStorage.setItem("admin-custom-theme", JSON.stringify({
                    header: settings.headerColor,
                    sidebar: settings.sidebarColor,
                    primary: settings.primaryColor
                  }));
                  
                  // Save theme mode
                  localStorage.setItem("admin-theme", settings.theme);
                  
                  // Force a small delay to ensure CSS variables are applied
                  setTimeout(() => {
                    alert("Theme applied successfully! The page will refresh to apply all changes.");
                    window.location.reload();
                  }, 100);
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition shadow-lg"
                style={{ backgroundColor: settings.primaryColor }}>
                <Palette className="h-4 w-4 inline mr-2" />
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#002147]" />
                <h3 className="text-lg font-bold text-slate-900">Audit Logs</h3>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  <Download className="h-4 w-4 inline mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
              <input
                type="text"
                placeholder="Search logs..."
                className="h-10 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
              />
              <select className="h-10 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent">
                <option value="">All Users</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
              </select>
              <select className="h-10 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent">
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>
              <input
                type="date"
                className="h-10 px-4 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#002147] focus:border-transparent"
              />
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Timestamp</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Action</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Resource</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: "2 mins ago", user: "John Doe", action: "Created", resource: "Invoice #1234", status: "Success" },
                    { time: "15 mins ago", user: "Jane Smith", action: "Updated", resource: "Product SKU-789", status: "Success" },
                    { time: "1 hour ago", user: "Bob Johnson", action: "Deleted", resource: "Customer Record", status: "Success" },
                    { time: "2 hours ago", user: "John Doe", action: "Login", resource: "System Access", status: "Success" },
                    { time: "3 hours ago", user: "Jane Smith", action: "Updated", resource: "Company Profile", status: "Success" }
                  ].map((log, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-600">{log.time}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs font-semibold">
                            {log.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          log.action === "Created" ? "bg-green-100 text-green-700" :
                          log.action === "Updated" ? "bg-blue-100 text-blue-700" :
                          log.action === "Deleted" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{log.resource}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-200">
              <p className="text-sm text-slate-600">Showing 1 to 5 of 50 entries</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-[#002147] text-sm font-semibold text-white">
                  1
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  2
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  3
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SettingsPage;
