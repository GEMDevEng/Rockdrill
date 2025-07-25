import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { COLORS } from '../../constants';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  loading = false,
  className = '',
  disabled = false,
  'data-testid': testId,
  ...props
}, ref) => {
  const baseClasses = 'block appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm pr-8',
    md: 'px-4 py-2 text-sm pr-10',
    lg: 'px-4 py-3 text-base pr-12',
  };

  const variantClasses = {
    default: `border border-gray-300 rounded-lg bg-white focus:ring-[${COLORS.primary}] focus:border-[${COLORS.primary}]`,
    filled: `border-0 rounded-lg bg-gray-100 focus:ring-[${COLORS.primary}] focus:bg-white`,
    outlined: `border-2 border-gray-300 rounded-lg bg-transparent focus:ring-[${COLORS.primary}] focus:border-[${COLORS.primary}]`,
  };

  const errorClasses = error 
    ? `border-[${COLORS.error}] focus:ring-red-500 focus:border-[${COLORS.error}]`
    : '';

  const disabledClasses = disabled || loading
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : '';

  const widthClass = fullWidth ? 'w-full' : '';

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconPositionClasses = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-4',
  };

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled || loading}
          data-testid={testId}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${errorClasses}
            ${disabledClasses}
            ${widthClass}
          `.replace(/\s+/g, ' ').trim()}
          {...props}
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
        
        {/* Dropdown arrow and icons */}
        <div className={`absolute inset-y-0 ${iconPositionClasses[size]} flex items-center pointer-events-none`}>
          {loading ? (
            <div className={`border-2 border-gray-300 border-t-[${COLORS.primary}] rounded-full animate-spin ${iconSizeClasses[size]} mr-2`} />
          ) : error ? (
            <AlertCircle className={`text-[${COLORS.error}] ${iconSizeClasses[size]} mr-2`} />
          ) : null}
          
          <ChevronDown className={`${iconSizeClasses[size]} ${disabled || loading ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className={`text-sm text-[${COLORS.error}]`} data-testid={`${testId}-error`}>
              {error}
            </p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-600" data-testid={`${testId}-helper`}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
