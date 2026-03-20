import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Edit, ChevronDown, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const MOCK_COA = [
  { 
    id: '1', 
    code: '1000', 
    name: 'Assets', 
    type: 'Asset', 
    balance: '$1,245,000.00',
    children: [
      { id: '1-1', code: '1100', name: 'Current Assets', type: 'Asset', balance: '$645,000.00', children: [
        { id: '1-1-1', code: '1110', name: 'Cash and Bank', type: 'Asset', balance: '$384,200.00' },
        { id: '1-1-2', code: '1120', name: 'Accounts Receivable', type: 'Asset', balance: '$260,800.00' },
      ]},
      { id: '1-2', code: '1200', name: 'Fixed Assets', type: 'Asset', balance: '$600,000.00' }
    ]
  },
  { 
    id: '2', 
    code: '2000', 
    name: 'Liabilities', 
    type: 'Liability', 
    balance: '$142,500.00',
    children: [
      { id: '2-1', code: '2100', name: 'Current Liabilities', type: 'Liability', balance: '$42,500.00' },
      { id: '2-2', code: '2200', name: 'Long Term Debt', type: 'Liability', balance: '$100,000.00' }
    ]
  },
  { 
    id: '3', 
    code: '3000', 
    name: 'Equity', 
    type: 'Equity', 
    balance: '$1,102,500.00'
  }
];

const TreeNode: React.FC<{ node: any; depth: number }> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative">
      <div className={`flex items-center gap-4 py-3 px-4 hover:bg-slate-50 transition-colors group ${depth === 0 ? 'bg-slate-50/10' : ''}`}>
        <div className="flex items-center" style={{ paddingLeft: `${depth * 32}px` }}>
          {/* Connector Line */}
          {depth > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" style={{ left: `${(depth * 32) - 16}px` }} />
          )}
          
          {hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 w-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#002147] hover:text-[#002147] transition-all z-10 shadow-sm"
            >
              {isExpanded ? <ChevronDown size={14} /> : <Plus size={14} />}
            </button>
          ) : (
            <div className="h-7 w-7 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 py-1.5 px-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 min-w-[40px]">{node.code}</span>
            <span className={`text-sm tracking-tight ${depth === 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
              - {node.name.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={
              node.type === 'Asset' ? 'info' : 
              node.type === 'Liability' ? 'warning' : 
              node.type === 'Equity' ? 'primary' : 
              node.type === 'Income' ? 'success' : 'error'
            } className="text-[10px] uppercase font-bold tracking-tighter">
              {node.type}
            </Badge>
            <span className="text-sm font-bold text-slate-900 min-w-[100px] text-right">{node.balance}</span>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md"><Edit size={14} /></button>
              <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"><Plus size={14} /></button>
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="relative">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ChartOfAccountsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Taxonomies</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-[10px] md:text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsModalOpen(true)}
          >
            New Account
          </Button>
        </div>
      </div>

      {/* Account Group Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Account Group"
        size="lg"
        showCloseButton={false} 
        contentClassName="p-0 overflow-hidden rounded-xl border-none shadow-2xl"
      >
        <div className="bg-[#002147] px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-base">Account Group</h3>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <Input 
            label="Group Code" 
            placeholder="e.g. 109" 
            className="border-slate-200 text-xs py-1.5"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
            value="109"
          />
          <Input 
            label="Group Name" 
            placeholder="Enter group name" 
            required 
            className="border-slate-200 text-xs py-1.5"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Input 
            label="Description" 
            placeholder="Enter description" 
            className="border-slate-200 text-xs py-1.5"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Select 
            label="Transaction Type" 
            options={[
              { label: 'Debit', value: 'dr' },
              { label: 'Credit', value: 'cr' }
            ]} 
            className="border-slate-200 text-xs py-1.5"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          <Select 
            label="Cash Flow Type" 
            options={[
              { label: 'Operating', value: 'operating' },
              { label: 'Investing', value: 'investing' },
              { label: 'Financing', value: 'financing' }
            ]} 
            className="border-slate-200 text-xs py-1.5"
            labelClassName="text-[#002147] font-semibold text-[10px] mb-1.5 uppercase tracking-wider"
          />
          
          <div className="flex items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="bg-[#002147] hover:bg-[#003366] text-white h-11 px-8 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            >
              Post Group
            </button>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="h-11 px-8 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>



      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] p-4 md:p-8 mt-6">
        <div className="max-w-4xl mx-auto space-y-2">
          {MOCK_COA.map(account => (
            <TreeNode key={account.id} node={account} depth={0} />
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex gap-6 uppercase tracking-widest">
            <span>Total Groups: <span className="text-slate-900">14</span></span>
            <span>Total Ledgers: <span className="text-slate-900">124</span></span>
          </div>
          <span>Active Session: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
