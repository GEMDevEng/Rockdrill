import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const signals = [
  {
    id: 1,
    type: 'funding',
    title: 'Recent Funding Round',
    description: 'TechCorp raised $25M Series B',
    confidence: 95,
    priority: 'high',
    timeAgo: '3 days ago'
  },
  {
    id: 2,
    type: 'hiring',
    title: 'Active Hiring',
    description: 'StartupXYZ posted 5 new dev positions',
    confidence: 87,
    priority: 'medium',
    timeAgo: '1 week ago'
  },
  {
    id: 3,
    type: 'technology',
    title: 'Tech Stack Change',
    description: 'Migration from legacy to cloud',
    confidence: 72,
    priority: 'medium',
    timeAgo: '2 weeks ago'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-700 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-700 bg-green-50 border-green-200';
    default: return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'funding': return TrendingUp;
    case 'hiring': return CheckCircle;
    case 'technology': return AlertCircle;
    default: return AlertCircle;
  }
};

export const SignalDetection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Buying Signals</h3>
      
      <div className="space-y-4">
        {signals.map((signal) => {
          const Icon = getIcon(signal.type);
          return (
          <div key={signal.id} className={`border rounded-lg p-4 ${getPriorityColor(signal.priority)}`}>
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">{signal.title}</h4>
                <p className="text-sm opacity-90 mb-2">{signal.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>Confidence: {signal.confidence}%</span>
                  <span>{signal.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all signals
      </button>
    </div>
  );
};