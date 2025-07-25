// Application constants

export const APP_NAME = 'Rockdrill';

export const COLORS = {
  primary: '#1E90FF',
  secondary: '#F5F5F5',
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  text: '#333333',
} as const;

export const EMAIL_PLACEHOLDERS = [
  '{{lead_name}}',
  '{{company_name}}',
  '{{job_title}}',
  '{{industry}}',
  '{{company_news}}',
  '{{mutual_connection}}',
  '{{recent_funding}}',
  '{{company_size}}',
] as const;

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'replied',
  'qualified',
  'unqualified',
] as const;

export const CAMPAIGN_STATUSES = [
  'draft',
  'active',
  'paused',
  'completed',
] as const;

export const INTEGRATION_STATUSES = [
  'connected',
  'disconnected',
  'warning',
] as const;

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
