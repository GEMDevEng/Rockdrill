import React from 'react';
import { LucideIcon, X } from 'lucide-react';
import { COLORS } from '../../constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  icon: Icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  clickable = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: `bg-green-100 text-green-800 hover:bg-green-200`,
    warning: `bg-yellow-100 text-yellow-800 hover:bg-yellow-200`,
    error: `bg-red-100 text-red-800 hover:bg-red-200`,
    info: `bg-blue-100 text-blue-800 hover:bg-blue-200`,
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const interactionClasses = `
    ${clickable ? 'cursor-pointer hover:shadow-sm' : ''}
    ${removable ? 'pr-1' : ''}
  `;

  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${interactionClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span
      className={badgeClasses}
      onClick={handleClick}
      data-testid={testId}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizeClasses[size]} mr-1`} />
      )}
      
      <span>{children}</span>
      
      {Icon && iconPosition === 'right' && !removable && (
        <Icon className={`${iconSizeClasses[size]} ml-1`} />
      )}
      
      {removable && (
        <button
          onClick={handleRemove}
          className={`ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 ${iconSizeClasses[size]}`}
          aria-label="Remove"
        >
          <X className={iconSizeClasses[size]} />
        </button>
      )}
    </span>
  );
};

// Status badge component for common status indicators
interface StatusBadgeProps {
  status: string;
  statusMap?: Record<string, {
    label?: string;
    variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    icon?: LucideIcon;
  }>;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusMap,
  className = '',
}) => {
  // Default status mappings
  const defaultStatusMap = {
    // Lead statuses
    new: { label: 'New', variant: 'info' as const },
    enriched: { label: 'Enriched', variant: 'default' as const },
    qualified: { label: 'Qualified', variant: 'success' as const },
    contacted: { label: 'Contacted', variant: 'warning' as const },
    replied: { label: 'Replied', variant: 'success' as const },
    interested: { label: 'Interested', variant: 'success' as const },
    not_interested: { label: 'Not Interested', variant: 'error' as const },
    converted: { label: 'Converted', variant: 'success' as const },
    unqualified: { label: 'Unqualified', variant: 'error' as const },
    
    // Campaign statuses
    draft: { label: 'Draft', variant: 'default' as const },
    scheduled: { label: 'Scheduled', variant: 'info' as const },
    active: { label: 'Active', variant: 'success' as const },
    paused: { label: 'Paused', variant: 'warning' as const },
    completed: { label: 'Completed', variant: 'success' as const },
    cancelled: { label: 'Cancelled', variant: 'error' as const },
    
    // Integration statuses
    connected: { label: 'Connected', variant: 'success' as const },
    disconnected: { label: 'Disconnected', variant: 'error' as const },
    error: { label: 'Error', variant: 'error' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    expired: { label: 'Expired', variant: 'error' as const },
  };

  const mappings = statusMap || defaultStatusMap;
  const statusConfig = mappings[status] || { 
    label: status, 
    variant: 'default' as const 
  };

  return (
    <Badge
      variant={statusConfig.variant}
      icon={statusConfig.icon}
      className={className}
    >
      {statusConfig.label}
    </Badge>
  );
};

// Score badge component for lead scoring
interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  showLabel?: boolean;
  className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  maxScore = 100,
  showLabel = true,
  className = '',
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getVariant = () => {
    if (percentage >= 76) return 'success';
    if (percentage >= 51) return 'warning';
    if (percentage >= 26) return 'info';
    return 'error';
  };

  const getLabel = () => {
    if (percentage >= 76) return 'Very Hot';
    if (percentage >= 51) return 'Hot';
    if (percentage >= 26) return 'Warm';
    return 'Cold';
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {score}
      {showLabel && ` (${getLabel()})`}
    </Badge>
  );
};

// Priority badge component
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = '',
}) => {
  const priorityConfig = {
    low: { label: 'Low', variant: 'default' as const },
    medium: { label: 'Medium', variant: 'info' as const },
    high: { label: 'High', variant: 'warning' as const },
    urgent: { label: 'Urgent', variant: 'error' as const },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
