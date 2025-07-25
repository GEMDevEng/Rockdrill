import React, { useState } from 'react';
import { LeadTable } from '../ui/LeadTable';
import { LeadUpload } from '../ui/LeadUpload';
import { LeadFilters } from '../ui/LeadFilters';
import { Button } from '../ui/Button';
import { Upload, Download, Plus, RefreshCw } from 'lucide-react';

export const LeadManagement: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 mt-1">Manage your sales prospects and enrich lead data.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync CRM
          </Button>
          <Button onClick={() => setShowUpload(true)} size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Leads
          </Button>
        </div>
      </div>
      
      <LeadFilters />
      <LeadTable />
      
      {showUpload && (
        <LeadUpload onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
};