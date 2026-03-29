import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, CheckCircle, RefreshCw, Search } from 'lucide-react';
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

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  Posted: 'success', Draft: 'warning', Cancelled: 'error',
};

export const JournalVoucherPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const companyId = getCompanyId();

  const load = async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getJournalVouchers(companyId, statusFilter || undefined);
      if (res.success && res.data) setVouchers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (companyId) load(); }, [companyId, statusFilter]);

  const handlePost = async (id: number) => {
    const res = await accountsApi.postJournalVoucher(id);
    if (res.success) { showNotification({ type: 'success', title: 'Posted', message: 'Voucher posted successfully', duration: 3000 }); load(); }
    else showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed', duration: 3000 });
  };

  const filtered = vouchers.filter(v =>
    !search || v.voucherNumber?.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Journal Vouchers</h1>
          <p className="text-sm text-slate-500 mt-1">All double-entry journal transactions</p>
        </div>
        <Button onClick={() => navigate('/admin/accounts/journal/create')}
          className="bg-[#002147] text-white px-6 h-10 rounded-xl shadow-lg" leftIcon={<Plus size={14} />}>
          New Voucher
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vouchers..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <div className="flex gap-1.5">
          {['', 'Draft', 'Posted', 'Cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition border ${statusFilter === s ? 'bg-[#002147] text-white border-[#002147]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw size={20} className="animate-spin mr-2" /> Loading...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-[#002147] text-white text-xs uppercase">
              <th className="px-6 py-3 text-left">Voucher No</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-right">Debit</th>
              <th className="px-6 py-3 text-right">Credit</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{v.voucherNumber}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{new Date(v.voucherDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{v.voucherType}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 max-w-xs truncate">{v.description}</td>
                  <td className="px-6 py-4 text-right font-mono text-blue-700">₹{v.totalDebit?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-mono text-rose-700">₹{v.totalCredit?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={STATUS_VARIANT[v.status] ?? 'info'} className="text-[10px]">{v.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setSelectedVoucher(v)} className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition" title="View">
                        <Eye size={13} />
                      </button>
                      {v.status === 'Draft' && (
                        <button onClick={() => handlePost(v.id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="Post">
                          <CheckCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="font-medium">No journal vouchers found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedVoucher(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-slate-800">{selectedVoucher.voucherNumber}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedVoucher.description}</p>
              </div>
              <button onClick={() => setSelectedVoucher(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                  <th className="px-4 py-2 text-left">Account</th>
                  <th className="px-4 py-2 text-center">Type</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left">Narration</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedVoucher.entries?.map((e: any, i: number) => (
                    <tr key={i} className={e.type === 'Debit' ? 'bg-blue-50/30' : 'bg-rose-50/30'}>
                      <td className="px-4 py-3 font-medium text-slate-800">{e.accountName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.type === 'Debit' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{e.type}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">₹{e.amount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{e.narration || '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="bg-slate-100 font-bold">
                  <td colSpan={2} className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right font-mono">₹{selectedVoucher.totalDebit?.toLocaleString('en-IN')}</td>
                  <td />
                </tr></tfoot>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default JournalVoucherPage;
