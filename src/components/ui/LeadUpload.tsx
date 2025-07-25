import React, { useState } from 'react';
import { X, Upload, FileText, Link } from 'lucide-react';
import { Button } from './Button';

interface LeadUploadProps {
  onClose: () => void;
}

export const LeadUpload: React.FC<LeadUploadProps> = ({ onClose }) => {
  const [uploadType, setUploadType] = useState<'csv' | 'linkedin'>('csv');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Leads</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadType('csv')}
              className={`flex-1 p-4 border-2 rounded-lg text-center transition-colors ${
                uploadType === 'csv'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-medium">CSV Upload</h3>
              <p className="text-sm text-gray-500">Upload leads from spreadsheet</p>
            </button>
            
            <button
              onClick={() => setUploadType('linkedin')}
              className={`flex-1 p-4 border-2 rounded-lg text-center transition-colors ${
                uploadType === 'linkedin'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Link className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-medium">LinkedIn URL</h3>
              <p className="text-sm text-gray-500">Import from LinkedIn profile</p>
            </button>
          </div>
          
          {uploadType === 'csv' ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse and upload
              </p>
              <Button>Choose File</Button>
              
              <div className="mt-6 text-left">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Include columns: Name, Email, Company</li>
                  <li>• Optional: Job Title, Phone, LinkedIn URL</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Supported formats: .csv, .xlsx</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  LinkedIn data extraction must comply with LinkedIn's Terms of Service. 
                  We use only publicly available information and respect rate limits.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            {uploadType === 'csv' ? 'Upload CSV' : 'Import from LinkedIn'}
          </Button>
        </div>
      </div>
    </div>
  );
};