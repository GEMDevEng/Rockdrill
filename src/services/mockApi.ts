import { 
  Lead, Campaign, EmailTemplate, User, AnalyticsData,
  SearchFilters, PaginationInfo, CSVUploadResult,
  CampaignMetrics, LeadMetrics, Integration
} from '../types';

// Demo mode flag
export const isDemoMode = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || 
         import.meta.env.VITE_API_URL?.includes('localhost') ||
         !import.meta.env.VITE_API_URL;
};

// Mock delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUser: User = {
  id: 'demo-user-1',
  email: 'demo@rockdrill.com',
  firstName: 'Demo',
  lastName: 'User',
  company: 'Rockdrill Demo',
  role: 'Sales Manager',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  lastLogin: new Date().toISOString(),
  timezone: 'America/New_York',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    theme: 'light'
  }
};

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp Inc.',
    title: 'VP of Sales',
    phone: '+1 (555) 123-4567',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    status: 'new',
    source: 'linkedin',
    tags: ['enterprise', 'decision-maker'],
    notes: 'Interested in AI automation solutions',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    lastContactedAt: null,
    score: 85,
    industry: 'Technology',
    companySize: '500-1000',
    location: 'San Francisco, CA'
  },
  {
    id: 'lead-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@innovate.co',
    company: 'Innovate Solutions',
    title: 'Marketing Director',
    phone: '+1 (555) 987-6543',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    status: 'contacted',
    source: 'website',
    tags: ['marketing', 'warm-lead'],
    notes: 'Responded to initial outreach, scheduling demo',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
    lastContactedAt: new Date('2024-01-22').toISOString(),
    score: 92,
    industry: 'Marketing',
    companySize: '100-500',
    location: 'New York, NY'
  },
  {
    id: 'lead-3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@startup.io',
    company: 'StartupIO',
    title: 'Founder & CEO',
    phone: '+1 (555) 456-7890',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    status: 'qualified',
    source: 'referral',
    tags: ['startup', 'founder', 'hot-lead'],
    notes: 'Very interested, ready to move forward with pilot program',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
    lastContactedAt: new Date('2024-01-24').toISOString(),
    score: 98,
    industry: 'Technology',
    companySize: '10-50',
    location: 'Austin, TX'
  }
];

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Q1 Enterprise Outreach',
    description: 'Targeting enterprise companies for Q1 sales goals',
    status: 'active',
    type: 'email',
    templateId: 'template-1',
    leadIds: ['lead-1', 'lead-2'],
    settings: {
      sendTime: '09:00',
      timezone: 'America/New_York',
      dailyLimit: 50,
      followUpDelay: 3
    },
    metrics: {
      sent: 150,
      delivered: 145,
      opened: 87,
      clicked: 23,
      replied: 8,
      bounced: 5
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    startedAt: new Date('2024-01-02').toISOString(),
    endedAt: null
  },
  {
    id: 'campaign-2',
    name: 'LinkedIn Connection Campaign',
    description: 'Building connections with potential prospects',
    status: 'paused',
    type: 'linkedin',
    templateId: 'template-2',
    leadIds: ['lead-3'],
    settings: {
      sendTime: '10:00',
      timezone: 'America/New_York',
      dailyLimit: 25,
      followUpDelay: 5
    },
    metrics: {
      sent: 75,
      delivered: 75,
      opened: 45,
      clicked: 12,
      replied: 5,
      bounced: 0
    },
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date().toISOString(),
    startedAt: new Date('2024-01-12').toISOString(),
    endedAt: null
  }
];

// Mock templates data
const mockTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Enterprise Introduction',
    subject: 'Streamline your sales process with AI automation',
    content: `Hi {{firstName}},

I noticed {{company}} has been growing rapidly in the {{industry}} space. Congratulations on your success!

I wanted to reach out because we've been helping companies like yours increase their sales efficiency by up to 40% through AI-powered automation.

Would you be interested in a quick 15-minute call to see how this could benefit {{company}}?

Best regards,
{{senderName}}`,
    variables: ['firstName', 'company', 'industry', 'senderName'],
    category: 'outreach',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    usageCount: 45
  },
  {
    id: 'template-2',
    name: 'LinkedIn Follow-up',
    subject: 'Following up on our LinkedIn connection',
    content: `Hi {{firstName}},

Thanks for connecting with me on LinkedIn! I see you're doing great work at {{company}}.

I'd love to learn more about your current sales challenges and share how we've helped similar companies in {{industry}} achieve their goals.

Are you available for a brief call this week?

Best,
{{senderName}}`,
    variables: ['firstName', 'company', 'industry', 'senderName'],
    category: 'follow-up',
    isActive: true,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    usageCount: 28
  }
];

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  overview: {
    totalLeads: 1247,
    totalCampaigns: 12,
    activeLeads: 892,
    conversionRate: 12.5,
    responseRate: 8.3,
    emailsSent: 5420,
    emailsOpened: 2156,
    emailsClicked: 543
  },
  trends: {
    leadsGenerated: [45, 52, 48, 61, 55, 67, 72],
    emailsSent: [120, 135, 142, 158, 163, 171, 185],
    responses: [8, 12, 9, 15, 13, 18, 22]
  },
  topCampaigns: [
    { name: 'Q1 Enterprise Outreach', performance: 85 },
    { name: 'LinkedIn Connection Campaign', performance: 72 },
    { name: 'Follow-up Sequence', performance: 68 }
  ],
  recentActivity: [
    { type: 'lead_created', description: 'New lead: John Smith from TechCorp', timestamp: new Date().toISOString() },
    { type: 'email_sent', description: 'Email sent to Sarah Johnson', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { type: 'campaign_started', description: 'Started Q1 Enterprise Outreach campaign', timestamp: new Date(Date.now() - 7200000).toISOString() }
  ]
};

// Mock integrations data
const mockIntegrations: Integration[] = [
  {
    id: 'integration-1',
    name: 'HubSpot CRM',
    type: 'crm',
    status: 'connected',
    description: 'Sync leads and contacts with HubSpot',
    config: {},
    lastSyncAt: new Date().toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'integration-2',
    name: 'LinkedIn Sales Navigator',
    type: 'social',
    status: 'disconnected',
    description: 'Import leads from LinkedIn Sales Navigator',
    config: {},
    lastSyncAt: null,
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  }
];

// Mock API implementation
export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await mockDelay();
      if (email === 'demo@rockdrill.com' && password === 'demo123') {
        const token = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { user: mockUser, token };
      }
      throw new Error('Invalid credentials. Use demo@rockdrill.com / demo123');
    },

    register: async (userData: Partial<User>) => {
      await mockDelay();
      const newUser = { ...mockUser, ...userData, id: 'demo-user-' + Date.now() };
      const token = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('auth_token', token);
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      return { user: newUser, token };
    },

    logout: async () => {
      await mockDelay();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('demo_user');
    },

    validateToken: async () => {
      await mockDelay();
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        return { user: JSON.parse(storedUser) };
      }
      throw new Error('Invalid token');
    }
  },

  user: {
    getProfile: async () => {
      await mockDelay();
      const storedUser = localStorage.getItem('demo_user');
      return storedUser ? JSON.parse(storedUser) : mockUser;
    },

    updateProfile: async (userData: Partial<User>) => {
      await mockDelay();
      const currentUser = JSON.parse(localStorage.getItem('demo_user') || JSON.stringify(mockUser));
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  },

  leads: {
    getLeads: async (filters?: SearchFilters, pagination?: Partial<PaginationInfo>) => {
      await mockDelay();
      return {
        leads: mockLeads,
        pagination: {
          page: 1,
          limit: 10,
          total: mockLeads.length,
          totalPages: 1
        }
      };
    },

    getLead: async (id: string) => {
      await mockDelay();
      const lead = mockLeads.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return lead;
    },

    createLead: async (leadData: Partial<Lead>) => {
      await mockDelay();
      const newLead: Lead = {
        id: 'lead-' + Date.now(),
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        title: '',
        status: 'new',
        source: 'manual',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: 50,
        ...leadData
      } as Lead;
      mockLeads.push(newLead);
      return newLead;
    }
  },

  campaigns: {
    getCampaigns: async () => {
      await mockDelay();
      return {
        campaigns: mockCampaigns,
        pagination: {
          page: 1,
          limit: 10,
          total: mockCampaigns.length,
          totalPages: 1
        }
      };
    },

    getCampaign: async (id: string) => {
      await mockDelay();
      const campaign = mockCampaigns.find(c => c.id === id);
      if (!campaign) throw new Error('Campaign not found');
      return campaign;
    }
  },

  templates: {
    getTemplates: async () => {
      await mockDelay();
      return {
        templates: mockTemplates,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTemplates.length,
          totalPages: 1
        }
      };
    }
  },

  analytics: {
    getOverview: async () => {
      await mockDelay();
      return mockAnalytics;
    }
  },

  integrations: {
    getIntegrations: async () => {
      await mockDelay();
      return mockIntegrations;
    }
  }
};
