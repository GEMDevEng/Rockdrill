import React from 'react';
import { Edit, Copy, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from './Button';

const templates = [
  {
    id: 1,
    name: 'Enterprise Cold Outreach',
    subject: 'Quick question about {{company_name}}',
    category: 'Cold Outreach',
    usage: 1247,
    openRate: 34.2,
    replyRate: 8.5,
    lastModified: '2024-01-15'
  },
  {
    id: 2,
    name: 'Follow-up #1',
    subject: 'Re: Partnership opportunity with {{company_name}}',
    category: 'Follow-up',
    usage: 892,
    openRate: 28.7,
    replyRate: 12.1,
    lastModified: '2024-01-14'
  },
  {
    id: 3,
    name: 'Social Proof Template',
    subject: 'How {{similar_company}} achieved 40% growth',
    category: 'Social Proof',
    usage: 567,
    openRate: 41.3,
    replyRate: 6.8,
    lastModified: '2024-01-12'
  }
];

export const TemplateList: React.FC = () => {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-900">{template.category}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Usage</p>
              <p className="font-semibold text-gray-900">{template.usage}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Open Rate</p>
              <p className="font-semibold text-green-600">{template.openRate}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Reply Rate</p>
              <p className="font-semibold text-blue-600">{template.replyRate}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Modified</p>
              <p className="font-semibold text-gray-900">{template.lastModified}</p>
            </div>
          </div>
          
          {/* Performance bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${template.openRate}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};