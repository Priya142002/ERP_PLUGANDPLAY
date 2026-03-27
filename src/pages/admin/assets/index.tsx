import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Archive, MapPin, TrendingDown, RefreshCw, Trash2, Plus, Search, 
  DollarSign, FileText, UserCheck, Hammer, Edit, Download, Eye, BarChart3,
  CheckCircle, AlertCircle, Clock, Package, Settings, X, Upload
} from 'lucide-react';
import '../reports/InventoryReportsPage.css';
import { exportToExcel } from '../../../utils/reportGenerator';

// Types
interface Asset {
  id: number;
  assetCode: string;
  name: string;
  category: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Disposed';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  location: string;
  assignedTo?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  serialNumber?: string;
  description?: string;
}

interface MaintenanceRecord {
  id: number;
  assetId: number;
  assetName: string;
  type: 'Preventive' | 'Corrective' | 'Emergency';
  date: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  technician?: string;
  description: string;
}

// Asset Dashboard Component
export const AssetDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Assets', value: '1,240', icon: Archive, color: 'bg-slate-600', trend: 'Val: ₹2.4Cr', change: '+12%' },
    { label: 'Assets in Use', value: '842', icon: UserCheck, color: 'bg-slate-600', trend: '68% Utilized', change: '+5%' },
    { label: 'Available Assets', value: '386', icon: CheckCircle, color: 'bg-slate-600', trend: '31% Ready', change: '+8%' },
    { label: 'Under Maintenance', value: '12', icon: Hammer, color: 'bg-amber-500', trend: 'Scheduled', change: '-3%' },
    { label: 'Expired Warranty', value: '8', icon: AlertCircle, color: 'bg-rose-600', trend: 'Needs Attention', change: '+2' },
  ];

  const statusBreakdown = [
    { label: 'Excellent Condition', count: 720, percentage: 58, color: 'bg-emerald-500' },
    { label: 'Good Condition', count: 340, percentage: 27, color: 'bg-blue-500' },
    { label: 'Fair Condition', count: 120, percentage: 10, color: 'bg-amber-500' },
    { label: 'Poor Condition', count: 60, percentage: 5, color: 'bg-rose-500' },
  ];

  const handleExportReport = () => {
    try {
      // Export summary statistics
      const summaryData = stats.map(stat => [
        stat.label,
        stat.value,
        stat.trend,
        stat.change
      ]);

      // Export condition breakdown
      const conditionData = statusBreakdown.map(item => [
        item.label,
        item.count.toString(),
        `${item.percentage}%`
      ]);

      exportToExcel(
        [
          {
            sheetName: 'Asset Summary',
            headers: ['Metric', 'Value', 'Trend', 'Change'],
            data: summaryData
          },
          {
            sheetName: 'Asset Condition',
            headers: ['Condition', 'Count', 'Percentage'],
            data: conditionData
          }
        ],
        'Asset_Dashboard_Report_Mar_2026'
      );

      console.log('Asset dashboard report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Intelligence Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Full-lifecycle resource tracking & depreciation monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-slate-600">Fiscal: Mar 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg" leftIcon={<Download size={14} />} onClick={handleExportReport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#002147]" />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') && !stat.change.includes('Attention') ? 'bg-emerald-50 text-emerald-600' : stat.change.startsWith('-') ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-5">Asset Condition Overview</h3>
          <div className="space-y-4">
            {statusBreakdown.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{item.count}</span>
                    <span className="text-xs text-slate-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Asset', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Assign Asset', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Schedule Maintenance', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'View Reports', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((action, i) => (
              <button key={i} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 hover:shadow-md hover:bg-white transition-all">
                <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center ${action.color}`}>
                  <action.icon size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Asset Management Page Component
export const AssetManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    condition: 'all',
    location: 'all',
  });

  // Mock data
  const mockAssets: Asset[] = [
    { id: 1, assetCode: 'ASST-1001', name: 'Enterprise Workstation M-01', category: 'IT Hardware', status: 'In Use', condition: 'Excellent', location: 'Main HUB, Floor 1', assignedTo: 'John Doe', purchaseDate: '2024-01-15', purchasePrice: 85000, currentValue: 75000, serialNumber: 'SN-1001-2024' },
    { id: 2, assetCode: 'ASST-1002', name: 'Conference Table', category: 'Furniture', status: 'Available', condition: 'Good', location: 'Main HUB, Floor 2', purchaseDate: '2023-06-20', purchasePrice: 45000, currentValue: 38000 },
    { id: 3, assetCode: 'ASST-1003', name: 'Delivery Van', category: 'Vehicles', status: 'In Use', condition: 'Good', location: 'Warehouse', assignedTo: 'Transport Dept', purchaseDate: '2023-03-10', purchasePrice: 850000, currentValue: 720000, serialNumber: 'VH-2023-001' },
    { id: 4, assetCode: 'ASST-1004', name: 'Laptop Dell XPS', category: 'IT Hardware', status: 'Maintenance', condition: 'Fair', location: 'IT Department', purchaseDate: '2022-11-05', purchasePrice: 95000, currentValue: 55000 },
    { id: 5, assetCode: 'ASST-1005', name: 'Office Desk Unit', category: 'Furniture', status: 'Available', condition: 'Excellent', location: 'Branch Office', purchaseDate: '2024-02-28', purchasePrice: 25000, currentValue: 24000 },
  ];

  const handleEdit = (asset: Asset) => {
    navigate('/admin/assets/add');
  };

  const handleDelete = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDeleteModal(true);
  };

  const handleAssign = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssignModal(true);
  };

  const handleExport = () => {
    try {
      console.log('Export button clicked');
      console.log('Filtered assets:', filteredAssets);
      
      const exportData = filteredAssets.map(asset => [
        asset.assetCode,
        asset.name,
        asset.category,
        asset.status,
        asset.condition,
        asset.location,
        asset.assignedTo || '-',
        asset.purchaseDate,
        `₹${asset.purchasePrice.toLocaleString()}`,
        `₹${asset.currentValue.toLocaleString()}`,
      ]);

      console.log('Export data prepared:', exportData);

      exportToExcel(
        [
          {
            sheetName: 'Assets',
            headers: ['Asset Code', 'Name', 'Category', 'Status', 'Condition', 'Location', 'Assigned To', 'Purchase Date', 'Purchase Price', 'Current Value'],
            data: exportData
          }
        ],
        'Asset_Management_Report_Mar_2026'
      );

      console.log('Assets exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + (error as Error).message);
    }
  };

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || asset.category === filters.category;
    const matchesStatus = filters.status === 'all' || asset.status === filters.status;
    const matchesCondition = filters.condition === 'all' || asset.condition === filters.condition;
    const matchesLocation = filters.location === 'all' || asset.location.includes(filters.location);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCondition && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      'Available': 'success',
      'In Use': 'info',
      'Maintenance': 'warning',
      'Disposed': 'error',
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  const getConditionBadge = (condition: string) => {
    const colors: Record<string, string> = {
      'Excellent': 'bg-emerald-100 text-emerald-700',
      'Good': 'bg-blue-100 text-blue-700',
      'Fair': 'bg-amber-100 text-amber-700',
      'Poor': 'bg-rose-100 text-rose-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[condition]}`}>
        {condition}
      </span>
    );
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track all company assets</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="px-5 h-10 rounded-xl" leftIcon={<Download size={14} />} onClick={handleExport}>
              Export
            </Button>
            <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Plus size={14} />} onClick={() => navigate('/admin/assets/add')}>
              Add Asset
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by code, name, or serial number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#002147] text-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Asset Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                          <p className="text-xs text-slate-500">{asset.assetCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{asset.category}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                    <td className="px-6 py-4">{getConditionBadge(asset.condition)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <MapPin size={14} className="text-slate-400" />
                        {asset.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{asset.assignedTo || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(asset)} className="p-2 bg-white border border-[#002147] text-[#002147] hover:bg-[#002147] hover:text-white rounded-lg transition" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(asset)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Items Count at Bottom */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400 font-medium">
              {filteredAssets.length} {filteredAssets.length === 1 ? 'item' : 'items'} shown
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFiltersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Filter Assets</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option value="all">All Categories</option>
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Equipment">Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option value="all">All Status</option>
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Disposed">Disposed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
                    <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option value="all">All Conditions</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <select value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option value="all">All Locations</option>
                      <option value="Main HUB">Main HUB</option>
                      <option value="Branch Office">Branch Office</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="secondary" onClick={() => setFilters({ category: 'all', status: 'all', condition: 'all', location: 'all' })}>
                  Clear Filters
                </Button>
                <Button onClick={() => setShowFiltersModal(false)} className="bg-[#002147] text-white">
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-slate-900">Add New Asset</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Name *</label>
                    <input type="text" placeholder="Enter asset name" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Code *</label>
                    <input type="text" placeholder="ASST-XXXX" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Select category</option>
                      <option>IT Hardware</option>
                      <option>Furniture</option>
                      <option>Vehicles</option>
                      <option>Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Date *</label>
                    <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Price *</label>
                    <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Value</label>
                    <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                    <input type="text" placeholder="Enter location" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Serial Number</label>
                    <input type="text" placeholder="Enter serial number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Condition *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Available</option>
                      <option>In Use</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea rows={3} placeholder="Enter asset description" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAddModal(false)} className="bg-[#002147] text-white">Create Asset</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Asset Modal */}
      <AnimatePresence>
        {showEditModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-slate-900">Edit Asset</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Name *</label>
                    <input type="text" defaultValue={selectedAsset.name} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Code *</label>
                    <input type="text" defaultValue={selectedAsset.assetCode} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                    <select defaultValue={selectedAsset.category} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>IT Hardware</option>
                      <option>Furniture</option>
                      <option>Vehicles</option>
                      <option>Equipment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                    <input type="text" defaultValue={selectedAsset.location} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Condition *</label>
                    <select defaultValue={selectedAsset.condition} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                    <select defaultValue={selectedAsset.status} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Available</option>
                      <option>In Use</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button onClick={() => setShowEditModal(false)} className="bg-[#002147] text-white">Update Asset</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-md" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Asset</h3>
                <p className="text-sm text-slate-600 text-center mb-6">
                  Are you sure you want to delete <span className="font-semibold">{selectedAsset.name}</span>? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
                  <Button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Asset Modal */}
      <AnimatePresence>
        {showAssignModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Assign Asset</h3>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Asset:</span> {selectedAsset.name} ({selectedAsset.assetCode})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To *</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option>Select employee or department</option>
                    <option>John Doe - IT Department</option>
                    <option>Jane Smith - HR Department</option>
                    <option>Transport Department</option>
                    <option>Sales Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assignment Date *</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea rows={3} placeholder="Add any notes about this assignment" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button onClick={() => setShowAssignModal(false)} className="bg-[#002147] text-white">Assign Asset</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Maintenance Tracking Page Component
export const MaintenancePage: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);

  const mockMaintenanceRecords: MaintenanceRecord[] = [
    { id: 1, assetId: 1, assetName: 'Enterprise Workstation M-01', type: 'Preventive', date: '2026-04-15', cost: 5000, status: 'Scheduled', technician: 'Tech Team A', description: 'Routine hardware check and cleaning' },
    { id: 2, assetId: 3, assetName: 'Delivery Van', type: 'Corrective', date: '2026-03-28', cost: 15000, status: 'In Progress', technician: 'Auto Service Center', description: 'Engine oil change and brake inspection' },
    { id: 3, assetId: 4, assetName: 'Laptop Dell XPS', type: 'Emergency', date: '2026-03-25', cost: 8000, status: 'Completed', technician: 'Tech Team B', description: 'Screen replacement and battery service' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Scheduled': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-amber-100 text-amber-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Preventive': 'bg-blue-50 text-blue-600',
      'Corrective': 'bg-amber-50 text-amber-600',
      'Emergency': 'bg-rose-50 text-rose-600',
    };
    return colors[type] || 'bg-slate-50 text-slate-600';
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance Tracking</h1>
            <p className="text-slate-500 text-sm mt-1">Schedule and track asset maintenance activities</p>
          </div>
          <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Hammer size={14} />} onClick={() => setShowScheduleModal(true)}>
            Schedule Maintenance
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Scheduled</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Settings size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Completed</p>
                <p className="text-2xl font-bold text-slate-900">45</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#002147] text-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockMaintenanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <Hammer size={20} className="text-amber-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{record.assetName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{new Date(record.date).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{record.technician}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">₹{record.cost.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedMaintenance(record); setShowDetailsModal(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="View Details">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Schedule Maintenance Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Schedule Maintenance</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Asset *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Select asset</option>
                      <option>ASST-1001 - Enterprise Workstation M-01</option>
                      <option>ASST-1003 - Delivery Van</option>
                      <option>ASST-1004 - Laptop Dell XPS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Maintenance Type *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Preventive</option>
                      <option>Corrective</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled Date *</label>
                    <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Cost</label>
                    <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned Technician</label>
                    <input type="text" placeholder="Enter technician name" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                    <textarea rows={3} placeholder="Describe the maintenance work" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                <Button onClick={() => setShowScheduleModal(false)} className="bg-[#002147] text-white">Schedule</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maintenance Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedMaintenance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Maintenance Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Asset:</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedMaintenance.assetName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Type:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedMaintenance.type)}`}>
                      {selectedMaintenance.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMaintenance.status)}`}>
                      {selectedMaintenance.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Date:</span>
                    <span className="text-sm font-semibold text-slate-900">{new Date(selectedMaintenance.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Technician:</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedMaintenance.technician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Cost:</span>
                    <span className="text-sm font-semibold text-slate-900">₹{selectedMaintenance.cost.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">Description:</p>
                    <p className="text-sm text-slate-900">{selectedMaintenance.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button onClick={() => setShowDetailsModal(false)} className="bg-[#002147] text-white">Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Asset Depreciation Page Component
export const AssetDepreciationPage: React.FC = () => {
  const [showRecalculateModal, setShowRecalculateModal] = useState(false);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Depreciation</h1>
            <p className="text-slate-500 text-sm mt-1">Track asset value depreciation over time</p>
          </div>
          <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<RefreshCw size={14} />} onClick={() => setShowRecalculateModal(true)}>
            Recalculate Values
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <DollarSign size={24} className="text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Total Book Value</p>
            <p className="text-2xl font-bold text-slate-900">₹1.8 Cr</p>
            <p className="text-xs text-slate-500 mt-1">Current valuation</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <TrendingDown size={24} className="text-rose-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Annual Depreciation</p>
            <p className="text-2xl font-bold text-slate-900">₹42.3 L</p>
            <p className="text-xs text-slate-500 mt-1">This fiscal year</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Archive size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Depreciating Assets</p>
            <p className="text-2xl font-bold text-slate-900">420</p>
            <p className="text-xs text-slate-500 mt-1">Active assets</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-5">Depreciation Trend</h3>
          <div className="aspect-[16/6] bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <BarChart3 size={48} className="mx-auto mb-2" />
              <p className="text-sm">Depreciation chart visualization</p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRecalculateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Recalculate Depreciation</h3>
                <button onClick={() => setShowRecalculateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    This will recalculate depreciation values for all active assets based on current fiscal period settings.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Method:</span>
                    <span className="text-sm font-semibold text-slate-900">Straight-Line</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Assets:</span>
                    <span className="text-sm font-semibold text-slate-900">420 Units</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Period:</span>
                    <span className="text-sm font-semibold text-slate-900">Mar 2026</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="secondary" onClick={() => setShowRecalculateModal(false)}>Cancel</Button>
                <Button onClick={() => setShowRecalculateModal(false)} className="bg-[#002147] text-white">Confirm</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Asset Disposal Page Component
export const AssetDisposalPage: React.FC = () => {
  const [showDisposalModal, setShowDisposalModal] = useState(false);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Disposal</h1>
            <p className="text-slate-500 text-sm mt-1">Manage asset disposal and write-offs</p>
          </div>
          <Button className="bg-[#002147] text-white px-6 h-10 rounded-xl" leftIcon={<Trash2 size={14} />} onClick={() => setShowDisposalModal(true)}>
            Record Disposal
          </Button>
        </div>

        <div className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingDown size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Disposal Records</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            No assets have been disposed in the current period. All retired assets must undergo proper disposal procedures.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDisposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Record Asset Disposal</h3>
                <button onClick={() => setShowDisposalModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900">
                    <strong>Warning:</strong> Disposing an asset will remove it from active inventory. This action should be carefully documented.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Asset *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Select asset to dispose</option>
                      <option>ASST-1001 - Enterprise Workstation M-01</option>
                      <option>ASST-1002 - Conference Table</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Disposal Date *</label>
                    <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Disposal Method *</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                      <option>Sale</option>
                      <option>Scrap</option>
                      <option>Donation</option>
                      <option>Write-off</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sale/Scrap Value</label>
                    <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Buyer/Recipient</label>
                    <input type="text" placeholder="Enter name" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Remarks</label>
                    <textarea rows={3} placeholder="Add disposal notes" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <Button variant="secondary" onClick={() => setShowDisposalModal(false)}>Cancel</Button>
                <Button onClick={() => setShowDisposalModal(false)} className="bg-red-600 hover:bg-red-700 text-white">Record Disposal</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Asset Reports Page Component
export const AssetReportsPage: React.FC = () => {
  interface FilterField { key: string; label: string; type: "text" | "date" | "select"; options?: string[]; }
  interface Report { id: string; name: string; icon: React.ReactNode; filters: FilterField[]; }

  const CATEGORIES = ["IT Hardware", "Furniture", "Vehicles", "Equipment", "Machinery"];
  const LOCATIONS = ["Main HUB", "Branch Office", "Warehouse", "IT Department"];
  const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
  const STATUS = ["Available", "In Use", "Maintenance", "Disposed"];

  const REPORTS: Report[] = [
    {
      id: "asset-inventory",
      name: "Asset Inventory Report",
      icon: <FileText size={16} />,
      filters: [
        { key: "category", label: "Category", type: "select", options: CATEGORIES },
        { key: "location", label: "Location", type: "select", options: LOCATIONS },
        { key: "status", label: "Status", type: "select", options: STATUS },
        { key: "date_from", label: "Date From", type: "date" },
        { key: "date_to", label: "Date To", type: "date" },
      ],
    },
    {
      id: "depreciation-report",
      name: "Depreciation Report",
      icon: <TrendingDown size={16} />,
      filters: [
        { key: "category", label: "Category", type: "select", options: CATEGORIES },
        { key: "date_from", label: "Date From", type: "date" },
        { key: "date_to", label: "Date To", type: "date" },
      ],
    },
    {
      id: "maintenance-cost",
      name: "Maintenance Cost Report",
      icon: <Hammer size={16} />,
      filters: [
        { key: "category", label: "Category", type: "select", options: CATEGORIES },
        { key: "date_from", label: "Date From", type: "date" },
        { key: "date_to", label: "Date To", type: "date" },
      ],
    },
    {
      id: "asset-utilization",
      name: "Asset Utilization Report",
      icon: <BarChart3 size={16} />,
      filters: [
        { key: "category", label: "Category", type: "select", options: CATEGORIES },
        { key: "location", label: "Location", type: "select", options: LOCATIONS },
        { key: "date_from", label: "Date From", type: "date" },
        { key: "date_to", label: "Date To", type: "date" },
      ],
    },
    {
      id: "asset-condition",
      name: "Asset Condition Report",
      icon: <CheckCircle size={16} />,
      filters: [
        { key: "condition", label: "Condition", type: "select", options: CONDITIONS },
        { key: "category", label: "Category", type: "select", options: CATEGORIES },
        { key: "date_from", label: "As of Date", type: "date" },
      ],
    },
    {
      id: "asset-assignment",
      name: "Asset Assignment Report",
      icon: <UserCheck size={16} />,
      filters: [
        { key: "location", label: "Location", type: "select", options: LOCATIONS },
        { key: "status", label: "Status", type: "select", options: STATUS },
        { key: "date_from", label: "Date From", type: "date" },
        { key: "date_to", label: "Date To", type: "date" },
      ],
    },
  ];

  const fieldCls = "w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

  const ReportPanel: React.FC<{ report: Report }> = ({ report }) => {
    const init = () => Object.fromEntries(report.filters.flatMap(f => [[f.key, ""]]));
    const [values, setValues] = useState<Record<string, string>>(init);
    const set = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }));
    const hasFilters = Object.values(values).some(v => v !== "");

    return (
      <motion.div key={report.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">{report.icon}</div>
            <h2 className="font-bold text-slate-800 text-sm">{report.name}</h2>
          </div>
          <div className="flex items-center gap-2 reports-actions">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Upload size={13} /> Upload</button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"><Download size={13} /> Download</button>
            <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={13} /> Show</button>
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Filters & Parameters</p>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white reports-filters">
            {report.filters.map((f, idx) => {
              const isLast = idx === report.filters.length - 1;
              const renderField = (key: string) => f.type === "select"
                ? <select className={fieldCls} value={values[key]} onChange={e => set(key, e.target.value)}><option value="">— Select —</option>{f.options?.map(o => <option key={o} value={o}>{o}</option>)}</select>
                : f.type === "date"
                  ? <input type="date" className={fieldCls} value={values[key]} onChange={e => set(key, e.target.value)} />
                  : <input type="text" className={fieldCls} placeholder={`Enter ${f.label.toLowerCase()}…`} value={values[key]} onChange={e => set(key, e.target.value)} />;
              return (
                <div key={f.key} className={`flex items-center gap-3 px-5 py-3 ${!isLast ? "border-b border-slate-100" : ""} bg-slate-50/20`}>
                  <span className="text-xs font-semibold text-slate-700 min-w-[150px]">{f.label}</span>
                  <div className="flex-1 max-w-md">{renderField(f.key)}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-5 reports-actions">
            {hasFilters ? <button onClick={() => setValues(init())} className="text-xs text-slate-400 hover:text-rose-500 transition font-medium">Clear filters</button> : <span />}
            <button className="flex items-center gap-2 h-9 px-5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition"><Eye size={14} /> Generate Report</button>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-400 mb-3">{report.icon}</div>
            <p className="text-sm font-semibold text-slate-500">Set filters and click <span className="text-indigo-600">Generate Report</span></p>
            <p className="text-xs text-slate-400 mt-1">Report data will appear here</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const [activeId, setActiveId] = useState(REPORTS[0].id);
  const active = REPORTS.find(r => r.id === activeId)!;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Reports</h1>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"><Download size={14} /> Export Summary</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
        <div className="report-sidebar">
          <div className="report-sidebar-header">
            <p className="report-sidebar-title">Report Type</p>
          </div>
          <div className="report-nav">
            <nav className="report-nav-list">
              {REPORTS.map(r => {
                const isActive = activeId === r.id;
                return (
                  <button key={r.id} onClick={() => setActiveId(r.id)}
                    className={`report-item ${isActive ? 'report-item-active' : ''}`}>
                    <span className="report-item-icon">{r.icon}</span>
                    <span className="report-item-text">{r.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <ReportPanel key={activeId} report={active} />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// Export AddAssetPage
export { default as AddAssetPage } from './AddAssetPage';
