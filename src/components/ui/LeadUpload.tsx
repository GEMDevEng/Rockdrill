import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Link, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { FileUpload, CSVUploadResult, Lead } from '../../types';
import { FILE_UPLOAD_LIMITS } from '../../constants';
import { Button } from './Button';
import { Input } from './Input';
import { Modal, ModalFooter } from './Modal';
import { Loading } from './Loading';
import { Badge } from './Badge';

interface LeadUploadProps {
  onClose: () => void;
  onUploadComplete?: (leads: Partial<Lead>[]) => void;
}

export const LeadUpload: React.FC<LeadUploadProps> = ({ onClose, onUploadComplete }) => {
  const [uploadType, setUploadType] = useState<'csv' | 'linkedin' | 'manual'>('csv');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    // Validate file size
    if (selectedFile.size > FILE_UPLOAD_LIMITS.maxSize) {
      setError(`File size must be less than ${FILE_UPLOAD_LIMITS.maxSize / (1024 * 1024)}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (uploadType === 'csv' && !file) {
      setError('Please select a file to upload');
      return;
    }

    if (uploadType === 'linkedin' && !linkedinUrl) {
      setError('Please enter a LinkedIn URL');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (uploadType === 'csv') {
        // Simulate CSV processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockResult: CSVUploadResult = {
          totalRows: 150,
          validRows: 142,
          invalidRows: 8,
          errors: [
            { row: 5, field: 'email', value: 'invalid-email', error: 'Invalid email format' },
            { row: 12, field: 'name', value: '', error: 'Name is required' },
          ],
          leads: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              company: 'Example Corp',
              jobTitle: 'Sales Manager',
            },
            // More mock leads...
          ],
        };

        setUploadResult(mockResult);
        if (onUploadComplete) {
          onUploadComplete(mockResult.leads);
        }
      } else if (uploadType === 'linkedin') {
        // Simulate LinkedIn import
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockLead: Partial<Lead> = {
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          company: 'Tech Company',
          jobTitle: 'VP of Sales',
          linkedinUrl: linkedinUrl,
        };

        if (onUploadComplete) {
          onUploadComplete([mockLead]);
        }
        onClose();
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = 'Name,Email,Company,Job Title,Phone,LinkedIn URL\nJohn Doe,john@example.com,Example Corp,Sales Manager,+1-555-0123,https://linkedin.com/in/johndoe';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (uploadResult) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title="Upload Results"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Completed</h3>
              <p className="text-gray-600">Your leads have been processed successfully.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{uploadResult.totalRows}</div>
              <div className="text-sm text-blue-600">Total Rows</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{uploadResult.validRows}</div>
              <div className="text-sm text-green-600">Valid Leads</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{uploadResult.invalidRows}</div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Errors Found:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uploadResult.errors.map((error, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-600">
                      Row {error.row}: {error.error} (Value: "{error.value}")
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Upload Leads"
      size="lg"
    >
      <div className="space-y-6">
        {/* Upload Type Selection */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setUploadType('csv')}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              uploadType === 'csv'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">CSV Upload</h3>
            <p className="text-sm text-gray-500">Bulk import from file</p>
          </button>

          <button
            onClick={() => setUploadType('linkedin')}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              uploadType === 'linkedin'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Link className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">LinkedIn URL</h3>
            <p className="text-sm text-gray-500">Import from profile</p>
          </button>

          <button
            onClick={() => setUploadType('manual')}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              uploadType === 'manual'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">Manual Entry</h3>
            <p className="text-sm text-gray-500">Add single lead</p>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Content */}
        {uploadType === 'csv' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">CSV File Upload</h3>
              <Button variant="outline" size="sm" onClick={downloadTemplate} icon={Download}>
                Download Template
              </Button>
            </div>

            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to browse and upload
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                    icon={X}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Required columns: Name, Email, Company</li>
                <li>• Optional columns: Job Title, Phone, LinkedIn URL, Industry</li>
                <li>• Maximum file size: {FILE_UPLOAD_LIMITS.maxSize / (1024 * 1024)}MB</li>
                <li>• Maximum rows: {FILE_UPLOAD_LIMITS.maxRows.toLocaleString()}</li>
                <li>• Supported formats: .csv, .xlsx, .xls</li>
              </ul>
            </div>
          </div>
        )}

        {uploadType === 'linkedin' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">LinkedIn Profile Import</h3>

            <Input
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              fullWidth
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                LinkedIn data extraction must comply with LinkedIn's Terms of Service.
                We use only publicly available information and respect rate limits.
              </p>
            </div>
          </div>
        )}

        {uploadType === 'manual' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Manual Lead Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name" placeholder="John Doe" required />
              <Input label="Email" type="email" placeholder="john@company.com" required />
              <Input label="Company" placeholder="Company Name" required />
              <Input label="Job Title" placeholder="Sales Manager" />
              <Input label="Phone" placeholder="+1-555-0123" />
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/johndoe" />
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} loading={uploading}>
          {uploading ? 'Processing...' :
           uploadType === 'csv' ? 'Upload CSV' :
           uploadType === 'linkedin' ? 'Import from LinkedIn' :
           'Add Lead'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};