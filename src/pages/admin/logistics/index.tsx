import React from 'react';
import Badge from '../../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Plus, 
  Search, 
  Star, 
  Building2, 
  ClipboardList,
  ShieldCheck,
  Package,
  ChevronRight,
  Clock,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useNotifications } from '../../../context/AppContext';

// --- Fleet Intelligence (Dashboard) ---
export const LogisticsDashboard: React.FC = () => {
  const { showNotification } = useNotifications();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const topCities = [
    { city: 'Mumbai Central', deliveries: 58, efficiency: 98, status: 'Peak Flow' },
    { city: 'Delhi NCR', deliveries: 45, efficiency: 92, status: 'Normal' },
    { city: 'Bangalore Hub', deliveries: 38, efficiency: 89, status: 'Normal' },
    { city: 'Hyderabad Sector', deliveries: 32, efficiency: 85, status: 'Optimal' },
  ];

  const handleDownloadReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const headers = ['City', 'Deliveries', 'Efficiency', 'Status', 'Timestamp'];
      const data = topCities.map(city => [
        city.city,
        city.deliveries.toString(),
        city.efficiency + '%',
        city.status,
        new Date().toISOString()
      ]);
      
      const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `logistics_report_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification({
        type: 'success',
        title: 'Report Downloaded',
        message: 'Logistics report has been downloaded as Excel file successfully.',
        duration: 5000
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fleet Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">Global logistics monitoring and delivery optimization</p>
        </div>
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-2.5 bg-white border border-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-sm">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase">Cycle: Mar 2026</span>
          </div>
          <Button 
            onClick={handleDownloadReport}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 h-10 text-[10px] md:text-xs font-bold rounded-xl border-none shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isGenerating ? 'Generating Excel...' : 'Generate Logistics Meta-Report'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { label: 'Active Shipments', value: '184', badge: '12 Delayed', icon: <Package size={20} /> },
          { label: 'Delivered Today', value: '42', badge: '+15% Eff', icon: <CheckCircle size={20} /> },
          { label: 'Avg Delivery Time', value: '2.4 Days', badge: '-4h vs. Last', icon: <Clock size={20} /> },
          { label: 'Feedback Score', value: '4.8/5', badge: 'Optimal', icon: <Star size={20} /> },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            {/* Midnight blue top bar */}
            <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-600 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-white shadow-sm text-slate-600 border border-slate-100">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">{card.label}</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold uppercase tracking-[0.1em] text-slate-400 text-xs relative z-10 font-bold italic">Real-time Delivery Performance - Top Cities</h3>
          <div className="space-y-4 relative z-10">
            {topCities.map((city, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group/zone">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50 group-hover/zone:scale-110 transition-transform">
                    <MapPin size={16} className={city.efficiency > 90 ? 'text-slate-500' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover/zone:text-slate-700 transition-colors uppercase">{city.city}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{city.status} • {city.deliveries} Deliveries Today</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{city.efficiency}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">SLA Compliance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden flex flex-col group/map shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-700/10 rounded-full translate-x-20 -translate-y-20 group-hover/map:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6 font-bold uppercase tracking-[0.1em] text-white/40 text-xs italic">Live Heatmap Tracking</h3>
            <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm mb-6 flex-1">
              <Zap size={32} className="text-blue-400 mb-4 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">Synchronized with 18 drivers in real-time</p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                Monitor Map
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest px-1">
                <span>Fleet Load</span>
                <span className="text-blue-400">72% Capacity</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: '72%' }}
                   transition={{ duration: 1.5 }}
                   className="h-full bg-blue-500 rounded-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

// --- Order Processing (Packing & QC) ---
export const LogisticsOrderPage: React.FC = () => {
    const { showNotification } = useNotifications();
    const [isPacking, setIsPacking] = React.useState(false);
    const [showPackingModal, setShowPackingModal] = React.useState(false);
    const [packingStep, setPackingStep] = React.useState(0);

    const packingSteps = [
        { icon: '🔍', title: 'Scanning Orders', desc: 'Pulling pending orders from the queue and scanning barcodes...' },
        { icon: '📦', title: 'Assigning Packing Slots', desc: 'Allocating packing stations and assigning orders to workers...' },
        { icon: '✅', title: 'QC Inspection', desc: 'Running quality checks on items before packing...' },
        { icon: '🏷️', title: 'Labeling & Sealing', desc: 'Printing shipping labels and sealing packages...' },
        { icon: '🚚', title: 'Ready for Dispatch', desc: 'All packages staged and ready for carrier pickup.' },
    ];

    const handleStartPacking = () => {
        setPackingStep(0);
        setShowPackingModal(true);
        setIsPacking(true);

        let step = 0;
        const interval = setInterval(() => {
            step += 1;
            setPackingStep(step);
            if (step >= packingSteps.length - 1) {
                clearInterval(interval);
                setIsPacking(false);
            }
        }, 1200);
    };

    const handleClosePackingModal = () => {
        if (!isPacking) {
            setShowPackingModal(false);
            setPackingStep(0);
            if (packingStep >= packingSteps.length - 1) {
                showNotification({
                    type: 'success',
                    title: 'Batch Packing Complete',
                    message: 'All orders have been packed and staged for dispatch.',
                    duration: 4000
                });
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic uppercase">PACKING & ORDER FULFILLMENT</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">PREPARE SHIPMENTS, QUALITY CHECK, AND BARCODE LABELING</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={handleStartPacking}
                        disabled={isPacking}
                        variant="primary" 
                        className="bg-[#1a2744] hover:bg-[#243258] text-white px-6 h-10 rounded-xl shadow-lg active:scale-95 transition-all font-bold uppercase text-[10px] tracking-widest disabled:opacity-70" 
                        leftIcon={!isPacking && <ClipboardList size={14} />}
                    >
                        {isPacking ? 'Processing...' : 'Start Batch Packing'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { stage: 'Pending Packing', count: 12, icon: <Package size={20} />, bar: '#1a2744' },
                    { stage: 'In QC Inspection', count: 17, icon: <ShieldCheck size={20} />, bar: '#1a2744' },
                    { stage: 'Ready for Dispatch', count: 22, icon: <Package size={20} />, bar: '#1a2744' },
                    { stage: 'Recently Dispatched', count: 27, icon: <Package size={20} />, bar: '#1a2744' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer overflow-hidden">
                        {/* Midnight blue top bar */}
                        <div style={{ height: '6px', backgroundColor: item.bar }} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-2xl font-bold text-slate-900">{item.count}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.stage}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Processing Floor</h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500">Live Updates</span>
                    </div>
                </div>
                <div className="p-12 text-center text-slate-300 italic text-sm">
                    No orders currently in the active packing queue. Synchronize with Inventory to pull new orders.
                </div>
            </div>

            {/* Batch Packing Process Modal */}
            {showPackingModal && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={handleClosePackingModal}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '480px', width: '100%', padding: '28px' }}
                    >
                        {/* Header */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Batch Packing Process</h2>
                                {!isPacking && (
                                    <button onClick={handleClosePackingModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
                                )}
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                {isPacking ? 'Processing orders — please wait...' : 'All steps completed successfully.'}
                            </p>
                        </div>

                        {/* Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {packingSteps.map((step, i) => {
                                const done = i < packingStep;
                                const active = i === packingStep;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: i <= packingStep ? 1 : 0.3, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '12px 14px', borderRadius: '10px',
                                            backgroundColor: done ? '#f0fdf4' : active ? '#eff6ff' : '#f8fafc',
                                            border: `1px solid ${done ? '#bbf7d0' : active ? '#bfdbfe' : '#e2e8f0'}`
                                        }}
                                    >
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: done ? '#22c55e' : active ? '#1a2744' : '#e2e8f0',
                                            fontSize: done ? '16px' : '18px'
                                        }}>
                                            {done ? <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>✓</span> : <span>{step.icon}</span>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: done ? '#15803d' : active ? '#1a2744' : '#94a3b8', margin: 0 }}>{step.title}</p>
                                            <p style={{ fontSize: '11px', color: done ? '#4ade80' : active ? '#64748b' : '#cbd5e1', margin: '2px 0 0' }}>{step.desc}</p>
                                        </div>
                                        {active && isPacking && (
                                            <div style={{ width: '16px', height: '16px', border: '2px solid #1a2744', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overall Progress</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{Math.round((packingStep / (packingSteps.length - 1)) * 100)}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${(packingStep / (packingSteps.length - 1)) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    style={{ height: '100%', backgroundColor: packingStep >= packingSteps.length - 1 ? '#22c55e' : '#1a2744', borderRadius: '99px' }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleClosePackingModal}
                            disabled={isPacking}
                            style={{
                                width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600,
                                backgroundColor: isPacking ? '#94a3b8' : '#1a2744',
                                color: '#ffffff', border: 'none', borderRadius: '8px',
                                cursor: isPacking ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isPacking ? 'Processing...' : 'Done'}
                        </button>
                    </motion.div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
    );
};

// --- Shipment Tracking ---
export const ShipmentListPage: React.FC = () => {
    const { showNotification } = useNotifications();
    const [shipments, setShipments] = React.useState([
        { id: 'SH-00129', ref: 'ORD-2931', destination: 'North Jersey Distribution', zone: 'Zone A-2', progress: 20, eta: 'Oct 11, 2026' },
        { id: 'SH-00229', ref: 'ORD-2932', destination: 'South Jersey Hub', zone: 'Zone B-1', progress: 40, eta: 'Oct 12, 2026' },
        { id: 'SH-00329', ref: 'ORD-2933', destination: 'Central Distribution', zone: 'Zone A-3', progress: 60, eta: 'Oct 13, 2026' },
        { id: 'SH-00429', ref: 'ORD-2934', destination: 'East Coast Terminal', zone: 'Zone C-2', progress: 80, eta: 'Oct 14, 2026' },
        { id: 'SH-00529', ref: 'ORD-2935', destination: 'West Hub', zone: 'Zone D-1', progress: 100, eta: 'Oct 15, 2026' },
    ]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterZone, setFilterZone] = React.useState('');
    const [trackingId, setTrackingId] = React.useState('');
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [selectedShipment, setSelectedShipment] = React.useState<typeof shipments[0] | null>(null);
    const [trackedShipment, setTrackedShipment] = React.useState<typeof shipments[0] | null>(null);
    const [formData, setFormData] = React.useState({
        shipmentId: '',
        orderRef: '',
        destination: '',
        zone: '',
        eta: ''
    });
    const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.shipmentId.trim()) errors.shipmentId = 'Shipment ID is required';
        if (!formData.orderRef.trim()) errors.orderRef = 'Order Reference is required';
        if (!formData.destination.trim()) errors.destination = 'Destination is required';
        if (!formData.zone) errors.zone = 'Zone is required';
        if (!formData.eta.trim()) errors.eta = 'ETA Date is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateShipment = () => {
        setShowCreateModal(true);
    };

    const handleSubmitForm = () => {
        if (!validateForm()) return;

        const newShipment = {
            id: formData.shipmentId,
            ref: formData.orderRef,
            destination: formData.destination,
            zone: formData.zone,
            progress: 0,
            eta: formData.eta
        };

        setShipments([...shipments, newShipment]);
        showNotification({
            type: 'success',
            title: 'Shipment Created',
            message: `Shipment ${formData.shipmentId} has been created and added to tracking queue.`,
            duration: 4000
        });

        setFormData({ shipmentId: '', orderRef: '', destination: '', zone: '', eta: '' });
        setFormErrors({});
        setShowCreateModal(false);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setFormData({ shipmentId: '', orderRef: '', destination: '', zone: '', eta: '' });
        setFormErrors({});
    };

    const handleTrackSingleId = () => {
        if (!trackingId.trim()) {
            showNotification({
                type: 'error',
                title: 'Enter Tracking ID',
                message: 'Please enter a shipment ID to track.',
                duration: 3000
            });
            return;
        }
        const found = shipments.find(s => s.id.toLowerCase() === trackingId.trim().toLowerCase());
        if (found) {
            setTrackedShipment(found);
        } else {
            showNotification({
                type: 'error',
                title: 'Not Found',
                message: `No shipment found with ID "${trackingId}". Please check and try again.`,
                duration: 3000
            });
        }
        setTrackingId('');
    };

    const handleViewDetails = (id: string) => {
        const shipment = shipments.find(s => s.id === id);
        if (shipment) setSelectedShipment(shipment);
    };

    const filtered = shipments.filter(s => 
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterZone || s.zone === filterZone)
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Management</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Coordinate outbound logistics and cross-border movements</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={handleCreateShipment}
                        className="bg-[#1a2744] hover:bg-[#243258] text-white px-6 h-10 text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all" 
                        leftIcon={<Plus size={14} />}
                    >
                        Create Shipment
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search shipment ID..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 outline-none transition-all font-medium" 
                            />
                        </div>
                        <select 
                            value={filterZone}
                            onChange={(e) => setFilterZone(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer active:scale-95 text-[11px] font-bold uppercase tracking-widest"
                        >
                            <option value="">All Zones</option>
                            <option value="Zone A-2">Zone A-2</option>
                            <option value="Zone B-1">Zone B-1</option>
                            <option value="Zone A-3">Zone A-3</option>
                            <option value="Zone C-2">Zone C-2</option>
                            <option value="Zone D-1">Zone D-1</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Track ID..." 
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleTrackSingleId()}
                                className="pl-3 pr-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 outline-none transition-all font-medium w-32" 
                            />
                        </div>
                        <button 
                            onClick={handleTrackSingleId}
                            className="flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-lg bg-[#1a2744] text-white hover:bg-[#e2e8f0] hover:text-black active:scale-95 transition-all"
                        >
                            <ChevronRight size={12} />
                            Track
                        </button>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-900 text-white uppercase tracking-[0.15em] text-[10px] font-bold">
                            <th className="px-8 py-4 text-left border-none">Tracking Info</th>
                            <th className="px-6 py-4 text-left border-none">Destination Hub</th>
                            <th className="px-6 py-4 text-left border-none">Carrier Flow</th>
                            <th className="px-6 py-4 text-left border-none">ETA Date</th>
                            <th className="px-8 py-4 text-right border-none italic">Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((shipment, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Package size={16} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{shipment.id}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">Ref: {shipment.ref}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-sm font-bold text-slate-900">{shipment.destination}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Badge variant="info" className="text-[9px] py-0 px-1.5">{shipment.zone}</Badge>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1.5 min-w-[140px]">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">In-Transit</span>
                                            <span className="text-[9px] font-bold text-slate-700">{shipment.progress}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${shipment.progress}%` }} transition={{ duration: 1 }} className="h-full bg-slate-400" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-slate-500 font-medium italic">{shipment.eta}</td>
                                <td className="px-8 py-5 text-right">
                                    <button 
                                        onClick={() => handleViewDetails(shipment.id)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors active:scale-95"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div 
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={handleCloseModal}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '480px', width: '100%', padding: '24px' }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Create New Shipment</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Add a new shipment to the tracking system</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { key: 'shipmentId', label: 'Shipment ID', placeholder: 'e.g., SH-00630' },
                                { key: 'orderRef', label: 'Order Reference', placeholder: 'e.g., ORD-2936' },
                                { key: 'destination', label: 'Destination', placeholder: 'e.g., North Jersey Distribution' },
                                { key: 'eta', label: 'ETA Date', placeholder: 'e.g., Oct 16, 2026' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</label>
                                    <input
                                        type="text"
                                        value={formData[key as keyof typeof formData]}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${formErrors[key] ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '8px', backgroundColor: formErrors[key] ? '#fff1f2' : '#ffffff', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    {formErrors[key] && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{formErrors[key]}</p>}
                                </div>
                            ))}

                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Zone</label>
                                <select
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${formErrors.zone ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '8px', backgroundColor: formErrors.zone ? '#fff1f2' : '#ffffff', color: '#0f172a', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                                >
                                    <option value="">Select Zone</option>
                                    <option value="Zone A-2">Zone A-2</option>
                                    <option value="Zone B-1">Zone B-1</option>
                                    <option value="Zone A-3">Zone A-3</option>
                                    <option value="Zone C-2">Zone C-2</option>
                                    <option value="Zone D-1">Zone D-1</option>
                                </select>
                                {formErrors.zone && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{formErrors.zone}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                onClick={handleCloseModal}
                                style={{ flex: 1, padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitForm}
                                style={{ flex: 1, padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Create Shipment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            {trackedShipment && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={() => setTrackedShipment(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '460px', width: '100%', padding: '24px' }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Track Shipment</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Real-time tracking details</p>
                            </div>
                            <button onClick={() => setTrackedShipment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px', lineHeight: 1 }}>✕</button>
                        </div>

                        {/* Shipment ID badge */}
                        <div style={{ backgroundColor: '#1a2744', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shipment ID</span>
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{trackedShipment.id}</span>
                        </div>

                        {/* Details grid */}
                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                            {[
                                { label: 'Order Reference', value: trackedShipment.ref },
                                { label: 'Destination', value: trackedShipment.destination },
                                { label: 'Zone', value: trackedShipment.zone },
                                { label: 'ETA', value: trackedShipment.eta },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Progress */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Transit Progress</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{trackedShipment.progress}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trackedShipment.progress}%` }}
                                    transition={{ duration: 0.8 }}
                                    style={{ height: '100%', backgroundColor: trackedShipment.progress === 100 ? '#22c55e' : '#1a2744', borderRadius: '99px' }}
                                />
                            </div>
                            {/* Stage labels */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                {['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map((stage, i) => {
                                    const threshold = [1, 40, 60, 100][i];
                                    const active = trackedShipment.progress >= threshold;
                                    return (
                                        <span key={stage} style={{ fontSize: '10px', fontWeight: active ? 700 : 500, color: active ? '#1a2744' : '#94a3b8' }}>{stage}</span>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => setTrackedShipment(null)}
                            style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}

            {selectedShipment && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={() => setSelectedShipment(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '460px', width: '100%', padding: '24px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Shipment Details</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Live tracking information</p>
                            </div>
                            <button onClick={() => setSelectedShipment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px', lineHeight: 1 }}>✕</button>
                        </div>

                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shipment ID</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{selectedShipment.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Ref</span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedShipment.ref}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Destination</span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedShipment.destination}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zone</span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedShipment.zone}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ETA</span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedShipment.eta}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Transit Progress</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{selectedShipment.progress}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedShipment.progress}%` }}
                                    transition={{ duration: 0.8 }}
                                    style={{ height: '100%', backgroundColor: selectedShipment.progress === 100 ? '#22c55e' : '#334155', borderRadius: '99px' }}
                                />
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                                {selectedShipment.progress === 100 ? 'Delivered' : selectedShipment.progress >= 60 ? 'Out for delivery' : selectedShipment.progress >= 40 ? 'In transit' : 'Picked up'}
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedShipment(null)}
                            style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};
export const DeliveryPage: React.FC = () => {
    const [selectedStop, setSelectedStop] = React.useState<{ route: number; stop: number } | null>(null);
    const [allStopsRoute, setAllStopsRoute] = React.useState<number | null>(null);

    const stopDetails = [
        { stop: 1, address: '12 Harbor View Rd, Newark', customer: 'Apex Distributors', time: '09:00 AM', status: 'Delivered', packages: 3 },
        { stop: 2, address: '45 Industrial Blvd, Jersey City', customer: 'Metro Supplies Co.', time: '09:45 AM', status: 'Delivered', packages: 1 },
        { stop: 3, address: '78 Commerce St, Hoboken', customer: 'Sunrise Retail', time: '10:30 AM', status: 'In Progress', packages: 2 },
        { stop: 4, address: '101 Freight Ave, Bayonne', customer: 'Delta Warehouse', time: '11:15 AM', status: 'Pending', packages: 4 },
        { stop: 5, address: '220 Logistics Park, Elizabeth', customer: 'Global Trade Inc.', time: '12:00 PM', status: 'Pending', packages: 2 },
        { stop: 6, address: '55 Port Road, Kearny', customer: 'Harbor Freight Co.', time: '12:45 PM', status: 'Pending', packages: 1 },
        { stop: 7, address: '300 Industrial Way, Linden', customer: 'Linden Supplies', time: '01:30 PM', status: 'Pending', packages: 3 },
        { stop: 8, address: '88 Commerce Ave, Perth Amboy', customer: 'Perth Trading', time: '02:15 PM', status: 'Pending', packages: 2 },
        { stop: 9, address: '14 Dock St, Carteret', customer: 'Carteret Logistics', time: '03:00 PM', status: 'Pending', packages: 5 },
        { stop: 10, address: '67 Warehouse Blvd, Rahway', customer: 'Rahway Distributors', time: '03:45 PM', status: 'Pending', packages: 2 },
        { stop: 11, address: '22 Terminal Rd, Woodbridge', customer: 'Woodbridge Retail', time: '04:30 PM', status: 'Pending', packages: 1 },
        { stop: 12, address: '9 Depot Lane, Edison', customer: 'Edison Supply Co.', time: '05:15 PM', status: 'Pending', packages: 3 },
    ];

    const statusColor: Record<string, string> = {
        'Delivered': '#22c55e',
        'In Progress': '#1a2744',
        'Pending': '#94a3b8',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic">Route Optimization Suite</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic lowercase">DYNAMIC ASSIGNMENT & REAL-TIME DRIVER COORDINATION</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold italic shadow-lg group-hover:rotate-6 transition-transform">R-{i}</div>
                                <Badge variant="info">D-Fleet {i}</Badge>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assigned Specialist</p>
                                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Michael Henderson {i}</h4>
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stops: 12</span>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">In Progress</span>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedStop({ route: i, stop: s })}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all hover:scale-110 active:scale-95 ${s < 3 ? 'bg-[#1a2744] text-white border-[#1a2744]' : 'bg-white text-slate-400 border-slate-200 hover:border-[#1a2744] hover:text-[#1a2744]'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setAllStopsRoute(i)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-200 text-slate-400 hover:border-[#1a2744] hover:text-[#1a2744] hover:bg-slate-50 transition-all active:scale-95"
                                        title="View all stops"
                                    >
                                        ...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* All Stops Modal */}
            {allStopsRoute !== null && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={() => setAllStopsRoute(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '560px', width: '100%', overflow: 'hidden', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ height: '6px', backgroundColor: '#1a2744', flexShrink: 0 }} />
                        <div style={{ padding: '24px 24px 16px', flexShrink: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>All Stops — Route R-{allStopsRoute}</h2>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Michael Henderson {allStopsRoute} · D-Fleet {allStopsRoute} · 12 Stops</p>
                                </div>
                                <button onClick={() => setAllStopsRoute(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
                            </div>
                        </div>

                        {/* Scrollable stops list */}
                        <div style={{ overflowY: 'auto', padding: '0 24px 24px', flex: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {stopDetails.map((detail) => (
                                    <div
                                        key={detail.stop}
                                        onClick={() => { setAllStopsRoute(null); setSelectedStop({ route: allStopsRoute, stop: detail.stop }); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                    >
                                        {/* Stop number */}
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, backgroundColor: statusColor[detail.status], color: '#fff' }}>
                                            {detail.stop}
                                        </div>
                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{detail.customer}</p>
                                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{detail.address}</p>
                                        </div>
                                        {/* Time & status */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{detail.time}</p>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor[detail.status] }}>{detail.status}</span>
                                        </div>
                                        <ChevronRight size={14} color="#94a3b8" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
                            <button
                                onClick={() => setAllStopsRoute(null)}
                                style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Single Stop Detail Modal */}
            {selectedStop && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={() => setSelectedStop(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '460px', width: '100%', overflow: 'hidden' }}
                    >
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        Stop {selectedStop.stop} — Route R-{selectedStop.route}
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Delivery stop details</p>
                                </div>
                                <button onClick={() => setSelectedStop(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
                            </div>

                            {(() => {
                                const detail = stopDetails[selectedStop.stop - 1];
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', backgroundColor: statusColor[detail.status] + '20', color: statusColor[detail.status], border: `1px solid ${statusColor[detail.status]}40` }}>
                                                {detail.status}
                                            </span>
                                        </div>
                                        {[
                                            { label: 'Customer', value: detail.customer },
                                            { label: 'Address', value: detail.address },
                                            { label: 'Scheduled Time', value: detail.time },
                                            { label: 'Packages', value: `${detail.packages} package${detail.packages > 1 ? 's' : ''}` },
                                            { label: 'Driver', value: `Michael Henderson ${selectedStop.route}` },
                                            { label: 'Fleet', value: `D-Fleet ${selectedStop.route}` },
                                        ].map(({ label, value }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{value}</span>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setSelectedStop(null)}
                                            style={{ marginTop: '8px', width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

// --- Carrier Partners ---
export const CarrierPartnersPage: React.FC = () => {
    const { showNotification } = useNotifications();
    const [showModal, setShowModal] = React.useState(false);
    const [carriers, setCarriers] = React.useState([
        { name: 'Global Logistics Inc.', code: 'GLI-99', reliability: 98, status: 'Active' },
        { name: 'Swift Express Co.', code: 'SEC-24', reliability: 92, status: 'Reviewing' },
        { name: 'Oceanic Freight', code: 'OF-102', reliability: 85, status: 'Active' },
    ]);
    const [form, setForm] = React.useState({ name: '', code: '', contact: '', region: '', reliability: '' });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Carrier name is required';
        if (!form.code.trim()) e.code = 'Registration ID is required';
        if (!form.contact.trim()) e.contact = 'Contact person is required';
        if (!form.region.trim()) e.region = 'Region is required';
        if (!form.reliability || isNaN(Number(form.reliability)) || Number(form.reliability) < 1 || Number(form.reliability) > 100)
            e.reliability = 'Enter a valid reliability % (1–100)';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setCarriers([...carriers, { name: form.name, code: form.code, reliability: Number(form.reliability), status: 'Reviewing' }]);
        showNotification({ type: 'success', title: 'Carrier Onboarded', message: `${form.name} has been added and is under review.`, duration: 4000 });
        setForm({ name: '', code: '', contact: '', region: '', reliability: '' });
        setErrors({});
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setForm({ name: '', code: '', contact: '', region: '', reliability: '' });
        setErrors({});
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Carrier Partners</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">External shipping providers and resource management</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1a2744', color: '#ffffff', padding: '0 24px', height: '40px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                    <Plus size={14} /> Onboard Carrier
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carriers.map((carrier, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-2 transition-all">
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div className="p-8">
                            <div className="absolute top-6 right-0 w-24 h-24 bg-slate-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-150" />
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all"><Building2 size={24} /></div>
                                <Badge variant={carrier.status === 'Active' ? 'success' : 'warning'}>{carrier.status.toUpperCase()}</Badge>
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{carrier.name}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest">Registration ID: {carrier.code}</p>
                                </div>
                                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reliability Rating</span>
                                        <span className="text-[10px] font-bold text-slate-700">{carrier.reliability}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${carrier.reliability}%`, backgroundColor: '#1a2744' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Onboard Carrier Modal */}
            {showModal && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '480px', width: '100%', overflow: 'hidden' }}
                    >
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Onboard New Carrier</h2>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Add a new shipping partner to the network</p>
                                </div>
                                <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { key: 'name', label: 'Carrier Name', placeholder: 'e.g., FastTrack Logistics' },
                                    { key: 'code', label: 'Registration ID', placeholder: 'e.g., FTL-201' },
                                    { key: 'contact', label: 'Contact Person', placeholder: 'e.g., John Smith' },
                                    { key: 'region', label: 'Operating Region', placeholder: 'e.g., North East' },
                                    { key: 'reliability', label: 'Reliability % (1–100)', placeholder: 'e.g., 90' },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</label>
                                        <input
                                            type="text"
                                            value={form[key as keyof typeof form]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            placeholder={placeholder}
                                            style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: `1px solid ${errors[key] ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '8px', backgroundColor: errors[key] ? '#fff1f2' : '#ffffff', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                        {errors[key] && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button onClick={handleClose} style={{ flex: 1, padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    Onboard Carrier
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

// --- Customer Feedback & Intelligence ---
export const CustomerFeedbackPage: React.FC = () => {
    const { showNotification } = useNotifications();
    const [showAllModal, setShowAllModal] = React.useState(false);
    const [replyingTo, setReplyingTo] = React.useState<number | null>(null);
    const [replyText, setReplyText] = React.useState('');

    const reviews = [
        { id: 1, customer: 'Rajesh Kumar', rating: 5, time: '2 hours ago', shipment: 'SH-00129', comment: 'Extremely satisfied with the delivery speed and the professional conduct of the driver. Items reached in perfect condition!' },
        { id: 2, customer: 'Priya Sharma', rating: 4, time: '5 hours ago', shipment: 'SH-00229', comment: 'Good service overall. Delivery was on time and packaging was intact. Would recommend.' },
        { id: 3, customer: 'Anil Mehta', rating: 5, time: '1 day ago', shipment: 'SH-00329', comment: 'Outstanding experience! The driver was courteous and the delivery was faster than expected.' },
        { id: 4, customer: 'Sunita Patel', rating: 3, time: '1 day ago', shipment: 'SH-00429', comment: 'Delivery was slightly delayed but the driver kept us informed. Product condition was good.' },
        { id: 5, customer: 'Vikram Singh', rating: 5, time: '2 days ago', shipment: 'SH-00529', comment: 'Perfect delivery. No complaints at all. Will use this service again.' },
        { id: 6, customer: 'Meena Iyer', rating: 4, time: '2 days ago', shipment: 'SH-00629', comment: 'Very professional team. Delivery was smooth and hassle-free.' },
    ];

    const handleReply = (id: number) => {
        if (!replyText.trim()) return;
        showNotification({ type: 'success', title: 'Reply Sent', message: `Your reply to customer feedback #${id} has been sent.`, duration: 3000 });
        setReplyingTo(null);
        setReplyText('');
    };

    const ReviewCard = ({ review, showFull = false }: { review: typeof reviews[0]; showFull?: boolean }) => (
        <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm" style={{ backgroundColor: '#1a2744' }}>
                        {review.customer.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">{review.customer}</h4>
                        <div className="flex gap-1 mt-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= review.rating ? '#f59e0b' : 'none'} className="text-amber-400" />)}
                        </div>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.time}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shipment: {review.shipment}</span>
                    <Badge variant="success" className="text-[8px] py-0">VERIFIED</Badge>
                </div>
                {showFull && (
                    <button
                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                        style={{ fontSize: '11px', fontWeight: 700, color: '#1a2744', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {replyingTo === review.id ? 'Cancel' : 'Reply'}
                    </button>
                )}
            </div>
            {showFull && replyingTo === review.id && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        style={{ flex: 1, padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                    <button
                        onClick={() => handleReply(review.id)}
                        style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, backgroundColor: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Delivery Feedback</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Customer satisfaction ratings and service quality metrics</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 h-10 shadow-sm text-slate-600 font-bold text-xs">
                    <span>Total Ratings: 1,280</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div className="bg-slate-900 p-8 text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">CSAT SCORE</h3>
                            <p className="text-5xl font-bold tracking-tighter">4.92</p>
                            <div className="mt-6 flex gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i < 5 ? '#64748b' : 'none'} className="text-slate-400" />)}
                            </div>
                            <p className="text-[11px] text-slate-300 mt-6 font-bold uppercase tracking-widest">+0.4% this cycle</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                        <div className="p-8">
                            <h4 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">Satisfaction Breakdown</h4>
                            <div className="space-y-6">
                                {['Service Speed', 'Product Condition', 'Driver Conduct'].map((metric, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span>{metric}</span>
                                            <span className="text-slate-900">{92 - i * 4}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${92 - i * 4}%`, backgroundColor: '#1a2744' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div style={{ height: '6px', backgroundColor: '#1a2744' }} />
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Customer Reviews</h3>
                            <button
                                onClick={() => setShowAllModal(true)}
                                style={{ fontSize: '11px', fontWeight: 700, color: '#1a2744', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                View All Feedback
                            </button>
                        </div>
                        <div className="space-y-4">
                            {reviews.slice(0, 4).map(r => <ReviewCard key={r.id} review={r} />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* View All Feedback Modal */}
            {showAllModal && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
                    onClick={() => setShowAllModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '600px', width: '100%', overflow: 'hidden', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ height: '6px', backgroundColor: '#1a2744', flexShrink: 0 }} />
                        <div style={{ padding: '24px 24px 16px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>All Customer Feedback</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{reviews.length} reviews · Avg 4.92 / 5</p>
                            </div>
                            <button onClick={() => setShowAllModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>✕</button>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {reviews.map(r => <ReviewCard key={r.id} review={r} showFull />)}
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
                            <button
                                onClick={() => setShowAllModal(false)}
                                style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a2744', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};
