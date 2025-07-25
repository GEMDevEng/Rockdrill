import React, { useState } from 'react';
import { TemplateList } from '../ui/TemplateList';
import { TemplateEditor } from '../ui/TemplateEditor';
import { Button } from '../ui/Button';
import { Plus, Copy } from 'lucide-react';

export const EmailTemplates: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage your email templates with AI assistance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button onClick={() => setShowEditor(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>
      
      <TemplateList />
      
      {showEditor && (
        <TemplateEditor onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
};