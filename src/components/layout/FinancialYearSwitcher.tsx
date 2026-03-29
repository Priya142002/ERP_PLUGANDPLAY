import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, ArrowRight, CheckCircle, RefreshCw, AlertTriangle, Users, Package, BookOpen, ShoppingCart } from 'lucide-react';
import { accountsApi } from '../../services/api';
import { useNotifications } from '../../context/AppContext';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCompanyId = (): number => {
  try {
    const raw = localStorage.getItem('erp_user') || sessionStorage.getItem('erp_user');
    if (raw) return JSON.parse(raw).companyId as number;
  } catch { /* ignore */ }
  return 0;
};

const getStoredFYId = (): number => {
  try { return parseInt(localStorage.getItem('active_fy_id') || '0'); } catch { return 0; }
};

const setStoredFYId = (id: number, name: string, fyCode?: string) => {
  localStorage.setItem('active_fy_id', String(id));
  localStorage.setItem('active_fy_name', name);
  if (fyCode) localStorage.setItem('active_fy_code', fyCode);
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface FY {
  id: number;
  fyCode: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
}

interface WizardProps {
  currentYear: FY;
  onClose: () => void;
  onComplete: (newYearId: number, newYearName: string, newFYCode: string) => void;
}

// ── Year-End Wizard ───────────────────────────────────────────────────────────
const YearEndWizard: React.FC<WizardProps> = ({ currentYear, onClose, onComplete }) => {
  const { showNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [newYearName, setNewYearName] = useState(() => {
    const start = new Date(currentYear.endDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    return `FY ${start.getFullYear()}-${String(end.getFullYear()).slice(-2)}`;
  });
  const [carryForward, setCarryForward] = useState({
    vendors: true, customers: true, products: true, accounts: true,
  });

  const toggle = (key: keyof typeof carryForward) =>
    setCarryForward(p => ({ ...p, [key]: !p[key] }));

  const handleYearEndClose = async () => {
    setSaving(true);
    try {
      const res = await accountsApi.yearEndClose(currentYear.id, {
        newYearName,
        carryForwardVendors:   carryForward.vendors,
        carryForwardCustomers: carryForward.customers,
        carryForwardProducts:  carryForward.products,
        carryForwardAccounts:  carryForward.accounts,
      });
      if (res.success) {
        setResult(res.data);
        setStep(4);
      } else {
        showNotification({ type: 'error', title: 'Error', message: res.message || 'Year-end close failed', duration: 4000 });
        setStep(2);
      }
    } catch {
      showNotification({ type: 'error', title: 'Error', message: 'Network error. Please try again.', duration: 3000 });
      setStep(2);
    } finally {
      setSaving(false);
    }
  };

  const carryItems = [
    { key: 'vendors'   as const, icon: ShoppingCart, label: 'Vendors',   desc: 'All supplier records carry forward automatically' },
    { key: 'customers' as const, icon: Users,        label: 'Customers', desc: 'All customer records carry forward automatically' },
    { key: 'products'  as const, icon: Package,      label: 'Products',  desc: 'Inventory items carry forward automatically' },
    { key: 'accounts'  as const, icon: BookOpen,     label: 'Accounts',  desc: 'Chart of accounts + opening balances carried forward' },
  ];

  const stepLabels = ['Review', 'Carry Forward', 'Processing', 'Complete'];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget && step !== 3) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#002147] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Financial Year Change</h2>
              <p className="text-white/60 text-xs mt-0.5">{stepLabels[step - 1]}</p>
            </div>
          </div>
          {/* Step progress */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Confirm */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">You are about to close the financial year</p>
                  <p className="text-xs text-amber-700 mt-1">
                    This will lock all transactions in the current year and create a new financial year. This cannot be undone.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Closing Year</p>
                  <p className="font-bold text-slate-800 text-sm">{currentYear.yearName}</p>
                  {currentYear.fyCode && (
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{currentYear.fyCode}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(currentYear.startDate).toLocaleDateString('en-IN')} →{' '}
                    {new Date(currentYear.endDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">New Year Name</p>
                  <input
                    value={newYearName}
                    onChange={e => setNewYearName(e.target.value)}
                    className="font-bold text-blue-800 bg-transparent border-none outline-none w-full text-sm"
                  />
                  <p className="text-[10px] text-blue-400 mt-1">Click to edit</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <p className="font-bold text-slate-700 text-xs uppercase tracking-wider">What happens automatically:</p>
                {[
                  'Current year is locked — no new transactions allowed',
                  'Balance Sheet accounts carry forward as opening balances',
                  'Net Profit/Loss transferred to Retained Earnings (3200)',
                  'New FY Code generated for the new year',
                  'New financial year becomes active immediately',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Carry Forward */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-4">
                All master data is <span className="font-bold text-slate-800">company-scoped</span> and always available in every year. Confirm your preferences:
              </p>
              {carryItems.map(({ key, icon: Icon, label, desc }) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    carryForward[key] ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    carryForward[key] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${carryForward[key] ? 'text-emerald-800' : 'text-slate-600'}`}>{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    carryForward[key] ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                  }`}>
                    {carryForward[key] && <CheckCircle size={12} className="text-white" />}
                  </div>
                </button>
              ))}
              <p className="text-xs text-slate-400 italic mt-2">
                Note: Income & Expense accounts reset to zero in the new year (standard accounting practice).
              </p>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <RefreshCw size={28} className="text-blue-600 animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800">Processing Year-End Close</p>
                <p className="text-sm text-slate-500 mt-1">Calculating balances and creating new year...</p>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && result && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-lg">Year-End Close Complete!</p>
                  <p className="text-sm text-slate-500 mt-1">New financial year is now active</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Closed Year',        value: result.closedYearName },
                  { label: 'New Active Year',     value: result.newYearName },
                  { label: 'New FY Code',         value: result.newYearFYCode || '—' },
                  { label: 'Balances Carried',    value: `${result.openingBalancesCarriedForward} accounts` },
                  { label: 'Net P&L Transferred', value: `₹${Math.abs(result.netProfitTransferred || 0).toLocaleString('en-IN')}` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                    <p className="font-bold text-slate-800 mt-1 text-sm font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step === 1 && (
            <>
              <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl bg-[#002147] text-white text-sm font-bold hover:bg-[#003366] transition flex items-center justify-center gap-2">
                Continue <ArrowRight size={14} />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                Back
              </button>
              <button
                disabled={saving}
                onClick={() => { setStep(3); handleYearEndClose(); }}
                className="flex-1 h-11 rounded-xl bg-[#002147] text-white text-sm font-bold hover:bg-[#003366] transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                Close Year & Create New <ArrowRight size={14} />
              </button>
            </>
          )}
          {step === 4 && result && (
            <button
              onClick={() => { onComplete(result.newYearId, result.newYearName, result.newYearFYCode || ''); onClose(); }}
              className="w-full h-11 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle size={14} /> Switch to New Year & Continue
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Switcher ─────────────────────────────────────────────────────────────
export const FinancialYearSwitcher: React.FC = () => {
  const { showNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState<FY[]>([]);
  const [activeYear, setActiveYear] = useState<FY | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const companyId = getCompanyId();

  const load = async () => {
    if (!companyId) return;
    const res = await accountsApi.getFinancialYears(companyId);
    if (res.success && res.data) {
      const list = res.data as FY[];
      setYears(list);
      const storedId = getStoredFYId();
      const active = list.find(y => y.id === storedId) || list.find(y => y.isActive) || list[0];
      if (active) {
        setActiveYear(active);
        setStoredFYId(active.id, active.yearName, active.fyCode);
      }
    }
  };

  useEffect(() => { load(); }, [companyId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitch = async (year: FY) => {
    if (year.id === activeYear?.id) { setOpen(false); return; }
    setSwitching(true);
    try {
      const res = await accountsApi.setActiveFinancialYear(year.id);
      if (res.success) {
        setActiveYear(year);
        setStoredFYId(year.id, year.yearName, year.fyCode);
        setOpen(false);
        showNotification({ type: 'success', title: 'Year Switched', message: `Now working in ${year.yearName} (${year.fyCode})`, duration: 3000 });
        setTimeout(() => window.location.reload(), 800);
      }
    } finally {
      setSwitching(false);
    }
  };

  const handleWizardComplete = (newYearId: number, newYearName: string, newFYCode: string) => {
    setStoredFYId(newYearId, newYearName, newFYCode);
    showNotification({ type: 'success', title: 'New Year Active', message: `${newYearName} (${newFYCode}) is now active`, duration: 3000 });
    load();
    setTimeout(() => window.location.reload(), 800);
  };

  // Warn if within 30 days of year end
  const isNearYearEnd = () => {
    if (!activeYear) return false;
    const daysLeft = Math.ceil((new Date(activeYear.endDate).getTime() - Date.now()) / 86400000);
    return daysLeft <= 30 && daysLeft >= 0;
  };

  if (!activeYear) return null;

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          title={activeYear.fyCode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
            isNearYearEnd()
              ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
          }`}
        >
          <Calendar size={13} className={isNearYearEnd() ? 'text-amber-500' : 'text-blue-500'} />
          <span className="hidden sm:inline">{activeYear.yearName}</span>
          <span className="sm:hidden">FY</span>
          {isNearYearEnd() && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]"
            >
              {/* Dropdown header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Financial Year</p>
                <p className="text-xs text-slate-500 mt-0.5">Select active year or close current year</p>
              </div>

              {/* Year list */}
              <div className="max-h-56 overflow-y-auto py-1">
                {years.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No financial years found</p>
                )}
                {years.map(year => (
                  <button
                    key={year.id}
                    onClick={() => !year.isClosed && !switching && handleSwitch(year)}
                    disabled={year.isClosed || switching}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left ${
                      year.id === activeYear.id
                        ? 'bg-blue-50'
                        : year.isClosed
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      year.id === activeYear.id
                        ? 'bg-[#002147] text-white'
                        : year.isClosed
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {year.isClosed ? '🔒' : year.id === activeYear.id ? '✓' : '○'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${year.id === activeYear.id ? 'text-blue-700' : 'text-slate-700'}`}>
                        {year.yearName}
                      </p>
                      {year.fyCode && (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-wider">{year.fyCode}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(year.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {' → '}
                        {new Date(year.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Badge */}
                    {year.isClosed && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full flex-shrink-0">CLOSED</span>
                    )}
                    {year.id === activeYear.id && !year.isClosed && (
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer action */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                <button
                  onClick={() => { setOpen(false); setShowWizard(true); }}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"
                >
                  <ArrowRight size={13} /> Close Year & Start New Year
                </button>
                {isNearYearEnd() && (
                  <p className="text-[10px] text-amber-600 text-center font-semibold">
                    ⚠ Current year ends soon — consider closing
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Year-End Wizard */}
      <AnimatePresence>
        {showWizard && activeYear && (
          <YearEndWizard
            currentYear={activeYear}
            onClose={() => setShowWizard(false)}
            onComplete={handleWizardComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FinancialYearSwitcher;
