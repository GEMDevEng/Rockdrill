import React, { forwardRef } from 'react';
import { LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { COLORS } from '../../constants';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  fullWidth = false,
  showPasswordToggle = false,
  loading = false,
  type = 'text',
  className = '',
  disabled = false,
  'data-testid': testId,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState(type);

  React.useEffect(() => {
    if (type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    } else {
      setInputType(type);
    }
  }, [type, showPassword]);

  const baseClasses = 'block transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantClasses = {
    default: `border border-gray-300 rounded-lg bg-white focus:ring-[${COLORS.primary}] focus:border-[${COLORS.primary}]`,
    filled: `border-0 rounded-lg bg-gray-100 focus:ring-[${COLORS.primary}] focus:bg-white`,
    outlined: `border-2 border-gray-300 rounded-lg bg-transparent focus:ring-[${COLORS.primary}] focus:border-[${COLORS.primary}]`,
  };

  const errorClasses = error 
    ? `border-[${COLORS.error}] focus:ring-red-500 focus:border-[${COLORS.error}]`
    : '';

  const disabledClasses = disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : '';

  const widthClass = fullWidth ? 'w-full' : '';

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const paddingWithIcon = Icon && iconPosition === 'left' 
    ? size === 'sm' ? 'pl-10' : size === 'md' ? 'pl-11' : 'pl-12'
    : '';

  const paddingWithRightIcon = (Icon && iconPosition === 'right') || showPasswordToggle || error
    ? size === 'sm' ? 'pr-10' : size === 'md' ? 'pr-11' : 'pr-12'
    : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            <Icon className={iconSizeClasses[size]} />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          disabled={disabled || loading}
          data-testid={testId}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${errorClasses}
            ${disabledClasses}
            ${paddingWithIcon}
            ${paddingWithRightIcon}
            ${widthClass}
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />
        
        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading && (
            <div className={`border-2 border-gray-300 border-t-[${COLORS.primary}] rounded-full animate-spin ${iconSizeClasses[size]} mr-2`} />
          )}
          
          {error && (
            <AlertCircle className={`text-[${COLORS.error}] ${iconSizeClasses[size]} mr-2`} />
          )}
          
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`text-gray-500 hover:text-gray-700 focus:outline-none ${iconSizeClasses[size]} mr-2`}
              disabled={disabled}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          )}
          
          {Icon && iconPosition === 'right' && !error && !loading && (
            <Icon className={`${iconSizeClasses[size]} ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
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

Input.displayName = 'Input';
