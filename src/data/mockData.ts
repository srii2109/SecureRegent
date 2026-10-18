import { Lead, CRMActivity } from '../types';

// Helper to generate consistent dates in Oct 2026 and Sept 2026
const servicesList = [
  'Private Limited Company',
  'LLP Registration',
  'Trademark',
  'Startup India Registration',
  'ISO Certification',
  'GST Filing / Registration',
  'FSSAI License',
  'Annual Compliance',
  'Website Development',
  'Penalty / Late Filing',
  'DSC & DIN Services',
];

const salesUsers = ['Nancy Singh', 'Sneha Choudhary', 'Tannu Kumari'];
const opsUsers = ['Gaurav Pant', 'Srishti Upadhyay', 'Azam Afaroz'];

export const mockUsers = [
  { name: 'All Users', department: 'All Departments' },
  { name: 'Nancy Singh', department: 'Sales', role: 'Senior Sales Consultant' },
  { name: 'Sneha Choudhary', department: 'Sales', role: 'Business Development Manager' },
  { name: 'Tannu Kumari', department: 'Sales', role: 'Sales Executive' },
  { name: 'Gaurav Pant', department: 'Operations', role: 'Operations Lead' },
  { name: 'Srishti Upadhyay', department: 'Operations', role: 'Compliance Specialist' },
  { name: 'Azam Afaroz', department: 'Operations', role: 'Filing Officer' },
];

export const mockDepartments = [
  'All Departments',
  'Sales',
  'Operations',
  'Finance',
  'Legal & Compliance',
];

// Generate comprehensive leads dataset
function generateLeads(): Lead[] {
  const leads: Lead[] = [];

  // Seeded lead templates matching October 2026 (91 leads) + September 2026 (58 leads)
  // Total 149 leads
  const companyPrefixes = ['Apex', 'Nova', 'Zenith', 'TechVanguard', 'BlueSky', 'Quantum', 'Falcon', 'Sigma', 'Vortex', 'Orion', 'Pulse', 'Aero', 'Starlight', 'Solstice', 'Omni'];
  const companySuffixes = ['Technologies', 'Enterprises', 'Ventures', 'Solutions', 'Logistics', 'Retail', 'Global', 'Consulting', 'Innovations', 'Fintech', 'Holdings', 'Pharma'];

  // 1. October 2026 Leads (Target: 91 leads, 42 qualified, 16 converted, 49 unqualified)
  let octQuoteSeq = 10400;
  let octDealSeq = 800;
  let octOrderSeq = 2100;
  let octPaySeq = 1050;

  for (let i = 1; i <= 91; i++) {
    const id = `L-${209600 + i}`;
    const day = Math.min(28, Math.max(1, Math.floor(((i - 1) / 91) * 31) + 1));
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const createdAt = `2026-10-${dayStr}T10:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60}:00Z`;

    // Status distribution: 16 Converted, 26 Qualified (total 42 qualified), 49 Unqualified
    let status: Lead['status'] = 'Unqualified';
    if (i <= 16) {
      status = 'Converted';
    } else if (i <= 42) {
      status = 'Qualified';
    } else {
      status = 'Unqualified';
    }

    // Source distribution: ~70 Google Ads (76.9%), ~21 Website (23.1%)
    const source: Lead['source'] = i % 4 === 0 ? 'Website' : 'Google Ads';

    const assignedTo = salesUsers[(i - 1) % salesUsers.length];
    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[(i * 3) % companySuffixes.length];
    const company = `${prefix} ${suffix} Pvt Ltd`;
    const name = `Client ${prefix} Founder`;
    const email = `contact@${prefix.toLowerCase()}${suffix.toLowerCase()}.com`;
    const phone = `+91 98${(i * 137).toString().padStart(8, '0').slice(0, 8)}`;
    const serviceIndex = (i * 2) % servicesList.length;
    const primaryService = servicesList[serviceIndex];
    const estimatedValue = 15000 + (i * 1250) % 65000;

    // Generate Quotations for this lead
    // Requirements: One lead can have multiple quotations
    const quotations: Lead['quotations'] = [];
    const deals: Lead['deals'] = [];

    // All qualified and converted leads have quotations, some unqualified have initial quotation
    let quoteCount = 0;
    if (status === 'Converted') {
      quoteCount = 2 + (i % 2); // 2 or 3 quotes
    } else if (status === 'Qualified') {
      quoteCount = 1 + (i % 3); // 1 to 3 quotes
    } else if (i % 3 === 0) {
      quoteCount = 1;
    }

    for (let q = 0; q < quoteCount; q++) {
      octQuoteSeq++;
      const qService = servicesList[(serviceIndex + q) % servicesList.length];
      const qAmount = Math.round((estimatedValue * (0.8 + q * 0.3)) / 500) * 500;
      const isAccepted = status === 'Converted' && q === quoteCount - 1;
      const qStatus = isAccepted ? 'Accepted' : (status === 'Unqualified' ? 'Rejected' : (q === 0 ? 'Pending' : 'Expired'));

      quotations.push({
        id: `Q-${octQuoteSeq}`,
        leadId: id,
        service: qService,
        category: qService.includes('Registration') || qService.includes('Company') ? 'Incorporation' : 'Compliance & Legal',
        amount: qAmount,
        discount: q > 0 ? 1500 : 0,
        status: qStatus,
        validUntil: `2026-11-${dayStr}`,
        createdAt,
        assignedTo,
      });

      // If quotation is accepted or lead converted, create Deal(s)
      // Requirements: One lead can have multiple deals, one deal can have multiple orders & payments
      if (isAccepted || (status === 'Converted' && q === 0)) {
        octDealSeq++;
        const dealId = `D-${octDealSeq}`;
        const dealValue = qAmount;
        const priority = i % 3 === 0 ? 'High' : (i % 2 === 0 ? 'High' : 'Medium');
        const dealStage = 'Won';

        // Orders for this deal (one deal can have 1 or 2 orders: e.g. filing & certification)
        const orders: Lead['deals'][0]['orders'] = [];
        const orderCount = (i % 2) + 1;

        for (let ord = 0; ord < orderCount; ord++) {
          octOrderSeq++;
          const orderId = `O-${octOrderSeq}`;
          const opsExec = opsUsers[(i + ord) % opsUsers.length];
          const ordStatus: Lead['deals'][0]['orders'][0]['status'] = 
            ord === 0 && day < 18 ? 'Completed' : (day > 22 ? 'Pending' : 'In Progress');
          const stage: Lead['deals'][0]['orders'][0]['currentStage'] =
            ordStatus === 'Completed' ? 'Completed' : (ordStatus === 'Pending' ? 'Documentation' : 'Government Filing');

          // Payments for this order
          // Requirements: One deal can have multiple payments
          const payments: Lead['deals'][0]['orders'][0]['payments'] = [];
          const paymentCount = ordStatus === 'Completed' ? 2 : 1;
          const splitAmount = Math.round((dealValue / (orderCount * paymentCount)) / 100) * 100;

          for (let p = 0; p < paymentCount; p++) {
            octPaySeq++;
            payments.push({
              id: `P-${octPaySeq}`,
              orderId,
              dealId,
              leadId: id,
              amount: splitAmount,
              date: createdAt.split('T')[0],
              mode: p === 0 ? 'UPI' : 'Bank Transfer',
              status: 'Completed',
              transactionRef: `TXN${9000000 + octPaySeq}`,
            });
          }

          orders.push({
            id: orderId,
            dealId,
            leadId: id,
            service: qService,
            category: qService.includes('Registration') || qService.includes('Company') ? 'Incorporation' : 'Compliance',
            status: ordStatus,
            currentStage: stage,
            assignedTo: opsExec,
            startDate: createdAt.split('T')[0],
            targetDate: `2026-11-${dayStr}`,
            completedDate: ordStatus === 'Completed' ? `2026-10-${Math.min(28, day + 4)}` : undefined,
            payments,
          });
        }

        deals.push({
          id: dealId,
          leadId: id,
          title: `${company} - ${qService}`,
          service: qService,
          category: qService.includes('Registration') || qService.includes('Company') ? 'Incorporation' : 'Compliance & Legal',
          value: dealValue,
          priority,
          stage: dealStage,
          assignedTo,
          createdAt,
          expectedCloseDate: `2026-10-${dayStr}`,
          orders,
        });
      }
    }

    leads.push({
      id,
      name,
      company,
      email,
      phone,
      status,
      source,
      assignedTo,
      createdAt,
      estimatedValue,
      notes: `Interested in corporate compliance and business incorporation for ${prefix} ventures.`,
      quotations,
      deals,
    });
  }

  // 2. September 2026 Leads (Previous period comparison: 58 leads, 31 qualified, 11 converted, 34 unqualified)
  let sepQuoteSeq = 9800;
  let sepDealSeq = 600;
  let sepOrderSeq = 1700;
  let sepPaySeq = 800;

  for (let j = 1; j <= 58; j++) {
    const id = `L-${208000 + j}`;
    const day = Math.min(30, Math.max(1, Math.floor(((j - 1) / 58) * 30) + 1));
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const createdAt = `2026-09-${dayStr}T10:00:00Z`;

    let status: Lead['status'] = 'Unqualified';
    if (j <= 11) {
      status = 'Converted';
    } else if (j <= 31) {
      status = 'Qualified';
    } else {
      status = 'Unqualified';
    }

    const source: Lead['source'] = j % 3 === 0 ? 'Website' : 'Google Ads';
    const assignedTo = salesUsers[(j - 1) % salesUsers.length];
    const prefix = companyPrefixes[j % companyPrefixes.length];
    const company = `${prefix} Systems LLP`;
    const name = `Founder ${prefix}`;
    const email = `admin@${prefix.toLowerCase()}systems.in`;
    const phone = `+91 97${(j * 179).toString().padStart(8, '0').slice(0, 8)}`;
    const serviceIndex = (j * 3) % servicesList.length;
    const primaryService = servicesList[serviceIndex];
    const estimatedValue = 12000 + (j * 1100) % 50000;

    const quotations: Lead['quotations'] = [];
    const deals: Lead['deals'] = [];

    let quoteCount = 0;
    if (status === 'Converted') quoteCount = 2;
    else if (status === 'Qualified') quoteCount = 1;

    for (let q = 0; q < quoteCount; q++) {
      sepQuoteSeq++;
      const qService = servicesList[(serviceIndex + q) % servicesList.length];
      const qAmount = estimatedValue;
      const isAccepted = status === 'Converted' && q === quoteCount - 1;

      quotations.push({
        id: `Q-${sepQuoteSeq}`,
        leadId: id,
        service: qService,
        category: 'Incorporation',
        amount: qAmount,
        discount: 1000,
        status: isAccepted ? 'Accepted' : 'Pending',
        validUntil: `2026-10-${dayStr}`,
        createdAt,
        assignedTo,
      });

      if (isAccepted) {
        sepDealSeq++;
        const dealId = `D-${sepDealSeq}`;
        const orders: Lead['deals'][0]['orders'] = [];
        sepOrderSeq++;
        const orderId = `O-${sepOrderSeq}`;
        sepPaySeq++;

        orders.push({
          id: orderId,
          dealId,
          leadId: id,
          service: qService,
          category: 'Incorporation',
          status: 'Completed',
          currentStage: 'Completed',
          assignedTo: opsUsers[j % opsUsers.length],
          startDate: createdAt.split('T')[0],
          targetDate: `2026-10-${dayStr}`,
          completedDate: `2026-09-28`,
          payments: [
            {
              id: `P-${sepPaySeq}`,
              orderId,
              dealId,
              leadId: id,
              amount: qAmount,
              date: createdAt.split('T')[0],
              mode: 'UPI',
              status: 'Completed',
              transactionRef: `TXN${8000000 + sepPaySeq}`,
            },
          ],
        });

        deals.push({
          id: dealId,
          leadId: id,
          title: `${company} - ${qService}`,
          service: qService,
          category: 'Incorporation',
          value: qAmount,
          priority: 'High',
          stage: 'Won',
          assignedTo,
          createdAt,
          expectedCloseDate: `2026-09-${dayStr}`,
          orders,
        });
      }
    }

    leads.push({
      id,
      name,
      company,
      email,
      phone,
      status,
      source,
      assignedTo,
      createdAt,
      estimatedValue,
      notes: `September lead for registration and tax planning.`,
      quotations,
      deals,
    });
  }

  return leads;
}

export const allMockLeads: Lead[] = generateLeads();

export const mockRecentActivities: CRMActivity[] = [
  {
    id: 'ACT-1',
    timestamp: '2026-10-18T14:10:04Z',
    employee: 'Nancy Singh',
    department: 'Sales',
    action: 'Lead updated',
    recordId: '#L-209610',
    recordType: 'lead',
    details: 'Status changed to Qualified after requirement alignment call',
  },
  {
    id: 'ACT-2',
    timestamp: '2026-10-18T13:45:11Z',
    employee: 'Nancy Singh',
    department: 'Sales',
    action: 'Lead updated',
    recordId: '#L-209610',
    recordType: 'lead',
    details: 'Added client incorporation jurisdiction preferences',
  },
  {
    id: 'ACT-3',
    timestamp: '2026-10-18T11:53:02Z',
    employee: 'Sneha Choudhary',
    department: 'Sales',
    action: 'Payment recorded',
    recordId: '#P-1081',
    recordType: 'payment',
    details: 'Received ₹45,000 via IMPS for GST & Trademark filing',
  },
  {
    id: 'ACT-4',
    timestamp: '2026-10-18T11:53:02Z',
    employee: 'Sneha Choudhary',
    department: 'Sales',
    action: 'Order created',
    recordId: '#O-2168',
    recordType: 'order',
    details: 'Assigned to Gaurav Pant for legal documentation check',
  },
  {
    id: 'ACT-5',
    timestamp: '2026-10-18T11:50:43Z',
    employee: 'Sneha Choudhary',
    department: 'Sales',
    action: 'Deal created',
    recordId: '#D-822',
    recordType: 'deal',
    details: 'Apex Enterprises Pvt Ltd converted at ₹65,428 deal value',
  },
  {
    id: 'ACT-6',
    timestamp: '2026-10-18T11:45:28Z',
    employee: 'Sneha Choudhary',
    department: 'Sales',
    action: 'Quotation created',
    recordId: '#Q-10467',
    recordType: 'quote',
    details: 'Generated revised proposal with 10% compliance bundle discount',
  },
  {
    id: 'ACT-7',
    timestamp: '2026-10-18T11:44:50Z',
    employee: 'Tannu Kumari',
    department: 'Sales',
    action: 'Quotation created',
    recordId: '#Q-10466',
    recordType: 'quote',
    details: 'Sent official quote for Startup India & Trademark registration',
  },
  {
    id: 'ACT-8',
    timestamp: '2026-10-18T09:30:15Z',
    employee: 'Gaurav Pant',
    department: 'Operations',
    action: 'Order updated',
    recordId: '#O-2165',
    recordType: 'order',
    details: 'MCA DIN approval received, progressing to SPICe+ Part B',
  },
  {
    id: 'ACT-9',
    timestamp: '2026-10-17T17:20:00Z',
    employee: 'Srishti Upadhyay',
    department: 'Operations',
    action: 'Order updated',
    recordId: '#O-2158',
    recordType: 'order',
    details: 'FSSAI inspection documentation verified and submitted',
  },
];
