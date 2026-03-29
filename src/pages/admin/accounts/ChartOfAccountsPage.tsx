import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Search, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { accountsApi } from '../../../services/api';
import { useNotifications } from '../../../context/AppContext';

const getCompanyId = () => {
  try {
    const raw = localStorage.getItem('erp_user') || sessionStorage.getItem('erp_user');
    if (raw) return JSON.parse(raw).companyId as number;
  } catch { /* ignore */ }
  return 0;
};

interface Account {
  id: number; accountCode: string; accountName: string; accountType: string;
  accountGroup: string; parentAccountCode?: string; isGroup: boolean; level: number;
  openingBalance: number; openingBalanceType: string; isSystemAccount: boolean;
  isActive: boolean; currentBalance: number; children?: Account[];
}

const TYPE_COLORS: Record<string, string> = {
  Asset: 'bg-blue-100 text-blue-700',
  Liability: 'bg-rose-100 text-rose-700',
  Equity: 'bg-purple-100 text-purple-700',
  Income: 'bg-emerald-100 text-emerald-700',
  Expense: 'bg-amber-100 text-amber-700',
};

function buildTree(accounts: Account[]): Account[] {
  const map = new Map<string, Account>();
  accounts.forEach(a => map.set(a.accountCode, { ...a, children: [] }));
  const roots: Account[] = [];
  map.forEach(a => {
    if (a.parentAccountCode && map.has(a.parentAccountCode)) {
      map.get(a.parentAccountCode)!.children!.push(a);
    } else {
      roots.push(a);
    }
  });
  return roots;
}

const AccountRow: React.FC<{ account: Account; depth: number; onEdit: (a: Account) => void; onDelete: (a: Account) => void }> = ({ account, depth, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = (account.children?.length ?? 0) > 0;

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700">
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <span className="w-5" />}
            <span className="font-mono text-xs text-slate-500">{account.accountCode}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`font-medium text-sm ${account.isGroup ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
            {account.accountName}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[account.accountType] ?? 'bg-slate-100 text-slate-600'}`}>
            {account.accountType}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-slate-500">{account.accountGroup}</td>
        <td className="px-4 py-3 text-right font-mono text-sm text-slate-700">
          {account.isGroup ? '—' : `₹${account.currentBalance.toLocaleString('en-IN')}`}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(account)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
              <Edit size={13} />
            </button>
            {!account.isSystemAccount && (
              <button onClick={() => onDelete(account)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && hasChildren && account.children!.map(child => (
        <AccountRow key={child.id} account={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  );
};

const AccountModal: React.FC<{
  account?: Account | null; accounts: Account[]; onClose: () => void; onSave: () => void;
}> = ({ account, accounts, onClose, onSave }) => {
  const { showNotification } = useNotifications();
  const companyId = getCompanyId();
  const [form, setForm] = useState({
    accountCode: account?.accountCode ?? '',
    accountName: account?.accountName ?? '',
    accountType: account?.accountType ?? 'Asset',
    accountGroup: account?.accountGroup ?? '',
    parentAccountCode: account?.parentAccountCode ?? '',
    isGroup: account?.isGroup ?? false,
    openingBalance: account?.openingBalance ?? 0,
    openingBalanceType: account?.openingBalanceType ?? 'Debit',
    isBankAccount: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.accountCode || !form.accountName) {
      showNotification({ type: 'warning', title: 'Validation', message: 'Account code and name are required', duration: 3000 });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, companyId, level: 1 };
      const res = account
        ? await accountsApi.updateAccount(account.id, payload)
        : await accountsApi.createAccount(payload);
      if (res.success) {
        showNotification({ type: 'success', title: 'Saved', message: `Account ${account ? 'updated' : 'created'} successfully`, duration: 3000 });
        onSave();
      } else {
        showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed to save', duration: 3000 });
      }
    } finally { setSaving(false); }
  };

  const flatAccounts = accounts.filter(a => a.isGroup);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{account ? 'Edit Account' : 'New Account'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Code *</label>
              <input value={form.accountCode} onChange={e => set('accountCode', e.target.value)} disabled={!!account}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Name *</label>
              <input value={form.accountName} onChange={e => set('accountName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Type</label>
              <select value={form.accountType} onChange={e => set('accountType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
                {['Asset', 'Liability', 'Equity', 'Income', 'Expense'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Group</label>
              <input value={form.accountGroup} onChange={e => set('accountGroup', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Account</label>
            <select value={form.parentAccountCode} onChange={e => set('parentAccountCode', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option value="">— None (Root) —</option>
              {flatAccounts.map(a => <option key={a.id} value={a.accountCode}>{a.accountCode} — {a.accountName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Opening Balance</label>
              <input type="number" value={form.openingBalance} onChange={e => set('openingBalance', +e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Balance Type</label>
              <select value={form.openingBalanceType} onChange={e => set('openingBalanceType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option>Debit</option><option>Credit</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isGroup} onChange={e => set('isGroup', e.target.checked)} className="rounded" />
              <span className="text-sm text-slate-700">Is Group Account</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isBankAccount} onChange={e => set('isBankAccount', e.target.checked)} className="rounded" />
              <span className="text-sm text-slate-700">Is Bank Account</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-100 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-10 rounded-xl bg-[#002147] text-white text-sm font-semibold hover:bg-[#003366] transition disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <RefreshCw size={13} className="animate-spin" />} {account ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ChartOfAccountsPage: React.FC = () => {
  const { showNotification } = useNotifications();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tree, setTree] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const companyId = getCompanyId();

  const load = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getChart(companyId);
      if (res.success && res.data) {
        const flat = res.data as Account[];
        setAccounts(flat);
        setTree(buildTree(flat));
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { if (companyId) load(); }, [companyId]);

  const handleDelete = async (account: Account) => {
    if (!confirm(`Delete "${account.accountName}"?`)) return;
    const res = await accountsApi.deleteAccount(account.id);
    if (res.success) { showNotification({ type: 'success', title: 'Deleted', message: 'Account deleted', duration: 3000 }); load(); }
    else showNotification({ type: 'error', title: 'Error', message: res.message || 'Cannot delete', duration: 3000 });
  };

  const filtered = search
    ? accounts.filter(a => a.accountName.toLowerCase().includes(search.toLowerCase()) || a.accountCode.includes(search))
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">Hierarchical account structure for double-entry bookkeeping</p>
        </div>
        <Button onClick={() => { setEditAccount(null); setShowModal(true); }}
          className="bg-[#002147] text-white px-6 h-10 rounded-xl shadow-lg" leftIcon={<Plus size={14} />}>
          New Account
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw size={20} className="animate-spin mr-2" /> Loading accounts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#002147] text-white text-xs uppercase">
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Account Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Group</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr></thead>
              <tbody>
                {filtered
                  ? filtered.map(a => <AccountRow key={a.id} account={a} depth={0} onEdit={acc => { setEditAccount(acc); setShowModal(true); }} onDelete={handleDelete} />)
                  : tree.map(a => <AccountRow key={a.id} account={a} depth={0} onEdit={acc => { setEditAccount(acc); setShowModal(true); }} onDelete={handleDelete} />)
                }
              </tbody>
            </table>
            {accounts.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="font-medium">No accounts found</p>
                <p className="text-xs mt-1">Create a new company to auto-initialize the default chart of accounts</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <AccountModal
            account={editAccount}
            accounts={accounts}
            onClose={() => setShowModal(false)}
            onSave={() => { setShowModal(false); load(); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChartOfAccountsPage;
