import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Download, 
  Factory, 
  ClipboardList, 
  Cpu, 
  ClipboardCheck, 
  PackageCheck,
  Truck,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// 1. Production Dashboard - Simplified and improved
export const ProductionDashboard: React.FC = () => {
  // Key metrics only
  const productionMetrics = [
    { label: 'Production Today', value: '840', unit: 'Units', icon: Factory, color: 'bg-blue-600', change: '+12%' },
    { label: 'Production This Month', value: '18,420', unit: 'Units', icon: TrendingUp, color: 'bg-emerald-600', change: '+8%' },
    { label: 'Efficiency Rate', value: '84.5%', unit: 'OEE', icon: Cpu, color: 'bg-indigo-600', change: 'Optimal' },
    { label: 'Quality Pass Rate', value: '96.2%', unit: 'QC', icon: CheckCircle, color: 'bg-green-600', change: 'Excellent' },
  ];

  // Work Orders Status
  const workOrderStats = [
    { label: 'Pending', value: 24, color: 'text-amber-600', bg: 'bg-amber-50', icon: ClipboardList },
    { label: 'In Progress', value: 18, color: 'text-blue-600', bg: 'bg-blue-50', icon: Factory },
    { label: 'Completed', value: 156, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  ];

  // Machine Status - simplified with trend data
  const machineStatus = [
    { id: 'M-001', name: 'CNC Machine A', status: 'Active', utilization: 92, temp: '45°C', trend: [75, 78, 82, 85, 88, 90, 92] },
    { id: 'M-002', name: 'Assembly Line 1', status: 'Active', utilization: 88, temp: '38°C', trend: [70, 75, 80, 82, 85, 87, 88] },
    { id: 'M-003', name: 'Packaging Unit', status: 'Idle', utilization: 0, temp: '25°C', trend: [45, 40, 35, 25, 15, 5, 0] },
    { id: 'M-004', name: 'Quality Station', status: 'Active', utilization: 75, temp: '28°C', trend: [65, 68, 70, 72, 73, 74, 75] },
  ];

  // Material Availability - simplified
  const materialAlerts = [
    { material: 'Steel Sheets', current: 450, required: 800, status: 'Low' },
    { material: 'Circuit Boards', current: 1200, required: 1500, status: 'Available' },
    { material: 'Plastic Components', current: 200, required: 1000, status: 'Critical' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time production metrics and status monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-600">Shift: A (06:00 - 14:00)</span>
          </div>
          <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/20">
            <Download size={14} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Production Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {productionMetrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-5 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden ${metric.color.replace('bg-', 'bg-')}/5 bg-white`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${metric.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${metric.color}/10 flex items-center justify-center ${metric.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm border border-current/10 group-hover:scale-110 transition-transform`}>
                <metric.icon size={20} />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white/80 backdrop-blur-sm shadow-sm ${metric.color.replace('bg-', 'text-').replace('600', '500')} border border-slate-100 transition-colors`}>
                {metric.change}
              </span>
            </div>
            <div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-700 transition-colors">{metric.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#002147] transition-colors">{metric.value}</p>
              <p className="text-[9px] text-slate-400 mt-2 font-medium italic opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">"{metric.unit}"</p>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 ${metric.color} opacity-[0.03] rounded-full translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
          </motion.div>
        ))}
      </div>

      {/* Work Orders Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Work Orders Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workOrderStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Machine Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Machine Status</h3>
          
          <div className="flex items-center justify-center gap-8">
            {/* Single Pie Chart */}
            <div className="relative group">
              <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90">
                {(() => {
                  let currentAngle = 0;
                  const colors = ['#22c55e', '#3b82f6', '#94a3b8', '#f59e0b'];
                  const total = machineStatus.reduce((sum, m) => sum + m.utilization, 0);
                  
                  return machineStatus.map((machine, i) => {
                    const percentage = (machine.utilization / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const radius = 80;
                    const circumference = 2 * Math.PI * radius;
                    const dashArray = (angle / 360) * circumference;
                    const dashOffset = -(currentAngle / 360) * circumference;
                    
                    const segment = (
                      <g key={i} className="group/segment cursor-pointer">
                        <circle
                          cx="100"
                          cy="100"
                          r={radius}
                          fill="none"
                          stroke={colors[i]}
                          strokeWidth="40"
                          strokeDasharray={`${dashArray} ${circumference}`}
                          strokeDashoffset={dashOffset}
                          className="transition-all duration-300 hover:stroke-[45] hover:opacity-90"
                          onMouseEnter={(e) => {
                            const tooltip = document.getElementById(`tooltip-${i}`);
                            if (tooltip) {
                              tooltip.style.display = 'block';
                              tooltip.style.left = `${e.clientX + 10}px`;
                              tooltip.style.top = `${e.clientY + 10}px`;
                            }
                          }}
                          onMouseMove={(e) => {
                            const tooltip = document.getElementById(`tooltip-${i}`);
                            if (tooltip) {
                              tooltip.style.left = `${e.clientX + 10}px`;
                              tooltip.style.top = `${e.clientY + 10}px`;
                            }
                          }}
                          onMouseLeave={() => {
                            const tooltip = document.getElementById(`tooltip-${i}`);
                            if (tooltip) tooltip.style.display = 'none';
                          }}
                        />
                        {/* Custom Tooltip */}
                        <foreignObject x="0" y="0" width="1" height="1" style={{ overflow: 'visible' }}>
                          <div
                            id={`tooltip-${i}`}
                            style={{ display: 'none', position: 'fixed', zIndex: 9999 }}
                            className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 pointer-events-none"
                          >
                            <p className="text-sm font-bold mb-1">{machine.name}</p>
                            <p className="text-xs text-slate-300">{machine.id}</p>
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-700">
                              <div>
                                <p className="text-xs text-slate-400">Utilization</p>
                                <p className="text-lg font-bold">{machine.utilization}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Temp</p>
                                <p className="text-sm font-semibold">{machine.temp}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Status</p>
                                <p className={`text-sm font-semibold ${machine.status === 'Active' ? 'text-green-400' : 'text-slate-400'}`}>
                                  {machine.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                    
                    currentAngle += angle;
                    return segment;
                  });
                })()}
                
                {/* Center circle for donut effect */}
                <circle cx="100" cy="100" r="60" fill="white" />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(machineStatus.reduce((sum, m) => sum + m.utilization, 0) / machineStatus.length)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Avg Utilization</p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-3">
              {machineStatus.map((machine, i) => {
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-slate-400', 'bg-amber-500'];
                return (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all">
                    <div className={`w-4 h-4 rounded ${colors[i]} group-hover:scale-110 transition-transform shadow-sm`} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{machine.name}</p>
                      <p className="text-xs text-slate-500">{machine.id} • {machine.temp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{machine.utilization}%</p>
                      <Badge variant={machine.status === 'Active' ? 'success' : 'secondary'} className="text-[9px]">
                        {machine.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Material Availability */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Material Availability</h3>
          <div className="space-y-3">
            {materialAlerts.map((alert, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-900">{alert.material}</p>
                  <Badge 
                    variant={alert.status === 'Critical' ? 'error' : alert.status === 'Low' ? 'warning' : 'success'} 
                    className="text-[10px]"
                  >
                    {alert.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">Current: <span className="font-bold text-slate-700">{alert.current}</span></span>
                  <span className="text-slate-500">Required: <span className="font-bold text-slate-700">{alert.required}</span></span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${alert.status === 'Critical' ? 'bg-amber-500' : alert.status === 'Low' ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ width: `${(alert.current / alert.required) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 2. Bill of Materials (BOM) - Complete with all features
export const BOMPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [selectedBOM, setSelectedBOM] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Sample BOM data with materials
  const bomList = [
    {
      id: 1,
      productCode: 'PRD-001',
      productName: 'Premium Headphones X1',
      version: '2.0',
      status: 'Active',
      totalCost: 45.50,
      lastUpdated: 'March 15, 2026',
      materials: [
        { name: 'Speaker Driver 40mm', quantity: 2, unit: 'pcs', cost: 8.50 },
        { name: 'Headband Frame', quantity: 1, unit: 'pcs', cost: 5.00 },
        { name: 'Ear Cushion Foam', quantity: 2, unit: 'pcs', cost: 3.25 },
        { name: 'Audio Cable 1.5m', quantity: 1, unit: 'pcs', cost: 2.50 },
        { name: 'Plastic Housing', quantity: 2, unit: 'pcs', cost: 4.00 },
      ]
    },
    {
      id: 2,
      productCode: 'PRD-002',
      productName: 'Smart Fitness Tracker',
      version: '1.5',
      status: 'Active',
      totalCost: 32.75,
      lastUpdated: 'March 18, 2026',
      materials: [
        { name: 'OLED Display', quantity: 1, unit: 'pcs', cost: 12.00 },
        { name: 'PCB Board', quantity: 1, unit: 'pcs', cost: 8.50 },
        { name: 'Silicone Strap', quantity: 1, unit: 'pcs', cost: 3.25 },
        { name: 'Battery 200mAh', quantity: 1, unit: 'pcs', cost: 4.00 },
        { name: 'Sensors Module', quantity: 1, unit: 'pcs', cost: 5.00 },
      ]
    },
  ];

  const filteredBOMs = bomList.filter(bom =>
    bom.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bill of Materials (BOM)</h1>
            <p className="text-slate-500 text-sm mt-1">Manage product material structure and costs</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              className="px-4 h-10 rounded-xl" 
              leftIcon={<Download size={14} />}
            >
              Export BOM
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" 
              leftIcon={<Plus size={14} />}
            >
              Create New BOM
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by product name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* BOM List Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#002147] text-white">
                <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Product</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Materials</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em]">Total Cost</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Version</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Status</th>
                <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBOMs.map((bom) => (
                <tr key={bom.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{bom.productName}</p>
                        <p className="text-xs text-slate-500">{bom.productCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                      {bom.materials.length} Items
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-bold text-green-600">${bom.totalCost.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="info" className="text-[10px]">V{bom.version}</Badge>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="success" className="text-[10px]">{bom.status}</Badge>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedBOM(bom);
                          setShowViewModal(true);
                        }}
                        className="h-8 px-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBOM(bom);
                          setShowEditModal(true);
                        }}
                        className="h-8 px-3 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create BOM Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Create New BOM</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Product Information */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Product Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Code *</label>
                    <input
                      type="text"
                      placeholder="PRD-001"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Raw Materials List */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-700">Raw Materials</h4>
                  <Button variant="secondary" className="h-8 px-3 text-xs" leftIcon={<Plus size={12} />}>
                    Add Material
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-600 mb-1">Material Name</label>
                          <input
                            type="text"
                            placeholder="Enter material name"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Quantity</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Unit</label>
                          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
                            <option>pcs</option>
                            <option>kg</option>
                            <option>ltr</option>
                            <option>mtr</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Unit Cost ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Total Cost</label>
                          <input
                            type="text"
                            value="$0.00"
                            disabled
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-calculated Total Production Cost */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Total Production Cost</span>
                  <span className="text-2xl font-bold text-blue-600">$0.00</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Auto-calculated from all materials</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowCreateModal(false)}
                className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
              >
                Create BOM
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View BOM Modal */}
      {showViewModal && selectedBOM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedBOM.productName}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedBOM.productCode} - Version {selectedBOM.version}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Materials List</h4>
                <div className="space-y-2">
                  {selectedBOM.materials.map((material: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{material.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Quantity: {material.quantity} {material.unit} × ${material.cost.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        ${(material.quantity * material.cost).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Total Production Cost</span>
                  <span className="text-2xl font-bold text-green-600">${selectedBOM.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit BOM Modal - Similar to Create but with pre-filled data */}
      {showEditModal && selectedBOM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit BOM - {selectedBOM.productName}</h3>
                <p className="text-sm text-slate-500 mt-1">Version {selectedBOM.version}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Version Control:</strong> Editing will create version {parseFloat(selectedBOM.version) + 0.1}
                </p>
              </div>

              {/* Same form fields as Create Modal but pre-filled */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      defaultValue={selectedBOM.productName}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Code</label>
                    <input
                      type="text"
                      defaultValue={selectedBOM.productCode}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100"
                    />
                  </div>
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
                Update BOM
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// 3. Production Planning - Schedule production, Material planning
export const ProductionPlanningPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Planning</h1>
        <p className="text-slate-500 text-sm mt-1">Schedule production and material planning</p>
      </div>
      <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" leftIcon={<Plus size={14} />}>
        New Schedule
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Production Schedule</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Week {i} - March 2026</span>
                <Badge variant="info" className="text-[10px]">SCHEDULED</Badge>
              </div>
              <p className="text-xs text-slate-500">Target: {500 + i*100} units</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Material Planning</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Material Batch #{i}00{i}</span>
                <Badge variant={i % 2 === 0 ? 'success' : 'warning'} className="text-[10px]">
                  {i % 2 === 0 ? 'AVAILABLE' : 'LOW STOCK'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Required: {1000 + i*200} units</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// 4. Work Orders - Create & track production work
export const WorkOrdersPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Work Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Create and track production work</p>
      </div>
      <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" leftIcon={<Factory size={14} />}>
        Generate Work Order
      </Button>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#002147] text-white">
            <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">WO Number</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Product</th>
            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Quantity</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Release Date</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Status</th>
            <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em]">Track</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <tr key={i} className="hover:bg-slate-50 transition-all">
              <td className="px-8 py-5 font-bold text-slate-900">WO-2024-0{i}82</td>
              <td className="px-6 py-5">
                <p className="text-sm font-bold text-slate-700">Audio Processor Unit v2</p>
                <p className="text-xs text-slate-400">Ref: SO-2024-991</p>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">500 PCS</span>
              </td>
              <td className="px-6 py-5 text-xs text-slate-500">March {i*2}, 2026</td>
              <td className="px-6 py-5">
                <Badge variant={i % 2 === 0 ? 'success' : 'info'} className="text-[10px]">
                  {i % 2 === 0 ? 'RUNNING' : 'QUEUED'}
                </Badge>
              </td>
              <td className="px-8 py-5 text-right">
                <Button variant="secondary" className="h-8 px-3 text-xs">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// 5. Inventory Movement - Raw Material Issue + Finished Goods Entry
export const InventoryMovementPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Movement</h1>
        <p className="text-slate-500 text-sm mt-1">Raw material issue and finished goods entry</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-4 h-10 rounded-xl" leftIcon={<Truck size={14} />}>
          Issue Material
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-10 rounded-xl shadow-lg shadow-emerald-900/20" leftIcon={<PackageCheck size={14} />}>
          Register Output
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Raw Material Issue */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Raw Material Issue</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Material #{i}001</span>
                <Badge variant="info" className="text-[10px]">ISSUED</Badge>
              </div>
              <p className="text-xs text-slate-500">Qty: {100 + i*50} units | WO-2024-0{i}82</p>
            </div>
          ))}
        </div>
      </div>

      {/* Finished Goods Entry */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Finished Goods Entry</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Product XYZ-0{i}</span>
                <Badge variant="success" className="text-[10px]">COMPLETED</Badge>
              </div>
              <p className="text-xs text-slate-500">Qty: {500 + i*100} units | Batch #{i}029</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// 6. Quality Check - Inspection & reject handling
export const QualityCheckPage: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quality Check</h1>
        <p className="text-slate-500 text-sm mt-1">Inspection and rejection handling</p>
      </div>
      <Button className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" leftIcon={<ClipboardCheck size={14} />}>
        New Inspection
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Total Inspected', value: '1,240', color: 'bg-blue-600' },
        { label: 'Passed', value: '1,193', color: 'bg-green-600' },
        { label: 'Rejected', value: '47', color: 'bg-red-600' },
        { label: 'Pass Rate', value: '96.2%', color: 'bg-indigo-600' },
      ].map((stat, i) => (
        <div key={i} className="p-5 rounded-xl border border-slate-200 shadow-sm bg-white">
          <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color}`} />
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">{stat.label}</h3>
          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#002147] text-white">
            <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Batch Number</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Product</th>
            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Inspected</th>
            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Rejected</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Inspector</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i} className="hover:bg-slate-50 transition-all">
              <td className="px-8 py-5 font-bold text-slate-900">BATCH-#{i}0029</td>
              <td className="px-6 py-5 text-sm font-bold text-slate-700">Product XYZ-0{i}</td>
              <td className="px-6 py-5 text-center text-sm text-slate-600">{500 + i*10}</td>
              <td className="px-6 py-5 text-center text-sm text-red-600">{i % 4 === 0 ? 12 : i*2}</td>
              <td className="px-6 py-5 text-xs text-slate-500">QA-Inspector {i}</td>
              <td className="px-6 py-5">
                <Badge variant={i % 4 === 0 ? 'error' : 'success'} className="text-[10px]">
                  {i % 4 === 0 ? 'REJECTED' : 'PASSED'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);
