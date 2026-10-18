import { useState, useMemo } from 'react';
import type { FilterState, Lead } from './types';
import { allMockLeads, mockRecentActivities } from './data/mockData';
import { filterAndComputeDashboard } from './utils/analytics';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { LeadAnalytics } from './components/LeadAnalytics';
import { QuotationAnalytics } from './components/QuotationAnalytics';
import { DealsRevenueAnalytics } from './components/DealsRevenueAnalytics';
import { OperationsTeamSection } from './components/OperationsTeamSection';
import { DrillDownModal } from './components/DrillDownModal';
import { RelationalExplorerModal } from './components/RelationalExplorerModal';
import { ExportModal } from './components/ExportModal';

export function App() {
  const [filters, setFilters] = useState<FilterState>({
    dateFilter: '30days',
    department: 'All Departments',
    user: 'All Users',
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drillDownInitialTab, setDrillDownInitialTab] = useState<
    'summary' | 'quotes' | 'deals' | 'orders' | 'payments' | 'tree'
  >('summary');
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute analytics dynamically based on active filters
  const dashboardData = useMemo(() => {
    return filterAndComputeDashboard(allMockLeads, filters);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Open drilldown from KPI cards
  const handleKpiCardClick = (kpiId: string) => {
    if (kpiId === 'quotations-created') {
      const leadWithQuotes = dashboardData.filteredLeads.find((l) => l.quotations.length > 0);
      if (leadWithQuotes) {
        setDrillDownInitialTab('quotes');
        setSelectedLead(leadWithQuotes);
      }
    } else if (kpiId === 'deals-created') {
      const leadWithDeals = dashboardData.filteredLeads.find((l) => l.deals.length > 0);
      if (leadWithDeals) {
        setDrillDownInitialTab('deals');
        setSelectedLead(leadWithDeals);
      }
    } else {
      setIsExplorerOpen(true);
    }
  };

  // Open drilldown from Funnel stages or lead source
  const handleLeadAnalyticsDrillDown = (type: string, filterVal?: string) => {
    if (type === 'leads' && filterVal) {
      const found = dashboardData.filteredLeads.find(
        (l) => filterVal === 'all' || l.status === filterVal
      );
      if (found) {
        setDrillDownInitialTab('summary');
        setSelectedLead(found);
      } else {
        setIsExplorerOpen(true);
      }
    } else {
      setIsExplorerOpen(true);
    }
  };

  // Open drilldown from quotation service selection
  const handleSelectService = (serviceName: string) => {
    const lead = dashboardData.filteredLeads.find((l) =>
      l.quotations.some((q) => q.service.toLowerCase().includes(serviceName.toLowerCase()))
    );
    if (lead) {
      setDrillDownInitialTab('quotes');
      setSelectedLead(lead);
    } else {
      setIsExplorerOpen(true);
    }
  };

  // Open drilldown from CRM activity item
  const handleSelectRecord = (recordId: string, _recordType: string) => {
    // Locate lead containing this record ID
    const foundLead = allMockLeads.find((l) => {
      if (l.id === recordId.replace('#', '')) return true;
      if (l.quotations.some((q) => q.id === recordId.replace('#', ''))) return true;
      if (l.deals.some((d) => d.id === recordId.replace('#', ''))) return true;
      if (l.deals.some((d) => d.orders.some((o) => o.id === recordId.replace('#', '')))) return true;
      if (l.deals.some((d) => d.orders.some((o) => o.payments.some((p) => p.id === recordId.replace('#', ''))))) return true;
      return false;
    });

    if (foundLead) {
      if (recordId.startsWith('#Q-')) setDrillDownInitialTab('quotes');
      else if (recordId.startsWith('#D-')) setDrillDownInitialTab('deals');
      else if (recordId.startsWith('#O-')) setDrillDownInitialTab('orders');
      else if (recordId.startsWith('#P-')) setDrillDownInitialTab('payments');
      else setDrillDownInitialTab('summary');
      setSelectedLead(foundLead);
    } else {
      setIsExplorerOpen(true);
    }
  };

  // User click from team table
  const handleSelectUser = (userName: string) => {
    handleFilterChange({ user: userName });
  };

  // Priority click
  const handleSelectPriority = (_priority: string) => {
    const lead = dashboardData.filteredLeads.find((l) =>
      l.deals.some((d) => d.priority === _priority)
    );
    if (lead) {
      setDrillDownInitialTab('deals');
      setSelectedLead(lead);
    } else {
      setIsExplorerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        filters={filters}
        onFilterChange={handleFilterChange}
        dateRangeLabel={dashboardData.dateRangeLabel}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Row 1: KPI Cards */}
        <section>
          <KpiCards
            metrics={dashboardData.kpiMetrics}
            comparisonDaysLabel={
              filters.dateFilter === 'today'
                ? 'yesterday'
                : filters.dateFilter === '7days'
                ? 'previous 7 days'
                : 'previous 31 days'
            }
            onCardClick={handleKpiCardClick}
          />
        </section>

        {/* Row 2: Target Achievement & Lead Analytics */}
        <section>
          <LeadAnalytics
            targetAchievement={dashboardData.targetAchievement}
            funnelMetrics={{
              totalLeads: dashboardData.kpiMetrics.newLeads.current,
              qualifiedLeads: dashboardData.kpiMetrics.qualifiedLeads.current,
              convertedLeads: dashboardData.kpiMetrics.convertedLeads.current,
              unqualifiedLeads: dashboardData.kpiMetrics.unqualifiedLeads.current,
              qualifiedPct: dashboardData.kpiMetrics.qualifiedPercentage,
              convertedPct: dashboardData.kpiMetrics.conversionPercentage,
              unqualifiedPct: dashboardData.kpiMetrics.unqualifiedPercentage,
            }}
            dailyLeadTrend={dashboardData.dailyLeadTrend}
            leadSources={dashboardData.leadSources}
            onDrillDown={handleLeadAnalyticsDrillDown}
          />
        </section>

        {/* Row 3: Quotation Analytics */}
        <section>
          <QuotationAnalytics
            quotationsByService={dashboardData.quotationsByService}
            quotationValueByService={dashboardData.quotationValueByService}
            serviceQuoteDetails={dashboardData.serviceQuoteDetails}
            quoteToDealRate={dashboardData.quoteToDealRate}
            dealsCount={dashboardData.dealsCreatedCount}
            quotationsCount={dashboardData.quotationsCreatedCount}
            onSelectService={handleSelectService}
            onOpenLeadHistory={() => setIsExplorerOpen(true)}
          />
        </section>

        {/* Row 4: Deals & Revenue Analytics */}
        <section>
          <DealsRevenueAnalytics
            dealsVsRevenueByService={dashboardData.dealsVsRevenueByService}
            revenueByCategory={dashboardData.revenueByCategory}
            priorityBreakdown={dashboardData.priorityBreakdown}
            dailyRevenueTrend={dashboardData.dailyRevenueTrend}
            totalVsCollected={dashboardData.totalVsCollected}
            onSelectPriority={handleSelectPriority}
            onDrillDownDeals={() => setIsExplorerOpen(true)}
          />
        </section>

        {/* Row 5: Operations & Team Section */}
        <section>
          <OperationsTeamSection
            salesTeamActivity={dashboardData.salesTeamActivity}
            operationsTeamActivity={dashboardData.operationsTeamActivity}
            ordersStageProgress={dashboardData.ordersStageProgress}
            recentActivities={mockRecentActivities}
            onSelectRecord={handleSelectRecord}
            onSelectUser={handleSelectUser}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Business Performance &amp; Revenue Analytics System</span>
            <span className="text-slate-300">•</span>
            <span>Live Interactive Demo</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Data Model: 1 Lead : N Quotes : N Deals : N Orders : N Payments</span>
            <button
              onClick={() => setIsExplorerOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Open Relational Explorer
            </button>
          </div>
        </div>
      </footer>

      {/* Drill-down Modal Drawer */}
      <DrillDownModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        initialTab={drillDownInitialTab}
      />

      {/* Relational Explorer Modal */}
      <RelationalExplorerModal
        leads={dashboardData.filteredLeads}
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        onSelectLead={(lead) => {
          setSelectedLead(lead);
          setDrillDownInitialTab('summary');
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        leads={dashboardData.filteredLeads}
        dateRangeLabel={dashboardData.dateRangeLabel}
      />
    </div>
  );
}

export default App;
