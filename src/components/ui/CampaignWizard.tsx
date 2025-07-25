import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface CampaignWizardProps {
  onClose: () => void;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    'Campaign Details',
    'Select Leads',
    'Email Sequence',
    'Schedule & Launch'
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                placeholder="Enter campaign name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your campaign objectives..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Cold Outreach</option>
                <option>Follow-up</option>
                <option>Re-engagement</option>
                <option>Product Launch</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Lead Selection Criteria</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Score
                  </label>
                  <input
                    type="number"
                    placeholder="70"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All</option>
                    <option>New</option>
                    <option>No Reply</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Matching Leads</h4>
              <p className="text-sm text-gray-600 mb-2">247 leads match your criteria</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>High Score (80+)</span>
                  <span className="font-medium">89 leads</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Medium Score (60-79)</span>
                  <span className="font-medium">124 leads</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Low Score (below 60)</span>
                  <span className="font-medium">34 leads</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Email Sequence
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Enterprise 5-Touch Sequence</option>
                <option>Startup 3-Touch Sequence</option>
                <option>Follow-up 2-Touch Sequence</option>
                <option>Create New Sequence</option>
              </select>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Sequence Preview</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Email 1: Initial Outreach</p>
                    <p className="text-xs text-gray-500">Sent immediately</p>
                  </div>
                  <span className="text-xs text-gray-400">Day 0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Email 2: Value Proposition</p>
                    <p className="text-xs text-gray-500">Follow-up email</p>
                  </div>
                  <span className="text-xs text-gray-400">Day 3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Email 3: Social Proof</p>
                    <p className="text-xs text-gray-500">Case study share</p>
                  </div>
                  <span className="text-xs text-gray-400">Day 7</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Time
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Local Time</option>
                  <option>UTC</option>
                  <option>EST</option>
                  <option>PST</option>
                </select>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Campaign Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• 247 leads selected</p>
                <p>• 5-touch email sequence</p>
                <p>• Estimated completion: 14 days</p>
                <p>• Daily send limit: 100 emails</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Campaign</h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of {totalSteps}: {steps[step - 1]}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {steps.map((stepName, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index + 1 < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {renderStep()}
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step > 1 ? (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </>
            ) : (
              'Cancel'
            )}
          </Button>
          
          <Button
            onClick={() => step < totalSteps ? setStep(step + 1) : onClose()}
          >
            {step < totalSteps ? (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'Launch Campaign'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};