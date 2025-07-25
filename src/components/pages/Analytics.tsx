import React from 'react';
import { AnalyticsChart } from '../ui/AnalyticsChart';
import { PerformanceMetrics } from '../ui/PerformanceMetrics';
import { CampaignComparison } from '../ui/CampaignComparison';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your campaign performance and optimize results.</p>
        </div>
      </div>
      
      <PerformanceMetrics />
      <AnalyticsChart />
      <CampaignComparison />
    </div>
  );
};