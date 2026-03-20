import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem, User } from '../../types';
import { getNavigationForRole } from '../../config/navigation';
import { useModulesSafe } from '../../context/ModuleContext';
import Icon from '../ui/Icon';
import { cn } from '../../utils/cn';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItemComponentProps {
  item: NavigationItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  level: number;
  role: string;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  level,
  role
}) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some(child => child.path === location.pathname);
  const shouldExpand = isExpanded || isChildActive;


  const baseClasses = `
    flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
    ${level === 0 ? 'mb-2' : 'mb-1 ml-6'}
  `;

  const activeClasses = isActive 
    ? 'bg-white/10 text-white shadow-lg'
    : 'text-slate-300 hover:bg-white/5 hover:text-white';

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`${baseClasses} ${isChildActive ? 'bg-white/10 text-white shadow-sm' : activeClasses}`}
        >
          <Icon name={item.icon} className="mr-3 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <Icon 
            name={shouldExpand ? 'chevron-down' : 'chevron-right'} 
            className="ml-2 flex-shrink-0" 
            size="sm"
          />
        </button>
        
        {shouldExpand && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                isActive={child.path === location.pathname}
                isExpanded={false}
                onToggle={() => {}}
                level={level + 1}
                role={role}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.path) {
    return (
      <Link
        to={item.path}
        className={`${baseClasses} ${activeClasses}`}
      >
        <Icon name={item.icon} className="mr-3 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} ${activeClasses} cursor-default`}>
      <Icon name={item.icon} className="mr-3 flex-shrink-0" />
      <span>{item.label}</span>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();
  const { isModuleEnabled } = useModulesSafe();
  
  // Get subscription plan from user context (default to 'pro' for demo)
  // In production, this would come from the user's actual subscription
  const subscriptionPlan = (user as any).subscriptionPlan || 'pro';
  const navigationItems = getNavigationForRole(user.role, subscriptionPlan);

  // Filter navigation items based on enabled modules (only for admin role)
  const filteredNavigationItems = user.role === 'admin' 
    ? navigationItems.filter(item => {
        // Always show non-module items (subscription, modules, admin settings)
        if (['subscription', 'modules', 'admin'].includes(item.id)) {
          return true;
        }
        // Filter module items based on enabled state
        return isModuleEnabled(item.id);
      })
    : navigationItems;

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out border-r lg:translate-x-0 lg:static lg:inset-0 flex flex-col overflow-x-hidden",
        "border-white/10", // Navy Blue Background
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      style={{ backgroundColor: user.role === 'super_admin' ? "var(--sa-sidebar)" : "var(--admin-sidebar)" }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                user.role === 'super_admin' ? 'bg-slate-700' : 'bg-white/20'
              }`}>
                <Icon name="dashboard" className="text-white" size="lg" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white">ERP Admin</h1>
              <p className="text-sm text-slate-400">Management Portal</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              user.role === 'super_admin' ? 'text-slate-400 hover:bg-slate-800' : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden hide-scrollbar">
          {filteredNavigationItems.map((item) => (
            <NavigationItemComponent
              key={item.id}
              item={item}
              isActive={item.path === location.pathname}
              isExpanded={expandedItems.has(item.id)}
              onToggle={() => toggleExpanded(item.id)}
              level={0}
              role={user.role}
            />
          ))}
        </nav>

      </div>
    </>
  );
};

export default Sidebar;