import {
  Lead, Campaign, EmailTemplate, User, AnalyticsData,
  SearchFilters, PaginationInfo, CSVUploadResult,
  CampaignMetrics, LeadMetrics, Integration
} from '../types';
import { API_ENDPOINTS } from '../constants';
import { isDemoMode, mockApi } from './mockApi';

// Base API configuration - Updated for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
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

// Authentication API with demo mode support
export const authApi = {
  login: (email: string, password: string) => {
    if (isDemoMode()) {
      return mockApi.auth.login(email, password);
    }
    return httpClient.post<{ user: User; token: string }>('/auth/login', { email, password });
  },

  register: (userData: Partial<User>) => {
    if (isDemoMode()) {
      return mockApi.auth.register(userData);
    }
    return httpClient.post<{ user: User; token: string }>('/auth/register', userData);
  },

  logout: () => {
    if (isDemoMode()) {
      return mockApi.auth.logout();
    }
    return httpClient.post<void>('/auth/logout');
  },

  refreshToken: () => {
    if (isDemoMode()) {
      // In demo mode, just return a mock token
      return Promise.resolve({ token: 'demo-refresh-token-' + Date.now() });
    }
    return httpClient.post<{ token: string }>('/auth/refresh');
  },

  forgotPassword: (email: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.post<void>('/auth/forgot-password', { email });
  },

  resetPassword: (token: string, password: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.post<void>('/auth/reset-password', { token, password });
  },

  verifyEmail: (token: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.post<void>('/auth/verify-email', { token });
  },

  validateToken: () => {
    if (isDemoMode()) {
      return mockApi.auth.validateToken();
    }
    return httpClient.get<{ user: User }>('/auth/validate');
  },
};

// User API with demo mode support
export const userApi = {
  getProfile: () => {
    if (isDemoMode()) {
      return mockApi.user.getProfile();
    }
    return httpClient.get<User>('/user/profile');
  },

  updateProfile: (userData: Partial<User>) => {
    if (isDemoMode()) {
      return mockApi.user.updateProfile(userData);
    }
    return httpClient.patch<User>('/user/profile', userData);
  },

  updatePassword: (currentPassword: string, newPassword: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.patch<void>('/user/password', { currentPassword, newPassword });
  },

  deleteAccount: () => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.delete<void>('/user/account');
  },
};

// Leads API with demo mode support
export const leadsApi = {
  getLeads: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) => {
    if (isDemoMode()) {
      return mockApi.leads.getLeads(filters, pagination);
    }
    return httpClient.get<{ leads: Lead[]; pagination: PaginationInfo }>('/leads', {
      ...filters,
      ...pagination,
    });
  },

  getLead: (id: string) => {
    if (isDemoMode()) {
      return mockApi.leads.getLead(id);
    }
    return httpClient.get<Lead>(`/leads/${id}`);
  },

  createLead: (leadData: Partial<Lead>) => {
    if (isDemoMode()) {
      return mockApi.leads.createLead(leadData);
    }
    return httpClient.post<Lead>('/leads', leadData);
  },

  updateLead: (id: string, leadData: Partial<Lead>) => {
    if (isDemoMode()) {
      // Mock update - just return the updated lead
      return mockApi.leads.getLead(id).then(lead => ({ ...lead, ...leadData }));
    }
    return httpClient.patch<Lead>(`/leads/${id}`, leadData);
  },

  deleteLead: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.delete<void>(`/leads/${id}`);
  },

  bulkDeleteLeads: (ids: string[]) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.post<void>('/leads/bulk-delete', { ids });
  },

  uploadLeads: (file: File) => {
    if (isDemoMode()) {
      return Promise.resolve({
        success: true,
        imported: 25,
        failed: 0,
        errors: []
      } as CSVUploadResult);
    }
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.upload<CSVUploadResult>('/leads/upload', formData);
  },

  enrichLead: (id: string) => {
    if (isDemoMode()) {
      return mockApi.leads.getLead(id);
    }
    return httpClient.post<Lead>(`/leads/${id}/enrich`);
  },

  bulkEnrichLeads: (ids: string[]) => {
    if (isDemoMode()) {
      return Promise.resolve({ results: [] });
    }
    return httpClient.post<{ results: Lead[] }>('/leads/bulk-enrich', { ids });
  },

  importFromLinkedIn: (url: string) => {
    if (isDemoMode()) {
      return mockApi.leads.createLead({
        firstName: 'LinkedIn',
        lastName: 'Import',
        email: 'linkedin.import@example.com',
        company: 'LinkedIn Corp',
        source: 'linkedin'
      });
    }
    return httpClient.post<Lead>('/leads/import/linkedin', { url });
  },

  exportLeads: (filters?: SearchFilters) => {
    if (isDemoMode()) {
      return Promise.resolve(new Blob(['Demo CSV data'], { type: 'text/csv' }));
    }
    return httpClient.get<Blob>('/leads/export', filters);
  },
};

// Campaigns API with demo mode support
export const campaignsApi = {
  getCampaigns: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaigns();
    }
    return httpClient.get<{ campaigns: Campaign[]; pagination: PaginationInfo }>('/campaigns', {
      ...filters,
      ...pagination,
    });
  },

  getCampaign: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id);
    }
    return httpClient.get<Campaign>(`/campaigns/${id}`);
  },

  createCampaign: (campaignData: Partial<Campaign>) => {
    if (isDemoMode()) {
      const newCampaign: Campaign = {
        id: 'campaign-' + Date.now(),
        name: campaignData.name || 'New Campaign',
        description: campaignData.description || '',
        status: 'draft',
        type: campaignData.type || 'email',
        templateId: campaignData.templateId || '',
        leadIds: [],
        settings: {
          sendTime: '09:00',
          timezone: 'America/New_York',
          dailyLimit: 50,
          followUpDelay: 3
        },
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
          bounced: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startedAt: null,
        endedAt: null,
        ...campaignData
      } as Campaign;
      return Promise.resolve(newCampaign);
    }
    return httpClient.post<Campaign>('/campaigns', campaignData);
  },

  updateCampaign: (id: string, campaignData: Partial<Campaign>) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => ({ ...campaign, ...campaignData }));
    }
    return httpClient.patch<Campaign>(`/campaigns/${id}`, campaignData);
  },

  deleteCampaign: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.delete<void>(`/campaigns/${id}`);
  },

  duplicateCampaign: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => ({
        ...campaign,
        id: 'campaign-' + Date.now(),
        name: campaign.name + ' (Copy)',
        status: 'draft' as const
      }));
    }
    return httpClient.post<Campaign>(`/campaigns/${id}/duplicate`);
  },

  startCampaign: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => ({
        ...campaign,
        status: 'active' as const,
        startedAt: new Date().toISOString()
      }));
    }
    return httpClient.post<Campaign>(`/campaigns/${id}/start`);
  },

  pauseCampaign: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => ({
        ...campaign,
        status: 'paused' as const
      }));
    }
    return httpClient.post<Campaign>(`/campaigns/${id}/pause`);
  },

  stopCampaign: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => ({
        ...campaign,
        status: 'stopped' as const,
        endedAt: new Date().toISOString()
      }));
    }
    return httpClient.post<Campaign>(`/campaigns/${id}/stop`);
  },

  getCampaignMetrics: (id: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(id).then(campaign => campaign.metrics);
    }
    return httpClient.get<CampaignMetrics>(`/campaigns/${id}/metrics`);
  },

  getCampaignLeads: (id: string, pagination?: Partial<PaginationInfo>) => {
    if (isDemoMode()) {
      return mockApi.leads.getLeads();
    }
    return httpClient.get<{ leads: Lead[]; pagination: PaginationInfo }>(`/campaigns/${id}/leads`, pagination);
  },
};

// Email Templates API with demo mode support
export const templatesApi = {
  getTemplates: (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) => {
    if (isDemoMode()) {
      return mockApi.templates.getTemplates();
    }
    return httpClient.get<{ templates: EmailTemplate[]; pagination: PaginationInfo }>('/templates', {
      ...filters,
      ...pagination,
    });
  },

  getTemplate: (id: string) => {
    if (isDemoMode()) {
      return mockApi.templates.getTemplates().then(result => {
        const template = result.templates.find(t => t.id === id);
        if (!template) throw new Error('Template not found');
        return template;
      });
    }
    return httpClient.get<EmailTemplate>(`/templates/${id}`);
  },

  createTemplate: (templateData: Partial<EmailTemplate>) => {
    if (isDemoMode()) {
      const newTemplate: EmailTemplate = {
        id: 'template-' + Date.now(),
        name: templateData.name || 'New Template',
        subject: templateData.subject || '',
        content: templateData.content || '',
        variables: templateData.variables || [],
        category: templateData.category || 'general',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        ...templateData
      } as EmailTemplate;
      return Promise.resolve(newTemplate);
    }
    return httpClient.post<EmailTemplate>('/templates', templateData);
  },

  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => {
    if (isDemoMode()) {
      return templatesApi.getTemplate(id).then(template => ({ ...template, ...templateData }));
    }
    return httpClient.patch<EmailTemplate>(`/templates/${id}`, templateData);
  },

  deleteTemplate: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.delete<void>(`/templates/${id}`);
  },

  duplicateTemplate: (id: string) => {
    if (isDemoMode()) {
      return templatesApi.getTemplate(id).then(template => ({
        ...template,
        id: 'template-' + Date.now(),
        name: template.name + ' (Copy)'
      }));
    }
    return httpClient.post<EmailTemplate>(`/templates/${id}/duplicate`);
  },

  previewTemplate: (id: string, variables: Record<string, string>) => {
    if (isDemoMode()) {
      return templatesApi.getTemplate(id).then(template => {
        let subject = template.subject;
        let content = template.content;

        // Replace variables in template
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          subject = subject.replace(regex, value);
          content = content.replace(regex, value);
        });

        return { subject, content };
      });
    }
    return httpClient.post<{ subject: string; content: string }>(`/templates/${id}/preview`, { variables });
  },
};

// Analytics API with demo mode support
export const analyticsApi = {
  getOverview: (timeRange?: string) => {
    if (isDemoMode()) {
      return mockApi.analytics.getOverview();
    }
    return httpClient.get<AnalyticsData>('/analytics/overview', { timeRange });
  },

  getCampaignAnalytics: (campaignId: string, timeRange?: string) => {
    if (isDemoMode()) {
      return mockApi.campaigns.getCampaign(campaignId).then(campaign => campaign.metrics);
    }
    return httpClient.get<CampaignMetrics>(`/analytics/campaigns/${campaignId}`, { timeRange });
  },

  getLeadAnalytics: (timeRange?: string) => {
    if (isDemoMode()) {
      return Promise.resolve({
        totalLeads: 1247,
        newLeads: 45,
        qualifiedLeads: 123,
        conversionRate: 12.5,
        averageScore: 78,
        topSources: [
          { source: 'LinkedIn', count: 567 },
          { source: 'Website', count: 234 },
          { source: 'Referral', count: 156 }
        ]
      } as LeadMetrics);
    }
    return httpClient.get<LeadMetrics>('/analytics/leads', { timeRange });
  },

  exportReport: (type: string, timeRange?: string) => {
    if (isDemoMode()) {
      return Promise.resolve(new Blob(['Demo analytics report'], { type: 'text/csv' }));
    }
    return httpClient.get<Blob>('/analytics/export', { type, timeRange });
  },
};

// Integrations API with demo mode support
export const integrationsApi = {
  getIntegrations: () => {
    if (isDemoMode()) {
      return mockApi.integrations.getIntegrations();
    }
    return httpClient.get<Integration[]>('/integrations');
  },

  getIntegration: (id: string) => {
    if (isDemoMode()) {
      return mockApi.integrations.getIntegrations().then(integrations => {
        const integration = integrations.find(i => i.id === id);
        if (!integration) throw new Error('Integration not found');
        return integration;
      });
    }
    return httpClient.get<Integration>(`/integrations/${id}`);
  },

  createIntegration: (integrationData: Partial<Integration>) => {
    if (isDemoMode()) {
      const newIntegration: Integration = {
        id: 'integration-' + Date.now(),
        name: integrationData.name || 'New Integration',
        type: integrationData.type || 'crm',
        status: 'disconnected',
        description: integrationData.description || '',
        config: {},
        lastSyncAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...integrationData
      } as Integration;
      return Promise.resolve(newIntegration);
    }
    return httpClient.post<Integration>('/integrations', integrationData);
  },

  updateIntegration: (id: string, integrationData: Partial<Integration>) => {
    if (isDemoMode()) {
      return integrationsApi.getIntegration(id).then(integration => ({ ...integration, ...integrationData }));
    }
    return httpClient.patch<Integration>(`/integrations/${id}`, integrationData);
  },

  deleteIntegration: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.delete<void>(`/integrations/${id}`);
  },

  testIntegration: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve({ success: true, message: 'Demo integration test successful' });
    }
    return httpClient.post<{ success: boolean; message: string }>(`/integrations/${id}/test`);
  },

  syncIntegration: (id: string) => {
    if (isDemoMode()) {
      return Promise.resolve();
    }
    return httpClient.post<void>(`/integrations/${id}/sync`);
  },
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
