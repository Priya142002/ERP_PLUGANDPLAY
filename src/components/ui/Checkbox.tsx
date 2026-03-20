import React, { forwardRef } from 'react';

interface CheckboxProps {
  label?: string;
  error?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  helpText?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  checked,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  indeterminate = false,
  size = 'md',
  helpText,
  className = '',
  id,
  name,
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${checkboxId}-error`;
  const helpId = `${checkboxId}-help`;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const checkboxClasses = `
    ${sizeClasses[size]} rounded border-gray-300 text-primary-600 
    focus:ring-primary-500 focus:ring-2 focus:ring-offset-2
    ${error ? 'border-error-500' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && typeof ref === 'object' && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  return (
    <div className="form-group">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            name={name}
            type="checkbox"
            value={value}
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            className={checkboxClasses}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid || !!error}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={checkboxId} className={`font-medium text-gray-700 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
              {label}
              {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
            </label>
            {helpText && !error && (
              <p id={helpId} className="text-gray-500 mt-1">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p id={errorId} className="form-error mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;