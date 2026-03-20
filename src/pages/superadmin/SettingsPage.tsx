import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../vivify/ui";
import { useState } from "react";
import { 
  ChevronRight, Globe, Lock, Mail, Key, 
  Save, Eye, EyeOff, Shield, Bell, Database, RefreshCw,
  CheckCircle, AlertCircle, Settings, ChevronDown, ChevronUp
} from "lucide-react";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const TABS = [
  { id: "general", label: "General", icon: Globe, description: "Basic platform settings and information" },
  { id: "security", label: "Security", icon: Lock, description: "Authentication and access control" },
  { id: "email", label: "Email System", icon: Mail, description: "Configure how emails are sent from the platform" },
  { id: "api", label: "API Config", icon: Key, description: "API keys and rate limiting" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Platform alert and notification preferences" },
  { id: "database", label: "Database", icon: Database, description: "Database connection and backup settings" },
];

const textStyles = {
  heading: { color: 'var(--sa-text-primary)', fontWeight: 600 },
  subheading: { color: 'var(--sa-text-primary)', fontWeight: 500 },
  label: { color: 'var(--sa-text-primary)', fontWeight: 500, fontSize: '0.75rem' },
  description: { color: 'var(--sa-text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 },
  smallText: { color: 'var(--sa-text-secondary)', fontSize: '0.7rem' },
  value: { color: 'var(--sa-text-primary)' }
};

function ToggleRow({ label, sub, defaultOn }: { label: string; sub: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: "var(--sa-border)" }}>
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>{label}</div>
        <div className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>{sub}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--sa-primary)] focus:ring-offset-2`}
        style={{ backgroundColor: on ? 'var(--sa-success)' : 'var(--sa-border)' }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            on ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SecurityRow({ 
  label, 
  sub, 
  settingKey,
  securitySettings,
  setSecuritySettings,
  critical = false 
}: { 
  label: string; 
  sub: string; 
  settingKey: keyof { enforce2FA: boolean; sessionTimeout: boolean; ipAllowlist: boolean; auditEverything: boolean; forcePassword: boolean; rateLimiting: boolean };
  securitySettings: any;
  setSecuritySettings: any;
  critical?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: "var(--sa-border)" }}>
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>{label}</div>
          {critical && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" 
              style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--sa-error)' }}>
              Critical
            </span>
          )}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>{sub}</div>
      </div>
      
      <button
        onClick={() => setSecuritySettings((prev: any) => ({ ...prev, [settingKey]: !prev[settingKey] }))}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--sa-primary)] focus:ring-offset-2`}
        style={{
          backgroundColor: securitySettings[settingKey] ? 'var(--sa-success)' : 'var(--sa-border)',
        }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            securitySettings[settingKey] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [tab, setTab] = useState("general");
  const [keyVisible, setKeyVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    enforce2FA: true,
    sessionTimeout: true,
    ipAllowlist: false,
    auditEverything: false,
    forcePassword: true,
    rateLimiting: true
  });

  const calculateSecurityScore = () => {
    const criticalSettings = [
      securitySettings.enforce2FA,
      securitySettings.sessionTimeout,
      securitySettings.forcePassword,
      securitySettings.rateLimiting
    ];
    const criticalEnabled = criticalSettings.filter(Boolean).length;
    
    const bonusPoints = securitySettings.ipAllowlist ? 15 : 0;
    const auditPoints = securitySettings.auditEverything ? 15 : 0;
    
    let score = Math.round((criticalEnabled / 4) * 70) + bonusPoints + auditPoints;
    return Math.min(score, 100);
  };

  const securityScore = calculateSecurityScore();

  const getRecommendations = () => {
    const recommendations = [];
    if (!securitySettings.ipAllowlist) recommendations.push("Enable IP Allowlist to restrict access");
    if (!securitySettings.auditEverything) recommendations.push("Enable Audit Everything for full compliance");
    if (!securitySettings.enforce2FA) recommendations.push("⚠️ CRITICAL: Enable 2FA for Admins");
    if (!securitySettings.forcePassword) recommendations.push("⚠️ CRITICAL: Enable Force Password Policy");
    if (!securitySettings.sessionTimeout) recommendations.push("⚠️ CRITICAL: Enable Session Timeout");
    if (!securitySettings.rateLimiting) recommendations.push("⚠️ CRITICAL: Enable Rate Limiting");
    return recommendations;
  };

  const [formData, setFormData] = useState({
    platformName: "Vivify",
    supportEmail: "support@vivify.io",
    platformUrl: "https://app.vivify.io",
    trialDuration: "30",
    fromEmail: "noreply@vivify.io",
    fromName: "Vivify Platform",
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUser: "apikey",
    smtpPass: "SG.xxxxx",
    apiKey: "vfy_platform_sk_9a3b7c2e1f4d8a6b0c5e2d9f3a7e1b4c",
    rateLimit: "1000",
    webhookUrl: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestEmail = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult("success");
      setTimeout(() => setTestResult(null), 5000);
    }, 1500);
  };

  return (
    <motion.div {...pageMotion} className="p-6 max-w-7xl mx-auto">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Core Configuration</h1>
          <p className="text-slate-500 mt-1">Fine-tune global parameters, security protocols, and platform architecture</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm"
          style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-card)" }}>
          <Shield className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>Security Index: {securityScore}%</span>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-[1.5rem] shadow-lg border relative overflow-hidden text-white mb-6"
        style={{ backgroundColor: "var(--sa-primary)", borderColor: "var(--sa-border)" }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none">
          <Settings size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <Settings size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Architecture Control</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">System Parameters</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">Global Environment Fully Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="p-2 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition ${
                    isActive ? '' : 'hover:bg-[var(--sa-hover)]'
                  }`}
                  style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--sa-primary), transparent 90%)', borderLeft: `3px solid var(--sa-primary)` } : {}}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? 'var(--sa-primary)' : 'var(--sa-text-secondary)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: isActive ? 'var(--sa-primary)' : 'var(--sa-text-primary)' }}>
                      {t.label}
                    </div>
                    <div className="text-[10px] truncate mt-0.5" style={textStyles.smallText}>
                      {t.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3" style={{ color: 'var(--sa-primary)' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* General Settings */}
              {tab === "general" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>Platform Configuration</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>Platform Name</label>
                        <Input value={formData.platformName} onChange={(e) => setFormData({...formData, platformName: e.target.value})} placeholder="Vivify" />
                      </div>
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>Support Email</label>
                        <Input type="email" value={formData.supportEmail} onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} placeholder="support@vivify.io" />
                      </div>
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>Platform URL</label>
                        <Input value={formData.platformUrl} onChange={(e) => setFormData({...formData, platformUrl: e.target.value})} placeholder="https://app.vivify.io" />
                      </div>
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>Trial Duration (days)</label>
                        <Input type="number" value={formData.trialDuration} onChange={(e) => setFormData({...formData, trialDuration: e.target.value})} placeholder="30" />
                      </div>
                    </div>
 
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--sa-primary)' }}>
                        {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {tab === "security" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>Security Policies</h2>
                  </div>
 
                  <div className="space-y-2">
                    <SecurityRow label="Enforce 2FA for Admins" sub="Require two-factor authentication for all company administrators" settingKey="enforce2FA" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} critical={true} />
                    <SecurityRow label="Session Timeout (30 min)" sub="Auto-logout inactive users after 30 minutes of inactivity" settingKey="sessionTimeout" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} critical={true} />
                    <SecurityRow label="IP Allowlist" sub="Restrict platform access to approved IP addresses only" settingKey="ipAllowlist" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} />
                    <SecurityRow label="Audit Everything" sub="Log every user action across the entire platform for compliance" settingKey="auditEverything" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} />
                    <SecurityRow label="Force Password Policy" sub="Require min 8 chars, mixed case, numbers & special characters" settingKey="forcePassword" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} critical={true} />
                    <SecurityRow label="Rate Limiting" sub="Prevent brute force attacks with request throttling" settingKey="rateLimiting" securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} critical={true} />
                  </div>

                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--sa-hover)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium" style={{ color: 'var(--sa-text-primary)' }}>Security Score</h4>
                      <span className="text-sm font-bold" style={{ color: securityScore >= 80 ? 'var(--sa-success)' : securityScore >= 50 ? 'var(--sa-warning)' : 'var(--sa-error)' }}>{securityScore}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sa-border)' }}>
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: securityScore >= 80 ? 'var(--sa-success)' : securityScore >= 50 ? 'var(--sa-warning)' : 'var(--sa-error)' }} initial={{ width: 0 }} animate={{ width: `${securityScore}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    {securityScore < 100 && (
                      <div className="mt-3 space-y-1">
                        {getRecommendations().map((rec, i) => (
                          <p key={i} className="text-xs flex items-center gap-1" style={{ color: rec.includes('CRITICAL') ? 'var(--sa-error)' : 'var(--sa-text-secondary)' }}><span>•</span>{rec}</p>
                        ))}
                      </div>
                    )}
                  </div>
 
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 ml-auto" style={{ backgroundColor: 'var(--sa-primary)' }}>
                      <Save className="h-4 w-4" /> Save Security Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {tab === "email" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Mail className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>Email Configuration</h2>
                  </div>
                  <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '1px solid rgba(40, 167, 69, 0.2)' }}>
                    <div className="h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--sa-success)' }} />
                    <div>
                      <span className="text-sm font-medium" style={textStyles.subheading}>Email system is connected and working</span>
                      <p className="text-xs mt-1" style={textStyles.description}>All system emails will be sent using these settings</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>From Name</label>
                        <Input value={formData.fromName} onChange={(e) => setFormData({...formData, fromName: e.target.value})} placeholder="Vivify Platform" />
                      </div>
                      <div>
                        <label className="block text-xs mb-2" style={textStyles.label}>From Email</label>
                        <Input type="email" value={formData.fromEmail} onChange={(e) => setFormData({...formData, fromEmail: e.target.value})} placeholder="noreply@vivify.io" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={handleTestEmail} disabled={testing} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border" style={{ borderColor: 'var(--sa-border)', color: 'var(--sa-text-primary)', backgroundColor: 'var(--sa-card)' }}>
                        {testing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Sending...</> : <><Mail className="h-4 w-4" /> Send Test Email</>}
                      </button>
                      {testResult === "success" && <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--sa-success)' }}><CheckCircle className="h-4 w-4" /> Test email sent!</div>}
                    </div>
                    <div className="pt-2">
                       <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-xs font-medium transition" style={textStyles.description}>
                        <Settings className="h-3 w-3" /> Advanced Settings {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--sa-hover)' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className="block text-xs mb-2" style={textStyles.label}>SMTP Host</label><Input value={formData.smtpHost} onChange={(e) => setFormData({...formData, smtpHost: e.target.value})} /></div>
                              <div><label className="block text-xs mb-2" style={textStyles.label}>SMTP Port</label><Input value={formData.smtpPort} onChange={(e) => setFormData({...formData, smtpPort: e.target.value})} /></div>
                              <div><label className="block text-xs mb-2" style={textStyles.label}>Username</label><Input value={formData.smtpUser} onChange={(e) => setFormData({...formData, smtpUser: e.target.value})} /></div>
                              <div><label className="block text-xs mb-2" style={textStyles.label}>Password / API Key</label><Input type="password" value={formData.smtpPass} onChange={(e) => setFormData({...formData, smtpPass: e.target.value})} /></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--sa-primary)' }}>
                        <Save className="h-4 w-4" /> Save Email Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {tab === "api" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Key className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>API Configuration</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs mb-2" style={textStyles.label}>Platform Master Key</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-xl border px-4 py-2.5 font-mono text-sm" style={{ borderColor: 'var(--sa-border)', backgroundColor: 'var(--sa-hover)', color: 'var(--sa-text-primary)' }}>{keyVisible ? formData.apiKey : '•'.repeat(40)}</div>
                        <button onClick={() => setKeyVisible(!keyVisible)} className="p-2.5 rounded-xl border transition hover:bg-[var(--sa-hover)]" style={{ borderColor: 'var(--sa-border)' }}>{keyVisible ? <EyeOff className="h-4 w-4" style={{ color: 'var(--sa-text-secondary)' }} /> : <Eye className="h-4 w-4" style={{ color: 'var(--sa-text-secondary)' }} />}</button>
                      </div>
                      <div className="mt-2 text-xs flex items-center gap-1" style={{ color: 'var(--sa-warning)' }}><AlertCircle className="h-3 w-3" />This key has platform-wide access. Rotate immediately if compromised.</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Rate Limit (req/min)</label><Input type="number" value={formData.rateLimit} onChange={(e) => setFormData({...formData, rateLimit: e.target.value})} /></div>
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Webhook URL</label><Input value={formData.webhookUrl} onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})} placeholder="https://..." /></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="px-4 py-2 rounded-xl text-sm font-medium transition border" style={{ borderColor: 'var(--sa-border)', color: 'var(--sa-text-primary)', backgroundColor: 'var(--sa-card)' }}>View API Docs</button>
                      <button className="px-4 py-2 rounded-xl text-sm font-medium transition" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--sa-error)', border: '1px solid rgba(220, 53, 69, 0.2)' }}>Rotate Master Key</button>
                    </div>
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--sa-primary)' }}>
                        <Save className="h-4 w-4" /> Save API Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {tab === "notifications" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Bell className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>Notification Preferences</h2>
                  </div>
                  <div className="space-y-4">
                    <ToggleRow label="Email Alerts" sub="Send emails for critical events" defaultOn={true} />
                    <ToggleRow label="Slack Integration" sub="Post alerts to Slack" defaultOn={false} />
                    <ToggleRow label="Daily Digest" sub="Receive a daily summary" defaultOn={true} />
                    <ToggleRow label="Security Alerts" sub="Immediate notifications" defaultOn={true} />
                  </div>
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 ml-auto" style={{ backgroundColor: 'var(--sa-primary)' }}>
                      <Save className="h-4 w-4" /> Save Notifications
                    </button>
                  </div>
                </div>
              )}

              {/* Database Settings */}
              {tab === "database" && (
                <div className="p-6 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Database className="h-5 w-5" style={{ color: 'var(--sa-primary)' }} />
                    <h2 className="text-lg font-semibold" style={textStyles.heading}>Database Configuration</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Host</label><Input defaultValue="localhost:5432" /></div>
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Name</label><Input defaultValue="vivify_platform" /></div>
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Username</label><Input defaultValue="vivify_admin" /></div>
                      <div><label className="block text-xs mb-2" style={textStyles.label}>Password</label><Input type="password" defaultValue="••••••••" /></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="px-4 py-2 rounded-xl text-sm font-medium transition border" style={{ borderColor: 'var(--sa-border)', color: 'var(--sa-text-primary)', backgroundColor: 'var(--sa-card)' }}>Test Connection</button>
                      <button className="px-4 py-2 rounded-xl text-sm font-medium transition" style={{ backgroundColor: 'rgba(255, 159, 67, 0.1)', color: 'var(--sa-warning)', border: '1px solid rgba(255, 159, 67, 0.2)' }}>Backup Now</button>
                    </div>
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--sa-border)' }}>
                      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--sa-primary)' }}>
                        <Save className="h-4 w-4" /> Save Database Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default SettingsPage;
