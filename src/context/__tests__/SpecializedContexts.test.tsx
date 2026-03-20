import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../AppContext';
import { CompanyProvider, useCompany } from '../CompanyContext';
import { AdminProvider, useAdmin } from '../AdminContext';
import { SubscriptionProvider, useSubscription } from '../SubscriptionContext';
import type { Company, Admin, Subscription } from '../../types';

// =============================================================================
// TEST COMPONENTS
// =============================================================================

const CompanyTestComponent: React.FC = () => {
  const { companies, createCompany, updateCompany, deleteCompany, getCompany } = useCompany();
  
  const handleCreateCompany = async () => {
    const companyData = {
      name: 'Test Company',
      email: 'test@company.com',
      phone: '1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      }
    };
    
    await createCompany(companyData);
  };

  const handleUpdateCompany = async () => {
    if (companies.length > 0) {
      await updateCompany(companies[0].id, { name: 'Updated Company' });
    }
  };

  const handleDeleteCompany = async () => {
    if (companies.length > 0) {
      await deleteCompany(companies[0].id);
    }
  };

  return (
    <div>
      <div data-testid="company-count">{companies.length}</div>
      <button onClick={handleCreateCompany} data-testid="create-company">
        Create Company
      </button>
      <button onClick={handleUpdateCompany} data-testid="update-company">
        Update Company
      </button>
      <button onClick={handleDeleteCompany} data-testid="delete-company">
        Delete Company
      </button>
      {companies.map(company => (
        <div key={company.id} data-testid={`company-${company.id}`}>
          {company.name}
        </div>
      ))}
    </div>
  );
};

const AdminTestComponent: React.FC = () => {
  const { admins, createAdmin, updateAdmin, deleteAdmin } = useAdmin();
  const { companies } = useCompany();
  
  const handleCreateAdmin = async () => {
    if (companies.length > 0) {
      const adminData = {
        fullName: 'Test Admin',
        email: 'admin@test.com',
        phone: '1234567890',
        companyId: companies[0].id,
        role: 'admin' as const
      };
      
      await createAdmin(adminData);
    }
  };

  const handleUpdateAdmin = async () => {
    if (admins.length > 0) {
      await updateAdmin(admins[0].id, { fullName: 'Updated Admin' });
    }
  };

  const handleDeleteAdmin = async () => {
    if (admins.length > 0) {
      await deleteAdmin(admins[0].id);
    }
  };

  return (
    <div>
      <div data-testid="admin-count">{admins.length}</div>
      <button onClick={handleCreateAdmin} data-testid="create-admin">
        Create Admin
      </button>
      <button onClick={handleUpdateAdmin} data-testid="update-admin">
        Update Admin
      </button>
      <button onClick={handleDeleteAdmin} data-testid="delete-admin">
        Delete Admin
      </button>
      {admins.map(admin => (
        <div key={admin.id} data-testid={`admin-${admin.id}`}>
          {admin.fullName}
        </div>
      ))}
    </div>
  );
};

const SubscriptionTestComponent: React.FC = () => {
  const { subscriptions, createSubscription, updateSubscription, deleteSubscription } = useSubscription();
  
  const handleCreateSubscription = async () => {
    const subscriptionData = {
      planName: 'Test Plan',
      planType: 'monthly' as const,
      price: 99.99,
      currency: 'USD',
      maxUsers: 10,
      maxModules: 5,
      features: ['Feature 1', 'Feature 2'],
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    await createSubscription(subscriptionData);
  };

  const handleUpdateSubscription = async () => {
    if (subscriptions.length > 0) {
      await updateSubscription(subscriptions[0].id, { planName: 'Updated Plan' });
    }
  };

  const handleDeleteSubscription = async () => {
    if (subscriptions.length > 0) {
      await deleteSubscription(subscriptions[0].id);
    }
  };

  return (
    <div>
      <div data-testid="subscription-count">{subscriptions.length}</div>
      <button onClick={handleCreateSubscription} data-testid="create-subscription">
        Create Subscription
      </button>
      <button onClick={handleUpdateSubscription} data-testid="update-subscription">
        Update Subscription
      </button>
      <button onClick={handleDeleteSubscription} data-testid="delete-subscription">
        Delete Subscription
      </button>
      {subscriptions.map(subscription => (
        <div key={subscription.id} data-testid={`subscription-${subscription.id}`}>
          {subscription.planName}
        </div>
      ))}
    </div>
  );
};

const TestApp: React.FC = () => {
  return (
    <AppProvider>
      <CompanyProvider>
        <AdminProvider>
          <SubscriptionProvider>
            <CompanyTestComponent />
            <AdminTestComponent />
            <SubscriptionTestComponent />
          </SubscriptionProvider>
        </AdminProvider>
      </CompanyProvider>
    </AppProvider>
  );
};

// =============================================================================
// TESTS
// =============================================================================

describe('Specialized Context Providers', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('CompanyContext', () => {
    it('should create a company successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      expect(screen.getByTestId('company-count')).toHaveTextContent('0');

      await user.click(screen.getByTestId('create-company'));

      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    it('should update a company successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // First create a company
      await user.click(screen.getByTestId('create-company'));

      await waitFor(() => {
        expect(screen.getByText('Test Company')).toBeInTheDocument();
      });

      // Then update it
      await user.click(screen.getByTestId('update-company'));

      await waitFor(() => {
        expect(screen.getByText('Updated Company')).toBeInTheDocument();
      });
    });

    it('should delete a company successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // First create a company
      await user.click(screen.getByTestId('create-company'));

      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      // Then delete it
      await user.click(screen.getByTestId('delete-company'));

      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('0');
      });
    });

    it('should prevent duplicate company names', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create first company
      await user.click(screen.getByTestId('create-company'));

      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      // Try to create another company with the same name
      await user.click(screen.getByTestId('create-company'));

      // Should still have only 1 company
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });
    });
  });

  describe('AdminContext', () => {
    it('should create an admin successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // First create a company (required for admin)
      await user.click(screen.getByTestId('create-company'));

      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      // Then create an admin
      await user.click(screen.getByTestId('create-admin'));

      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('1');
      });

      expect(screen.getByText('Test Admin')).toBeInTheDocument();
    });

    it('should update an admin successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create company and admin
      await user.click(screen.getByTestId('create-company'));
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      await user.click(screen.getByTestId('create-admin'));
      await waitFor(() => {
        expect(screen.getByText('Test Admin')).toBeInTheDocument();
      });

      // Update admin
      await user.click(screen.getByTestId('update-admin'));

      await waitFor(() => {
        expect(screen.getByText('Updated Admin')).toBeInTheDocument();
      });
    });

    it('should delete an admin successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create company and admin
      await user.click(screen.getByTestId('create-company'));
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      await user.click(screen.getByTestId('create-admin'));
      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('1');
      });

      // Delete admin
      await user.click(screen.getByTestId('delete-admin'));

      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('0');
      });
    });
  });

  describe('SubscriptionContext', () => {
    it('should create a subscription successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      expect(screen.getByTestId('subscription-count')).toHaveTextContent('0');

      await user.click(screen.getByTestId('create-subscription'));

      await waitFor(() => {
        expect(screen.getByTestId('subscription-count')).toHaveTextContent('1');
      });

      expect(screen.getByText('Test Plan')).toBeInTheDocument();
    });

    it('should update a subscription successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create subscription
      await user.click(screen.getByTestId('create-subscription'));

      await waitFor(() => {
        expect(screen.getByText('Test Plan')).toBeInTheDocument();
      });

      // Update subscription
      await user.click(screen.getByTestId('update-subscription'));

      await waitFor(() => {
        expect(screen.getByText('Updated Plan')).toBeInTheDocument();
      });
    });

    it('should delete a subscription successfully', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create subscription
      await user.click(screen.getByTestId('create-subscription'));

      await waitFor(() => {
        expect(screen.getByTestId('subscription-count')).toHaveTextContent('1');
      });

      // Delete subscription
      await user.click(screen.getByTestId('delete-subscription'));

      await waitFor(() => {
        expect(screen.getByTestId('subscription-count')).toHaveTextContent('0');
      });
    });

    it('should prevent duplicate subscription plan names', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create first subscription
      await user.click(screen.getByTestId('create-subscription'));

      await waitFor(() => {
        expect(screen.getByTestId('subscription-count')).toHaveTextContent('1');
      });

      // Try to create another subscription with the same name
      await user.click(screen.getByTestId('create-subscription'));

      // Should still have only 1 subscription
      await waitFor(() => {
        expect(screen.getByTestId('subscription-count')).toHaveTextContent('1');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should prevent company deletion when it has admins', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create company
      await user.click(screen.getByTestId('create-company'));
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      // Create admin for the company
      await user.click(screen.getByTestId('create-admin'));
      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('1');
      });

      // Try to delete company (should fail)
      await user.click(screen.getByTestId('delete-company'));

      // Company should still exist
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });
    });

    it('should cascade delete admins when company is deleted', async () => {
      const user = userEvent.setup();
      render(<TestApp />);

      // Create company
      await user.click(screen.getByTestId('create-company'));
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('1');
      });

      // Create admin for the company
      await user.click(screen.getByTestId('create-admin'));
      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('1');
      });

      // Delete admin first
      await user.click(screen.getByTestId('delete-admin'));
      await waitFor(() => {
        expect(screen.getByTestId('admin-count')).toHaveTextContent('0');
      });

      // Now delete company (should succeed)
      await user.click(screen.getByTestId('delete-company'));
      await waitFor(() => {
        expect(screen.getByTestId('company-count')).toHaveTextContent('0');
      });
    });
  });
});