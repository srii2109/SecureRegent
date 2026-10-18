import React from 'react';
import {
  Users,
  CheckCircle,
  Award,
  AlertCircle,
  TrendingUp,
  FileText,
  Briefcase,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ComparativeMetric } from '../types';

interface KpiCardsProps {
  metrics: {
    newLeads: ComparativeMetric;
    qualifiedLeads: ComparativeMetric;
    qualifiedPercentage: number;
    convertedLeads: ComparativeMetric;
    conversionPercentage: number;
    unqualifiedLeads: ComparativeMetric;
    unqualifiedPercentage: number;
    conversionRate: ComparativeMetric;
    quotationsCreated: ComparativeMetric;
    dealsCreated: ComparativeMetric;
    invoicesGenerated: ComparativeMetric;
  };
  comparisonDaysLabel: string;
  onCardClick?: (kpiType: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics, comparisonDaysLabel, onCardClick }) => {
  const cards = [
    {
      id: 'new-leads',
      title: 'New Leads',
      value: metrics.newLeads.current.toLocaleString(),
      subLabel: null,
      metric: metrics.newLeads,
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'qualified-leads',
      title: 'Qualified Leads',
      value: metrics.qualifiedLeads.current.toLocaleString(),
      subLabel: `${metrics.qualifiedPercentage}% Qualified %`,
      metric: metrics.qualifiedLeads,
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'converted-leads',
      title: 'Converted Leads',
      value: metrics.convertedLeads.current.toLocaleString(),
      subLabel: `${metrics.conversionPercentage}% Conversion %`,
      metric: metrics.convertedLeads,
      icon: Award,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
    {
      id: 'unqualified-leads',
      title: 'Unqualified Leads',
      value: metrics.unqualifiedLeads.current.toLocaleString(),
      subLabel: `${metrics.unqualifiedPercentage}% Unqualified %`,
      metric: metrics.unqualifiedLeads,
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.current}%`,
      subLabel: null,
      metric: metrics.conversionRate,
      icon: TrendingUp,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
    },
    {
      id: 'quotations-created',
      title: 'Quotations Created',
      value: metrics.quotationsCreated.current.toLocaleString(),
      subLabel: null,
      metric: metrics.quotationsCreated,
      icon: FileText,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'deals-created',
      title: 'Deals Created',
      value: metrics.dealsCreated.current.toLocaleString(),
      subLabel: null,
      metric: metrics.dealsCreated,
      icon: Briefcase,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      id: 'invoices-generated',
      title: 'Invoices Generated',
      value: metrics.invoicesGenerated.current.toLocaleString(),
      subLabel: null,
      metric: metrics.invoicesGenerated,
      icon: Receipt,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isUp = card.metric.isPositive;
        const pct = Math.abs(card.metric.percentageChange);

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Icon + Title */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                <span className={`p-1 rounded-md ${card.iconBg} ${card.iconColor}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </span>
                <span className="truncate">{card.title}</span>
              </div>

              {/* Main value and optional subLabel */}
              <div className="flex items-baseline justify-between gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                {card.subLabel && (
                  <span className="text-[10px] text-slate-500 font-medium text-right leading-tight">
                    {card.subLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Comparison line */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px]">
              <span
                className={`flex items-center font-semibold ${
                  isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{pct}%</span>
              </span>
              <span className="text-slate-400 text-[10px] truncate">
                vs. {comparisonDaysLabel || 'prev period'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
