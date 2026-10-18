import React from 'react';
import { CRMActivity } from '../types';
import { formatINR, formatCompactINR } from '../utils/analytics';

interface OperationsTeamSectionProps {
  salesTeamActivity: Array<{
    user: string;
    avatarColor: string;
    initials: string;
    leadsHandled: number;
    qualified: number;
    converted: number;
    conversionRate: string;
    quotations: number;
    deals: number;
    dealValue: number;
    revenue: number;
  }>;
  operationsTeamActivity: Array<{
    user: string;
    avatarColor: string;
    initials: string;
    ordersUpdated: number;
    stagesCompleted: number;
    pendingStages: number;
    overdueOrders: number;
  }>;
  ordersStageProgress: Array<{
    service: string;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  }>;
  recentActivities: CRMActivity[];
  onSelectRecord: (recordId: string, recordType: string) => void;
  onSelectUser: (userName: string) => void;
}

export const OperationsTeamSection: React.FC<OperationsTeamSectionProps> = ({
  salesTeamActivity,
  operationsTeamActivity,
  ordersStageProgress,
  recentActivities,
  onSelectRecord,
  onSelectUser,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
      {/* 1. Sales Team Activity (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-800 font-semibold text-xs sm:text-sm">
            Sales Team Activity
          </span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200/60">
            Sales Team
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 my-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-1.5">User</th>
                <th className="pb-1.5 text-right">Leads</th>
                <th className="pb-1.5 text-right">Qual.</th>
                <th className="pb-1.5 text-right">Conv.</th>
                <th className="pb-1.5 text-right">Conv %</th>
                <th className="pb-1.5 text-right">Quotes</th>
                <th className="pb-1.5 text-right">Deals</th>
                <th className="pb-1.5 text-right">Deal Val</th>
                <th className="pb-1.5 text-right">Rev</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px]">
              {salesTeamActivity.map((member) => (
                <tr
                  key={member.user}
                  onClick={() => onSelectUser(member.user)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 font-medium text-slate-800 flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full ${member.avatarColor} text-white text-[9px] flex items-center justify-center font-bold shrink-0`}
                    >
                      {member.initials}
                    </span>
                    <span className="truncate max-w-[70px]">{member.user}</span>
                  </td>
                  <td className="py-2 text-right text-slate-600">{member.leadsHandled}</td>
                  <td className="py-2 text-right text-emerald-600 font-medium">{member.qualified}</td>
                  <td className="py-2 text-right text-teal-600 font-medium">{member.converted}</td>
                  <td className="py-2 text-right font-semibold text-blue-600">
                    {member.conversionRate}
                  </td>
                  <td className="py-2 text-right text-slate-600">{member.quotations}</td>
                  <td className="py-2 text-right text-purple-600 font-medium">{member.deals}</td>
                  <td className="py-2 text-right font-medium text-slate-700">
                    {formatCompactINR(member.dealValue)}
                  </td>
                  <td className="py-2 text-right font-bold text-slate-900">
                    {formatCompactINR(member.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
          Click any sales consultant to isolate their pipeline
        </div>
      </div>

      {/* 2. Operations Team Activity (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-800 font-semibold text-xs sm:text-sm">
            Operations Team Activity
          </span>
          <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-200/60">
            Operations
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 my-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-1.5">User</th>
                <th className="pb-1.5 text-right">Orders Updated</th>
                <th className="pb-1.5 text-right">Stages Completed</th>
                <th className="pb-1.5 text-right">Pending Stages</th>
                <th className="pb-1.5 text-right">Overdue Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px]">
              {operationsTeamActivity.map((member) => (
                <tr
                  key={member.user}
                  onClick={() => onSelectUser(member.user)}
                  className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 font-medium text-slate-800 flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full ${member.avatarColor} text-white text-[9px] flex items-center justify-center font-bold shrink-0`}
                    >
                      {member.initials}
                    </span>
                    <span className="truncate max-w-[85px]">{member.user}</span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-slate-700">
                    {member.ordersUpdated}
                  </td>
                  <td className="py-2.5 text-right text-emerald-600 font-semibold">
                    {member.stagesCompleted}
                  </td>
                  <td className="py-2.5 text-right text-amber-600 font-medium">
                    {member.pendingStages}
                  </td>
                  <td className="py-2.5 text-right text-slate-400 font-medium">
                    {member.overdueOrders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
          Zero overdue orders in current tracking window
        </div>
      </div>

      {/* 3. Orders & Stage Progress (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-800 font-semibold text-xs sm:text-sm">
            Orders &amp; Stage Progress
          </span>
          <div className="flex items-center gap-1.5 text-[9px]">
            <span className="flex items-center gap-0.5 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pend
            </span>
            <span className="flex items-center gap-0.5 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> In Prog
            </span>
            <span className="flex items-center gap-0.5 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Comp
            </span>
          </div>
        </div>

        <div className="space-y-2.5 my-auto">
          {ordersStageProgress.map((item) => {
            const total = item.pending + item.inProgress + item.completed + item.onHold || 1;
            const pPct = Math.round((item.pending / total) * 100);
            const ipPct = Math.round((item.inProgress / total) * 100);
            const cPct = Math.round((item.completed / total) * 100);

            return (
              <div key={item.service} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-700 truncate max-w-[140px]">
                    {item.service}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                    <span className="text-amber-600">{item.pending}</span>
                    <span>|</span>
                    <span className="text-blue-600">{item.inProgress}</span>
                    <span>|</span>
                    <span className="text-emerald-600">{item.completed}</span>
                    <span className="text-slate-700 font-bold ml-1">({total})</span>
                  </div>
                </div>
                {/* Segmented Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  {pPct > 0 && (
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${pPct}%` }}
                      title={`Pending: ${item.pending}`}
                    ></div>
                  )}
                  {ipPct > 0 && (
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${ipPct}%` }}
                      title={`In Progress: ${item.inProgress}`}
                    ></div>
                  )}
                  {cPct > 0 && (
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${cPct}%` }}
                      title={`Completed: ${item.completed}`}
                    ></div>
                  )}
                  {item.onHold > 0 && (
                    <div
                      className="bg-slate-300 h-full"
                      style={{ width: `${Math.round((item.onHold / total) * 100)}%` }}
                      title={`On Hold: ${item.onHold}`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
          Fulfillment tracking across operational queues
        </div>
      </div>

      {/* 4. Recent CRM Activity Feed (3 cols) */}
      <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-800 font-semibold text-xs sm:text-sm">
            Recent CRM Activity
          </span>
          <span className="text-[10px] text-blue-600 font-medium">Live Feed</span>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-56 pr-1 my-auto">
          {recentActivities.map((act) => {
            let badgeBg = 'bg-slate-100 text-slate-700';
            if (act.recordId.startsWith('#L-')) badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
            if (act.recordId.startsWith('#Q-')) badgeBg = 'bg-purple-50 text-purple-700 border-purple-200';
            if (act.recordId.startsWith('#D-')) badgeBg = 'bg-teal-50 text-teal-700 border-teal-200';
            if (act.recordId.startsWith('#O-')) badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
            if (act.recordId.startsWith('#P-')) badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={act.id}
                onClick={() => onSelectRecord(act.recordId, act.recordType)}
                className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors text-[10px]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                    {act.employee.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 truncate leading-tight">
                      {act.employee}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate leading-tight">
                      {act.action}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${badgeBg}`}
                  >
                    {act.recordId}
                  </span>
                  <span className="text-[8px] text-slate-400 mt-0.5">
                    {act.timestamp.split('T')[1].substring(0, 5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
          Click any activity record badge for drill-down view
        </div>
      </div>
    </div>
  );
};
