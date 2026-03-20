import React from 'react';
import { AppProvider, useApp, useNotifications, useCurrentUser, actionCreators } from './AppContext';
import type { Company } from '../types';

// =============================================================================
// EXAMPLE USAGE OF APP CONTEXT
// =============================================================================

// Example component that demonstrates basic usage
const ExampleComponent: React.FC = () => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();
  const currentUser = useCurrentUser();

  const handleAddCompany = () => {
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: 'Example Company',
      email: 'contact@example.com',
      phone: '1234567890',
      address: {
        street: '123 Example St',
        city: 'Example City',
        state: 'Example State',
        country: 'Example Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add company using action creator
    dispatch(actionCreators.addCompany(newCompany));

    // Show success notification
    showNotification({
      type: 'success',
      title: 'Company Added',
      message: `${newCompany.name} has been successfully added.`,
      duration: 3000
    });
  };

  const handleUpdateCompany = (companyId: string) => {
    dispatch(actionCreators.updateCompany(companyId, {
      name: 'Updated Company Name',
      status: 'inactive'
    }));

    showNotification({
      type: 'success',
      title: 'Company Updated',
      message: 'Company information has been updated.',
      duration: 3000
    });
  };

  const handleDeleteCompany = (companyId: string) => {
    dispatch(actionCreators.showConfirmDeleteModal(
      'company',
      companyId,
      () => {
        dispatch(actionCreators.deleteCompany(companyId));
        dispatch(actionCreators.hideConfirmDeleteModal());
        
        showNotification({
          type: 'success',
          title: 'Company Deleted',
          message: 'Company has been successfully deleted.',
          duration: 3000
        });
      }
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">App Context Example</h1>
      
      {/* Current User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        <p>Name: {currentUser.fullName}</p>
        <p>Email: {currentUser.email}</p>
        <p>Role: {currentUser.role}</p>
      </div>

      {/* Application State Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Application State</h2>
        <p>Companies: {state.companies.length}</p>
        <p>Admins: {state.admins.length}</p>
        <p>Subscriptions: {state.subscriptions.length}</p>
        <p>Active Module: {state.ui.activeModule}</p>
        <p>Loading: {state.ui.loading ? 'Yes' : 'No'}</p>
        <p>Notifications: {state.ui.notifications.length}</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={handleAddCompany}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Company
        </button>
        
        <button
          onClick={() => dispatch(actionCreators.setLoading(!state.ui.loading))}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Toggle Loading
        </button>

        <button
          onClick={() => dispatch(actionCreators.setActiveModule('companies'))}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Set Active Module to Companies
        </button>
      </div>

      {/* Companies List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Companies</h2>
        {state.companies.length === 0 ? (
          <p className="text-gray-500">No companies added yet.</p>
        ) : (
          <div className="space-y-2">
            {state.companies.map((company) => (
              <div key={company.id} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.email}</p>
                  <p className="text-sm text-gray-500">Status: {company.status}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdateCompany(company.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      {state.ui.notifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Active Notifications</h2>
          <div className="space-y-2">
            {state.ui.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100 text-green-800' :
                  notification.type === 'error' ? 'bg-red-100 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}
              >
                <h4 className="font-medium">{notification.title}</h4>
                {notification.message && <p className="text-sm">{notification.message}</p>}
                <button
                  onClick={() => dispatch(actionCreators.hideNotification(notification.id))}
                  className="mt-2 text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {state.ui.modals.confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this {state.ui.modals.confirmDelete.itemType}? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={state.ui.modals.confirmDelete.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => dispatch(actionCreators.hideConfirmDeleteModal())}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Example App component showing how to wrap with provider
const ExampleApp: React.FC = () => {
  return (
    <AppProvider>
      <ExampleComponent />
    </AppProvider>
  );
};

export default ExampleApp;

// =============================================================================
// USAGE PATTERNS AND BEST PRACTICES
// =============================================================================

/*
1. BASIC USAGE:
   - Wrap your app with AppProvider
   - Use useApp() hook to access state and dispatch
   - Use action creators for consistent state updates

2. SPECIALIZED HOOKS:
   - useAppState() - Access only the state
   - useAppDispatch() - Access only the dispatch function
   - useUIState() - Access only UI state
   - useCurrentUser() - Access current user
   - useNotifications() - Manage notifications with helper functions

3. ACTION CREATORS:
   - Always use actionCreators instead of creating actions manually
   - This ensures type safety and consistency
   - Example: dispatch(actionCreators.addCompany(company))

4. NOTIFICATIONS:
   - Use useNotifications() hook for easy notification management
   - Notifications auto-hide based on duration
   - Support for different types: success, error, warning, info

5. MODAL MANAGEMENT:
   - Use showConfirmDeleteModal for delete confirmations
   - Modal state is managed in the global state
   - Provides consistent UX across the application

6. DATA PERSISTENCE:
   - Data is automatically persisted to localStorage
   - Automatic loading on app initialization
   - Error handling for storage issues

7. PERFORMANCE CONSIDERATIONS:
   - State updates are immutable
   - Use specialized hooks to avoid unnecessary re-renders
   - Automatic cleanup of expired subscriptions

8. ERROR HANDLING:
   - Built-in error handling for storage operations
   - Graceful fallback to in-memory storage
   - User-friendly error notifications
*/