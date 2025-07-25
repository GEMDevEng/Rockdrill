import React from 'react';
import { ResearchPanel } from '../ui/ResearchPanel';
import { SignalDetection } from '../ui/SignalDetection';
import { CompanyInsights } from '../ui/CompanyInsights';

export const Research: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Research</h1>
          <p className="text-gray-500 mt-1">AI-powered lead research and buying signal detection.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResearchPanel />
        </div>
        <div className="space-y-6">
          <SignalDetection />
          <CompanyInsights />
        </div>
      </div>
    </div>
  );
};