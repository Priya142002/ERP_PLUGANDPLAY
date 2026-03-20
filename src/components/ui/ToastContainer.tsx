import React from 'react';
import Toast from './Toast';
import type { ToastNotification } from '../../types';

interface ToastContainerProps {
  notifications: ToastNotification[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right',
  maxToasts = 5
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
  };

  // Limit the number of visible toasts
  const visibleNotifications = notifications.slice(0, maxToasts);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 p-4 space-y-4 pointer-events-none ${positionClasses[position]}`}
      aria-live="polite"
      aria-label="Notifications"
    >
      {visibleNotifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;