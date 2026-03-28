import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, RotateCcw, Search } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useNotifications } from '../../../context/AppContext';

type ShipmentStatus = 'Pending' | 'Dispatched' | 'Delivered';

interface Shipment {
  id: string;
  invoiceNo: string;
  customer: string;
  address: string;
  status: ShipmentStatus;
  dispatchDate?: string;
  deliveryDate?: string;
}

interface SalesReturn {
  id: string;
  returnNo: string;
  invoiceNo: string;
  customer: string;
  returnDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Completed';
}

type TabType = 'shipment' | 'dispatch' | 'delivery' | 'returns';

export const LogisticsManagementPage: React.FC = () => {
  const { showNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('shipment');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [shipments, setShipments] = useState<Shipment[]>([
    { id: 'SHP-001', invoiceNo: 'INV-2024-001', customer: 'John Doe', address: '123 Main St, Mumbai', status: 'Pending' },
    { id: 'SHP-002', invoiceNo: 'INV-2024-002', customer: 'Jane Smith', address: '456 Park Ave, Delhi', status: 'Pending' },
    { id: 'SHP-003', invoiceNo: 'INV-2024-003', customer: 'Bob Johnson', address: '789 Oak Rd, Bangalore', status: 'Dispatched', dispatchDate: '2026-03-25' },
    { id: 'SHP-004', invoiceNo: 'INV-2024-004', customer: 'Alice Brown', address: '321 Elm St, Hyderabad', status: 'Delivered', deliveryDate: '2026-03-26' },
  ]);

  // Mock data for sales returns - in real app, this would come from Sales Returns module
  const [salesReturns] = useState<SalesReturn[]>([
    { id: 'RET-001', returnNo: 'SR-2024-001', invoiceNo: 'INV-2024-005', customer: 'Michael Chen', returnDate: '2026-03-20', reason: 'Defective product', status: 'Approved' },
    { id: 'RET-002', returnNo: 'SR-2024-002', invoiceNo: 'INV-2024-006', customer: 'Sarah Williams', returnDate: '2026-03-22', reason: 'Wrong item delivered', status: 'Completed' },
    { id: 'RET-003', returnNo: 'SR-2024-003', invoiceNo: 'INV-2024-007', customer: 'David Lee', returnDate: '2026-03-24', reason: 'Customer changed mind', status: 'Pending' },
  ]);

  const handleDispatch = (shipmentId: string) => {
    setShipments(prev => prev.map(s => 
      s.id === shipmentId 
        ? { ...s, status: 'Dispatched', dispatchDate: new Date().toISOString().split('T')[0] }
        : s
    ));
    showNotification({
      type: 'success',
      title: 'Shipment Dispatched',
      message: `Shipment ${shipmentId} has been marked as dispatched.`,
      duration: 3000
    });
  };

  const handleMarkDelivered = (shipmentId: string) => {
    setShipments(prev => prev.map(s => 
      s.id === shipmentId 
        ? { ...s, status: 'Delivered', deliveryDate: new Date().toISOString().split('T')[0] }
        : s
    ));
    showNotification({
      type: 'success',
      title: 'Delivery Confirmed',
      message: `Shipment ${shipmentId} has been marked as delivered.`,
      duration: 3000
    });
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'shipment':
        return matchesSearch && s.status === 'Pending';
      case 'dispatch':
        return matchesSearch && s.status === 'Dispatched';
      case 'delivery':
        return matchesSearch && (s.status === 'Dispatched' || s.status === 'Delivered');
      default:
        return matchesSearch;
    }
  });

  const filteredReturns = salesReturns.filter(r =>
    r.returnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'shipment' as TabType, label: 'Shipment', icon: <Package size={16} /> },
    { id: 'dispatch' as TabType, label: 'Dispatch', icon: <Truck size={16} /> },
    { id: 'delivery' as TabType, label: 'Delivery Confirmation', icon: <CheckCircle size={16} /> },
    { id: 'returns' as TabType, label: 'Returns', icon: <RotateCcw size={16} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Logistics Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage shipments, dispatch, delivery, and returns</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by invoice or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'returns' ? (
            // Returns Tab - Show sales returns
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Return No</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Return Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No returns found
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map(returnItem => (
                    <tr key={returnItem.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{returnItem.returnNo}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{returnItem.invoiceNo}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{returnItem.customer}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{returnItem.returnDate}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{returnItem.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          returnItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          returnItem.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {returnItem.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // Shipment Tabs
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  {activeTab === 'dispatch' && (
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Dispatch Date</th>
                  )}
                  {activeTab === 'delivery' && (
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Delivery Date</th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'delivery' || activeTab === 'dispatch' ? 6 : 5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No shipments found
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map(shipment => (
                    <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{shipment.invoiceNo}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{shipment.customer}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{shipment.address}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          shipment.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {shipment.status}
                        </span>
                      </td>
                      {activeTab === 'dispatch' && (
                        <td className="px-6 py-4 text-sm text-slate-600">{shipment.dispatchDate || '-'}</td>
                      )}
                      {activeTab === 'delivery' && (
                        <td className="px-6 py-4 text-sm text-slate-600">{shipment.deliveryDate || '-'}</td>
                      )}
                      <td className="px-6 py-4 text-right">
                        {activeTab === 'shipment' && shipment.status === 'Pending' && (
                          <Button
                            onClick={() => handleDispatch(shipment.id)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 text-xs rounded-lg"
                          >
                            Dispatch
                          </Button>
                        )}
                        {activeTab === 'delivery' && shipment.status === 'Dispatched' && (
                          <Button
                            onClick={() => handleMarkDelivered(shipment.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-xs rounded-lg"
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Banner for Returns Tab */}
      {activeTab === 'returns' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <RotateCcw size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Sales Returns</h3>
              <p className="text-sm text-blue-700">
                Returns are managed in the Sales module. This tab displays all approved returns from Sales for logistics tracking purposes.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LogisticsManagementPage;
