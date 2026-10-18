import React from 'react';
import { Target, Filter } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatINR } from '../utils/analytics';

interface LeadAnalyticsProps {
  targetAchievement: {
    monthlyTarget: number;
    achieved: number;
    remaining: number;
    achievedPercent: number;
    remainingPercent: number;
  };
  funnelMetrics: {
    totalLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    unqualifiedLeads: number;
    qualifiedPct: number;
    convertedPct: number;
    unqualifiedPct: number;
  };
  dailyLeadTrend: Array<{
    date: string;
    newLeads: number;
    qualified: number;
    converted: number;
  }>;
  leadSources: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  onDrillDown: (type: string, filterVal?: string) => void;
}

export const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({
  targetAchievement,
  funnelMetrics,
  dailyLeadTrend,
  leadSources,
  onDrillDown,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Target Achievement */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm mb-2">
          <Target className="w-4 h-4 text-blue-600" />
          <span>Target Achievement</span>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs text-slate-500 font-medium">Monthly Revenue Target</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {formatINR(targetAchievement.monthlyTarget)}
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Achieved
              </span>
              <span className="font-semibold text-slate-800">
                {formatINR(targetAchievement.achieved)}{' '}
                <span className="text-slate-400 font-normal">({targetAchievement.achievedPercent}%)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                Remaining
              </span>
              <span className="font-semibold text-slate-800">
                {formatINR(targetAchievement.remaining)}{' '}
                <span className="text-slate-400 font-normal">({targetAchievement.remainingPercent}%)</span>
              </span>
            </div>
          </div>

          {/* Funnel/Flask visualization */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex justify-between">
              <span>Target vs Achieved [Revenue]</span>
              <span className="text-blue-600 font-semibold">{targetAchievement.achievedPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(4, targetAchievement.achievedPercent)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹0</span>
              <span>{formatINR(targetAchievement.monthlyTarget)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lead Funnel */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Lead Funnel</span>
          </div>
          <button
            onClick={() => onDrillDown('funnel')}
            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
          >
            Details
          </button>
        </div>

        <div className="flex items-center gap-3 my-auto">
          {/* Main Funnel Stages */}
          <div className="flex-1 flex flex-col items-center gap-1">
            {/* Stage 1: New Leads */}
            <div
              onClick={() => onDrillDown('leads', 'all')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-t-lg py-1.5 px-2 text-center cursor-pointer transition-colors shadow-2xs"
            >
              <div className="text-[10px] font-medium leading-tight">New Leads</div>
              <div className="text-sm font-bold leading-tight">{funnelMetrics.totalLeads}</div>
              <div className="text-[9px] opacity-80">(100%)</div>
            </div>

            {/* Stage 2: Qualified */}
            <div
              onClick={() => onDrillDown('leads', 'Qualified')}
              className="w-4/5 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 px-2 text-center cursor-pointer transition-colors shadow-2xs"
            >
              <div className="text-[10px] font-medium leading-tight">Qualified</div>
              <div className="text-sm font-bold leading-tight">{funnelMetrics.qualifiedLeads}</div>
              <div className="text-[9px] opacity-80">({funnelMetrics.qualifiedPct}%)</div>
            </div>

            {/* Stage 3: Converted */}
            <div
              onClick={() => onDrillDown('leads', 'Converted')}
              className="w-3/5 bg-amber-500 hover:bg-amber-600 text-white rounded-b-lg py-1.5 px-2 text-center cursor-pointer transition-colors shadow-2xs"
            >
              <div className="text-[10px] font-medium leading-tight">Converted</div>
              <div className="text-sm font-bold leading-tight">{funnelMetrics.convertedLeads}</div>
              <div className="text-[9px] opacity-80">({funnelMetrics.convertedPct}%)</div>
            </div>
          </div>

          {/* Unqualified Box */}
          <div
            onClick={() => onDrillDown('leads', 'Unqualified')}
            className="border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 rounded-lg p-2.5 text-center cursor-pointer transition-colors"
          >
            <div className="text-[10px] text-purple-700 font-medium">Unqualified</div>
            <div className="text-lg font-bold text-purple-900 leading-tight">
              {funnelMetrics.unqualifiedLeads}
            </div>
            <div className="text-[10px] text-purple-600">({funnelMetrics.unqualifiedPct}%)</div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2">
          Click any funnel stage to view related records
        </div>
      </div>

      {/* 3. Daily Lead Trend */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-800 font-semibold text-sm">Daily Lead Trend</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> New
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Qual.
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Conv.
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyLeadTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
              />
              <Line
                type="monotone"
                dataKey="newLeads"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="New Leads"
              />
              <Line
                type="monotone"
                dataKey="qualified"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Qualified"
              />
              <Line
                type="monotone"
                dataKey="converted"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Converted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Lead Sources */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div className="text-slate-800 font-semibold text-sm mb-1">Lead Sources</div>

        <div className="flex items-center justify-between gap-2">
          {/* Donut Chart with Center Text */}
          <div className="relative w-28 h-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources.filter((s) => s.count > 0)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={3}
                >
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-base font-bold text-slate-800 leading-none">
                {funnelMetrics.totalLeads}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            {leadSources.map((source) => (
              <div
                key={source.name}
                onClick={() => onDrillDown('source', source.name)}
                className="flex items-center justify-between hover:bg-slate-50 p-0.5 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: source.color }}
                  ></span>
                  <span className="text-slate-600 truncate text-[11px]">{source.name}</span>
                </div>
                <span className="font-semibold text-slate-800 text-[11px] shrink-0">
                  {source.count}{' '}
                  <span className="text-slate-400 font-normal">({source.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
