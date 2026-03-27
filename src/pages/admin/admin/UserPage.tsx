import React, { useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../../services/api";
import toast from "react-hot-toast";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import Icon from "../../../components/ui/Icon";

const UserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  React.useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(page, pageSize, searchTerm);
      if (res.success && res.data) {
        setUsers(res.data.items);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const res = await adminApi.toggleUserStatus(user.id);
      if (res.success) {
        toast.success(res.message || "Status updated");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = (user: any) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name || user.userName}?`)) {
      // Logic for delete if API supports it
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id} className={`group transition-colors hover:bg-slate-50/70 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {user.email}
                      </span>
                      <div className="text-[10px] text-slate-400">{user.name}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-700">{user.roleName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-700">{user.employeeName || '-'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-700">{user.branchName || '-'}</span>
                    </td>
                    <td className="px-5 py-3.5 cursor-pointer" onClick={() => handleToggleStatus(user)}>
                      <Badge 
                        variant={user.isActive ? 'success' : 'error'} 
                        className="text-xs px-2 py-1"
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            {totalCount} total users
          </span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              disabled={page * pageSize >= totalCount}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
        onSave={() => fetchUsers()}
      />
      
      <EditUserModal 
        isOpen={isEditUserModalOpen} 
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        userData={selectedUser}
        onSave={() => fetchUsers()}
      />
    </motion.div>
  );
};

export default UserPage;
