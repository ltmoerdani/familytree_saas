import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/AppIcon';

const RelationshipsTab = ({ memberData, onDataChange }) => {
  const [showAddRelationship, setShowAddRelationship] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    type: '',
    memberName: '',
    details: '',
  });

  const relationshipTypes = [
    { value: 'spouse', label: 'Spouse', icon: 'Heart' },
    { value: 'parent', label: 'Parent', icon: 'Users' },
    { value: 'child', label: 'Child', icon: 'Baby' },
    { value: 'sibling', label: 'Sibling', icon: 'UserCheck' },
    { value: 'grandparent', label: 'Grandparent', icon: 'Crown' },
    { value: 'grandchild', label: 'Grandchild', icon: 'Smile' },
  ];

  const getRelationshipIcon = type => {
    const relationship = relationshipTypes.find(r => r.value === type);
    return relationship ? relationship.icon : 'User';
  };

  const getRelationshipLabel = type => {
    const relationship = relationshipTypes.find(r => r.value === type);
    return relationship ? relationship.label : type;
  };

  const handleAddRelationship = () => {
    if (newRelationship.type && newRelationship.memberName) {
      const relationship = {
        id: `rel-${Date.now()}`,
        type: newRelationship.type,
        memberId: `member-${Date.now()}`,
        memberName: newRelationship.memberName,
        ...(newRelationship.details && { details: newRelationship.details }),
      };

      const updatedRelationships = [...memberData.relationships, relationship];
      onDataChange({ relationships: updatedRelationships });

      setNewRelationship({ type: '', memberName: '', details: '' });
      setShowAddRelationship(false);
    }
  };

  const handleRemoveRelationship = relationshipId => {
    const updatedRelationships = memberData.relationships.filter(
      r => r.id !== relationshipId
    );
    onDataChange({ relationships: updatedRelationships });
  };

  const groupedRelationships = memberData.relationships.reduce(
    (groups, relationship) => {
      const type = relationship.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(relationship);
      return groups;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Add Relationship Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Family Relationships
        </h3>
        <button
          onClick={() => setShowAddRelationship(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth"
        >
          <Icon name="Plus" size={16} />
          <span>Add Relationship</span>
        </button>
      </div>

      {/* Add Relationship Form */}
      {showAddRelationship && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-md font-heading font-semibold text-text-primary mb-4">
            Add New Relationship
          </h4>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="relationshipType"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Relationship Type *
              </label>
              <select
                id="relationshipType"
                value={newRelationship.type}
                onChange={e =>
                  setNewRelationship(prev => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              >
                <option value="">Select relationship type</option>
                {relationshipTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="personName"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Person Name *
              </label>
              <input
                id="personName"
                type="text"
                value={newRelationship.memberName}
                onChange={e =>
                  setNewRelationship(prev => ({
                    ...prev,
                    memberName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter person's name"
              />
            </div>

            <div>
              <label
                htmlFor="additionalDetails"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Additional Details
              </label>
              <input
                id="additionalDetails"
                type="text"
                value={newRelationship.details}
                onChange={e =>
                  setNewRelationship(prev => ({
                    ...prev,
                    details: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Marriage date, birth date, etc."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddRelationship}
                disabled={!newRelationship.type || !newRelationship.memberName}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-smooth"
              >
                <Icon name="Plus" size={16} />
                <span>Add Relationship</span>
              </button>

              <button
                onClick={() => setShowAddRelationship(false)}
                className="px-4 py-2 bg-surface text-text-secondary border border-border rounded-lg font-medium hover:bg-secondary-100 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relationships List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedRelationships).map(([type, relationships]) => (
          <div
            key={type}
            className="bg-surface rounded-lg border border-border p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Icon
                name={getRelationshipIcon(type)}
                size={20}
                className="text-accent"
              />
              <h4 className="text-md font-heading font-semibold text-text-primary">
                {getRelationshipLabel(type)}s ({relationships.length})
              </h4>
            </div>

            <div className="space-y-3">
              {relationships.map(relationship => (
                <div
                  key={relationship.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {relationship.memberName}
                      </p>
                      {relationship.marriageDate && (
                        <p className="text-sm text-text-secondary">
                          Married:{' '}
                          {new Date(
                            relationship.marriageDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {relationship.birthDate && (
                        <p className="text-sm text-text-secondary">
                          Born:{' '}
                          {new Date(
                            relationship.birthDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {relationship.relationship && (
                        <p className="text-sm text-text-secondary">
                          {relationship.relationship}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
                      title="Edit Relationship"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveRelationship(relationship.id)}
                      className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-smooth"
                      title="Remove Relationship"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Family Tree Visualization */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h4 className="text-md font-heading font-semibold text-text-primary mb-4">
          Family Tree Preview
        </h4>

        <div className="bg-background rounded-lg border border-border p-8 min-h-64 flex items-center justify-center">
          <div className="text-center">
            <Icon
              name="Network"
              size={48}
              className="text-text-secondary mx-auto mb-4"
            />
            <p className="text-text-secondary mb-4">
              Interactive family tree visualization will appear here
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth mx-auto">
              <Icon name="ExternalLink" size={16} />
              <span>Open in Tree Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
RelationshipsTab.propTypes = {
  memberData: PropTypes.shape({
    relationships: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf([
          'spouse',
          'parent',
          'child',
          'sibling',
          'grandparent',
          'grandchild',
        ]).isRequired,
        memberId: PropTypes.string,
        memberName: PropTypes.string.isRequired,
        marriageDate: PropTypes.string,
        marriagePlace: PropTypes.string,
        birthDate: PropTypes.string,
        relationship: PropTypes.string,
        details: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onDataChange: PropTypes.func.isRequired,
};

export default RelationshipsTab;
