import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Copy, Edit, Trash2, Eye, 
  Save, Send, FileText, Mail, Zap, Users, Star
} from 'lucide-react';
import { EmailTemplate, TemplateVariable, SearchFilters } from '../../types';
import { TEMPLATE_CATEGORIES, TEMPLATE_VARIABLES } from '../../constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal, ModalFooter } from '../ui/Modal';
import { Table, TableActionMenu } from '../ui/Table';
import { Card, StatsCard } from '../ui/Card';
import { Badge, StatusBadge } from '../ui/Badge';
import { Loading, SkeletonTable } from '../ui/Loading';

// Mock template data
const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Cold Outreach - Enterprise',
    subject: 'Quick question about {{company}} growth',
    content: `Hi {{firstName}},

I noticed {{company}} has been expanding rapidly in the {{industry}} space. Congratulations on your recent growth!

I'm reaching out because we've helped similar companies like {{company}} streamline their sales processes and increase revenue by an average of 30%.

Would you be open to a brief 15-minute call this week to discuss how we might be able to help {{company}} achieve similar results?

Best regards,
{{senderName}}`,
    category: 'cold_outreach',
    variables: [
      { name: 'firstName', description: 'Lead first name', required: true, defaultValue: '' },
      { name: 'company', description: 'Lead company name', required: true, defaultValue: '' },
      { name: 'industry', description: 'Company industry', required: false, defaultValue: 'technology' },
      { name: 'senderName', description: 'Sender name', required: true, defaultValue: 'John Doe' },
    ],
    isActive: true,
    tags: ['enterprise', 'cold-outreach', 'high-converting'],
    metrics: {
      timesUsed: 45,
      openRate: 52.3,
      clickRate: 12.8,
      replyRate: 8.9,
      conversionRate: 4.2,
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Follow-up - No Response',
    subject: 'Following up on my previous email',
    content: `Hi {{firstName}},

I wanted to follow up on my previous email about helping {{company}} with your sales process optimization.

I understand you're probably busy, but I believe this could be valuable for {{company}}. 

Would a quick 10-minute call work better for you? I'm happy to work around your schedule.

Best,
{{senderName}}`,
    category: 'follow_up',
    variables: [
      { name: 'firstName', description: 'Lead first name', required: true, defaultValue: '' },
      { name: 'company', description: 'Lead company name', required: true, defaultValue: '' },
      { name: 'senderName', description: 'Sender name', required: true, defaultValue: 'John Doe' },
    ],
    isActive: true,
    tags: ['follow-up', 'persistence'],
    metrics: {
      timesUsed: 32,
      openRate: 38.7,
      clickRate: 8.4,
      replyRate: 12.5,
      conversionRate: 6.3,
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
];

const mockStats = {
  totalTemplates: 15,
  activeTemplates: 12,
  avgOpenRate: 45.5,
  avgReplyRate: 10.7,
};

export const EmailTemplateEditor: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [loading, setLoading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState<EmailTemplate | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Template',
      sortable: true,
      render: (value: string, template: EmailTemplate) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{template.subject}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'metrics',
      label: 'Performance',
      render: (_, template: EmailTemplate) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900">
            {template.metrics.timesUsed} uses • {template.metrics.openRate}% open
          </div>
          <div className="text-sm text-gray-500">
            {template.metrics.replyRate}% reply • {template.metrics.conversionRate}% convert
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-900">
          {value.toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_, template: EmailTemplate) => (
        <TableActionMenu
          actions={[
            {
              label: 'Preview Template',
              icon: Eye,
              onClick: () => setShowPreview(template),
            },
            {
              label: 'Edit Template',
              icon: Edit,
              onClick: () => handleEditTemplate(template),
            },
            {
              label: 'Duplicate Template',
              icon: Copy,
              onClick: () => handleDuplicateTemplate(template),
            },
            {
              label: template.isActive ? 'Deactivate' : 'Activate',
              icon: template.isActive ? Trash2 : Star,
              onClick: () => handleToggleTemplate(template),
            },
            {
              label: 'Delete Template',
              icon: Trash2,
              variant: 'danger',
              onClick: () => handleDeleteTemplate(template),
            },
          ]}
        />
      ),
    },
  ];

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    console.log('Duplicate template:', template.id);
  };

  const handleToggleTemplate = (template: EmailTemplate) => {
    console.log('Toggle template:', template.id);
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    console.log('Delete template:', template.id);
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage reusable email templates for your campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={FileText}>
            Import Templates
          </Button>
          <Button onClick={handleCreateNew} size="sm" icon={Plus}>
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Templates"
          value={mockStats.totalTemplates.toString()}
          icon={Mail}
          color="blue"
        />
        <StatsCard
          title="Active Templates"
          value={mockStats.activeTemplates.toString()}
          change="+3 this month"
          changeType="positive"
          icon={Zap}
          color="green"
        />
        <StatsCard
          title="Avg Open Rate"
          value={`${mockStats.avgOpenRate}%`}
          change="+2.1% from last month"
          changeType="positive"
          icon={Eye}
          color="purple"
        />
        <StatsCard
          title="Avg Reply Rate"
          value={`${mockStats.avgReplyRate}%`}
          change="+1.3% from last month"
          changeType="positive"
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search templates by name or subject..."
              icon={Search}
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Select
              placeholder="All categories"
              options={TEMPLATE_CATEGORIES.map(category => ({
                label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
                value: category,
              }))}
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
            />
            <Select
              placeholder="All statuses"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              value={filters.status?.[0] || ''}
              onChange={(e) => setFilters({ 
                ...filters, 
                status: e.target.value ? [e.target.value as any] : undefined 
              })}
            />
          </div>
        </div>
      </Card>

      {/* Templates Table */}
      <Card>
        {loading ? (
          <SkeletonTable rows={8} columns={5} />
        ) : (
          <Table
            columns={columns}
            data={templates}
            selectedRows={selectedTemplates}
            onRowSelect={(id, selected) => {
              if (selected) {
                setSelectedTemplates([...selectedTemplates, id]);
              } else {
                setSelectedTemplates(selectedTemplates.filter(templateId => templateId !== id));
              }
            }}
            onSelectAll={(selected) => {
              setSelectedTemplates(selected ? templates.map(template => template.id) : []);
            }}
            sortable
            hoverable
            emptyMessage="No templates found. Create your first template to get started."
          />
        )}
      </Card>
    </div>
  );
};
