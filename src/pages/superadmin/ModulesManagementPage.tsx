import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Puzzle, ToggleLeft, ToggleRight, Archive, ShoppingCart,
  TrendingUp, BookOpen, Users, Briefcase, Headphones,
  Truck, Factory, Receipt, Search, Building2,
  CheckCircle2, XCircle, X, Save, Plus, Trash2
} from "lucide-react";
import { superAdminApi } from "../../services/api";
import "../../styles/superadmin-mobile.css";

const pageMotion = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const ICON_MAP: Record<string, any> = {
  Archive, ShoppingCart, TrendingUp, BookOpen, Users, Briefcase,
  Headphones, Puzzle, Truck, Factory, Receipt, Building2
};
const CATEGORIES = ["Operations","Finance","Sales","HR","Support","Manufacturing","Custom"];

function CreateModuleModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ moduleId: '', name: '', description: '', category: 'Operations', icon: 'Puzzle' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.moduleId.trim() || !form.name.trim()) { setError('Module ID and Name are required.'); return; }
    setSaving(true);
    try {
      const res = await superAdminApi.createGlobalModule(form);
      if (res.success) { onSave(); onClose(); }
      else setError(res.message || 'Failed to create module.');
    } catch { setError('Server error.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--sa-card)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#1a2744" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-base font-bold text-white">Create New Module</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-xs text-white bg-red-500/80 p-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>Module ID *</label>
            <input type="text" value={form.moduleId}
              onChange={e => setForm({ ...form, moduleId: e.target.value.toLowerCase().replace(/\s+/g,'_') })}
              placeholder="e.g. custom_reports" className="w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              style={{ backgroundColor: "var(--sa-background)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
            <p className="text-xs mt-1" style={{ color: "var(--sa-text-secondary)" }}>Lowercase, underscores only</p>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>Module Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Custom Reports" className="w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              style={{ backgroundColor: "var(--sa-background)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>Description</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description" className="w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              style={{ backgroundColor: "var(--sa-background)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{ backgroundColor: "var(--sa-background)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>Icon</label>
              <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{ backgroundColor: "var(--sa-background)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
                {Object.keys(ICON_MAP).map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm border"
              style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)", backgroundColor: "var(--sa-hover)" }}>Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white sa-btn-primary disabled:opacity-60">
              <Save className="h-4 w-4" />{saving ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}


function AssignModulesModal({ company, allModules, onClose, onSave }: {
  company: any; allModules: any[]; onClose: () => void; onSave: () => void;
}) {
  const [companyMods, setCompanyMods] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    superAdminApi.getCompanyModules(company.id).then(res => {
      if (res.success) setCompanyMods(res.data ?? []);
    });
  }, [company.id]);

  const isEnabled = (moduleId: string) =>
    companyMods.find((m: any) => m.moduleId === moduleId)?.isEnabled ?? false;

  const toggle = async (moduleId: string, current: boolean) => {
    setSaving(true);
    await superAdminApi.toggleCompanyModule(company.id, moduleId, !current);
    const res = await superAdminApi.getCompanyModules(company.id);
    if (res.success) setCompanyMods(res.data ?? []);
    setSaving(false);
  };

  const enabledCount = allModules.filter(m => isEnabled(m.moduleId)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--sa-card)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#1a2744" }}>
          <div>
            <h2 className="text-base font-bold text-white">Module Access — {company.name}</h2>
            <p className="text-xs text-white/60">{enabledCount} of {allModules.length} enabled</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto">
          {allModules.map(mod => {
            const Icon = ICON_MAP[mod.icon] || Puzzle;
            const on = isEnabled(mod.moduleId);
            return (
              <button key={mod.moduleId} onClick={() => toggle(mod.moduleId, on)} disabled={saving}
                className="flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                style={{ borderColor: on ? "#22c55e" : "#e2e8f0", backgroundColor: on ? "rgba(34,197,94,0.07)" : "#f8fafc" }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: on ? "rgba(34,197,94,0.15)" : "#e2e8f0" }}>
                  <Icon className="h-4 w-4" style={{ color: on ? "#16a34a" : "#94a3b8" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: on ? "#15803d" : "#475569" }}>{mod.name}</p>
                  <p className="text-xs text-slate-400 truncate">{mod.category}</p>
                </div>
                {on ? <ToggleRight className="h-5 w-5 flex-shrink-0 text-green-500" />
                    : <ToggleLeft className="h-5 w-5 flex-shrink-0 text-slate-300" />}
              </button>
            );
          })}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ backgroundColor: "var(--sa-hover)", borderColor: "var(--sa-border)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border"
            style={{ borderColor: "var(--sa-border)", color: "var(--sa-text-primary)", backgroundColor: "var(--sa-background)" }}>Close</button>
          <button onClick={() => { onSave(); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white sa-btn-primary">
            <Save className="h-4 w-4" /> Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function ModulesManagementPage() {
  const [globalModules, setGlobalModules] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignCompany, setAssignCompany] = useState<any>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDrop, setShowCompanyDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [modsRes, compsRes] = await Promise.all([
        superAdminApi.getGlobalModules(),
        superAdminApi.getCompanies(1, 200),
      ]);
      if (modsRes.success) setGlobalModules(modsRes.data ?? []);
      if (compsRes.success) {
        const items = compsRes.data?.items ?? compsRes.data ?? [];
        setCompanies(Array.isArray(items) ? items : []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowCompanyDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggleGlobal = async (id: number) => {
    await superAdminApi.toggleGlobalModule(id);
    load();
  };

  const handleDeleteGlobal = async (id: number, name: string) => {
    if (!window.confirm(`Delete module "${name}"?`)) return;
    await superAdminApi.deleteGlobalModule(id);
    load();
  };

  const filtered = globalModules.filter(m =>
    (filterCategory === 'all' || m.category === filterCategory) &&
    (!search || m.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = globalModules.filter(m => m.isActive).length;
  const inactiveCount = globalModules.length - activeCount;
  const categories = ["all", ...Array.from(new Set(globalModules.map((m: any) => m.category as string)))];
  const filteredCompanies = companies.filter(c =>
    !companySearch || c.name?.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <motion.div {...pageMotion} className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--sa-text-primary)" }}>Module Management</h1>
          <p className="text-slate-500 mt-1">Manage global modules and assign them to companies</p>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white sa-btn-primary shadow-md">
          <Plus className="h-4 w-4" /> Create Module
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Modules", value: globalModules.length, icon: Puzzle, color: "var(--sa-primary)" },
          { label: "Active", value: activeCount, icon: CheckCircle2, color: "var(--sa-success)" },
          { label: "Inactive", value: inactiveCount, icon: XCircle, color: "var(--sa-error)" },
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

      <div className="p-5 rounded-xl border" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-5 w-5" style={{ color: "var(--sa-primary)" }} />
          <h2 className="text-base font-semibold" style={{ color: "var(--sa-text-primary)" }}>Assign Modules to Company</h2>
        </div>
        <div className="relative max-w-md" ref={dropRef}>
          <input type="text" placeholder="Search company..."
            value={companySearch} onFocus={() => setShowCompanyDrop(true)}
            onChange={e => { setCompanySearch(e.target.value); setShowCompanyDrop(true); }}
            className="w-full h-10 pl-4 pr-4 rounded-xl border text-sm"
            style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
          {showCompanyDrop && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 w-full mt-1 rounded-xl border shadow-lg max-h-60 overflow-y-auto"
              style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
              {filteredCompanies.length === 0
                ? <div className="p-3 text-sm text-center" style={{ color: "var(--sa-text-secondary)" }}>No companies found</div>
                : filteredCompanies.map(c => (
                  <button key={c.id} onClick={() => { setAssignCompany(c); setShowCompanyDrop(false); setCompanySearch(''); }}
                    className="w-full p-3 text-left hover:bg-[var(--sa-hover)] transition border-b last:border-b-0 flex items-center gap-3"
                    style={{ borderColor: "var(--sa-border)" }}>
                    <Building2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--sa-primary)" }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--sa-text-primary)" }}>{c.name}</div>
                      <div className="text-xs" style={{ color: "var(--sa-text-secondary)" }}>{c.email}</div>
                    </div>
                    <div className={`ml-auto h-2 w-2 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </button>
                ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--sa-text-secondary)" }} />
          <input type="text" placeholder="Search modules..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border text-sm"
            style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }} />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="h-10 px-4 rounded-xl border text-sm"
          style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)", color: "var(--sa-text-primary)" }}>
          {categories.map(c => <option key={String(c)} value={String(c)}>{c === 'all' ? 'All Categories' : String(c)}</option>)}
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--sa-card)", borderColor: "var(--sa-border)" }}>
        <div className="overflow-auto" style={{ maxHeight: "560px" }}>
          <table className="w-full relative">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--sa-card)" }}>
              <tr className="border-b" style={{ borderColor: "var(--sa-border)", backgroundColor: "var(--sa-hover)" }}>
                {['Module', 'Category', 'Description', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="p-4 text-left text-xs font-semibold" style={{ color: "var(--sa-text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: "var(--sa-text-secondary)" }}>No modules found</td></tr>
              ) : filtered.map((mod: any, i: number) => {
                const Icon = ICON_MAP[mod.icon] || Puzzle;
                return (
                  <motion.tr key={mod.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-[var(--sa-hover)] transition" style={{ borderColor: "var(--sa-border)" }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: mod.isActive ? 'color-mix(in srgb, var(--sa-primary), transparent 90%)' : 'var(--sa-hover)' }}>
                          <Icon className="h-4 w-4" style={{ color: mod.isActive ? 'var(--sa-primary)' : 'var(--sa-text-secondary)' }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "var(--sa-text-primary)" }}>{mod.name}</div>
                          <div className="text-xs font-mono" style={{ color: "var(--sa-text-secondary)" }}>{mod.moduleId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--sa-info), transparent 90%)', color: 'var(--sa-info)' }}>
                        {mod.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs max-w-[200px] truncate" style={{ color: "var(--sa-text-secondary)" }}>{mod.description}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: mod.isBuiltIn ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)', color: mod.isBuiltIn ? '#6366f1' : '#d97706' }}>
                        {mod.isBuiltIn ? 'Built-in' : 'Custom'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggleGlobal(mod.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border"
                        style={{
                          borderColor: mod.isActive ? 'var(--sa-success)' : 'var(--sa-border)',
                          color: mod.isActive ? 'var(--sa-success)' : 'var(--sa-text-secondary)',
                          backgroundColor: mod.isActive ? 'color-mix(in srgb, var(--sa-success), transparent 90%)' : 'var(--sa-hover)'
                        }}>
                        {mod.isActive ? <><ToggleRight className="h-4 w-4" /> Active</> : <><ToggleLeft className="h-4 w-4" /> Inactive</>}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button title="Assign to company" onClick={() => setAssignCompany({ _pick: true })}
                          className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition">
                          <Building2 className="h-4 w-4" style={{ color: "var(--sa-primary)" }} />
                        </button>
                        {!mod.isBuiltIn && (
                          <button onClick={() => handleDeleteGlobal(mod.id, mod.name)}
                            className="p-1.5 rounded-lg hover:bg-[var(--sa-hover)] transition">
                            <Trash2 className="h-4 w-4" style={{ color: "var(--sa-error)" }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateModuleModal onClose={() => setShowCreateModal(false)} onSave={load} />
        )}
        {assignCompany && !assignCompany._pick && (
          <AssignModulesModal
            company={assignCompany}
            allModules={globalModules.filter(m => m.isActive)}
            onClose={() => setAssignCompany(null)}
            onSave={load}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ADD THIS DEFAULT EXPORT AT THE END
export default ModulesManagementPage;