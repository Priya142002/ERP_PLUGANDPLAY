import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Briefcase, TrendingUp, Calculator, Layers, RefreshCw } from "lucide-react";
import { accountsApi } from "../../../services/api";
import { useNotifications } from "../../../context/AppContext";
import "./InventoryReportsPage.css";

const getCompanyId = () => {
  try {
    const raw = localStorage.getItem('erp_user') || sessionStorage.getItem('erp_user');
    if (raw) return JSON.parse(raw).companyId as number;
  } catch { /* ignore */ }
  return 0;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

// ── Trial Balance ─────────────────────────────────────────────────────────────
const TrialBalanceReport: React.FC = () => {
  const { showNotification } = useNotifications();
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [fyId, setFyId] = useState<number>(0);
  const [financialYears, setFinancialYears] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  useEffect(() => {
    if (!companyId) return;
    accountsApi.getFinancialYears(companyId).then(r => {
      if (r.success && r.data) {
        setFinancialYears(r.data);
        const active = r.data.find((f: any) => f.isActive);
        if (active) setFyId(active.id);
      }
    });
  }, [companyId]);

  const generate = useCallback(async () => {
    if (!fyId) { showNotification({ type: 'warning', title: 'Select Financial Year', message: 'Please select a financial year', duration: 3000 }); return; }
    setLoading(true);
    try {
      const res = await accountsApi.getTrialBalance(companyId, fyId, asOnDate);
      if (res.success) setData(res.data);
      else showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed to generate report', duration: 3000 });
    } finally { setLoading(false); }
  }, [companyId, fyId, asOnDate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Financial Year</label>
          <select value={fyId} onChange={e => setFyId(+e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value={0}>— Select —</option>
            {financialYears.map((fy: any) => <option key={fy.id} value={fy.id}>{fy.yearName}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">As On Date</label>
          <input type="date" value={asOnDate} onChange={e => setAsOnDate(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="flex items-end">
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition disabled:opacity-60">
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Eye size={13} />} Generate
          </button>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">Trial Balance — As on {new Date(data.asOnDate).toLocaleDateString('en-IN')}</h3>
            <div className="flex gap-4 text-sm font-bold">
              <span className="text-blue-600">Total Debit: {fmt(data.totalDebit)}</span>
              <span className="text-rose-600">Total Credit: {fmt(data.totalCredit)}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#002147] text-white text-xs uppercase">
                <th className="px-6 py-3 text-left">Account Code</th>
                <th className="px-6 py-3 text-left">Account Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-right">Debit</th>
                <th className="px-6 py-3 text-right">Credit</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {data.items?.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{item.accountCode}</td>
                    <td className="px-6 py-3 font-medium text-slate-800">{item.accountName}</td>
                    <td className="px-6 py-3 text-xs text-slate-500">{item.accountType}</td>
                    <td className="px-6 py-3 text-right font-mono text-blue-700">{item.debit > 0 ? fmt(item.debit) : '—'}</td>
                    <td className="px-6 py-3 text-right font-mono text-rose-700">{item.credit > 0 ? fmt(item.credit) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-slate-100 font-bold text-sm">
                <td colSpan={3} className="px-6 py-3">Total</td>
                <td className="px-6 py-3 text-right text-blue-700">{fmt(data.totalDebit)}</td>
                <td className="px-6 py-3 text-right text-rose-700">{fmt(data.totalCredit)}</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Profit & Loss ─────────────────────────────────────────────────────────────
const ProfitLossReport: React.FC = () => {
  const { showNotification } = useNotifications();
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getProfitLoss(companyId, fromDate, toDate);
      if (res.success) setData(res.data);
      else showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed', duration: 3000 });
    } finally { setLoading(false); }
  }, [companyId, fromDate, toDate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        {[['From Date', fromDate, setFromDate], ['To Date', toDate, setToDate]].map(([label, val, setter]: any) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            <input type="date" value={val} onChange={e => setter(e.target.value)}
              className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
        <div className="flex items-end">
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition disabled:opacity-60">
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Eye size={13} />} Generate
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Income */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <h3 className="font-bold text-emerald-800">Income</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-50">
                {data.incomeLines?.map((l: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-700">{l.accountName}</td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-emerald-700">{fmt(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-emerald-50 font-bold">
                <td className="px-6 py-3 text-emerald-800">Total Income</td>
                <td className="px-6 py-3 text-right text-emerald-800">{fmt(data.totalIncome)}</td>
              </tr></tfoot>
            </table>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-rose-50 border-b border-rose-100">
              <h3 className="font-bold text-rose-800">Expenses</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-50">
                {data.expenseLines?.map((l: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-700">{l.accountName}</td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-rose-700">{fmt(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-rose-50 font-bold">
                <td className="px-6 py-3 text-rose-800">Total Expenses</td>
                <td className="px-6 py-3 text-right text-rose-800">{fmt(data.totalExpense)}</td>
              </tr></tfoot>
            </table>
          </div>

          {/* Net Profit Summary */}
          <div className={`lg:col-span-2 p-6 rounded-xl border-2 ${data.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-800">Net {data.netProfit >= 0 ? 'Profit' : 'Loss'}</span>
              <span className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{fmt(Math.abs(data.netProfit))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Balance Sheet ─────────────────────────────────────────────────────────────
const BalanceSheetReport: React.FC = () => {
  const { showNotification } = useNotifications();
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountsApi.getBalanceSheet(companyId, asOnDate);
      if (res.success) setData(res.data);
      else showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed', duration: 3000 });
    } finally { setLoading(false); }
  }, [companyId, asOnDate]);

  const Section = ({ title, items, color }: { title: string; items: any[]; color: string }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className={`px-6 py-4 border-b ${color}`}><h3 className="font-bold">{title}</h3></div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-50">
          {items?.map((l: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-6 py-3 text-slate-500 text-xs font-mono">{l.accountCode}</td>
              <td className="px-6 py-3 text-slate-700">{l.accountName}</td>
              <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">{fmt(l.balance)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr className="bg-slate-50 font-bold">
          <td colSpan={2} className="px-6 py-3">Total {title}</td>
          <td className="px-6 py-3 text-right">{fmt(items?.reduce((s: number, l: any) => s + l.balance, 0) ?? 0)}</td>
        </tr></tfoot>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">As On Date</label>
          <input type="date" value={asOnDate} onChange={e => setAsOnDate(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="flex items-end">
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition disabled:opacity-60">
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Eye size={13} />} Generate
          </button>
        </div>
      </div>

      {data && (
        <div className="space-y-5">
          <Section title="Assets" items={data.assets} color="bg-blue-50 border-blue-100 text-blue-800" />
          <Section title="Liabilities" items={data.liabilities} color="bg-rose-50 border-rose-100 text-rose-800" />
          <Section title="Equity" items={data.equity} color="bg-purple-50 border-purple-100 text-purple-800" />
          <div className={`p-5 rounded-xl border-2 ${Math.abs(data.totalAssets - data.totalLiabilitiesAndEquity) < 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex justify-between text-sm font-bold">
              <span>Total Assets: {fmt(data.totalAssets)}</span>
              <span>Total Liabilities + Equity: {fmt(data.totalLiabilitiesAndEquity)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── General Ledger ────────────────────────────────────────────────────────────
const GeneralLedgerReport: React.FC = () => {
  const { showNotification } = useNotifications();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState<number>(0);
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  useEffect(() => {
    if (!companyId) return;
    accountsApi.getChart(companyId).then(r => {
      if (r.success && r.data) setAccounts((r.data as any[]).filter((a: any) => !a.isGroup));
    });
  }, [companyId]);

  const generate = useCallback(async () => {
    if (!accountId) { showNotification({ type: 'warning', title: 'Select Account', message: 'Please select an account', duration: 3000 }); return; }
    setLoading(true);
    try {
      const res = await accountsApi.getAccountLedger(accountId, fromDate, toDate);
      if (res.success) setData(res.data);
      else showNotification({ type: 'error', title: 'Error', message: res.message || 'Failed', duration: 3000 });
    } finally { setLoading(false); }
  }, [accountId, fromDate, toDate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Account</label>
          <select value={accountId} onChange={e => setAccountId(+e.target.value)}
            className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[200px]">
            <option value={0}>— Select Account —</option>
            {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.accountCode} — {a.accountName}</option>)}
          </select>
        </div>
        {[['From Date', fromDate, setFromDate], ['To Date', toDate, setToDate]].map(([label, val, setter]: any) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            <input type="date" value={val} onChange={e => setter(e.target.value)}
              className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
        <div className="flex items-end">
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 h-9 px-5 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition disabled:opacity-60">
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Eye size={13} />} Generate
          </button>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between">
            <div>
              <h3 className="font-bold text-slate-800">{data.accountName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Opening Balance: {fmt(data.openingBalance)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Closing Balance</p>
              <p className="font-bold text-slate-800">{fmt(data.closingBalance)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#002147] text-white text-xs uppercase">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Voucher No</th>
                <th className="px-4 py-3 text-left">Narration</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Credit</th>
                <th className="px-4 py-3 text-right">Balance</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {data.entries?.map((e: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(e.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.voucherNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{e.narration || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-700">{e.debit > 0 ? fmt(e.debit) : '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-rose-700">{e.credit > 0 ? fmt(e.credit) : '—'}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{fmt(e.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const REPORTS = [
  { id: 'trial-balance',  label: 'Trial Balance',  icon: Calculator,  component: TrialBalanceReport },
  { id: 'profit-loss',    label: 'Profit & Loss',  icon: TrendingUp,  component: ProfitLossReport },
  { id: 'balance-sheet',  label: 'Balance Sheet',  icon: Briefcase,   component: BalanceSheetReport },
  { id: 'general-ledger', label: 'General Ledger', icon: Layers,      component: GeneralLedgerReport },
];

export const FinancialReportsPage: React.FC = () => {
  const [activeId, setActiveId] = useState('trial-balance');
  const active = REPORTS.find(r => r.id === activeId)!;
  const ActiveComponent = active.component;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="report-sidebar">
          <div className="report-sidebar-header">
            <p className="report-sidebar-title">Report Type</p>
          </div>
          <nav className="report-nav-list">
            {REPORTS.map(r => {
              const Icon = r.icon;
              return (
                <button key={r.id} onClick={() => setActiveId(r.id)}
                  className={`report-item ${activeId === r.id ? 'report-item-active' : ''}`}>
                  <span className="report-item-icon"><Icon size={16} /></span>
                  <span className="report-item-text">{r.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-slate-800 mb-4">{active.label}</h2>
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialReportsPage;
