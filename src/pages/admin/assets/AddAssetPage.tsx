import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, FileText, Image as ImageIcon,
  Package, DollarSign, MapPin, UserCheck, Settings, File, TrendingDown
} from 'lucide-react';
import Button from '../../../components/ui/Button';

const AddAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Details
    assetName: '',
    assetId: '',
    category: '',
    assetType: '',
    description: '',
    
    // Purchase Details
    purchaseDate: '',
    purchaseCost: '',
    vendorName: '',
    invoiceNumber: '',
    warrantyExpiryDate: '',
    
    // Depreciation
    depreciationMethod: 'Straight Line',
    residualValue: '',
    usefulLife: '',
    
    // Location
    officeBranch: '',
    department: '',
    location: '',
    
    // Assignment
    assignedTo: '',
    employeeId: '',
    assignedDate: '',
    returnDate: '',
    assetStatus: 'Available',
    
    // Maintenance
    lastServiceDate: '',
    nextServiceDate: '',
    maintenanceCost: '',
    serviceProvider: '',
    notes: '',
  });

  // State for inline add inputs
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryOptions, setCategoryOptions] = useState(['IT', 'Furniture', 'Machinery', 'Vehicle']);

  const [showBranchInput, setShowBranchInput] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchOptions, setBranchOptions] = useState(['Main HUB', 'Branch Office', 'Warehouse', 'Regional Office']);

  const [showDepartmentInput, setShowDepartmentInput] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState(['IT Department', 'HR Department', 'Finance Department', 'Operations', 'Sales', 'Marketing']);

  // Calculate depreciation values
  const purchaseCost = parseFloat(formData.purchaseCost) || 0;
  const residualValue = parseFloat(formData.residualValue) || 0;
  const usefulLife = parseFloat(formData.usefulLife) || 0;
  
  const depreciableAmount = purchaseCost - residualValue;
  const yearlyDepreciation = usefulLife > 0 ? depreciableAmount / usefulLife : 0;
  const currentBookValue = purchaseCost - yearlyDepreciation; // Simplified for first year

  const tabs = [
    { id: 0, label: 'Basic Details', icon: Package },
    { id: 1, label: 'Purchase Details', icon: DollarSign },
    { id: 2, label: 'Depreciation', icon: TrendingDown },
    { id: 3, label: 'Location', icon: MapPin },
    { id: 4, label: 'Assignment', icon: UserCheck },
    { id: 5, label: 'Maintenance', icon: Settings },
    { id: 6, label: 'Documents', icon: File },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Handle form submission
    navigate('/admin/assets/manage');
  };

  const handleCancel = () => {
    navigate('/admin/assets/manage');
  };

  // Handlers for inline add inputs
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategoryOptions([...categoryOptions, newCategoryName.trim()]);
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName('');
      setShowCategoryInput(false);
    }
  };

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      setBranchOptions([...branchOptions, newBranchName.trim()]);
      setFormData({ ...formData, officeBranch: newBranchName.trim() });
      setNewBranchName('');
      setShowBranchInput(false);
    }
  };

  const handleAddDepartment = () => {
    if (newDepartmentName.trim()) {
      setDepartmentOptions([...departmentOptions, newDepartmentName.trim()]);
      setFormData({ ...formData, department: newDepartmentName.trim() });
      setNewDepartmentName('');
      setShowDepartmentInput(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Asset</h1>
            <p className="text-slate-500 text-sm mt-1">Complete all required information to register a new asset</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleCancel} leftIcon={<X size={16} />}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#002147] text-white" leftIcon={<Save size={16} />}>
            Save Asset
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#002147] text-[#002147] bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Tab 1: Basic Details */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Asset Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Asset Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="assetName"
                      value={formData.assetName}
                      onChange={handleInputChange}
                      placeholder="Enter asset name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Asset ID (Unique) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="assetId"
                      value={formData.assetId}
                      onChange={handleInputChange}
                      placeholder="ASST-XXXX"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    {showCategoryInput ? (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCategory();
                              }
                            }}
                            className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                            autoFocus
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="h-10 px-5 bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCategoryInput(false);
                            setNewCategoryName('');
                          }}
                          className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                          <option value="">Select category</option>
                          {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowCategoryInput(true)}
                          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                          title="Add new category"
                        >
                          <span className="text-lg font-semibold leading-none">+</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Asset Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="assetType"
                      value={formData.assetType}
                      onChange={handleInputChange}
                      placeholder="e.g., Laptop, Desk, Printer"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter detailed description of the asset"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Purchase Details */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Purchase Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Cost <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="purchaseCost"
                      value={formData.purchaseCost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      placeholder="Enter vendor name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      placeholder="INV-XXXX"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Warranty Expiry Date
                    </label>
                    <input
                      type="date"
                      name="warrantyExpiryDate"
                      value={formData.warrantyExpiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Depreciation */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Depreciation Details</h3>
                
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Depreciation Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="depreciationMethod"
                      value={formData.depreciationMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="Straight Line">Straight Line</option>
                      <option value="Written Down Value">Written Down Value</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Purchase Cost <span className="text-slate-500 text-xs">(From Purchase Tab)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.purchaseCost}
                      readOnly
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Residual Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="residualValue"
                      value={formData.residualValue}
                      onChange={handleInputChange}
                      placeholder="Expected value after usage"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Expected value after useful life</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Useful Life (Years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="usefulLife"
                      value={formData.usefulLife}
                      onChange={handleInputChange}
                      placeholder="Number of years"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Expected lifespan of the asset</p>
                  </div>
                </div>

                {/* Auto-Calculated Fields */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingDown size={16} className="text-blue-600" />
                    Auto-Calculated Values
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Depreciable Amount
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-blue-200">
                        <p className="text-lg font-bold text-slate-900">
                          ₹{depreciableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Purchase Cost - Residual Value</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Yearly Depreciation
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-blue-200">
                        <p className="text-lg font-bold text-slate-900">
                          ₹{yearlyDepreciation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Depreciable Amount / Useful Life</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Current Book Value
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-blue-200">
                        <p className="text-lg font-bold text-slate-900">
                          ₹{currentBookValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">After 1 year depreciation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Asset Location */}
          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Asset Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Office / Branch Name <span className="text-red-500">*</span>
                    </label>
                    {showBranchInput ? (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter office/branch name"
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
                          className="h-10 px-5 bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
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
                      <div className="flex items-center gap-2">
                        <select
                          name="officeBranch"
                          value={formData.officeBranch}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                          <option value="">Select office/branch</option>
                          {branchOptions.map(branch => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowBranchInput(true)}
                          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                          title="Add new office/branch"
                        >
                          <span className="text-lg font-semibold leading-none">+</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    {showDepartmentInput ? (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter department name"
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddDepartment();
                              }
                            }}
                            className="w-full h-10 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                            autoFocus
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddDepartment}
                          className="h-10 px-5 bg-[#002147] hover:bg-[#003366] text-white rounded-lg transition-all font-semibold text-sm shadow-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDepartmentInput(false);
                            setNewDepartmentName('');
                          }}
                          className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors text-xl"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                          <option value="">Select department</option>
                          {departmentOptions.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowDepartmentInput(true)}
                          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                          title="Add new department"
                        >
                          <span className="text-lg font-semibold leading-none">+</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location (Room / Floor) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Floor 3, Room 301"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Asset Assignment */}
          {activeTab === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Asset Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assigned To (Employee Name)
                    </label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      placeholder="Enter employee name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      placeholder="EMP-XXXX"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assigned Date
                    </label>
                    <input
                      type="date"
                      name="assignedDate"
                      value={formData.assignedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Asset Status <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['Available', 'In Use', 'Under Maintenance', 'Damaged', 'Retired'].map((status) => (
                        <label
                          key={status}
                          className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.assetStatus === status
                              ? 'border-[#002147] bg-blue-50 text-[#002147]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="assetStatus"
                            value={status}
                            checked={formData.assetStatus === status}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-sm font-semibold">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 5: Maintenance Details */}
          {activeTab === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Maintenance Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Service Date
                    </label>
                    <input
                      type="date"
                      name="lastServiceDate"
                      value={formData.lastServiceDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Next Service Date
                    </label>
                    <input
                      type="date"
                      name="nextServiceDate"
                      value={formData.nextServiceDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Maintenance Cost
                    </label>
                    <input
                      type="number"
                      name="maintenanceCost"
                      value={formData.maintenanceCost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Service Provider
                    </label>
                    <input
                      type="text"
                      name="serviceProvider"
                      value={formData.serviceProvider}
                      onChange={handleInputChange}
                      placeholder="Enter service provider name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter maintenance notes or special instructions"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 6: Asset Documents */}
          {activeTab === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Asset Documents</h3>
                <div className="space-y-6">
                  {/* Upload Invoice */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Upload Invoice
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-semibold text-slate-700 mb-1">Click to upload invoice</p>
                      <p className="text-xs text-slate-500">PDF, DOC, or image files (Max 10MB)</p>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  {/* Upload Warranty Documents */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Warranty Documents
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-semibold text-slate-700 mb-1">Click to upload warranty documents</p>
                      <p className="text-xs text-slate-500">PDF, DOC, or image files (Max 10MB)</p>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
                    </div>
                  </div>

                  {/* Upload Asset Images */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Images of Asset
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <ImageIcon size={48} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-semibold text-slate-700 mb-1">Click to upload asset images</p>
                      <p className="text-xs text-slate-500">JPG, PNG, or GIF files (Max 5MB each)</p>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <Button
            variant="secondary"
            onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
            disabled={activeTab === 0}
          >
            Previous
          </Button>
          
          {activeTab < tabs.length - 1 ? (
            <Button
              onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
              className="bg-[#002147] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-[#002147] text-white"
              leftIcon={<Save size={16} />}
            >
              Save Asset
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AddAssetPage;
