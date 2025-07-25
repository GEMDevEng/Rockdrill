import React from 'react';
import { COLORS } from '../../constants';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  className = '',
  'data-testid': testId,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: `border-[${COLORS.primary}]`,
    secondary: 'border-gray-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const renderSpinner = () => (
    <div
      className={`
        ${sizeClasses[size]}
        border-2 border-transparent border-t-current rounded-full animate-spin
        ${colorClasses[color]}
      `.replace(/\s+/g, ' ').trim()}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
            bg-current rounded-full animate-pulse
          `.replace(/\s+/g, ' ').trim()}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`
        ${sizeClasses[size]}
        bg-current rounded-full animate-pulse
      `.replace(/\s+/g, ' ').trim()}
    />
  );

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={`
        flex flex-col items-center justify-center space-y-3
        ${color === 'white' ? 'text-white' : color === 'gray' ? 'text-gray-600' : `text-[${COLORS.primary}]`}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      data-testid={testId}
    >
      {renderLoader()}
      {text && (
        <p className={`${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton components for specific use cases
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`animate-pulse p-6 bg-white border border-gray-200 rounded-lg ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {/* Header */}
    <div className="flex space-x-4 mb-4 p-4 bg-gray-50 rounded-t-lg">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1 h-4 bg-gray-200 rounded" />
      ))}
    </div>
    
    {/* Rows */}
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`flex-1 h-4 bg-gray-200 rounded ${
                colIndex === 0 ? 'w-1/4' : colIndex === columns - 1 ? 'w-1/6' : ''
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-64 bg-gray-200 rounded mb-4" />
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  </div>
);
