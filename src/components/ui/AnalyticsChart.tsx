import React from 'react';

export const AnalyticsChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
          </select>
        </div>
      </div>
      
      {/* Multi-line chart representation */}
      <div className="h-80 relative">
        <div className="absolute inset-0 flex items-end justify-between">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1" style={{ width: '3%' }}>
              {/* Open rate line */}
              <div 
                className="w-full bg-blue-500 rounded-t-sm"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
              {/* Reply rate line */}
              <div 
                className="w-full bg-teal-500 rounded-t-sm"
                style={{ height: `${Math.random() * 30 + 10}%` }}
              />
            </div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Open Rate</span>
            <span className="text-sm font-semibold text-gray-900 ml-2">34.2%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Reply Rate</span>
            <span className="text-sm font-semibold text-gray-900 ml-2">8.4%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Conversion Rate</span>
            <span className="text-sm font-semibold text-gray-900 ml-2">2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};