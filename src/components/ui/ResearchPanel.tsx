import React from 'react';
import { Search, ExternalLink, TrendingUp, Users, Building } from 'lucide-react';
import { Button } from './Button';

export const ResearchPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Lead Research</h3>
        <Button size="sm">
          <Search className="h-4 w-4 mr-2" />
          Research Selected
        </Button>
      </div>
      
      {/* Research Results */}
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">SJ</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                <p className="text-sm text-gray-500">VP of Engineering at TechCorp Inc.</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Company Size</p>
                <p className="text-sm font-medium">500-1000 employees</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Recent Funding</p>
                <p className="text-sm font-medium">Series B ($25M)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">Engineering (150)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-900 mb-2">Recent Activity</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Posted about scaling engineering teams on LinkedIn (3 days ago)</li>
              <li>• Company announced new product launch (1 week ago)</li>
              <li>• Spoke at DevOps conference about infrastructure (2 weeks ago)</li>
            </ul>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">MC</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Michael Chen</h4>
                <p className="text-sm text-gray-500">CTO at StartupXYZ</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Company Size</p>
                <p className="text-sm font-medium">50-100 employees</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Recent Funding</p>
                <p className="text-sm font-medium">Seed ($5M)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tech Stack</p>
                <p className="text-sm font-medium">React, Node.js, AWS</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h5 className="font-medium text-green-900 mb-2">Buying Signals</h5>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Company is actively hiring developers (5 open positions)</li>
              <li>• Recently switched from on-premise to cloud infrastructure</li>
              <li>• Posted about need for better development tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};