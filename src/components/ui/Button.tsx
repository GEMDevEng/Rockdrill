import React from 'react';
import { LucideIcon } from 'lucide-react';
import { COLORS } from '../../constants';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'data-testid'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  className = '',
  'data-testid': testId,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: `bg-[${COLORS.primary}] text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm`,
    secondary: `bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm`,
    success: `bg-[${COLORS.success}] text-white hover:bg-green-600 focus:ring-green-500 shadow-sm`,
    warning: `bg-[${COLORS.warning}] text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm`,
    error: `bg-[${COLORS.error}] text-white hover:bg-red-600 focus:ring-red-500 shadow-sm`,
    outline: `border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500`,
    ghost: `text-gray-700 hover:bg-gray-100 focus:ring-gray-500`,
    link: `text-[${COLORS.primary}] hover:text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500`,
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const renderIcon = () => {
    if (loading) {
      return (
        <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${iconSizeClasses[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`} />
      );
    }

    if (Icon) {
      return (
        <Icon className={`${iconSizeClasses[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`} />
      );
    }

    return null;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      data-testid={testId}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};