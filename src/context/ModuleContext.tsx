import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ModuleState {
  id: string;
  name: string;
  enabled: boolean;
}

interface ModuleContextType {
  modules: ModuleState[];
  enabledModuleIds: string[];
  toggleModule: (id: string) => void;
  isModuleEnabled: (id: string) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Default module states - these would be persisted in localStorage or backend
const DEFAULT_MODULES: ModuleState[] = [
  { id: 'dashboard', name: 'Dashboard', enabled: true },
  { id: 'inventory', name: 'Inventory Management', enabled: true },
  { id: 'purchase', name: 'Purchase Management', enabled: true },
  { id: 'sales', name: 'Sales Management', enabled: true },
  { id: 'accounts', name: 'Accounts & Finance', enabled: true },
  { id: 'crm', name: 'CRM', enabled: true },
  { id: 'hrm', name: 'HRM', enabled: true },
  { id: 'projects', name: 'Projects', enabled: false },
  { id: 'helpdesk', name: 'Helpdesk', enabled: true },
  { id: 'assets', name: 'Assets', enabled: false },
  { id: 'logistics', name: 'Logistics', enabled: true },
  { id: 'production', name: 'Production', enabled: false },
  { id: 'billing', name: 'Billing', enabled: true }
];

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleState[]>(() => {
    // Load from localStorage if available
    try {
      const stored = localStorage.getItem('enabledModules');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading modules from localStorage:', error);
    }
    return DEFAULT_MODULES;
  });

  // Persist to localStorage whenever modules change
  useEffect(() => {
    try {
      localStorage.setItem('enabledModules', JSON.stringify(modules));
    } catch (error) {
      console.error('Error saving modules to localStorage:', error);
    }
  }, [modules]);

  const toggleModule = (id: string) => {
    setModules(prev => 
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    );
  };

  const isModuleEnabled = (id: string): boolean => {
    const module = modules.find(m => m.id === id);
    return module?.enabled ?? true; // Default to true if not found
  };

  const enabledModuleIds = modules.filter(m => m.enabled).map(m => m.id);

  return (
    <ModuleContext.Provider value={{ modules, enabledModuleIds, toggleModule, isModuleEnabled }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within ModuleProvider');
  }
  return context;
};

// Safe hook that returns default values if context is not available
export const useModulesSafe = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    // Return default implementation if context is not available
    return {
      modules: DEFAULT_MODULES,
      enabledModuleIds: DEFAULT_MODULES.filter(m => m.enabled).map(m => m.id),
      toggleModule: () => {},
      isModuleEnabled: () => true
    };
  }
  return context;
};
