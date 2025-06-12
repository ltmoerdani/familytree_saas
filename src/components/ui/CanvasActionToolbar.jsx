import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const CanvasActionToolbar = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoomLevel,
  hasUnsavedChanges,
  onAutoLayout,
  onHierarchicalLayout,
  layoutMode,
  containerRef,
}) => {
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);

  // Helper functions
  const getButtonClassName = (item, isSaving) => {
    const baseClasses = 'p-2 rounded transition-smooth';
    if (item.variant === 'primary') {
      return `${baseClasses} text-white bg-primary hover:bg-primary-600 disabled:bg-primary-300`;
    }
    return `${baseClasses} text-text-secondary hover:text-primary hover:bg-surface disabled:text-text-secondary/50 disabled:cursor-not-allowed`;
  };

  const getButtonTitle = item => {
    const shortcutText = item.shortcut ? ` (${item.shortcut})` : '';
    return `${item.label}${shortcutText}`;
  };

  // Show only on family tree canvas
  if (location.pathname !== '/family-tree-canvas') {
    return null;
  }

  const handleSave = async () => {
    if (onSave && hasUnsavedChanges) {
      setIsSaving(true);
      try {
        await onSave();
      } finally {
        setIsSaving(false);
      }
    }
  };

  const toolbarItems = [
    {
      id: 'undo',
      icon: 'Undo2',
      label: 'Undo',
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: 'Ctrl+Z',
    },
    {
      id: 'redo',
      icon: 'Redo2',
      label: 'Redo',
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: 'Ctrl+Y',
    },
    {
      id: 'divider1',
      type: 'divider',
    },
    {
      id: 'zoom-out',
      icon: 'ZoomOut',
      label: 'Zoom Out',
      onClick: onZoomOut,
      disabled: zoomLevel <= 25,
      shortcut: 'Ctrl+-',
    },
    {
      id: 'zoom-level',
      type: 'display',
      content: `${zoomLevel}%`,
      onClick: onZoomReset,
      label: 'Reset Zoom',
    },
    {
      id: 'zoom-in',
      icon: 'ZoomIn',
      label: 'Zoom In',
      onClick: onZoomIn,
      disabled: zoomLevel >= 200,
      shortcut: 'Ctrl++',
    },
    {
      id: 'divider2',
      type: 'divider',
    },
    {
      id: 'auto-layout',
      icon: 'GitBranch',
      label: 'Auto Layout',
      onClick: onAutoLayout,
      shortcut: 'Ctrl+L',
      variant: layoutMode === 'auto' ? 'primary' : 'default',
    },
    {
      id: 'hierarchical-layout',
      icon: 'TreePine',
      label: 'Hierarchical Layout',
      onClick: onHierarchicalLayout,
      shortcut: 'Ctrl+H',
      variant: layoutMode === 'hierarchical' ? 'primary' : 'default',
    },
    {
      id: 'divider3',
      type: 'divider',
    },
    {
      id: 'save',
      icon: isSaving ? 'Loader2' : 'Save',
      label: isSaving ? 'Saving...' : 'Save',
      onClick: handleSave,
      disabled: !hasUnsavedChanges || isSaving,
      shortcut: 'Ctrl+S',
      variant: hasUnsavedChanges ? 'primary' : 'default',
    },
  ];

  return (
    <>
      {/* Desktop Toolbar - Now positioned inside canvas with absolute positioning */}
      <div className="hidden md:flex absolute top-4 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg shadow-card z-50">
        <div className="flex items-center px-2 py-2 space-x-1">
          {toolbarItems.map(item => {
            if (item.type === 'divider') {
              return (
                <div key={item.id} className="w-px h-6 bg-border mx-1"></div>
              );
            }

            if (item.type === 'display') {
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="px-3 py-1.5 text-sm font-mono text-text-secondary hover:text-primary hover:bg-surface rounded transition-smooth"
                  title={item.label}
                >
                  {item.content}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                disabled={item.disabled}
                className={getButtonClassName(item, isSaving)}
                title={getButtonTitle(item)}
                aria-label={item.label}
                aria-disabled={item.disabled}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  className={
                    item.icon === 'Loader2' && isSaving ? 'animate-spin' : ''
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Floating Action Buttons */}
      <div className="md:hidden fixed bottom-6 right-4 flex flex-col space-y-3 z-1000">
        {/* Save Button */}
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-modal flex items-center justify-center transition-smooth hover:bg-primary-600 disabled:bg-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-100"
            title={isSaving ? 'Saving...' : 'Save Changes'}
            aria-label={isSaving ? 'Saving changes' : 'Save changes'}
          >
            <Icon
              name={isSaving ? 'Loader2' : 'Save'}
              size={20}
              className={isSaving ? 'animate-spin' : ''}
            />
          </button>
        )}

        {/* Undo/Redo */}
        <div className="flex space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-12 h-12 bg-background border border-border text-text-secondary rounded-full shadow-card flex items-center justify-center transition-smooth hover:text-primary hover:bg-surface disabled:text-text-secondary/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="Undo"
            aria-label="Undo last action"
          >
            <Icon name="Undo2" size={18} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-12 h-12 bg-background border border-border text-text-secondary rounded-full shadow-card flex items-center justify-center transition-smooth hover:text-primary hover:bg-surface disabled:text-text-secondary/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="Redo"
            aria-label="Redo last action"
          >
            <Icon name="Redo2" size={18} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 200}
            className="w-12 h-12 bg-background border border-border text-text-secondary rounded-full shadow-card flex items-center justify-center transition-smooth hover:text-primary hover:bg-surface disabled:text-text-secondary/50 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <Icon name="ZoomIn" size={18} />
          </button>
          <button
            onClick={onZoomReset}
            className="w-12 h-12 bg-background border border-border text-text-secondary rounded-full shadow-card flex items-center justify-center transition-smooth hover:text-primary hover:bg-surface"
            title="Reset Zoom"
          >
            <span className="text-xs font-mono">{zoomLevel}%</span>
          </button>
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 25}
            className="w-12 h-12 bg-background border border-border text-text-secondary rounded-full shadow-card flex items-center justify-center transition-smooth hover:text-primary hover:bg-surface disabled:text-text-secondary/50 disabled:cursor-not-allowed"
            title="Zoom Out"
          >
            <Icon name="ZoomOut" size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

// PropTypes validation for strict prop checking
CanvasActionToolbar.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomReset: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
  zoomLevel: PropTypes.number,
  hasUnsavedChanges: PropTypes.bool,
  onAutoLayout: PropTypes.func.isRequired,
  onHierarchicalLayout: PropTypes.func.isRequired,
  layoutMode: PropTypes.oneOf(['manual', 'auto', 'hierarchical']),
  containerRef: PropTypes.object,
};

// Default props for optional properties
CanvasActionToolbar.defaultProps = {
  onSave: undefined,
  canUndo: false,
  canRedo: false,
  zoomLevel: 100,
  hasUnsavedChanges: false,
  layoutMode: 'manual',
  containerRef: null,
};

export default CanvasActionToolbar;
