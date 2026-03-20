import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { 
  ApplicationState, 
  AppAction, 
  AppContextType,
  User,
  Company,
  Admin,
  Subscription,
  CompanySubscription,
  ToastNotification
} from '../types';
import DataPersistenceService from '../services/DataPersistenceService';

// =============================================================================
// APPLICATION REDUCER
// =============================================================================

export const appReducer = (state: ApplicationState, action: AppAction): ApplicationState => {
  switch (action.type) {
    // =============================================================================
    // LOADING AND USER MANAGEMENT
    // =============================================================================
    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload
        }
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };

    // =============================================================================
    // COMPANY MANAGEMENT ACTIONS
    // =============================================================================
    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [...state.companies, action.payload]
      };

    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id
            ? { ...company, ...action.payload.updates, updatedAt: new Date() }
            : company
        )
      };

    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        // Also remove any admins assigned to this company
        admins: state.admins.filter(admin => admin.companyId !== action.payload),
        // Also remove any company subscriptions for this company
        companySubscriptions: state.companySubscriptions.filter(
          subscription => subscription.companyId !== action.payload
        )
      };

    case 'SET_COMPANIES':
      return {
        ...state,
        companies: action.payload
      };

    // =============================================================================
    // ADMIN MANAGEMENT ACTIONS
    // =============================================================================
    case 'ADD_ADMIN':
      return {
        ...state,
        admins: [...state.admins, action.payload]
      };

    case 'UPDATE_ADMIN':
      return {
        ...state,
        admins: state.admins.map(admin =>
          admin.id === action.payload.id
            ? { ...admin, ...action.payload.updates, updatedAt: new Date() }
            : admin
        )
      };

    case 'DELETE_ADMIN':
      return {
        ...state,
        admins: state.admins.filter(admin => admin.id !== action.payload)
      };

    case 'SET_ADMINS':
      return {
        ...state,
        admins: action.payload
      };

    // =============================================================================
    // SUBSCRIPTION MANAGEMENT ACTIONS
    // =============================================================================
    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload]
      };

    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(subscription =>
          subscription.id === action.payload.id
            ? { ...subscription, ...action.payload.updates, updatedAt: new Date() }
            : subscription
        )
      };

    case 'DELETE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter(subscription => subscription.id !== action.payload),
        // Also remove any company subscriptions using this subscription
        companySubscriptions: state.companySubscriptions.filter(
          companySubscription => companySubscription.subscriptionId !== action.payload
        )
      };

    case 'SET_SUBSCRIPTIONS':
      return {
        ...state,
        subscriptions: action.payload
      };

    // =============================================================================
    // COMPANY SUBSCRIPTION ASSIGNMENT ACTIONS
    // =============================================================================
    case 'ADD_COMPANY_SUBSCRIPTION':
      return {
        ...state,
        companySubscriptions: [...state.companySubscriptions, action.payload]
      };

    case 'UPDATE_COMPANY_SUBSCRIPTION':
      return {
        ...state,
        companySubscriptions: state.companySubscriptions.map(companySubscription =>
          companySubscription.id === action.payload.id
            ? { ...companySubscription, ...action.payload.updates }
            : companySubscription
        )
      };

    case 'DELETE_COMPANY_SUBSCRIPTION':
      return {
        ...state,
        companySubscriptions: state.companySubscriptions.filter(
          companySubscription => companySubscription.id !== action.payload
        )
      };

    case 'SET_COMPANY_SUBSCRIPTIONS':
      return {
        ...state,
        companySubscriptions: action.payload
      };

    // =============================================================================
    // UI STATE MANAGEMENT ACTIONS
    // =============================================================================
    case 'SET_ACTIVE_MODULE':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModule: action.payload
        }
      };

    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload]
        }
      };

    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          )
        }
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: []
        }
      };

    case 'SHOW_CONFIRM_DELETE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            confirmDelete: {
              isOpen: true,
              itemType: action.payload.itemType,
              itemId: action.payload.itemId,
              onConfirm: action.payload.onConfirm
            }
          }
        }
      };

    case 'HIDE_CONFIRM_DELETE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            confirmDelete: undefined
          }
        }
      };

    // =============================================================================
    // BULK OPERATIONS
    // =============================================================================
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        companies: action.payload.companies || [],
        admins: action.payload.admins || [],
        subscriptions: action.payload.subscriptions || [],
        companySubscriptions: action.payload.companySubscriptions || [],
        user: action.payload.user || state.user
      };

    case 'RESET_APPLICATION_STATE':
      return getInitialState();

    // =============================================================================
    // AUTOMATIC STATUS UPDATES
    // =============================================================================
    case 'UPDATE_EXPIRED_SUBSCRIPTIONS':
      const now = new Date();
      return {
        ...state,
        subscriptions: state.subscriptions.map(subscription => {
          if (subscription.expiryDate < now && subscription.status !== 'expired') {
            return { ...subscription, status: 'expired' as const, updatedAt: new Date() };
          }
          return subscription;
        }),
        companySubscriptions: state.companySubscriptions.map(companySubscription => {
          if (companySubscription.expiryDate < now && companySubscription.status !== 'expired') {
            return { ...companySubscription, status: 'expired' as const };
          }
          return companySubscription;
        })
      };

    default:
      return state;
  }
};

// =============================================================================
// INITIAL STATE FACTORY
// =============================================================================

const getInitialState = (): ApplicationState => ({
  user: {
    id: '',
    fullName: '',
    email: '',
    role: 'super_admin'
  },
  companies: [
    {
      id: 'demo-company-1',
      code: 'COMP001',
      name: 'Acme Corporation',
      companyType: 'private_limited',
      industry: 'Technology',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM2ODJmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BQzwvdGV4dD48L3N2Zz4=',
      email: 'contact@acmecorp.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        postalCode: '94102'
      },
      gstNumber: 'GST123456789',
      taxNumber: 'TAX987654321',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ],
  admins: [
    {
      id: 'demo-admin-1',
      fullName: 'John Doe',
      email: 'john.doe@acmecorp.com',
      phone: '+1 (555) 987-6543',
      companyId: 'demo-company-1',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ],
  subscriptions: [],
  companySubscriptions: [],
  ui: {
    activeModule: 'dashboard',
    loading: false,
    notifications: [],
    modals: {}
  }
});

// =============================================================================
// ACTION CREATORS
// =============================================================================

export const actionCreators = {
  // Loading and user actions
  setLoading: (loading: boolean): AppAction => ({ type: 'SET_LOADING', payload: loading }),
  setUser: (user: User): AppAction => ({ type: 'SET_USER', payload: user }),

  // Company actions
  addCompany: (company: Company): AppAction => ({ type: 'ADD_COMPANY', payload: company }),
  updateCompany: (id: string, updates: Partial<Company>): AppAction => ({ 
    type: 'UPDATE_COMPANY', 
    payload: { id, updates } 
  }),
  deleteCompany: (id: string): AppAction => ({ type: 'DELETE_COMPANY', payload: id }),
  setCompanies: (companies: Company[]): AppAction => ({ type: 'SET_COMPANIES', payload: companies }),

  // Admin actions
  addAdmin: (admin: Admin): AppAction => ({ type: 'ADD_ADMIN', payload: admin }),
  updateAdmin: (id: string, updates: Partial<Admin>): AppAction => ({ 
    type: 'UPDATE_ADMIN', 
    payload: { id, updates } 
  }),
  deleteAdmin: (id: string): AppAction => ({ type: 'DELETE_ADMIN', payload: id }),
  setAdmins: (admins: Admin[]): AppAction => ({ type: 'SET_ADMINS', payload: admins }),

  // Subscription actions
  addSubscription: (subscription: Subscription): AppAction => ({ 
    type: 'ADD_SUBSCRIPTION', 
    payload: subscription 
  }),
  updateSubscription: (id: string, updates: Partial<Subscription>): AppAction => ({ 
    type: 'UPDATE_SUBSCRIPTION', 
    payload: { id, updates } 
  }),
  deleteSubscription: (id: string): AppAction => ({ type: 'DELETE_SUBSCRIPTION', payload: id }),
  setSubscriptions: (subscriptions: Subscription[]): AppAction => ({ 
    type: 'SET_SUBSCRIPTIONS', 
    payload: subscriptions 
  }),

  // Company subscription actions
  addCompanySubscription: (companySubscription: CompanySubscription): AppAction => ({ 
    type: 'ADD_COMPANY_SUBSCRIPTION', 
    payload: companySubscription 
  }),
  updateCompanySubscription: (id: string, updates: Partial<CompanySubscription>): AppAction => ({ 
    type: 'UPDATE_COMPANY_SUBSCRIPTION', 
    payload: { id, updates } 
  }),
  deleteCompanySubscription: (id: string): AppAction => ({ 
    type: 'DELETE_COMPANY_SUBSCRIPTION', 
    payload: id 
  }),
  setCompanySubscriptions: (companySubscriptions: CompanySubscription[]): AppAction => ({ 
    type: 'SET_COMPANY_SUBSCRIPTIONS', 
    payload: companySubscriptions 
  }),

  // UI actions
  setActiveModule: (module: string): AppAction => ({ type: 'SET_ACTIVE_MODULE', payload: module }),
  showNotification: (notification: ToastNotification): AppAction => ({ 
    type: 'SHOW_NOTIFICATION', 
    payload: notification 
  }),
  hideNotification: (id: string): AppAction => ({ type: 'HIDE_NOTIFICATION', payload: id }),
  clearAllNotifications: (): AppAction => ({ type: 'CLEAR_ALL_NOTIFICATIONS' }),
  showConfirmDeleteModal: (itemType: string, itemId: string, onConfirm: () => void): AppAction => ({ 
    type: 'SHOW_CONFIRM_DELETE_MODAL', 
    payload: { itemType, itemId, onConfirm } 
  }),
  hideConfirmDeleteModal: (): AppAction => ({ type: 'HIDE_CONFIRM_DELETE_MODAL' }),

  // Bulk operations
  loadInitialData: (data: {
    companies?: Company[];
    admins?: Admin[];
    subscriptions?: Subscription[];
    companySubscriptions?: CompanySubscription[];
    user?: User;
  }): AppAction => ({ type: 'LOAD_INITIAL_DATA', payload: data }),
  resetApplicationState: (): AppAction => ({ type: 'RESET_APPLICATION_STATE' }),

  // Automatic updates
  updateExpiredSubscriptions: (): AppAction => ({ type: 'UPDATE_EXPIRED_SUBSCRIPTIONS' })
};

// =============================================================================
// CONTEXT DEFINITION
// =============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // =============================================================================
  // DATA PERSISTENCE INTEGRATION
  // =============================================================================

  // Load initial data from storage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch(actionCreators.setLoading(true));

      try {
        // Load all data from persistence service
        const companiesResult = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
        const adminsResult = DataPersistenceService.load<Admin[]>('admin-dashboard-admins');
        const subscriptionsResult = DataPersistenceService.load<Subscription[]>('admin-dashboard-subscriptions');
        const companySubscriptionsResult = DataPersistenceService.load<CompanySubscription[]>('admin-dashboard-company-subscriptions');
        const userResult = DataPersistenceService.load<User>('admin-dashboard-user');

        // Dispatch loaded data
        dispatch(actionCreators.loadInitialData({
          companies: companiesResult.success ? companiesResult.data : [],
          admins: adminsResult.success ? adminsResult.data : [],
          subscriptions: subscriptionsResult.success ? subscriptionsResult.data : [],
          companySubscriptions: companySubscriptionsResult.success ? companySubscriptionsResult.data : [],
          user: userResult.success && userResult.data ? userResult.data : undefined
        }));

        // Update expired subscriptions
        dispatch(actionCreators.updateExpiredSubscriptions());

      } catch (error) {
        console.error('Failed to load initial data:', error);
        dispatch(actionCreators.showNotification({
          id: `error-${Date.now()}`,
          type: 'error',
          title: 'Data Loading Error',
          message: 'Failed to load application data. Using default values.',
          duration: 5000
        }));
      } finally {
        dispatch(actionCreators.setLoading(false));
      }
    };

    loadInitialData();
  }, []);

  // Persist data changes to storage
  useEffect(() => {
    if (state.companies.length > 0 || state.admins.length > 0 || state.subscriptions.length > 0) {
      // Save companies
      DataPersistenceService.save('admin-dashboard-companies', state.companies);
      
      // Save admins
      DataPersistenceService.save('admin-dashboard-admins', state.admins);
      
      // Save subscriptions
      DataPersistenceService.save('admin-dashboard-subscriptions', state.subscriptions);
      
      // Save company subscriptions
      DataPersistenceService.save('admin-dashboard-company-subscriptions', state.companySubscriptions);
    }
  }, [state.companies, state.admins, state.subscriptions, state.companySubscriptions]);

  // Persist user data
  useEffect(() => {
    if (state.user.id) {
      DataPersistenceService.save('admin-dashboard-user', state.user);
    }
  }, [state.user]);

  // Auto-hide notifications after their duration
  useEffect(() => {
    state.ui.notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dispatch(actionCreators.hideNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [state.ui.notifications]);

  // Periodic check for expired subscriptions (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(actionCreators.updateExpiredSubscriptions());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: AppContextType = {
    state,
    dispatch
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

// Hook for accessing specific parts of the state
export const useAppState = () => {
  const { state } = useApp();
  return state;
};

// Hook for accessing dispatch function
export const useAppDispatch = () => {
  const { dispatch } = useApp();
  return dispatch;
};

// Hook for accessing UI state specifically
export const useUIState = () => {
  const { state } = useApp();
  return state.ui;
};

// Hook for accessing current user
export const useCurrentUser = () => {
  const { state } = useApp();
  return state.user;
};

// Hook for managing notifications
export const useNotifications = () => {
  const { state, dispatch } = useApp();
  
  return {
    notifications: state.ui.notifications,
    showNotification: (notification: Omit<ToastNotification, 'id'>) => {
      dispatch(actionCreators.showNotification({
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
    },
    hideNotification: (id: string) => dispatch(actionCreators.hideNotification(id)),
    clearAllNotifications: () => dispatch(actionCreators.clearAllNotifications())
  };
};