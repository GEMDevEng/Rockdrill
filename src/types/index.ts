// Common types for the AI-Powered SDR Automation Application

export type Page = 'dashboard' | 'leads' | 'campaigns' | 'analytics' | 'templates' | 'settings' | 'research';

// User Management Types
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'user' | 'viewer';
  subscription: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  timezone: string;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

// Lead Management Types
export interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  linkedinUrl?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  score: number;
  status: LeadStatus;
  source: LeadSource;
  tags: string[];
  customFields: Record<string, any>;
  enrichmentData?: EnrichmentData;
  researchData?: ResearchData;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

export type LeadStatus =
  | 'new'
  | 'enriched'
  | 'qualified'
  | 'contacted'
  | 'replied'
  | 'interested'
  | 'not_interested'
  | 'converted'
  | 'unqualified';

export type LeadSource =
  | 'csv_upload'
  | 'linkedin_url'
  | 'manual_entry'
  | 'api_import'
  | 'web_scraping';

export interface EnrichmentData {
  provider: string;
  confidence: number;
  data: {
    verifiedEmail?: boolean;
    socialProfiles?: SocialProfile[];
    companyInfo?: CompanyInfo;
    contactInfo?: ContactInfo;
  };
  enrichedAt: Date;
}

export interface SocialProfile {
  platform: string;
  url: string;
  followers?: number;
  verified?: boolean;
}

export interface CompanyInfo {
  name: string;
  domain: string;
  industry: string;
  size: string;
  revenue?: string;
  founded?: number;
  description?: string;
  technologies?: string[];
  funding?: FundingInfo[];
}

export interface FundingInfo {
  round: string;
  amount: string;
  date: Date;
  investors: string[];
}

export interface ContactInfo {
  phone?: string;
  address?: Address;
  socialProfiles?: SocialProfile[];
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ResearchData {
  signals: BuyingSignal[];
  insights: string[];
  recentNews: NewsItem[];
  socialActivity: SocialActivity[];
  researchedAt: Date;
}

export interface BuyingSignal {
  type: SignalType;
  description: string;
  confidence: number;
  source: string;
  detectedAt: Date;
  relevanceScore: number;
}

export type SignalType =
  | 'funding_round'
  | 'hiring_activity'
  | 'product_launch'
  | 'expansion'
  | 'leadership_change'
  | 'technology_adoption'
  | 'intent_signal'
  | 'competitor_mention';

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface SocialActivity {
  platform: string;
  content: string;
  engagement: number;
  url: string;
  publishedAt: Date;
}

export interface Interaction {
  id: string;
  leadId: string;
  campaignId?: string;
  type: InteractionType;
  channel: CommunicationChannel;
  subject?: string;
  content?: string;
  status: InteractionStatus;
  response?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  respondedAt?: Date;
}

export type InteractionType =
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'email_replied'
  | 'linkedin_connection'
  | 'linkedin_message'
  | 'phone_call'
  | 'meeting_scheduled'
  | 'meeting_completed';

export type CommunicationChannel =
  | 'email'
  | 'linkedin'
  | 'phone'
  | 'sms'
  | 'direct_mail';

export type InteractionStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'bounced'
  | 'failed';

// Campaign Management Types
export interface Campaign {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  type: CampaignType;
  leads: string[]; // Lead IDs
  emailTemplates: string[]; // EmailTemplate IDs
  schedule: CampaignSchedule;
  settings: CampaignSettings;
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type CampaignType =
  | 'email_sequence'
  | 'linkedin_outreach'
  | 'multi_channel'
  | 'follow_up'
  | 'nurture';

export interface CampaignSchedule {
  startDate: Date;
  endDate?: Date;
  timezone: string;
  sendTimes: TimeSlot[];
  frequency: 'daily' | 'weekly' | 'custom';
  delays: CampaignDelay[];
}

export interface TimeSlot {
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface CampaignDelay {
  stepNumber: number;
  delayDays: number;
  delayHours: number;
}

export interface CampaignSettings {
  maxEmailsPerDay: number;
  respectUnsubscribes: boolean;
  trackOpens: boolean;
  trackClicks: boolean;
  autoFollowUp: boolean;
  stopOnReply: boolean;
  personalizeSubject: boolean;
  personalizeContent: boolean;
}

export interface CampaignMetrics {
  totalLeads: number;
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsReplied: number;
  emailsBounced: number;
  unsubscribes: number;
  conversions: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  subject: string;
  body: string;
  placeholders: string[];
  isActive: boolean;
  usage: number;
  metrics: TemplateMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateCategory =
  | 'cold_outreach'
  | 'follow_up'
  | 'meeting_request'
  | 'introduction'
  | 'thank_you'
  | 'nurture'
  | 'custom';

export interface TemplateMetrics {
  timesSent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
  lastUsed?: Date;
}

// Integration Types
export interface Integration {
  id: string;
  userId: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  config: IntegrationConfig;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType =
  | 'crm'
  | 'email_service'
  | 'data_enrichment'
  | 'social_media'
  | 'calendar'
  | 'analytics';

export type IntegrationStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'pending'
  | 'expired';

export interface IntegrationConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  webhookUrl?: string;
  settings: Record<string, any>;
}

// Analytics Types
export interface AnalyticsData {
  overview: OverviewMetrics;
  campaigns: CampaignAnalytics[];
  leads: LeadAnalytics;
  performance: PerformanceMetrics;
  trends: TrendData[];
  dateRange: DateRange;
}

export interface OverviewMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  activeLeads: number;
  totalCampaigns: number;
  activeCampaigns: number;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  conversions: number;
  revenue: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  metrics: CampaignMetrics;
  performance: PerformanceComparison;
  timeline: TimelineData[];
}

export interface LeadAnalytics {
  byStatus: StatusDistribution[];
  bySource: SourceDistribution[];
  byIndustry: IndustryDistribution[];
  byScore: ScoreDistribution[];
  conversionFunnel: FunnelData[];
}

export interface StatusDistribution {
  status: LeadStatus;
  count: number;
  percentage: number;
}

export interface SourceDistribution {
  source: LeadSource;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface IndustryDistribution {
  industry: string;
  count: number;
  percentage: number;
  avgScore: number;
}

export interface ScoreDistribution {
  scoreRange: string;
  count: number;
  percentage: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface PerformanceMetrics {
  openRate: MetricWithTrend;
  clickRate: MetricWithTrend;
  replyRate: MetricWithTrend;
  conversionRate: MetricWithTrend;
  bounceRate: MetricWithTrend;
  unsubscribeRate: MetricWithTrend;
}

export interface MetricWithTrend {
  current: number;
  previous: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceComparison {
  current: CampaignMetrics;
  benchmark: CampaignMetrics;
  industry: CampaignMetrics;
}

export interface TrendData {
  date: Date;
  metrics: Record<string, number>;
}

export interface TimelineData {
  date: Date;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  type: string;
  description: string;
  count: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

// UI Component Types
export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: any;
  color?: 'blue' | 'teal' | 'green' | 'orange' | 'red' | 'purple' | 'indigo';
  trend?: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface SearchFilters {
  query?: string;
  status?: LeadStatus[];
  source?: LeadSource[];
  industry?: string[];
  scoreRange?: [number, number];
  dateRange?: DateRange;
  tags?: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: any;
}

export interface CSVUploadResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: CSVError[];
  leads: Partial<Lead>[];
}

export interface CSVError {
  row: number;
  field: string;
  value: string;
  error: string;
}

// Notification Types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}
