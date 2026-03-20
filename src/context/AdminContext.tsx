import React, { createContext, useContext } from 'react';
import type { Admin, OperationResult, AdminContextType } from '../types';
import { useApp, useNotifications } from './AppContext';
import { actionCreators } from './AppContext';
import DataPersistenceService from '../services/DataPersistenceService';
import { adminSchema, createAdminSchema, updateAdminSchema, validateAdminEmailUniqueness } from '../schemas/validation';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// ADMIN CONTEXT DEFINITION
// =============================================================================

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// =============================================================================
// ADMIN PROVIDER COMPONENT
// =============================================================================

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();

  // =============================================================================
  // ADMIN CRUD OPERATIONS
  // =============================================================================

  /**
   * Create a new admin with validation and error handling
   */
  const createAdmin = async (adminData: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>): Promise<OperationResult<Admin>> => {
    try {
      // Validate input data
      const validationResult = createAdminSchema.safeParse(adminData);
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

      // Check for duplicate admin emails
      if (!validateAdminEmailUniqueness(adminData.email, state.admins)) {
        const error = {
          field: 'email',
          message: 'An admin with this email address already exists'
        };

        showNotification({
          type: 'error',
          title: 'Duplicate Email',
          message: 'An admin with this email address already exists.',
          duration: 5000
        });

        return {
          success: false,
          errors: [error],
          message: 'Email address must be unique'
        };
      }

      // Verify company exists
      const company = state.companies.find(c => c.id === adminData.companyId);
      if (!company) {
        const error = {
          field: 'companyId',
          message: 'Selected company does not exist'
        };

        showNotification({
          type: 'error',
          title: 'Invalid Company',
          message: 'The selected company does not exist.',
          duration: 5000
        });

        return {
          success: false,
          errors: [error],
          message: 'Invalid company selection'
        };
      }

      // Create new admin with timestamps
      const newAdmin: Admin = {
        ...validationResult.data,
        id: uuidv4(),
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to state
      dispatch(actionCreators.addAdmin(newAdmin));

      showNotification({
        type: 'success',
        title: 'Admin Created',
        message: `${newAdmin.fullName} has been successfully created and assigned to ${company.name}.`,
        duration: 3000
      });

      return {
        success: true,
        data: newAdmin,
        message: 'Admin created successfully'
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
   * Update an existing admin with validation
   */
  const updateAdmin = async (id: string, updates: Partial<Admin>): Promise<OperationResult<Admin>> => {
    try {
      // Find existing admin
      const existingAdmin = state.admins.find(admin => admin.id === id);
      if (!existingAdmin) {
        showNotification({
          type: 'error',
          title: 'Admin Not Found',
          message: 'The admin you are trying to update does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Admin not found'
        };
      }

      // Validate update data
      const validationResult = updateAdminSchema.safeParse(updates);
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

      // Check for duplicate admin emails (excluding current admin)
      if (updates.email && !validateAdminEmailUniqueness(updates.email, state.admins, id)) {
        const error = {
          field: 'email',
          message: 'An admin with this email address already exists'
        };

        showNotification({
          type: 'error',
          title: 'Duplicate Email',
          message: 'An admin with this email address already exists.',
          duration: 5000
        });

        return {
          success: false,
          errors: [error],
          message: 'Email address must be unique'
        };
      }

      // Verify company exists if companyId is being updated
      if (updates.companyId) {
        const company = state.companies.find(c => c.id === updates.companyId);
        if (!company) {
          const error = {
            field: 'companyId',
            message: 'Selected company does not exist'
          };

          showNotification({
            type: 'error',
            title: 'Invalid Company',
            message: 'The selected company does not exist.',
            duration: 5000
          });

          return {
            success: false,
            errors: [error],
            message: 'Invalid company selection'
          };
        }
      }

      // Update admin
      dispatch(actionCreators.updateAdmin(id, validationResult.data));

      const updatedAdmin = {
        ...existingAdmin,
        ...validationResult.data,
        updatedAt: new Date()
      };

      const companyName = state.companies.find(c => c.id === updatedAdmin.companyId)?.name || 'Unknown Company';

      showNotification({
        type: 'success',
        title: 'Admin Updated',
        message: `${updatedAdmin.fullName} has been successfully updated.`,
        duration: 3000
      });

      return {
        success: true,
        data: updatedAdmin,
        message: 'Admin updated successfully'
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
   * Delete an admin
   */
  const deleteAdmin = async (id: string): Promise<OperationResult<void>> => {
    try {
      // Find existing admin
      const existingAdmin = state.admins.find(admin => admin.id === id);
      if (!existingAdmin) {
        showNotification({
          type: 'error',
          title: 'Admin Not Found',
          message: 'The admin you are trying to delete does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Admin not found'
        };
      }

      // Delete admin
      dispatch(actionCreators.deleteAdmin(id));

      showNotification({
        type: 'success',
        title: 'Admin Deleted',
        message: `${existingAdmin.fullName} has been successfully deleted.`,
        duration: 3000
      });

      return {
        success: true,
        message: 'Admin deleted successfully'
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
   * Get a specific admin by ID
   */
  const getAdmin = (id: string): Admin | undefined => {
    return state.admins.find(admin => admin.id === id);
  };

  /**
   * Get admins by company ID
   */
  const getAdminsByCompany = (companyId: string): Admin[] => {
    return state.admins.filter(admin => admin.companyId === companyId);
  };

  /**
   * Get admins by status
   */
  const getAdminsByStatus = (status: 'active' | 'inactive'): Admin[] => {
    return state.admins.filter(admin => admin.status === status);
  };

  /**
   * Toggle admin status between active and inactive
   */
  const toggleAdminStatus = async (id: string): Promise<OperationResult<Admin>> => {
    const admin = getAdmin(id);
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found'
      };
    }

    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    return updateAdmin(id, { status: newStatus });
  };

  /**
   * Search admins by name, email, or company
   */
  const searchAdmins = (query: string): Admin[] => {
    if (!query.trim()) return state.admins;
    
    const searchTerm = query.toLowerCase().trim();
    return state.admins.filter(admin => {
      const company = state.companies.find(c => c.id === admin.companyId);
      return (
        admin.fullName.toLowerCase().includes(searchTerm) ||
        admin.email.toLowerCase().includes(searchTerm) ||
        admin.phone.includes(searchTerm) ||
        (company && company.name.toLowerCase().includes(searchTerm))
      );
    });
  };

  /**
   * Get admin statistics
   */
  const getAdminStats = () => {
    const total = state.admins.length;
    const active = state.admins.filter(a => a.status === 'active').length;
    const inactive = total - active;
    
    const companiesWithAdmins = new Set(state.admins.map(a => a.companyId)).size;
    
    return {
      total,
      active,
      inactive,
      companiesWithAdmins
    };
  };

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: AdminContextType = {
    admins: state.admins,
    loading: state.ui.loading,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin,
    getAdminsByCompany,
    getAdminsByStatus,
    toggleAdminStatus,
    searchAdmins,
    getAdminStats
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};