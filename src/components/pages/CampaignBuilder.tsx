import React, { useState } from 'react';
import { CampaignList } from '../ui/CampaignList';
import { CampaignWizard } from '../ui/CampaignWizard';
import { Button } from '../ui/Button';
import { Plus, Play, Pause } from 'lucide-react';

export const CampaignBuilder: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Builder</h1>
          <p className="text-gray-500 mt-1">Create and manage your email outreach campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start All
          </Button>
          <Button variant="outline" size="sm">
            <Pause className="h-4 w-4 mr-2" />
            Pause All
          </Button>
          <Button onClick={() => setShowWizard(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>
      
      <CampaignList />
      
      {showWizard && (
        <CampaignWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  );
};