import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Eye, FileText, BarChart3, MapPin, Settings2, Package, Tag } from "lucide-react";
import "./InventoryReportsPage.css";

interface Report {
  id: string;
  name: string;
  icon: React.ReactNode;
  filters: FilterField[];
}

interface FilterField {
  key: string;
  label: string;
  type: "text" | "date" | "select";
  options?: string[];
}

const WAREHOUSES = ["Main Warehouse", "West Coast Hub", "Central Distribution", "South Export Terminal", "East Logistics Center"];
const CATEGORIES = ["Electronics", "Apparel", "Furniture", "Accessories", "Appliances"];
const PRODUCTS   = ["Premium Wireless Headphones", "Smart Fitness Tracker", "4K Ultra HD Monitor", "Ergonomic Office Chair"];

const REPORTS: Report[] = [
  {
    id: "inventory-valuation",
    name: "Inventory Valuation",
    icon: <BarChart3 size={16} />,
    filters: [
      { key: "warehouse", label: "Warehouse", type: "select", options: WAREHOUSES },
      { key: "category",  label: "Category",  type: "select", options: CATEGORIES },
      { key: "date_from", label: "Date From",  type: "date" },
      { key: "date_to",   label: "Date To",    type: "date" },
    ],
  },
  {
    id: "inventory-movement",
    name: "Inventory Movement Analysis",
    icon: <BarChart3 size={16} />,
    filters: [
      { key: "product",   label: "Product",    type: "select", options: PRODUCTS },
      { key: "warehouse", label: "Warehouse",  type: "select", options: WAREHOUSES },
      { key: "date_from", label: "Date From",  type: "date" },
      { key: "date_to",   label: "Date To",    type: "date" },
    ],
  },
  {
    id: "inventory-transactions",
    name: "Inventory Transactions",
    icon: <FileText size={16} />,
    filters: [
      { key: "product",      label: "Product",         type: "select", options: PRODUCTS },
      { key: "warehouse",    label: "Warehouse",       type: "select", options: WAREHOUSES },
      { key: "txn_type",     label: "Transaction Type",type: "select", options: ["All","Stock In","Stock Out","Transfer","Adjustment"] },
      { key: "date_from",    label: "Date From",       type: "date" },
      { key: "date_to",      label: "Date To",         type: "date" },
    ],
  },
  {
    id: "inventory-by-location",
    name: "Inventory by Location",
    icon: <MapPin size={16} />,
    filters: [
      { key: "warehouse", label: "Warehouse", type: "select", options: WAREHOUSES },
      { key: "category",  label: "Category",  type: "select", options: CATEGORIES },
      { key: "product",   label: "Product",   type: "select", options: PRODUCTS },
    ],
  },
  {
    id: "inventory-adjustment",
    name: "Inventory Adjustment Summary",
    icon: <Settings2 size={16} />,
    filters: [
      { key: "warehouse",  label: "Warehouse",      type: "select", options: WAREHOUSES },
      { key: "adj_type",   label: "Adjustment Type",type: "select", options: ["All","Addition","Subtraction"] },
      { key: "date_from",  label: "Date From",      type: "date" },
      { key: "date_to",    label: "Date To",        type: "date" },
    ],
  },
  {
    id: "stock-aging",
    name: "Products in Stock Aging Report",
    icon: <Package size={16} />,
    filters: [
      { key: "warehouse",  label: "Warehouse",   type: "select", options: WAREHOUSES },
      { key: "category",   label: "Category",    type: "select", options: CATEGORIES },
      { key: "aging_days", label: "Aging (Days)", type: "select", options: ["30","60","90","120","180","365"] },
      { key: "date_from",  label: "As of Date",  type: "date" },
    ],
  },
  {
    id: "tag-reports",
    name: "Tag Reports",
    icon: <Tag size={16} />,
    filters: [
      { key: "tag",       label: "Tag / Label",  type: "text" },
      { key: "product",   label: "Product",      type: "select", options: PRODUCTS },
      { key: "date_from", label: "Date From",    type: "date" },
      { key: "date_to",   label: "Date To",      type: "date" },
    ],
  },
];

const fieldCls = "w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

const ReportPanel: React.FC<{ report: Report }> = ({ report }) => {
  const initValues = () => Object.fromEntries(report.filters.map(f => [f.key, ""]));
  const [values, setValues] = useState<Record<string, string>>(initValues);
  const set = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }));
  const hasFilters = Object.values(values).some(v => v !== "");

  return (
    <motion.div key={report.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">{report.icon}</div>
          <h2 className="font-bold text-slate-800 text-sm">{report.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Upload size={13} /> Upload
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Download size={13} /> Download
          </button>
          <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition">
            <Eye size={13} /> Show
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1">
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {report.filters.map((f, idx) => {
            const isLast = idx === report.filters.length - 1;
            return (
              <div key={f.key} className={`flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 ${!isLast ? "border-b border-slate-100" : ""} bg-white hover:bg-slate-50/40 transition-colors`}>
                <span className="text-xs font-semibold text-slate-600 w-full sm:w-40 flex-shrink-0">{f.label}</span>
                <div className="flex-1">
                  {f.type === "select" ? (
                    <select className={fieldCls} value={values[f.key]} onChange={e => set(f.key, e.target.value)}>
                      <option value="">— Select —</option>
                      {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "date" ? (
                    <input type="date" className={fieldCls} value={values[f.key]} onChange={e => set(f.key, e.target.value)} />
                  ) : (
                    <input type="text" className={fieldCls} placeholder={`Enter ${f.label.toLowerCase()}…`} value={values[f.key]} onChange={e => set(f.key, e.target.value)} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-5">
          {hasFilters ? (
            <button onClick={() => setValues(initValues())} className="text-xs text-slate-400 hover:text-rose-500 transition font-medium">
              Clear filters
            </button>
          ) : <span />}
          <button className="flex items-center gap-2 h-9 px-5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition">
            <Eye size={14} /> Generate Report
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
          <div className="p-3 bg-slate-100 rounded-xl text-slate-400 mb-3">{report.icon}</div>
          <p className="text-sm font-semibold text-slate-500">Set filters and click <span className="text-indigo-600">Generate Report</span></p>
          <p className="text-xs text-slate-400 mt-1">Report data will appear here</p>
        </div>
      </div>
    </motion.div>
  );
};

export const InventoryReportsPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(REPORTS[0].id);
  const activeReport = REPORTS.find(r => r.id === activeId)!;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Reports</h1>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
          <Download size={14} /> Export Summary
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" style={{ minHeight: '600px', maxHeight: '80vh' }}>

        <div className="report-sidebar">
          <div className="report-sidebar-header">
            <p className="report-sidebar-title">Report Type</p>
          </div>
          <div className="report-nav">
            <nav className="report-nav-list">
              {REPORTS.map(r => {
                const isActive = activeId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveId(r.id)}
                    className={`report-item ${isActive ? 'report-item-active' : ''}`}
                  >
                    <span className="report-item-icon">{r.icon}</span>
                    <span className="report-item-text">{r.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <ReportPanel key={activeId} report={activeReport} />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InventoryReportsPage;
