import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Edit2,
  Trash2
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import AddUserModal from "./AddUserModal";

const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@erp.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago', avatar: 'AU' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@erp.com', role: 'Manager', status: 'Active', lastLogin: '1 hour ago', avatar: 'SJ' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@erp.com', role: 'Inventory Clerk', status: 'Inactive', lastLogin: '2 days ago', avatar: 'MC' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@erp.com', role: 'Sales rep', status: 'Active', lastLogin: '5 mins ago', avatar: 'ED' },
];

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personnel Architecture</h1>
          <p className="text-slate-500 mt-1">Strategic access synthesis and automated corporate role management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            leftIcon={<UserPlus size={18} />}
            className="bg-[#002147] hover:bg-[#003366] text-white border-none shadow-lg shadow-blue-900/10 font-bold px-8 h-10 rounded-xl"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* Premium Info Banner Section */}
      <div className="bg-[#002147] rounded-2xl md:rounded-[1.5rem] py-3 px-6 md:py-4 md:px-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 pointer-events-none text-white">
          <Users size={80} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <Users size={22} />
            </div>
            <div>
              <p className="text-white/60 font-medium text-[9px] md:text-[10px] uppercase tracking-[0.2em] leading-none mb-1">Access Protocol</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Personnel Matrix</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-white/90 font-bold text-sm">Corporate Access Hierarchy Fully Indexed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search users by name, email or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total: {MOCK_USERS.length} Users</span>
        </div>
      </div>

      {/* Users Grid/List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              <tr>
                <th className="px-8 py-5">User Account</th>
                <th className="px-6 py-5">Role & Access</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Last Activity</th>
                <th className="px-6 py-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border-2 border-white shadow-sm ring-1 ring-slate-100">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Mail size={10} className="text-slate-400" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[13px] text-slate-700 font-bold tracking-tight">
                      <div className="p-1 bg-indigo-50 rounded text-indigo-600">
                        <Shield size={12} />
                      </div>
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={user.status === 'Active' ? 'success' : 'error'} className="flex items-center w-fit gap-1.5 px-3 py-0.5 rounded-lg border-none">
                      <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wide">{user.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-[13px] text-slate-500 font-medium">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-5 text-right pr-8">
                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit User">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Settings Preview Card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Shield size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight">Role-Based Access Control</h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Design granular security hierarchies to safeguard your data. Assign module-specific permissions and track user access across the enterprise system.
            </p>
          </div>
          <Button className="bg-[#3b4cb8] hover:bg-indigo-700 text-white border-none font-bold whitespace-nowrap px-10 py-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            Configure Security Roles
          </Button>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
      />
    </motion.div>
  );
};
