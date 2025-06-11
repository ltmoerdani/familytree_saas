import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const BasicInfoTab = ({ memberData, onDataChange }) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    onDataChange({ [field]: value });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        onDataChange({ profilePhoto: e.target.result });
        setIsEditingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Photo and Basic Details */}
      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Profile Photo
          </h3>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-100 border-4 border-background shadow-card">
                <Image
                  src={memberData.profilePhoto}
                  alt={`${memberData.firstName} ${memberData.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full shadow-card flex items-center justify-center hover:bg-primary-600 transition-smooth"
                title="Change Photo"
              >
                <Icon name="Camera" size={16} />
              </button>
            </div>

            {isEditingPhoto && (
              <div className="w-full space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth"
                  >
                    <Icon name="Upload" size={16} />
                    <span>Upload New</span>
                  </button>
                  
                  <button
                    onClick={() => setIsEditingPhoto(false)}
                    className="px-4 py-2 bg-surface text-text-secondary border border-border rounded-lg font-medium hover:bg-secondary-100 transition-smooth"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={memberData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={memberData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Middle Name
              </label>
              <input
                type="text"
                value={memberData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter middle name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Gender
              </label>
              <select
                value={memberData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={memberData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter occupation"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Dates and Biography */}
      <div className="space-y-6">
        {/* Birth & Death Information */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Birth & Death Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={memberData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              />
              {memberData.birthDate && (
                <p className="text-sm text-text-secondary mt-1">
                  {formatDate(memberData.birthDate)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Birth Place
              </label>
              <input
                type="text"
                value={memberData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter birth place"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Death Date
              </label>
              <input
                type="date"
                value={memberData.deathDate}
                onChange={(e) => handleInputChange('deathDate', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              />
              {memberData.deathDate && (
                <p className="text-sm text-text-secondary mt-1">
                  {formatDate(memberData.deathDate)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Death Place
              </label>
              <input
                type="text"
                value={memberData.deathPlace}
                onChange={(e) => handleInputChange('deathPlace', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter death place"
              />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Biography
          </h3>
          
          <div>
            <textarea
              value={memberData.biography}
              onChange={(e) => handleInputChange('biography', e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth resize-vertical"
              placeholder="Write a biography for this family member..."
            />
            <p className="text-sm text-text-secondary mt-2">
              {memberData.biography.length} characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;