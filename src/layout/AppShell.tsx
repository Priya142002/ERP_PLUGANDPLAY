import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardShell } from '../components/layout';
import { User } from '../types';

interface AppShellProps {
  user: User;
  onLogout: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ user, onLogout }) => {
  return <DashboardShell user={user} onLogout={onLogout} />;
};

export default AppShell;
