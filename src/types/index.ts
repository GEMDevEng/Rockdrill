// Common types used throughout the application

export type Page = 'dashboard' | 'leads' | 'campaigns' | 'analytics' | 'templates' | 'settings' | 'research';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  status: 'new' | 'contacted' | 'replied' | 'qualified' | 'unqualified';
  source: 'csv' | 'linkedin' | 'manual';
  createdAt: string;
  lastContact?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads: number;
  sent: number;
  opened: number;
  replied: number;
  createdAt: string;
  lastModified: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  usage: number;
  openRate: number;
  replyRate: number;
  lastModified: string;
}

export interface Integration {
  name: string;
  status: 'connected' | 'disconnected' | 'warning';
  description: string;
  lastSync: string;
}

export interface MetricData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  color: 'blue' | 'teal' | 'green' | 'orange' | 'red';
}
