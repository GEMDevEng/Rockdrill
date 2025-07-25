import React from 'react';
import { Play, Pause, MoreHorizontal, Users, Mail, TrendingUp } from 'lucide-react';
import { Button } from './Button';

const campaigns = [
  {
    id: 1,
    name: 'Q4 Enterprise Outreach',
    status: 'Active',
    leads: 247,
    sent: 1834,
    replies: 156,
    openRate: 34.2,
    replyRate: 8.5,
    startDate: '2024-01-10',
    sequence: 'Enterprise 5-Touch'
  },
  {
    id: 2,
    name: 'Startup Founders Campaign',
    status: 'Paused',
    leads: 89,
    sent: 312,
    replies: 28,
    openRate: 28.7,
    replyRate: 9.0,
    startDate: '2024-01-08',
    sequence: 'Founder Outreach 3-Touch'
  },
  {
    id: 3,
    name: 'Product Launch Follow-up',
    status: 'Draft',
    leads: 156,
    sent: 0,
    replies: 0,
    openRate: 0,
    replyRate: 0,
    startDate: '2024-01-15',
    sequence: 'Product Launch 4-Touch'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'text-green-700 bg-green-50';
    case 'Paused': return 'text-yellow-700 bg-yellow-50';
    case 'Draft': return 'text-gray-700 bg-gray-50';
    default: return 'text-gray-700 bg-gray-50';
  }
};

export const CampaignList: React.FC = () => {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {campaign.status === 'Active' ? (
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Leads</p>
                <p className="font-semibold text-gray-900">{campaign.leads}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Sent</p>
                <p className="font-semibold text-gray-900">{campaign.sent}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Replies</p>
                <p className="font-semibold text-gray-900">{campaign.replies}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Open Rate</p>
              <p className="font-semibold text-gray-900">{campaign.openRate}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Reply Rate</p>
              <p className="font-semibold text-gray-900">{campaign.replyRate}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Sequence</p>
              <p className="font-semibold text-gray-900 text-sm">{campaign.sequence}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Started {campaign.startDate}</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};