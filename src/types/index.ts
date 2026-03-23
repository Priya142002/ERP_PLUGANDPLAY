// =============================================================================
// CORE DATA MODELS
// =============================================================================

// Company Data Model
export interface Company {
  id: string;
  code: string; // Unique company code
  name: string;
  companyType: 'private_limited' | 'public_limited' | 'llp' | 'partnership' | 'sole_proprietorship' | 'opc' | 'government' | 'non_profit';
  industry: string;
  logo?: string; // Base64 encoded image or URL
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  gstNumber?: string;
  taxNumber?: string;
  financialYearStart?: string; // e.g., "April"
  currency?: string;
  status: 'active' | 'inactive';
  trialStartDate?: Date;       // Set when company is created (free demo)
  allowedModules?: string[];   // Superadmin-assigned modules for trial/free access
  createdAt: Date;
  updatedAt: Date;
}

// Admin Data Model
export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyId: string;
  role: 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Data Model
export interface Subscription {
  id: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  price: number;
  currency: string;
  maxUsers: number;
  maxModules: number;
  features: string[];
  startDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

// Company Subscription Assignment
export interface CompanySubscription {
  id: string;
  companyId: string;
  subscriptionId: string;
  startDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
  assignedAt: Date;
}

// User Data Models
export interface SuperAdmin {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'admin';
  companyId?: string; // Only for admin users
}

// =============================================================================
// UI STATE MODELS
// =============================================================================

// Toast Notification System
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

// Modal Dialog State
export interface ModalState {
  confirmDelete?: {
    isOpen: boolean;
    itemType: string;
    itemId: string;
    onConfirm: () => void;
  };
}

// UI State Interface
export interface UIState {
  activeModule: string;
  loading: boolean;
  notifications: ToastNotification[];
  modals: ModalState;
}

// Application State Model
export interface ApplicationState {
  user: User;
  companies: Company[];
  admins: Admin[];
  subscriptions: Subscription[];
  companySubscriptions: CompanySubscription[];
  ui: UIState;
}

// =============================================================================
// COMPONENT PROP INTERFACES
// =============================================================================

// Data Table Component Props
export interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

// Form Component Props
export interface BaseFormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  validationSchema: import('zod').ZodSchema<T>;
  isLoading?: boolean;
}

// Modal Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Dashboard Shell Props
export interface DashboardShellProps {
  currentUser: SuperAdmin | Admin;
  activeModule: 'companies' | 'admins' | 'subscriptions' | 'dashboard';
  onModuleChange: (module: string) => void;
}

// =============================================================================
// NAVIGATION AND ROUTING
// =============================================================================

// Route Configuration
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  requiresAuth: boolean;
  allowedRoles: ('super_admin' | 'admin')[];
}

// Navigation Item
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
  roles: ('super_admin' | 'admin')[];
}

// =============================================================================
// DATA PERSISTENCE AND STORAGE
// =============================================================================

// Local Storage Schema
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

// =============================================================================
// CONTEXT INTERFACES
// =============================================================================

// Application Context
export interface AppContextType {
  state: ApplicationState;
  dispatch: React.Dispatch<AppAction>;
}

// Company Management Context
export interface CompanyContextType {
  companies: Company[];
  loading: boolean;
  createCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OperationResult<Company>>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<OperationResult<Company>>;
  deleteCompany: (id: string) => Promise<OperationResult<void>>;
  getCompany: (id: string) => Company | undefined;
}

// Admin Management Context
export interface AdminContextType {
  admins: Admin[];
  loading: boolean;
  createAdmin: (admin: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OperationResult<Admin>>;
  updateAdmin: (id: string, updates: Partial<Admin>) => Promise<OperationResult<Admin>>;
  deleteAdmin: (id: string) => Promise<OperationResult<void>>;
  getAdmin: (id: string) => Admin | undefined;
  getAdminsByCompany: (companyId: string) => Admin[];
  getAdminsByStatus: (status: 'active' | 'inactive') => Admin[];
  toggleAdminStatus: (id: string) => Promise<OperationResult<Admin>>;
  searchAdmins: (query: string) => Admin[];
  getAdminStats: () => {
    total: number;
    active: number;
    inactive: number;
    companiesWithAdmins: number;
  };
}

// Subscription Management Context
export interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  createSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OperationResult<Subscription>>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<OperationResult<Subscription>>;
  deleteSubscription: (id: string) => Promise<OperationResult<void>>;
  getSubscription: (id: string) => Subscription | undefined;
  assignSubscriptionToCompany: (companyId: string, subscriptionId: string, startDate: Date, expiryDate: Date) => Promise<OperationResult<CompanySubscription>>;
  getSubscriptionsByStatus: (status: 'active' | 'expired' | 'suspended') => Subscription[];
  getSubscriptionsByPlanType: (planType: 'monthly' | 'yearly') => Subscription[];
  getCompanySubscriptions: (companyId: string) => CompanySubscription[];
  searchSubscriptions: (query: string) => Subscription[];
  getSubscriptionStats: () => {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    monthly: number;
    yearly: number;
    assignedToCompanies: number;
    activeAssignments: number;
  };
}

// =============================================================================
// ACTION TYPES AND OPERATION RESULTS
// =============================================================================

// Application Actions
export type AppAction = 
  // Loading and user management
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  
  // Company management
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: { id: string; updates: Partial<Company> } }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'SET_COMPANIES'; payload: Company[] }
  
  // Admin management
  | { type: 'ADD_ADMIN'; payload: Admin }
  | { type: 'UPDATE_ADMIN'; payload: { id: string; updates: Partial<Admin> } }
  | { type: 'DELETE_ADMIN'; payload: string }
  | { type: 'SET_ADMINS'; payload: Admin[] }
  
  // Subscription management
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: { id: string; updates: Partial<Subscription> } }
  | { type: 'DELETE_SUBSCRIPTION'; payload: string }
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  
  // Company subscription management
  | { type: 'ADD_COMPANY_SUBSCRIPTION'; payload: CompanySubscription }
  | { type: 'UPDATE_COMPANY_SUBSCRIPTION'; payload: { id: string; updates: Partial<CompanySubscription> } }
  | { type: 'DELETE_COMPANY_SUBSCRIPTION'; payload: string }
  | { type: 'SET_COMPANY_SUBSCRIPTIONS'; payload: CompanySubscription[] }
  
  // UI state management
  | { type: 'SET_ACTIVE_MODULE'; payload: string }
  | { type: 'SHOW_NOTIFICATION'; payload: ToastNotification }
  | { type: 'HIDE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'SHOW_CONFIRM_DELETE_MODAL'; payload: { itemType: string; itemId: string; onConfirm: () => void } }
  | { type: 'HIDE_CONFIRM_DELETE_MODAL' }
  
  // Bulk operations
  | { type: 'LOAD_INITIAL_DATA'; payload: { 
      companies?: Company[]; 
      admins?: Admin[]; 
      subscriptions?: Subscription[]; 
      companySubscriptions?: CompanySubscription[]; 
      user?: User; 
    } }
  | { type: 'RESET_APPLICATION_STATE' }
  
  // Automatic updates
  | { type: 'UPDATE_EXPIRED_SUBSCRIPTIONS' };

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}

// Operation Result
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}