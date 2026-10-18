import React, { useState } from 'react';
import {
  X,
  User,
  FileText,
  Briefcase,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  CreditCard,
  Building,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';
import { Lead } from '../types';
import { formatINR } from '../utils/analytics';

interface DrillDownModalProps {
  lead: Lead | null;
  onClose: () => void;
  initialTab?: 'summary' | 'quotes' | 'deals' | 'orders' | 'payments' | 'tree';
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  lead,
  onClose,
  initialTab = 'summary',
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'quotes' | 'deals' | 'orders' | 'payments' | 'tree'>(initialTab);

  if (!lead) return null;

  // Flatten all child orders and payments for this lead
  const allOrders = lead.deals.flatMap((d) => d.orders);
  const allPayments = allOrders.flatMap((o) => o.payments);
  const totalPaid = allPayments.reduce((s, p) => s + p.amount, 0);
  const totalDealVal = lead.deals.reduce((s, d) => s + d.value, 0);
  const pendingAmount = Math.max(0, totalDealVal - totalPaid);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm text-sm">
              {lead.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {lead.company}
                </h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono px-2 py-0.5 rounded">
                  {lead.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lead.status === 'Converted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : lead.status === 'Qualified'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Assigned to: <span className="text-slate-200 font-medium">{lead.assignedTo}</span> • Created:{' '}
                {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
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

        {/* Quick summary stat bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <span>
              Quotations: <strong className="text-slate-800">{lead.quotations.length}</strong>
            </span>
            <span>•</span>
            <span>
              Deals: <strong className="text-slate-800">{lead.deals.length}</strong>
            </span>
            <span>•</span>
            <span>
              Orders: <strong className="text-slate-800">{allOrders.length}</strong>
            </span>
            <span>•</span>
            <span>
              Payments: <strong className="text-slate-800">{allPayments.length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Deal Value: <strong className="text-slate-900">{formatINR(totalDealVal)}</strong>
            </span>
            <span className="text-emerald-600">
              Collected: <strong>{formatINR(totalPaid)}</strong>
            </span>
            {pendingAmount > 0 && (
              <span className="text-amber-600">
                Pending: <strong>{formatINR(pendingAmount)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-semibold overflow-x-auto">
          {[
            { id: 'summary', label: 'Lead Overview', icon: User },
            { id: 'quotes', label: `Quotations (${lead.quotations.length})`, icon: FileText },
            { id: 'deals', label: `Deals (${lead.deals.length})`, icon: Briefcase },
            { id: 'orders', label: `Orders (${allOrders.length})`, icon: Shield },
            { id: 'payments', label: `Payments (${allPayments.length})`, icon: CreditCard },
            { id: 'tree', label: 'Relational Hierarchy Tree', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
          {/* 1. Lead Overview */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Contact &amp; Entity Details
                  </h3>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Company:</strong> {lead.company}
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Contact Person:</strong> {lead.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Email:</strong> {lead.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Phone:</strong> {lead.phone}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Acquisition &amp; Pipeline Data
                  </h3>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Lead Source:</strong>{' '}
                      <span className="bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded text-[11px]">
                        {lead.source}
                      </span>
                    </p>
                    <p>
                      <strong>Estimated Value:</strong> {formatINR(lead.estimatedValue)}
                    </p>
                    <p>
                      <strong>Sales Owner:</strong> {lead.assignedTo}
                    </p>
                    <p>
                      <strong>Created Date:</strong> {new Date(lead.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-semibold text-slate-700 mb-1">Executive Notes</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {lead.notes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Next Action Recommended</h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    {lead.status === 'Converted'
                      ? 'Follow up on order fulfillment and customer satisfaction.'
                      : lead.status === 'Qualified'
                      ? 'Schedule contract signature call with Sneha / Nancy.'
                      : 'Send nurture sequence and compliance reminders.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('tree')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>View Tree</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* 2. Quotations Tab */}
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Quotations Generated for {lead.company}
                </span>
                <span className="text-[11px] text-slate-500">
                  One lead ➔ Multiple quotations supported
                </span>
              </div>

              {lead.quotations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No quotations created for this lead yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {lead.quotations.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {q.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{q.service}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Category: {q.category} • Prepared by: {q.assignedTo} • Valid until:{' '}
                          {q.validUntil}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">{formatINR(q.amount)}</div>
                        {q.discount > 0 && (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Discount: {formatINR(q.discount)} applied
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Deals Tab */}
          {activeTab === 'deals' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Deals Converted from Quotations
                </span>
                <span className="text-[11px] text-slate-500">
                  One lead ➔ Multiple deals supported
                </span>
              </div>

              {lead.deals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active or won deals recorded yet for this lead.
                </div>
              ) : (
                <div className="space-y-2">
                  {lead.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-white shadow-2xs transition-all space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                              {deal.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{deal.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Priority:{' '}
                            <strong
                              className={
                                deal.priority === 'High'
                                  ? 'text-rose-600'
                                  : deal.priority === 'Medium'
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }
                            >
                              {deal.priority}
                            </strong>{' '}
                            • Stage: <strong className="text-slate-700">{deal.stage}</strong> • Owner:{' '}
                            {deal.assignedTo}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-base font-bold text-slate-900">
                            {formatINR(deal.value)}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Expected Close: {deal.expectedCloseDate}
                          </span>
                        </div>
                      </div>

                      {/* Orders mini-tag */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Associated fulfillment orders: {deal.orders.length}</span>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View Orders →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Operations &amp; Fulfillment Orders
                </span>
                <span className="text-[11px] text-slate-500">
                  One deal ➔ Multiple orders supported
                </span>
              </div>

              {allOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No operational orders have been created for this lead's deals.
                </div>
              ) : (
                <div className="space-y-2">
                  {allOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {ord.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{ord.service}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Current Stage: <strong className="text-blue-700">{ord.currentStage}</strong> •
                            Assigned Ops Lead: <strong>{ord.assignedTo}</strong>
                          </p>
                        </div>

                        <div className="text-right text-[11px] text-slate-500 shrink-0">
                          <div>Start: {ord.startDate}</div>
                          <div>Target: {ord.targetDate}</div>
                        </div>
                      </div>

                      {/* Associated payments */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">
                          Payments recorded: {ord.payments.length} (
                          {formatINR(ord.payments.reduce((s, p) => s + p.amount, 0))})
                        </span>
                        <button
                          onClick={() => setActiveTab('payments')}
                          className="text-emerald-600 font-medium hover:underline"
                        >
                          View Transactions →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Payment History &amp; Collection Transactions
                </span>
                <span className="text-[11px] text-slate-500">
                  One order ➔ Multiple payments supported
                </span>
              </div>

              {allPayments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No payment transactions recorded for this client.
                </div>
              ) : (
                <div className="space-y-2">
                  {allPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">{p.mode}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              Ref: {p.transactionRef}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Recorded on: {p.date} • Order: {p.orderId} • Deal: {p.dealId}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-700">
                          +{formatINR(p.amount)}
                        </span>
                        <span className="block text-[10px] text-emerald-600 font-medium">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. Relational Hierarchy Tree Tab */}
          {activeTab === 'tree' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Complete Hierarchical Flow: </span>
                Lead ➔ Quotations (1:N) ➔ Deals (1:N) ➔ Orders (1:N) ➔ Payments (1:N)
              </div>

              {/* Tree Visual */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                {/* Node: Lead */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white font-bold text-xs shrink-0 mt-0.5">
                    LEAD
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">
                        {lead.company} ({lead.id})
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700">{lead.status}</span>
                    </div>
                    <p className="text-[11px] text-blue-600 mt-0.5">
                      Contact: {lead.name} | Rep: {lead.assignedTo} | Est: {formatINR(lead.estimatedValue)}
                    </p>
                  </div>
                </div>

                {/* Branch to Quotations */}
                <div className="ml-5 pl-4 border-l-2 border-dashed border-blue-300 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Quotations ({lead.quotations.length})
                  </div>
                  {lead.quotations.map((q) => (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {q.id}: {q.service}
                        </span>
                        <span className="font-bold text-blue-600">{formatINR(q.amount)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Status: <strong>{q.status}</strong> | Rep: {q.assignedTo}
                      </div>
                    </div>
                  ))}

                  {/* Branch to Deals */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-2">
                    Deals ({lead.deals.length})
                  </div>
                  {lead.deals.map((deal) => (
                    <div key={deal.id} className="space-y-3">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-900">
                            {deal.id}: {deal.title}
                          </span>
                          <span className="font-bold text-purple-700">{formatINR(deal.value)}</span>
                        </div>
                        <div className="text-[10px] text-purple-600 mt-0.5">
                          Priority: {deal.priority} | Stage: {deal.stage}
                        </div>
                      </div>

                      {/* Branch to Orders */}
                      <div className="ml-4 pl-4 border-l-2 border-dashed border-purple-300 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Fulfillment Orders ({deal.orders.length})
                        </div>
                        {deal.orders.map((ord) => (
                          <div key={ord.id} className="space-y-2">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs">
                              <div className="flex items-center justify-between font-medium">
                                <span className="text-amber-900">
                                  {ord.id}: {ord.service}
                                </span>
                                <span className="font-bold text-amber-700">{ord.status}</span>
                              </div>
                              <div className="text-[10px] text-amber-600 mt-0.5">
                                Stage: {ord.currentStage} | Ops Lead: {ord.assignedTo}
                              </div>
                            </div>

                            {/* Branch to Payments */}
                            <div className="ml-4 pl-4 border-l-2 border-dashed border-amber-300 space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Payments Recorded ({ord.payments.length})
                              </div>
                              {ord.payments.map((p) => (
                                <div
                                  key={p.id}
                                  className="bg-emerald-50 border border-emerald-200 rounded-md p-1.5 flex items-center justify-between text-xs text-emerald-800"
                                >
                                  <span>
                                    {p.id} ({p.mode}) - Ref {p.transactionRef}
                                  </span>
                                  <span className="font-bold">+{formatINR(p.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            SecureRegent Analytics Engine • Live Schema View
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Drill-Down
          </button>
        </div>
      </div>
    </div>
  );
};
