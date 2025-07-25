import React from 'react';
import { SettingsPanel } from '../ui/SettingsPanel';
import { IntegrationSettings } from '../ui/IntegrationSettings';
import { ICPSettings } from '../ui/ICPSettings';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your account, integrations, and preferences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SettingsPanel />
        </div>
        <div className="space-y-6">
          <IntegrationSettings />
          <ICPSettings />
        </div>
      </div>
    </div>
  );
};