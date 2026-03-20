import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Eye, FileText, BarChart, Activity, PieChart } from "lucide-react";
import "../../../pages/admin/reports/InventoryReportsPage.css";

interface FilterField { key:string; label:string; type:"text"|"date"|"select"; options?:string[]; }
interface Report { id:string; name:string; icon:React.ReactNode; filters:FilterField[]; }

const WORK_CENTERS = ["Assembly Line A","Assembly Line B","Packaging","Quality Control","Finishing"];
const PRODUCTS     = ["Premium Wireless Headphones","Smart Fitness Tracker","4K Ultra HD Monitor","Ergonomic Office Chair"];
const SHIFTS       = ["Morning","Afternoon","Night"];

const REPORTS: Report[] = [
  { id:"daily-output",      name:"Daily Output Summary",    icon:<BarChart size={16}/>,   filters:[{key:"work_center",label:"Work Center",type:"select",options:WORK_CENTERS},{key:"shift",label:"Shift",type:"select",options:SHIFTS},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
  { id:"material-consumption",name:"Material Consumption",  icon:<Activity size={16}/>,   filters:[{key:"product",label:"Product",type:"select",options:PRODUCTS},{key:"work_center",label:"Work Center",type:"select",options:WORK_CENTERS},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
  { id:"production-cost",   name:"Production Cost Analysis",icon:<PieChart size={16}/>,   filters:[{key:"product",label:"Product",type:"select",options:PRODUCTS},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
  { id:"yield-waste",       name:"Yield & Waste Report",    icon:<FileText size={16}/>,   filters:[{key:"product",label:"Product",type:"select",options:PRODUCTS},{key:"work_center",label:"Work Center",type:"select",options:WORK_CENTERS},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
  { id:"production-order",  name:"Production Order Report", icon:<FileText size={16}/>,   filters:[{key:"product",label:"Product",type:"select",options:PRODUCTS},{key:"status",label:"Status",type:"select",options:["All","Planned","In Progress","Completed","Cancelled"]},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
  { id:"work-center-perf",  name:"Work Center Performance", icon:<BarChart size={16}/>,   filters:[{key:"work_center",label:"Work Center",type:"select",options:WORK_CENTERS},{key:"date_from",label:"Date From",type:"date"},{key:"date_to",label:"Date To",type:"date"}] },
];

const fieldCls = "w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

const ReportPanel: React.FC<{report:Report}> = ({report}) => {
  const init = () => Object.fromEntries(report.filters.flatMap(f=>[[f.key,""], [`${f.key}_to`,""]]));
  const [values, setValues] = useState<Record<string,string>>(init);
  const set = (k:string,v:string) => setValues(p=>({...p,[k]:v}));
  const hasFilters = Object.values(values).some(v=>v!=="");
  const renderField = (f:FilterField, key:string) => f.type==="select"
    ? <select className={fieldCls} value={values[key]} onChange={e=>set(key,e.target.value)}><option value="">— Select —</option>{f.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>
    : f.type==="date"
    ? <input type="date" className={fieldCls} value={values[key]} onChange={e=>set(key,e.target.value)}/>
    : <input type="text" className={fieldCls} placeholder={`Enter ${f.label.toLowerCase()}…`} value={values[key]} onChange={e=>set(key,e.target.value)}/>;

  return (
    <motion.div key={report.id} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">{report.icon}</div>
          <h2 className="font-bold text-slate-800 text-sm">{report.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Upload size={13}/> Upload</button>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Download size={13}/> Download</button>
          <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={13}/> Show</button>
        </div>
      </div>
      <div className="p-6 flex-1">
        <div className="grid grid-cols-2 gap-x-6 mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Value (From)</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Value (To)</p>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {report.filters.map((f,idx)=>(
            <div key={f.key} className={`grid grid-cols-2 gap-0 ${idx!==report.filters.length-1?"border-b border-slate-100":""}`}>
              <div className="flex items-center gap-3 px-5 py-3 border-r border-slate-100 bg-slate-50/40">
                <span className="text-xs font-semibold text-slate-700 min-w-[120px]">{f.label}</span>
                <div className="flex-1">{renderField(f, f.key)}</div>
              </div>
              <div className="flex items-center px-5 py-3">{renderField(f, `${f.key}_to`)}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-5">
          {hasFilters ? <button onClick={()=>setValues(init())} className="text-xs text-slate-400 hover:text-rose-500 transition font-medium">Clear filters</button> : <span/>}
          <button className="flex items-center gap-2 h-9 px-5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={14}/> Generate Report</button>
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

export const ProductionReportsPage: React.FC = () => {
  const [activeId, setActiveId] = useState(REPORTS[0].id);
  const active = REPORTS.find(r=>r.id===activeId)!;
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Reports</h1>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"><Download size={14}/> Export Summary</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex min-h-[600px]">
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
          <ReportPanel key={activeId} report={active}/>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProductionReportsPage;
