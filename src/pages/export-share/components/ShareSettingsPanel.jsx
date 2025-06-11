import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ShareSettingsPanel = ({ settings, onSettingsChange }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmails, setInviteEmails] = useState([]);

  const privacyOptions = [
    {
      id: 'private',
      name: 'Private',
      description: 'Only you can access this tree',
      icon: 'Lock'
    },
    {
      id: 'family',
      name: 'Family Only',
      description: 'Only invited family members can view',
      icon: 'Users'
    },
    {
      id: 'public',
      name: 'Public',
      description: 'Anyone with the link can view',
      icon: 'Globe'
    }
  ];

  const handleAddEmail = () => {
    if (inviteEmail && !inviteEmails.includes(inviteEmail)) {
      setInviteEmails([...inviteEmails, inviteEmail]);
      setInviteEmail('');
    }
  };

  const handleRemoveEmail = (email) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Privacy Settings
        </h2>
        <div className="space-y-3">
          {privacyOptions.map((option) => (
            <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                value={option.id}
                checked={settings.privacy === option.id}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  privacy: e.target.value
                })}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Icon name={option.icon} size={16} className="text-text-secondary" />
                  <span className="font-medium text-text-primary">{option.name}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Permissions
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium text-text-primary">Allow Editing</span>
              <p className="text-sm text-text-secondary">
                Let others add or modify family members
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowEditing}
              onChange={(e) => onSettingsChange({
                ...settings,
                allowEditing: e.target.checked
              })}
              className="text-primary focus:ring-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium text-text-primary">Allow Downloads</span>
              <p className="text-sm text-text-secondary">
                Let others download copies of the tree
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowDownload}
              onChange={(e) => onSettingsChange({
                ...settings,
                allowDownload: e.target.checked
              })}
              className="text-primary focus:ring-primary"
            />
          </label>
        </div>
      </div>

      {/* Family Invitations */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Invite Family Members
        </h2>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
          />
          <button
            onClick={handleAddEmail}
            disabled={!inviteEmail}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 disabled:bg-primary-300 transition-smooth"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>

        {inviteEmails.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">Pending Invitations:</h3>
            {inviteEmails.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                <span className="text-sm text-text-primary">{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-text-secondary hover:text-error transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ))}
            <button className="w-full mt-3 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-600 transition-smooth">
              Send Invitations ({inviteEmails.length})
            </button>
          </div>
        )}
      </div>

      {/* Current Sharing Status */}
      <div className="bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Current Status
        </h2>
        <div className="flex items-center space-x-3 p-3 bg-success-50 border border-success-200 rounded-lg">
          <Icon name="Shield" size={20} className="text-success" />
          <div>
            <p className="font-medium text-success-700">
              Tree is {settings.privacy}
            </p>
            <p className="text-sm text-success-600">
              {settings.privacy === 'private' ? 'Only you can access this tree' :
               settings.privacy === 'family'? 'Shared with invited family members' : 'Publicly accessible via link'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSettingsPanel;