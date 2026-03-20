// Subscription Plans Configuration for Multi-Tenant ERP

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string | number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  seats: number | 'unlimited';
  storage: string;
  color: string;
  popular?: boolean;
  features: PlanFeature[];
  modules: string[];
}

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    billingPeriod: 'month',
    seats: 25,
    storage: '10 GB',
    color: 'var(--sa-info)',
    features: [
      { name: 'Up to 25 users', included: true },
      { name: '10 GB storage', included: true },
      { name: 'Core ERP modules', included: true },
      { name: 'Email support', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Standard reports', included: true },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
      { name: 'Priority support', included: false },
      { name: 'Advanced analytics', included: false },
    ],
    modules: [
      'Inventory Management',
      'Purchase Management',
      'Sales Management',
      'Accounts & Finance',
      'Billing'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    billingPeriod: 'month',
    seats: 100,
    storage: '50 GB',
    color: 'var(--sa-success)',
    popular: true,
    features: [
      { name: 'Up to 100 users', included: true },
      { name: '50 GB storage', included: true },
      { name: 'All ERP modules', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Advanced reports', included: true },
      { name: 'API access', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
    ],
    modules: [
      'Inventory Management',
      'Purchase Management',
      'Sales Management',
      'Accounts & Finance',
      'CRM',
      'HRM',
      'Projects',
      'Helpdesk',
      'Assets',
      'Logistics',
      'Production',
      'Billing'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billingPeriod: 'month',
    seats: 'unlimited',
    storage: 'Unlimited',
    color: 'var(--sa-primary)',
    features: [
      { name: 'Unlimited users', included: true },
      { name: 'Unlimited storage', included: true },
      { name: 'All ERP modules', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Custom reports', included: true },
      { name: 'Full API access', included: true },
      { name: 'White label branding', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Advanced analytics & BI', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'On-premise deployment option', included: true },
    ],
    modules: [
      'Inventory Management',
      'Purchase Management',
      'Sales Management',
      'Accounts & Finance',
      'CRM',
      'HRM',
      'Projects',
      'Helpdesk',
      'Assets',
      'Logistics',
      'Production',
      'Billing'
    ]
  }
];

// Helper function to get plan by ID
export function getPlanById(planId: string): Plan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

// Helper function to get plan by name
export function getPlanByName(planName: string): Plan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.name.toLowerCase() === planName.toLowerCase());
}

// Helper function to check if a module is available in a plan
export function isPlanModuleAvailable(planId: string, moduleName: string): boolean {
  const plan = getPlanById(planId);
  return plan ? plan.modules.includes(moduleName) : false;
}

// Helper function to calculate annual price with discount
export function getAnnualPrice(monthlyPrice: number, discountPercent: number = 20): number {
  const annualPrice = monthlyPrice * 12;
  return annualPrice - (annualPrice * discountPercent / 100);
}
