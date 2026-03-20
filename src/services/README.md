# DataPersistenceService

A comprehensive browser-based data persistence service for the Admin Dashboard UI. This service provides robust LocalStorage management with error handling, data validation, backup/restore capabilities, and automatic fallback to in-memory storage.

## Features

### Core Functionality
- **Generic CRUD Operations**: Create, Read, Update, Delete operations for all entity types
- **Type-Safe**: Full TypeScript support with generic type parameters
- **Date Handling**: Automatic serialization/deserialization of Date objects
- **Error Recovery**: Comprehensive error handling with automatic retry mechanisms
- **Data Integrity**: Backup creation and verification for all operations

### Storage Management
- **LocalStorage Primary**: Uses browser LocalStorage as the primary storage mechanism
- **Memory Fallback**: Automatically switches to in-memory storage if LocalStorage is unavailable
- **Quota Management**: Handles storage quota exceeded scenarios gracefully
- **Data Cleanup**: Automatic cleanup of old backup data to free storage space

### Data Export/Import
- **Full Export**: Export all application data as JSON for backup or integration
- **Selective Import**: Import data with validation and error recovery
- **Version Control**: Export includes version information and timestamps
- **Data Validation**: Validates imported data structure and integrity

### Error Handling
- **Custom Error Types**: Specific error types for different failure scenarios
- **Automatic Retry**: Retry logic for transient failures
- **Graceful Degradation**: Falls back to alternative storage methods when needed
- **User-Friendly Messages**: Clear error messages for debugging and user feedback

## Usage

### Basic Operations

```typescript
import DataPersistenceService from './services/DataPersistenceService';
import type { Company } from './types';

// Create a new company
const company: Company = {
  id: 'company-1',
  name: 'Acme Corp',
  email: 'contact@acme.com',
  // ... other fields
};

// Add the company
const addResult = DataPersistenceService.add('admin-dashboard-companies', company);
if (addResult.success) {
  console.log('Company added:', addResult.data);
} else {
  console.error('Failed to add company:', addResult.error);
}

// Load all companies
const loadResult = DataPersistenceService.load<Company[]>('admin-dashboard-companies');
if (loadResult.success) {
  console.log('Companies:', loadResult.data);
}

// Update a company
const updateResult = DataPersistenceService.update('admin-dashboard-companies', 'company-1', {
  name: 'Acme Corporation'
});

// Get a specific company
const getResult = DataPersistenceService.getById<Company>('admin-dashboard-companies', 'company-1');

// Delete a company
const deleteResult = DataPersistenceService.delete('admin-dashboard-companies', 'company-1');
```

### Bulk Operations

```typescript
// Save multiple companies at once
const companies: Company[] = [company1, company2, company3];
const saveResult = DataPersistenceService.save('admin-dashboard-companies', companies);
```

### Data Export/Import

```typescript
// Export all data
const exportResult = DataPersistenceService.exportData();
if (exportResult.success) {
  const jsonData = exportResult.data;
  // Save to file or send to server
}

// Import data
const importResult = DataPersistenceService.importData(jsonData);
if (importResult.success) {
  console.log('Data imported successfully');
}

// Clear all data
const clearResult = DataPersistenceService.clearAllData();
```

### Storage Information

```typescript
// Get storage status and usage
const storageInfo = DataPersistenceService.getStorageInfo();
console.log('Storage available:', storageInfo.isAvailable);
console.log('Using fallback:', storageInfo.isUsingFallback);
console.log('Estimated usage:', storageInfo.estimatedUsage, 'bytes');
console.log('Quota exceeded:', storageInfo.quotaExceeded);

// Clean up old data
const cleanupResult = DataPersistenceService.cleanupOldData(30); // Keep 30 days
console.log('Cleaned up items:', cleanupResult.data);
```

## Error Handling

The service provides specific error types for different scenarios:

```typescript
import { 
  StorageError, 
  StorageQuotaError, 
  StorageAccessError, 
  DataCorruptionError 
} from './services/DataPersistenceService';

const result = DataPersistenceService.add('admin-dashboard-companies', company);
if (!result.success) {
  if (result.error instanceof StorageQuotaError) {
    // Handle storage quota exceeded
    console.log('Storage full, please clear some data');
  } else if (result.error instanceof StorageAccessError) {
    // Handle storage access denied
    console.log('Storage access denied, using memory fallback');
  } else if (result.error instanceof DataCorruptionError) {
    // Handle data corruption
    console.log('Data corruption detected, restored from backup');
  } else {
    // Handle general storage error
    console.log('Storage error:', result.error.message);
  }
}
```

## Storage Schema

The service uses a predefined schema for LocalStorage keys:

```typescript
interface LocalStorageSchema {
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
```

## Return Types

All operations return a `StorageOperationResult<T>` object:

```typescript
interface StorageOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: StorageError;
  fallbackUsed?: boolean;
}
```

## Best Practices

1. **Always Check Results**: Check the `success` property before using `data`
2. **Handle Errors Gracefully**: Provide user-friendly error messages
3. **Use Type Parameters**: Specify types for better TypeScript support
4. **Regular Cleanup**: Periodically clean up old data to manage storage usage
5. **Export Regularly**: Create regular data exports for backup purposes

## Testing

The service includes comprehensive unit and integration tests:

```bash
# Run all DataPersistenceService tests
npm test -- DataPersistenceService

# Run unit tests only
npm test -- DataPersistenceService.test

# Run integration tests only
npm test -- DataPersistenceService.integration
```

## Examples

See `DataPersistenceService.example.ts` for comprehensive usage examples and demonstrations of all features.

## Architecture

The service follows these design principles:

- **Single Responsibility**: Focused solely on data persistence
- **Error Recovery**: Multiple layers of error handling and recovery
- **Type Safety**: Full TypeScript support with generic operations
- **Performance**: Efficient serialization and minimal memory usage
- **Reliability**: Backup and verification mechanisms for data integrity
- **Flexibility**: Supports any data structure that can be JSON serialized

## Browser Compatibility

- **Modern Browsers**: Full LocalStorage support
- **Legacy Browsers**: Automatic fallback to in-memory storage
- **Private Mode**: Graceful handling of storage restrictions
- **Quota Limits**: Automatic cleanup and user notification

## Security Considerations

- **No Sensitive Data**: Designed for application data, not sensitive information
- **Client-Side Only**: All data remains in the browser
- **No Encryption**: Data is stored as plain JSON (add encryption layer if needed)
- **Access Control**: Respects browser security policies and restrictions