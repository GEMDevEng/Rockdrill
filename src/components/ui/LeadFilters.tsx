import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

export const LeadFilters: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name, company, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Replied</option>
            <option>Qualified</option>
          </select>
          
          <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Scores</option>
            <option>80-100</option>
            <option>60-79</option>
            <option>Below 60</option>
          </select>
          
          <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
          
          <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </button>
        </div>
      </div>
    </div>
  );
};