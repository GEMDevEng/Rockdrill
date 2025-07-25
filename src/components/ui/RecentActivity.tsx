import React from 'react';
import { Mail, Users, TrendingUp, AlertCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'email',
    title: 'Campaign "Q4 Outreach" sent',
    description: '247 emails delivered',
    time: '2 hours ago',
    icon: Mail,
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 2,
    type: 'leads',
    title: 'New leads enriched',
    description: '32 leads updated with contact data',
    time: '4 hours ago',
    icon: Users,
    color: 'text-teal-600 bg-teal-50'
  },
  {
    id: 3,
    type: 'analytics',
    title: 'Reply rate increased',
    description: 'Campaign performance up 12%',
    time: '6 hours ago',
    icon: TrendingUp,
    color: 'text-green-600 bg-green-50'
  },
  {
    id: 4,
    type: 'alert',
    title: 'CRM sync warning',
    description: 'Check HubSpot connection',
    time: '1 day ago',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-50'
  }
];

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
};