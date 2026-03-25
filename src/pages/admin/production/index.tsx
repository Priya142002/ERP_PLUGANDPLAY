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
import { exportSingleSheetToExcel } from '../../../utils/reportGenerator';

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
    { label: 'Pending', value: 24, color: 'text-amber-600', bg: 'bg-slate-50', icon: ClipboardList },
    { label: 'In Progress', value: 18, color: 'text-blue-600', bg: 'bg-slate-50', icon: Factory },
    { label: 'Completed', value: 156, color: 'text-green-600', bg: 'bg-slate-50', icon: CheckCircle },
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
            className="relative p-5 rounded-xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden bg-white"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${metric.color} opacity-100`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center ${metric.color.replace('bg-', 'text-')} rounded-lg md:rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
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
            <div key={i} className="relative flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all group overflow-hidden">
              {/* Colored left border */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.color.replace('text-', 'bg-')}`} />
              
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
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

  const handleExportBOM = () => {
    const headers = ['Product Code', 'Product Name', 'Version', 'Status', 'Total Cost', 'Last Updated'];
    const data = filteredBOMs.map(bom => [
      bom.productCode,
      bom.productName,
      bom.version,
      bom.status,
      bom.totalCost,
      bom.lastUpdated
    ]);
    exportSingleSheetToExcel(headers, data, 'Bill_of_Materials');
  };

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
              onClick={handleExportBOM}
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
                    <span className="text-sm font-bold text-green-600">₹{bom.totalCost.toFixed(2)}</span>
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
                          <label className="block text-xs font-bold text-slate-600 mb-1">Unit Cost (₹)</label>
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
                            value="₹0.00"
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
                  <span className="text-2xl font-bold text-blue-600">₹0.00</span>
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
export const ProductionPlanningPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');

  // Sample products with BOM
  const products = [
    { 
      id: 'PRD-001', 
      name: 'Premium Headphones X1',
      materials: [
        { name: 'Speaker Driver 40mm', required: 2, available: 450, unit: 'pcs' },
        { name: 'Headband Frame', required: 1, available: 200, unit: 'pcs' },
        { name: 'Ear Cushion Foam', required: 2, available: 150, unit: 'pcs' },
      ]
    },
    { 
      id: 'PRD-002', 
      name: 'Smart Fitness Tracker',
      materials: [
        { name: 'OLED Display', required: 1, available: 300, unit: 'pcs' },
        { name: 'PCB Board', required: 1, available: 250, unit: 'pcs' },
        { name: 'Silicone Strap', required: 1, available: 400, unit: 'pcs' },
      ]
    },
  ];

  // Sample production plans
  const productionPlans = [
    {
      id: 'PP-001',
      product: 'Premium Headphones X1',
      productCode: 'PRD-001',
      quantity: 500,
      startDate: 'March 25, 2026',
      endDate: 'March 30, 2026',
      priority: 'High',
      status: 'Scheduled',
      materialsReady: true,
    },
    {
      id: 'PP-002',
      product: 'Smart Fitness Tracker',
      productCode: 'PRD-002',
      quantity: 300,
      startDate: 'March 28, 2026',
      endDate: 'April 2, 2026',
      priority: 'Medium',
      status: 'Pending',
      materialsReady: false,
    },
    {
      id: 'PP-003',
      product: 'Premium Headphones X1',
      productCode: 'PRD-001',
      quantity: 200,
      startDate: 'April 1, 2026',
      endDate: 'April 5, 2026',
      priority: 'Low',
      status: 'Scheduled',
      materialsReady: true,
    },
  ];

  // Calculate material requirements
  const selectedProductData = products.find(p => p.id === selectedProduct);
  const materialRequirements = selectedProductData?.materials.map(m => ({
    ...m,
    totalRequired: m.required * (parseInt(quantity) || 0),
    shortage: Math.max(0, (m.required * (parseInt(quantity) || 0)) - m.available),
  })) || [];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Planning</h1>
            <p className="text-slate-500 text-sm mt-1">Schedule production and manage material requirements</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#002147] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList size={14} className="inline mr-1.5" />
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-[#002147] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar size={14} className="inline mr-1.5" />
                Calendar View
              </button>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" 
              leftIcon={<Plus size={14} />}
            >
              Create Plan
            </Button>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#002147] text-white">
                  <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Plan ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Product</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Quantity</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Schedule</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Priority</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Materials</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productionPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-900">{plan.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Factory size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{plan.product}</p>
                          <p className="text-xs text-slate-500">{plan.productCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                        {plan.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs">
                        <p className="text-slate-900 font-semibold">{plan.startDate}</p>
                        <p className="text-slate-500">to {plan.endDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Badge 
                        variant={plan.priority === 'High' ? 'error' : plan.priority === 'Medium' ? 'warning' : 'secondary'}
                        className="text-[10px]"
                      >
                        {plan.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {plan.materialsReady ? (
                        <div className="flex items-center justify-center gap-1.5 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-xs font-bold">Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-amber-600">
                          <AlertCircle size={16} />
                          <span className="text-xs font-bold">Shortage</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <Badge 
                        variant={plan.status === 'Scheduled' ? 'success' : 'info'}
                        className="text-[10px]"
                      >
                        {plan.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowViewModal(true);
                          }}
                          className="h-8 px-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setSelectedProduct(plan.productCode);
                            setQuantity(plan.quantity.toString());
                            setPriority(plan.priority);
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
        )}

        {/* Calendar/Timeline View */}
        {viewMode === 'calendar' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Production Timeline - March 2026</h3>
            
            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days with Plans */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasPlans = [25, 26, 27, 28, 29, 30].includes(day) || [1, 2].includes(day);
                  const isHighPriority = [25, 26, 27].includes(day);
                  
                  return (
                    <div
                      key={day}
                      className={`min-h-[80px] p-2 rounded-lg border transition-all ${
                        hasPlans
                          ? isHighPriority
                            ? 'bg-red-50 border-red-200 hover:shadow-md'
                            : 'bg-blue-50 border-blue-200 hover:shadow-md'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 mb-1">{day}</div>
                      {hasPlans && (
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isHighPriority ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {isHighPriority ? 'PP-001' : 'PP-002'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Timeline Legend */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-600"></div>
                  <span className="text-xs text-slate-600">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-xs text-slate-600">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-400"></div>
                  <span className="text-xs text-slate-600">Low Priority</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Production Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Create Production Plan</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Product *</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Production Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Schedule Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priority Level *</label>
                  <div className="flex items-center gap-3">
                    {['High', 'Medium', 'Low'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          priority === p
                            ? p === 'High'
                              ? 'bg-red-600 text-white shadow-lg'
                              : p === 'Medium'
                              ? 'bg-amber-500 text-white shadow-lg'
                              : 'bg-slate-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Requirement Planning (Auto-calculated) */}
                {selectedProduct && quantity && (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Cpu size={16} className="text-blue-600" />
                      Material Requirement Planning (MRP)
                    </h4>
                    <div className="space-y-3">
                      {materialRequirements.map((material, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">{material.name}</span>
                            {material.shortage > 0 ? (
                              <Badge variant="error" className="text-[10px]">SHORTAGE</Badge>
                            ) : (
                              <Badge variant="success" className="text-[10px]">AVAILABLE</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-slate-500">Required</p>
                              <p className="font-bold text-slate-900">{material.totalRequired} {material.unit}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Available</p>
                              <p className="font-bold text-slate-900">{material.available} {material.unit}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Shortage</p>
                              <p className={`font-bold ${material.shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {material.shortage > 0 ? material.shortage : 0} {material.unit}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Stock Availability Summary */}
                    <div className={`mt-4 p-3 rounded-lg ${
                      materialRequirements.some(m => m.shortage > 0)
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {materialRequirements.some(m => m.shortage > 0) ? (
                          <>
                            <AlertCircle size={16} className="text-amber-600" />
                            <span className="text-sm font-bold text-amber-900">
                              Material shortage detected. Purchase order required.
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="text-sm font-bold text-green-900">
                              All materials available. Ready to schedule.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
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
                Create Production Plan
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Production Plan Modal */}
      {showViewModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Factory size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Production Plan Details</h3>
                  <p className="text-xs text-slate-500">{selectedPlan.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Product Information */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Product Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Product Name</p>
                      <p className="text-sm font-bold text-slate-900">{selectedPlan.product}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Product Code</p>
                      <p className="text-sm font-bold text-slate-900">{selectedPlan.productCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Quantity</p>
                      <p className="text-sm font-bold text-indigo-600">{selectedPlan.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Priority</p>
                      <Badge 
                        variant={selectedPlan.priority === 'High' ? 'error' : selectedPlan.priority === 'Medium' ? 'warning' : 'secondary'}
                        className="text-[10px]"
                      >
                        {selectedPlan.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Schedule</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Start Date</p>
                      <p className="text-sm font-bold text-slate-900">{selectedPlan.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">End Date</p>
                      <p className="text-sm font-bold text-slate-900">{selectedPlan.endDate}</p>
                    </div>
                  </div>
                </div>

                {/* Material Status */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Material Status</h4>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    selectedPlan.materialsReady ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                  }`}>
                    {selectedPlan.materialsReady ? (
                      <>
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-sm font-bold text-green-900">All materials available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-amber-600" />
                        <span className="text-sm font-bold text-amber-900">Material shortage detected</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Current Status</h4>
                  <Badge 
                    variant={selectedPlan.status === 'Scheduled' ? 'success' : 'info'}
                    className="text-xs"
                  >
                    {selectedPlan.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
                className="px-6"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(selectedPlan.productCode);
                  setQuantity(selectedPlan.quantity.toString());
                  setPriority(selectedPlan.priority);
                  setShowEditModal(true);
                }}
                className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
              >
                Edit Plan
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Production Plan Modal */}
      {showEditModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Production Plan</h3>
                  <p className="text-xs text-slate-500">{selectedPlan.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Product *</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Production Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Schedule Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priority Level *</label>
                  <div className="flex items-center gap-3">
                    {['High', 'Medium', 'Low'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          priority === p
                            ? p === 'High'
                              ? 'bg-red-600 text-white shadow-lg'
                              : p === 'Medium'
                              ? 'bg-amber-500 text-white shadow-lg'
                              : 'bg-slate-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Requirement Planning (Auto-calculated) */}
                {selectedProduct && quantity && (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Cpu size={16} className="text-blue-600" />
                      Material Requirement Planning (MRP)
                    </h4>
                    <div className="space-y-3">
                      {materialRequirements.map((material, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">{material.name}</span>
                            {material.shortage > 0 ? (
                              <Badge variant="error" className="text-[10px]">SHORTAGE</Badge>
                            ) : (
                              <Badge variant="success" className="text-[10px]">AVAILABLE</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-slate-500">Required</p>
                              <p className="font-bold text-slate-900">{material.totalRequired} {material.unit}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Available</p>
                              <p className="font-bold text-slate-900">{material.available} {material.unit}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Shortage</p>
                              <p className={`font-bold ${material.shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {material.shortage > 0 ? material.shortage : 0} {material.unit}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
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
                Update Plan
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// 4. Work Orders - Create & track production work
export const WorkOrdersPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = React.useState<any>(null);
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Form states for create/edit modal
  const [selectedPlan, setSelectedPlan] = React.useState('');
  const [assignedTo, setAssignedTo] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [notes, setNotes] = React.useState('');

  // Available production plans
  const productionPlans = [
    { id: 'PP-001', product: 'Premium Headphones X1', quantity: 500 },
    { id: 'PP-002', product: 'Smart Fitness Tracker', quantity: 300 },
    { id: 'PP-003', product: 'Premium Headphones X1', quantity: 200 },
  ];

  // Teams/Departments
  const departments = ['Assembly Line A', 'Assembly Line B', 'Quality Control', 'Packaging', 'Finishing'];
  const teams = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'];

  // Sample work orders
  const workOrders = [
    {
      id: 'WO-2026-001',
      planId: 'PP-001',
      product: 'Premium Headphones X1',
      productCode: 'PRD-001',
      quantity: 500,
      assignedTo: 'Team Alpha',
      department: 'Assembly Line A',
      status: 'In Progress',
      progress: 65,
      startTime: 'March 25, 2026 08:00 AM',
      endTime: null,
      notes: 'Priority order - customer deadline March 30',
      comments: [
        { user: 'John Doe', time: '10:30 AM', text: 'Started assembly process' },
        { user: 'Jane Smith', time: '02:15 PM', text: 'Completed 300 units' },
      ]
    },
    {
      id: 'WO-2026-002',
      planId: 'PP-002',
      product: 'Smart Fitness Tracker',
      productCode: 'PRD-002',
      quantity: 300,
      assignedTo: 'Team Beta',
      department: 'Assembly Line B',
      status: 'Pending',
      progress: 0,
      startTime: null,
      endTime: null,
      notes: 'Waiting for material delivery',
      comments: []
    },
    {
      id: 'WO-2026-003',
      planId: 'PP-001',
      product: 'Premium Headphones X1',
      productCode: 'PRD-001',
      quantity: 200,
      assignedTo: 'Team Gamma',
      department: 'Quality Control',
      status: 'Completed',
      progress: 100,
      startTime: 'March 20, 2026 08:00 AM',
      endTime: 'March 23, 2026 05:00 PM',
      notes: 'All units passed QC inspection',
      comments: [
        { user: 'Mike Johnson', time: 'March 23, 04:30 PM', text: 'Final inspection completed' },
      ]
    },
  ];

  // Filter work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesStatus = statusFilter === 'All' || wo.status === statusFilter;
    const matchesSearch = wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Work Orders</h1>
            <p className="text-slate-500 text-sm mt-1">Create and track production work orders</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" 
            leftIcon={<Factory size={14} />}
          >
            Create Work Order
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by WO number or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  statusFilter === status
                    ? 'bg-[#002147] text-white shadow-lg shadow-blue-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#002147] text-white">
                <th className="px-8 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">WO Number</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Product</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Quantity</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Assigned To</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.15em]">Progress</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.15em]">Status</th>
                <th className="px-8 py-4 text-right text-[11px] font-bold uppercase tracking-[0.15em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredWorkOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-900">{wo.id}</span>
                    <p className="text-xs text-slate-500">{wo.planId}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Factory size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{wo.product}</p>
                        <p className="text-xs text-slate-500">{wo.productCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                      {wo.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-900">{wo.assignedTo}</p>
                    <p className="text-xs text-slate-500">{wo.department}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-slate-900">{wo.progress}%</span>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            wo.progress === 100 ? 'bg-green-500' : 
                            wo.progress > 0 ? 'bg-blue-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${wo.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge 
                      variant={
                        wo.status === 'Completed' ? 'success' : 
                        wo.status === 'In Progress' ? 'info' : 
                        'warning'
                      }
                      className="text-[10px]"
                    >
                      {wo.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedWorkOrder(wo);
                          setShowViewModal(true);
                        }}
                        className="h-8 px-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWorkOrder(wo);
                          setSelectedPlan(wo.planId);
                          setAssignedTo(wo.assignedTo);
                          setDepartment(wo.department);
                          setNotes(wo.notes);
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

      {/* Create Work Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Factory size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Create Work Order</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Select Production Plan */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Production Plan *</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose a production plan...</option>
                    {productionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.id} - {plan.product} ({plan.quantity} units)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Team *</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select team...</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select department...</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Scheduled Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notes / Instructions</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
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
                Create Work Order
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View/Track Work Order Modal */}
      {showViewModal && selectedWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Factory size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Work Order Details</h3>
                  <p className="text-xs text-slate-500">{selectedWorkOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Product & Assignment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Product Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Product</p>
                        <p className="text-sm font-bold text-slate-900">{selectedWorkOrder.product}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Quantity</p>
                        <p className="text-sm font-bold text-indigo-600">{selectedWorkOrder.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Production Plan</p>
                        <p className="text-sm font-bold text-slate-900">{selectedWorkOrder.planId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Assignment</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                        <p className="text-sm font-bold text-slate-900">{selectedWorkOrder.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Department</p>
                        <p className="text-sm font-bold text-slate-900">{selectedWorkOrder.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <Badge 
                          variant={
                            selectedWorkOrder.status === 'Completed' ? 'success' : 
                            selectedWorkOrder.status === 'In Progress' ? 'info' : 
                            'warning'
                          }
                          className="text-xs"
                        >
                          {selectedWorkOrder.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Progress Tracking</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700">Completion Progress</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedWorkOrder.progress}%</span>
                      </div>
                      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            selectedWorkOrder.progress === 100 ? 'bg-green-500' : 
                            selectedWorkOrder.progress > 0 ? 'bg-blue-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${selectedWorkOrder.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Update Progress */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={selectedWorkOrder.progress}
                        className="flex-1"
                      />
                      <button className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time Tracking */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Time Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Start Time</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedWorkOrder.startTime || 'Not started'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">End Time</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedWorkOrder.endTime || 'In progress'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Notes</h4>
                  <p className="text-sm text-slate-700">{selectedWorkOrder.notes}</p>
                </div>

                {/* Comments/Activity */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Comments & Activity</h4>
                  <div className="space-y-3 mb-4">
                    {selectedWorkOrder.comments.map((comment: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900">{comment.user}</span>
                          <span className="text-xs text-slate-500">{comment.time}</span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <button className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
                className="px-6"
              >
                Close
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg"
              >
                Mark as Completed
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Work Order Modal */}
      {showEditModal && selectedWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Factory size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Work Order</h3>
                  <p className="text-xs text-slate-500">{selectedWorkOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Current Product Info (Read-only) */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Current Assignment</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Product</p>
                      <p className="text-sm font-bold text-slate-900">{selectedWorkOrder.product}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Quantity</p>
                      <p className="text-sm font-bold text-indigo-600">{selectedWorkOrder.quantity} units</p>
                    </div>
                  </div>
                </div>

                {/* Production Plan */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Production Plan</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose a production plan...</option>
                    {productionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.id} - {plan.product} ({plan.quantity} units)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign to Team *</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select team...</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="">Select department...</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Update Status</label>
                  <div className="flex items-center gap-3">
                    {['Pending', 'In Progress', 'Completed'].map(status => (
                      <button
                        key={status}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          selectedWorkOrder.status === status
                            ? status === 'Completed'
                              ? 'bg-green-600 text-white shadow-lg'
                              : status === 'In Progress'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-amber-500 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Update */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Update Progress</label>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-600">Current Progress</span>
                      <span className="text-xl font-bold text-blue-600">{selectedWorkOrder.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={selectedWorkOrder.progress}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notes / Instructions</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
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
                Update Work Order
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// 5. Inventory Movement - Raw Material Issue + Finished Goods Entry
export const InventoryMovementPage: React.FC = () => {
  const [showIssueModal, setShowIssueModal] = React.useState(false);
  const [showOutputModal, setShowOutputModal] = React.useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = React.useState('');
  const [selectedMaterial, setSelectedMaterial] = React.useState('');
  const [issueQuantity, setIssueQuantity] = React.useState('');
  const [batchNumber, setBatchNumber] = React.useState('');
  const [outputQuantity, setOutputQuantity] = React.useState('');

  // Sample data
  const workOrders = [
    { id: 'WO-2026-001', product: 'Premium Headphones X1', quantity: 500 },
    { id: 'WO-2026-002', product: 'Smart Fitness Tracker', quantity: 300 },
  ];

  const materials = [
    { id: 'MAT-001', name: 'Steel Sheets', available: 450, unit: 'kg' },
    { id: 'MAT-002', name: 'Circuit Boards', available: 1200, unit: 'pcs' },
    { id: 'MAT-003', name: 'Plastic Components', available: 200, unit: 'pcs' },
  ];

  const materialIssues = [
    { id: 'MI-001', material: 'Steel Sheets', qty: 150, unit: 'kg', wo: 'WO-2024-0182', status: 'ISSUED', date: 'March 23, 2026' },
    { id: 'MI-002', material: 'Circuit Boards', qty: 200, unit: 'pcs', wo: 'WO-2024-0282', status: 'ISSUED', date: 'March 22, 2026' },
    { id: 'MI-003', material: 'Plastic Components', qty: 250, unit: 'pcs', wo: 'WO-2024-0382', status: 'ISSUED', date: 'March 21, 2026' },
  ];

  const finishedGoods = [
    { id: 'FG-001', product: 'Premium Headphones X1', qty: 600, batch: '#1029', status: 'COMPLETED', date: 'March 23, 2026' },
    { id: 'FG-002', product: 'Smart Fitness Tracker', qty: 700, batch: '#2029', status: 'COMPLETED', date: 'March 22, 2026' },
    { id: 'FG-003', product: 'Premium Headphones X1', qty: 800, batch: '#3029', status: 'COMPLETED', date: 'March 21, 2026' },
  ];

  // Stock validation
  const selectedMaterialData = materials.find(m => m.id === selectedMaterial);
  const requestedQty = parseInt(issueQuantity) || 0;
  const hasStock = selectedMaterialData ? requestedQty <= selectedMaterialData.available : false;
  const stockShortage = selectedMaterialData ? Math.max(0, requestedQty - selectedMaterialData.available) : 0;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Movement</h1>
            <p className="text-slate-500 text-sm mt-1">Raw material issue and finished goods entry</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowIssueModal(true)}
              variant="secondary" 
              className="px-4 h-10 rounded-xl" 
              leftIcon={<Truck size={14} />}
            >
              Issue Material
            </Button>
            <Button 
              onClick={() => setShowOutputModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-10 rounded-xl shadow-lg shadow-emerald-900/20" 
              leftIcon={<PackageCheck size={14} />}
            >
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
              {materialIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{issue.material}</span>
                    <Badge variant="info" className="text-[10px]">{issue.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Qty: {issue.qty} {issue.unit} | {issue.wo}</p>
                  <p className="text-xs text-slate-400 mt-1">{issue.date}</p>
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
              {finishedGoods.map((good) => (
                <div key={good.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{good.product}</span>
                    <Badge variant="success" className="text-[10px]">{good.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Qty: {good.qty} units | Batch {good.batch}</p>
                  <p className="text-xs text-slate-400 mt-1">{good.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Issue Material Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Issue Raw Material</h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Work Order Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Work Order *</label>
                  <select
                    value={selectedWorkOrder}
                    onChange={(e) => setSelectedWorkOrder(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose work order...</option>
                    {workOrders.map(wo => (
                      <option key={wo.id} value={wo.id}>{wo.id} - {wo.product}</option>
                    ))}
                  </select>
                </div>

                {/* Material Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Material *</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose material...</option>
                    {materials.map(mat => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} (Available: {mat.available} {mat.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Issue Quantity *</label>
                  <input
                    type="number"
                    value={issueQuantity}
                    onChange={(e) => setIssueQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Stock Validation */}
                {selectedMaterial && issueQuantity && (
                  <div className={`p-4 rounded-xl border ${
                    hasStock ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {hasStock ? (
                        <>
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-sm font-bold text-green-900">Stock Available</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-amber-600" />
                          <span className="text-sm font-bold text-amber-900">Insufficient Stock</span>
                        </>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-slate-600">Requested</p>
                        <p className="font-bold text-slate-900">{requestedQty} {selectedMaterialData?.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Available</p>
                        <p className="font-bold text-slate-900">{selectedMaterialData?.available} {selectedMaterialData?.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Shortage</p>
                        <p className={`font-bold ${stockShortage > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {stockShortage} {selectedMaterialData?.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <Button
                variant="secondary"
                onClick={() => setShowIssueModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowIssueModal(false)}
                disabled={!hasStock}
                className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Issue Material
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Register Output Modal */}
      {showOutputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PackageCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Register Finished Goods</h3>
              </div>
              <button
                onClick={() => setShowOutputModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white">
              <div className="space-y-6">
                {/* Work Order Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Work Order *</label>
                  <select
                    value={selectedWorkOrder}
                    onChange={(e) => setSelectedWorkOrder(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Choose work order...</option>
                    {workOrders.map(wo => (
                      <option key={wo.id} value={wo.id}>{wo.id} - {wo.product} ({wo.quantity} units)</option>
                    ))}
                  </select>
                </div>

                {/* Output Quantity */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Produced Quantity *</label>
                  <input
                    type="number"
                    value={outputQuantity}
                    onChange={(e) => setOutputQuantity(e.target.value)}
                    placeholder="Enter quantity produced"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Batch/Lot Number */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Batch / Lot Number *</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g., #1029"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Unique identifier for tracking this production batch</p>
                </div>

                {/* Quality Status */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quality Status</label>
                  <div className="flex items-center gap-3">
                    {['Passed', 'Pending QC', 'Rejected'].map(status => (
                      <button
                        key={status}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          status === 'Passed'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Inventory Update Preview */}
                {outputQuantity && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Inventory Update Preview</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Stock will be increased by:</span>
                      <span className="text-xl font-bold text-blue-600">+{outputQuantity} units</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white">
              <Button
                variant="secondary"
                onClick={() => setShowOutputModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowOutputModal(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 shadow-lg"
              >
                Register Output
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// 6. Quality Check - Inspection & reject handling
export const QualityCheckPage: React.FC = () => {
  const [showInspectionModal, setShowInspectionModal] = React.useState(false);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quality Check</h1>
            <p className="text-slate-500 text-sm mt-1">Inspection and rejection handling</p>
          </div>
          <Button 
            onClick={() => setShowInspectionModal(true)}
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 rounded-xl shadow-lg shadow-blue-900/20" 
            leftIcon={<ClipboardCheck size={14} />}
          >
            New Inspection
          </Button>
        </div>

        {/* Quality Check Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Inspected', value: '1,240', icon: ClipboardList, color: 'bg-blue-600' },
            { label: 'Passed', value: '1,193', icon: CheckCircle, color: 'bg-emerald-600' },
            { label: 'Rejected', value: '47', icon: AlertCircle, color: 'bg-red-600' },
            { label: 'Pass Rate', value: '96.2%', icon: PackageCheck, color: 'bg-indigo-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative p-5 rounded-xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Colored top border - blends with rounded corners */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color} rounded-t-xl`} />
              
              {/* Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={18} className={stat.color.replace('bg-', 'text-')} />
                </div>
              </div>
              
              {/* Value and Label */}
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
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

  {/* New Inspection Modal */}
  {showInspectionModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">New Quality Inspection</h3>
          </div>
          <button
            onClick={() => setShowInspectionModal(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="space-y-5">
            {/* Batch Information */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Batch Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Batch Number *</label>
                  <input
                    type="text"
                    placeholder="BATCH-#10029"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Product *</label>
                  <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option value="">Select Product</option>
                    <option>Product XYZ-01</option>
                    <option>Product XYZ-02</option>
                    <option>Product XYZ-03</option>
                    <option>Product XYZ-04</option>
                    <option>Product XYZ-05</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inspection Details */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Inspection Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Quantity Inspected *</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Quantity Rejected</label>
                  <input
                    type="number"
                    placeholder="0"
                    defaultValue="0"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Inspector & Result */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Inspector & Result</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Inspector *</label>
                  <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option value="">Select Inspector</option>
                    <option>QA-Inspector 1</option>
                    <option>QA-Inspector 2</option>
                    <option>QA-Inspector 3</option>
                    <option>QA-Inspector 4</option>
                    <option>QA-Inspector 5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Inspection Result *</label>
                  <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option value="">Select Result</option>
                    <option value="passed">PASSED</option>
                    <option value="rejected">REJECTED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Inspection Notes</label>
              <textarea
                rows={4}
                placeholder="Enter any observations or notes about the inspection..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-white flex-shrink-0">
          <Button
            variant="secondary"
            onClick={() => setShowInspectionModal(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setShowInspectionModal(false)}
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 shadow-lg shadow-blue-900/20"
          >
            Save Inspection
          </Button>
        </div>
      </motion.div>
    </div>
  )}
</>
);
};
