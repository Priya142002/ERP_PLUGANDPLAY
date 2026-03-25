import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import Icon from '../ui/Icon';
import { useSuperAdminTheme } from '../../app/superadmin-theme';
import { useAdminTheme } from '../../app/admin-theme';
import { cn } from '../../utils/cn';
import '../../styles/admin-mobile.css';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
  onLogout: () => void;
  onSwitchRole?: () => void;
  title?: string;
}
export const Header: React.FC<HeaderProps> = ({ user, onMenuClick, onLogout, onSwitchRole, title: _title = 'Dashboard' }) => {
  const superAdminTheme = user.role === 'super_admin' ? useSuperAdminTheme() : null;
  const adminTheme = user.role === 'admin' ? useAdminTheme() : null;
  
  const mode = superAdminTheme?.mode || adminTheme?.mode || 'light';
  const toggleTheme = superAdminTheme?.toggleTheme || adminTheme?.toggleTheme || (() => {});
  const isDarkMode = mode === 'dark';
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('Hari silks');
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (companyMenuRef.current && !companyMenuRef.current.contains(target)) {
        setShowCompanyMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowCompanyMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const companies = [
    'Hari silks', 
    'SRI HARI TEXTILES', 
    'S.SARASWATHI BAI', 
    'HARI ENTERPRISE', 
    'HARI SILK HOUSE'
  ];

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header 
      className="sticky top-0 z-40 transition-all duration-300 backdrop-blur-md shadow-sm"
      style={{ backgroundColor: user.role === 'super_admin' ? "var(--sa-header)" : "var(--admin-header)" }}
    >
      <div className="flex items-center justify-between h-16 lg:h-20 px-3 lg:px-8 mx-auto w-full gap-2">
        
        {/* LEFT: Hamburger + Company/Greeting */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Hamburger - mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center rounded-lg transition-all active:scale-95"
            style={{ width: '36px', height: '36px', backgroundColor: 'rgba(248,250,252,0.9)', border: '1px solid rgba(226,232,240,0.6)', color: '#64748b' }}
          >
            <Icon name="menu" size="sm" />
          </button>

          {/* Super Admin Greeting */}
          {user.role === 'super_admin' && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                <span className="text-sm">👋</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Welcome Back</p>
                <h2 className="text-sm font-black text-slate-900 leading-tight">
                  {getGreeting()}, <span className="text-indigo-600">Super Admin</span>
                </h2>
              </div>
            </div>
          )}

          {/* Admin Company Switcher */}
          {user.role === 'admin' && (
            <div className="relative" ref={companyMenuRef}>
              <button
                onClick={() => setShowCompanyMenu(!showCompanyMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: 'rgb(57,73,171)' }}>
                  <Icon name="building-2" size="sm" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active Entity</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-black text-slate-900 leading-none">{currentCompany}</p>
                    <Icon name="chevron-down" size="xs" className={cn("text-slate-400 transition-transform", showCompanyMenu && "rotate-180")} />
                  </div>
                </div>
                {/* Mobile: just show name */}
                <div className="text-left block sm:hidden">
                  <p className="text-xs font-bold text-slate-900 leading-none max-w-[80px] truncate">{currentCompany}</p>
                </div>
              </button>

              {showCompanyMenu && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] company-dropdown">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 company-dropdown-header">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">My Organizations</span>
                    <button className="flex items-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                      <Icon name="cog" size="xs" className="mr-1" />
                      Manage
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto py-1 company-list">
                    {companies.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => { setCurrentCompany(comp); setShowCompanyMenu(false); }}
                        className={cn("w-full flex items-center px-4 py-3 transition-all hover:bg-slate-50 company-item", currentCompany === comp ? "bg-indigo-50/50" : "")}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm company-icon flex-shrink-0", currentCompany === comp ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400")}>
                          <Icon name="building-2" size="xs" />
                        </div>
                        <span className={cn("text-sm font-bold company-name flex-1 text-left", currentCompany === comp ? "text-indigo-600" : "text-slate-700")}>
                          {comp}
                        </span>
                        {currentCompany === comp && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                            <Icon name="check-circle" size="xs" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: All icons always visible */}
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">

          {/* Date - hidden on small mobile */}
          <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <Icon name="calendar" size="xs" className="text-slate-400 mr-2" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{today}</span>
          </div>

          {/* Divider - desktop only */}
          <div className="h-6 w-px bg-slate-200 hidden lg:block mx-1" />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: '36px', height: '36px', color: '#94a3b8' }}
            title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          >
            <Icon name={isDarkMode ? 'sun' : 'moon'} size="sm" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="flex items-center justify-center rounded-lg transition-all relative"
              style={{ width: '36px', height: '36px', color: showNotifications ? '#6366f1' : '#94a3b8' }}
            >
              <Icon name="bell" size="sm" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Mark all read</button>
                </div>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="bell-off" className="text-slate-300" size="md" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">All caught up!</p>
                  <p className="text-xs text-slate-500">No new alerts.</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => { window.location.href = user.role === 'super_admin' ? '/superadmin/system' : '/admin/settings'; }}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: '36px', height: '36px', color: '#94a3b8' }}
            title="Settings"
          >
            <Icon name="cog" size="sm" />
          </button>

          {/* Divider - desktop only */}
          <div className="h-6 w-px bg-slate-200 hidden lg:block mx-1" />

          {/* User Avatar */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className={cn("flex items-center gap-1.5 p-1 rounded-xl transition-all border border-transparent", showUserMenu ? "bg-white shadow-md border-slate-200" : "hover:bg-slate-50")}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500 p-[2px] shadow-md flex-shrink-0">
                <div className="w-full h-full rounded-md bg-white flex items-center justify-center overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=6366f1&color=fff&bold=true`} alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-black text-slate-900 leading-tight">{user.fullName}</p>
                <div className="flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'admin' ? 'Account Admin' : user.role.replace('_', ' ')}</span>
                </div>
              </div>
              <Icon name="chevron-down" className={cn("text-slate-400 transition-transform hidden lg:block", showUserMenu && "rotate-180")} size="xs" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]">
                <div className="p-2">
                  {onSwitchRole && (
                    <button onClick={onSwitchRole} className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Icon name="refresh-cw" className="mr-2" size="sm" />
                      Switch Role
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout - always visible */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                onLogout();
              }
            }}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: '36px', height: '36px', color: '#ef4444' }}
            title="Logout"
          >
            <Icon name="log-out" size="sm" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;