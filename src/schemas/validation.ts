import { z } from 'zod';

// =============================================================================
// COMPANY VALIDATION SCHEMA
// =============================================================================

export const companySchema = z.object({
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters')
    .trim(),
  
  logo: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Check if it's a valid base64 image or URL
      const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
      const urlRegex = /^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i;
      return base64Regex.test(val) || urlRegex.test(val);
    }, 'Logo must be a valid image URL or base64 encoded image'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone number contains invalid characters')
    .trim(),
  
  address: z.object({
    street: z.string()
      .min(5, 'Street address must be at least 5 characters')
      .max(200, 'Street address must not exceed 200 characters')
      .trim(),
    
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must not exceed 100 characters')
      .trim(),
    
    state: z.string()
      .min(2, 'State must be at least 2 characters')
      .max(100, 'State must not exceed 100 characters')
      .trim(),
    
    country: z.string()
      .min(2, 'Country must be at least 2 characters')
      .max(100, 'Country must not exceed 100 characters')
      .trim(),
    
    postalCode: z.string()
      .min(3, 'Postal code must be at least 3 characters')
      .max(20, 'Postal code must not exceed 20 characters')
      .regex(/^[A-Za-z0-9\s\-]+$/, 'Postal code contains invalid characters')
      .trim()
  }),
  
  gstNumber: z.string()
    .max(50, 'GST number must not exceed 50 characters')
    .regex(/^[A-Za-z0-9]+$/, 'GST number must contain only alphanumeric characters')
    .optional()
    .or(z.literal('')),
  
  taxNumber: z.string()
    .max(50, 'Tax number must not exceed 50 characters')
    .regex(/^[A-Za-z0-9\-]+$/, 'Tax number must contain only alphanumeric characters and hyphens')
    .optional()
    .or(z.literal(''))
});

// Schema for creating a new company (without id, createdAt, updatedAt)
export const createCompanySchema = companySchema;

// Schema for updating a company (all fields optional except validation rules still apply)
export const updateCompanySchema = companySchema.partial();

// =============================================================================
// ADMIN VALIDATION SCHEMA
// =============================================================================

export const adminSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[A-Za-z\s\-\.\']+$/, 'Full name must contain only letters, spaces, hyphens, dots, and apostrophes')
    .trim(),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone number contains invalid characters')
    .trim(),
  
  companyId: z.string()
    .min(1, 'Company assignment is required')
    .uuid('Invalid company ID format'),
  
  role: z.literal('admin', {
    errorMap: () => ({ message: 'Role must be admin' })
  })
});

// Schema for creating a new admin (without id, createdAt, updatedAt, status)
export const createAdminSchema = adminSchema;

// Schema for updating an admin (all fields optional except validation rules still apply)
export const updateAdminSchema = adminSchema.partial();

// Custom validation function for admin email uniqueness
export const validateAdminEmailUniqueness = (
  email: string, 
  existingAdmins: Array<{ id: string; email: string }>, 
  excludeId?: string
): boolean => {
  return !existingAdmins.some(admin => 
    admin.email.toLowerCase() === email.toLowerCase() && 
    admin.id !== excludeId
  );
};

// =============================================================================
// SUBSCRIPTION VALIDATION SCHEMA
// =============================================================================

// Base subscription schema without refinements for partial updates
const baseSubscriptionSchema = z.object({
  planName: z.string()
    .min(2, 'Plan name must be at least 2 characters')
    .max(100, 'Plan name must not exceed 100 characters')
    .trim(),
  
  planType: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Plan type must be either monthly or yearly' })
  }),
  
  price: z.number()
    .min(0, 'Price must be positive')
    .max(999999.99, 'Price must not exceed 999,999.99')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  
  currency: z.string()
    .length(3, 'Currency must be a 3-letter code (e.g., USD, EUR)')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase 3-letter code')
    .default('USD'),
  
  maxUsers: z.number()
    .int('Maximum users must be a whole number')
    .min(1, 'Must allow at least 1 user')
    .max(10000, 'Maximum users cannot exceed 10,000'),
  
  maxModules: z.number()
    .int('Maximum modules must be a whole number')
    .min(1, 'Must allow at least 1 module')
    .max(100, 'Maximum modules cannot exceed 100'),
  
  features: z.array(z.string().min(1, 'Feature name cannot be empty'))
    .min(1, 'At least one feature must be specified')
    .max(50, 'Cannot have more than 50 features'),
  
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date'
  }),
  
  expiryDate: z.date({
    required_error: 'Expiry date is required',
    invalid_type_error: 'Expiry date must be a valid date'
  })
});

export const subscriptionSchema = baseSubscriptionSchema.refine(data => data.expiryDate > data.startDate, {
  message: 'Expiry date must be after start date',
  path: ['expiryDate']
}).refine(data => {
  // Ensure start date is not in the past (allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.startDate >= today;
}, {
  message: 'Start date cannot be in the past',
  path: ['startDate']
}).refine(data => {
  // Ensure minimum subscription duration based on plan type
  const diffTime = data.expiryDate.getTime() - data.startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (data.planType === 'monthly') {
    return diffDays >= 28; // Minimum 28 days for monthly
  } else {
    return diffDays >= 365; // Minimum 365 days for yearly
  }
}, {
  message: 'Subscription duration must match plan type (minimum 28 days for monthly, 365 days for yearly)',
  path: ['expiryDate']
});

// Schema for creating a new subscription (without id, createdAt, updatedAt, status)
export const createSubscriptionSchema = subscriptionSchema;

// Schema for updating a subscription (all fields optional except validation rules still apply)
export const updateSubscriptionSchema = baseSubscriptionSchema.partial();

// =============================================================================
// COMPANY SUBSCRIPTION ASSIGNMENT SCHEMA
// =============================================================================

export const companySubscriptionSchema = z.object({
  companyId: z.string()
    .min(1, 'Company selection is required')
    .uuid('Invalid company ID format'),
  
  subscriptionId: z.string()
    .min(1, 'Subscription plan selection is required')
    .uuid('Invalid subscription ID format'),
  
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date'
  }),
  
  expiryDate: z.date({
    required_error: 'Expiry date is required',
    invalid_type_error: 'Expiry date must be a valid date'
  })
}).refine(data => data.expiryDate > data.startDate, {
  message: 'Expiry date must be after start date',
  path: ['expiryDate']
});

// =============================================================================
// USER VALIDATION SCHEMAS
// =============================================================================

export const userSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[A-Za-z\s\-\.\']+$/, 'Full name must contain only letters, spaces, hyphens, dots, and apostrophes')
    .trim(),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  role: z.enum(['super_admin', 'admin'], {
    errorMap: () => ({ message: 'Role must be either super_admin or admin' })
  }),
  
  companyId: z.string()
    .uuid('Invalid company ID format')
    .optional()
}).refine(data => {
  // Admin users must have a companyId
  if (data.role === 'admin') {
    return !!data.companyId;
  }
  return true;
}, {
  message: 'Admin users must be assigned to a company',
  path: ['companyId']
});

// =============================================================================
// FORM VALIDATION HELPERS
// =============================================================================

// Helper function to validate status fields
export const validateStatus = (status: string, validStatuses: string[]) => {
  return validStatuses.includes(status);
};

// Helper function to format validation errors for display
export const formatValidationErrors = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
};

// Helper function to validate date ranges
export const validateDateRange = (startDate: Date, endDate: Date) => {
  return endDate > startDate;
};

// Helper function to check if a date is expired
export const isDateExpired = (date: Date) => {
  return date < new Date();
};

// =============================================================================
// SEARCH AND FILTER VALIDATION
// =============================================================================

export const searchQuerySchema = z.string()
  .max(100, 'Search query must not exceed 100 characters')
  .trim();

export const filterSchema = z.object({
  status: z.enum(['active', 'inactive', 'expired', 'suspended']).optional(),
  planType: z.enum(['monthly', 'yearly']).optional(),
  companyId: z.string().uuid().optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional()
  }).optional()
}).refine(data => {
  if (data.dateRange?.start && data.dateRange?.end) {
    return data.dateRange.end >= data.dateRange.start;
  }
  return true;
}, {
  message: 'End date must be after or equal to start date',
  path: ['dateRange', 'end']
});

// =============================================================================
// EXPORT TYPES FOR TYPESCRIPT INFERENCE
// =============================================================================

export type CompanyFormData = z.infer<typeof companySchema>;
export type CreateCompanyData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

export type AdminFormData = z.infer<typeof adminSchema>;
export type CreateAdminData = z.infer<typeof createAdminSchema>;
export type UpdateAdminData = z.infer<typeof updateAdminSchema>;

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionData = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionData = z.infer<typeof updateSubscriptionSchema>;

export type CompanySubscriptionFormData = z.infer<typeof companySubscriptionSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type FilterData = z.infer<typeof filterSchema>;