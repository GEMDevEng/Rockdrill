import React, { useState, useEffect } from 'react';
import {
  Upload, Download, Plus, RefreshCw, Search, Filter,
  MoreHorizontal, Eye, Edit, Trash2, Mail, Phone,
  ExternalLink, Star, StarOff, Users, TrendingUp
} from 'lucide-react';
import { Lead, SearchFilters, PaginationInfo } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal, ModalFooter } from '../ui/Modal';
import { Table, TableActionMenu } from '../ui/Table';
import { Card, StatsCard } from '../ui/Card';
import { Badge, StatusBadge, ScoreBadge } from '../ui/Badge';
import { Loading, SkeletonTable } from '../ui/Loading';
import { Pagination } from '../ui/Pagination';

// Mock data for development
const mockLeads: Lead[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp Inc.',
    jobTitle: 'VP of Sales',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    phone: '+1-555-0123',
    industry: 'Technology',
    companySize: '100-500',
    location: 'San Francisco, CA',
    score: 85,
    status: 'qualified',
    source: 'linkedin_url',
    tags: ['enterprise', 'hot-lead'],
    customFields: {},
    interactions: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastContactedAt: new Date('2024-01-18'),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovate.co',
    company: 'Innovate Solutions',
    jobTitle: 'Marketing Director',
    industry: 'Marketing',
    companySize: '50-100',
    location: 'New York, NY',
    score: 72,
    status: 'contacted',
    source: 'csv_upload',
    tags: ['mid-market'],
    customFields: {},
    interactions: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
];

const mockStats = {
  totalLeads: 1247,
  qualifiedLeads: 342,
  activeLeads: 89,
  conversionRate: 12.5,
};

export const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [loading, setLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 25,
    total: mockStats.totalLeads,
    totalPages: Math.ceil(mockStats.totalLeads / 25),
    hasNext: true,
    hasPrev: false,
  });

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, lead: Lead) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (value: string, lead: Lead) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{lead.jobTitle}</div>
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
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (value: number) => <ScoreBadge score={value} />,
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      label: 'Added',
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
      render: (_, lead: Lead) => (
        <TableActionMenu
          actions={[
            {
              label: 'View Details',
              icon: Eye,
              onClick: () => setShowLeadDetail(lead),
            },
            {
              label: 'Send Email',
              icon: Mail,
              onClick: () => handleSendEmail(lead),
            },
            {
              label: 'Call Lead',
              icon: Phone,
              onClick: () => handleCallLead(lead),
            },
            {
              label: 'Edit Lead',
              icon: Edit,
              onClick: () => handleEditLead(lead),
            },
            {
              label: 'Delete Lead',
              icon: Trash2,
              variant: 'danger',
              onClick: () => handleDeleteLead(lead),
            },
          ]}
        />
      ),
    },
  ];

  const handleSendEmail = (lead: Lead) => {
    console.log('Send email to:', lead.email);
  };

  const handleCallLead = (lead: Lead) => {
    console.log('Call lead:', lead.phone);
  };

  const handleEditLead = (lead: Lead) => {
    console.log('Edit lead:', lead.id);
  };

  const handleDeleteLead = (lead: Lead) => {
    console.log('Delete lead:', lead.id);
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for leads:', selectedLeads);
  };

  const handleExport = () => {
    console.log('Export leads');
  };

  const handleSyncCRM = () => {
    console.log('Sync with CRM');
  };

  const handleEnrichLeads = () => {
    console.log('Enrich selected leads');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 mt-1">Manage your sales prospects and enrich lead data.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExport} icon={Download}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleSyncCRM} icon={RefreshCw}>
            Sync CRM
          </Button>
          <Button onClick={() => setShowUpload(true)} size="sm" icon={Upload}>
            Upload Leads
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={mockStats.totalLeads.toLocaleString()}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Qualified Leads"
          value={mockStats.qualifiedLeads.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={Star}
          color="green"
        />
        <StatsCard
          title="Active Leads"
          value={mockStats.activeLeads.toLocaleString()}
          change="+5% from last week"
          changeType="positive"
          icon={TrendingUp}
          color="yellow"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${mockStats.conversionRate}%`}
          change="+2.1% from last month"
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search leads by name, email, or company..."
              icon={Search}
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
            >
              Filters
            </Button>
            {selectedLeads.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('enrich')}
                  icon={RefreshCw}
                >
                  Enrich ({selectedLeads.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  icon={Trash2}
                >
                  Delete ({selectedLeads.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Status"
                placeholder="All statuses"
                options={LEAD_STATUSES.map(status => ({
                  label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
                  value: status,
                }))}
                value={filters.status?.[0] || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  status: e.target.value ? [e.target.value as any] : undefined
                })}
              />
              <Select
                label="Source"
                placeholder="All sources"
                options={LEAD_SOURCES.map(source => ({
                  label: source.charAt(0).toUpperCase() + source.slice(1).replace('_', ' '),
                  value: source,
                }))}
                value={filters.source?.[0] || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  source: e.target.value ? [e.target.value as any] : undefined
                })}
              />
              <Input
                label="Industry"
                placeholder="Filter by industry"
                value={filters.industry?.[0] || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  industry: e.target.value ? [e.target.value] : undefined
                })}
              />
              <div className="flex items-end space-x-2">
                <Button variant="outline" size="sm" fullWidth>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Leads Table */}
      <Card>
        {loading ? (
          <SkeletonTable rows={10} columns={6} />
        ) : (
          <Table
            columns={columns}
            data={leads}
            selectedRows={selectedLeads}
            onRowSelect={(id, selected) => {
              if (selected) {
                setSelectedLeads([...selectedLeads, id]);
              } else {
                setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
              }
            }}
            onSelectAll={(selected) => {
              setSelectedLeads(selected ? leads.map(lead => lead.id) : []);
            }}
            sortable
            hoverable
            emptyMessage="No leads found. Upload some leads to get started."
          />
        )}
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onItemsPerPageChange={(limit) => setPagination({
          ...pagination,
          limit,
          totalPages: Math.ceil(pagination.total / limit)
        })}
      />

      {/* Upload Modal */}
      {showUpload && (
        <Modal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          title="Upload Leads"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Upload a CSV file with your leads. Make sure your file includes columns for name, email, and company.
            </p>
            {/* LeadUpload component would go here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Drag and drop your CSV file here, or click to browse</p>
              <Button variant="outline" size="sm" className="mt-4">
                Choose File
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetail && (
        <Modal
          isOpen={!!showLeadDetail}
          onClose={() => setShowLeadDetail(null)}
          title={`${showLeadDetail.name} - ${showLeadDetail.company}`}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{showLeadDetail.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{showLeadDetail.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                    {showLeadDetail.linkedinUrl ? (
                      <a
                        href={showLeadDetail.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View Profile <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    ) : (
                      <p className="text-gray-900">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Lead Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={showLeadDetail.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Score</label>
                    <div className="mt-1">
                      <ScoreBadge score={showLeadDetail.score} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Source</label>
                    <div className="mt-1">
                      <StatusBadge status={showLeadDetail.source} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowLeadDetail(null)}>
              Close
            </Button>
            <Button onClick={() => handleEditLead(showLeadDetail)}>
              Edit Lead
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};