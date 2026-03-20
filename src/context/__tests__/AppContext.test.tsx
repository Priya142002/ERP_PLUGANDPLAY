import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppProvider, useApp, appReducer, actionCreators } from '../AppContext';
import type { ApplicationState, Company, Admin, Subscription } from '../../types';

// Mock DataPersistenceService
vi.mock('../../services/DataPersistenceService', () => ({
  default: {
    load: vi.fn().mockReturnValue({ success: true, data: [] }),
    save: vi.fn().mockReturnValue({ success: true })
  }
}));

// Test component to access context
const TestComponent: React.FC = () => {
  const { state, dispatch } = useApp();
  
  return (
    <div>
      <div data-testid="companies-count">{state.companies.length}</div>
      <div data-testid="admins-count">{state.admins.length}</div>
      <div data-testid="subscriptions-count">{state.subscriptions.length}</div>
      <div data-testid="loading">{state.ui.loading.toString()}</div>
      <div data-testid="active-module">{state.ui.activeModule}</div>
      <button 
        data-testid="add-company" 
        onClick={() => dispatch(actionCreators.addCompany({
          id: 'test-company-1',
          name: 'Test Company',
          email: 'test@company.com',
          phone: '1234567890',
          address: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
            postalCode: '12345'
          },
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }))}
      >
        Add Company
      </button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(getByTestId('companies-count').textContent).toBe('0');
    expect(getByTestId('admins-count').textContent).toBe('0');
    expect(getByTestId('subscriptions-count').textContent).toBe('0');
    expect(getByTestId('active-module').textContent).toBe('dashboard');
  });

  it('should throw error when useApp is used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      useApp();
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponentOutsideProvider />)).toThrow(
      'useApp must be used within AppProvider'
    );

    consoleSpy.mockRestore();
  });

  it('should handle company actions', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      getByTestId('add-company').click();
    });

    expect(getByTestId('companies-count').textContent).toBe('1');
  });
});

describe('appReducer', () => {
  const initialState: ApplicationState = {
    user: {
      id: 'test-user',
      fullName: 'Test User',
      email: 'test@user.com',
      role: 'super_admin'
    },
    companies: [],
    admins: [],
    subscriptions: [],
    companySubscriptions: [],
    ui: {
      activeModule: 'dashboard',
      loading: false,
      notifications: [],
      modals: {}
    }
  };

  it('should handle SET_LOADING action', () => {
    const action = actionCreators.setLoading(true);
    const newState = appReducer(initialState, action);

    expect(newState.ui.loading).toBe(true);
    expect(newState).not.toBe(initialState); // Should return new state object
  });

  it('should handle ADD_COMPANY action', () => {
    const company: Company = {
      id: 'test-company-1',
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const action = actionCreators.addCompany(company);
    const newState = appReducer(initialState, action);

    expect(newState.companies).toHaveLength(1);
    expect(newState.companies[0]).toEqual(company);
  });

  it('should handle UPDATE_COMPANY action', () => {
    const company: Company = {
      id: 'test-company-1',
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const stateWithCompany = { ...initialState, companies: [company] };
    const updates = { name: 'Updated Company Name' };
    const action = actionCreators.updateCompany('test-company-1', updates);
    const newState = appReducer(stateWithCompany, action);

    expect(newState.companies[0].name).toBe('Updated Company Name');
    expect(newState.companies[0].updatedAt).toBeInstanceOf(Date);
  });

  it('should handle DELETE_COMPANY action and cascade delete related data', () => {
    const company: Company = {
      id: 'test-company-1',
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const admin: Admin = {
      id: 'test-admin-1',
      fullName: 'Test Admin',
      email: 'admin@test.com',
      phone: '1234567890',
      companyId: 'test-company-1',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const stateWithData = {
      ...initialState,
      companies: [company],
      admins: [admin]
    };

    const action = actionCreators.deleteCompany('test-company-1');
    const newState = appReducer(stateWithData, action);

    expect(newState.companies).toHaveLength(0);
    expect(newState.admins).toHaveLength(0); // Should cascade delete admin
  });

  it('should handle SHOW_NOTIFICATION action', () => {
    const notification = {
      id: 'test-notification',
      type: 'success' as const,
      title: 'Test Notification',
      message: 'This is a test notification'
    };

    const action = actionCreators.showNotification(notification);
    const newState = appReducer(initialState, action);

    expect(newState.ui.notifications).toHaveLength(1);
    expect(newState.ui.notifications[0]).toEqual(notification);
  });

  it('should handle HIDE_NOTIFICATION action', () => {
    const notification = {
      id: 'test-notification',
      type: 'success' as const,
      title: 'Test Notification'
    };

    const stateWithNotification = {
      ...initialState,
      ui: {
        ...initialState.ui,
        notifications: [notification]
      }
    };

    const action = actionCreators.hideNotification('test-notification');
    const newState = appReducer(stateWithNotification, action);

    expect(newState.ui.notifications).toHaveLength(0);
  });

  it('should handle UPDATE_EXPIRED_SUBSCRIPTIONS action', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

    const expiredSubscription: Subscription = {
      id: 'expired-sub',
      planName: 'Expired Plan',
      planType: 'monthly',
      price: 100,
      currency: 'USD',
      maxUsers: 10,
      maxModules: 5,
      features: ['feature1'],
      startDate: new Date('2023-01-01'),
      expiryDate: expiredDate,
      status: 'active', // Should be updated to expired
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const stateWithExpiredSub = {
      ...initialState,
      subscriptions: [expiredSubscription]
    };

    const action = actionCreators.updateExpiredSubscriptions();
    const newState = appReducer(stateWithExpiredSub, action);

    expect(newState.subscriptions[0].status).toBe('expired');
  });

  it('should return same state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const newState = appReducer(initialState, unknownAction);

    expect(newState).toBe(initialState);
  });
});

describe('actionCreators', () => {
  it('should create correct action for setLoading', () => {
    const action = actionCreators.setLoading(true);
    expect(action).toEqual({ type: 'SET_LOADING', payload: true });
  });

  it('should create correct action for addCompany', () => {
    const company: Company = {
      id: 'test-company',
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const action = actionCreators.addCompany(company);
    expect(action).toEqual({ type: 'ADD_COMPANY', payload: company });
  });

  it('should create correct action for showNotification', () => {
    const notification = {
      id: 'test-notification',
      type: 'success' as const,
      title: 'Test Notification'
    };

    const action = actionCreators.showNotification(notification);
    expect(action).toEqual({ type: 'SHOW_NOTIFICATION', payload: notification });
  });
});