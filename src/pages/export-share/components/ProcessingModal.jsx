import React from 'react';
import Icon from 'components/AppIcon';

const ProcessingModal = ({ isOpen, onClose, format, progress = 0 }) => {
  if (!isOpen) return null;

  const getFormatIcon = () => {
    switch (format) {
      case 'png': return 'Image';
      case 'jpg': return 'Camera';
      case 'pdf': return 'FileText';
      default: return 'File';
    }
  };

  const getStatusMessage = () => {
    if (progress < 20) return 'Preparing export...';
    if (progress < 50) return 'Rendering family tree...';
    if (progress < 80) return 'Optimizing image quality...';
    if (progress < 95) return 'Finalizing export...';
    return 'Almost ready...';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1050">
      <div className="bg-background rounded-lg p-8 max-w-md w-full mx-4 shadow-modal">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name={getFormatIcon()} size={32} className="text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-2">
            Exporting Your Tree
          </h2>
          
          {/* Status */}
          <p className="text-text-secondary mb-6">
            {getStatusMessage()}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-surface rounded-full h-3 mb-4">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress Text */}
          <div className="flex items-center justify-between text-sm text-text-secondary mb-6">
            <span>{progress}% complete</span>
            <span>{format.toUpperCase()} format</span>
          </div>

          {/* Processing Steps */}
          <div className="space-y-2 mb-6">
            <div className={`flex items-center space-x-3 text-sm ${
              progress >= 20 ? 'text-success' : 'text-text-secondary'
            }`}>
              <Icon 
                name={progress >= 20 ? 'CheckCircle' : 'Circle'} 
                size={16} 
                className={progress >= 20 ? 'text-success' : 'text-text-secondary'}
              />
              <span>Analyzing family tree structure</span>
            </div>
            
            <div className={`flex items-center space-x-3 text-sm ${
              progress >= 50 ? 'text-success' : 'text-text-secondary'
            }`}>
              <Icon 
                name={progress >= 50 ? 'CheckCircle' : 'Circle'} 
                size={16} 
                className={progress >= 50 ? 'text-success' : 'text-text-secondary'}
              />
              <span>Rendering visual elements</span>
            </div>
            
            <div className={`flex items-center space-x-3 text-sm ${
              progress >= 80 ? 'text-success' : 'text-text-secondary'
            }`}>
              <Icon 
                name={progress >= 80 ? 'CheckCircle' : 'Circle'} 
                size={16} 
                className={progress >= 80 ? 'text-success' : 'text-text-secondary'}
              />
              <span>Applying quality settings</span>
            </div>
            
            <div className={`flex items-center space-x-3 text-sm ${
              progress >= 95 ? 'text-success' : 'text-text-secondary'
            }`}>
              <Icon 
                name={progress >= 95 ? 'CheckCircle' : 'Circle'} 
                size={16} 
                className={progress >= 95 ? 'text-success' : 'text-text-secondary'}
              />
              <span>Preparing download</span>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="px-6 py-2 text-text-secondary hover:text-primary border border-border rounded-md hover:bg-surface transition-smooth"
          >
            Cancel Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;