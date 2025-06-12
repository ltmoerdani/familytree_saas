import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/AppIcon';

const ImportSummary = ({ summary, onViewTree, onImportMore }) => {
  const summaryItems = [
    {
      label: 'Total Records',
      value: summary.totalRecords,
      icon: 'FileText',
      color: 'text-text-primary',
    },
    {
      label: 'Successfully Imported',
      value: summary.successfulImports,
      icon: 'CheckCircle',
      color: 'text-success',
    },
    {
      label: 'Skipped Records',
      value: summary.skippedRecords,
      icon: 'AlertTriangle',
      color: 'text-warning',
    },
    {
      label: 'Errors',
      value: summary.errors,
      icon: 'AlertCircle',
      color: 'text-error',
    },
  ];

  const detailItems = [
    {
      label: 'New Family Members',
      value: summary.newMembers,
      icon: 'UserPlus',
      description: 'Added to your family tree',
    },
    {
      label: 'Updated Members',
      value: summary.updatedMembers,
      icon: 'UserCheck',
      description: 'Existing records updated',
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-2xl font-medium text-text-primary mb-2">
            Import Completed Successfully!
          </h3>
          <p className="text-text-secondary">
            Your family data has been imported and added to your tree
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryItems.map(item => (
            <div
              key={item.label}
              className="bg-surface rounded-lg p-4 text-center"
            >
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={item.icon} size={20} className={item.color} />
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-xs text-text-secondary">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Detailed Results */}
        <div className="bg-surface rounded-lg p-6 mb-8">
          <h4 className="font-medium text-text-primary mb-4">Import Details</h4>
          <div className="space-y-4">
            {detailItems.map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon name={item.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {item.label}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Icon
              name="Lightbulb"
              size={20}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <div>
              <h5 className="font-medium text-primary mb-2">What's Next?</h5>
              <ul className="space-y-1 text-sm text-primary">
                <li>• Review your family tree to verify all connections</li>
                <li>• Add photos and additional details to family members</li>
                <li>
                  • Use the tree editor to adjust positioning and relationships
                </li>
                <li>• Share your completed tree with family members</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onViewTree}
            className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-smooth"
          >
            <Icon name="TreePine" size={20} />
            <span>View Family Tree</span>
          </button>

          <button
            onClick={onImportMore}
            className="flex-1 flex items-center justify-center space-x-2 bg-surface text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary-100 border border-border transition-smooth"
          >
            <Icon name="Plus" size={20} />
            <span>Import More Data</span>
          </button>
        </div>

        {/* Additional Actions */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
          <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-smooth">
            <Icon name="Download" size={16} />
            <span>Download Import Log</span>
          </button>

          <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-smooth">
            <Icon name="Share2" size={16} />
            <span>Share Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ImportSummary.propTypes = {
  summary: PropTypes.shape({
    totalRecords: PropTypes.number.isRequired,
    successfulImports: PropTypes.number.isRequired,
    skippedRecords: PropTypes.number.isRequired,
    errors: PropTypes.number.isRequired,
    newMembers: PropTypes.number.isRequired,
    updatedMembers: PropTypes.number.isRequired,
  }).isRequired,
  onViewTree: PropTypes.func.isRequired,
  onImportMore: PropTypes.func.isRequired,
};

export default ImportSummary;
