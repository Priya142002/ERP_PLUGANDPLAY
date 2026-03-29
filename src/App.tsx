import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { User } from './types';
import { getStoredUser, setStoredUser, clearStoredUser } from './utils/auth';
import { SuperAdminThemeProvider } from './app/superadmin-theme';
import { AdminThemeProvider } from './app/admin-theme';
import { ModuleProvider } from './context/ModuleContext';
import { AppProvider } from './context/AppContext';

function App() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = (role: 'super_admin' | 'admin', remember: boolean) => {
    // Read the real user that LoginPage already stored in localStorage/sessionStorage
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Fallback — should not happen in normal flow
      setUser({ id: '0', fullName: 'User', email: '', role });
    }
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const switchRole = () => {
    if (!user) return;
    const newRole: 'super_admin' | 'admin' = user.role === 'super_admin' ? 'admin' : 'super_admin';
    const switched = { ...user, role: newRole };
    setStoredUser(switched, true);
    setUser(switched);
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
