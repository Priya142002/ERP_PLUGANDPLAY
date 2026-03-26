import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Mail, User, Shield, MapPin, List, Building2 } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (userData: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    employee: '',
    userName: '',
    userRole: '',
    appsList: '',
    branch: 'Head Office',
    location: 'Head Office',
    active: true,
  });

  const [showEmployeeInput, setShowEmployeeInput] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState<string[]>([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
  ]);

  const [showAppInput, setShowAppInput] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [appOptions, setAppOptions] = useState([
    { label: 'ERP', value: 'ERP' },
    { label: 'ESS', value: 'ESS' },
    { label: 'HR', value: 'HR' },
    { label: 'CRM', value: 'CRM' },
    { label: 'Inventory', value: 'Inventory' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Purchase', value: 'Purchase' },
    { label: 'Accounts', value: 'Accounts' },
  ]);

  const [showRoleInput, setShowRoleInput] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [roleOptions, setRoleOptions] = useState([
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Inventory Clerk', value: 'inventory_clerk' },
    { label: 'Sales Rep', value: 'sales_rep' },
    { label: 'Accountant', value: 'accountant' },
  ]);

  const [showBranchInput, setShowBranchInput] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchOptions, setBranchOptions] = useState([
    { label: 'Head Office', value: 'Head Office' },
    { label: 'Branch 1', value: 'Branch 1' },
    { label: 'Branch 2', value: 'Branch 2' },
  ]);

  const [showLocationInput, setShowLocationInput] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [locationOptions, setLocationOptions] = useState([
    { label: 'Head Office', value: 'Head Office' },
    { label: 'Location 1', value: 'Location 1' },
    { label: 'Location 2', value: 'Location 2' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      setEmployeeOptions([...employeeOptions, newEmployeeName.trim()]);
      setFormData(prev => ({ ...prev, employee: newEmployeeName.trim() }));
      setNewEmployeeName('');
      setShowEmployeeInput(false);
    }
  };

  const handleAddApp = () => {
    if (newAppName.trim()) {
      const newApp = { label: newAppName.trim(), value: newAppName.trim() };
      setAppOptions([...appOptions, newApp]);
      setFormData(prev => ({ ...prev, appsList: newAppName.trim() }));
      setNewAppName('');
      setShowAppInput(false);
    }
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole = { label: newRoleName.trim(), value: newRoleName.trim().toLowerCase().replace(/\s+/g, '_') };
      setRoleOptions([...roleOptions, newRole]);
      setFormData(prev => ({ ...prev, userRole: newRole.value }));
      setNewRoleName('');
      setShowRoleInput(false);
    }
  };

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      const newBranch = { label: newBranchName.trim(), value: newBranchName.trim() };
      setBranchOptions([...branchOptions, newBranch]);
      setFormData(prev => ({ ...prev, branch: newBranchName.trim() }));
      setNewBranchName('');
      setShowBranchInput(false);
    }
  };

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      const newLocation = { label: newLocationName.trim(), value: newLocationName.trim() };
      setLocationOptions([...locationOptions, newLocation]);
      setFormData(prev => ({ ...prev, location: newLocationName.trim() }));
      setNewLocationName('');
      setShowLocationInput(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Users / New"
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              required
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              leftIcon={<Mail size={16} />}
            />
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Employee
            </label>
            {showEmployeeInput ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter employee name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmployee();
                      }
                    }}
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="h-10 px-5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeInput(false);
                    setNewEmployeeName('');
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
                    value={formData.employee}
                    onChange={(e) => handleChange('employee', e.target.value)}
                    options={[
                      { label: 'Select employee', value: '' },
                      ...employeeOptions.map(emp => ({ label: emp, value: emp }))
                    ]}
                    leftIcon={<User size={16} />}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmployeeInput(true)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new employee"
                >
                  <span className="text-lg font-semibold leading-none">+</span>
                </button>
              </div>
            )}
          </div>

          {/* User Name */}
          <div>
            <Input
              label="User Name"
              required
              placeholder="Enter user name"
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              leftIcon={<User size={16} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
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
                    required
                    value={formData.userRole}
                    onChange={(e) => handleChange('userRole', e.target.value)}
                    options={[
                      { label: 'Select Role', value: '' },
                      ...roleOptions
                    ]}
                    leftIcon={<Shield size={16} />}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleInput(true)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new role"
                >
                  <span className="text-lg font-semibold leading-none">+</span>
                </button>
              </div>
            )}
          </div>

          {/* Apps List */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Apps List <span className="text-red-500">*</span>
            </label>
            {showAppInput ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter app name"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddApp();
                      }
                    }}
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddApp}
                  className="h-10 px-5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppInput(false);
                    setNewAppName('');
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
                    required
                    value={formData.appsList}
                    onChange={(e) => handleChange('appsList', e.target.value)}
                    options={[
                      { label: 'Select apps', value: '' },
                      ...appOptions
                    ]}
                    leftIcon={<List size={16} />}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAppInput(true)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new app"
                >
                  <span className="text-lg font-semibold leading-none">+</span>
                </button>
              </div>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Branch
            </label>
            {showBranchInput ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter branch name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBranch();
                      }
                    }}
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="h-10 px-5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBranchInput(false);
                    setNewBranchName('');
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
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    options={[
                      { label: 'Select branch', value: '' },
                      ...branchOptions
                    ]}
                    leftIcon={<Building2 size={16} />}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowBranchInput(true)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new branch"
                >
                  <span className="text-lg font-semibold leading-none">+</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Location
            </label>
            {showLocationInput ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter location name"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLocation();
                      }
                    }}
                    className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="h-10 px-5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLocationInput(false);
                    setNewLocationName('');
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
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    options={[
                      { label: 'Select location', value: '' },
                      ...locationOptions
                    ]}
                    leftIcon={<MapPin size={16} />}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocationInput(true)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                  title="Add new location"
                >
                  <span className="text-lg font-semibold leading-none">+</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <div className="h-10 flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange('active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all shadow-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg font-semibold transition-all shadow-sm"
          >
            Invite User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
