import React from 'react';
import { 
  Shield, 
  Lock, 
  AlertCircle,
  Settings,
  ShieldCheck
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Security Role"
      size="lg"
    >
      <div className="space-y-8">
        {/* Role Identity */}
        {/* Role Identity */}
        <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
          <div className="space-y-5">
            <Input 
              label="Role Name" 
              placeholder="e.g. Regional Manager" 
              required 
              leftIcon={<Shield size={16} />}
              className="bg-white border-slate-200 focus:bg-white rounded-xl"
            />
            <Select 
              label="Inherit From (Template)" 
              options={[
                { label: 'None (Start Blank)', value: '0' },
                { label: 'Standard Manager', value: '1' },
                { label: 'Standard Clerk', value: '2' },
              ]}
              leftIcon={<Settings size={16} />}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Role Description</label>
            <textarea 
              className="w-full rounded-2xl border border-slate-200 p-4 min-h-[110px] outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm font-medium bg-white"
              placeholder="Briefly describe the responsibilities of this role..."
            />
          </div>
        </div>

        {/* Permission Grid Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Lock size={14} className="text-slate-300" /> Basic Permissions Preview
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
              Advanced Matrix <AlertCircle size={10} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100/50">
                  <tr>
                    <th className="px-8 py-4">Module / Feature</th>
                    <th className="px-6 py-4 text-center">View</th>
                    <th className="px-6 py-4 text-center">Create</th>
                    <th className="px-6 py-4 text-center">Edit</th>
                    <th className="px-6 py-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Accounts & Finance', id: 'acc' },
                    { name: 'Inventory & Warehousing', id: 'inv' },
                    { name: 'Sales & Invoicing', id: 'sales' },
                    { name: 'Purchase & Vendors', id: 'pur' },
                  ].map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-900 tracking-tight">{item.name}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center"><Checkbox id={`${item.id}-v`} checked={true} onChange={() => {}} /></div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center"><Checkbox id={`${item.id}-c`} checked={false} onChange={() => {}} /></div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center"><Checkbox id={`${item.id}-e`} checked={false} onChange={() => {}} /></div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center"><Checkbox id={`${item.id}-d`} checked={false} onChange={() => {}} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Restrictions Note */}
        <div className="flex items-start gap-4 p-5 bg-amber-50/40 rounded-2xl border border-amber-100/50">
           <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm shrink-0 border border-amber-50">
             <AlertCircle size={20} />
           </div>
           <p className="text-xs text-slate-600 leading-relaxed font-bold">
             Note: <span className="font-medium text-slate-500">Advanced behavioral permissions (e.g., closing fiscal periods, bulk stock adjustments) can be configured in the main permissions matrix after the role is created.</span>
           </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button variant="secondary" onClick={onClose} className="rounded-xl px-6 font-bold text-slate-600">Cancel</Button>
          <Button variant="primary" className="bg-[#3b4cb8] hover:bg-indigo-700 px-10 font-bold rounded-xl shadow-lg shadow-indigo-500/20" leftIcon={<ShieldCheck size={18} />}>
            Initialize Role
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRoleModal;
