import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import Button from './Button';

interface FormProps<T> {
  initialData?: Partial<T>;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  children: (props: FormRenderProps<T>) => React.ReactNode;
  className?: string;
  submitText?: string;
  cancelText?: string;
  showButtons?: boolean;
  disabled?: boolean;
}

interface FormRenderProps<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function Form<T extends Record<string, any>>({
  initialData = {} as Partial<T>,
  validationSchema,
  onSubmit,
  onCancel,
  children,
  className = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  showButtons = true,
  disabled = false
}: FormProps<T>) {
  const [values, setValues] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: keyof T) => {
    try {
      // For individual field validation, we'll validate the entire object
      // and extract the error for this specific field
      validationSchema.parse(values);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field as string]: fieldError.message
          }));
        }
      }
    }
  }, [values, validationSchema]);

  const validateForm = useCallback(() => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it has been touched
    if (touched[field as string]) {
      setTimeout(() => validateField(field), 0);
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field as string]: isTouched }));
    
    if (isTouched) {
      validateField(field);
    }
  }, [validateField]);

  const resetForm = useCallback(() => {
    setValues(initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting) return;

    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    Object.keys(values).forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(values as T);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = Object.keys(errors).length === 0;

  const formRenderProps: FormRenderProps<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    handleSubmit
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children(formRenderProps)}
      
      {showButtons && (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={disabled || isSubmitting || !isValid}
            loading={isSubmitting}
          >
            {submitText}
          </Button>
        </div>
      )}
    </form>
  );
}

export default Form;