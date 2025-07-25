import React from 'react';
import { MoreHorizontal, Star, Mail, ExternalLink } from 'lucide-react';
import { Button } from './Button';

const leads = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    email: 'sarah.johnson@techcorp.com',
    score: 85,
    status: 'New',
    lastContact: '2024-01-15',
    tags: ['Enterprise', 'Decision Maker']
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'StartupXYZ',
    email: 'michael@startupxyz.com',
    score: 72,
    status: 'Contacted',
    lastContact: '2024-01-14',
    tags: ['Startup', 'Technical']
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    company: 'Global Solutions',
    email: 'emily.r@globalsolutions.com',
    score: 91,
    status: 'Replied',
    lastContact: '2024-01-13',
    tags: ['Hot Lead', 'Enterprise']
  },
  {
    id: 4,
    name: 'David Kim',
    company: 'Innovation Labs',
    email: 'david.kim@innovationlabs.io',
    score: 68,
    status: 'New',
    lastContact: '2024-01-12',
    tags: ['Mid-Market', 'Product']
  }
];

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-700 bg-green-50';
  if (score >= 60) return 'text-yellow-700 bg-yellow-50';
  return 'text-red-700 bg-red-50';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'text-blue-700 bg-blue-50';
    case 'Contacted': return 'text-yellow-700 bg-yellow-50';
    case 'Replied': return 'text-green-700 bg-green-50';
    default: return 'text-gray-700 bg-gray-50';
  }
};

export const LeadTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                  <div className="flex space-x-1 mt-1">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.lastContact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};