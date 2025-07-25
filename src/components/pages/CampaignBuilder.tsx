import React, { useState, useEffect } from 'react';
import {
  Plus, Play, Pause, Search, Filter, Copy, Edit,
  Trash2, BarChart3, Users, Mail, Calendar,
  Settings, Eye, TrendingUp, Clock
} from 'lucide-react';
import { Campaign, CampaignMetrics, SearchFilters } from '../../types';
import { CAMPAIGN_STATUSES, CAMPAIGN_TYPES } from '../../constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal, ModalFooter } from '../ui/Modal';
import { Table, TableActionMenu } from '../ui/Table';
import { Card, StatsCard } from '../ui/Card';
import { Badge, StatusBadge } from '../ui/Badge';
import { Loading, SkeletonTable } from '../ui/Loading';
import { Pagination } from '../ui/Pagination';

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Q1 Enterprise Outreach',
    description: 'Targeting enterprise companies for Q1 sales push',
    status: 'active',
    type: 'email_sequence',
    leads: ['lead1', 'lead2', 'lead3'],
    emailTemplates: ['template1', 'template2'],
    schedule: {
      startDate: new Date('2024-01-15'),
      timezone: 'America/New_York',
      sendTimes: [
        { day: 1, startTime: '09:00', endTime: '11:00' },
        { day: 2, startTime: '09:00', endTime: '11:00' },
      ],
      frequency: 'daily',
      delays: [
        { stepNumber: 1, delayDays: 0, delayHours: 0 },
        { stepNumber: 2, delayDays: 3, delayHours: 0 },
      ],
    },
    settings: {
      maxEmailsPerDay: 50,
      respectUnsubscribes: true,
      trackOpens: true,
      trackClicks: true,
      autoFollowUp: true,
      stopOnReply: true,
      personalizeSubject: true,
      personalizeContent: true,
    },
    metrics: {
      totalLeads: 250,
      emailsSent: 180,
      emailsDelivered: 175,
      emailsOpened: 89,
      emailsClicked: 23,
      emailsReplied: 12,
      emailsBounced: 5,
      unsubscribes: 2,
      conversions: 8,
      openRate: 50.9,
      clickRate: 13.1,
      replyRate: 6.9,
      conversionRate: 4.6,
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    startedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'SaaS Startup Follow-up',
    description: 'Follow-up sequence for SaaS startup leads',
    status: 'paused',
    type: 'follow_up',
    leads: ['lead4', 'lead5'],
    emailTemplates: ['template3'],
    schedule: {
      startDate: new Date('2024-01-20'),
      timezone: 'America/New_York',
      sendTimes: [
        { day: 3, startTime: '10:00', endTime: '12:00' },
      ],
      frequency: 'weekly',
      delays: [
        { stepNumber: 1, delayDays: 7, delayHours: 0 },
      ],
    },
    settings: {
      maxEmailsPerDay: 25,
      respectUnsubscribes: true,
      trackOpens: true,
      trackClicks: true,
      autoFollowUp: false,
      stopOnReply: true,
      personalizeSubject: false,
      personalizeContent: true,
    },
    metrics: {
      totalLeads: 120,
      emailsSent: 85,
      emailsDelivered: 82,
      emailsOpened: 34,
      emailsClicked: 8,
      emailsReplied: 5,
      emailsBounced: 3,
      unsubscribes: 1,
      conversions: 3,
      openRate: 41.5,
      clickRate: 9.8,
      replyRate: 6.1,
      conversionRate: 3.7,
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    startedAt: new Date('2024-01-20'),
  },
];

const mockStats = {
  totalCampaigns: 12,
  activeCampaigns: 5,
  totalLeads: 1247,
  avgOpenRate: 45.2,
};

export const CampaignBuilder: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [loading, setLoading] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showCampaignDetail, setShowCampaignDetail] = useState<Campaign | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Campaign',
      sortable: true,
      render: (value: string, campaign: Campaign) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{campaign.description}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'metrics',
      label: 'Performance',
      render: (_, campaign: Campaign) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900">
            {campaign.metrics.emailsSent} sent • {campaign.metrics.openRate}% open
          </div>
          <div className="text-sm text-gray-500">
            {campaign.metrics.emailsReplied} replies • {campaign.metrics.conversions} conversions
          </div>
        </div>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      sortable: true,
      render: (value: string[]) => (
        <div className="text-sm text-gray-900">{value.length}</div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
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
      render: (_, campaign: Campaign) => (
        <TableActionMenu
          actions={[
            {
              label: 'View Details',
              icon: Eye,
              onClick: () => setShowCampaignDetail(campaign),
            },
            {
              label: 'View Analytics',
              icon: BarChart3,
              onClick: () => handleViewAnalytics(campaign),
            },
            {
              label: campaign.status === 'active' ? 'Pause Campaign' : 'Start Campaign',
              icon: campaign.status === 'active' ? Pause : Play,
              onClick: () => handleToggleCampaign(campaign),
            },
            {
              label: 'Duplicate Campaign',
              icon: Copy,
              onClick: () => handleDuplicateCampaign(campaign),
            },
            {
              label: 'Edit Campaign',
              icon: Edit,
              onClick: () => handleEditCampaign(campaign),
            },
            {
              label: 'Delete Campaign',
              icon: Trash2,
              variant: 'danger',
              onClick: () => handleDeleteCampaign(campaign),
            },
          ]}
        />
      ),
    },
  ];

  const handleViewAnalytics = (campaign: Campaign) => {
    console.log('View analytics for:', campaign.id);
  };

  const handleToggleCampaign = (campaign: Campaign) => {
    console.log('Toggle campaign:', campaign.id);
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    console.log('Duplicate campaign:', campaign.id);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    console.log('Edit campaign:', campaign.id);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    console.log('Delete campaign:', campaign.id);
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for campaigns:', selectedCampaigns);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Builder</h1>
          <p className="text-gray-500 mt-1">Create and manage your email outreach campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" icon={Play}>
            Start All
          </Button>
          <Button variant="outline" size="sm" icon={Pause}>
            Pause All
          </Button>
          <Button onClick={() => setShowWizard(true)} size="sm" icon={Plus}>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Campaigns"
          value={mockStats.totalCampaigns.toString()}
          icon={Mail}
          color="blue"
        />
        <StatsCard
          title="Active Campaigns"
          value={mockStats.activeCampaigns.toString()}
          change="+2 this week"
          changeType="positive"
          icon={Play}
          color="green"
        />
        <StatsCard
          title="Total Leads"
          value={mockStats.totalLeads.toLocaleString()}
          change="+15% from last month"
          changeType="positive"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Avg Open Rate"
          value={`${mockStats.avgOpenRate}%`}
          change="+3.2% from last month"
          changeType="positive"
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search campaigns by name or description..."
              icon={Search}
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Select
              placeholder="All statuses"
              options={CAMPAIGN_STATUSES.map(status => ({
                label: status.charAt(0).toUpperCase() + status.slice(1),
                value: status,
              }))}
              value={filters.status?.[0] || ''}
              onChange={(e) => setFilters({
                ...filters,
                status: e.target.value ? [e.target.value as any] : undefined
              })}
            />
            <Select
              placeholder="All types"
              options={CAMPAIGN_TYPES.map(type => ({
                label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
                value: type,
              }))}
              value={filters.type || ''}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            />
            {selectedCampaigns.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('start')}
                  icon={Play}
                >
                  Start ({selectedCampaigns.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('pause')}
                  icon={Pause}
                >
                  Pause ({selectedCampaigns.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Campaigns Table */}
      <Card>
        {loading ? (
          <SkeletonTable rows={8} columns={6} />
        ) : (
          <Table
            columns={columns}
            data={campaigns}
            selectedRows={selectedCampaigns}
            onRowSelect={(id, selected) => {
              if (selected) {
                setSelectedCampaigns([...selectedCampaigns, id]);
              } else {
                setSelectedCampaigns(selectedCampaigns.filter(campaignId => campaignId !== id));
              }
            }}
            onSelectAll={(selected) => {
              setSelectedCampaigns(selected ? campaigns.map(campaign => campaign.id) : []);
            }}
            sortable
            hoverable
            emptyMessage="No campaigns found. Create your first campaign to get started."
          />
        )}
      </Card>

      {/* Campaign Wizard Modal */}
      {showWizard && (
        <Modal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          title="Create New Campaign"
          size="xl"
        >
          <div className="space-y-6">
            <p className="text-gray-600">
              Create a new email outreach campaign to engage with your leads automatically.
            </p>
            {/* CampaignWizard component would go here */}
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Campaign wizard will be implemented here</p>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowWizard(false)}>
              Cancel
            </Button>
            <Button>
              Create Campaign
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Campaign Detail Modal */}
      {showCampaignDetail && (
        <Modal
          isOpen={!!showCampaignDetail}
          onClose={() => setShowCampaignDetail(null)}
          title={showCampaignDetail.name}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{showCampaignDetail.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={showCampaignDetail.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <div className="mt-1">
                      <StatusBadge status={showCampaignDetail.type} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Leads</label>
                    <p className="text-gray-900">{showCampaignDetail.leads.length}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">
                        {showCampaignDetail.metrics.emailsSent}
                      </div>
                      <div className="text-sm text-blue-600">Emails Sent</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">
                        {showCampaignDetail.metrics.openRate}%
                      </div>
                      <div className="text-sm text-green-600">Open Rate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600">
                        {showCampaignDetail.metrics.clickRate}%
                      </div>
                      <div className="text-sm text-purple-600">Click Rate</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-semibold text-yellow-600">
                        {showCampaignDetail.metrics.replyRate}%
                      </div>
                      <div className="text-sm text-yellow-600">Reply Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowCampaignDetail(null)}>
              Close
            </Button>
            <Button onClick={() => handleEditCampaign(showCampaignDetail)}>
              Edit Campaign
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};