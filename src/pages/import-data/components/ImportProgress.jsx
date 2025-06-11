import React from 'react';
import Icon from 'components/AppIcon';

const ImportProgress = ({ progress, isImporting }) => {
  const getProgressMessage = () => {
    if (progress < 20) return 'Initializing import process...';
    if (progress < 40) return 'Processing family member data...';
    if (progress < 60) return 'Creating family relationships...';
    if (progress < 80) return 'Validating connections...';
    if (progress < 100) return 'Finalizing import...';
    return 'Import completed successfully!';
  };

  const getProgressIcon = () => {
    if (progress < 20) return 'Database';
    if (progress < 40) return 'Users';
    if (progress < 60) return 'Heart';
    if (progress < 80) return 'CheckCircle';
    if (progress < 100) return 'Sparkles';
    return 'Check';
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto text-center">
        {/* Progress Icon */}
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {isImporting ? (
            <Icon name="Loader2" size={40} className="text-primary animate-spin" />
          ) : (
            <Icon name={getProgressIcon()} size={40} className="text-primary" />
          )}
        </div>

        {/* Progress Title */}
        <h3 className="text-xl font-medium text-text-primary mb-2">
          {isImporting ? 'Importing Your Family Data' : 'Import Complete!'}
        </h3>

        {/* Progress Message */}
        <p className="text-text-secondary mb-8">
          {getProgressMessage()}
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {[
            { label: 'Reading file data', completed: progress >= 20 },
            { label: 'Processing members', completed: progress >= 40 },
            { label: 'Creating relationships', completed: progress >= 60 },
            { label: 'Validating data', completed: progress >= 80 },
            { label: 'Finalizing import', completed: progress >= 100 }
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-success text-white' 
                  : progress >= (index + 1) * 20 - 10
                    ? 'bg-primary text-white' :'bg-border text-text-secondary'
              }`}>
                {step.completed ? (
                  <Icon name="Check" size={12} />
                ) : progress >= (index + 1) * 20 - 10 ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <div className="w-2 h-2 bg-current rounded-full" />
                )}
              </div>
              <span className={`text-sm ${
                step.completed 
                  ? 'text-success font-medium' 
                  : progress >= (index + 1) * 20 - 10
                    ? 'text-primary font-medium' :'text-text-secondary'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Warning Message */}
        {isImporting && (
          <div className="mt-8 p-4 bg-warning-50 border border-warning-100 rounded-lg">
            <div className="flex items-center space-x-2 text-warning">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">Please don't close this window</span>
            </div>
            <p className="text-xs text-warning mt-1">
              Import is in progress and may take a few moments to complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportProgress;