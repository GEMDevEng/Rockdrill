import { api } from '../services/api';

// Token refresh interval (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

// Token expiry check interval (1 minute)
const TOKEN_CHECK_INTERVAL = 60 * 1000;

let refreshTimer: NodeJS.Timeout | null = null;
let checkTimer: NodeJS.Timeout | null = null;

/**
 * Decode JWT token to get expiry time
 */
export const decodeToken = (token: string): { exp?: number; [key: string]: any } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired or will expire soon
 */
export const isTokenExpired = (token: string, bufferMinutes: number = 5): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const now = Date.now() / 1000;
  const bufferSeconds = bufferMinutes * 60;
  return decoded.exp <= (now + bufferSeconds);
};

/**
 * Get stored auth token
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Store auth token
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove stored auth token
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Refresh token if needed
 */
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const token = getStoredToken();
  
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    try {
      const response = await api.auth.refreshToken();
      storeToken(response.token);
      return response.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      removeToken();
      // Redirect to login or dispatch logout action
      window.location.href = '/login';
      return null;
    }
  }

  return token;
};

/**
 * Start automatic token refresh
 */
export const startTokenRefresh = (): void => {
  // Clear existing timers
  stopTokenRefresh();

  // Check token immediately
  refreshTokenIfNeeded();

  // Set up periodic token refresh
  refreshTimer = setInterval(() => {
    refreshTokenIfNeeded();
  }, TOKEN_REFRESH_INTERVAL);

  // Set up periodic token expiry check
  checkTimer = setInterval(() => {
    const token = getStoredToken();
    if (token && isTokenExpired(token, 1)) {
      // Token expires in 1 minute, refresh now
      refreshTokenIfNeeded();
    }
  }, TOKEN_CHECK_INTERVAL);
};

/**
 * Stop automatic token refresh
 */
export const stopTokenRefresh = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  
  if (checkTimer) {
    clearInterval(checkTimer);
    checkTimer = null;
  }
};

/**
 * Validate token and get user info
 */
export const validateToken = async (token: string): Promise<any> => {
  try {
    // Check if token is expired
    if (isTokenExpired(token)) {
      throw new Error('Token expired');
    }

    // Validate token with backend
    const response = await api.auth.validateToken();
    return response.user;
  } catch (error) {
    console.error('Token validation failed:', error);
    removeToken();
    throw error;
  }
};

/**
 * Initialize authentication
 */
export const initializeAuth = async (): Promise<{ user: any; token: string } | null> => {
  const token = getStoredToken();
  
  if (!token) {
    return null;
  }

  try {
    // Try to refresh token if needed
    const validToken = await refreshTokenIfNeeded();
    
    if (!validToken) {
      return null;
    }

    // Validate token and get user info
    const user = await validateToken(validToken);
    
    // Start automatic token refresh
    startTokenRefresh();
    
    return { user, token: validToken };
  } catch (error) {
    console.error('Auth initialization failed:', error);
    removeToken();
    return null;
  }
};

/**
 * Logout and cleanup
 */
export const logout = (): void => {
  removeToken();
  stopTokenRefresh();
};

// Axios interceptor for automatic token refresh
export const setupAxiosInterceptors = (axiosInstance: any, onLogout: () => void): void => {
  // Request interceptor to add token
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      const token = await refreshTokenIfNeeded();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      if (error.response?.status === 401) {
        // Token is invalid, try to refresh
        try {
          const newToken = await refreshTokenIfNeeded();
          if (newToken) {
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance.request(error.config);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          logout();
          onLogout();
        }
      }
      return Promise.reject(error);
    }
  );
};
