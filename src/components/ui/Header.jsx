import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'My Trees', path: '/dashboard', icon: 'TreePine' },
    { label: 'Tree Editor', path: '/family-tree-canvas', icon: 'Network' },
    { label: 'Import', path: '/import-data', icon: 'Upload' },
    { label: 'Export & Share', path: '/export-share', icon: 'Share2' },
  ];

  const isActive = path => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Handle escape key to close menus (accessibility)
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      closeMenus();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2"
              onClick={closeMenus}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TreePine" size={20} color="white" />
              </div>
              <span className="font-heading font-semibold text-xl text-primary">
                FamilyTree
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-surface ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-50'
                    : 'text-text-secondary hover:text-primary'
                }`}
                onClick={closeMenus}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleProfile}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="flex items-center space-x-2 p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <Icon name="ChevronDown" size={16} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-modal border border-border z-1010">
                  <div className="py-1">
                    <Link
                      to="/member-profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth"
                      onClick={closeMenus}
                    >
                      <Icon name="User" size={16} />
                      <span>My Profile</span>
                    </Link>
                    <div className="border-t border-border my-1"></div>
                    <Link
                      to="/login-register"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-primary transition-smooth"
                      onClick={closeMenus}
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-surface transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border z-1020">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-smooth ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-50'
                    : 'text-text-secondary hover:text-primary hover:bg-surface'
                }`}
                onClick={closeMenus}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Profile Section */}
          <div className="border-t border-border px-2 pt-4 pb-3">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <div className="text-base font-medium text-text-primary">
                  User Account
                </div>
                <div className="text-sm text-text-secondary">
                  Manage your profile
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/member-profile"
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface transition-smooth"
                onClick={closeMenus}
              >
                <Icon name="User" size={20} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/login-register"
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-text-secondary hover:text-primary hover:bg-surface transition-smooth"
                onClick={closeMenus}
              >
                <Icon name="LogOut" size={20} />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {(isMenuOpen || isProfileOpen) && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 bg-black bg-opacity-25 z-999 border-none cursor-pointer"
          onClick={closeMenus}
          onKeyDown={handleKeyDown}
        />
      )}
    </header>
  );
};

export default Header;
