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

  const login = (role: 'super_admin' | 'admin', remember: boolean, email?: string) => {
    const userToLogin = mockUsers[role];
    // Init trial start date on first login for admin users
    if (role === 'admin' && email) {
      initTrialStart(email);
    }
    setStoredUser(userToLogin, remember);
    setUser(userToLogin);
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
              </div>
            </Router>
          </ModuleProvider>
        </AdminThemeProvider>
      </SuperAdminThemeProvider>
    </AppProvider>
  );
}

export default App;