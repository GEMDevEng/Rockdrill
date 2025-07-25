import React from 'react';
import { Building, Users, DollarSign, Calendar } from 'lucide-react';

export const CompanyInsights: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Insights</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Building className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium text-gray-900">Software Development</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-teal-500" />
          <div>
            <p className="text-sm text-gray-500">Employee Count</p>
            <p className="font-medium text-gray-900">500-1000</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <DollarSign className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Revenue Range</p>
            <p className="font-medium text-gray-900">$10M - $50M</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Founded</p>
            <p className="font-medium text-gray-900">2018</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Recent News</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Announced partnership with Microsoft Azure</p>
          <p>• Launched new AI-powered product suite</p>
          <p>• Opened new office in Austin, Texas</p>
        </div>
      </div>
    </div>
  );
};