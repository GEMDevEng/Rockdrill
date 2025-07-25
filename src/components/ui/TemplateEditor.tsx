import React, { useState } from 'react';
import { X, Save, Eye, Zap } from 'lucide-react';
import { Button } from './Button';

interface TemplateEditorProps {
  onClose: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const placeholders = [
    '{{lead_name}}',
    '{{company_name}}',
    '{{job_title}}',
    '{{industry}}',
    '{{company_news}}',
    '{{mutual_connection}}',
    '{{recent_funding}}',
    '{{company_size}}'
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Email Template Editor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex">
          {/* Editor */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="Enter template name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject line with placeholders..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <textarea
                  rows={12}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your email template here. Use placeholders like {{lead_name}} for personalization..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Assist
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-80 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Available Placeholders</h3>
                <div className="space-y-2">
                  {placeholders.map((placeholder, index) => (
                    <button
                      key={index}
                      onClick={() => setBody(body + ' ' + placeholder)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {placeholder}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Best Practices</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Keep subject lines under 50 characters</p>
                  <p>• Personalize with at least 2 data points</p>
                  <p>• Include a clear call-to-action</p>
                  <p>• Maintain a conversational tone</p>
                  <p>• Always include an unsubscribe link</p>
                </div>
              </div>
              
              {showPreview && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Preview</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="mb-2">
                      <strong>Subject:</strong> {subject || 'Enter subject line'}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {body || 'Enter email body'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
};