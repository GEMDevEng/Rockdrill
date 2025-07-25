import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  footer,
  variant = 'default',
  size = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  'data-testid': testId,
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100',
    filled: 'bg-gray-50 border border-gray-200',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const interactionClasses = `
    ${hoverable ? 'hover:shadow-md hover:border-gray-300' : ''}
    ${clickable ? 'cursor-pointer hover:shadow-md' : ''}
  `;

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${interactionClasses}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      data-testid={testId}
    >
      {/* Header */}
      {(title || subtitle || Icon || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

// Specialized card components
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  trend?: number[];
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card variant="elevated" className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColorClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      {trend && trend.length > 0 && (
        <div className="mt-4">
          <div className="flex items-end space-x-1 h-8">
            {trend.map((value, index) => (
              <div
                key={index}
                className={`bg-${color}-200 rounded-sm flex-1`}
                style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  action?: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = 'blue',
  action,
  className = '',
}) => {
  const badgeColorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <Card variant="outlined" hoverable className={className}>
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className="flex-shrink-0">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {badge && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColorClasses[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          {action && action}
        </div>
      </div>
    </Card>
  );
};
