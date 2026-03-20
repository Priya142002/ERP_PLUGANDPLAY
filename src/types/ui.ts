// UI-related types and interfaces
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ApplicationState {
  user: User;
  companies: Company[];
  admins: Admin[];
  subscriptions: Subscription[];
  companySubscriptions: CompanySubscription[];
  ui: {
    activeModule: string;
    loading: boolean;
    notifications: ToastNotification[];
    modals: {
      confirmDelete?: {
        isOpen: boolean;
        itemType: string;
        itemId: string;
        onConfirm: () => void;
      };
    };
  };
}

export interface LocalStorageSchema {
  'admin-dashboard-companies': Company[];
  'admin-dashboard-admins': Admin[];
  'admin-dashboard-subscriptions': Subscription[];
  'admin-dashboard-company-subscriptions': CompanySubscription[];
  'admin-dashboard-user': User;
  'admin-dashboard-settings': {
    theme: 'light' | 'dark';
    pageSize: number;
    language: string;
  };
}

// Import types from models
import type { Company, Admin, Subscription, CompanySubscription, User } from './models';