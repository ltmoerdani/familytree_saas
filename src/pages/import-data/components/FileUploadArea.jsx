import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';

const FileUploadArea = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { extension: '.csv', description: 'Comma Separated Values' },
    { extension: '.xlsx', description: 'Excel Spreadsheet' },
    { extension: '.xls', description: 'Excel 97-2003' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please select a valid CSV or Excel file.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      onFileUpload(file);
    }, 2000);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragOver
              ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-surface'
          } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Processing File...
                </h3>
                <p className="text-text-secondary">
                  Please wait while we analyze your data
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Upload Your Family Data
                </h3>
                <p className="text-text-secondary mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <button className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-smooth">
                  <Icon name="FolderOpen" size={20} />
                  <span>Choose File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Requirements */}
        <div className="mt-8 space-y-6">
          <div>
            <h4 className="font-medium text-text-primary mb-3">Supported File Formats</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {supportedFormats.map((format) => (
                <div key={format.extension} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                  <div className="w-8 h-8 bg-accent-100 rounded flex items-center justify-center">
                    <Icon name="FileText" size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-text-primary">{format.extension}</div>
                    <div className="text-xs text-text-secondary">{format.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-3">File Requirements</h4>
            <div className="bg-surface rounded-lg p-4">
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span>Maximum file size: 10MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span>First row should contain column headers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span>Include at least: First Name, Last Name, Birth Date</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span>Date format: YYYY-MM-DD or MM/DD/YYYY</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-3">Sample Data Template</h4>
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-3">
                Download our template to see the recommended column structure:
              </div>
              <button className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 font-medium text-sm transition-smooth">
                <Icon name="Download" size={16} />
                <span>Download CSV Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;