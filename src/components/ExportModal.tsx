import React from 'react';
import { X, Download, FileSpreadsheet, FileJson, Printer, Check } from 'lucide-react';
import { Lead } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  dateRangeLabel: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  leads,
  dateRangeLabel,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = [
      'Lead ID',
      'Company Name',
      'Contact Person',
      'Email',
      'Phone',
      'Status',
      'Source',
      'Sales Owner',
      'Created Date',
      'Estimated Value (INR)',
      'Quotations Count',
      'Deals Count',
      'Deals Total Value (INR)',
      'Orders Count',
      'Payments Count',
      'Total Paid (INR)',
    ];

    const rows = leads.map((l) => {
      const allOrders = l.deals.flatMap((d) => d.orders);
      const allPayments = allOrders.flatMap((o) => o.payments);
      const totalPaid = allPayments.reduce((s, p) => s + p.amount, 0);
      const totalDealVal = l.deals.reduce((s, d) => s + d.value, 0);

      return [
        `"${l.id}"`,
        `"${l.company.replace(/"/g, '""')}"`,
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.status}"`,
        `"${l.source}"`,
        `"${l.assignedTo}"`,
        `"${l.createdAt}"`,
        l.estimatedValue,
        l.quotations.length,
        l.deals.length,
        totalDealVal,
        allOrders.length,
        allPayments.length,
        totalPaid,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Business_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            reportTitle: 'Business Performance & Revenue Analytics Export',
            period: dateRangeLabel,
            generatedAt: new Date().toISOString(),
            totalLeads: leads.length,
            records: leads,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Business_Analytics_Data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Export Analytics Data</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-500 mb-2">
            Export filtered data ({leads.length} records in active window: <strong>{dateRangeLabel}</strong>)
          </p>

          {/* Option 1: CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                  Export as CSV (Excel Compatible)
                </div>
                <div className="text-[11px] text-slate-500">
                  Leads, quotations, deals &amp; financial aggregates
                </div>
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              Download <Download className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Option 2: JSON */}
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                  Export Relational JSON Schema
                </div>
                <div className="text-[11px] text-slate-500">
                  Full 1:N hierarchy for data integrations
                </div>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
              Download <Download className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Option 3: Print / PDF */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-purple-900">
                  Print Dashboard / Save as PDF
                </div>
                <div className="text-[11px] text-slate-500">
                  Formatted for board presentations
                </div>
              </div>
            </div>
            <span className="text-xs text-purple-600 font-semibold flex items-center gap-1">
              Print <Printer className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
