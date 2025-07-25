import { 
  Lead, Campaign, EmailTemplate, User, AnalyticsData,
  SearchFilters, PaginationInfo, CSVUploadResult,
  CampaignMetrics, LeadMetrics, Integration
} from '../types';
import { API_ENDPOINTS } from '../constants';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
const API_VERSION = 'v1';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP client with error handling and authentication
class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  public client: any; // For axios interceptors

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.client = this; // Reference for interceptors
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${API_VERSION}${endpoint}`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
  }
}

// Initialize HTTP client
const httpClient = new HttpClient(API_BASE_URL);

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    httpClient.post<{ user: User; token: string }>('/auth/login', { email, password }),
  
  register: (userData: Partial<User>) =>
    httpClient.post<{ user: User; token: string }>('/auth/register', userData),
  
  logout: () =>
    httpClient.post<void>('/auth/logout'),
  
  refreshToken: () =>
    httpClient.post<{ token: string }>('/auth/refresh'),
  
  forgotPassword: (email: string) =>
    httpClient.post<void>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    httpClient.post<void>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    httpClient.post<void>('/auth/verify-email', { token }),

  validateToken: () =>
    httpClient.get<{ user: User }>('/auth/validate'),
};

// User API
export const userApi = {
  getProfile: () =>
    httpClient.get<User>('/user/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    httpClient.patch<User>('/user/profile', userData),
  
  updatePassword: (currentPassword: string, newPassword: string) =>
    httpClient.patch<void>('/user/password', { currentPassword, newPassword }),
  
  deleteAccount: () =>
    httpClient.delete<void>('/user/account'),
};

// Leads API
export const leadsApi = {
  getLeads: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) =>
    httpClient.get<{ leads: Lead[]; pagination: PaginationInfo }>('/leads', {
      ...filters,
      ...pagination,
    }),
  
  getLead: (id: string) =>
    httpClient.get<Lead>(`/leads/${id}`),
  
  createLead: (leadData: Partial<Lead>) =>
    httpClient.post<Lead>('/leads', leadData),
  
  updateLead: (id: string, leadData: Partial<Lead>) =>
    httpClient.patch<Lead>(`/leads/${id}`, leadData),
  
  deleteLead: (id: string) =>
    httpClient.delete<void>(`/leads/${id}`),
  
  bulkDeleteLeads: (ids: string[]) =>
    httpClient.post<void>('/leads/bulk-delete', { ids }),
  
  uploadLeads: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.upload<CSVUploadResult>('/leads/upload', formData);
  },
  
  enrichLead: (id: string) =>
    httpClient.post<Lead>(`/leads/${id}/enrich`),
  
  bulkEnrichLeads: (ids: string[]) =>
    httpClient.post<{ results: Lead[] }>('/leads/bulk-enrich', { ids }),
  
  importFromLinkedIn: (url: string) =>
    httpClient.post<Lead>('/leads/import/linkedin', { url }),
  
  exportLeads: (filters?: SearchFilters) =>
    httpClient.get<Blob>('/leads/export', filters),
};

// Campaigns API
export const campaignsApi = {
  getCampaigns: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) =>
    httpClient.get<{ campaigns: Campaign[]; pagination: PaginationInfo }>('/campaigns', {
      ...filters,
      ...pagination,
    }),
  
  getCampaign: (id: string) =>
    httpClient.get<Campaign>(`/campaigns/${id}`),
  
  createCampaign: (campaignData: Partial<Campaign>) =>
    httpClient.post<Campaign>('/campaigns', campaignData),
  
  updateCampaign: (id: string, campaignData: Partial<Campaign>) =>
    httpClient.patch<Campaign>(`/campaigns/${id}`, campaignData),
  
  deleteCampaign: (id: string) =>
    httpClient.delete<void>(`/campaigns/${id}`),
  
  duplicateCampaign: (id: string) =>
    httpClient.post<Campaign>(`/campaigns/${id}/duplicate`),
  
  startCampaign: (id: string) =>
    httpClient.post<Campaign>(`/campaigns/${id}/start`),
  
  pauseCampaign: (id: string) =>
    httpClient.post<Campaign>(`/campaigns/${id}/pause`),
  
  stopCampaign: (id: string) =>
    httpClient.post<Campaign>(`/campaigns/${id}/stop`),
  
  getCampaignMetrics: (id: string) =>
    httpClient.get<CampaignMetrics>(`/campaigns/${id}/metrics`),
  
  getCampaignLeads: (id: string, pagination?: Partial<PaginationInfo>) =>
    httpClient.get<{ leads: Lead[]; pagination: PaginationInfo }>(`/campaigns/${id}/leads`, pagination),
};

// Email Templates API
export const templatesApi = {
  getTemplates: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) =>
    httpClient.get<{ templates: EmailTemplate[]; pagination: PaginationInfo }>('/templates', {
      ...filters,
      ...pagination,
    }),
  
  getTemplate: (id: string) =>
    httpClient.get<EmailTemplate>(`/templates/${id}`),
  
  createTemplate: (templateData: Partial<EmailTemplate>) =>
    httpClient.post<EmailTemplate>('/templates', templateData),
  
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) =>
    httpClient.patch<EmailTemplate>(`/templates/${id}`, templateData),
  
  deleteTemplate: (id: string) =>
    httpClient.delete<void>(`/templates/${id}`),
  
  duplicateTemplate: (id: string) =>
    httpClient.post<EmailTemplate>(`/templates/${id}/duplicate`),
  
  previewTemplate: (id: string, variables: Record<string, string>) =>
    httpClient.post<{ subject: string; content: string }>(`/templates/${id}/preview`, { variables }),
};

// Analytics API
export const analyticsApi = {
  getOverview: (timeRange?: string) =>
    httpClient.get<AnalyticsData>('/analytics/overview', { timeRange }),
  
  getCampaignAnalytics: (campaignId: string, timeRange?: string) =>
    httpClient.get<CampaignMetrics>(`/analytics/campaigns/${campaignId}`, { timeRange }),
  
  getLeadAnalytics: (timeRange?: string) =>
    httpClient.get<LeadMetrics>('/analytics/leads', { timeRange }),
  
  exportReport: (type: string, timeRange?: string) =>
    httpClient.get<Blob>('/analytics/export', { type, timeRange }),
};

// Integrations API
export const integrationsApi = {
  getIntegrations: () =>
    httpClient.get<Integration[]>('/integrations'),
  
  getIntegration: (id: string) =>
    httpClient.get<Integration>(`/integrations/${id}`),
  
  createIntegration: (integrationData: Partial<Integration>) =>
    httpClient.post<Integration>('/integrations', integrationData),
  
  updateIntegration: (id: string, integrationData: Partial<Integration>) =>
    httpClient.patch<Integration>(`/integrations/${id}`, integrationData),
  
  deleteIntegration: (id: string) =>
    httpClient.delete<void>(`/integrations/${id}`),
  
  testIntegration: (id: string) =>
    httpClient.post<{ success: boolean; message: string }>(`/integrations/${id}/test`),
  
  syncIntegration: (id: string) =>
    httpClient.post<void>(`/integrations/${id}/sync`),
};

// Export all APIs
export const api = {
  auth: authApi,
  user: userApi,
  leads: leadsApi,
  campaigns: campaignsApi,
  templates: templatesApi,
  analytics: analyticsApi,
  integrations: integrationsApi,
};

export { ApiError, httpClient };
export default api;
