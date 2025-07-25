import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AuthPage } from './AuthPage';
import { Loading } from '../ui/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'user' | 'viewer';
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  fallback,
}) => {
  const { state } = useApp();

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is not authenticated, show auth page
  if (!state.isAuthenticated || !state.user) {
    return fallback || <AuthPage />;
  }

  // Check role requirements
  if (requiredRole && state.user.role !== requiredRole && state.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This page requires {requiredRole} role.
          </p>
          <p className="text-sm text-gray-500">
            Your current role: <span className="font-medium">{state.user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean;
    requiredRole?: 'admin' | 'user' | 'viewer';
    fallback?: ReactNode;
  }
) => {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for checking authentication status
export const useAuth = () => {
  const { state } = useApp();
  
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    hasRole: (role: 'admin' | 'user' | 'viewer') => {
      if (!state.user) return false;
      return state.user.role === role || state.user.role === 'admin';
    },
    hasAnyRole: (roles: ('admin' | 'user' | 'viewer')[]) => {
      if (!state.user) return false;
      return roles.includes(state.user.role) || state.user.role === 'admin';
    },
  };
};

export default ProtectedRoute;
