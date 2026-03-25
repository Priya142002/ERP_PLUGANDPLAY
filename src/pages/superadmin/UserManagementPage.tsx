import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Shield, Clock, CheckCircle2, XCircle, Building2, Puzzle, Eye, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { superAdminApi } from '../../services/api';
import '../../styles/superadmin-mobile.css';

const pageMotion = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

interface UserDto {
  id: number; name: string; email: string; role: string; isActive: boolean; createdAt: string;
  companyId?: number; companyName?: string; industry?: string;
  isTrialActive: boolean; trialStartDate?: string; trialEndDate?: string; daysRemaining: number;
  hasActiveSubscription: boolean; planName?: string;
  modules: { moduleId: string; isEnabled: boolean; isTrialAccess: boolean }[];
}

/* ── Detail Modal ───────────────────────────── */
function UserDetailModal({ user, onClose }: { user: UserDto; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--sa-card)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#1a2744" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-base font-bold text-white">User Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>Name</p>
              <p className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>Email</p>
              <p className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>Role</p>
              <p className="text-sm font-bold capitalize" style={{ color: "var(--sa-text-primary)" }}>{user.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>Status</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {user.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Company info */}
          {user.companyName && (
            <div className="p-3 rounded-xl border" style={{ backgroundColor: "var(--sa-hover)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                <p className="text-xs font-bold" style={{ color: "var(--sa-text-primary)" }}>Company</p>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{user.companyName}</p>
              <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{user.industry}</p>
            </div>
          )}

          {/* Trial / subscription */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border" style={{ borderColor: "var(--sa-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--sa-text-secondary)" }}>Trial Status</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${user.isTrialActive ? 'text-amber-600' : 'text-slate-400'}`}>
                <Clock className="h-3 w-3" />
                {user.isTrialActive ? `Active (${user.daysRemaining}d left)` : 'Inactive'}
              </span>
            </div>
            <div className="p-3 rounded-xl border" style={{ borderColor: "var(--sa-border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--sa-text-secondary)" }}>Subscription</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${user.hasActiveSubscription ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Shield className="h-3 w-3" />
                {user.hasActiveSubscription ? user.planName || 'Active' : 'None'}
              </span>
            </div>
          </div>

          {/* Modules */}
          {user.modules.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Puzzle className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                <p className="text-xs font-bold" style={{ color: "var(--sa-text-primary)" }}>Assigned Modules</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.modules.map(m => (
                  <span key={m.moduleId}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${m.isEnabled
                      ? m.isTrialAccess ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {m.moduleId} {m.isTrialAccess && '(trial)'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>
            Joined: {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────── */
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const f = filter === 'all' ? undefined : filter;
      const res = await superAdminApi.getUsers(f);
      if (res.success) setUsers(res.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id: number) => {
    await superAdminApi.toggleUser(id);
    load();
  };

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const trialCount = users.filter(u => u.isTrialActive).length;
  const subscribedCount = users.filter(u => u.hasActiveSubscription).length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>User Management</h1>
          <p className="text-slate-500 mt-1">View all registered users, trial access, and module assignments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "var(--sa-primary)" },
          { label: "Active Users", value: activeCount, icon: CheckCircle2, color: "var(--sa-success)" },
          { label: "Trial Users", value: trialCount, icon: Clock, color: "#f59e0b" },
          { label: "Subscribed", value: subscribedCount, icon: Shield, color: "#8b5cf6" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-4 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${s.color}, transparent 90%)` }}>
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{s.label}</div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{loading ? '...' : s.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border text-sm"
            style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          {['all', 'trial', 'subscribed', 'expired'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${filter === f
                ? 'text-white border-transparent' : ''}`}
              style={filter === f
                ? { backgroundColor: "#1a2744", color: "#fff" }
                : { borderColor: "var(--sa-border)", color: "var(--sa-text-secondary)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-auto" style={{ maxHeight: "560px" }}>
          <table className="w-full relative">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--sa-card)" }}>
              <tr className="border-b" style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                {['User', 'Company', 'Role', 'Trial', 'Subscription', 'Modules', 'Status', 'Actions'].map(h => (
                  <th key={h} className="p-4 text-left text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-b transition-colors hover:bg-[var(--sa-hover)]"
                  style={{ borderColor: "var(--sa-border)" }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: "#1a2744" }}>
                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--sa-text-primary)" }}>{u.name}</p>
                        <p className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {u.companyName ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" style={{ color: "var(--sa-primary)" }} />
                        <span className="text-sm" style={{ color: "var(--sa-text-primary)" }}>{u.companyName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                      style={{
                        backgroundColor: u.role === 'SuperAdmin' ? '#eef2ff' : '#f0fdf4',
                        color: u.role === 'SuperAdmin' ? '#4f46e5' : '#16a34a'
                      }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.isTrialActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Clock className="h-3 w-3" />{u.daysRemaining}d left
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {u.hasActiveSubscription ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <Shield className="h-3 w-3" />{u.planName || 'Active'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {u.modules.slice(0, 3).map(m => (
                        <span key={m.moduleId} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          {m.moduleId}
                        </span>
                      ))}
                      {u.modules.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          +{u.modules.length - 3}
                        </span>
                      )}
                      {u.modules.length === 0 && <span className="text-xs text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-slate-100"
                        title="View Details">
                        <Eye className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                      </button>
                      <button onClick={() => handleToggle(u.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-slate-100"
                        title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive
                          ? <ToggleRight className="h-4 w-4 text-emerald-600" />
                          : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </motion.div>
  );
}
