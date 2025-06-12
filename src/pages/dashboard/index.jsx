import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Header from 'components/ui/Header';
import RecentActivity from './components/RecentActivity';
import TreeCard from './components/TreeCard';
import StatsWidget from './components/StatsWidget';
import CreateTreeModal from './components/CreateTreeModal';

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTreeId, setSelectedTreeId] = useState(null);

  // Mock data for family trees
  const familyTrees = [
    {
      id: 1,
      name: 'Smith Family Heritage',
      memberCount: 47,
      lastModified: new Date(Date.now() - 86400000 * 2),
      thumbnail:
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
      isRecent: true,
      collaborators: 3,
      privacy: 'private',
    },
    {
      id: 2,
      name: 'Johnson Ancestry Tree',
      memberCount: 23,
      lastModified: new Date(Date.now() - 86400000 * 5),
      thumbnail:
        'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?w=400&h=300&fit=crop',
      isRecent: false,
      collaborators: 1,
      privacy: 'shared',
    },
    {
      id: 3,
      name: 'Williams Family Line',
      memberCount: 31,
      lastModified: new Date(Date.now() - 86400000 * 10),
      thumbnail:
        'https://images.pixabay.com/photo/2017/05/25/21/33/tree-2343163_1280.jpg?w=400&h=300&fit=crop',
      isRecent: false,
      collaborators: 2,
      privacy: 'private',
    },
    {
      id: 4,
      name: 'Brown Heritage Project',
      memberCount: 15,
      lastModified: new Date(Date.now() - 86400000 * 15),
      thumbnail:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      isRecent: false,
      collaborators: 0,
      privacy: 'private',
    },
  ];

  // Mock user stats
  const userStats = {
    totalMembers: 116,
    totalTrees: 4,
    collaborations: 6,
    recentUploads: 12,
  };

  // Mock recent activity
  const recentActivities = [
    {
      id: 1,
      type: 'member_added',
      message: 'Added new family member: Sarah Johnson',
      treeName: 'Johnson Ancestry Tree',
      timestamp: new Date(Date.now() - 3600000),
      user: 'You',
    },
    {
      id: 2,
      type: 'collaboration',
      message: "Mike Smith shared 'Smith Family Heritage' with you",
      treeName: 'Smith Family Heritage',
      timestamp: new Date(Date.now() - 7200000),
      user: 'Mike Smith',
    },
    {
      id: 3,
      type: 'export',
      message: 'Exported family tree to PDF',
      treeName: 'Williams Family Line',
      timestamp: new Date(Date.now() - 86400000),
      user: 'You',
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredTrees = familyTrees.filter(tree =>
    tree.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mostRecentTree =
    familyTrees.find(tree => tree.isRecent) || familyTrees[0];

  const formatLastModified = date => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-surface rounded w-1/3 mb-8"></div>
              <div className="h-64 bg-surface rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(item => (
                  <div
                    key={`skeleton-${item}`}
                    className="h-48 bg-surface rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              Welcome back to your family trees
            </h1>
            <p className="text-text-secondary">
              Continue building your family heritage and discover new
              connections
            </p>
          </div>

          {/* Hero Section - Most Recent Tree */}
          {mostRecentTree && (
            <div className="mb-12">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Continue where you left off
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden bg-surface">
                    <Image
                      src={mostRecentTree.thumbnail}
                      alt={mostRecentTree.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-text-primary mb-2">
                      {mostRecentTree.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-4">
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={16} />
                        <span>{mostRecentTree.memberCount} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={16} />
                        <span>
                          Last edited{' '}
                          {formatLastModified(mostRecentTree.lastModified)}
                        </span>
                      </div>
                      {mostRecentTree.collaborators > 0 && (
                        <div className="flex items-center space-x-1">
                          <Icon name="UserPlus" size={16} />
                          <span>
                            {mostRecentTree.collaborators} collaborators
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/family-tree-canvas"
                      className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-smooth"
                    >
                      <Icon name="Edit3" size={20} />
                      <span>Continue Editing</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatsWidget
                  icon="Users"
                  label="Total Members"
                  value={userStats.totalMembers}
                  color="primary"
                />
                <StatsWidget
                  icon="TreePine"
                  label="Family Trees"
                  value={userStats.totalTrees}
                  color="accent"
                />
                <StatsWidget
                  icon="UserPlus"
                  label="Collaborations"
                  value={userStats.collaborations}
                  color="secondary"
                />
                <StatsWidget
                  icon="Upload"
                  label="Recent Uploads"
                  value={userStats.recentUploads}
                  color="primary"
                />
              </div>

              {/* My Family Trees Section */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-text-primary mb-4 sm:mb-0">
                    My Family Trees
                  </h2>
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Icon
                        name="Search"
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                      />
                      <input
                        type="text"
                        placeholder="Search trees..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    {/* Create New Tree Button */}
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-smooth"
                    >
                      <Icon name="Plus" size={20} />
                      <span className="hidden sm:inline">Create New</span>
                    </button>
                  </div>
                </div>

                {/* Trees Grid */}
                {filteredTrees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrees.map(tree => (
                      <TreeCard
                        key={tree.id}
                        tree={tree}
                        onSelect={setSelectedTreeId}
                        isSelected={selectedTreeId === tree.id}
                        formatLastModified={formatLastModified}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon
                        name="Search"
                        size={24}
                        className="text-text-secondary"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No trees found
                    </h3>
                    <p className="text-text-secondary">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-surface rounded-lg p-6 border border-border">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    to="/import-data"
                    className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-smooth"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon name="Upload" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        Import Data
                      </div>
                      <div className="text-sm text-text-secondary">
                        Upload CSV or Excel
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/export-share"
                    className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:border-accent hover:bg-accent-50 transition-smooth"
                  >
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Icon name="Share2" size={20} className="text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        Export & Share
                      </div>
                      <div className="text-sm text-text-secondary">
                        Download or share trees
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/member-profile"
                    className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:border-secondary hover:bg-secondary-50 transition-smooth"
                  >
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon
                        name="User"
                        size={20}
                        className="text-secondary-700"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        My Profile
                      </div>
                      <div className="text-sm text-text-secondary">
                        Manage account
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Recent Activity */}
              <RecentActivity activities={recentActivities} />

              {/* Upgrade Prompt */}
              <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-lg p-6 border border-accent-200 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Crown" size={24} color="white" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    Unlock unlimited trees, advanced collaboration, and premium
                    export options
                  </p>
                  <button className="w-full bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-600 transition-smooth">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="bg-background rounded-lg p-6 border border-border mt-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Recent Uploads
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: 'family_photo_1950.jpg',
                      size: '2.4 MB',
                      time: '2 hours ago',
                    },
                    {
                      name: 'birth_certificate.pdf',
                      size: '1.1 MB',
                      time: '1 day ago',
                    },
                    {
                      name: 'wedding_photo.jpg',
                      size: '3.2 MB',
                      time: '3 days ago',
                    },
                  ].map((file, index) => (
                    <div
                      key={file.name}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-surface rounded flex items-center justify-center">
                        <Icon
                          name={
                            file.name.includes('.pdf') ? 'FileText' : 'Image'
                          }
                          size={16}
                          className="text-text-secondary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {file.size} • {file.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Tree Modal */}
      <CreateTreeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-modal flex items-center justify-center lg:hidden hover:bg-primary-600 transition-smooth z-50"
      >
        <Icon name="Plus" size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
