import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'ghost' | 'export';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick, 
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  style,
  'aria-label': ariaLabel,
  title
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'text-white bg-[#002147] hover:bg-white hover:text-black hover:border-[#002147] border border-transparent focus:ring-[#002147] shadow-sm transition-all text-xs font-bold rounded-xl [&_svg]:stroke-white [&_svg]:hover:stroke-black',
    secondary: 'text-slate-600 bg-white border border-slate-200 focus:ring-primary-500 shadow-sm hover:!text-black hover:bg-slate-50 transition-all text-xs font-bold rounded-xl [&_svg]:stroke-slate-600 [&_svg]:hover:!stroke-black [&:has(>*:contains("Export"))]:text-white [&:has(>*:contains("Export"))_svg]:!stroke-white [&:has(>*:contains("Export")):hover]:text-black [&:has(>*:contains("Export")):hover_svg]:!stroke-black',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'text-white bg-success-600 hover:bg-success-700 focus:ring-success-500 shadow-sm',
    warning: 'text-white bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 shadow-sm',
    info: 'text-white bg-info-600 hover:bg-info-700 focus:ring-info-500 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-primary-500',
    export: 'export-btn'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || loading;

  // Clone icon elements to ensure they inherit color
  const renderIcon = (icon: React.ReactNode) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        color: 'currentColor',
        stroke: 'currentColor',
        className: `${(icon.props as any).className || ''}`
      });
    }
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel || title}
      title={title}
      style={style}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading && (
        <svg 
          className={`animate-spin h-4 w-4 ${children ? '-ml-1 mr-2' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && leftIcon && <span className={`inline-flex ${children ? "mr-2" : ""}`}>{renderIcon(leftIcon)}</span>}
      {children}
      {!loading && rightIcon && <span className={`inline-flex ${children ? "ml-2" : ""}`}>{renderIcon(rightIcon)}</span>}
    </button>
  );
};

export default Button;