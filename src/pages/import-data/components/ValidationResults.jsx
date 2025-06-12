import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/AppIcon';

const ValidationResults = ({ results, data, mapping, onStartImport }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const infoCount = results.filter(r => r.type === 'info').length;

  const getIssueIcon = type => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  };

  const getIssueColor = type => {
    switch (type) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const getIssueBgColor = type => {
    switch (type) {
      case 'error':
        return 'bg-error-50';
      case 'warning':
        return 'bg-warning-50';
      case 'info':
        return 'bg-primary-50';
      default:
        return 'bg-surface';
    }
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    const reportData = results.map(result => ({
      Type: result.type.toUpperCase(),
      Message: result.message,
      Row: result.row,
      Field: result.field,
    }));

    console.log('Downloading validation report:', reportData);
    alert('Validation report would be downloaded as CSV file');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Validation Results
        </h3>
        <p className="text-text-secondary text-sm">
          Review data quality issues before importing
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-error-50 border border-error-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-error">{errorCount}</div>
              <div className="text-sm text-error">Errors</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-error">
            Must be fixed before import
          </div>
        </div>

        <div className="bg-warning-50 border border-warning-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {warningCount}
              </div>
              <div className="text-sm text-warning">Warnings</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-warning">Recommended to review</div>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Info" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{infoCount}</div>
              <div className="text-sm text-primary">Info</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-primary">
            Additional information
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">Validation Issues</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 text-text-secondary hover:text-primary text-sm transition-smooth"
              >
                <Icon name="Download" size={16} />
                <span>Download Report</span>
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center space-x-2 text-text-secondary hover:text-primary text-sm transition-smooth"
              >
                <Icon
                  name={showDetails ? 'ChevronUp' : 'ChevronDown'}
                  size={16}
                />
                <span>{showDetails ? 'Hide' : 'Show'} Details</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.map(result => (
            <button
              key={`${result.type}-${result.row}-${
                result.field
              }-${result.message.slice(0, 20)}`}
              type="button"
              className={`w-full text-left p-4 border-b border-border last:border-b-0 ${getIssueBgColor(
                result.type
              )} hover:bg-opacity-80 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1`}
              onClick={() =>
                setSelectedIssue(
                  selectedIssue === result.row ? null : result.row
                )
              }
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedIssue(
                    selectedIssue === result.row ? null : result.row
                  );
                }
              }}
              aria-expanded={selectedIssue === result.row}
              aria-label={`View details for ${result.type}: ${result.message}`}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  name={getIssueIcon(result.type)}
                  size={20}
                  className={`${getIssueColor(
                    result.type
                  )} flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary">
                      {result.message}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span>Row {result.row}</span>
                      <Icon name="ChevronRight" size={14} />
                    </div>
                  </div>

                  {showDetails && selectedIssue === result.row && (
                    <div className="mt-3 p-3 bg-background rounded border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-text-secondary">
                            Field:
                          </span>
                          <span className="ml-2 text-text-primary">
                            {result.field}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-text-secondary">
                            Row:
                          </span>
                          <span className="ml-2 text-text-primary">
                            {result.row}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-text-secondary">
                            Current Value:
                          </span>
                          <span className="ml-2 text-text-primary">
                            {data[result.row - 1]?.[mapping[result.field]] ||
                              'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8">
        <h4 className="font-medium text-text-primary mb-4">Import Preview</h4>
        <div className="bg-surface rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.slice(0, 3).map((person, index) => (
              <div
                key={`preview-person-${index}-${
                  person[mapping.firstName] || 'unknown'
                }-${person[mapping.lastName] || 'unknown'}`}
                className="bg-background rounded-lg p-4 border border-border"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {person[mapping.firstName]} {person[mapping.lastName]}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {person[mapping.relationship] || 'Family Member'}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {person[mapping.birthDate] && (
                    <div className="text-text-secondary">
                      Born: {person[mapping.birthDate]}
                    </div>
                  )}
                  {person[mapping.spouse] && (
                    <div className="text-text-secondary">
                      Spouse: {person[mapping.spouse]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data.length > 3 && (
            <div className="text-center mt-4 text-text-secondary text-sm">
              +{data.length - 3} more family members will be imported
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-text-secondary">
          {errorCount > 0 ? (
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span>
                Fix {errorCount} error{errorCount !== 1 ? 's' : ''} before
                importing
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span>Ready to import {data.length} records</span>
            </div>
          )}
        </div>

        <button
          onClick={onStartImport}
          disabled={errorCount > 0}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-smooth"
        >
          <Icon name="Download" size={16} />
          <span>Start Import</span>
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
ValidationResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['error', 'warning', 'info']).isRequired,
      message: PropTypes.string.isRequired,
      row: PropTypes.number.isRequired,
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapping: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
    relationship: PropTypes.string,
    spouse: PropTypes.string,
  }).isRequired,
  onStartImport: PropTypes.func.isRequired,
};

export default ValidationResults;
