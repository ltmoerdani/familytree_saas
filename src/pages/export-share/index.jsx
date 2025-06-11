import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from 'components/ui/Header';
import TreeContextIndicator from 'components/ui/TreeContextIndicator';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ExportFormatCard from './components/ExportFormatCard';
import ShareSettingsPanel from './components/ShareSettingsPanel';
import ExportPreview from './components/ExportPreview';
import ProcessingModal from './components/ProcessingModal';

const ExportShare = () => {
  const [activeTab, setActiveTab] = useState('export');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [exportSettings, setExportSettings] = useState({
    quality: 'high',
    size: 'large',
    generations: 'all',
    watermark: false,
    colorScheme: 'default',
    orientation: 'landscape'
  });
  const [shareSettings, setShareSettings] = useState({
    privacy: 'private',
    allowEditing: false,
    allowDownload: true,
    expirationDate: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock active tree data
  const activeTree = {
    id: 1,
    name: "Johnson Family Tree",
    memberCount: 47,
    generations: 4,
    lastModified: new Date(Date.now() - 86400000)
  };

  // Mock export formats
  const exportFormats = [
    {
      id: 'png',
      name: 'PNG Image',
      description: 'High-quality image with transparency support',
      icon: 'Image',
      fileSize: '2.4 MB',
      recommended: true,
      features: ['Transparent background', 'High resolution', 'Web compatible']
    },
    {
      id: 'jpg',
      name: 'JPG Image',
      description: 'Compressed image format for smaller file sizes',
      icon: 'Camera',
      fileSize: '1.8 MB',
      recommended: false,
      features: ['Smaller file size', 'Universal support', 'Print ready']
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional document format with text search',
      icon: 'FileText',
      fileSize: '3.1 MB',
      recommended: false,
      features: ['Searchable text', 'Print optimized', 'Professional format']
    }
  ];

  // Mock share options
  const shareOptions = [
    {
      id: 'email',
      name: 'Email Invitation',
      description: 'Send direct invitations to family members',
      icon: 'Mail',
      action: 'invite'
    },
    {
      id: 'link',
      name: 'Share Link',
      description: 'Generate a shareable link with privacy controls',
      icon: 'Link',
      action: 'generate'
    },
    {
      id: 'embed',
      name: 'Embed Widget',
      description: 'Add to your website or blog',
      icon: 'Code',
      action: 'embed',
      premium: true
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Share on Facebook, Twitter, or LinkedIn',
      icon: 'Share2',
      action: 'social'
    }
  ];

  const handleExport = async () => {
    setIsProcessing(true);
    // Simulate export processing
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${activeTree.name.replace(/\s+/g, '_')}.${selectedFormat}`;
      link.click();
    }, 3000);
  };

  const handleShare = (option) => {
    console.log('Sharing via:', option.id);
    // Handle different share actions
  };

  const tabs = [
    { id: 'export', label: 'Export Options', icon: 'Download' },
    { id: 'share', label: 'Share Settings', icon: 'Share2' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreeContextIndicator activeTree={activeTree} />
      
      <main className="pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                  Export & Share
                </h1>
                <p className="text-text-secondary">
                  Save your family tree in various formats or share with family members
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {activeTree.memberCount} members
                  </div>
                  <div className="text-xs text-text-secondary">
                    {activeTree.generations} generations
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="TreePine" size={24} color="white" />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Export Options */}
              <div className="lg:col-span-2 space-y-6">
                {/* Format Selection */}
                <div className="bg-surface rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
                    Choose Format
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {exportFormats.map((format) => (
                      <ExportFormatCard
                        key={format.id}
                        format={format}
                        isSelected={selectedFormat === format.id}
                        onSelect={() => setSelectedFormat(format.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Export Settings */}
                <div className="bg-surface rounded-lg p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading font-semibold text-text-primary">
                      Export Settings
                    </h2>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center space-x-2 text-sm text-primary hover:text-primary-600 transition-smooth"
                    >
                      <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
                      <Icon 
                        name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Quality
                      </label>
                      <select
                        value={exportSettings.quality}
                        onChange={(e) => setExportSettings({
                          ...exportSettings,
                          quality: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      >
                        <option value="low">Low (72 DPI)</option>
                        <option value="medium">Medium (150 DPI)</option>
                        <option value="high">High (300 DPI)</option>
                        <option value="ultra">Ultra (600 DPI)</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Size
                      </label>
                      <select
                        value={exportSettings.size}
                        onChange={(e) => setExportSettings({
                          ...exportSettings,
                          size: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      >
                        <option value="small">Small (1024x768)</option>
                        <option value="medium">Medium (1920x1080)</option>
                        <option value="large">Large (2560x1440)</option>
                        <option value="custom">Custom Size</option>
                      </select>
                    </div>

                    {/* Generations */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Include Generations
                      </label>
                      <select
                        value={exportSettings.generations}
                        onChange={(e) => setExportSettings({
                          ...exportSettings,
                          generations: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                      >
                        <option value="all">All Generations</option>
                        <option value="1-2">Generations 1-2</option>
                        <option value="1-3">Generations 1-3</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Orientation
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="landscape"
                            checked={exportSettings.orientation === 'landscape'}
                            onChange={(e) => setExportSettings({
                              ...exportSettings,
                              orientation: e.target.value
                            })}
                            className="mr-2 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary">Landscape</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="portrait"
                            checked={exportSettings.orientation === 'portrait'}
                            onChange={(e) => setExportSettings({
                              ...exportSettings,
                              orientation: e.target.value
                            })}
                            className="mr-2 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary">Portrait</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Watermark */}
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={exportSettings.watermark}
                              onChange={(e) => setExportSettings({
                                ...exportSettings,
                                watermark: e.target.checked
                              })}
                              className="mr-3 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-text-primary">
                              Add Watermark
                            </span>
                          </label>
                          <p className="text-xs text-text-secondary mt-1">
                            Include FamilyTree branding
                          </p>
                        </div>

                        {/* Color Scheme */}
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Color Scheme
                          </label>
                          <select
                            value={exportSettings.colorScheme}
                            onChange={(e) => setExportSettings({
                              ...exportSettings,
                              colorScheme: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                          >
                            <option value="default">Default Colors</option>
                            <option value="monochrome">Black & White</option>
                            <option value="sepia">Sepia Tone</option>
                            <option value="high-contrast">High Contrast</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Estimated file size: {exportFormats.find(f => f.id === selectedFormat)?.fileSize}
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 transition-smooth"
                  >
                    <Icon name={isProcessing ? 'Loader2' : 'Download'} size={20} className={isProcessing ? 'animate-spin' : ''} />
                    <span>{isProcessing ? 'Exporting...' : 'Export Tree'}</span>
                  </button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <ExportPreview
                  format={selectedFormat}
                  settings={exportSettings}
                  tree={activeTree}
                />
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Share Options */}
              <div className="space-y-6">
                <div className="bg-surface rounded-lg p-6 border border-border">
                  <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
                    Share Options
                  </h2>
                  <div className="space-y-4">
                    {shareOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-background transition-smooth"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Icon name={option.icon} size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-text-primary">
                                {option.name}
                              </h3>
                              {option.premium && (
                                <span className="px-2 py-1 bg-accent text-white text-xs rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShare(option)}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-smooth"
                        >
                          {option.action === 'invite' ? 'Invite' : 
                           option.action === 'generate' ? 'Generate' :
                           option.action === 'embed' ? 'Get Code' : 'Share'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share Settings */}
              <div className="space-y-6">
                <ShareSettingsPanel
                  settings={shareSettings}
                  onSettingsChange={setShareSettings}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Processing Modal */}
      {isProcessing && (
        <ProcessingModal
          isOpen={isProcessing}
          onClose={() => setIsProcessing(false)}
          format={selectedFormat}
          progress={65}
        />
      )}
    </div>
  );
};

export default ExportShare;