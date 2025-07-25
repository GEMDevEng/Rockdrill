import React, { useState, useEffect } from 'react';
import {
  Calendar, Download, Filter, TrendingUp, TrendingDown,
  Users, Mail, Eye, MousePointer, Reply, Target,
  BarChart3, PieChart, LineChart, Activity, Clock,
  Zap, Star, AlertCircle, CheckCircle
} from 'lucide-react';
import {
  AnalyticsData, CampaignMetrics, LeadMetrics,
  TimeRange, ChartData, PerformanceInsight
} from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Card, StatsCard } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loading, SkeletonChart } from '../ui/Loading';

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalLeads: 1247,
    totalCampaigns: 12,
    totalEmailsSent: 3456,
    totalEmailsOpened: 1543,
    totalEmailsClicked: 234,
    totalReplies: 156,
    totalConversions: 89,
    avgOpenRate: 44.6,
    avgClickRate: 6.8,
    avgReplyRate: 4.5,
    avgConversionRate: 2.6,
  },
  timeSeriesData: [
    { date: '2024-01-01', emailsSent: 45, emailsOpened: 20, emailsClicked: 3, replies: 2, conversions: 1 },
    { date: '2024-01-02', emailsSent: 52, emailsOpened: 25, emailsClicked: 4, replies: 3, conversions: 2 },
    { date: '2024-01-03', emailsSent: 38, emailsOpened: 18, emailsClicked: 2, replies: 1, conversions: 1 },
    { date: '2024-01-04', emailsSent: 61, emailsOpened: 28, emailsClicked: 5, replies: 4, conversions: 2 },
    { date: '2024-01-05', emailsSent: 47, emailsOpened: 22, emailsClicked: 3, replies: 2, conversions: 1 },
  ],
  campaignPerformance: [
    { campaignId: '1', name: 'Q1 Enterprise Outreach', emailsSent: 250, openRate: 52.3, clickRate: 12.8, replyRate: 8.9, conversionRate: 4.2 },
    { campaignId: '2', name: 'SaaS Startup Follow-up', emailsSent: 120, openRate: 41.5, clickRate: 9.8, replyRate: 6.1, conversionRate: 3.7 },
  ],
  leadSources: [
    { source: 'linkedin_url', count: 456, percentage: 36.6 },
    { source: 'csv_upload', count: 342, percentage: 27.4 },
    { source: 'manual_entry', count: 289, percentage: 23.2 },
    { source: 'api_import', count: 160, percentage: 12.8 },
  ],
  insights: [
    {
      type: 'positive',
      title: 'Open rates trending up',
      description: 'Your email open rates have increased by 15% over the last 30 days',
      metric: '+15%',
      recommendation: 'Continue using personalized subject lines',
    },
    {
      type: 'warning',
      title: 'Low click-through rates',
      description: 'Click rates are below industry average of 8%',
      metric: '6.8%',
      recommendation: 'Consider A/B testing your email content and CTAs',
    },
    {
      type: 'info',
      title: 'Best performing time',
      description: 'Emails sent between 9-11 AM have 23% higher open rates',
      metric: '23%',
      recommendation: 'Schedule more campaigns during this time window',
    },
  ],
};

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  const timeRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last 12 months', value: '12m' },
    { label: 'All time', value: 'all' },
  ];

  const handleExportReport = () => {
    console.log('Export analytics report');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Activity;
      default:
        return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your campaign performance and optimize results.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            icon={Calendar}
          />
          <Button variant="outline" size="sm" onClick={handleExportReport} icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={analyticsData.overview.totalLeads.toLocaleString()}
          change="+12% from last period"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Emails Sent"
          value={analyticsData.overview.totalEmailsSent.toLocaleString()}
          change="+8% from last period"
          changeType="positive"
          icon={Mail}
          color="green"
        />
        <StatsCard
          title="Open Rate"
          value={`${analyticsData.overview.avgOpenRate}%`}
          change="+3.2% from last period"
          changeType="positive"
          icon={Eye}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analyticsData.overview.avgConversionRate}%`}
          change="+1.1% from last period"
          changeType="positive"
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgClickRate}%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MousePointer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+2.1%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Reply Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgReplyRate}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Reply className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+1.8%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalCampaigns}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+2</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalConversions}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance Chart */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Email Performance Trends</h3>
              <Select
                options={[
                  { label: 'Emails Sent', value: 'sent' },
                  { label: 'Open Rate', value: 'opens' },
                  { label: 'Click Rate', value: 'clicks' },
                  { label: 'Reply Rate', value: 'replies' },
                ]}
                value="sent"
                onChange={() => {}}
                size="sm"
              />
            </div>
            {loading ? (
              <SkeletonChart />
            ) : (
              <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would be implemented here</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Lead Sources Chart */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Sources</h3>
            {loading ? (
              <SkeletonChart />
            ) : (
              <div className="space-y-4">
                {analyticsData.leadSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {source.source.charAt(0).toUpperCase() + source.source.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{source.count}</span>
                      <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 h-32 flex items-center justify-center border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-500">Pie chart visualization</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Emails Sent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Open Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Click Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reply Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.campaignPerformance.map((campaign) => (
                  <tr key={campaign.campaignId} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{campaign.emailsSent}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{campaign.openRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(campaign.openRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{campaign.clickRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${Math.min(campaign.clickRate * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{campaign.replyRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: `${Math.min(campaign.replyRate * 8, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{campaign.conversionRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-yellow-500 rounded-full"
                            style={{ width: `${Math.min(campaign.conversionRate * 15, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="space-y-4">
            {analyticsData.insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.type);

              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <Badge variant={insight.type === 'positive' ? 'success' : insight.type === 'warning' ? 'warning' : 'info'}>
                        {insight.metric}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                    <p className="text-blue-600 text-sm font-medium">
                      💡 {insight.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Time-based Performance */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Emails Sent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Opened</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Clicked</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Replies</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.timeSeriesData.map((data) => (
                  <tr key={data.date} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(data.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{data.emailsSent}</td>
                    <td className="py-3 px-4 text-gray-900">{data.emailsOpened}</td>
                    <td className="py-3 px-4 text-gray-900">{data.emailsClicked}</td>
                    <td className="py-3 px-4 text-gray-900">{data.replies}</td>
                    <td className="py-3 px-4 text-gray-900">{data.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};