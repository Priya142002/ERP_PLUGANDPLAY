import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react";
import Button from "../../../components/ui/Button";
import { DataTableWrapper, TableFilters } from "../../../components/common";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";
import { exportSingleSheetToExcel } from "../../../utils/reportGenerator";

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MOCK_CREDIT_NOTES = [
  { 
    id: '1', creditNo: 'CN-1001', date: '2026-03-12', customer: 'Nexus Enterprises', amount: 850.00, status: 'Draft', invoiceRef: 'INV-2026-001',
    lines: [{ id: '1', description: 'Price Correction - Bulk Discount', amount: 850.00 }],
    reason: 'Price Correction'
  },
  { 
    id: '2', creditNo: 'CN-1002', date: '2026-03-10', customer: 'Sarah Johnson', amount: 120.00, status: 'Issued', invoiceRef: 'INV-2026-002',
    lines: [{ id: '1', description: 'Damaged Goods Return', amount: 120.00 }],
    reason: 'Damaged Goods'
  },
];

export const CustomerCreditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [creditNotes, setCreditNotes] = useState(MOCK_CREDIT_NOTES);
  const [search, setSearch] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; creditNote: any | null }>({ 
    isOpen: false, 
    creditNote: null 
  });

  const customerOptions = useMemo(() => Array.from(new Set(creditNotes.map(c => c.customer))), [creditNotes]);

  const displayed = useMemo(() => {
    let list = [...creditNotes];
    
    // Search
    if (search) {
      list = list.filter(c => 
        c.creditNo.toLowerCase().includes(search.toLowerCase()) || 
        c.customer.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filters
    if (filterCustomer) list = list.filter(c => c.customer === filterCustomer);
    if (filterMonth) {
      list = list.filter(c => {
        const date = new Date(c.date);
        return MONTHS[date.getMonth()] === filterMonth;
      });
    }
    
    return list;
  }, [creditNotes, search, filterCustomer, filterMonth]);

  const handleEditClick = (item: any) => {
    navigate(`/admin/sales/credit-notes/${item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    setDeleteModal({ isOpen: true, creditNote: item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.creditNote) {
      setCreditNotes(creditNotes.filter(c => c.id !== deleteModal.creditNote.id));
      setDeleteModal({ isOpen: false, creditNote: null });
    }
  };

  const handleExport = () => {
    const headers = ['Credit Note #', 'Date', 'Customer', 'Amount', 'Status', 'Invoice Ref', 'Reason'];
    const data = displayed.map(note => [
      note.creditNo,
      note.date,
      note.customer,
      note.amount,
      note.status,
      note.invoiceRef,
      note.reason
    ]);
    exportSingleSheetToExcel(headers, data, 'Customer_Credit_Notes');
  };

  const columns = [
    {
      key: 'creditNo' as const,
      label: 'Credit Note #',
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="font-semibold text-slate-900">{value}</div>
        </div>
      )
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Calendar size={14} className="text-slate-400" />
          {value}
        </div>
      )
    },
    {
      key: 'customer' as const,
      label: 'Customer',
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">Rs. {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Issued' ? 'success' : 'warning'}>{value}</Badge>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Credit Note</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-4 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 hover:text-black active:scale-95 transition-all" leftIcon={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent px-6 h-10 text-xs font-bold rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/admin/sales/credit-notes/create')}
          >
            New Credit Note
          </Button>
        </div>
      </div>

      <TableFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search credit notes..."
        filters={[
          { label: 'Filter by Customer', value: filterCustomer, options: customerOptions, onChange: setFilterCustomer },
          { label: 'Filter by Month', value: filterMonth, options: MONTHS, onChange: setFilterMonth }
        ]}
        onClearAll={() => { setSearch(''); setFilterCustomer(''); setFilterMonth(''); }}
        showClearButton={!!(search || filterCustomer || filterMonth)}
      />

      <DataTableWrapper 
        data={displayed}
        columns={columns}
        onEmptyClick={() => navigate('/admin/sales/credit-notes/create')}
        actions={[
          {
            label: 'Edit',
            icon: <Edit size={14} />,
            onClick: (item) => handleEditClick(item),
            variant: 'primary'
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: (item) => handleDeleteClick(item),
            variant: 'danger'
          }
        ]}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, creditNote: null })}
        title="Delete Credit Note"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-slate-900 mb-2">
                Are you sure you want to delete "{deleteModal.creditNote?.creditNo}"?
              </p>
              <p className="text-sm text-slate-500">
                This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, creditNote: null })}
              className="flex-1 bg-[#002147] hover:bg-[#003366] text-white border-none h-11 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none h-11 rounded-xl font-bold"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CustomerCreditNotePage;
