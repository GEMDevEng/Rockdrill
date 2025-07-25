// Application constants for AI-Powered SDR Automation

export const APP_NAME = 'Rockdrill';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered SDR Automation Platform';

// Color scheme following frontend guidelines
export const COLORS = {
  primary: '#1E90FF',      // Blue for buttons, links, and accents
  secondary: '#6B7280',    // Gray for secondary elements
  success: '#28A745',      // Green for success states
  warning: '#FFC107',      // Yellow for warnings
  error: '#DC3545',        // Red for errors
  info: '#17A2B8',         // Teal for info
  neutral: '#F5F5F5',      // Light gray for backgrounds
  text: '#333333',         // Dark gray for text
  textLight: '#6B7280',    // Light gray for secondary text
  border: '#E5E7EB',       // Border color
  background: '#FFFFFF',   // White background
  backgroundDark: '#121212', // Dark mode background
  textDark: '#E0E0E0',     // Dark mode text
} as const;

// Email template placeholders
export const EMAIL_PLACEHOLDERS = [
  '{{lead_name}}',
  '{{first_name}}',
  '{{last_name}}',
  '{{company_name}}',
  '{{job_title}}',
  '{{industry}}',
  '{{company_size}}',
  '{{location}}',
  '{{company_news}}',
  '{{recent_funding}}',
  '{{mutual_connection}}',
  '{{company_website}}',
  '{{linkedin_url}}',
  '{{sender_name}}',
  '{{sender_company}}',
  '{{sender_title}}',
  '{{current_date}}',
  '{{unsubscribe_link}}',
] as const;

// Lead management constants
export const LEAD_STATUSES = [
  'new',
  'enriched',
  'qualified',
  'contacted',
  'replied',
  'interested',
  'not_interested',
  'converted',
  'unqualified',
] as const;

export const LEAD_SOURCES = [
  'csv_upload',
  'linkedin_url',
  'manual_entry',
  'api_import',
  'web_scraping',
] as const;

export const LEAD_SCORE_RANGES = [
  { label: 'Cold (0-25)', min: 0, max: 25, color: 'red' },
  { label: 'Warm (26-50)', min: 26, max: 50, color: 'orange' },
  { label: 'Hot (51-75)', min: 51, max: 75, color: 'yellow' },
  { label: 'Very Hot (76-100)', min: 76, max: 100, color: 'green' },
] as const;

// Campaign management constants
export const CAMPAIGN_STATUSES = [
  'draft',
  'scheduled',
  'active',
  'paused',
  'completed',
  'cancelled',
] as const;

export const CAMPAIGN_TYPES = [
  'email_sequence',
  'linkedin_outreach',
  'multi_channel',
  'follow_up',
  'nurture',
] as const;

// Email template categories
export const TEMPLATE_CATEGORIES = [
  'cold_outreach',
  'follow_up',
  'meeting_request',
  'introduction',
  'thank_you',
  'nurture',
  'custom',
] as const;

// Integration types
export const INTEGRATION_TYPES = [
  'crm',
  'email_service',
  'data_enrichment',
  'social_media',
  'calendar',
  'analytics',
] as const;

export const INTEGRATION_STATUSES = [
  'connected',
  'disconnected',
  'error',
  'pending',
  'expired',
] as const;

// CRM providers
export const CRM_PROVIDERS = [
  { name: 'HubSpot', value: 'hubspot', logo: '/logos/hubspot.png' },
  { name: 'Salesforce', value: 'salesforce', logo: '/logos/salesforce.png' },
  { name: 'Pipedrive', value: 'pipedrive', logo: '/logos/pipedrive.png' },
  { name: 'Zoho CRM', value: 'zoho', logo: '/logos/zoho.png' },
  { name: 'Monday.com', value: 'monday', logo: '/logos/monday.png' },
] as const;

// Email service providers
export const EMAIL_PROVIDERS = [
  { name: 'SendGrid', value: 'sendgrid', logo: '/logos/sendgrid.png' },
  { name: 'Mailgun', value: 'mailgun', logo: '/logos/mailgun.png' },
  { name: 'Amazon SES', value: 'ses', logo: '/logos/aws.png' },
  { name: 'Postmark', value: 'postmark', logo: '/logos/postmark.png' },
] as const;

// Data enrichment providers
export const ENRICHMENT_PROVIDERS = [
  { name: 'Clay', value: 'clay', logo: '/logos/clay.png' },
  { name: 'ZoomInfo', value: 'zoominfo', logo: '/logos/zoominfo.png' },
  { name: 'Clearbit', value: 'clearbit', logo: '/logos/clearbit.png' },
  { name: 'Apollo', value: 'apollo', logo: '/logos/apollo.png' },
] as const;

// Communication channels
export const COMMUNICATION_CHANNELS = [
  'email',
  'linkedin',
  'phone',
  'sms',
  'direct_mail',
] as const;

// Interaction types
export const INTERACTION_TYPES = [
  'email_sent',
  'email_opened',
  'email_clicked',
  'email_replied',
  'linkedin_connection',
  'linkedin_message',
  'phone_call',
  'meeting_scheduled',
  'meeting_completed',
] as const;

// Buying signal types
export const SIGNAL_TYPES = [
  'funding_round',
  'hiring_activity',
  'product_launch',
  'expansion',
  'leadership_change',
  'technology_adoption',
  'intent_signal',
  'competitor_mention',
] as const;

// Time zones
export const TIMEZONES = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'UTC', value: 'UTC' },
] as const;

// Default campaign settings
export const DEFAULT_CAMPAIGN_SETTINGS = {
  maxEmailsPerDay: 50,
  respectUnsubscribes: true,
  trackOpens: true,
  trackClicks: true,
  autoFollowUp: true,
  stopOnReply: true,
  personalizeSubject: true,
  personalizeContent: true,
} as const;

// Default send times (optimal for B2B outreach)
export const DEFAULT_SEND_TIMES = [
  { day: 1, startTime: '09:00', endTime: '11:00' }, // Monday
  { day: 2, startTime: '09:00', endTime: '11:00' }, // Tuesday
  { day: 3, startTime: '09:00', endTime: '11:00' }, // Wednesday
  { day: 4, startTime: '09:00', endTime: '11:00' }, // Thursday
  { day: 5, startTime: '09:00', endTime: '10:00' }, // Friday
] as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 25,
  maxLimit: 100,
} as const;

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.csv', '.xlsx', '.xls'],
  maxRows: 10000,
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  leads: {
    list: '/leads',
    create: '/leads',
    update: '/leads/:id',
    delete: '/leads/:id',
    upload: '/leads/upload',
    enrich: '/leads/:id/enrich',
    export: '/leads/export',
  },
  campaigns: {
    list: '/campaigns',
    create: '/campaigns',
    update: '/campaigns/:id',
    delete: '/campaigns/:id',
    start: '/campaigns/:id/start',
    pause: '/campaigns/:id/pause',
    stop: '/campaigns/:id/stop',
  },
  templates: {
    list: '/templates',
    create: '/templates',
    update: '/templates/:id',
    delete: '/templates/:id',
  },
  integrations: {
    list: '/integrations',
    connect: '/integrations/:type/connect',
    disconnect: '/integrations/:type/disconnect',
    sync: '/integrations/:type/sync',
  },
  analytics: {
    overview: '/analytics/overview',
    campaigns: '/analytics/campaigns',
    leads: '/analytics/leads',
    performance: '/analytics/performance',
  },
} as const;

// Menu items are defined in Sidebar component due to icon imports
export const MENU_ITEM_IDS = [
  'dashboard',
  'leads',
  'campaigns',
  'research',
  'templates',
  'analytics',
  'settings',
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  authToken: 'rockdrill_auth_token',
  refreshToken: 'rockdrill_refresh_token',
  userPreferences: 'rockdrill_user_preferences',
  dashboardLayout: 'rockdrill_dashboard_layout',
  tableSettings: 'rockdrill_table_settings',
} as const;

// Feature flags
export const FEATURES = {
  darkMode: true,
  advancedAnalytics: true,
  aiInsights: true,
  multiChannel: true,
  integrations: true,
  exportData: true,
  bulkActions: true,
  customFields: true,
} as const;
