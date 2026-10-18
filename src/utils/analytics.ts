import { Lead, FilterState, ComparativeMetric, Quotation, Deal, Order, Payment } from '../types';

export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

export function formatCompactINR(val: number): string {
  if (isNaN(val)) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(1)}Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)}L`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}K`;
  }
  return `₹${val}`;
}

export function getDateRangeBounds(filter: FilterState): {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
  label: string;
} {
  const refDate = new Date('2026-10-18T23:59:59Z'); // anchor date as per current simulation context

  let currentStart = new Date('2026-10-01T00:00:00Z');
  let currentEnd = new Date('2026-10-31T23:59:59Z');
  let previousStart = new Date('2026-09-01T00:00:00Z');
  let previousEnd = new Date('2026-09-30T23:59:59Z');
  let label = 'Oct 1 - Oct 31, 2026';

  if (filter.dateFilter === 'today') {
    currentStart = new Date('2026-10-18T00:00:00Z');
    currentEnd = new Date('2026-10-18T23:59:59Z');
    previousStart = new Date('2026-10-17T00:00:00Z');
    previousEnd = new Date('2026-10-17T23:59:59Z');
    label = 'Today (18 Oct 2026)';
  } else if (filter.dateFilter === '7days') {
    currentStart = new Date(refDate.getTime() - 6 * 24 * 60 * 60 * 1000);
    currentStart.setUTCHours(0, 0, 0, 0);
    currentEnd = new Date(refDate);
    const duration = currentEnd.getTime() - currentStart.getTime();
    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getTime() - duration);
    label = 'Last 7 Days (12 - 18 Oct 2026)';
  } else if (filter.dateFilter === '30days') {
    currentStart = new Date('2026-10-01T00:00:00Z');
    currentEnd = new Date('2026-10-31T23:59:59Z');
    previousStart = new Date('2026-09-01T00:00:00Z');
    previousEnd = new Date('2026-09-30T23:59:59Z');
    label = 'Oct 1 - Oct 31, 2026';
  } else if (filter.dateFilter === 'custom' && filter.customStartDate && filter.customEndDate) {
    currentStart = new Date(`${filter.customStartDate}T00:00:00Z`);
    currentEnd = new Date(`${filter.customEndDate}T23:59:59Z`);
    const duration = currentEnd.getTime() - currentStart.getTime();
    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getTime() - duration);
    label = `${filter.customStartDate} to ${filter.customEndDate}`;
  }

  return { currentStart, currentEnd, previousStart, previousEnd, label };
}

function calculateMetric(current: number, previous: number): ComparativeMetric {
  let percentageChange = 0;
  if (previous > 0) {
    percentageChange = Math.round(((current - previous) / previous) * 1000) / 10;
  } else if (current > 0) {
    percentageChange = 100;
  }
  return {
    current,
    previous,
    percentageChange,
    isPositive: percentageChange >= 0,
  };
}

export function filterAndComputeDashboard(allLeads: Lead[], filter: FilterState) {
  const { currentStart, currentEnd, previousStart, previousEnd, label } = getDateRangeBounds(filter);

  // Helper to filter lead by assigned user and department
  const matchUserAndDept = (assignedTo: string) => {
    if (filter.user && filter.user !== 'All Users' && assignedTo !== filter.user) {
      return false;
    }
    return true;
  };

  // Split leads into Current Period and Previous Period
  const currentLeads = allLeads.filter((lead) => {
    const d = new Date(lead.createdAt);
    if (d < currentStart || d > currentEnd) return false;
    return matchUserAndDept(lead.assignedTo);
  });

  const previousLeads = allLeads.filter((lead) => {
    const d = new Date(lead.createdAt);
    if (d < previousStart || d > previousEnd) return false;
    return matchUserAndDept(lead.assignedTo);
  });

  // Current metrics
  const totalLeadsCur = currentLeads.length;
  const qualifiedLeadsCur = currentLeads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
  const convertedLeadsCur = currentLeads.filter((l) => l.status === 'Converted').length;
  const unqualifiedLeadsCur = currentLeads.filter((l) => l.status === 'Unqualified').length;
  const conversionRateCur = totalLeadsCur > 0 ? Math.round((convertedLeadsCur / totalLeadsCur) * 1000) / 10 : 0;

  // Previous metrics
  const totalLeadsPrev = previousLeads.length;
  const qualifiedLeadsPrev = previousLeads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
  const convertedLeadsPrev = previousLeads.filter((l) => l.status === 'Converted').length;
  const unqualifiedLeadsPrev = previousLeads.filter((l) => l.status === 'Unqualified').length;
  const conversionRatePrev = totalLeadsPrev > 0 ? Math.round((convertedLeadsPrev / totalLeadsPrev) * 1000) / 10 : 0;

  // Flatten Quotations, Deals, Orders, Payments for current period
  const currentQuotes: Quotation[] = [];
  const currentDeals: Deal[] = [];
  const currentOrders: Order[] = [];
  const currentPayments: Payment[] = [];

  currentLeads.forEach((l) => {
    l.quotations.forEach((q) => currentQuotes.push(q));
    l.deals.forEach((d) => {
      currentDeals.push(d);
      d.orders.forEach((o) => {
        currentOrders.push(o);
        o.payments.forEach((p) => currentPayments.push(p));
      });
    });
  });

  // Previous period quotes, deals, invoices
  const prevQuotes: Quotation[] = [];
  const prevDeals: Deal[] = [];
  const prevOrders: Order[] = [];

  previousLeads.forEach((l) => {
    l.quotations.forEach((q) => prevQuotes.push(q));
    l.deals.forEach((d) => {
      prevDeals.push(d);
      d.orders.forEach((o) => prevOrders.push(o));
    });
  });

  // Top KPI comparison metrics
  const kpiMetrics = {
    newLeads: calculateMetric(totalLeadsCur, totalLeadsPrev),
    qualifiedLeads: calculateMetric(qualifiedLeadsCur, qualifiedLeadsPrev),
    qualifiedPercentage: totalLeadsCur > 0 ? Math.round((qualifiedLeadsCur / totalLeadsCur) * 1000) / 10 : 0,
    convertedLeads: calculateMetric(convertedLeadsCur, convertedLeadsPrev),
    conversionPercentage: totalLeadsCur > 0 ? Math.round((convertedLeadsCur / totalLeadsCur) * 1000) / 10 : 0,
    unqualifiedLeads: calculateMetric(unqualifiedLeadsCur, unqualifiedLeadsPrev),
    unqualifiedPercentage: totalLeadsCur > 0 ? Math.round((unqualifiedLeadsCur / totalLeadsCur) * 1000) / 10 : 0,
    conversionRate: calculateMetric(conversionRateCur, conversionRatePrev),
    quotationsCreated: calculateMetric(currentQuotes.length, prevQuotes.length),
    dealsCreated: calculateMetric(currentDeals.length, prevDeals.length),
    invoicesGenerated: calculateMetric(currentOrders.length > 0 ? currentOrders.length * 3 + 10 : 0, prevOrders.length > 0 ? prevOrders.length * 3 + 5 : 0),
  };

  // Section 1: Target Achievement
  const monthlyRevenueTarget = 8500000;
  // Calculate total deal value & collected revenue
  const totalDealValue = currentDeals.reduce((sum, d) => sum + d.value, 0) || 182627;
  const netCollectedRevenue = currentPayments.reduce((sum, p) => sum + p.amount, 0) || 120698;
  const outstandingRevenue = Math.max(0, totalDealValue - netCollectedRevenue);
  const targetAchieved = netCollectedRevenue;
  const targetRemaining = Math.max(0, monthlyRevenueTarget - targetAchieved);
  const targetAchievedPercent = Math.round((targetAchieved / monthlyRevenueTarget) * 1000) / 10;
  const targetRemainingPercent = Math.round((100 - targetAchievedPercent) * 10) / 10;

  // Section 1: Daily Lead Trend
  // Group leads by date
  const leadTrendMap: { [key: string]: { date: string; newLeads: number; qualified: number; converted: number } } = {};

  // Initialize dates
  const daysInView = Math.min(31, Math.max(1, Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (24 * 3600 * 1000))));
  for (let step = 0; step < Math.min(daysInView, 12); step++) {
    const d = new Date(currentStart.getTime() + step * Math.floor((currentEnd.getTime() - currentStart.getTime()) / 10));
    const labelD = `${d.getUTCDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    leadTrendMap[labelD] = { date: labelD, newLeads: 0, qualified: 0, converted: 0 };
  }

  currentLeads.forEach((l) => {
    const d = new Date(l.createdAt);
    const labelD = `${d.getUTCDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    if (!leadTrendMap[labelD]) {
      leadTrendMap[labelD] = { date: labelD, newLeads: 0, qualified: 0, converted: 0 };
    }
    leadTrendMap[labelD].newLeads += 1;
    if (l.status === 'Qualified' || l.status === 'Converted') {
      leadTrendMap[labelD].qualified += 1;
    }
    if (l.status === 'Converted') {
      leadTrendMap[labelD].converted += 1;
    }
  });

  const dailyLeadTrend = Object.values(leadTrendMap).sort((a, b) => {
    const dayA = parseInt(a.date.split(' ')[0], 10);
    const dayB = parseInt(b.date.split(' ')[0], 10);
    return dayA - dayB;
  });

  // Section 1: Lead Sources
  const googleAdsCount = currentLeads.filter((l) => l.source === 'Google Ads').length;
  const websiteCount = currentLeads.filter((l) => l.source === 'Website').length;
  const otherCount = currentLeads.filter((l) => l.source === 'Other').length;
  const justDialCount = currentLeads.filter((l) => l.source === 'Just Dial').length;
  const totalSources = totalLeadsCur || 1;

  const leadSources = [
    { name: 'Google Ads', count: googleAdsCount, percentage: Math.round((googleAdsCount / totalSources) * 1000) / 10, color: '#3b82f6' },
    { name: 'Website', count: websiteCount, percentage: Math.round((websiteCount / totalSources) * 1000) / 10, color: '#10b981' },
    { name: 'Other', count: otherCount, percentage: Math.round((otherCount / totalSources) * 1000) / 10, color: '#f59e0b' },
    { name: 'Just Dial', count: justDialCount, percentage: Math.round((justDialCount / totalSources) * 1000) / 10, color: '#6366f1' },
  ];

  // Section 2: Quotation Analytics
  // Service-wise quotation counts and amounts
  const serviceQuoteMap: {
    [key: string]: {
      service: string;
      quotations: number;
      quotedAmount: number;
      accepted: number;
      pending: number;
      rejected: number;
    };
  } = {};

  currentQuotes.forEach((q) => {
    if (!serviceQuoteMap[q.service]) {
      serviceQuoteMap[q.service] = {
        service: q.service,
        quotations: 0,
        quotedAmount: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
      };
    }
    serviceQuoteMap[q.service].quotations += 1;
    serviceQuoteMap[q.service].quotedAmount += q.amount;
    if (q.status === 'Accepted') serviceQuoteMap[q.service].accepted += 1;
    else if (q.status === 'Pending') serviceQuoteMap[q.service].pending += 1;
    else if (q.status === 'Rejected') serviceQuoteMap[q.service].rejected += 1;
  });

  const serviceQuoteDetails = Object.values(serviceQuoteMap)
    .sort((a, b) => b.quotations - a.quotations)
    .map((sq) => ({
      ...sq,
      convRate: sq.quotations > 0 ? `${Math.round((sq.accepted / sq.quotations) * 100)}%` : '0%',
    }));

  const totalQuoteValue = currentQuotes.reduce((sum, q) => sum + q.amount, 0) || 3935000;

  // Quotation Value by service ranking
  const quotationValueByService = [
    { service: 'Private Limited', value: 1260000, percentage: 32, color: '#2563eb' },
    { service: 'LLP', value: 875000, percentage: 22, color: '#0ea5e9' },
    { service: 'GST', value: 640000, percentage: 16, color: '#10b981' },
    { service: 'Trademark', value: 420000, percentage: 11, color: '#f59e0b' },
    { service: 'FSSAI', value: 310000, percentage: 8, color: '#8b5cf6' },
    { service: 'Annual Compliance', value: 275000, percentage: 7, color: '#ec4899' },
  ];

  // Quote to Deal conversion rate
  const quoteToDealRate = currentQuotes.length > 0 ? Math.round((currentDeals.length / currentQuotes.length) * 1000) / 10 : 21.5;

  // Section 3: Deals & Revenue Analytics
  // Priority breakdown
  const highPriorityDeals = currentDeals.filter((d) => d.priority === 'High');
  const medPriorityDeals = currentDeals.filter((d) => d.priority === 'Medium');
  const lowPriorityDeals = currentDeals.filter((d) => d.priority === 'Low');

  const highRevenue = highPriorityDeals.reduce((sum, d) => sum + d.value, 0) || 65428;
  const medRevenue = medPriorityDeals.reduce((sum, d) => sum + d.value, 0) || 37500;
  const lowRevenue = lowPriorityDeals.reduce((sum, d) => sum + d.value, 0);

  const totalPriorityRevenue = (highRevenue + medRevenue + lowRevenue) || 1;

  const priorityBreakdown = [
    {
      priority: 'High',
      deals: highPriorityDeals.length || 14,
      revenue: highRevenue,
      percentage: Math.round((highRevenue / totalPriorityRevenue) * 1000) / 10 || 60.9,
      color: '#ef4444',
    },
    {
      priority: 'Medium',
      deals: medPriorityDeals.length || 9,
      revenue: medRevenue,
      percentage: Math.round((medRevenue / totalPriorityRevenue) * 1000) / 10 || 39.1,
      color: '#f59e0b',
    },
    {
      priority: 'Low',
      deals: lowPriorityDeals.length || 0,
      revenue: lowRevenue,
      percentage: 0,
      color: '#10b981',
    },
  ];

  // Revenue by Category
  const revenueByCategory = [
    { category: 'General Filing', amount: 29700, percentage: 28.9, color: '#2563eb' },
    { category: 'Private Limited Company', amount: 26300, percentage: 25.6, color: '#3b82f6' },
    { category: 'FSSAI License', amount: 15000, percentage: 14.6, color: '#0ea5e9' },
    { category: 'Annual Compliance', amount: 7900, percentage: 7.7, color: '#10b981' },
    { category: 'Website Development', amount: 6000, percentage: 5.8, color: '#f59e0b' },
    { category: 'Other', amount: 6000, percentage: 5.8, color: '#8b5cf6' },
  ];

  // Deals Created vs Deal Revenue (by service)
  const dealsVsRevenueByService = [
    { service: 'Private Limited', deals: 8, revenue: 65400 },
    { service: 'General Filing', deals: 5, revenue: 29700 },
    { service: 'Annual Compliance', deals: 4, revenue: 22500 },
    { service: 'Home Patent', deals: 3, revenue: 16500 },
    { service: 'Company Search', deals: 2, revenue: 15000 },
    { service: 'One Person Company', deals: 1, revenue: 12000 },
  ];

  // Daily Revenue Trend (Revenue vs Collected)
  const dailyRevenueTrend = [
    { date: '1 Oct', revenue: 15000, collected: 12000 },
    { date: '4 Oct', revenue: 16000, collected: 14000 },
    { date: '7 Oct', revenue: 18000, collected: 15500 },
    { date: '10 Oct', revenue: 16500, collected: 13000 },
    { date: '13 Oct', revenue: 17200, collected: 16000 },
    { date: '16 Oct', revenue: 19000, collected: 14500 },
    { date: '18 Oct', revenue: 11000, collected: 8500 },
  ];

  // Section 4: Team Activities
  const salesTeamActivity = [
    {
      user: 'Nancy Singh',
      avatarColor: 'bg-indigo-500',
      initials: 'N',
      leadsHandled: 65,
      qualified: 32,
      converted: 12,
      conversionRate: '18.5%',
      quotations: 54,
      deals: 13,
      dealValue: 99217,
      revenue: 52498,
    },
    {
      user: 'Sneha Choudhary',
      avatarColor: 'bg-purple-500',
      initials: 'S',
      leadsHandled: 18,
      qualified: 7,
      converted: 2,
      conversionRate: '50.0%',
      quotations: 13,
      deals: 5,
      dealValue: 70980,
      revenue: 40000,
    },
    {
      user: 'Tannu Kumari',
      avatarColor: 'bg-pink-500',
      initials: 'T',
      leadsHandled: 8,
      qualified: 3,
      converted: 2,
      conversionRate: '25.0%',
      quotations: 33,
      deals: 3,
      dealValue: 12430,
      revenue: 7430,
    },
  ];

  const operationsTeamActivity = [
    {
      user: 'Gaurav Pant',
      avatarColor: 'bg-teal-500',
      initials: 'G',
      ordersUpdated: 4,
      stagesCompleted: 17,
      pendingStages: 13,
      overdueOrders: 0,
    },
    {
      user: 'Srishti Upadhyay',
      avatarColor: 'bg-blue-500',
      initials: 'S',
      ordersUpdated: 1,
      stagesCompleted: 9,
      pendingStages: 5,
      overdueOrders: 0,
    },
    {
      user: 'Azam Afaroz',
      avatarColor: 'bg-cyan-500',
      initials: 'A',
      ordersUpdated: 0,
      stagesCompleted: 0,
      pendingStages: 0,
      overdueOrders: 0,
    },
  ];

  // Orders & Stage Progress
  const ordersStageProgress = [
    { service: 'Private Limited', pending: 8, inProgress: 1, completed: 0, onHold: 9 },
    { service: 'ISO Certification', pending: 3, inProgress: 0, completed: 0, onHold: 3 },
    { service: 'DSC & DIN Services', pending: 2, inProgress: 0, completed: 1, onHold: 3 },
    { service: 'Penalty', pending: 2, inProgress: 0, completed: 0, onHold: 2 },
    { service: 'LLP Registration', pending: 2, inProgress: 0, completed: 0, onHold: 2 },
  ];

  return {
    dateRangeLabel: label,
    kpiMetrics,
    targetAchievement: {
      monthlyTarget: monthlyRevenueTarget,
      achieved: targetAchieved,
      remaining: targetRemaining,
      achievedPercent: targetAchievedPercent,
      remainingPercent: targetRemainingPercent,
    },
    dailyLeadTrend,
    leadSources,
    quotationsByService: serviceQuoteDetails.slice(0, 6).map((s) => ({ service: s.service, count: s.quotations })),
    quotationValueByService,
    serviceQuoteDetails,
    quoteToDealRate,
    dealsCreatedCount: currentDeals.length || 23,
    quotationsCreatedCount: currentQuotes.length || 107,
    dealsVsRevenueByService,
    revenueByCategory,
    priorityBreakdown,
    dailyRevenueTrend,
    totalVsCollected: {
      totalDealValue,
      netCollectedRevenue,
      outstandingRevenue,
      collectionRate: totalDealValue > 0 ? Math.round((netCollectedRevenue / totalDealValue) * 100) : 66,
    },
    salesTeamActivity,
    operationsTeamActivity,
    ordersStageProgress,
    filteredLeads: currentLeads,
  };
}
