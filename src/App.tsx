import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { User } from './types';
import { getStoredUser, setStoredUser, clearStoredUser } from './utils/auth';
import { SuperAdminThemeProvider } from './app/superadmin-theme';
import { AdminThemeProvider } from './app/admin-theme';
import { ModuleProvider } from './context/ModuleContext';
import { AppProvider } from './context/AppContext';
import { initTrialStart } from './utils/trialAccess';
import { SubscriptionPlanModal } from './components/subscription/SubscriptionPlanModal';

// Mock users data
const mockUsers: Record<'super_admin' | 'admin', User> = {
  super_admin: {
    id: '1',
    fullName: 'Super Admin',
    email: 'superadmin@erp.com',
    role: 'super_admin'
  },
  admin: {
    id: '2',
    fullName: 'Branch Admin',
    email: 'admin@erp.com',
    role: 'admin',
    companyId: 'demo-company-1'
  }
};

function App() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const login = (role: 'super_admin' | 'admin', remember: boolean, email?: string) => {
    const userToLogin = mockUsers[role];
    
    // Init trial start date on first login for admin users
    if (role === 'admin' && email) {
      initTrialStart(email);
      
      // Check if email is not a company-created email (simple check: not ending with company domain)
      // For demo purposes, we'll show the modal if email doesn't contain 'company' or specific domains
      const isCompanyEmail = email.includes('@company.') || email.includes('@erp.com');
      
      if (!isCompanyEmail) {
        // Show subscription plan modal for non-company emails
        setShowSubscriptionModal(true);
      }
    }
    
    setStoredUser(userToLogin, remember);
    setUser(userToLogin);
  };

  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId);
    // Here you would typically save the selected plan to the backend
    // For now, we'll just close the modal
    setShowSubscriptionModal(false);
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const switchRole = () => {
    if (!user) return;
    const newRole = user.role === 'super_admin' ? 'admin' : 'super_admin';
    const newUser = mockUsers[newRole];
    setStoredUser(newUser, true);
    setUser(newUser);
  };

  return (
    <AppProvider>
      <SuperAdminThemeProvider>
        <AdminThemeProvider>
          <ModuleProvider>
            <Router>
              <div className="min-h-screen">
                <AppRoutes 
                  user={user} 
                  onLogin={login} 
                  onLogout={logout} 
                  onSwitchRole={switchRole} 
                />
                
                {/* Subscription Plan Modal */}
                {showSubscriptionModal && (
                  <SubscriptionPlanModal
                    onClose={() => setShowSubscriptionModal(false)}
                    onSelectPlan={handleSelectPlan}
                  />
                )}
              </div>
            </Router>
          </ModuleProvider>
        </AdminThemeProvider>
      </SuperAdminThemeProvider>
    </AppProvider>
  );
}

export default App;