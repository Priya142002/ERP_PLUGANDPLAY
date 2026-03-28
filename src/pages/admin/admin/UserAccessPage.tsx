import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { adminNavigation } from "../../../config/navigation";
import { adminApi } from "../../../services/api";
import { useNotifications } from "../../../context/AppContext";

const ALL_MODULES = [
  { label: 'Select Module', value: '' },
  { label: 'Inventory', value: 'inventory' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Sales', value: 'sales' },
  { label: 'Accounts', value: 'accounts' },
  { label: 'CRM', value: 'crm' },
  { label: 'HRM', value: 'hrm' },
  { label: 'Projects', value: 'projects' },
  { label: 'Helpdesk', value: 'helpdesk' },
  { label: 'Assets', value: 'assets' },
  { label: 'Logistics', value: 'logistics' },
  { label: 'Production', value: 'production' },
  { label: 'Billing', value: 'billing' },
  { label: 'POS', value: 'pos' },
];

// Helper function to get screens for a module
const getModuleScreens = (moduleId: string) => {
  const module = adminNavigation.find(nav => nav.id === moduleId);
  if (!module || !module.children) return [];
  
  return module.children.map((child, index) => ({
    id: index + 1,
    name: child.label,
    view: false,
    insert: false,
    update: false,
    delete: false,
  }));
};

const UserAccessPage: React.FC = () => {
  const { showNotification } = useNotifications();
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [screens, setScreens] = useState<Array<{id: number, name: string, view: boolean, insert: boolean, update: boolean, delete: boolean}>>([]);
  const [newScreenName, setNewScreenName] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getPermissions()
      ]);
      if (rolesRes.success) setRoles(rolesRes.data);
      if (permsRes.success) setAllPermissions(permsRes.data);
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch initial data',
        duration: 3000
      });
    }
  };

  // Update screens when selectedRole or selectedModule changes
  useEffect(() => {
    if (selectedRole && selectedModule) {
      fetchRolePermissions();
    }
  }, [selectedRole, selectedModule]);

  const fetchRolePermissions = async () => {
    const roleId = roles.find(r => r.roleName === selectedRole || r.id === parseInt(selectedRole))?.id;
    if (!roleId) return;

    setLoading(true);
    try {
      const res = await adminApi.getRolePermissions(roleId);
      if (res.success) {
        const pIds = res.data;
        setRolePermissions(pIds);
        
        // Map to screens
        const moduleScreens = getModuleScreens(selectedModule);
        const mappedScreens = moduleScreens.map(screen => {
          return {
            ...screen,
            view: hasPermission(screen.name, 'View', pIds),
            insert: hasPermission(screen.name, 'Create', pIds),
            update: hasPermission(screen.name, 'Edit', pIds),
            delete: hasPermission(screen.name, 'Delete', pIds),
          };
        });
        setScreens(mappedScreens);
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch permissions',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (screenName: string, action: string, activeIds: number[]) => {
    const permName = `${selectedModule}.${screenName.replace(/\s+/g, '')}.${action}`.toLowerCase();
    const perm = allPermissions.find(p => p.name.toLowerCase() === permName);
    return perm ? activeIds.includes(perm.id) : false;
  };

  // Update screens when module changes
  useEffect(() => {
    if (selectedModule) {
      const moduleScreens = getModuleScreens(selectedModule);
      setScreens(moduleScreens);
      setSelectAll(false);
    } else {
      setScreens([]);
    }
  }, [selectedModule]);

  const handleSave = async () => {
    const roleId = roles.find(r => r.roleName === selectedRole || r.id === parseInt(selectedRole))?.id;
    if (!roleId) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Please select a role',
        duration: 3000
      });
      return;
    }

    const permissionIds: number[] = [];
    screens.forEach(screen => {
      const actions = [
        { key: 'view', suffix: 'View' },
        { key: 'insert', suffix: 'Create' },
        { key: 'update', suffix: 'Edit' },
        { key: 'delete', suffix: 'Delete' }
      ];

      actions.forEach(action => {
        if ((screen as any)[action.key]) {
          const permName = `${selectedModule}.${screen.name.replace(/\s+/g, '')}.${action.suffix}`.toLowerCase();
          const perm = allPermissions.find(p => p.name.toLowerCase() === permName);
          if (perm) permissionIds.push(perm.id);
        }
      });
    });

    // Also keep permissions from other modules
    const otherModulePermissions = rolePermissions.filter(pid => {
      const p = allPermissions.find(ap => ap.id === pid);
      return p && !p.name.toLowerCase().startsWith(selectedModule.toLowerCase() + ".");
    });

    try {
      const res = await adminApi.assignPermissions({
        roleId,
        permissionIds: [...new Set([...permissionIds, ...otherModulePermissions])]
      });
      if (res.success) {
        showNotification({
          type: 'success',
          title: 'Success',
          message: 'Permissions updated successfully',
          duration: 3000
        });
        fetchRolePermissions();
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save permissions',
        duration: 3000
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setScreens(screens.map(screen => ({
      ...screen,
      view: checked,
      insert: checked,
      update: checked,
      delete: checked,
    })));
  };

  const handlePermissionChange = (screenId: number, permission: 'view' | 'insert' | 'update' | 'delete', checked: boolean) => {
    setScreens(screens.map(screen => 
      screen.id === screenId ? { ...screen, [permission]: checked } : screen
    ));
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setRoles([...roles, newRoleName.trim()]);
      setSelectedRole(newRoleName.trim());
      setNewRoleName('');
      setShowRoleInput(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header with Save Button */}
      <div className="bg-[#4F5BA6] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Access</h1>
        <Button
          variant="primary"
          onClick={handleSave}
          className="bg-white hover:bg-slate-100 text-[#4F5BA6] border-none shadow-md font-bold px-6 h-9 rounded text-sm"
        >
          Save
        </Button>
      </div>

      {/* Selection Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              User Role <span className="text-red-500">*</span>
            </label>
            {showRoleInput ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter role name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRole();
                      }
                    }}
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="h-10 px-5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleInput(false);
                    setNewRoleName('');
                  }}
                  className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    options={[
                      { label: 'Select Role', value: '' },
                      ...roles.map(role => ({ label: role.roleName, value: role.roleName }))
                    ]}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleInput(true)}
                  className="w-10 h-10 bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new role"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Select Module */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Module <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  options={ALL_MODULES}
                />
              </div>
              <div className="h-10 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                  <span className="text-sm font-medium text-slate-700">Select All</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-[#002147] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#002147] text-white">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-left uppercase tracking-wider">Screen</th>
                <th className="px-5 py-3 text-xs font-semibold text-center uppercase tracking-wider">View</th>
                <th className="px-5 py-3 text-xs font-semibold text-center uppercase tracking-wider">Insert</th>
                <th className="px-5 py-3 text-xs font-semibold text-center uppercase tracking-wider">Update</th>
                <th className="px-5 py-3 text-xs font-semibold text-center uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* Input Row */}
              <tr className="bg-white border-b border-slate-200">
                <td className="px-5 py-3">
                  <input
                    type="text"
                    placeholder="Enter Screen..."
                    value={newScreenName}
                    onChange={(e) => setNewScreenName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                </td>
                <td className="px-5 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                </td>
                <td className="px-5 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                </td>
                <td className="px-5 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                </td>
                <td className="px-5 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                  />
                </td>
              </tr>

              {/* Data Rows */}
              {screens.map((screen) => (
                <tr key={screen.id} className="hover:bg-slate-50 transition-colors border-b border-slate-200">
                  <td className="px-5 py-3 text-sm text-slate-700">{screen.name}</td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={screen.view}
                      onChange={(e) => handlePermissionChange(screen.id, 'view', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={screen.insert}
                      onChange={(e) => handlePermissionChange(screen.id, 'insert', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={screen.update}
                      onChange={(e) => handlePermissionChange(screen.id, 'update', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={screen.delete}
                      onChange={(e) => handlePermissionChange(screen.id, 'delete', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State - Only show if no screens */}
        {screens.length === 0 && (
          <div className="px-5 py-16 text-center text-slate-400 text-sm">
            No Data Found !
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserAccessPage;
