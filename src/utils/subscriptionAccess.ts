// Subscription-based module access control

export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

// Define which modules are available for each plan
export const PLAN_MODULES: Record<SubscriptionPlan, string[]> = {
  basic: [
    'inventory',
    'purchase',
    'sales',
    'accounts'
  ],
  pro: [
    'inventory',
    'purchase',
    'sales',
    'accounts',
    'crm',
    'hrm',
    'projects',
    'helpdesk',
    'assets',
    'logistics',
    'production',
    'billing'
  ],
  enterprise: [
    'inventory',
    'purchase',
    'sales',
    'accounts',
    'crm',
    'hrm',
    'projects',
    'helpdesk',
    'assets',
    'logistics',
    'production',
    'billing'
  ]
};

// Check if a module is accessible based on subscription plan
export function hasModuleAccess(plan: SubscriptionPlan, moduleId: string): boolean {
  // Admin settings, subscription, and modules management are always accessible
  if (moduleId === 'admin' || moduleId === 'subscription' || moduleId === 'modules') {
    return true;
  }
  
  return PLAN_MODULES[plan].includes(moduleId);
}

// Filter navigation items based on subscription plan
export function filterNavigationByPlan(
  navigationItems: any[],
  plan: SubscriptionPlan
): any[] {
  return navigationItems.filter(item => hasModuleAccess(plan, item.id));
}

// Get plan features for display
export const PLAN_FEATURES = {
  basic: {
    name: 'Basic',
    modules: 4,
    description: 'Core ERP modules for small businesses',
    moduleList: ['Inventory', 'Purchase', 'Sales', 'Accounts & Finance']
  },
  pro: {
    name: 'Pro',
    modules: 12,
    description: 'All ERP modules for growing businesses',
    moduleList: [
      'Inventory', 'Purchase', 'Sales', 'Accounts & Finance',
      'CRM', 'HRM', 'Projects', 'Helpdesk',
      'Assets', 'Logistics', 'Production', 'Billing'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    modules: 12,
    description: 'All modules with premium features',
    moduleList: [
      'Inventory', 'Purchase', 'Sales', 'Accounts & Finance',
      'CRM', 'HRM', 'Projects', 'Helpdesk',
      'Assets', 'Logistics', 'Production', 'Billing'
    ]
  }
};
