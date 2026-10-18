import React from 'react';
import { IndianRupee, Layers, CheckCircle2, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR, formatCompactINR } from '../utils/analytics';

interface DealsRevenueAnalyticsProps {
  dealsVsRevenueByService: Array<{
    service: string;
    deals: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  priorityBreakdown: Array<{
    priority: string;
    deals: number;
    revenue: number;
    percentage: number;
    color: string;
  }>;
  dailyRevenueTrend: Array<{
    date: string;
    revenue: number;
    collected: number;
  }>;
  totalVsCollected: {
    totalDealValue: number;
    netCollectedRevenue: number;
    outstandingRevenue: number;
    collectionRate: number;
  };
  onSelectPriority: (priority: string) => void;
  onDrillDownDeals: () => void;
}

export const DealsRevenueAnalytics: React.FC<DealsRevenueAnalyticsProps> = ({
  dealsVsRevenueByService,
  revenueByCategory,
  priorityBreakdown,
  dailyRevenueTrend,
  totalVsCollected,
  onSelectPriority,
  onDrillDownDeals,
}) => {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <IndianRupee className="w-5 h-5 text-blue-600" />
          <span>Deals &amp; Revenue</span>
        </div>
        <button
          onClick={onDrillDownDeals}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          View All Deal Details →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* 1. Deals Created vs Deal Revenue (by Service) - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-800 font-semibold text-xs sm:text-sm">
              Deals Created vs Deal Revenue
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Deals
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Rev
              </span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dealsVsRevenueByService}
                margin={{ top: 10, right: 5, left: -25, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="service"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  tickFormatter={(val) => (val.length > 9 ? `${val.substring(0, 8)}..` : val)}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 8, fill: '#94a3b8' }}
                  tickFormatter={(v) => formatCompactINR(v)}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'deals' ? `${val} deals` : formatINR(val),
                    name === 'deals' ? 'Deals Created' : 'Deal Revenue',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar yAxisId="left" dataKey="deals" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-1">
            Conversion comparison across core service offerings
          </div>
        </div>

        {/* 2. Revenue by Order / Service Category - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm mb-2">
            Revenue by Order / Service Category
          </div>

          <div className="space-y-2.5 my-auto">
            {revenueByCategory.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium text-[11px] truncate max-w-[150px]">
                    {cat.category}
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {formatCompactINR(cat.amount)}{' '}
                    <span className="text-slate-400 font-normal">({cat.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, cat.percentage * 2.8)}%`,
                      backgroundColor: cat.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-100">
            Total active revenue: {formatINR(totalVsCollected.totalDealValue)}
          </div>
        </div>

        {/* 3. Priority Breakdown - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm mb-2">
            Priority Breakdown
          </div>

          <div className="space-y-2 my-auto">
            <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
              <span className="col-span-4">Priority</span>
              <span className="col-span-3 text-right">Deals</span>
              <span className="col-span-5 text-right">Revenue</span>
            </div>

            {priorityBreakdown.map((item) => (
              <div
                key={item.priority}
                onClick={() => onSelectPriority(item.priority)}
                className="grid grid-cols-12 items-center text-xs hover:bg-slate-50 p-1 rounded cursor-pointer transition-colors"
              >
                <div className="col-span-4 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-medium text-slate-800 text-[11px]">{item.priority}</span>
                </div>
                <span className="col-span-3 text-right text-slate-600 font-medium text-[11px]">
                  {item.deals}
                </span>
                <div className="col-span-5 text-right font-semibold text-slate-900 text-[11px]">
                  {formatCompactINR(item.revenue)}
                  <span className="block text-[9px] text-slate-400 font-normal">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
            Click priority to filter deals
          </div>
        </div>

        {/* 4. Daily Revenue Trend - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-800 font-semibold text-xs">Daily Revenue Trend</span>
            <div className="flex items-center gap-1 text-[9px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Rev
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span> Coll
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenueTrend} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 8, fill: '#94a3b8' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    formatINR(val),
                    name === 'revenue' ? 'Invoiced Revenue' : 'Collected Revenue',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[2, 2, 0, 0]} />
                <Bar dataKey="collected" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Daily billing vs realization
          </div>
        </div>

        {/* 5. Total vs Collected Revenue - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm mb-2">
            Total vs Collected Revenue
          </div>

          <div className="space-y-2.5 my-auto">
            {/* Total Deal Value Card */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-blue-600 font-medium">Total Deal Value</div>
                <div className="text-base font-bold text-slate-900 leading-tight">
                  {formatINR(totalVsCollected.totalDealValue)}
                </div>
              </div>
            </div>

            {/* Net Collected Revenue Card */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-emerald-600 font-medium">Net Collected Revenue</div>
                <div className="text-base font-bold text-slate-900 leading-tight">
                  {formatINR(totalVsCollected.netCollectedRevenue)}
                </div>
              </div>
            </div>

            {/* Outstanding Metric */}
            <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                <Clock className="w-3.5 h-3.5" /> Outstanding
              </span>
              <span className="font-bold text-amber-900 text-xs">
                {formatINR(totalVsCollected.outstandingRevenue)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-500">
              Collection Rate:{' '}
              <span className="font-semibold text-emerald-600">{totalVsCollected.collectionRate}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
