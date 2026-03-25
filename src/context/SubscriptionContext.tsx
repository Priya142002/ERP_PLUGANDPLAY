import React, { createContext, useContext } from 'react';
import type { Subscription, CompanySubscription, OperationResult, SubscriptionContextType } from '../types';
import { useApp, useNotifications } from './AppContext';
import { actionCreators } from './AppContext';
import DataPersistenceService from '../services/DataPersistenceService';
import { subscriptionSchema, createSubscriptionSchema, updateSubscriptionSchema, companySubscriptionSchema } from '../schemas/validation';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// SUBSCRIPTION CONTEXT DEFINITION
// =============================================================================

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// =============================================================================
// SUBSCRIPTION PROVIDER COMPONENT
// =============================================================================

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();

  // =============================================================================
  // SUBSCRIPTION CRUD OPERATIONS
  // =============================================================================

  /**
   * Create a new subscription with validation and error handling
   */
  const createSubscription = async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<OperationResult<Subscription>> => {
    try {
      // Validate input data
      const validationResult = createSubscriptionSchema.safeParse(subscriptionData);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        showNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please correct the form errors and try again.',
          duration: 5000
        });

        return {
          success: false,
          errors,
          message: 'Validation failed'
        };
      }

      // Check for duplicate subscription plan names
      const existingSubscription = state.subscriptions.find(
        subscription => subscription.planName.toLowerCase() === subscriptionData.planName.toLowerCase()
      );

      if (existingSubscription) {
        const error = {
          field: 'planName',
          message: 'A subscription plan with this name already exists'
        };

        showNotification({
          type: 'error',
          title: 'Duplicate Plan Name',
          message: 'A subscription plan with this name already exists.',
          duration: 5000
        });

        return {
          success: false,
          errors: [error],
          message: 'Plan name must be unique'
        };
      }

      // Determine initial status based on dates
      const now = new Date();
      let status: 'active' | 'expired' | 'suspended' = 'active';
      
      if (subscriptionData.expiryDate < now) {
        status = 'expired';
      } else if (subscriptionData.startDate > now) {
        // Future subscription - keep as active for now
        status = 'active';
      }

      // Create new subscription with timestamps
      const newSubscription: Subscription = {
        ...validationResult.data,
        id: uuidv4(),
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to state
      dispatch(actionCreators.addSubscription(newSubscription));

      showNotification({
        type: 'success',
        title: 'Subscription Created',
        message: `${newSubscription.planName} plan has been successfully created.`,
        duration: 3000
      });

      return {
        success: true,
        data: newSubscription,
        message: 'Subscription created successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      showNotification({
        type: 'error',
        title: 'Creation Failed',
        message: errorMessage,
        duration: 5000
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  /**
   * Update an existing subscription with validation
   */
  const updateSubscription = async (id: string, updates: Partial<Subscription>): Promise<OperationResult<Subscription>> => {
    try {
      // Find existing subscription
      const existingSubscription = state.subscriptions.find(subscription => subscription.id === id);
      if (!existingSubscription) {
        showNotification({
          type: 'error',
          title: 'Subscription Not Found',
          message: 'The subscription you are trying to update does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Subscription not found'
        };
      }

      // Validate update data
      const validationResult = updateSubscriptionSchema.safeParse(updates);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        showNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please correct the form errors and try again.',
          duration: 5000
        });

        return {
          success: false,
          errors,
          message: 'Validation failed'
        };
      }

      // Check for duplicate subscription plan names (excluding current subscription)
      if (updates.planName) {
        const duplicateSubscription = state.subscriptions.find(
          subscription => subscription.id !== id && 
          subscription.planName.toLowerCase() === updates.planName!.toLowerCase()
        );

        if (duplicateSubscription) {
          const error = {
            field: 'planName',
            message: 'A subscription plan with this name already exists'
          };

          showNotification({
            type: 'error',
            title: 'Duplicate Plan Name',
            message: 'A subscription plan with this name already exists.',
            duration: 5000
          });

          return {
            success: false,
            errors: [error],
            message: 'Plan name must be unique'
          };
        }
      }

      // Auto-update status if dates are being changed
      const finalUpdates: any = { ...validationResult.data };
      if (updates.startDate || updates.expiryDate) {
        const startDate = updates.startDate || existingSubscription.startDate;
        const expiryDate = updates.expiryDate || existingSubscription.expiryDate;
        const now = new Date();
        void startDate; // used for context

        if (expiryDate < now) {
          finalUpdates.status = 'expired';
        } else if (existingSubscription.status === 'expired' && expiryDate >= now) {
          finalUpdates.status = 'active';
        }
      }

      // Update subscription
      dispatch(actionCreators.updateSubscription(id, finalUpdates));

      const updatedSubscription = {
        ...existingSubscription,
        ...finalUpdates,
        updatedAt: new Date()
      };

      showNotification({
        type: 'success',
        title: 'Subscription Updated',
        message: `${updatedSubscription.planName} plan has been successfully updated.`,
        duration: 3000
      });

      return {
        success: true,
        data: updatedSubscription,
        message: 'Subscription updated successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: errorMessage,
        duration: 5000
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  /**
   * Delete a subscription with referential integrity checks
   */
  const deleteSubscription = async (id: string): Promise<OperationResult<void>> => {
    try {
      // Find existing subscription
      const existingSubscription = state.subscriptions.find(subscription => subscription.id === id);
      if (!existingSubscription) {
        showNotification({
          type: 'error',
          title: 'Subscription Not Found',
          message: 'The subscription you are trying to delete does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Subscription not found'
        };
      }

      // Check for dependent company subscriptions
      const dependentCompanySubscriptions = state.companySubscriptions.filter(
        companySubscription => companySubscription.subscriptionId === id
      );

      if (dependentCompanySubscriptions.length > 0) {
        const companyNames = dependentCompanySubscriptions
          .map(cs => state.companies.find(c => c.id === cs.companyId)?.name || 'Unknown')
          .join(', ');

        showNotification({
          type: 'warning',
          title: 'Cannot Delete Subscription',
          message: `Cannot delete subscription because it is assigned to ${dependentCompanySubscriptions.length} company(ies): ${companyNames}. Please remove these assignments first.`,
          duration: 7000
        });

        return {
          success: false,
          message: 'Subscription has dependent company assignments'
        };
      }

      // Delete subscription (this will also cascade delete in the reducer)
      dispatch(actionCreators.deleteSubscription(id));

      showNotification({
        type: 'success',
        title: 'Subscription Deleted',
        message: `${existingSubscription.planName} plan has been successfully deleted.`,
        duration: 3000
      });

      return {
        success: true,
        message: 'Subscription deleted successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      showNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: errorMessage,
        duration: 5000
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  /**
   * Get a specific subscription by ID
   */
  const getSubscription = (id: string): Subscription | undefined => {
    return state.subscriptions.find(subscription => subscription.id === id);
  };

  /**
   * Assign a subscription to a company
   */
  const assignSubscriptionToCompany = async (
    companyId: string, 
    subscriptionId: string, 
    startDate: Date, 
    expiryDate: Date
  ): Promise<OperationResult<CompanySubscription>> => {
    try {
      // Validate assignment data
      const assignmentData = { companyId, subscriptionId, startDate, expiryDate };
      const validationResult = companySubscriptionSchema.safeParse(assignmentData);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        showNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please correct the assignment errors and try again.',
          duration: 5000
        });

        return {
          success: false,
          errors,
          message: 'Validation failed'
        };
      }

      // Verify company exists
      const company = state.companies.find(c => c.id === companyId);
      if (!company) {
        showNotification({
          type: 'error',
          title: 'Company Not Found',
          message: 'The selected company does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Company not found'
        };
      }

      // Verify subscription exists
      const subscription = state.subscriptions.find(s => s.id === subscriptionId);
      if (!subscription) {
        showNotification({
          type: 'error',
          title: 'Subscription Not Found',
          message: 'The selected subscription does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Subscription not found'
        };
      }

      // Check for existing active assignment
      const existingAssignment = state.companySubscriptions.find(
        cs => cs.companyId === companyId && cs.status === 'active'
      );

      if (existingAssignment) {
        showNotification({
          type: 'warning',
          title: 'Active Subscription Exists',
          message: `${company.name} already has an active subscription. Please deactivate it first.`,
          duration: 5000
        });

        return {
          success: false,
          message: 'Company already has an active subscription'
        };
      }

      // Determine status based on dates
      const now = new Date();
      let status: 'active' | 'expired' | 'suspended' = 'active';
      
      if (expiryDate < now) {
        status = 'expired';
      }

      // Create company subscription assignment
      const newAssignment: CompanySubscription = {
        id: uuidv4(),
        companyId,
        subscriptionId,
        startDate,
        expiryDate,
        status,
        assignedAt: new Date()
      };

      // Add to state
      dispatch(actionCreators.addCompanySubscription(newAssignment));

      showNotification({
        type: 'success',
        title: 'Subscription Assigned',
        message: `${subscription.planName} has been successfully assigned to ${company.name}.`,
        duration: 3000
      });

      return {
        success: true,
        data: newAssignment,
        message: 'Subscription assigned successfully'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      showNotification({
        type: 'error',
        title: 'Assignment Failed',
        message: errorMessage,
        duration: 5000
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  /**
   * Get subscriptions by status
   */
  const getSubscriptionsByStatus = (status: 'active' | 'expired' | 'suspended'): Subscription[] => {
    return state.subscriptions.filter(subscription => subscription.status === status);
  };

  /**
   * Get subscriptions by plan type
   */
  const getSubscriptionsByPlanType = (planType: 'monthly' | 'yearly'): Subscription[] => {
    return state.subscriptions.filter(subscription => subscription.planType === planType);
  };

  /**
   * Get company subscriptions for a specific company
   */
  const getCompanySubscriptions = (companyId: string): CompanySubscription[] => {
    return state.companySubscriptions.filter(cs => cs.companyId === companyId);
  };

  /**
   * Search subscriptions by plan name or features
   */
  const searchSubscriptions = (query: string): Subscription[] => {
    if (!query.trim()) return state.subscriptions;
    
    const searchTerm = query.toLowerCase().trim();
    return state.subscriptions.filter(subscription =>
      subscription.planName.toLowerCase().includes(searchTerm) ||
      subscription.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      subscription.currency.toLowerCase().includes(searchTerm)
    );
  };

  /**
   * Get subscription statistics
   */
  const getSubscriptionStats = () => {
    const total = state.subscriptions.length;
    const active = state.subscriptions.filter(s => s.status === 'active').length;
    const expired = state.subscriptions.filter(s => s.status === 'expired').length;
    const suspended = state.subscriptions.filter(s => s.status === 'suspended').length;
    
    const monthly = state.subscriptions.filter(s => s.planType === 'monthly').length;
    const yearly = state.subscriptions.filter(s => s.planType === 'yearly').length;
    
    const assignedToCompanies = state.companySubscriptions.length;
    const activeAssignments = state.companySubscriptions.filter(cs => cs.status === 'active').length;
    
    return {
      total,
      active,
      expired,
      suspended,
      monthly,
      yearly,
      assignedToCompanies,
      activeAssignments
    };
  };

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: SubscriptionContextType = {
    subscriptions: state.subscriptions,
    loading: state.ui.loading,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscription,
    assignSubscriptionToCompany,
    getSubscriptionsByStatus,
    getSubscriptionsByPlanType,
    getCompanySubscriptions,
    searchSubscriptions,
    getSubscriptionStats
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};