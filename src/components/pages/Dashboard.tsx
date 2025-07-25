import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { Chart } from '../ui/Chart';
import { RecentActivity } from '../ui/RecentActivity';
import { QuickActions } from '../ui/QuickActions';
import { Users, Mail, TrendingUp, Target } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <QuickActions />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value="2,847"
          change="+12%"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Emails Sent"
          value="18,293"
          change="+8%"
          changeType="positive"
          icon={Mail}
          color="teal"
        />
        <MetricCard
          title="Reply Rate"
          value="8.4%"
          change="+2.1%"
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Conversions"
          value="147"
          change="+18%"
          changeType="positive"
          icon={Target}
          color="orange"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};