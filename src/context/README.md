# Application Context and State Management

This directory contains the comprehensive state management system for the Admin Dashboard UI, built using React Context API with useReducer for complex state operations.

## Overview

The application context provides centralized state management for:
- **Companies**: Organization entities with full CRUD operations
- **Admins**: User accounts assigned to companies
- **Subscriptions**: Service plans and company assignments
- **UI State**: Loading states, notifications, modals, and navigation
- **User Management**: Current user information and authentication state

## Architecture

### Core Components

1. **AppContext.tsx** - Main application context with reducer and provider
2. **CompanyContext.tsx** - Specialized context for company operations
3. **AdminContext.tsx** - Specialized context for admin management
4. **SubscriptionContext.tsx** - Specialized context for subscription management
5. **index.ts** - Centralized exports for all contexts

### State Structure

```typescript
interface ApplicationState {
  user: User;                                    // Current user information
  companies: Company[];                          // All companies
  admins: Admin[];                              // All admin users
  subscriptions: Subscription[];                // All subscription plans
  companySubscriptions: CompanySubscription[];  // Company-subscription assignments
  ui: {
    activeModule: string;                       // Current active module
    loading: boolean;                           // Global loading state
    notifications: ToastNotification[];        // Active notifications
    modals: {                                   // Modal states
      confirmDelete?: ConfirmDeleteModal;
    };
  };
}
```

## Usage

### Basic Setup

```typescript
import { AppProvider } from './context';

function App() {
  return (
    <AppProvider>
      <YourAppComponents />
    </AppProvider>
  );
}
```

### Accessing State and Actions

```typescript
import { useApp, actionCreators } from './context/AppContext';

function MyComponent() {
  const { state, dispatch } = useApp();
  
  const handleAddCompany = (companyData) => {
    dispatch(actionCreators.addCompany(companyData));
  };
  
  return (
    <div>
      <p>Companies: {state.companies.length}</p>
      <button onClick={() => handleAddCompany(newCompany)}>
        Add Company
      </button>
    </div>
  );
}
```

### Specialized Hooks

```typescript
import { 
  useAppState, 
  useAppDispatch, 
  useUIState, 
  useCurrentUser, 
  useNotifications 
} from './context/AppContext';

function SpecializedComponent() {
  const state = useAppState();                    // Read-only state access
  const dispatch = useAppDispatch();              // Dispatch-only access
  const uiState = useUIState();                   // UI state only
  const currentUser = useCurrentUser();           // Current user only
  const { showNotification } = useNotifications(); // Notification helpers
  
  return <div>...</div>;
}
```

## Action Creators

All state modifications should use the provided action creators for type safety and consistency:

### Company Actions
```typescript
actionCreators.addCompany(company)
actionCreators.updateCompany(id, updates)
actionCreators.deleteCompany(id)
actionCreators.setCompanies(companies)
```

### Admin Actions
```typescript
actionCreators.addAdmin(admin)
actionCreators.updateAdmin(id, updates)
actionCreators.deleteAdmin(id)
actionCreators.setAdmins(admins)
```

### Subscription Actions
```typescript
actionCreators.addSubscription(subscription)
actionCreators.updateSubscription(id, updates)
actionCreators.deleteSubscription(id)
actionCreators.setSubscriptions(subscriptions)
```

### UI Actions
```typescript
actionCreators.setLoading(boolean)
actionCreators.setActiveModule(module)
actionCreators.showNotification(notification)
actionCreators.hideNotification(id)
actionCreators.showConfirmDeleteModal(type, id, onConfirm)
actionCreators.hideConfirmDeleteModal()
```

### Bulk Operations
```typescript
actionCreators.loadInitialData(data)
actionCreators.resetApplicationState()
actionCreators.updateExpiredSubscriptions()
```

## Features

### 1. Data Persistence
- Automatic persistence to localStorage
- Graceful fallback to in-memory storage
- Data integrity verification
- Backup and restore functionality

### 2. Notification System
- Toast notifications with auto-hide
- Support for success, error, warning, and info types
- Action buttons in notifications
- Queue management for multiple notifications

### 3. Modal Management
- Centralized modal state management
- Confirmation dialogs for destructive actions
- Consistent UX across the application

### 4. Automatic Updates
- Expired subscription detection and status updates
- Periodic checks for data consistency
- Cascade operations (e.g., deleting company removes related admins)

### 5. Error Handling
- Storage error recovery
- Graceful degradation
- User-friendly error messages
- Automatic retry mechanisms

### 6. Performance Optimizations
- Immutable state updates
- Specialized hooks to prevent unnecessary re-renders
- Efficient data operations
- Memory leak prevention

## Testing

The context includes comprehensive tests covering:
- Reducer functionality for all action types
- Context provider behavior
- Hook usage patterns
- Error scenarios
- Data persistence integration

Run tests with:
```bash
npm test src/context/__tests__/AppContext.test.tsx
```

## Best Practices

### 1. Use Action Creators
Always use the provided action creators instead of creating actions manually:
```typescript
// ✅ Good
dispatch(actionCreators.addCompany(company));

// ❌ Bad
dispatch({ type: 'ADD_COMPANY', payload: company });
```

### 2. Use Specialized Hooks
Use the most specific hook for your needs to optimize performance:
```typescript
// ✅ Good - only subscribes to UI state changes
const uiState = useUIState();

// ❌ Less optimal - subscribes to all state changes
const { state } = useApp();
const uiState = state.ui;
```

### 3. Handle Async Operations
For async operations, use the loading state and error handling:
```typescript
const handleAsyncOperation = async () => {
  dispatch(actionCreators.setLoading(true));
  try {
    // Perform async operation
    dispatch(actionCreators.addCompany(result));
    showNotification({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully'
    });
  } catch (error) {
    showNotification({
      type: 'error',
      title: 'Error',
      message: error.message
    });
  } finally {
    dispatch(actionCreators.setLoading(false));
  }
};
```

### 4. Cascade Operations
Be aware of cascade operations when deleting entities:
```typescript
// Deleting a company will automatically:
// - Remove all admins assigned to that company
// - Remove all company subscription assignments
dispatch(actionCreators.deleteCompany(companyId));
```

### 5. Notification Management
Use appropriate notification types and durations:
```typescript
// Success notifications - short duration
showNotification({
  type: 'success',
  title: 'Saved',
  duration: 3000
});

// Error notifications - longer duration or no auto-hide
showNotification({
  type: 'error',
  title: 'Error',
  message: 'Please try again',
  duration: 0 // Won't auto-hide
});
```

## Integration with Data Persistence Service

The context automatically integrates with the DataPersistenceService:
- Loads initial data on app startup
- Persists changes automatically
- Handles storage errors gracefully
- Provides backup and restore functionality

## Type Safety

All actions, state, and hooks are fully typed with TypeScript:
- Compile-time error checking
- IntelliSense support
- Type inference for action payloads
- Strict typing for all state properties

## Examples

See `AppContext.example.tsx` for a complete working example demonstrating all features and usage patterns.