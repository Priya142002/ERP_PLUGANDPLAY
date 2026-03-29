import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { accountsApi } from '../../../services/api';
import { useNotifications } from '../../../context/AppContext';

const getCompanyId = () => {
  try {
    const raw = localStorage.getItem('erp_user') || sessionStorage.getItem('erp_user');
    if (raw) return JSON.parse(raw).companyId as number;
  } catch { /* ignore */ }
  return 0;
};

interface Entry { accountId: number; type: 'Debit' | 'Credit'; amount: number; narration: string; }

export const CreateJournalVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const companyId = getCompanyId();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [financialYears, setFinancialYears] = useState<any[]>([]);
  const [fyId, setFyId] = useState<number>(0);
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [entries, setEntries] = useState<Entry[]>([
    { accountId: 0, type: 'Debit', amount: 0, narration: '' },
    { accountId: 0, type: 'Credit', amount: 0, narration: '' },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    Promise.all([
      accountsApi.getChart(companyId),
      accountsApi.getFinancialYears(companyId),
    ]).then(([accRes, fyRes]) => {
      if (accRes.success && accRes.data) setAccounts((accRes.data as any[]).filter((a: any) => !a.isGroup));
      if (fyRes.success && fyRes.data) {
        setFinancialYears(fyRes.data);
        const active = fyRes.data.find((f: any) => f.isActive);
        if (active) setFyId(active.id);
      }
    });
  }, [companyId]);

  const totalDebit  = entries.filter(e => e.type === 'Debit').reduce((s, e) => s + e.amount, 0);
  const totalCredit = entries.filter(e => e.type === 'Credit').reduce((s, e) => s + e.amount, 0);
  const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const updateEntry = (i: number, field: keyof Entry, value: any) =>
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const addEntry = () => setEntries(prev => [...prev, { accountId: 0, type: 'Debit', amount: 0, narration: '' }]);
  const removeEntry = (i: number) => setEntries(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!fyId) { showNotification({ type: 'warning', title: 'Required', message: 'Select a financial year', duration: 3000 }); return; }
    if (!description) { showNotification({ type: 'warning', title: 'Required', message: 'Enter a description', duration: 3000 }); return; }
    if (!isBalanced) { showNotification({ type: 'error', title: 'Unbalanced', message: 'Total debit must equal total credit', duration: 3000 }); return; }

    setSaving(true);
    try {
      const res = await accountsApi.createJournalVoucher({
        companyId, financialYearId: fyId,
        voucherDate: new Date(voucherDate).toISOString(),
        description,
        entries: entries.map(e => ({ accountId: e.accountId, type: e.type, amount: e.amount, narration: e.narration })),
      });
      if (res.success) {
        showNotification({ type: 'success', title: 'Created', message: 'Journal voucher created successfully', duration: 3000 });
        navigate('/admin/accounts/journal');
      } else {
        showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed to create', duration: 3000 });
      }
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Journal Voucher</h1>
          <p className="text-sm text-slate-500 mt-0.5">Double-entry bookkeeping — debit must equal credit</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Financial Year *</label>
            <select value={fyId} onChange={e => setFyId(+e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
              <option value={0}>— Select —</option>
              {financialYears.map((fy: any) => <option key={fy.id} value={fy.id}>{fy.yearName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Voucher Date *</label>
            <input type="date" value={voucherDate} onChange={e => setVoucherDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description *</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Voucher description..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
        </div>

        {/* Entries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Journal Entries</h3>
            <button onClick={addEntry} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
              <Plus size={13} /> Add Line
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-4 py-3 text-left">Account</th>
                <th className="px-4 py-3 text-left w-28">Type</th>
                <th className="px-4 py-3 text-right w-36">Amount (₹)</th>
                <th className="px-4 py-3 text-left">Narration</th>
                <th className="px-4 py-3 w-10" />
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, i) => (
                  <tr key={i} className={entry.type === 'Debit' ? 'bg-blue-50/30' : 'bg-rose-50/30'}>
                    <td className="px-4 py-2">
                      <select value={entry.accountId} onChange={e => updateEntry(i, 'accountId', +e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white">
                        <option value={0}>— Select Account —</option>
                        {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.accountCode} — {a.accountName}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select value={entry.type} onChange={e => updateEntry(i, 'type', e.target.value as 'Debit' | 'Credit')}
                        className={`w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 outline-none font-semibold ${entry.type === 'Debit' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" min={0} step="0.01" value={entry.amount || ''}
                        onChange={e => updateEntry(i, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-right font-mono" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={entry.narration} onChange={e => updateEntry(i, 'narration', e.target.value)}
                        placeholder="Optional narration..."
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </td>
                    <td className="px-4 py-2">
                      {entries.length > 2 && (
                        <button onClick={() => removeEntry(i)} className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-sm border-t border-slate-200">
                  <td colSpan={2} className="px-4 py-3 text-slate-600">Totals</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-blue-700 font-mono">DR ₹{totalDebit.toLocaleString('en-IN')}</span>
                      <span className="text-rose-700 font-mono">CR ₹{totalCredit.toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                  <td colSpan={2} className="px-4 py-3">
                    {isBalanced
                      ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">✓ Balanced</span>
                      : <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">✗ Unbalanced</span>
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !isBalanced}
            className="bg-[#002147] text-white px-8 h-10 rounded-xl disabled:opacity-60">
            {saving && <RefreshCw size={13} className="animate-spin mr-2" />} Save Voucher
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateJournalVoucherPage;
