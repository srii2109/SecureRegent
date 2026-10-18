import React, { useState } from 'react';
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Layers,
  Filter,
  CheckCircle,
  FileText,
  Briefcase,
  Shield,
  CreditCard,
  Building,
} from 'lucide-react';
import { Lead } from '../types';
import { formatINR } from '../utils/analytics';

interface RelationalExplorerModalProps {
  leads: Lead[];
  isOpen: boolean;
  onClose: () => void;
  onSelectLead: (lead: Lead) => void;
}

export const RelationalExplorerModal: React.FC<RelationalExplorerModalProps> = ({
  leads,
  isOpen,
  onClose,
  onSelectLead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedLeads, setExpandedLeads] = useState<{ [id: string]: boolean }>({});

  if (!isOpen) return null;

  const toggleLead = (id: string) => {
    setExpandedLeads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next: { [id: string]: boolean } = {};
    leads.slice(0, 20).forEach((l) => (next[l.id] = true));
    setExpandedLeads(next);
  };

  const collapseAll = () => {
    setExpandedLeads({});
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Data Relationships &amp; Drill-Down Explorer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hierarchical view: Lead ➔ Quotations (1:N) ➔ Deals (1:N) ➔ Orders (1:N) ➔ Payments (1:N)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by company, lead ID, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Converted">Converted</option>
                <option value="Qualified">Qualified</option>
                <option value="Unqualified">Unqualified</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">
              Found <strong className="text-slate-900">{filtered.length}</strong> records
            </span>
            <button
              onClick={expandAll}
              className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium"
            >
              Expand Top 20
            </button>
            <button
              onClick={collapseAll}
              className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Tree List */}
        <div className="p-4 overflow-y-auto max-h-[62vh] space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching lead records found.
            </div>
          ) : (
            filtered.map((lead) => {
              const isExpanded = !!expandedLeads[lead.id];
              const allOrders = lead.deals.flatMap((d) => d.orders);
              const allPayments = allOrders.flatMap((o) => o.payments);
              const totalVal = lead.deals.reduce((s, d) => s + d.value, 0);

              return (
                <div
                  key={lead.id}
                  className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                >
                  {/* Lead Row */}
                  <div
                    onClick={() => toggleLead(lead.id)}
                    className="p-3.5 bg-white hover:bg-slate-50/70 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {lead.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{lead.company}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              lead.status === 'Converted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lead.status === 'Qualified'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Rep: <strong>{lead.assignedTo}</strong> • Source:{' '}
                          <span className="text-blue-600">{lead.source}</span> • Contact: {lead.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right shrink-0">
                      <div className="text-xs">
                        <div className="text-[10px] text-slate-400">Total Value</div>
                        <div className="font-bold text-slate-900">{formatINR(totalVal)}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        Drill Down
                      </button>
                    </div>
                  </div>

                  {/* Expanded Nested Levels */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 p-4 border-t border-slate-100 space-y-3">
                      {/* 1. Quotations Level */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Quotations ({lead.quotations.length})</span>
                        </div>
                        {lead.quotations.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic pl-5">
                            No quotations issued yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                            {lead.quotations.map((q) => (
                              <div
                                key={q.id}
                                className="bg-white border border-slate-200 rounded-lg p-2 text-xs flex justify-between items-center"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-blue-600">{q.id}</span>
                                    <span className="font-medium text-slate-800">{q.service}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    Valid: {q.validUntil}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-slate-900">
                                    {formatINR(q.amount)}
                                  </span>
                                  <span className="block text-[9px] text-emerald-600 font-semibold">
                                    {q.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Deals Level */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                          <span>Deals ({lead.deals.length})</span>
                        </div>
                        {lead.deals.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic pl-5">
                            No active deals closed.
                          </div>
                        ) : (
                          <div className="space-y-2 pl-4">
                            {lead.deals.map((deal) => (
                              <div
                                key={deal.id}
                                className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-purple-600">
                                      {deal.id}
                                    </span>
                                    <span className="font-bold text-slate-800">{deal.title}</span>
                                    <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                                      Priority: {deal.priority}
                                    </span>
                                  </div>
                                  <span className="font-bold text-slate-900">
                                    {formatINR(deal.value)}
                                  </span>
                                </div>

                                {/* Orders & Payments for this deal */}
                                <div className="pl-3 border-l-2 border-purple-200 space-y-1 text-[11px]">
                                  <div className="font-semibold text-slate-600">
                                    Orders ({deal.orders.length}) &amp; Transactions:
                                  </div>
                                  {deal.orders.map((ord) => (
                                    <div
                                      key={ord.id}
                                      className="bg-slate-50 p-2 rounded border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                                    >
                                      <div>
                                        <span className="font-mono font-bold text-amber-700">
                                          {ord.id}
                                        </span>{' '}
                                        - {ord.service} (
                                        <strong className="text-blue-600">{ord.currentStage}</strong>) •
                                        Ops: {ord.assignedTo}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-emerald-700 font-bold">
                                          Paid:{' '}
                                          {formatINR(
                                            ord.payments.reduce((s, p) => s + p.amount, 0)
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Click on any lead record to view the complete drill-down drawer
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
