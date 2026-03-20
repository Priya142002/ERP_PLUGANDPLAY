import { useMemo } from 'react';

/**
 * Hook to get admin theme colors from CSS variables
 * This ensures all admin pages use the customized theme colors
 */
export function useAdminColors() {
  return useMemo(() => {
    // Get computed styles from root element
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    
    return {
      primary: styles.getPropertyValue('--admin-primary').trim() || '#002147',
      sidebar: styles.getPropertyValue('--admin-sidebar').trim() || '#002147',
      header: styles.getPropertyValue('--admin-header').trim() || '#ffffff',
      card: styles.getPropertyValue('--admin-card').trim() || '#ffffff',
      background: styles.getPropertyValue('--admin-background').trim() || '#f8fafc',
      border: styles.getPropertyValue('--admin-border').trim() || '#E5E7EB',
      hover: styles.getPropertyValue('--admin-hover').trim() || '#F3F4F6',
      textPrimary: styles.getPropertyValue('--admin-text-primary').trim() || '#0f172a',
      textSecondary: styles.getPropertyValue('--admin-text-secondary').trim() || '#64748b',
      success: styles.getPropertyValue('--admin-success').trim() || '#059669',
      warning: styles.getPropertyValue('--admin-warning').trim() || '#D97706',
      error: styles.getPropertyValue('--admin-error').trim() || '#DC2626',
      info: styles.getPropertyValue('--admin-info').trim() || '#2563EB',
    };
  }, []);
}

/**
 * Get inline styles for common elements
 */
export function useAdminStyles() {
  const colors = useAdminColors();
  
  return useMemo(() => ({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      color: '#ffffff',
    },
    buttonHover: {
      backgroundColor: colors.primary,
      opacity: 0.9,
    },
    text: {
      color: colors.textPrimary,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    border: {
      borderColor: colors.border,
    },
    icon: {
      color: colors.primary,
    },
    badge: {
      backgroundColor: `color-mix(in srgb, ${colors.primary}, transparent 90%)`,
      color: colors.primary,
    },
  }), [colors]);
}
