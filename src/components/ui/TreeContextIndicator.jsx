import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TreeContextIndicator = ({ activeTree = null }) => {
  const location = useLocation();
  
  // Show only on editing screens, not on dashboard or auth
  const showOnPaths = ['/family-tree-canvas', '/member-profile', '/import-data', '/export-share'];
  const shouldShow = showOnPaths.includes(location.pathname);

  if (!shouldShow || !activeTree) {
    return null;
  }

  const truncateTreeName = (name, maxLength = 30) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <div className="fixed top-16 left-0 right-0 bg-surface border-b border-border z-999">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-smooth"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="text-sm font-medium">Back to Trees</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-text-primary">
              <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              <Icon name="TreePine" size={16} className="text-accent" />
              <span className="font-medium text-sm md:text-base" title={activeTree.name}>
                {truncateTreeName(activeTree.name)}
              </span>
            </div>
          </div>

          {/* Tree Actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-md transition-smooth"
              title="Tree Settings"
            >
              <Icon name="Settings" size={16} />
            </button>
            
            <button
              className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-md transition-smooth"
              title="Share Tree"
            >
              <Icon name="Share2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeContextIndicator;