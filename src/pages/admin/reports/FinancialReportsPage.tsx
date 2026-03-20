import React from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  DollarSign, 
  ArrowRight,
  Calendar,
  Download,
  Filter,
  Briefcase,
  Layers
} from "lucide-react";
import Button from "../../../components/ui/Button";

const REPORT_CATEGORIES = [
  {
    title: "Financial Statements",
    description: "Core accounting reports for compliance and auditing.",
    reports: [
      { id: '1', title: 'Balance Sheet', description: 'Real-time statement of financial position', icon: <Briefcase size={20} /> },
      { id: '2', title: 'Profit & Loss', description: 'Income and expenditure summary', icon: <TrendingUp size={20} /> },
      { id: '3', title: 'Cash Flow', description: 'Inflow and outflow of cash tracking', icon: <DollarSign size={20} /> },
    ]
  },
  {
    title: "Trial & Ledgers",
    description: "Detailed breakdown of account balances and activity.",
    reports: [
      { id: '4', title: 'Trial Balance', description: 'Summary of all debit and credit balances', icon: <Calculator size={20} /> },
      { id: '5', title: 'General Ledger', description: 'Detailed record of all transactions', icon: <Layers size={20} /> },
      { id: '6', title: 'Account Reconciliation', description: 'Bank and internal ledger matching', icon: <Calendar size={20} /> },
    ]
  },
  {
    title: "Tax & Compliance",
    description: "Reports for VAT, Income Tax, and regulatory filings.",
    reports: [
      { id: '7', title: 'VAT Summary', description: 'Consolidated tax collected vs paid', icon: <FileText size={20} /> },
      { id: '8', title: 'Audit Trail', description: 'Log of all accounting modifications', icon: <Calendar size={20} /> },
      { id: '9', title: 'Aging Report', description: 'Payables and receivables duration', icon: <TrendingDown size={20} /> },
    ]
  }
];

export const FinancialReportsPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fiscal Intelligence</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Filter size={14} />}>
            Period
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all" 
            leftIcon={<Download size={14} />}
          >
            PDF Export
          </Button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {REPORT_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-4">
            <div className="px-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{category.title}</h3>
              <p className="text-[11px] text-slate-500">{category.description}</p>
            </div>
            
            <div className="space-y-3">
              {category.reports.map((report) => (
                <motion.button
                  key={report.id}
                  whileHover={{ x: 4 }}
                  className="w-full text-left bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 hover:border-[#002147] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#002147]/5 group-hover:text-[#002147] transition-colors">
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-[#002147] transition-colors">{report.title}</h4>
                      <p className="text-[10px] text-slate-500">{report.description}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#002147] transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#002147] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">Year-End Closing Wizard</h3>
            <p className="text-indigo-200 text-xs md:text-sm max-w-md">Automate your fiscal year closing procedures and profit distribution.</p>
          </div>
          <Button variant="secondary" className="bg-white border-none text-[#002147] hover:bg-slate-50 px-6 py-2 text-xs md:text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/10">
            Start Closing Process
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </motion.div>
  );
};
