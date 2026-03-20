import { describe, it, expect } from 'vitest';
import {
  companySchema,
  adminSchema,
  subscriptionSchema,
  companySubscriptionSchema,
  userSchema,
  validateAdminEmailUniqueness,
  formatValidationErrors,
  validateDateRange,
  isDateExpired
} from '../validation';

describe('Company Schema Validation', () => {
  const validCompanyData = {
    name: 'Test Company',
    email: 'test@company.com',
    phone: '+1234567890',
    address: {
      street: '123 Main Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      postalCode: '12345'
    }
  };

  it('should validate valid company data', () => {
    const result = companySchema.safeParse(validCompanyData);
    expect(result.success).toBe(true);
  });

  it('should reject company with invalid email', () => {
    const invalidData = { ...validCompanyData, email: 'invalid-email' };
    const result = companySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Invalid email address');
    }
  });

  it('should reject company with short name', () => {
    const invalidData = { ...validCompanyData, name: 'A' };
    const result = companySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('at least 2 characters');
    }
  });

  it('should reject company with invalid phone number', () => {
    const invalidData = { ...validCompanyData, phone: '123' };
    const result = companySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('at least 10 digits');
    }
  });

  it('should accept optional GST and tax numbers', () => {
    const dataWithOptionals = {
      ...validCompanyData,
      gstNumber: 'GST123456',
      taxNumber: 'TAX-123456'
    };
    const result = companySchema.safeParse(dataWithOptionals);
    expect(result.success).toBe(true);
  });

  it('should validate logo as base64 or URL', () => {
    const dataWithBase64Logo = {
      ...validCompanyData,
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    };
    const result = companySchema.safeParse(dataWithBase64Logo);
    expect(result.success).toBe(true);

    const dataWithUrlLogo = {
      ...validCompanyData,
      logo: 'https://example.com/logo.png'
    };
    const result2 = companySchema.safeParse(dataWithUrlLogo);
    expect(result2.success).toBe(true);
  });
});

describe('Admin Schema Validation', () => {
  const validAdminData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    companyId: '123e4567-e89b-12d3-a456-426614174000',
    role: 'admin' as const
  };

  it('should validate valid admin data', () => {
    const result = adminSchema.safeParse(validAdminData);
    expect(result.success).toBe(true);
  });

  it('should reject admin with invalid email', () => {
    const invalidData = { ...validAdminData, email: 'invalid-email' };
    const result = adminSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject admin without company assignment', () => {
    const invalidData = { ...validAdminData, companyId: '' };
    const result = adminSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Company assignment is required');
    }
  });

  it('should reject admin with invalid UUID for companyId', () => {
    const invalidData = { ...validAdminData, companyId: 'invalid-uuid' };
    const result = adminSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Invalid company ID format');
    }
  });

  it('should validate admin email uniqueness', () => {
    const existingAdmins = [
      { id: '1', email: 'existing@example.com' },
      { id: '2', email: 'another@example.com' }
    ];

    // Should return false for duplicate email
    expect(validateAdminEmailUniqueness('existing@example.com', existingAdmins)).toBe(false);
    
    // Should return true for unique email
    expect(validateAdminEmailUniqueness('new@example.com', existingAdmins)).toBe(true);
    
    // Should return true when excluding the same admin (for updates)
    expect(validateAdminEmailUniqueness('existing@example.com', existingAdmins, '1')).toBe(true);
  });
});

describe('Subscription Schema Validation', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const validSubscriptionData = {
    planName: 'Basic Plan',
    planType: 'monthly' as const,
    price: 29.99,
    currency: 'USD',
    maxUsers: 10,
    maxModules: 5,
    features: ['Feature 1', 'Feature 2'],
    startDate: tomorrow,
    expiryDate: nextMonth
  };

  it('should validate valid subscription data', () => {
    const result = subscriptionSchema.safeParse(validSubscriptionData);
    expect(result.success).toBe(true);
  });

  it('should reject subscription with expiry date before start date', () => {
    const invalidData = {
      ...validSubscriptionData,
      startDate: nextMonth,
      expiryDate: tomorrow
    };
    const result = subscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Expiry date must be after start date');
    }
  });

  it('should reject subscription with negative price', () => {
    const invalidData = { ...validSubscriptionData, price: -10 };
    const result = subscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Price must be positive');
    }
  });

  it('should reject subscription with invalid plan type', () => {
    const invalidData = { ...validSubscriptionData, planType: 'weekly' as any };
    const result = subscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject subscription with zero max users', () => {
    const invalidData = { ...validSubscriptionData, maxUsers: 0 };
    const result = subscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Must allow at least 1 user');
    }
  });

  it('should reject subscription with empty features array', () => {
    const invalidData = { ...validSubscriptionData, features: [] };
    const result = subscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('At least one feature must be specified');
    }
  });

  it('should validate minimum duration for plan types', () => {
    const shortDuration = new Date();
    shortDuration.setDate(shortDuration.getDate() + 7); // Only 7 days

    const invalidMonthlyData = {
      ...validSubscriptionData,
      startDate: tomorrow,
      expiryDate: shortDuration
    };
    
    const result = subscriptionSchema.safeParse(invalidMonthlyData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('minimum 28 days for monthly');
    }
  });
});

describe('User Schema Validation', () => {
  it('should validate super admin without company assignment', () => {
    const superAdminData = {
      fullName: 'Super Admin',
      email: 'admin@system.com',
      role: 'super_admin' as const
    };
    
    const result = userSchema.safeParse(superAdminData);
    expect(result.success).toBe(true);
  });

  it('should require company assignment for admin users', () => {
    const adminData = {
      fullName: 'Regular Admin',
      email: 'admin@company.com',
      role: 'admin' as const
    };
    
    const result = userSchema.safeParse(adminData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Admin users must be assigned to a company');
    }
  });

  it('should validate admin user with company assignment', () => {
    const adminData = {
      fullName: 'Regular Admin',
      email: 'admin@company.com',
      role: 'admin' as const,
      companyId: '123e4567-e89b-12d3-a456-426614174000'
    };
    
    const result = userSchema.safeParse(adminData);
    expect(result.success).toBe(true);
  });
});

describe('Helper Functions', () => {
  it('should format validation errors correctly', () => {
    const invalidData = { name: '', email: 'invalid' };
    const result = companySchema.safeParse(invalidData);
    
    if (!result.success) {
      const formattedErrors = formatValidationErrors(result.error);
      expect(formattedErrors.length).toBeGreaterThan(0);
      expect(formattedErrors[0]).toHaveProperty('field');
      expect(formattedErrors[0]).toHaveProperty('message');
    }
  });

  it('should validate date ranges correctly', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const invalidEndDate = new Date('2023-12-31');
    
    expect(validateDateRange(startDate, endDate)).toBe(true);
    expect(validateDateRange(startDate, invalidEndDate)).toBe(false);
  });

  it('should check if date is expired', () => {
    const pastDate = new Date('2020-01-01');
    const futureDate = new Date('2030-01-01');
    
    expect(isDateExpired(pastDate)).toBe(true);
    expect(isDateExpired(futureDate)).toBe(false);
  });
});

describe('Company Subscription Schema', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const validCompanySubscriptionData = {
    companyId: '123e4567-e89b-12d3-a456-426614174000',
    subscriptionId: '123e4567-e89b-12d3-a456-426614174001',
    startDate: tomorrow,
    expiryDate: nextMonth
  };

  it('should validate valid company subscription data', () => {
    const result = companySubscriptionSchema.safeParse(validCompanySubscriptionData);
    expect(result.success).toBe(true);
  });

  it('should reject company subscription with invalid UUIDs', () => {
    const invalidData = {
      ...validCompanySubscriptionData,
      companyId: 'invalid-uuid'
    };
    const result = companySubscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject company subscription with expiry before start', () => {
    const invalidData = {
      ...validCompanySubscriptionData,
      startDate: nextMonth,
      expiryDate: tomorrow
    };
    const result = companySubscriptionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Expiry date must be after start date');
    }
  });
});