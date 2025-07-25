import React from 'react';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './Button';

const integrations = [
  {
    name: 'HubSpot',
    status: 'connected',
    description: 'Sync leads and track interactions',
    lastSync: '2 minutes ago'
  },
  {
    name: 'Salesforce',
    status: 'disconnected',
    description: 'CRM integration for lead management',
    lastSync: 'Never'
  },
  {
    name: 'SendGrid',
    status: 'connected',
    description: 'Email service provider',
    lastSync: '5 minutes ago'
  },
  {
    name: 'LinkedIn',
    status: 'warning',
    description: 'Lead sourcing and research',
    lastSync: '1 hour ago'
  }
];

export const IntegrationSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
      
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {integration.status === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : integration.status === 'warning' ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              
              <div>
                <h4 className="font-medium text-gray-900">{integration.name}</h4>
                <p className="text-sm text-gray-500">{integration.description}</p>
                <p className="text-xs text-gray-400">Last sync: {integration.lastSync}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {integration.status === 'connected' ? (
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              ) : (
                <Button size="sm">
                  Connect
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};