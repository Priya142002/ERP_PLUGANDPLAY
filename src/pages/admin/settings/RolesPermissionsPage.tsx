import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  UserCheck,
  Settings,
  AlertCircle
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import CreateRoleModal from "./CreateRoleModal";

const MOCK_ROLES = [
  { 
    id: 1, 
    name: 'Super Admin', 
    description: 'Full system access with all permissions enabled',
    users: 2,
    permissions: 'Global',
    level: 'System'
  },
  { 
    id: 2, 
    name: 'Financial Manager', 
    description: 'Access to all account modules and financial reports',
    users: 5,
    permissions: 'Modular',
    level: 'Advanced'
  },
  { 
    id: 3, 
    name: 'Sales Representative', 
    description: 'Manage customers, quotations, and sales invoices',
    users: 12,
    permissions: 'Restricted',
    level: 'Basic'
  },
  { 
    id: 4, 
    name: 'Warehouse Keeper', 
    description: 'Manage products, stock transfers, and deliveries',
    users: 8,
    permissions: 'Inventory Only',
    level: 'Basic'
  },
];

const PERMISSION_GROUPS = [
  { name: 'Accounts', actions: ['View', 'Create', 'Edit', 'Delete', 'Post', 'Close Period'] },
  { name: 'Inventory', actions: ['View', 'Adjust', 'Transfer', 'Dispatch', 'Receive'] },
  { name: 'Sales', actions: ['View', 'Quotation', 'Invoice', 'Return', 'Credit Note'] },
  { name: 'Admin', actions: ['Users', 'Settings', 'Audit Logs', 'Backups'] },
];

export const RolesPermissionsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(MOCK_ROLES[0]);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security Architecture</h1>
          <p className="text-slate-500 mt-1">Strategic access synthesis and automated corporate role management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            leftIcon={<Shield size={18} />}
            className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 font-bold px-8 h-10 rounded-xl"
            onClick={() => setIsCreateRoleModalOpen(true)}
          >
            Create New Role
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] rounded-2xl md:rounded-[1.5rem] py-3 px-6 md:py-4 md:px-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none text-white">
          <ShieldCheck size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Security Protocol</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Security Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">Corporate Access Hierarchy Fully Indexed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-bold text-slate-400 border-b border-indigo-100/50 pb-2 flex-1 uppercase tracking-[0.15em]">Available Roles</h3>
            <Badge variant="info" className="text-[10px] ml-4 bg-indigo-50 text-indigo-600 border-indigo-100">{MOCK_ROLES.length}</Badge>
          </div>
          {MOCK_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                selectedRole.id === role.id 
                ? 'bg-white border-[#3b4cb8] shadow-lg ring-1 ring-indigo-50' 
                : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-sm font-bold tracking-tight ${selectedRole.id === role.id ? 'text-[#3b4cb8]' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
                  {role.name}
                </span>
                <Badge variant={role.level === 'System' ? 'primary' : role.level === 'Advanced' ? 'info' : 'secondary'} className="text-[9px] uppercase tracking-wider py-0 px-2 rounded-md">
                  {role.level}
                </Badge>
              </div>
              <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4 font-medium italic opacity-80">
                "{role.description}"
              </p>
              <div className="flex items-center gap-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1.5"><UserCheck size={12} className="text-slate-300" /> {role.users} Users</span>
                <div className="h-1 w-1 rounded-full bg-slate-200" />
                <span className="flex items-center gap-1.5"><Lock size={12} className="text-slate-300" /> {role.permissions}</span>
              </div>
              {selectedRole.id === role.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#3b4cb8]" />
              )}
            </button>
          ))}
        </div>

        {/* Permissions Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Settings size={120} />
              </div>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                      <ShieldCheck size={20} className="text-indigo-400" />
                    </div>
                    {selectedRole.name} Permissions
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 font-medium tracking-wide">Configure specific system behaviors and data access rights</p>
                </div>
                <Button variant="secondary" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-bold">
                  Reset to Defaults
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.name} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-1.5 w-4 rounded-full bg-[#3b4cb8]" />
                      {group.name} Module
                    </h4>
                    <div className="h-px flex-1 bg-slate-50" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.actions.map((action) => (
                      <label key={action} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 cursor-pointer hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={selectedRole.name === 'Super Admin' || action === 'View'}
                            className="w-5 h-5 rounded-lg border-slate-300 text-[#3b4cb8] focus:ring-[#3b4cb8] transition-all cursor-pointer"
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertCircle size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide">Propagation Delay Likely</span>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="rounded-xl px-6 font-bold text-slate-600">Cancel</Button>
                <Button variant="primary" className="bg-[#3b4cb8] hover:bg-indigo-700 font-bold px-8 rounded-xl shadow-lg shadow-indigo-500/20">
                  Update Role Permissions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateRoleModal 
        isOpen={isCreateRoleModalOpen} 
        onClose={() => setIsCreateRoleModalOpen(false)} 
      />
    </motion.div>
  );
};
