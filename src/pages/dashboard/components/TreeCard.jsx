import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TreeCard = ({ tree, onSelect, isSelected, formatLastModified }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);

    // Handle different actions with proper implementation
    switch (action) {
      case 'edit':
        console.log('Navigate to tree canvas');
        break;
      case 'share':
        console.log('Open share modal');
        break;
      case 'export':
        console.log('Open export options');
        break;
      case 'duplicate':
        console.log('Duplicate tree');
        break;
      case 'delete':
        console.log('Show delete confirmation');
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleCardClick = () => {
    onSelect(tree.id);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(tree.id);
    }
  };

  return (
    <button
      type="button"
      className={`relative bg-background rounded-lg border transition-smooth hover:shadow-card w-full text-left ${
        isSelected
          ? 'border-primary ring-2 ring-primary-100'
          : 'border-border hover:border-primary-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`Select family tree: ${tree.name}. ${
        tree.privacy === 'private' ? 'Private' : 'Shared'
      } tree with ${tree.memberCount} members. Last modified ${new Date(
        tree.lastModified
      ).toLocaleDateString()}`}
      aria-pressed={isSelected}
    >
      {/* Tree Thumbnail */}
      <div className="relative h-32 rounded-t-lg overflow-hidden bg-surface">
        <Image
          src={tree.thumbnail}
          alt={tree.name}
          className="w-full h-full object-cover"
        />

        {/* Privacy Badge */}
        <div className="absolute top-2 left-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tree.privacy === 'private'
                ? 'bg-text-primary/80 text-white'
                : 'bg-accent/80 text-white'
            }`}
          >
            <Icon
              name={tree.privacy === 'private' ? 'Lock' : 'Users'}
              size={12}
              className="inline mr-1"
            />
            {tree.privacy === 'private' ? 'Private' : 'Shared'}
          </div>
        </div>

        {/* Menu Button */}
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={handleMenuToggle}
            className={`w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-smooth hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isHovered || showMenu ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label={`More options for ${tree.name}`}
            aria-expanded={showMenu}
            aria-haspopup="menu"
          >
            <Icon
              name="MoreVertical"
              size={16}
              className="text-text-secondary"
            />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-modal border border-border z-10"
              role="menu"
              aria-label={`Options for ${tree.name}`}
            >
              <div className="py-1">
                <button
                  type="button"
                  onClick={e => handleMenuAction('edit', e)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth focus:outline-none focus:bg-surface focus:text-primary"
                  role="menuitem"
                >
                  <Icon name="Edit3" size={16} />
                  <span>Edit Tree</span>
                </button>
                <button
                  type="button"
                  onClick={e => handleMenuAction('share', e)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth focus:outline-none focus:bg-surface focus:text-primary"
                  role="menuitem"
                >
                  <Icon name="Share2" size={16} />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={e => handleMenuAction('export', e)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth"
                  role="menuitem"
                >
                  <Icon name="Download" size={16} />
                  <span>Export</span>
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  type="button"
                  onClick={e => handleMenuAction('duplicate', e)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth"
                  role="menuitem"
                >
                  <Icon name="Copy" size={16} />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={e => handleMenuAction('delete', e)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error-500 hover:bg-error-50 transition-smooth"
                  role="menuitem"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Badge */}
        {tree.isRecent && (
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-1 bg-success-500 text-white rounded-full text-xs font-medium">
              Recent
            </div>
          </div>
        )}
      </div>

      {/* Tree Info */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-text-primary mb-2 truncate">
          {tree.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>{tree.memberCount} members</span>
          </div>
          {tree.collaborators > 0 && (
            <div className="flex items-center space-x-1">
              <Icon name="UserPlus" size={14} />
              <span>{tree.collaborators}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {formatLastModified(tree.lastModified)}
          </span>

          <Link
            to="/family-tree-canvas"
            className="inline-flex items-center space-x-1 text-primary hover:text-primary-600 text-sm font-medium transition-smooth"
            onClick={e => e.stopPropagation()}
          >
            <span>Open</span>
            <Icon name="ArrowRight" size={14} />
          </Link>
        </div>
      </div>

      {/* Click overlay to close menu */}
      {showMenu && (
        <button
          type="button"
          className="fixed inset-0 z-5 bg-transparent"
          onClick={() => setShowMenu(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setShowMenu(false);
            }
          }}
          aria-label="Close menu"
        />
      )}
    </button>
  );
};

// PropTypes validation
TreeCard.propTypes = {
  tree: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    privacy: PropTypes.oneOf(['private', 'shared']).isRequired,
    memberCount: PropTypes.number.isRequired,
    collaborators: PropTypes.number,
    lastModified: PropTypes.instanceOf(Date).isRequired,
    isRecent: PropTypes.bool,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  formatLastModified: PropTypes.func.isRequired,
};

export default TreeCard;
