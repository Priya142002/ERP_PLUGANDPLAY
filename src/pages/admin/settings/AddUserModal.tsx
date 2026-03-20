import React from 'react';
import { 
  Mail, 
  User, 
  Shield, 
  Globe, 
  MapPin, 
  Building2,
  Lock
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite New User"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold text-slate-400 border-b border-indigo-100/50 pb-2 uppercase tracking-[0.15em]">Account Identity</h4>
            
            <Input 
              label="Email Address (User ID)" 
              type="email" 
              placeholder="user@erp.com" 
              required
              leftIcon={<Mail size={16} />}
              className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
            />
            
            <Input 
              label="User Full Name" 
              placeholder="Enter user's name" 
              required
              leftIcon={<User size={16} />}
              className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
            />

            <Select 
              label="Associated Employee" 
              placeholder="Select employee profile"
              options={[
                { label: 'E101 - Admin User', value: '1' },
                { label: 'E102 - Sarah Johnson', value: '2' },
                { label: 'E103 - Michael Chen', value: '3' },
              ]}
              leftIcon={<User size={16} />}
            />
          </div>

          <div className="space-y-5">
             <h4 className="text-[11px] font-bold text-slate-400 border-b border-indigo-100/50 pb-2 uppercase tracking-[0.15em]">Access & Security</h4>
            
            <Select 
              label="Primary Security Role" 
              required
              options={[
                { label: 'Super Admin', value: '1' },
                { label: 'Manager', value: '2' },
                { label: 'Inventory Clerk', value: '3' },
                { label: 'Sales Rep', value: '4' },
              ]}
              leftIcon={<Shield size={16} />}
            />

            <div className="p-5 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Available Modules</label>
              <div className="grid grid-cols-2 gap-3">
                {['Accounts', 'Inventory', 'Purchase', 'Sales', 'Admin', 'Reports'].map(module => (
                  <div key={module} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100/50 shadow-sm">
                    <Checkbox id={`mod-${module}`} label={module} checked={true} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <Select 
            label="Default Branch" 
            options={[
              { label: 'Main Branch', value: '1' },
              { label: 'Regional Office', value: '2' }
            ]} 
            leftIcon={<Building2 size={16} />}
          />
          <Select 
            label="Default Warehouse" 
            options={[
              { label: 'Main Store', value: '1' },
              { label: 'North Hub', value: '2' }
            ]} 
            leftIcon={<MapPin size={16} />}
          />
          <Select 
            label="System Language" 
            options={[
              { label: 'English', value: 'en' },
              { label: 'Arabic', value: 'ar' }
            ]} 
            leftIcon={<Globe size={16} />}
          />
        </div>

        <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/30 flex items-start gap-5">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-50">
            <Lock size={20} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-900 leading-none">Security Protocol Notice</p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Invitations are cryptographically signed. The user will be required to verify their identity and establish a secure password within 24 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
          <Button variant="secondary" onClick={onClose} className="rounded-xl px-6 font-bold text-slate-600">Cancel</Button>
          <Button variant="primary" className="bg-[#3b4cb8] hover:bg-indigo-700 px-10 font-bold rounded-xl shadow-lg shadow-indigo-500/20" leftIcon={<Mail size={18} />}>
            Dispatch Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
