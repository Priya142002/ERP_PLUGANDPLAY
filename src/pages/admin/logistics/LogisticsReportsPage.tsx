import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Eye, FileText, TrendingUp, Truck, Package, MapPin } from 'lucide-react';
import '../../../pages/admin/reports/InventoryReportsPage.css';
import '../../../styles/admin-mobile.css';

interface FilterField { key: string; label: string; type: "text" | "date" | "select"; options?: string[]; }
interface Report { id: string; name: string; icon: React.ReactNode; filters: FilterField[]; }

const CARRIERS = ["Global Logistics Inc.", "Swift Express Co.", "Oceanic Freight", "FastTrack Delivery"];
const ZONES = ["Zone A-1", "Zone A-2", "Zone B-1", "Zone B-2", "Zone C-1"];
const STATUSES = ["Pending", "Dispatched", "Delivered", "Returned"];

const REPORTS: Report[] = [
  {
    id: "shipment-summary",
    name: "Shipment Summary",
    icon: <Package size={16} />,
    filters: [
      { key: "status", label: "Status", type: "select", options: STATUSES },
      { key: "zone", label: "Zone", type: "select", options: ZONES },
      { key: "date_from", label: "Date From", type: "date" },
      { key: "date_to", label: "Date To", type: "date" },
    ],
  },
  {
    id: "delivery-performance",
    name: "Delivery Performance",
    icon: <TrendingUp size={16} />,
    filters: [
      { key: "carrier", label: "Carrier", type: "select", options: CARRIERS },
      { key: "zone", label: "Zone", type: "select", options: ZONES },
      { key: "date_from", label: "Date From", type: "date" },
      { key: "date_to", label: "Date To", type: "date" },
    ],
  },
  {
    id: "returns-analysis",
    name: "Returns Analysis",
    icon: <FileText size={16} />,
    filters: [
      { key: "reason", label: "Return Reason", type: "text" },
      { key: "date_from", label: "Date From", type: "date" },
      { key: "date_to", label: "Date To", type: "date" },
    ],
  },
  {
    id: "carrier-performance",
    name: "Carrier Performance",
    icon: <Truck size={16} />,
    filters: [
      { key: "carrier", label: "Carrier", type: "select", options: CARRIERS },
      { key: "date_from", label: "Date From", type: "date" },
      { key: "date_to", label: "Date To", type: "date" },
    ],
  },
  {
    id: "zone-analysis",
    name: "Zone Analysis",
    icon: <MapPin size={16} />,
    filters: [
      { key: "zone", label: "Zone", type: "select", options: ZONES },
      { key: "date_from", label: "Date From", type: "date" },
      { key: "date_to", label: "Date To", type: "date" },
    ],
  },
  {
    id: "monthly-logistics",
    name: "Monthly Logistics Report",
    icon: <FileText size={16} />,
    filters: [
      { key: "year", label: "Year", type: "select", options: ["2024", "2025", "2026"] },
      { key: "month", label: "Month", type: "select", options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
    ],
  },
];

const fieldCls = "w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

const ReportPanel: React.FC<{ report: Report }> = ({ report }) => {
  const init = () => Object.fromEntries(report.filters.flatMap(f => [[f.key, ""]]));
  const [values, setValues] = useState<Record<string, string>>(init);
  const set = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }));
  const hasFilters = Object.values(values).some(v => v !== "");

  return (
    <motion.div key={report.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">{report.icon}</div>
          <h2 className="font-bold text-slate-800 text-sm">{report.name}</h2>
        </div>
        <div className="flex items-center gap-2 reports-actions">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Upload size={13} /> Upload</button>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Download size={13} /> Download</button>
          <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={13} /> Show</button>
        </div>
      </div>
      <div className="p-6 flex-1">
        <div className="grid grid-cols-1 mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Filters & Parameters</p>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white reports-filters">
          {report.filters.map((f, idx) => {
            const isLast = idx === report.filters.length - 1;
            const renderField = (key: string) => f.type === "select"
              ? <select className={fieldCls} value={values[key]} onChange={e => set(key, e.target.value)}><option value="">— Select —</option>{f.options?.map(o => <option key={o} value={o}>{o}</option>)}</select>
              : f.type === "date"
                ? <input type="date" className={fieldCls} value={values[key]} onChange={e => set(key, e.target.value)} />
                : <input type="text" className={fieldCls} placeholder={`Enter ${f.label.toLowerCase()}…`} value={values[key]} onChange={e => set(key, e.target.value)} />;
            return (
              <div key={f.key} className={`flex items-center gap-3 px-5 py-3 ${!isLast ? "border-b border-slate-100" : ""} bg-slate-50/20`}>
                <span className="text-xs font-semibold text-slate-700 min-w-[150px]">{f.label}</span>
                <div className="flex-1 max-w-md">{renderField(f.key)}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-5 reports-actions">
          {hasFilters ? <button onClick={() => setValues(init())} className="text-xs text-slate-400 hover:text-rose-500 transition font-medium">Clear filters</button> : <span />}
          <button className="flex items-center gap-2 h-9 px-5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={14} /> Generate Report</button>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
          <div className="p-3 bg-slate-100 rounded-xl text-slate-400 mb-3">{report.icon}</div>
          <p className="text-sm font-semibold text-slate-500">Set filters and click <span className="text-indigo-600">Generate Report</span></p>
          <p className="text-xs text-slate-400 mt-1">Report data will appear here</p>
        </div>
      </div>
    </motion.div>
  );
};

export const LogisticsReportsPage: React.FC = () => {
  const [activeId, setActiveId] = useState(REPORTS[0].id);
  const active = REPORTS.find(r => r.id === activeId)!;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Logistics Reports</h1>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"><Download size={14} /> Export Summary</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
        <div className="report-sidebar">
          <div className="report-sidebar-header">
            <p className="report-sidebar-title">Report Type</p>
          </div>
          <div className="report-nav">
            <nav className="report-nav-list">
              {REPORTS.map(r => {
                const isActive = activeId === r.id;
                return (
                  <button key={r.id} onClick={() => setActiveId(r.id)}
                    className={`report-item ${isActive ? 'report-item-active' : ''}`}>
                    <span className="report-item-icon">{r.icon}</span>
                    <span className="report-item-text">{r.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <ReportPanel key={activeId} report={active} />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LogisticsReportsPage;
