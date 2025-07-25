import React from 'react';
import { Button } from './Button';
import { Upload, Mail, BarChart3 } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Upload Leads
      </Button>
      <Button variant="outline" size="sm">
        <Mail className="h-4 w-4 mr-2" />
        New Campaign
      </Button>
      <Button size="sm">
        <BarChart3 className="h-4 w-4 mr-2" />
        View Analytics
      </Button>
    </div>
  );
};