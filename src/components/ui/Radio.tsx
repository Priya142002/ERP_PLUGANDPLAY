import React, { forwardRef } from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helpText?: string;
}

interface RadioProps {
  label?: string;
  error?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  helpText?: string;
  className?: string;
  name: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

const Radio = forwardRef<HTMLFieldSetElement, RadioProps>(({
  label,
  error,
  options,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  size = 'md',
  orientation = 'vertical',
  helpText,
  className = '',
  name,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid
}, ref) => {
  const fieldsetId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldsetId}-error`;
  const helpId = `${fieldsetId}-help`;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const radioClasses = `
    ${sizeClasses[size]} border-gray-300 text-primary-600 
    focus:ring-primary-500 focus:ring-2 focus:ring-offset-2
    ${error ? 'border-error-500' : ''}
  `.trim().replace(/\s+/g, ' ');

  const containerClasses = orientation === 'horizontal' 
    ? 'flex flex-wrap gap-6' 
    : 'space-y-3';

  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <fieldset 
      ref={ref}
      className={`form-group ${className}`}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid || !!error}
    >
      {label && (
        <legend className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
        </legend>
      )}
      
      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500 mb-3">
          {helpText}
        </p>
      )}
      
      <div className={containerClasses}>
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          const isDisabled = disabled || option.disabled;
          
          return (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  disabled={isDisabled}
                  required={required}
                  className={`${radioClasses} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={optionId} 
                  className={`font-medium text-gray-700 ${isDisabled ? 'opacity-50' : 'cursor-pointer'}`}
                >
                  {option.label}
                </label>
                {option.helpText && (
                  <p className="text-gray-500 mt-1">
                    {option.helpText}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p id={errorId} className="form-error mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
});

Radio.displayName = 'Radio';

export default Radio;