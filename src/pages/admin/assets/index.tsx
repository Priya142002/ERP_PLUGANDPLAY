import React from 'react';
import Badge from '../../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Archive, 
  MapPin, 
  TrendingDown, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  FileText,
  UserCheck,
  Zap,
  Hammer,
  Edit,
  Upload,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import '../reports/InventoryReportsPage.css';

// --- Asset Intelligence (Dashboard) ---
export const AssetDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Enterprise Assets', value: '1,240', icon: Archive, color: 'bg-blue-600', trend: 'Val: $2.4M' },
    { label: 'Asset Allocation', value: '842', icon: UserCheck, color: 'bg-slate-600', trend: '68% Utilized' },
    { label: 'Critical Servicing', value: '12', icon: Hammer, color: 'bg-amber-500', trend: 'Scheduled' },
    { label: 'Net Book Value', value: '$1.8M', icon: RefreshCw, color: 'bg-indigo-600', trend: 'Synced' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Intelligence Hub</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">FULL-LIFECYCLE RESOURCE TRACKING & DEPRECIATION MONITORING</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-slate-600 font-bold text-xs">
            <Calendar size={14} className="text-blue-600" />
            <span>Fiscal Cycle: Mar 2026</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg">
            Generate Asset Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden ${stat.color}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color}/10 flex items-center justify-center ${stat.color.replace('bg-', 'text-')} rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm text-slate-600 border border-slate-100 transition-colors`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Asset Performance & Conditioning</h3>
            <div className="space-y-3">
                {[
                  { label: 'Optimized Flow', status: 'Excellent', count: 720, progress: 92, color: 'bg-emerald-500' },
                  { label: 'Stable Usage', status: 'Good', count: 340, progress: 75, color: 'bg-blue-500' },
                  { label: 'Servicing Pending', status: 'Fair', count: 120, progress: 45, color: 'bg-amber-500' },
                  { label: 'Critical Health', status: 'Poor', count: 60, progress: 15, color: 'bg-rose-500' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group/item">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover/item:scale-110 transition-transform`}><Zap size={16} className={item.color.replace('bg-', 'text-')} /></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 transition-colors">{item.label}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.status} Conditioning</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-bold text-slate-900">{item.count}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Asset Count</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Strategic Asset Actions</h3>
            <div className="flex-1 space-y-3">
                {[
                    { label: 'Initialize New Asset', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Dispatch Global Allocation', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Schedule Fleet Maintenance', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Process Financial Disposal', icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((act, i) => (
                    <button key={i} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 hover:shadow-md hover:bg-white transition-all group/btn">
                         <div className={`w-10 h-10 rounded-xl ${act.bg} flex items-center justify-center ${act.color} border border-slate-100 group-hover/btn:scale-110 transition-transform`}><act.icon size={18} /></div>
                         <span className="text-sm font-bold text-slate-900 text-left">{act.label}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Asset Management & Allocation ---
export const AssetManagePage: React.FC = () => {
    const [showFiltersModal, setShowFiltersModal] = React.useState(false);
    const [showOnboardModal, setShowOnboardModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [selectedAsset, setSelectedAsset] = React.useState<any>(null);

    const handleEdit = (assetId: number) => {
        setSelectedAsset(assetId);
        setShowEditModal(true);
    };

    const handleDelete = (assetId: number) => {
        setSelectedAsset(assetId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Handle delete logic here
        setShowDeleteModal(false);
        setSelectedAsset(null);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Management Suite</h1>
                        <p className="text-slate-500 text-sm mt-1">Create, edit, and allocate corporate resources across departments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="secondary" 
                            className="px-5 h-10 rounded-xl" 
                            leftIcon={<Filter size={14} />}
                            onClick={() => setShowFiltersModal(true)}
                        >
                            Advanced Filters
                        </Button>
                        <Button 
                            className="bg-[#002147] text-white px-6 h-10 rounded-xl" 
                            leftIcon={<Plus size={14} />}
                            onClick={() => setShowOnboardModal(true)}
                        >
                            Onboard Asset
                        </Button>
                    </div>
                </div>

                {/* Search Input - Outside Table */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by Asset Code, Name, Serials..." 
                            className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#002147] text-white uppercase tracking-[0.15em] text-[10px] font-bold">
                                <th className="px-8 py-4 text-left border-none">Asset Catalog Info</th>
                                <th className="px-6 py-4 text-left border-none">Condition & Utilization</th>
                                <th className="px-6 py-4 text-left border-none">Active Location</th>
                                <th className="px-6 py-4 text-left border-none">Allocation Status</th>
                                <th className="px-8 py-4 text-right border-none">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center font-mono text-[9px] font-bold text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                <span>ASST</span>
                                                <span className="text-slate-400">-{i}00{i}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">Enterprise Workstation M-0{i}</p>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Category: IT Hardware</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={i % 3 === 0 ? 'success' : 'info'} className="text-[9px] tracking-widest">ECO-SYSTEM {i % 2 === 0 ? 'OPTIMAL' : 'GOOD'}</Badge>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Usage: {85 - i*4}%</p>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-700 text-xs italic"><div className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> Main HUB, Floor {i}</div></td>
                                    <td className="px-6 py-5"><Badge variant={i % 2 === 0 ? 'primary' : 'secondary'}>{i % 2 === 0 ? 'ALLOCATED' : 'AVAILABLE'}</Badge></td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(i)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg transition bg-[#002147] hover:bg-[#003366] text-white border border-[#002147]"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(i)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg transition bg-red-600 hover:bg-red-700 text-white border border-red-600"
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
            </motion.div>

            {/* Advanced Filters Modal */}
            <AnimatePresence>
                {showFiltersModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Filter size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Advanced Filters</h3>
                                </div>
                                <button
                                    onClick={() => setShowFiltersModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Asset Category</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>All Categories</option>
                                            <option>IT Hardware</option>
                                            <option>Furniture</option>
                                            <option>Vehicles</option>
                                            <option>Equipment</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Allocation Status</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>All Status</option>
                                            <option>Allocated</option>
                                            <option>Available</option>
                                            <option>Under Maintenance</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>All Conditions</option>
                                            <option>Excellent</option>
                                            <option>Good</option>
                                            <option>Fair</option>
                                            <option>Poor</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>All Locations</option>
                                            <option>Main HUB</option>
                                            <option>Branch Office</option>
                                            <option>Warehouse</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Purchase Date Range</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="date" className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                            <input type="date" className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowFiltersModal(false)}
                                    className="px-6"
                                >
                                    Clear Filters
                                </Button>
                                <Button
                                    onClick={() => setShowFiltersModal(false)}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Onboard Asset Modal */}
            <AnimatePresence>
                {showOnboardModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Plus size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Onboard New Asset</h3>
                                </div>
                                <button
                                    onClick={() => setShowOnboardModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Asset Name *</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter asset name"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Asset Code *</label>
                                            <input 
                                                type="text" 
                                                placeholder="ASST-0001"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>Select category</option>
                                                <option>IT Hardware</option>
                                                <option>Furniture</option>
                                                <option>Vehicles</option>
                                                <option>Equipment</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Purchase Date *</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Purchase Value *</label>
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>Select location</option>
                                                <option>Main HUB, Floor 1</option>
                                                <option>Main HUB, Floor 2</option>
                                                <option>Branch Office</option>
                                                <option>Warehouse</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Serial Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter serial number"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Enter asset description"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowOnboardModal(false)}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowOnboardModal(false)}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                >
                                    Create Asset
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Asset Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Edit size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Edit Asset</h3>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Asset Name *</label>
                                            <input 
                                                type="text" 
                                                defaultValue={`Enterprise Workstation M-0${selectedAsset}`}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Asset Code *</label>
                                            <input 
                                                type="text" 
                                                defaultValue={`ASST-${selectedAsset}00${selectedAsset}`}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>IT Hardware</option>
                                                <option>Furniture</option>
                                                <option>Vehicles</option>
                                                <option>Equipment</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>Main HUB, Floor {selectedAsset}</option>
                                                <option>Main HUB, Floor 1</option>
                                                <option>Main HUB, Floor 2</option>
                                                <option>Branch Office</option>
                                                <option>Warehouse</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Serial Number</label>
                                        <input 
                                            type="text" 
                                            defaultValue={`SN-${selectedAsset}00${selectedAsset}-2024`}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea 
                                            rows={3}
                                            defaultValue="High-performance enterprise workstation for IT operations"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                >
                                    Update Asset
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                        <Trash2 size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Delete Asset</h3>
                                </div>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-red-900 font-medium">
                                        Are you sure you want to delete this asset? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Asset Code:</span>
                                        <span className="text-slate-900 font-bold">ASST-{selectedAsset}00{selectedAsset}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Asset Name:</span>
                                        <span className="text-slate-900 font-bold">Enterprise Workstation M-0{selectedAsset}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Category:</span>
                                        <span className="text-slate-900 font-bold">IT Hardware</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-8 min-w-[120px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 min-w-[140px] shadow-lg shadow-red-900/20"
                                >
                                    Delete Asset
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- Asset Depreciation Engine ---
export const AssetDepreciationPage: React.FC = () => {
    const [showRecalculateModal, setShowRecalculateModal] = React.useState(false);
    const [isCalculating, setIsCalculating] = React.useState(false);

    const handleRecalculate = () => {
        setIsCalculating(true);
        // Simulate calculation process
        setTimeout(() => {
            setIsCalculating(false);
            setShowRecalculateModal(false);
            // Show success message or update values
        }, 2000);
    };

    const handleOpenModal = () => {
        console.log('Opening recalculate modal');
        setShowRecalculateModal(true);
    };

    console.log('showRecalculateModal:', showRecalculateModal);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Asset Depreciation</h1>
                        <p className="text-slate-500 text-sm mt-1">Automated calculation & residual value monitoring</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                            <Calendar size={14} className="text-blue-600" />
                            <span className="text-xs font-bold text-slate-600">Fiscal: Mar 2026</span>
                        </div>
                        <Button 
                            onClick={handleOpenModal}
                            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10" 
                            leftIcon={<RefreshCw size={14} />}
                        >
                            Recalculate Net Book Value
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Historical Depreciation Stream</h3>
                        <div className="aspect-[16/9] bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                            <div className="text-center">
                                <TrendingDown size={32} className="mx-auto mb-2 text-slate-300" />
                                <p className="font-medium">Visualizing depreciation trends...</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-600" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Depreciation Setup Metrics</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Calculated Residual Value', value: '$840,200', desc: 'Net asset value after current cycle', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Cycle Depreciation Charge', value: '$42,300', desc: 'Debit to operational expenses', icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
                                { label: 'Active Asset Base', value: '420 Units', desc: 'Subject to straight-line reduction', icon: Archive, color: 'text-blue-600', bg: 'bg-blue-50' },
                            ].map((st, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md hover:bg-white transition-all cursor-pointer group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{st.label}</p>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{st.value}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">{st.desc}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl ${st.bg} ${st.color} flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform`}>
                                            <st.icon size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Recalculate Modal */}
            <AnimatePresence>
                {showRecalculateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <RefreshCw size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Recalculate Net Book Value</h3>
                                </div>
                                <button
                                    onClick={() => setShowRecalculateModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm text-blue-900 font-medium">
                                        This will recalculate depreciation values for all active assets based on current fiscal period settings.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-600 font-medium">Depreciation Method</span>
                                        <span className="text-sm text-slate-900 font-bold">Straight-Line</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-600 font-medium">Assets to Process</span>
                                        <span className="text-sm text-slate-900 font-bold">420 Units</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-600 font-medium">Fiscal Period</span>
                                        <span className="text-sm text-slate-900 font-bold">Mar 2026</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-xs text-amber-900 font-medium">
                                        ⚠️ This action will update all depreciation records. Previous calculations will be archived.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowRecalculateModal(false)}
                                    disabled={isCalculating}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRecalculate}
                                    disabled={isCalculating}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                    leftIcon={isCalculating ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                >
                                    {isCalculating ? 'Calculating...' : 'Confirm Recalculation'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- Asset Maintenance & Repair ---
export const MaintenancePage: React.FC = () => {
    const [showScheduleModal, setShowScheduleModal] = React.useState(false);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance & Repair Logs</h1>
                        <p className="text-slate-500 text-sm mt-1">Coordinate scheduled servicing and log maintenance events</p>
                    </div>
                    <Button 
                        onClick={() => setShowScheduleModal(true)}
                        className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/10" 
                        leftIcon={<Hammer size={14} />}
                    >
                        Schedule Service
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600" />
                            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm border border-orange-100">
                                        <Hammer size={18} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase">Service B-{i}02</h4>
                                </div>
                                <Badge variant="warning" className="text-[9px]">PENDING</Badge>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Associated Asset</p>
                                    <h4 className="text-sm font-bold text-slate-900">Enterprise Chassis-Q{i}</h4>
                                </div>
                                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Last: Mar 10</span>
                                    <span className="text-blue-600">ETA: Oct 1{i}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Schedule Service Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <Hammer size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Schedule Service</h3>
                                </div>
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Service ID *</label>
                                            <input 
                                                type="text" 
                                                placeholder="SERVICE-B-XXX"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Service Type *</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>Select service type</option>
                                                <option>Preventive Maintenance</option>
                                                <option>Corrective Maintenance</option>
                                                <option>Emergency Repair</option>
                                                <option>Inspection</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Associated Asset *</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Select asset</option>
                                            <option>Enterprise Chassis-Q1</option>
                                            <option>Enterprise Chassis-Q2</option>
                                            <option>Enterprise Chassis-Q3</option>
                                            <option>Enterprise Workstation M-01</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Scheduled Date *</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Duration</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., 2 hours"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Technician</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter technician name"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Service Description</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Describe the maintenance work to be performed"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Normal</option>
                                            <option>High</option>
                                            <option>Urgent</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                >
                                    Schedule Service
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- Asset Disposal ---
export const AssetDisposalPage: React.FC = () => {
    const [showScrapModal, setShowScrapModal] = React.useState(false);
    const [showSellModal, setShowSellModal] = React.useState(false);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset Disposal Control</h1>
                        <p className="text-slate-500 text-sm mt-1">Process asset sales, scrapping, and financial de-registration</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowScrapModal(true)}
                            className="flex items-center gap-2 px-6 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm font-medium text-sm min-w-[160px]"
                        >
                            <Trash2 size={14} />
                            <span>Scrap Asset</span>
                        </button>
                        <Button 
                            onClick={() => setShowSellModal(true)}
                            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/10 min-w-[200px]" 
                            leftIcon={<DollarSign size={14} />}
                        >
                            Sell Asset Product
                        </Button>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm">
                     <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingDown size={40} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">No Disposal Events</h3>
                     <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                        No disposal events triggered in the current audit cycle. All retired assets must undergo financial scrutiny before de-registration.
                     </p>
                </div>
            </motion.div>

            {/* Scrap Asset Modal */}
            <AnimatePresence>
                {showScrapModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                        <Trash2 size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Scrap Asset</h3>
                                </div>
                                <button
                                    onClick={() => setShowScrapModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-amber-800">
                                        <strong>Warning:</strong> Scrapping an asset will write it off as having no resale value. This action will remove the asset from your books and cannot be undone.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Asset to Scrap *</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Select an asset</option>
                                            <option>ASST-1001 - Enterprise Workstation M-01</option>
                                            <option>ASST-1002 - Enterprise Workstation M-02</option>
                                            <option>ASST-1003 - Office Desk Unit</option>
                                            <option>ASST-1004 - Conference Table</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Disposal Date *</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Scrap Value</label>
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Scrapping *</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Select reason</option>
                                            <option>Beyond Repair</option>
                                            <option>Obsolete</option>
                                            <option>Damaged</option>
                                            <option>End of Useful Life</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Disposal Method</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Select method</option>
                                            <option>Recycling</option>
                                            <option>Landfill</option>
                                            <option>Donation</option>
                                            <option>Destruction</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Additional notes about the disposal"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowScrapModal(false)}
                                    className="px-6 min-w-[120px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowScrapModal(false)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 min-w-[160px]"
                                >
                                    Confirm Scrap
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Sell Asset Modal */}
            <AnimatePresence>
                {showSellModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <DollarSign size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Sell Asset Product</h3>
                                </div>
                                <button
                                    onClick={() => setShowSellModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        Record the sale of an asset to recover its remaining value. The sale will be recorded in your financial records.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Asset to Sell *</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Select an asset</option>
                                            <option>ASST-1001 - Enterprise Workstation M-01</option>
                                            <option>ASST-1002 - Enterprise Workstation M-02</option>
                                            <option>ASST-1003 - Office Desk Unit</option>
                                            <option>ASST-1004 - Conference Table</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Sale Date *</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Sale Price *</label>
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Buyer Name *</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter buyer name"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Buyer Contact</label>
                                            <input 
                                                type="text" 
                                                placeholder="Phone or email"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                                            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                                <option>Select method</option>
                                                <option>Cash</option>
                                                <option>Bank Transfer</option>
                                                <option>Check</option>
                                                <option>Credit Card</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Invoice/Receipt Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter invoice number"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Sale Notes</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Additional notes about the sale"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowSellModal(false)}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowSellModal(false)}
                                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
                                >
                                    Record Sale
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- Asset Reports ---
interface AssetReportFilter {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: string[];
}

interface AssetReport {
    id: string;
    name: string;
    icon: React.ReactNode;
    filters: AssetReportFilter[];
}

export const AssetReportsPage: React.FC = () => {
    const [activeReportId, setActiveReportId] = React.useState<string>('lifetime-value');

    const assetReports: AssetReport[] = [
        {
            id: 'lifetime-value',
            name: 'Lifetime Value Report',
            icon: <TrendingDown size={16} />,
            filters: [
                { key: 'asset_category', label: 'Asset Category', type: 'select' as const, options: ['All Categories', 'IT Hardware', 'Furniture', 'Vehicles', 'Equipment'] },
                { key: 'date_from', label: 'Date From', type: 'date' as const },
                { key: 'date_to', label: 'Date To', type: 'date' as const },
            ]
        },
        {
            id: 'depreciation-summary',
            name: 'Depreciation Summary',
            icon: <RefreshCw size={16} />,
            filters: [
                { key: 'fiscal_period', label: 'Fiscal Period', type: 'select' as const, options: ['Current Month', 'Last Month', 'Current Quarter', 'Last Quarter', 'Current Year'] },
                { key: 'asset_category', label: 'Asset Category', type: 'select' as const, options: ['All Categories', 'IT Hardware', 'Furniture', 'Vehicles', 'Equipment'] },
                { key: 'location', label: 'Location', type: 'select' as const, options: ['All Locations', 'Main HUB', 'Branch Office', 'Warehouse'] },
            ]
        },
        {
            id: 'asset-utilization',
            name: 'Asset Utilization',
            icon: <BarChart3 size={16} />,
            filters: [
                { key: 'date_from', label: 'Date From', type: 'date' as const },
                { key: 'date_to', label: 'Date To', type: 'date' as const },
                { key: 'department', label: 'Department', type: 'select' as const, options: ['All Departments', 'Operations', 'Sales', 'Marketing', 'HR', 'IT'] },
            ]
        },
        {
            id: 'maintenance-roi',
            name: 'Maintenance ROI',
            icon: <Hammer size={16} />,
            filters: [
                { key: 'period', label: 'Period', type: 'select' as const, options: ['Last 30 Days', 'Last 90 Days', 'Last 6 Months', 'Last Year'] },
                { key: 'asset_type', label: 'Asset Type', type: 'select' as const, options: ['All Types', 'IT Hardware', 'Vehicles', 'Equipment', 'Machinery'] },
            ]
        },
    ];

    const activeReport = assetReports.find(r => r.id === activeReportId)!;
    const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    const hasFilters = Object.values(filterValues).some(v => v !== '');
    const clearFilters = () => setFilterValues({});

    const fieldCls = "w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Asset & Value Insights</h1>
                <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                    <FileText size={14} /> Export PDF Suite
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" style={{ minHeight: '600px', maxHeight: '80vh' }}>
                {/* Sidebar */}
                <div className="report-sidebar">
                    <div className="report-sidebar-header">
                        <p className="report-sidebar-title">Report Type</p>
                    </div>
                    <div className="report-nav">
                        <nav className="report-nav-list">
                            {assetReports.map(report => {
                                const isActive = activeReportId === report.id;
                                return (
                                    <button
                                        key={report.id}
                                        onClick={() => setActiveReportId(report.id)}
                                        className={`report-item ${isActive ? 'report-item-active' : ''}`}
                                    >
                                        <span className="report-item-icon">{report.icon}</span>
                                        <span className="report-item-text">{report.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Report Panel */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeReportId} 
                        initial={{ opacity: 0, x: 12 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="flex-1 flex flex-col min-w-0"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">{activeReport.icon}</div>
                                <h2 className="font-bold text-slate-800 text-sm">{activeReport.name}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                    <Upload size={13} /> Upload
                                </button>
                                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                    <Download size={13} /> Download
                                </button>
                                <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition">
                                    <Eye size={13} /> Show
                                </button>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 flex-1">
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                {activeReport.filters.map((filter, idx) => {
                                    const isLast = idx === activeReport.filters.length - 1;
                                    return (
                                        <div 
                                            key={filter.key} 
                                            className={`flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 ${!isLast ? "border-b border-slate-100" : ""} bg-white hover:bg-slate-50/40 transition-colors`}
                                        >
                                            <span className="text-xs font-semibold text-slate-600 w-full sm:w-40 flex-shrink-0">{filter.label}</span>
                                            <div className="flex-1">
                                                {filter.type === 'select' ? (
                                                    <select 
                                                        className={fieldCls} 
                                                        value={filterValues[filter.key] || ''} 
                                                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                                                    >
                                                        <option value="">— Select —</option>
                                                        {filter.options?.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : filter.type === 'date' ? (
                                                    <input 
                                                        type="date" 
                                                        className={fieldCls} 
                                                        value={filterValues[filter.key] || ''} 
                                                        onChange={e => handleFilterChange(filter.key, e.target.value)} 
                                                    />
                                                ) : (
                                                    <input 
                                                        type="text" 
                                                        className={fieldCls} 
                                                        placeholder={`Enter ${filter.label.toLowerCase()}…`} 
                                                        value={filterValues[filter.key] || ''} 
                                                        onChange={e => handleFilterChange(filter.key, e.target.value)} 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                {hasFilters ? (
                                    <button 
                                        onClick={clearFilters} 
                                        className="text-xs text-slate-400 hover:text-rose-500 transition font-medium"
                                    >
                                        Clear filters
                                    </button>
                                ) : <span />}
                                <button className="flex items-center gap-2 h-9 px-5 rounded-xl bg-[#002147] text-white text-xs font-bold hover:bg-[#003366] transition">
                                    <Eye size={14} /> Generate Report
                                </button>
                            </div>

                            <div className="mt-6 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-400 mb-3">{activeReport.icon}</div>
                                <p className="text-sm font-semibold text-slate-500">Set filters and click <span className="text-indigo-600">Generate Report</span></p>
                                <p className="text-xs text-slate-400 mt-1">Report data will appear here</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

