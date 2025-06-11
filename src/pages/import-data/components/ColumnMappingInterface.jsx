import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ColumnMappingInterface = ({ data, onMappingComplete }) => {
  const [mapping, setMapping] = useState({});
  const [isValid, setIsValid] = useState(false);

  const familyTreeFields = [
    { key: 'firstName', label: 'First Name', required: true, icon: 'User' },
    { key: 'lastName', label: 'Last Name', required: true, icon: 'User' },
    { key: 'birthDate', label: 'Birth Date', required: false, icon: 'Calendar' },
    { key: 'deathDate', label: 'Death Date', required: false, icon: 'Calendar' },
    { key: 'gender', label: 'Gender', required: false, icon: 'Users' },
    { key: 'relationship', label: 'Relationship', required: false, icon: 'Heart' },
    { key: 'spouse', label: 'Spouse', required: false, icon: 'Heart' },
    { key: 'notes', label: 'Notes', required: false, icon: 'FileText' },
    { key: 'email', label: 'Email', required: false, icon: 'Mail' },
    { key: 'phone', label: 'Phone', required: false, icon: 'Phone' }
  ];

  const csvColumns = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    const requiredFields = familyTreeFields.filter(field => field.required);
    const mappedRequiredFields = requiredFields.filter(field => mapping[field.key]);
    setIsValid(mappedRequiredFields.length === requiredFields.length);
  }, [mapping]);

  const handleMappingChange = (fieldKey, csvColumn) => {
    setMapping(prev => ({
      ...prev,
      [fieldKey]: csvColumn === '' ? undefined : csvColumn
    }));
  };

  const handleAutoMap = () => {
    const autoMapping = {};
    
    familyTreeFields.forEach(field => {
      const matchingColumn = csvColumns.find(column => {
        const columnLower = column.toLowerCase().replace(/[^a-z]/g, '');
        const fieldLower = field.label.toLowerCase().replace(/[^a-z]/g, '');
        return columnLower.includes(fieldLower) || fieldLower.includes(columnLower);
      });
      
      if (matchingColumn) {
        autoMapping[field.key] = matchingColumn;
      }
    });
    
    setMapping(autoMapping);
  };

  const handleClearMapping = () => {
    setMapping({});
  };

  const handleContinue = () => {
    onMappingComplete(mapping);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Map Your Columns</h3>
            <p className="text-text-secondary text-sm">
              Match your spreadsheet columns to family tree fields
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAutoMap}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-600 transition-smooth"
            >
              <Icon name="Zap" size={16} />
              <span className="hidden sm:inline">Auto Map</span>
            </button>
            
            <button
              onClick={handleClearMapping}
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
            >
              <Icon name="RotateCcw" size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Mapping Progress</span>
            <span className="text-text-primary font-medium">
              {Object.keys(mapping).filter(key => mapping[key]).length} / {familyTreeFields.length} fields mapped
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ 
                width: `${(Object.keys(mapping).filter(key => mapping[key]).length / familyTreeFields.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Mapping Interface */}
      <div className="space-y-4">
        {familyTreeFields.map((field) => (
          <div key={field.key} className="bg-surface rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name={field.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">{field.label}</span>
                    {field.required && (
                      <span className="text-xs bg-error text-white px-2 py-0.5 rounded">Required</span>
                    )}
                  </div>
                </div>
              </div>
              
              {mapping[field.key] && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="Check" size={16} />
                  <span className="text-sm font-medium">Mapped</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Select CSV Column
                </label>
                <select
                  value={mapping[field.key] || ''}
                  onChange={(e) => handleMappingChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">-- Select Column --</option>
                  {csvColumns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              {mapping[field.key] && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Sample Data
                  </label>
                  <div className="px-3 py-2 bg-background border border-border rounded-lg text-text-secondary text-sm">
                    {data[0][mapping[field.key]] || 'No data'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Options */}
      <div className="mt-8">
        <details className="bg-surface rounded-lg">
          <summary className="p-4 cursor-pointer font-medium">Advanced Options</summary>
          <div className="p-4 pt-0 border-t border-border">
            <p className="text-text-secondary text-sm">
              Additional mapping options will be available in future updates.
            </p>
          </div>
        </details>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`px-6 py-3 rounded-lg font-medium ${
            isValid
              ? 'bg-primary text-white hover:bg-primary-600'
              : 'bg-surface text-text-disabled cursor-not-allowed'
          } transition-smooth`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ColumnMappingInterface;