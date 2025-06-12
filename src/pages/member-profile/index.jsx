import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from 'components/ui/Header';
import TreeContextIndicator from 'components/ui/TreeContextIndicator';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import BasicInfoTab from './components/BasicInfoTab';
import RelationshipsTab from './components/RelationshipsTab';
import MediaTab from './components/MediaTab';
import TimelineTab from './components/TimelineTab';

const MemberProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [memberData, setMemberData] = useState({
    id: 'member-001',
    firstName: 'John',
    lastName: 'Smith',
    middleName: 'Michael',
    birthDate: '1985-03-15',
    deathDate: '',
    birthPlace: 'New York, NY',
    deathPlace: '',
    gender: 'male',
    occupation: 'Software Engineer',
    biography: `John Michael Smith is a dedicated software engineer with over 15 years of experience in the technology industry. Born and raised in New York, he developed an early passion for computers and programming.

After graduating from Columbia University with a degree in Computer Science, John began his career at a startup where he learned the fundamentals of web development and project management. His innovative approach to problem-solving and natural leadership abilities quickly earned him recognition within the company.

Throughout his career, John has been instrumental in developing several successful applications and has mentored numerous junior developers. He is known for his collaborative spirit and his ability to translate complex technical concepts into understandable terms for non-technical stakeholders.

Outside of work, John is an avid photographer and enjoys hiking with his family. He volunteers at local coding bootcamps, helping others transition into technology careers. His commitment to both professional excellence and community service reflects the values instilled in him by his family.`,
    profilePhoto:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    relationships: [
      {
        id: 'rel-001',
        type: 'spouse',
        memberId: 'member-002',
        memberName: 'Sarah Johnson Smith',
        marriageDate: '2010-06-20',
        marriagePlace: 'Central Park, NY',
      },
      {
        id: 'rel-002',
        type: 'child',
        memberId: 'member-003',
        memberName: 'Emma Smith',
        birthDate: '2012-09-10',
      },
      {
        id: 'rel-003',
        type: 'child',
        memberId: 'member-004',
        memberName: 'Lucas Smith',
        birthDate: '2015-04-22',
      },
      {
        id: 'rel-004',
        type: 'parent',
        memberId: 'member-005',
        memberName: 'Robert Smith',
        relationship: 'Father',
      },
      {
        id: 'rel-005',
        type: 'parent',
        memberId: 'member-006',
        memberName: 'Margaret Smith',
        relationship: 'Mother',
      },
    ],
    media: [
      {
        id: 'media-001',
        type: 'photo',
        title: 'Wedding Day',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        date: '2010-06-20',
        description: 'John and Sarah on their wedding day in Central Park',
      },
      {
        id: 'media-002',
        type: 'photo',
        title: 'Family Vacation',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
        date: '2018-07-15',
        description: 'Family vacation to the mountains',
      },
      {
        id: 'media-003',
        type: 'document',
        title: 'Birth Certificate',
        url: '/assets/documents/birth-certificate.pdf',
        date: '1985-03-15',
        description: 'Official birth certificate',
      },
    ],
    timeline: [
      {
        id: 'event-001',
        date: '1985-03-15',
        title: 'Birth',
        description: 'Born in New York, NY',
        type: 'birth',
        source: 'Birth Certificate',
      },
      {
        id: 'event-002',
        date: '2003-09-01',
        title: 'Started College',
        description: 'Enrolled at Columbia University for Computer Science',
        type: 'education',
        source: 'University Records',
      },
      {
        id: 'event-003',
        date: '2007-05-15',
        title: 'Graduated College',
        description: 'Graduated with Bachelor of Science in Computer Science',
        type: 'education',
        source: 'Diploma',
      },
      {
        id: 'event-004',
        date: '2007-08-01',
        title: 'First Job',
        description: 'Started as Junior Developer at TechStart Inc.',
        type: 'career',
        source: 'Employment Records',
      },
      {
        id: 'event-005',
        date: '2010-06-20',
        title: 'Marriage',
        description: 'Married Sarah Johnson in Central Park, NY',
        type: 'marriage',
        source: 'Marriage Certificate',
      },
      {
        id: 'event-006',
        date: '2012-09-10',
        title: 'First Child Born',
        description: 'Emma Smith was born',
        type: 'family',
        source: 'Birth Certificate',
      },
      {
        id: 'event-007',
        date: '2015-04-22',
        title: 'Second Child Born',
        description: 'Lucas Smith was born',
        type: 'family',
        source: 'Birth Certificate',
      },
    ],
  });

  const activeTree = {
    id: 'tree-001',
    name: 'Smith Family Tree',
    description: 'The complete Smith family lineage',
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'relationships', label: 'Relationships', icon: 'Users' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'timeline', label: 'Timeline', icon: 'Calendar' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasUnsavedChanges(false);
    setIsSaving(false);
  };

  const handleDataChange = newData => {
    setMemberData(prev => ({ ...prev, ...newData }));
    setHasUnsavedChanges(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicInfoTab
            memberData={memberData}
            onDataChange={handleDataChange}
          />
        );
      case 'relationships':
        return (
          <RelationshipsTab
            memberData={memberData}
            onDataChange={handleDataChange}
          />
        );
      case 'media':
        return (
          <MediaTab memberData={memberData} onDataChange={handleDataChange} />
        );
      case 'timeline':
        return (
          <TimelineTab
            memberData={memberData}
            onDataChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreeContextIndicator activeTree={activeTree} />

      <div className="pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Member Header */}
          <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
                  <Image
                    src={memberData.profilePhoto}
                    alt={`${memberData.firstName} ${memberData.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-semibold text-text-primary">
                    {memberData.firstName}{' '}
                    {memberData.middleName && `${memberData.middleName} `}
                    {memberData.lastName}
                  </h1>
                  <p className="text-text-secondary">
                    {memberData.birthDate &&
                      new Date(memberData.birthDate).getFullYear()}
                    {memberData.deathDate &&
                      ` - ${new Date(memberData.deathDate).getFullYear()}`}
                    {!memberData.deathDate && ' - Present'}
                  </p>
                  {memberData.occupation && (
                    <p className="text-sm text-text-secondary">
                      {memberData.occupation}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {hasUnsavedChanges && (
                  <span className="text-sm text-warning-600 flex items-center space-x-1">
                    <Icon name="AlertCircle" size={16} />
                    <span>Unsaved changes</span>
                  </span>
                )}

                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-smooth"
                >
                  <Icon
                    name={isSaving ? 'Loader2' : 'Save'}
                    size={16}
                    className={isSaving ? 'animate-spin' : ''}
                  />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>

                <Link
                  to="/family-tree-canvas"
                  className="flex items-center space-x-2 px-4 py-2 bg-surface text-text-primary border border-border rounded-lg font-medium hover:bg-secondary-100 transition-smooth"
                >
                  <Icon name="Network" size={16} />
                  <span className="hidden sm:inline">View in Tree</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-background border-b border-border mb-6">
            <div className="flex space-x-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-smooth ${
                    activeTab === tab.id
                      ? 'text-primary border-primary bg-primary-50'
                      : 'text-text-secondary border-transparent hover:text-primary hover:border-primary-200'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-background">{renderTabContent()}</div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden fixed bottom-6 right-4 flex flex-col space-y-3 z-1000">
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-modal flex items-center justify-center transition-smooth hover:bg-primary-600 disabled:bg-primary-300"
            title={isSaving ? 'Saving...' : 'Save Changes'}
          >
            <Icon
              name={isSaving ? 'Loader2' : 'Save'}
              size={20}
              className={isSaving ? 'animate-spin' : ''}
            />
          </button>
        )}

        <button
          className="w-12 h-12 bg-accent text-white rounded-full shadow-card flex items-center justify-center transition-smooth hover:bg-accent-600"
          title="Add Event"
        >
          <Icon name="Plus" size={18} />
        </button>
      </div>
    </div>
  );
};

export default MemberProfile;
