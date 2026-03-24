import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';

interface DashboardShellProps {
  user: User;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ user, onLogout, onSwitchRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Determine background based on user role
  const isSuperAdmin = user.role === 'super_admin';
  const bgClass = isSuperAdmin ? 'bg-slate-50' : 'bg-slate-50';

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isDesktop]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      // Close mobile sidebar when switching to desktop
      if (desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    
    // Dashboard routes
    if (path === '/superadmin/dashboard') return 'Dashboard';
    
    // Company routes
    if (path.startsWith('/superadmin/companies')) {
      if (path === '/superadmin/companies') return 'Companies';
      if (path === '/superadmin/companies/add') return 'Add Company';
      if (path.includes('/edit')) return 'Edit Company';
      return 'Company Details';
    }
    
    // Admin routes
    if (path.startsWith('/superadmin/admins')) {
      if (path === '/superadmin/admins') return 'Administrators';
      if (path === '/superadmin/admins/add') return 'Add Administrator';
      if (path.includes('/edit')) return 'Edit Administrator';
      return 'Administrator Details';
    }
    
    // Subscription routes
    if (path.startsWith('/superadmin/subscriptions')) {
      if (path === '/superadmin/subscriptions') return 'Subscriptions';
      if (path === '/superadmin/subscriptions/add') return 'Add Subscription';
      if (path === '/superadmin/subscriptions/assign') return 'Assign Subscriptions';
      if (path.includes('/edit')) return 'Edit Subscription';
      return 'Subscription Details';
    }
    
    // Analytics route
    if (path === '/superadmin/analytics') return 'Analytics';
    
    // Audit Logs route
    if (path === '/superadmin/audit-logs') return 'Audit Logs';
    
    // Settings route
    if (path === '/superadmin/settings') return 'Settings';
    
    // Admin routes
    if (path.startsWith('/admin')) {
      if (path === '/admin/dashboard') return 'Admin Dashboard';
      
      const parts = path.split('/');
      if (parts.length > 2) {
        const lastPart = parts[parts.length - 1];
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
      }
      return 'Admin Panel';
    }
    
    // Default fallback
    return 'Dashboard';
  };

  return (
    <div className={cn("h-screen flex", bgClass)}>
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose} 
      />

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 lg:ml-0">
        {/* Header */}
        <Header
          user={user}
          onMenuClick={handleSidebarToggle}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
          title={getPageTitle()}
        />

        {/* Main content */}
        <main className={cn("flex-1 relative overflow-y-auto focus:outline-none transition-colors duration-200 hide-scrollbar main-content-area", bgClass)}>
          <div className="page-content py-8 px-6 sm:px-8 lg:px-10">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;