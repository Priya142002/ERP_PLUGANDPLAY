import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  helpText?: string;
  className?: string;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  leftIcon?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  onAddNew?: () => void; // Callback for add new button
  addNewLabel?: string; // Tooltip for add new button
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  options,
  disabled = false,
  required = false,
  size = 'md',
  helpText,
  className = '',
  id,
  name,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  leftIcon,
  labelClassName = '',
  containerClassName = '',
  onAddNew,
  addNewLabel = 'Add new'
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${selectId}-error`;
  const helpId = `${selectId}-help`;
  
  const sizeClasses = {
    sm: 'form-input-sm',
    md: '', // base class is h-10
    lg: 'form-input-lg'
  };

  const selectClasses = `
    form-input ${sizeClasses[size]} pr-10 appearance-none
    ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed text-slate-400' : 'bg-white text-slate-900'}
    ${leftIcon ? 'pl-10' : ''}
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
        <label htmlFor={selectId} className={`form-label ${labelClassName}`}>
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            className={selectClasses}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid || !!error}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#002147]">
              {leftIcon}
            </div>
          )}

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-[#002147]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Add New Button */}
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            disabled={disabled}
            title={addNewLabel}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
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

Select.displayName = 'Select';

export default Select;