export type LeadStatus = 'New' | 'Qualified' | 'Converted' | 'Unqualified';
export type LeadSource = 'Google Ads' | 'Website' | 'Other' | 'Just Dial' | 'Referral';
export type QuoteStatus = 'Accepted' | 'Pending' | 'Rejected' | 'Expired';
export type DealPriority = 'High' | 'Medium' | 'Low';
export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
export type OrderStage = 'Documentation' | 'Government Filing' | 'Verification' | 'Approval' | 'Completed';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';
export type PaymentMode = 'UPI' | 'Bank Transfer' | 'Credit Card' | 'Net Banking' | 'Cheque';

export type Department = 'All Departments' | 'Sales' | 'Operations' | 'Finance' | 'Legal & Compliance';

export interface Payment {
  id: string;
  orderId: string;
  dealId: string;
  leadId: string;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
  mode: PaymentMode;
  status: PaymentStatus;
  transactionRef: string;
}

export interface Order {
  id: string;
  dealId: string;
  leadId: string;
  service: string;
  category: string;
  status: OrderStatus;
  currentStage: OrderStage;
  assignedTo: string; // operations executive
  startDate: string;
  targetDate: string;
  completedDate?: string;
  payments: Payment[];
}

export interface Deal {
  id: string;
  leadId: string;
  title: string;
  service: string;
  category: string;
  value: number;
  priority: DealPriority;
  stage: DealStage;
  assignedTo: string; // sales executive
  createdAt: string;
  expectedCloseDate: string;
  orders: Order[];
}

export interface Quotation {
  id: string;
  leadId: string;
  service: string;
  category: string;
  amount: number;
  discount: number;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  assignedTo: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string;
  createdAt: string;
  estimatedValue: number;
  notes: string;
  quotations: Quotation[];
  deals: Deal[];
}

export interface CRMActivity {
  id: string;
  timestamp: string;
  employee: string;
  department: 'Sales' | 'Operations' | 'Finance';
  action: 'Lead created' | 'Lead updated' | 'Quotation created' | 'Deal created' | 'Deal updated' | 'Order created' | 'Order updated' | 'Payment recorded';
  recordId: string;
  recordType: 'lead' | 'quote' | 'deal' | 'order' | 'payment';
  details: string;
}

export type DateFilterType = 'today' | '7days' | '30days' | 'custom';

export interface FilterState {
  dateFilter: DateFilterType;
  customStartDate?: string;
  customEndDate?: string;
  department: Department;
  user: string;
}

export interface ComparativeMetric {
  current: number;
  previous: number;
  percentageChange: number;
  isPositive: boolean;
}
