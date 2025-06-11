import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const CreateTreeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [treeName, setTreeName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    {
      id: 'blank',
      name: 'Blank Tree',
      description: 'Start with an empty family tree',
      icon: 'TreePine',
      color: 'primary'
    },
    {
      id: 'basic',
      name: 'Basic Template',
      description: 'Pre-filled with common family structure',
      icon: 'Users',
      color: 'accent'
    },
    {
      id: 'extended',
      name: 'Extended Family',
      description: 'Template for large family trees',
      icon: 'Network',
      color: 'secondary'
    }
  ];

  const handleCreate = async () => {
    if (!treeName.trim()) return;

    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCreating(false);
    onClose();
    setTreeName('');
    setSelectedTemplate('blank');
    
    // Navigate to family tree canvas
    navigate('/family-tree-canvas');
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
      setTreeName('');
      setSelectedTemplate('blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1000">
      <div className="bg-background rounded-lg shadow-modal w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Create New Family Tree
          </h2>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-smooth disabled:cursor-not-allowed"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tree Name Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tree Name *
            </label>
            <input
              type="text"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              placeholder="Enter family tree name"
              disabled={isCreating}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-surface disabled:cursor-not-allowed"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Choose Template
            </label>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  disabled={isCreating}
                  className={`w-full p-4 rounded-lg border text-left transition-smooth disabled:cursor-not-allowed ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-surface'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      template.color === 'primary' ? 'bg-primary-100 text-primary' :
                      template.color === 'accent'? 'bg-accent-100 text-accent' : 'bg-secondary-100 text-secondary-700'
                    }`}>
                      <Icon name={template.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary mb-1">
                        {template.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {template.description}
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <Icon name="Check" size={20} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg font-medium transition-smooth disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!treeName.trim() || isCreating}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-smooth"
          >
            {isCreating && <Icon name="Loader2" size={16} className="animate-spin" />}
            <span>{isCreating ? 'Creating...' : 'Create Tree'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTreeModal;