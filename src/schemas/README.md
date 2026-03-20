# Validation Schemas

This directory contains comprehensive Zod validation schemas for the Admin Dashboard UI application. These schemas enforce business rules, data integrity, and form validation requirements as specified in the design document.

## Overview

The validation schemas provide:
- **Type-safe validation** using Zod for runtime type checking
- **Business rule enforcement** including date validation, uniqueness constraints, and field requirements
- **Form validation support** with real-time feedback and error handling
- **Comprehensive error messages** for user-friendly feedback
- **Flexible schema composition** for create/update operations

## Schema Files

### `validation.ts`
Main validation schemas for all entities:
- `companySchema` - Complete company validation with address, contact info, and optional fields
- `adminSchema` - Admin user validation with company assignment requirements
- `subscriptionSchema` - Subscription plan validation with date logic and pricing rules
- `companySubscriptionSchema` - Company-subscription assignment validation
- `userSchema` - User validation with role-based requirements

### `index.ts`
Barrel export file providing clean imports for all schemas and utilities.

### `examples.ts`
Comprehensive examples showing how to use the schemas in real applications.

### `__tests__/validation.test.ts`
Complete test suite validating all schemas and edge cases.

## Key Features

### 1. Company Validation
```typescript
import { companySchema } from '@/schemas';

const companyData = {
  name: 'Acme Corp',
  email: 'contact@acme.com',
  phone: '+1-555-123-4567',
  address: {
    street: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001'
  }
};

const result = companySchema.safeParse(companyData);
```

**Validation Rules:**
- Company name: 2-100 characters
- Email: Valid email format, max 255 characters
- Phone: 10-20 characters, valid phone format
- Address: All fields required with length limits
- GST/Tax numbers: Optional, alphanumeric only
- Logo: Optional, must be valid base64 image or URL

### 2. Admin Validation
```typescript
import { adminSchema, validateAdminEmailUniqueness } from '@/schemas';

const adminData = {
  fullName: 'John Smith',
  email: 'john@company.com',
  phone: '+1-555-234-5678',
  companyId: '123e4567-e89b-12d3-a456-426614174000',
  role: 'admin'
};

// Basic validation
const result = adminSchema.safeParse(adminData);

// Email uniqueness check
const isUnique = validateAdminEmailUniqueness(
  adminData.email, 
  existingAdmins, 
  excludeId
);
```

**Validation Rules:**
- Full name: 2-100 characters, letters/spaces/hyphens only
- Email: Valid format, max 255 characters, must be unique
- Phone: 10-20 characters, valid phone format
- Company ID: Required, must be valid UUID
- Role: Must be 'admin'

### 3. Subscription Validation
```typescript
import { subscriptionSchema } from '@/schemas';

const subscriptionData = {
  planName: 'Basic Plan',
  planType: 'monthly',
  price: 29.99,
  currency: 'USD',
  maxUsers: 10,
  maxModules: 5,
  features: ['User Management', 'Reporting'],
  startDate: new Date('2024-02-01'),
  expiryDate: new Date('2024-03-01')
};

const result = subscriptionSchema.safeParse(subscriptionData);
```

**Validation Rules:**
- Plan name: 2-100 characters
- Plan type: 'monthly' or 'yearly'
- Price: Positive number, max 2 decimal places
- Currency: 3-letter uppercase code (default: USD)
- Max users/modules: Positive integers with limits
- Features: Array of 1-50 feature names
- Dates: Expiry after start, minimum duration based on plan type
- Start date: Cannot be in the past

### 4. Form Integration

#### Real-time Validation
```typescript
import { formatValidationErrors } from '@/schemas';

const handleFieldChange = (fieldName: string, value: any) => {
  const result = companySchema.safeParse({ [fieldName]: value });
  
  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    setFieldError(fieldName, errors[0]?.message);
  } else {
    clearFieldError(fieldName);
  }
};
```

#### Form Submission
```typescript
const handleSubmit = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const result = createCompanySchema.safeParse(data);
  
  if (result.success) {
    await createCompany(result.data);
    showSuccessMessage('Company created successfully');
  } else {
    const errors = formatValidationErrors(result.error);
    displayValidationErrors(errors);
  }
};
```

## Schema Composition

### Create vs Update Schemas
- **Create schemas** (`createCompanySchema`): Full validation for new entities
- **Update schemas** (`updateCompanySchema`): Partial validation for updates
- **Base schemas**: Core validation rules without refinements

### Validation Refinements
Complex business rules implemented as schema refinements:
- Date range validation (expiry after start)
- Minimum subscription duration based on plan type
- Start date not in the past
- Role-based company assignment requirements

## Error Handling

### Formatted Error Messages
```typescript
import { formatValidationErrors } from '@/schemas';

const errors = formatValidationErrors(zodError);
// Returns: [{ field: 'email', message: 'Invalid email address' }]
```

### Field-Level Validation
```typescript
const validateField = (fieldName: string, value: any, schema: ZodSchema) => {
  try {
    schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    const errors = formatValidationErrors(error);
    return { isValid: false, error: errors[0]?.message };
  }
};
```

## Utility Functions

### Date Validation
```typescript
import { validateDateRange, isDateExpired } from '@/schemas';

const isValidRange = validateDateRange(startDate, endDate);
const hasExpired = isDateExpired(expiryDate);
```

### Status Validation
```typescript
import { validateStatus } from '@/schemas';

const isValidStatus = validateStatus(status, ['active', 'inactive']);
```

### Batch Validation
```typescript
import { validationUtils } from '@/schemas/examples';

const { valid, invalid } = validationUtils.batchValidate(
  items, 
  companySchema
);
```

## Testing

Run the validation tests:
```bash
npm test src/schemas/__tests__/validation.test.ts
```

The test suite covers:
- Valid data scenarios for all schemas
- Invalid data rejection with proper error messages
- Edge cases and boundary conditions
- Business rule enforcement
- Helper function behavior

## Requirements Validation

These schemas validate the following requirements from the design document:

- **Requirements 1.7, 4.7, 7.7**: Form validation enforcement
- **Requirements 2.1-2.11**: Company data structure validation
- **Requirements 5.1-5.7**: Admin data structure validation
- **Requirements 8.1-8.8**: Subscription data structure validation
- **Requirements 11.6**: Real-time validation feedback
- **Property 4**: Data Structure Validation
- **Property 17**: Form Validation Enforcement

## Integration with Components

These schemas are designed to integrate seamlessly with:
- React Hook Form for form management
- Custom form components with validation display
- Data table filtering and search
- API request/response validation
- LocalStorage data persistence

## Best Practices

1. **Always use `safeParse()`** for user input validation
2. **Format errors** using `formatValidationErrors()` for consistent display
3. **Validate uniqueness** separately for email addresses
4. **Use partial schemas** for update operations
5. **Implement real-time validation** for better user experience
6. **Handle validation errors gracefully** with user-friendly messages
7. **Test edge cases** thoroughly with the provided test suite