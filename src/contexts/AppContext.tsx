import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Lead, Campaign, EmailTemplate, Integration, Notification } from '../types';
import { api, ApiError } from '../services/api';
import { initializeAuth, logout as authLogout, setupAxiosInterceptors } from '../utils/auth';

// State interface
interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Data
  leads: Lead[];
  campaigns: Campaign[];
  templates: EmailTemplate[];
  integrations: Integration[];
  
  // UI State
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Loading states
  leadsLoading: boolean;
  campaignsLoading: boolean;
  templatesLoading: boolean;
  integrationsLoading: boolean;
  
  // Error states
  error: string | null;
}

// Action types
type AppAction =
  // Authentication actions
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOGOUT' }
  
  // Data actions
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: { id: string; data: Partial<Lead> } }
  | { type: 'DELETE_LEAD'; payload: string }
  
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: { id: string; data: Partial<Campaign> } }
  | { type: 'DELETE_CAMPAIGN'; payload: string }
  
  | { type: 'SET_TEMPLATES'; payload: EmailTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: { id: string; data: Partial<EmailTemplate> } }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  
  | { type: 'SET_INTEGRATIONS'; payload: Integration[] }
  | { type: 'ADD_INTEGRATION'; payload: Integration }
  | { type: 'UPDATE_INTEGRATION'; payload: { id: string; data: Partial<Integration> } }
  | { type: 'DELETE_INTEGRATION'; payload: string }
  
  // UI actions
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  
  // Loading actions
  | { type: 'SET_LEADS_LOADING'; payload: boolean }
  | { type: 'SET_CAMPAIGNS_LOADING'; payload: boolean }
  | { type: 'SET_TEMPLATES_LOADING'; payload: boolean }
  | { type: 'SET_INTEGRATIONS_LOADING'; payload: boolean }
  
  // Error actions
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  leads: [],
  campaigns: [],
  templates: [],
  integrations: [],
  
  notifications: [],
  sidebarOpen: true,
  theme: 'light',
  
  leadsLoading: false,
  campaignsLoading: false,
  templatesLoading: false,
  integrationsLoading: false,
  
  error: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Authentication
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'LOGOUT':
      authLogout(); // This handles token removal and cleanup
      return {
        ...initialState,
        isLoading: false,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      };
    
    // Leads
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    
    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, action.payload] };
    
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id
            ? { ...lead, ...action.payload.data }
            : lead
        ),
      };
    
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload),
      };
    
    // Campaigns
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };
    
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [...state.campaigns, action.payload] };
    
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id
            ? { ...campaign, ...action.payload.data }
            : campaign
        ),
      };
    
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload),
      };
    
    // Templates
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id
            ? { ...template, ...action.payload.data }
            : template
        ),
      };
    
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload),
      };
    
    // Integrations
    case 'SET_INTEGRATIONS':
      return { ...state, integrations: action.payload };
    
    case 'ADD_INTEGRATION':
      return { ...state, integrations: [...state.integrations, action.payload] };
    
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(integration =>
          integration.id === action.payload.id
            ? { ...integration, ...action.payload.data }
            : integration
        ),
      };
    
    case 'DELETE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.filter(integration => integration.id !== action.payload),
      };
    
    // Notifications
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    // UI
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    
    // Loading states
    case 'SET_LEADS_LOADING':
      return { ...state, leadsLoading: action.payload };
    
    case 'SET_CAMPAIGNS_LOADING':
      return { ...state, campaignsLoading: action.payload };
    
    case 'SET_TEMPLATES_LOADING':
      return { ...state, templatesLoading: action.payload };
    
    case 'SET_INTEGRATIONS_LOADING':
      return { ...state, integrationsLoading: action.payload };
    
    // Error
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  });

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Setup axios interceptors for automatic token refresh
        setupAxiosInterceptors(api.client, () => {
          dispatch({ type: 'LOGOUT' });
        });

        // Initialize authentication
        const authResult = await initializeAuth();

        if (authResult) {
          dispatch({ type: 'SET_USER', payload: authResult.user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        }
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Utility function to show notifications
export const useNotifications = () => {
  const { dispatch } = useApp();

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Auto-remove notification after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, duration);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  return {
    showNotification,
    removeNotification,
    clearNotifications,
  };
};

export default AppContext;
