import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Calendar, Building2, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import type { ReportData, StatCard, TableData } from '../../utils/reportGenerator';
import { generatePDFReport, getFormattedDateTime } from '../../utils/reportGenerator';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData;
  onDownloadPDF?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
  onDownloadPDF
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Simulate a small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onDownloadPDF) {
        onDownloadPDF();
      } else {
        generatePDFReport(reportData);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#002147] p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <FileText size={24} style={{ color: '#ffffff' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold leading-tight" style={{ color: '#ffffff' }}>
                      {reportData.metadata.reportTitle}
                    </h2>
                    <p className="text-sm font-medium mt-1.5" style={{ color: '#ffffff' }}>
                      {reportData.metadata.companyName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                  style={{ color: '#ffffff' }}
                >
                  <X size={20} style={{ color: '#ffffff' }} />
                </button>
              </div>

              {/* Report Info Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} />
                    <span className="font-medium">{getFormattedDateTime()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={14} />
                    <span className="font-medium uppercase tracking-wider">
                      {reportData.metadata.reportType} Report
                    </span>
                  </div>
                </div>
                {reportData.metadata.dateRange && (
                  <div className="text-slate-600 font-medium">
                    Period: {reportData.metadata.dateRange}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {reportData.sections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 border-b-2 border-indigo-600 pb-2">
                      {section.title}
                    </h3>

                    {section.type === 'stats' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(section.data as StatCard[]).map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                          >
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mb-1">
                              {stat.value}
                            </p>
                            {stat.trend && (
                              <p className="text-xs text-emerald-600 font-medium">
                                {stat.trend}
                              </p>
                            )}
                            {stat.description && (
                              <p className="text-xs text-slate-400 mt-2 italic">
                                {stat.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'table' && (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left bg-white">
                          <thead>
                            <tr className="bg-[#002147] text-white">
                              {(section.data as TableData).headers.map((header, idx) => (
                                <th
                                  key={idx}
                                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {(section.data as TableData).rows.map((row, rowIdx) => (
                              <tr
                                key={rowIdx}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className="px-4 py-3 text-sm text-slate-700"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.type === 'text' && (
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {section.data as string}
                        </p>
                      </div>
                    )}

                    {section.type === 'list' && (
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <ul className="space-y-2">
                          {(section.data as string[]).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="text-indigo-600 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <p className="text-xs text-slate-500">
                  This report was generated automatically from system data
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="px-4 py-2 text-sm border-slate-300 hover:bg-slate-100"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="bg-[#002147] hover:bg-[#003366] text-white px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
