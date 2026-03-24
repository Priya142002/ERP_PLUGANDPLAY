import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ModuleState {
  id: string;
  name: string;
  enabled: boolean;
  locked?: boolean; // locked = not subscribed, hidden from sidebar
}

interface ModuleContextType {
  modules: ModuleState[];
  enabledModuleIds: string[];
  toggleModule: (id: string) => void;
  isModuleEnabled: (id: string) => boolean;
  isModuleLocked: (id: string) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Default module states - these would be persisted in localStorage or backend
const DEFAULT_MODULES: ModuleState[] = [
  { id: 'dashboard',  name: 'Dashboard',            enabled: true,  locked: false },
  { id: 'inventory',  name: 'Inventory Management', enabled: true,  locked: false },
  { id: 'purchase',   name: 'Purchase Management',  enabled: true,  locked: false },
  { id: 'sales',      name: 'Sales Management',     enabled: true,  locked: false },
  { id: 'accounts',   name: 'Accounts & Finance',   enabled: true,  locked: false },
  { id: 'crm',        name: 'CRM',                  enabled: true,  locked: false },
  { id: 'hrm',        name: 'HRM',                  enabled: true,  locked: false },
  { id: 'projects',   name: 'Projects',             enabled: true,  locked: false },
  { id: 'helpdesk',   name: 'Helpdesk',             enabled: true,  locked: false },
  { id: 'assets',     name: 'Assets',               enabled: true,  locked: false },
  { id: 'logistics',  name: 'Logistics',            enabled: true,  locked: false },
  { id: 'production', name: 'Production',           enabled: true,  locked: false },
  { id: 'billing',    name: 'Billing',              enabled: true,  locked: true  }, // locked — hidden from sidebar
];

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleState[]>(() => {
    try {
      const stored = localStorage.getItem('enabledModules');
      if (stored) {
        const parsed: ModuleState[] = JSON.parse(stored);
        // If stored data is missing the locked field, discard it and use defaults
        const hasLockField = parsed.some(m => 'locked' in m);
        if (hasLockField) return parsed;
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

  const isModuleLocked = (id: string): boolean => {
    const module = modules.find(m => m.id === id);
    return module?.locked ?? false;
  };

  const enabledModuleIds = modules.filter(m => m.enabled).map(m => m.id);

  return (
    <ModuleContext.Provider value={{ modules, enabledModuleIds, toggleModule, isModuleEnabled, isModuleLocked }}>
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
    return {
      modules: DEFAULT_MODULES,
      enabledModuleIds: DEFAULT_MODULES.filter(m => m.enabled).map(m => m.id),
      toggleModule: () => {},
      isModuleEnabled: () => true,
      isModuleLocked: (id: string) => DEFAULT_MODULES.find(m => m.id === id)?.locked ?? false
    };
  }
  return context;
};
