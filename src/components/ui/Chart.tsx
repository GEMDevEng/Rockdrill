import React from 'react';

export const Chart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>
      
      {/* Simplified chart representation */}
      <div className="h-64 flex items-end space-x-2">
        {[65, 45, 78, 52, 84, 67, 91].map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span className="text-gray-600">Open Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded-full mr-2" />
            <span className="text-gray-600">Reply Rate</span>
          </div>
        </div>
        <span className="text-gray-900 font-medium">34.2% avg open rate</span>
      </div>
    </div>
  );
};