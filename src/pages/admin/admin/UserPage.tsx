import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

const MOCK_USERS = [
  {
    id: 1,
    userName: 'harisilks@gmail.com',
    userRole: 'Admin,Enterprise Resource Planning',
    employee: 'Head Office',
    branch: 'Head Office',
    status: 'Active'
  },
];

const UserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    if (window.confirm(`Are you sure you want to delete user ${user.userName}?`)) {
      console.log('Delete user:', user);
      // Add delete logic here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            leftIcon={<UserPlus size={18} />}
            className="bg-[#4F5BA6] hover:bg-[#3d4682] text-white border-none shadow-lg font-bold px-8 h-10 rounded-lg"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-[500px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search here"
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#002147] text-white">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">User Name</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">User Role</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Employee</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Branch</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Active/Inactive</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_USERS.map((user, i) => (
                <tr key={user.id} className={`group transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                      {user.userName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-700">{user.userRole}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-700">{user.employee}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-700">{user.branch}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={user.status === 'Active' ? 'success' : 'error'}
                      className="text-xs px-2 py-1"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl transition bg-[#002147] hover:bg-[#003366] text-white"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl transition bg-red-600 hover:bg-red-700 text-white"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400 font-medium">
            {MOCK_USERS.length} {MOCK_USERS.length === 1 ? 'item' : 'items'} shown
          </span>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        userData={selectedUser}
      />
    </motion.div>
  );
};

export default UserPage;