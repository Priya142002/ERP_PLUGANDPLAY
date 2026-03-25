import React, { createContext, useContext } from 'react';
import type { Company, OperationResult, CompanyContextType } from '../types';
import { useApp, useNotifications } from './AppContext';
import { actionCreators } from './AppContext';
import DataPersistenceService from '../services/DataPersistenceService';
import { companySchema, createCompanySchema, updateCompanySchema } from '../schemas/validation';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// COMPANY CONTEXT DEFINITION
// =============================================================================

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// =============================================================================
// COMPANY PROVIDER COMPONENT
// =============================================================================

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();

  // =============================================================================
  // COMPANY CRUD OPERATIONS
  // =============================================================================

  /**
   * Create a new company with validation and error handling
   */
  const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<OperationResult<Company>> => {
    try {
      // Validate input data
      const validationResult = createCompanySchema.safeParse(companyData);
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

      // Check for duplicate company names
      const existingCompany = state.companies.find(
        company => company.name.toLowerCase() === companyData.name.toLowerCase()
      );

      if (existingCompany) {
        const error = {
          field: 'name',
          message: 'A company with this name already exists'
        };

        showNotification({
          type: 'error',
          title: 'Duplicate Company',
          message: 'A company with this name already exists.',
          duration: 5000
        });

        return {
          success: false,
          errors: [error],
          message: 'Company name must be unique'
        };
      }

      // Create new company with timestamps
      const newCompany: Company = {
        code: '',
        companyType: 'private_limited',
        industry: '',
        ...validationResult.data,
        id: uuidv4(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to state
      dispatch(actionCreators.addCompany(newCompany));

      showNotification({
        type: 'success',
        title: 'Company Created',
        message: `${newCompany.name} has been successfully created.`,
        duration: 3000
      });

      return {
        success: true,
        data: newCompany,
        message: 'Company created successfully'
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
   * Update an existing company with validation
   */
  const updateCompany = async (id: string, updates: Partial<Company>): Promise<OperationResult<Company>> => {
    try {
      // Find existing company
      const existingCompany = state.companies.find(company => company.id === id);
      if (!existingCompany) {
        showNotification({
          type: 'error',
          title: 'Company Not Found',
          message: 'The company you are trying to update does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Company not found'
        };
      }

      // Validate update data
      const validationResult = updateCompanySchema.safeParse(updates);
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

      // Check for duplicate company names (excluding current company)
      if (updates.name) {
        const duplicateCompany = state.companies.find(
          company => company.id !== id && 
          company.name.toLowerCase() === updates.name!.toLowerCase()
        );

        if (duplicateCompany) {
          const error = {
            field: 'name',
            message: 'A company with this name already exists'
          };

          showNotification({
            type: 'error',
            title: 'Duplicate Company',
            message: 'A company with this name already exists.',
            duration: 5000
          });

          return {
            success: false,
            errors: [error],
            message: 'Company name must be unique'
          };
        }
      }

      // Update company
      dispatch(actionCreators.updateCompany(id, validationResult.data));

      const updatedCompany = {
        ...existingCompany,
        ...validationResult.data,
        updatedAt: new Date()
      };

      showNotification({
        type: 'success',
        title: 'Company Updated',
        message: `${updatedCompany.name} has been successfully updated.`,
        duration: 3000
      });

      return {
        success: true,
        data: updatedCompany,
        message: 'Company updated successfully'
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
   * Delete a company with referential integrity checks
   */
  const deleteCompany = async (id: string): Promise<OperationResult<void>> => {
    try {
      // Find existing company
      const existingCompany = state.companies.find(company => company.id === id);
      if (!existingCompany) {
        showNotification({
          type: 'error',
          title: 'Company Not Found',
          message: 'The company you are trying to delete does not exist.',
          duration: 5000
        });

        return {
          success: false,
          message: 'Company not found'
        };
      }

      // Check for dependent records
      const dependentAdmins = state.admins.filter(admin => admin.companyId === id);
      const dependentSubscriptions = state.companySubscriptions.filter(
        subscription => subscription.companyId === id
      );

      if (dependentAdmins.length > 0 || dependentSubscriptions.length > 0) {
        let message = 'Cannot delete company because it has ';
        const dependencies = [];
        
        if (dependentAdmins.length > 0) {
          dependencies.push(`${dependentAdmins.length} admin(s)`);
        }
        if (dependentSubscriptions.length > 0) {
          dependencies.push(`${dependentSubscriptions.length} subscription(s)`);
        }
        
        message += dependencies.join(' and ') + '. Please remove these first.';

        showNotification({
          type: 'warning',
          title: 'Cannot Delete Company',
          message,
          duration: 7000
        });

        return {
          success: false,
          message: 'Company has dependent records'
        };
      }

      // Delete company (this will also cascade delete in the reducer)
      dispatch(actionCreators.deleteCompany(id));

      showNotification({
        type: 'success',
        title: 'Company Deleted',
        message: `${existingCompany.name} has been successfully deleted.`,
        duration: 3000
      });

      return {
        success: true,
        message: 'Company deleted successfully'
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
   * Get a specific company by ID
   */
  const getCompany = (id: string): Company | undefined => {
    return state.companies.find(company => company.id === id);
  };

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: CompanyContextType = {
    companies: state.companies,
    loading: state.ui.loading,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};