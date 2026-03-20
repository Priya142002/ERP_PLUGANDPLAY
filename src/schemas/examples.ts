/**
 * Examples demonstrating how to use the Zod validation schemas
 * for the admin dashboard UI components.
 */

import {
  companySchema,
  adminSchema,
  updateAdminSchema,
  subscriptionSchema,
  validateAdminEmailUniqueness,
  formatValidationErrors,
  validateDateRange,
  isDateExpired,
  type CompanyFormData,
  type AdminFormData,
  type SubscriptionFormData
} from './validation';

// =============================================================================
// COMPANY VALIDATION EXAMPLES
// =============================================================================

export const companyExamples = {
  // Valid company data
  validCompany: {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-123-4567',
    address: {
      street: '123 Business Avenue',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10001'
    },
    gstNumber: 'GST123456789',
    taxNumber: 'TAX-987654321'
  } as CompanyFormData,

  // Company with logo
  companyWithLogo: {
    name: 'Tech Solutions Inc',
    email: 'info@techsolutions.com',
    phone: '+1-555-987-6543',
    address: {
      street: '456 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      postalCode: '94105'
    },
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  } as CompanyFormData,

  // Validate company data
  validateCompany: (data: unknown) => {
    const result = companySchema.safeParse(data);
    if (result.success) {
      console.log('✅ Company data is valid:', result.data);
      return result.data;
    } else {
      console.log('❌ Company validation failed:');
      const errors = formatValidationErrors(result.error);
      errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
      });
      return null;
    }
  }
};

// =============================================================================
// ADMIN VALIDATION EXAMPLES
// =============================================================================

export const adminExamples = {
  // Valid admin data
  validAdmin: {
    fullName: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1-555-234-5678',
    companyId: '123e4567-e89b-12d3-a456-426614174000',
    role: 'admin' as const
  } as AdminFormData,

  // Validate admin data with email uniqueness check
  validateAdmin: (data: unknown, existingAdmins: Array<{ id: string; email: string }> = []) => {
    const result = adminSchema.safeParse(data);
    if (!result.success) {
      console.log('❌ Admin validation failed:');
      const errors = formatValidationErrors(result.error);
      errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
      });
      return null;
    }

    // Check email uniqueness
    if (!validateAdminEmailUniqueness(result.data.email, existingAdmins)) {
      console.log('❌ Admin email already exists');
      return null;
    }

    console.log('✅ Admin data is valid:', result.data);
    return result.data;
  },

  // Example of updating admin (excluding current admin from uniqueness check)
  updateAdmin: (
    adminId: string,
    updateData: unknown,
    existingAdmins: Array<{ id: string; email: string }> = []
  ) => {
    const result = updateAdminSchema.safeParse(updateData);
    if (!result.success) {
      console.log('❌ Admin update validation failed:');
      const errors = formatValidationErrors(result.error);
      errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
      });
      return null;
    }

    // Check email uniqueness if email is being updated
    if (result.data.email && !validateAdminEmailUniqueness(result.data.email, existingAdmins, adminId)) {
      console.log('❌ Admin email already exists');
      return null;
    }

    console.log('✅ Admin update data is valid:', result.data);
    return result.data;
  }
};

// =============================================================================
// SUBSCRIPTION VALIDATION EXAMPLES
// =============================================================================

export const subscriptionExamples = {
  // Valid monthly subscription
  monthlySubscription: {
    planName: 'Basic Monthly Plan',
    planType: 'monthly' as const,
    price: 29.99,
    currency: 'USD',
    maxUsers: 10,
    maxModules: 5,
    features: ['User Management', 'Basic Reporting', 'Email Support'],
    startDate: new Date('2024-02-01'),
    expiryDate: new Date('2024-03-01')
  } as SubscriptionFormData,

  // Valid yearly subscription
  yearlySubscription: {
    planName: 'Professional Yearly Plan',
    planType: 'yearly' as const,
    price: 299.99,
    currency: 'USD',
    maxUsers: 100,
    maxModules: 20,
    features: [
      'Advanced User Management',
      'Comprehensive Reporting',
      'Priority Support',
      'API Access',
      'Custom Integrations'
    ],
    startDate: new Date('2024-01-01'),
    expiryDate: new Date('2025-01-01')
  } as SubscriptionFormData,

  // Validate subscription data
  validateSubscription: (data: unknown) => {
    const result = subscriptionSchema.safeParse(data);
    if (result.success) {
      console.log('✅ Subscription data is valid:', result.data);
      
      // Additional business logic checks
      if (isDateExpired(result.data.expiryDate)) {
        console.log('⚠️  Warning: Subscription expiry date is in the past');
      }
      
      return result.data;
    } else {
      console.log('❌ Subscription validation failed:');
      const errors = formatValidationErrors(result.error);
      errors.forEach(error => {
        console.log(`  - ${error.field}: ${error.message}`);
      });
      return null;
    }
  },

  // Check if subscription is expired
  checkSubscriptionStatus: (subscription: SubscriptionFormData) => {
    const now = new Date();
    if (isDateExpired(subscription.expiryDate)) {
      return 'expired';
    } else if (subscription.startDate > now) {
      return 'pending';
    } else {
      return 'active';
    }
  }
};

// =============================================================================
// FORM INTEGRATION EXAMPLES
// =============================================================================

export const formIntegrationExamples = {
  // Example React form handler for company creation
  handleCompanySubmit: async (formData: unknown) => {
    try {
      // Validate the form data
      const validatedData = companySchema.parse(formData);
      
      // Add timestamps and ID (would typically be done by backend/service layer)
      const companyData = {
        ...validatedData,
        id: crypto.randomUUID(),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating company:', companyData);
      // Here you would typically call your data service
      // await companyService.create(companyData);
      
      return { success: true, data: companyData };
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = formatValidationErrors(error as any);
        return { success: false, errors: validationErrors };
      }
      return { success: false, message: 'Unknown error occurred' };
    }
  },

  // Example form validation for real-time feedback
  validateField: (fieldName: string, value: unknown, schema: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = schema.pick({ [fieldName]: true });
      fieldSchema.parse({ [fieldName]: value });
      return { isValid: true, error: null };
    } catch (error) {
      const errors = formatValidationErrors(error as any);
      return { 
        isValid: false, 
        error: errors.find(e => e.field === fieldName)?.message || 'Invalid value'
      };
    }
  }
};

// =============================================================================
// UTILITY FUNCTIONS FOR COMMON VALIDATION SCENARIOS
// =============================================================================

export const validationUtils = {
  // Validate date ranges for subscriptions
  validateSubscriptionDates: (startDate: Date, expiryDate: Date, planType: 'monthly' | 'yearly') => {
    if (!validateDateRange(startDate, expiryDate)) {
      return { isValid: false, message: 'Expiry date must be after start date' };
    }

    const diffTime = expiryDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const minDays = planType === 'monthly' ? 28 : 365;
    if (diffDays < minDays) {
      return { 
        isValid: false, 
        message: `${planType} plans require minimum ${minDays} days duration` 
      };
    }

    return { isValid: true, message: 'Date range is valid' };
  },

  // Batch validate multiple entities
  batchValidate: <T>(items: unknown[], schema: any): { valid: T[], invalid: Array<{ item: unknown, errors: any[] }> } => {
    const valid: T[] = [];
    const invalid: Array<{ item: unknown, errors: any[] }> = [];

    items.forEach(item => {
      const result = schema.safeParse(item);
      if (result.success) {
        valid.push(result.data);
      } else {
        invalid.push({
          item,
          errors: formatValidationErrors(result.error)
        });
      }
    });

    return { valid, invalid };
  },

  // Generate validation summary
  getValidationSummary: (errors: Array<{ field: string; message: string }>) => {
    const fieldCount = new Set(errors.map(e => e.field)).size;
    return {
      totalErrors: errors.length,
      fieldsWithErrors: fieldCount,
      errorsByField: errors.reduce((acc, error) => {
        if (!acc[error.field]) acc[error.field] = [];
        acc[error.field].push(error.message);
        return acc;
      }, {} as Record<string, string[]>)
    };
  }
};

// =============================================================================
// EXAMPLE USAGE IN COMPONENTS
// =============================================================================

export const componentExamples = {
  // Example usage in a React component
  exampleReactComponent: `
    import { companySchema, formatValidationErrors } from '@/schemas';
    import { useState } from 'react';

    function CompanyForm() {
      const [errors, setErrors] = useState<Record<string, string>>({});
      
      const handleSubmit = (formData: FormData) => {
        const data = Object.fromEntries(formData);
        const result = companySchema.safeParse(data);
        
        if (result.success) {
          // Submit valid data
          onSubmit(result.data);
          setErrors({});
        } else {
          // Display validation errors
          const validationErrors = formatValidationErrors(result.error);
          const errorMap = validationErrors.reduce((acc, error) => {
            acc[error.field] = error.message;
            return acc;
          }, {} as Record<string, string>);
          setErrors(errorMap);
        }
      };
      
      return (
        <form onSubmit={handleSubmit}>
          <input name="name" />
          {errors.name && <span className="error">{errors.name}</span>}
          
          <input name="email" type="email" />
          {errors.email && <span className="error">{errors.email}</span>}
          
          <button type="submit">Create Company</button>
        </form>
      );
    }
  `
};