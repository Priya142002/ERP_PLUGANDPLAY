import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Download, Mail } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { DataTableWrapper } from '../../../components/common';

export const InvoiceReceipt: React.FC = () => {
  const [invoices] = useState([
    { id: '1', invoiceNo: 'INV-001', customer: 'John Doe', amount: '$125.50', gst: '$6.28', total: '$131.78', date: '2026-03-24', status: 'Paid' },
    { id: '2', invoiceNo: 'INV-002', customer: 'Jane Smith', amount: '$245.00', gst: '$12.25', total: '$257.25', date: '2026-03-24', status: 'Paid' },
    { id: '3', invoiceNo: 'INV-003', customer: 'Bob Wilson', amount: '$85.00', gst: '$4.25', total: '$89.25', date: '2026-03-24', status: 'Pending' },
    { id: '4', invoiceNo: 'INV-004', customer: 'Alice Brown', amount: '$180.75', gst: '$9.04', total: '$189.79', date: '2026-03-24', status: 'Paid' },
  ]);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const columns = [
    {
      key: 'invoiceNo' as const,
      label: 'Invoice No',
      render: (value: string) => <span className="font-bold text-slate-800 text-sm">{value}</span>
    },
    {
      key: 'customer' as const,
      label: 'Customer',
      render: (value: string) => <span className="text-slate-700 text-sm">{value}</span>
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right' as const,
      render: (value: string) => <span className="text-slate-900 text-sm">{value}</span>
    },
    {
      key: 'gst' as const,
      label: 'GST',
      align: 'right' as const,
      render: (value: string) => <span className="text-slate-600 text-sm">{value}</span>
    },
    {
      key: 'total' as const,
      label: 'Total',
      align: 'right' as const,
      render: (value: string) => <span className="font-bold text-emerald-600 text-sm">{value}</span>
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => <span className="text-slate-500 text-xs">{value}</span>
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Paid' ? 'success' : 'warning'} className="text-[10px]">{value}</Badge>
      )
    }
  ];

  const actions = [
    {
      label: 'Print',
      icon: <Printer size={14} />,
      onClick: (row: any) => {
        setSelectedInvoice(row);
        setShowPrintModal(true);
      },
      variant: 'primary' as const
    },
    {
      label: 'Download',
      icon: <Download size={14} />,
      onClick: (row: any) => {
        setSelectedInvoice(row);
        setShowDownloadModal(true);
      },
      variant: 'primary' as const
    },
    {
      label: 'Email',
      icon: <Mail size={14} />,
      onClick: (row: any) => {
        setSelectedInvoice(row);
        setShowEmailModal(true);
      },
      variant: 'primary' as const
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice & Receipt</h1>
        <p className="text-sm text-slate-500 mt-1">Generate bills, print, download, email with GST details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Invoices', value: '1,245', icon: FileText, color: 'bg-blue-600', hex: '#2563eb' },
          { label: 'Paid', value: '1,156', icon: FileText, color: 'bg-emerald-600', hex: '#059669' },
          { label: 'Pending', value: '89', icon: FileText, color: 'bg-amber-600', hex: '#d97706' },
          { label: 'Today\'s Revenue', value: '$8,450', icon: FileText, color: 'bg-purple-600', hex: '#9333ea' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative p-5 rounded-xl border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: stat.hex }} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200 group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* GST Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">GST Details</h3>
            <p className="text-xs text-slate-600">GSTIN: 29ABCDE1234F1Z5</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 mb-1">Total GST Collected Today</p>
            <p className="text-xl font-bold text-blue-600">$422.50</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <DataTableWrapper
        data={invoices}
        columns={columns}
        actions={actions}
        emptyMessage="No invoices found"
      />

      {/* Print Modal */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => {
          setShowPrintModal(false);
          setSelectedInvoice(null);
        }}
        title="Print Invoice"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Ready to print invoice <span className="font-bold text-slate-900">{selectedInvoice?.invoiceNo}</span>
          </p>
          {selectedInvoice && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST:</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.gst}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-bold">Total:</span>
                  <span className="font-bold text-emerald-600">{selectedInvoice.total}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowPrintModal(false);
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              leftIcon={<Printer size={14} />}
              onClick={() => {
                alert('Printing invoice...');
                setShowPrintModal(false);
                setSelectedInvoice(null);
              }}
            >
              Print
            </Button>
          </div>
        </div>
      </Modal>

      {/* Download Modal */}
      <Modal
        isOpen={showDownloadModal}
        onClose={() => {
          setShowDownloadModal(false);
          setSelectedInvoice(null);
        }}
        title="Download Invoice"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Download invoice <span className="font-bold text-slate-900">{selectedInvoice?.invoiceNo}</span> as PDF
          </p>
          {selectedInvoice && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Invoice:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-bold text-emerald-600">{selectedInvoice.total}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowDownloadModal(false);
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              leftIcon={<Download size={14} />}
              onClick={() => {
                alert('Downloading invoice...');
                setShowDownloadModal(false);
                setSelectedInvoice(null);
              }}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedInvoice(null);
        }}
        title="Email Invoice"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Send invoice <span className="font-bold text-slate-900">{selectedInvoice?.invoiceNo}</span> via email
          </p>
          {selectedInvoice && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">To:</span>
                    <span className="font-medium text-slate-900">{selectedInvoice.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoice:</span>
                    <span className="font-bold text-slate-900">{selectedInvoice.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-bold text-emerald-600">{selectedInvoice.total}</span>
                  </div>
                </div>
              </div>
              <input
                type="email"
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowEmailModal(false);
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              leftIcon={<Mail size={14} />}
              onClick={() => {
                alert('Sending email...');
                setShowEmailModal(false);
                setSelectedInvoice(null);
              }}
            >
              Send Email
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};
