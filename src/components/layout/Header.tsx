import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import Icon from '../ui/Icon';
import { useSuperAdminTheme } from '../../app/superadmin-theme';
import { useAdminTheme } from '../../app/admin-theme';
import { cn } from '../../utils/cn';

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
      <div className="flex items-center justify-between h-20 px-6 lg:px-8 mx-auto w-full">
        <div className="flex items-center flex-1 gap-4">
          {/* Mobile Menu Button - NEW */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all active:scale-95"
          >
            <Icon name="menu" size="sm" />
          </button>
          {/* Greeting - ONLY for Super Admin side */}
          {user.role === 'super_admin' && (
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-md">
                  <span className="text-lg">👋</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Welcome Back</p>
                  <h2 className="text-base font-black text-slate-900 leading-tight">
                    {getGreeting()}, <span className="text-indigo-600">Super Admin</span>
                  </h2>
                </div>
              </div>
            </div>
          )}

          {/* Company Switcher moved to Left - ONLY for Admin side */}
          {user.role === 'admin' && (
            <div className="relative" ref={companyMenuRef}>
              <button
                onClick={() => setShowCompanyMenu(!showCompanyMenu)}
                className="flex items-center px-4 py-2 space-x-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform" style={{ color: 'rgb(57, 73, 171)' }}>
                  <Icon name="building-2" size="lg" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Active Entity</p>
                  <div className="flex items-center">
                    <p className="text-base font-black text-slate-900 leading-none mr-2">{currentCompany}</p>
                    <Icon name="chevron-down" size="xs" className={cn("text-slate-400 transition-transform", showCompanyMenu && "rotate-180")} />
                  </div>
                </div>
              </button>

              {showCompanyMenu && (
                <div className="absolute top-full left-0 mt-3 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">My Organizations</span>
                    <button className="flex items-center text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                      <Icon name="cog" size="xs" className="mr-1.5" />
                      Manage Company
                    </button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto py-2 custom-scrollbar">
                    {companies.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => {
                          setCurrentCompany(comp);
                          setShowCompanyMenu(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-5 py-4 transition-all hover:bg-slate-50 relative group",
                          currentCompany === comp ? "bg-indigo-50/50" : ""
                        )}
                      >
                        <div className={cn(
                          "w-12 h-8 rounded-md flex items-center justify-center mr-4 shadow-sm",
                          currentCompany === comp ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        )}>
                          <Icon name="building-2" size="xs" />
                        </div>
                        <span className={cn(
                          "text-sm font-bold tracking-tight transition-colors",
                          currentCompany === comp ? "text-indigo-600" : "text-slate-700 group-hover:text-slate-900"
                        )}>
                          {comp}
                        </span>
                        {currentCompany === comp && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
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

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Removed company switcher from here */}

          {/* Business Date */}
          <div className="hidden md:flex items-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Icon name="calendar" size="xs" className="text-slate-400 mr-3" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{today}</span>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-slate-200 hidden lg:block mx-2"></div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all"
            title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          >
            <Icon name={isDarkMode ? 'sun' : 'moon'} size="sm" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className={cn(
                "p-3 rounded-xl transition-all relative group",
                showNotifications ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
              )}
            >
              <Icon name="bell" size="sm" />
              <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white group-hover:scale-110 transition-transform"></span>
            </button>

              {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-[360px] overflow-y-auto hide-scrollbar">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="bell-off" className="text-slate-300" size="lg" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">All caught up!</p>
                    <p className="text-xs text-slate-500">No new alerts or approval requests.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button - For both Super Admin and Admin */}
          <button
            onClick={() => {
              if (user.role === 'super_admin') {
                window.location.href = '/superadmin/system';
              } else if (user.role === 'admin') {
                window.location.href = '/admin/settings';
              }
            }}
            className="p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all"
            title="Settings"
          >
            <Icon name="cog" size="sm" />
          </button>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-slate-200 hidden lg:block mx-1"></div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className={cn(
                "flex items-center p-1.5 space-x-3 rounded-2xl transition-all border border-transparent",
                showUserMenu ? "bg-white shadow-lg border-slate-200 ring-4 ring-slate-50" : "hover:bg-slate-50"
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500 p-[2px] shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-[9px] bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.fullName}&background=6366f1&color=fff&bold=true`} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="hidden lg:block text-left pr-2">
                <p className="text-sm font-black text-slate-900 leading-tight">{user.fullName}</p>
                <div className="flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_4px_rgba(16,185,129,0.6)]"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'admin' ? 'Account Admin' : user.role.replace('_', ' ')}</span>
                </div>
              </div>
              <Icon name="chevron-down" className={cn("text-slate-400 transition-transform", showUserMenu && "rotate-180")} size="xs" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="p-2">
                  {onSwitchRole && (
                    <button 
                      onClick={onSwitchRole}
                      className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Icon name="refresh-cw" className="mr-3" size="sm" />
                      Switch Role
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Logout Button - Separate from dropdown */}
          <button 
            onClick={onLogout}
            className="p-3 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all"
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