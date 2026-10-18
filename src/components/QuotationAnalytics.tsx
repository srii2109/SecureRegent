import React from 'react';
import { FileText, Percent, ExternalLink } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { formatINR } from '../utils/analytics';

interface QuotationAnalyticsProps {
  quotationsByService: Array<{ service: string; count: number }>;
  quotationValueByService: Array<{
    service: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  serviceQuoteDetails: Array<{
    service: string;
    quotations: number;
    quotedAmount: number;
    accepted: number;
    pending: number;
    rejected: number;
    convRate: string;
  }>;
  quoteToDealRate: number;
  dealsCount: number;
  quotationsCount: number;
  onSelectService: (serviceName: string) => void;
  onOpenLeadHistory: () => void;
}

export const QuotationAnalytics: React.FC<QuotationAnalyticsProps> = ({
  quotationsByService,
  quotationValueByService,
  serviceQuoteDetails,
  quoteToDealRate,
  dealsCount,
  quotationsCount,
  onSelectService,
  onOpenLeadHistory,
}) => {
  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Quotation Analytics</span>
        </div>
        <button
          onClick={onOpenLeadHistory}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
        >
          <span>Lead-wise Quote History</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* 1. Quotations by Service / Order Category (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm mb-2">
            Quotations by Service / Order Category
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quotationsByService}
                margin={{ top: 15, right: 5, left: -25, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="service"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  tickFormatter={(val) => (val.length > 10 ? `${val.substring(0, 9)}..` : val)}
                />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} quotes`, 'Quotations']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="count" position="top" fill="#1e293b" fontSize={10} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-1">
            Category distribution across all generated quotes
          </div>
        </div>

        {/* 2. Quotation Value by Service (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm mb-2">
            Quotation Value by Service
          </div>

          <div className="space-y-2.5 my-auto">
            {quotationValueByService.map((item) => (
              <div
                key={item.service}
                onClick={() => onSelectService(item.service)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px] truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="truncate group-hover:text-blue-600 transition-colors">
                      {item.service}
                    </span>
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px] shrink-0">
                    {formatINR(item.value)}{' '}
                    <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage * 2.5}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-100">
            Total pipeline quote value: ₹39,35,000
          </div>
        </div>

        {/* 3. Service Wise Quotation Details (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-800 font-semibold text-xs sm:text-sm">
              Service Wise Quotation Details
            </span>
            <span className="text-[10px] text-slate-400">Click row to drill down</span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-1.5">Service / Order</th>
                  <th className="pb-1.5 text-right">Quotes</th>
                  <th className="pb-1.5 text-right">Quoted Amt</th>
                  <th className="pb-1.5 text-right">Acc.</th>
                  <th className="pb-1.5 text-right">Pend.</th>
                  <th className="pb-1.5 text-right">Rej.</th>
                  <th className="pb-1.5 text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[11px]">
                {serviceQuoteDetails.slice(0, 5).map((sq) => (
                  <tr
                    key={sq.service}
                    onClick={() => onSelectService(sq.service)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-1.5 font-medium text-slate-800 truncate max-w-[120px]">
                      {sq.service}
                    </td>
                    <td className="py-1.5 text-right text-slate-600">{sq.quotations}</td>
                    <td className="py-1.5 text-right font-medium text-slate-800">
                      {formatINR(sq.quotedAmount)}
                    </td>
                    <td className="py-1.5 text-right text-emerald-600 font-medium">{sq.accepted}</td>
                    <td className="py-1.5 text-right text-amber-600 font-medium">{sq.pending}</td>
                    <td className="py-1.5 text-right text-rose-500 font-medium">{sq.rejected}</td>
                    <td className="py-1.5 text-right font-semibold text-blue-600">{sq.convRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 text-center mt-2 pt-1 border-t border-slate-50">
            Showing top services by quote volume
          </div>
        </div>

        {/* 4. Quote to Deal Conversion Rate (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col items-center justify-between text-center">
          <div className="text-slate-800 font-semibold text-xs sm:text-sm">
            Quote to Deal Conversion Rate
          </div>

          {/* Radial progress ring */}
          <div className="relative w-28 h-28 my-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Foreground circle */}
              <path
                className="text-blue-600"
                strokeDasharray={`${quoteToDealRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-900 leading-none">
                {quoteToDealRate}%
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Win Rate</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            <span>{dealsCount} Deals</span> / <span className="text-slate-400">{quotationsCount} Quotations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
