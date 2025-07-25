# Authentication Implementation Guide for Rockdrill

This guide provides step-by-step instructions to implement JWT token-based authentication for the Rockdrill application.

## Overview

The authentication system includes:
- JWT token-based authentication with automatic refresh
- Login/Register forms integrated with AppContext
- Protected route components
- Token refresh and logout functionality
- Proper API service integration

## Implementation Steps

### 1. Authentication Components

#### LoginForm Component
- **Location**: `src/components/auth/LoginForm.tsx`
- **Features**:
  - Email/password validation
  - Show/hide password toggle
  - Remember me checkbox
  - Error handling with user-friendly messages
  - Integration with AppContext for state management
  - Automatic token storage and user state update

#### RegisterForm Component
- **Location**: `src/components/auth/RegisterForm.tsx`
- **Features**:
  - Full registration form with validation
  - Password strength indicator
  - Company and role selection
  - Terms of service acceptance
  - Real-time validation feedback
  - Password confirmation matching

#### ForgotPasswordForm Component
- **Location**: `src/components/auth/ForgotPasswordForm.tsx`
- **Features**:
  - Email input for password reset
  - Success state with instructions
  - Error handling for invalid emails
  - Rate limiting protection

#### AuthPage Component
- **Location**: `src/components/auth/AuthPage.tsx`
- **Features**:
  - Unified authentication page with mode switching
  - Responsive design with feature showcase
  - Mobile-optimized layout
  - Branding and marketing content

### 2. Protected Routes

#### ProtectedRoute Component
- **Location**: `src/components/auth/ProtectedRoute.tsx`
- **Features**:
  - Authentication requirement checking
  - Role-based access control
  - Loading state handling
  - Automatic redirect to auth page
  - Higher-order component wrapper (`withAuth`)
  - Custom hook for auth status (`useAuth`)

**Usage Examples**:
```tsx
// Basic protection
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Using HOC
const ProtectedDashboard = withAuth(Dashboard);

// Using hook
const { isAuthenticated, user, hasRole } = useAuth();
```

### 3. Authentication Utilities

#### Token Management
- **Location**: `src/utils/auth.ts`
- **Features**:
  - JWT token decoding and validation
  - Automatic token refresh
  - Token expiry checking
  - Secure token storage
  - Authentication initialization
  - Axios interceptors for automatic token handling

**Key Functions**:
- `initializeAuth()`: Initialize authentication on app start
- `refreshTokenIfNeeded()`: Automatic token refresh
- `startTokenRefresh()`: Start periodic token refresh
- `validateToken()`: Validate token with backend
- `logout()`: Clean logout with token removal

### 4. AppContext Integration

#### Updated AppContext
- **Location**: `src/contexts/AppContext.tsx`
- **Features**:
  - Authentication state management
  - User profile storage
  - Notification system integration
  - Automatic authentication initialization
  - Axios interceptor setup
  - Logout handling

#### State Management
```tsx
interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // UI State
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}
```

### 5. API Service Updates

#### Authentication Endpoints
- **Location**: `src/services/api.ts`
- **Added Methods**:
  - `login(email, password)`: User login
  - `register(userData)`: User registration
  - `logout()`: User logout
  - `refreshToken()`: Token refresh
  - `forgotPassword(email)`: Password reset request
  - `resetPassword(token, password)`: Password reset
  - `verifyEmail(token)`: Email verification
  - `validateToken()`: Token validation

#### HTTP Client Enhancements
- Automatic token injection in headers
- Error handling for 401 responses
- File upload support with authentication
- Request/response interceptors

### 6. UI Components

#### NotificationContainer
- **Location**: `src/components/ui/NotificationContainer.tsx`
- **Features**:
  - Toast-style notifications
  - Auto-dismiss functionality
  - Multiple notification types (success, error, warning, info)
  - Smooth animations
  - Click to dismiss

#### Updated Header
- **Location**: `src/components/layout/Header.tsx`
- **Features**:
  - User profile dropdown
  - Logout functionality
  - User avatar with initials
  - Account information display
  - Settings and profile links

### 7. App Integration

#### Updated App Component
- **Location**: `src/App.tsx`
- **Changes**:
  - Wrapped with AppProvider
  - Protected route implementation
  - Notification container integration
  - Authentication-aware layout

#### Main Entry Point
```tsx
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const AppContent = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="app-layout">
        <Sidebar />
        <Header />
        <main>{/* Page content */}</main>
        <NotificationContainer />
      </div>
    </ProtectedRoute>
  );
};
```

## Security Features

### Token Security
- JWT tokens stored in localStorage
- Automatic token refresh before expiry
- Secure token validation
- Proper logout cleanup

### Route Protection
- Authentication requirement enforcement
- Role-based access control
- Automatic redirect for unauthorized access
- Loading states during authentication checks

### Error Handling
- User-friendly error messages
- Rate limiting protection
- Network error handling
- Token expiry handling

## Usage Instructions

### 1. Start the Application
The authentication system is automatically initialized when the app starts.

### 2. User Registration
1. Navigate to the registration form
2. Fill in required information
3. Accept terms of service
4. Submit form
5. User is automatically logged in upon successful registration

### 3. User Login
1. Enter email and password
2. Optionally check "Remember me"
3. Submit form
4. User is redirected to dashboard upon successful login

### 4. Password Reset
1. Click "Forgot password?" on login form
2. Enter email address
3. Check email for reset link
4. Follow link to reset password

### 5. Logout
1. Click user avatar in header
2. Select "Sign Out" from dropdown
3. User is logged out and redirected to login

## Configuration

### Environment Variables
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### Token Configuration
- Token refresh interval: 15 minutes
- Token expiry buffer: 5 minutes
- Notification auto-dismiss: 5 seconds

## Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with error handling
- [ ] Password reset flow
- [ ] Automatic token refresh
- [ ] Protected route access
- [ ] Role-based permissions
- [ ] Logout functionality
- [ ] Session persistence across browser refresh

### Error Scenarios
- [ ] Invalid credentials
- [ ] Network errors
- [ ] Token expiry
- [ ] Rate limiting
- [ ] Validation errors

## Next Steps

1. **Backend Integration**: Ensure backend API endpoints match the client implementation
2. **Testing**: Implement unit and integration tests for authentication flows
3. **Security Review**: Conduct security audit of token handling and storage
4. **User Experience**: Add loading states and better error messaging
5. **Documentation**: Update API documentation with authentication requirements

## Files Created/Modified

### New Files
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/AuthPage.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/index.ts`
- `src/components/ui/NotificationContainer.tsx`
- `src/utils/auth.ts`

### Modified Files
- `src/App.tsx`
- `src/contexts/AppContext.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/services/api.ts`
- `src/types/index.ts`
- `src/index.css`

The authentication system is now fully implemented and ready for integration with your backend API.
