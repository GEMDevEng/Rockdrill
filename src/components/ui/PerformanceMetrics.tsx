import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const metrics = [
  {
    label: 'Total Campaigns',
    value: '24',
    change: '+3',
    trend: 'up',
    period: 'vs last month'
  },
  {
    label: 'Average Open Rate',
    value: '34.2%',
    change: '+2.1%',
    trend: 'up',
    period: 'vs last month'
  },
  {
    label: 'Average Reply Rate',
    value: '8.4%',
    change: '+0.8%',
    trend: 'up',
    period: 'vs last month'
  },
  {
    label: 'Conversion Rate',
    value: '2.1%',
    change: '-0.3%',
    trend: 'down',
    period: 'vs last month'
  }
];

export const PerformanceMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metric.change}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{metric.period}</p>
        </div>
      ))}
    </div>
  );
};