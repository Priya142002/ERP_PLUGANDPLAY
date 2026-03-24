import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { TableFilters, DataTableWrapper } from "../../../components/common";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

const MOCK_DEBIT_NOTES = [
  { id: '1', date: '2026-03-14', noteNo: 'VDN-4001', vendor: 'Global Logistics',  amount: 250.00, reason: 'Overbilling Correction', status: 'Sent'     },
  { id: '2', date: '2026-03-11', noteNo: 'VDN-4002', vendor: 'Office Essentials', amount: 45.00,  reason: 'Shortage of Supply',     status: 'Recorded' },
  { id: '3', date: '2026-03-08', noteNo: 'VDN-4003', vendor: 'Pure Water Co.',    amount: 15.00,  reason: 'Tax Adjustment',          status: 'Sent'     },
];

const TABS = ['All Debit Notes', 'Transmitted', 'Awaiting Action', 'Overbilling Claims'] as const;
type Tab = typeof TABS[number];

export const VendorDebitNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('All Debit Notes');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; noteId: string; noteNo: string }>({ 
    isOpen: false, 
    noteId: '', 
    noteNo: '' 
  });

  const vendorOptions = useMemo(() => Array.from(new Set(MOCK_DEBIT_NOTES.map(n => n.vendor))), []);

  const displayed = useMemo(() => {
    let list = [...MOCK_DEBIT_NOTES];
    if (activeTab === 'Transmitted')    list = list.filter(n => n.status === 'Sent');
    if (activeTab === 'Awaiting Action') list = list.filter(n => n.status === 'Recorded');
    if (search) list = list.filter(n =>
      n.noteNo.toLowerCase().includes(search.toLowerCase()) ||
      n.vendor.toLowerCase().includes(search.toLowerCase())
    );
    if (filterVendor) list = list.filter(n => n.vendor === filterVendor);
    if (filterStatus) list = list.filter(n => n.status === filterStatus);
    return list;
  }, [activeTab, search, filterVendor, filterStatus]);

  const handleExport = () => {
    const headers = ['Debit Note #', 'Date', 'Vendor', 'Reason', 'Debit Amount', 'Status'];
    const data = displayed.map(note => [
      note.noteNo,
      note.date,
      note.vendor,
      note.reason,
      note.amount,
      note.status
    ]);
    exportSingleSheetToExcel(headers, data, 'Vendor_Debit_Notes');
  };

  const handleDeleteClick = (note: typeof MOCK_DEBIT_NOTES[0]) => {
    setDeleteModal({ isOpen: true, noteId: note.id, noteNo: note.noteNo });
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the note
    console.log('Deleting debit note:', deleteModal.noteId);
    setDeleteModal({ isOpen: false, noteId: '', noteNo: '' });
    // You could also show a success toast here
  };

  const columns = [
    {
      key: 'noteNo' as const,
      label: 'Debit Note #',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={13} className="text-slate-400" /> {value}
        </div>
      )
    },
    {
      key: 'vendor' as const,
      label: 'Vendor',
      render: (value: string) => <span className="text-sm text-slate-600 font-medium">{value}</span>
    },
    {
      key: 'reason' as const,
      label: 'Reason',
      render: (value: string) => <span className="text-sm text-slate-500">{value}</span>
    },
    {
      key: 'amount' as const,
      label: 'Debit Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-orange-600">${val.toLocaleString()}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => value === 'Sent' ? (
        <div className="flex items-center gap-1.5 text-blue-600">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Transmitted</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Logged</span>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor Debit Note</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200" leftIcon={<Download size={14} />} onClick={handleExport}>Export</Button>
          <Button variant="primary"
            className="bg-[#002147] hover:bg-[#003366] text-white px-6 h-10 text-xs font-bold rounded-xl border-none shadow-lg shadow-blue-900/10"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/purchase/debit-note/new')}>
            New Debit Note
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border ${
              activeTab === tab ? 'bg-[#002147] text-white border-[#002147] shadow-md shadow-blue-900/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <TableFilters
        searchValue={search}
        searchPlaceholder="Search note no or vendor..."
        onSearchChange={setSearch}
        filters={[
          { label: 'Filter by Vendor', value: filterVendor, options: vendorOptions, onChange: setFilterVendor },
          { label: 'Filter by Status', value: filterStatus, options: ['Sent', 'Recorded'], onChange: setFilterStatus }
        ]}
        onClearAll={() => { setSearch(''); setFilterVendor(''); setFilterStatus(''); }}
        showClearButton={!!(search || filterVendor || filterStatus)}
      />

      <DataTableWrapper
        data={displayed}
        columns={columns}
        actions={[
          { label: 'Edit', icon: <Edit size={14} />, onClick: () => navigate('/admin/purchase/debit-note/new'), variant: 'primary', title: 'Edit' },
          { label: 'Delete', icon: <Trash2 size={14} />, onClick: handleDeleteClick, variant: 'danger', title: 'Delete' }
        ]}
        emptyMessage="No debit notes found"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, noteId: '', noteNo: '' })}
        title="Delete Debit Note"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-slate-900">Are you sure you want to delete this debit note?</p>
              <p className="text-xs text-slate-700 mt-1">
                Debit Note: <span className="font-bold">{deleteModal.noteNo}</span>
              </p>
              <p className="text-xs text-slate-600 mt-2">This action cannot be undone.</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, noteId: '', noteNo: '' })}
              className="px-6 py-2 min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="px-8 py-2 min-w-[160px] bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default VendorDebitNotePage;
