import React, { forwardRef } from 'react';

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helpText?: string;
  className?: string;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  labelClassName?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  type = 'text',
  disabled = false,
  required = false,
  readOnly = false,
  autoComplete,
  autoFocus = false,
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
  size = 'md',
  leftIcon,
  rightIcon,
  helpText,
  className = '',
  id,
  name,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  labelClassName = '',
  containerClassName = ''
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  
  const sizeClasses = {
    sm: 'form-input-sm',
    md: '', // base class is h-10
    lg: 'form-input-lg'
  };

  const inputClasses = `
    form-input ${sizeClasses[size]} 
    ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${readOnly ? 'bg-gray-50' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-group ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${labelClassName}`}>
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-[#002147] sm:text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          className={inputClasses}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid || !!error}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[#002147] sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;