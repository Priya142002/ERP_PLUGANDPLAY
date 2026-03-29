import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ModuleState {
  id: string;
  name: string;
  enabled: boolean;
  locked: boolean;
}

interface ModuleContextType {
  modules: ModuleState[];
  enabledModuleIds: string[];
  setAllowedModules: (ids: string[]) => void;
  toggleModule: (id: string) => void;
  isModuleEnabled: (id: string) => boolean;
  isModuleLocked: (id: string) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// All known modules in display order
const ALL_MODULES: Omit<ModuleState, 'enabled' | 'locked'>[] = [
  { id: 'inventory',  name: 'Inventory Management' },
  { id: 'purchase',   name: 'Purchase Management'  },
  { id: 'sales',      name: 'Sales Management'     },
  { id: 'accounts',   name: 'Accounts & Finance'   },
  { id: 'crm',        name: 'CRM'                  },
  { id: 'hrm',        name: 'HRM'                  },
  { id: 'projects',   name: 'Projects'             },
  { id: 'helpdesk',   name: 'Helpdesk'             },
  { id: 'assets',     name: 'Assets'               },
  { id: 'logistics',  name: 'Logistics'            },
  { id: 'production', name: 'Production'           },
  { id: 'billing',    name: 'Billing'              },
  { id: 'pos',        name: 'POS'                  },
];

// Build module states from an allowedModules list
function buildModules(allowedIds: string[]): ModuleState[] {
  // If no restriction (super_admin or empty), enable all
  const hasRestriction = allowedIds.length > 0;
  return ALL_MODULES.map(m => ({
    ...m,
    enabled: !hasRestriction || allowedIds.includes(m.id),
    locked:  hasRestriction && !allowedIds.includes(m.id),
  }));
}

// Read allowedModules from stored user
function getAllowedModulesFromStorage(): string[] {
  try {
    const raw = localStorage.getItem('erp_user') || sessionStorage.getItem('erp_user');
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data.allowedModules) ? data.allowedModules : [];
  } catch { return []; }
}

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleState[]>(() =>
    buildModules(getAllowedModulesFromStorage())
  );

  // Re-seed whenever storage changes (e.g. after login in another tab)
  useEffect(() => {
    const sync = () => setModules(buildModules(getAllowedModulesFromStorage()));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Called right after login to immediately update sidebar
  const setAllowedModules = (ids: string[]) => {
    setModules(buildModules(ids));
  };

  // Admin can toggle modules they have access to (local UI preference)
  const toggleModule = (id: string) => {
    setModules(prev =>
      prev.map(m => m.id === id && !m.locked ? { ...m, enabled: !m.enabled } : m)
    );
  };

  const isModuleEnabled = (id: string) =>
    modules.find(m => m.id === id)?.enabled ?? true;

  const isModuleLocked = (id: string) =>
    modules.find(m => m.id === id)?.locked ?? false;

  const enabledModuleIds = modules.filter(m => m.enabled).map(m => m.id);

  return (
    <ModuleContext.Provider value={{
      modules, enabledModuleIds,
      setAllowedModules, toggleModule,
      isModuleEnabled, isModuleLocked
    }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModules must be used within ModuleProvider');
  return ctx;
};

export const useModulesSafe = () => {
  const ctx = useContext(ModuleContext);
  if (!ctx) return {
    modules: buildModules([]),
    enabledModuleIds: ALL_MODULES.map(m => m.id),
    setAllowedModules: () => {},
    toggleModule: () => {},
    isModuleEnabled: () => true,
    isModuleLocked: () => false,
  };
  return ctx;
};
