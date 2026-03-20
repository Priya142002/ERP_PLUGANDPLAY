import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Percent, 
  Trash2, 
  Database,
  Calculator,
  ShieldCheck,
  PlusCircle,
  Save,
  Search,
  Filter,
  Edit2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Checkbox from "../../../components/ui/Checkbox";

const MOCK_TAX_CATEGORIES = [
  { id: 1, name: 'VAT 15%', rate: '15.00', type: 'VAT', outward: '20101 - Output VAT', inward: '10101 - Input VAT', status: 'Active' },
  { id: 2, name: 'VAT 5%', rate: '5.00', type: 'VAT', outward: '20101 - Output VAT', inward: '10101 - Input VAT', status: 'Active' },
  { id: 3, name: 'Zero Rated', rate: '0.00', type: 'Exempt', outward: '20101 - Output VAT', inward: '10101 - Input VAT', status: 'Active' },
];

export const TaxSettingsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubTax, setIsSubTax] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <Percent size={24} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Tax Configuration</h1>
            <p className="text-slate-500 mt-1">Manage tax categories, rates, and accounting ledgers</p>
          </div>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<PlusCircle size={18} />}
          className="bg-emerald-600 hover:bg-emerald-700 font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          Add Tax Category
        </Button>
      </div>

      {/* Tax Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tax categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              leftIcon={<Filter size={14} />}
              className="rounded-xl border-slate-200 h-10 px-4 text-slate-700 font-bold"
            >
              Filters
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">{MOCK_TAX_CATEGORIES.length} Active Rules</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              <tr>
                <th className="px-8 py-5">Category & Type</th>
                <th className="px-6 py-5">Calculation Rate</th>
                <th className="px-6 py-5">Outward Ledger</th>
                <th className="px-6 py-5">Inward Ledger</th>
                <th className="px-6 py-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TAX_CATEGORIES.map((tax) => (
                <tr key={tax.id} className="hover:bg-slate-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[11px] border border-emerald-100 shadow-sm">
                        %
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{tax.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tax.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                        {tax.rate}%
                      </div>
                      <Badge variant="success" className="text-[9px] py-0 px-1.5 rounded-md lowercase tracking-tight">Active</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-600 tracking-tight">
                      <div className="p-1 bg-slate-50 rounded text-slate-400 border border-slate-100">
                        <Database size={12} />
                      </div>
                      {tax.outward}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-600 tracking-tight">
                      <div className="p-1 bg-slate-50 rounded text-slate-400 border border-slate-100">
                        <Database size={12} />
                      </div>
                      {tax.inward}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right pr-8">
                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Edit Category">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete Category">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logic Note Card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Calculator size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              Fiscal & Tax Compliance
            </h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Tax categories are globally applied based on customer and vendor locations. Ensure outward ledgers are mapped correctly to your chart of accounts for automated financial reporting.
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-none font-bold shadow-lg shadow-emerald-500/20 whitespace-nowrap px-10 py-3 rounded-2xl">
            View Tax Audit Log
          </Button>
        </div>
      </div>

      {/* Add Tax Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create Tax Category"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Category Name" 
                placeholder="e.g. Standard VAT" 
                required 
                leftIcon={<Edit2 size={16} />}
              />
              <div className="flex items-end pb-2">
                <Checkbox 
                  id="is-sub-tax" 
                  label="Is Sub Tax" 
                  checked={isSubTax}
                  onChange={(e: any) => setIsSubTax(typeof e === 'boolean' ? e : e.target.checked)}
                />
              </div>
            </div>

            {isSubTax && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-4 rounded-xl border border-indigo-100 border-dashed"
              >
                <Checkbox 
                  id="exclude-sub-tax" 
                  label="Exclude Sub Tax for Tax customer" 
                  checked={false}
                  onChange={() => {}}
                />
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Percentage (%)" 
                type="number" 
                placeholder="0.00" 
                required 
                leftIcon={<Percent size={16} />}
              />
              <div className="flex items-end pb-2">
                <Checkbox 
                  id="edit-amt" 
                  label="Allow Amount Editing" 
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>

            <Input 
              label="Display Name (on Invoice)" 
              placeholder="e.g. VAT (15%)" 
              required
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
              <Database size={14} /> Account Ledger Mapping
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Outward Tax Ledger" 
                options={[
                  { label: '20101 - Output VAT', value: '1' },
                  { label: '20102 - Sales Tax Payable', value: '2' }
                ]} 
              />
              <Select 
                label="Inward Tax Ledger" 
                options={[
                  { label: '10101 - Input VAT', value: '1' },
                  { label: '10102 - Purchase Tax Asset', value: '2' }
                ]} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
              <Calculator size={14} /> Calculation Method
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'cal-unit', label: 'Calculate Unit Price' },
                { id: 'cal-net', label: 'On Net Amount' },
                { id: 'cal-tax', label: 'On Tax' },
              ].map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Checkbox 
                    id={item.id} 
                    label={item.label} 
                    checked={item.id === 'cal-unit'}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="bg-emerald-600 px-8 font-bold" leftIcon={<Save size={18} />}>
              Save Category
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
