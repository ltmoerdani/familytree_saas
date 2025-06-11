import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ExportPreview = ({ format, settings, tree }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Mock preview image based on format and settings
  const getPreviewImage = () => {
    const baseUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96";
    const params = `?w=400&h=300&fit=crop&crop=center`;
    return `${baseUrl}${params}`;
  };

  const getFormatIcon = () => {
    switch (format) {
      case 'png': return 'Image';
      case 'jpg': return 'Camera';
      case 'pdf': return 'FileText';
      default: return 'File';
    }
  };

  const getQualityLabel = () => {
    switch (settings.quality) {
      case 'low': return '72 DPI';
      case 'medium': return '150 DPI';
      case 'high': return '300 DPI';
      case 'ultra': return '600 DPI';
      default: return '300 DPI';
    }
  };

  const getSizeLabel = () => {
    switch (settings.size) {
      case 'small': return '1024×768';
      case 'medium': return '1920×1080';
      case 'large': return '2560×1440';
      case 'custom': return 'Custom';
      default: return '2560×1440';
    }
  };

  return (
    <div className="bg-surface rounded-lg p-6 border border-border sticky top-32">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Preview
        </h2>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-md transition-smooth"
          title={isZoomed ? 'Zoom Out' : 'Zoom In'}
        >
          <Icon name={isZoomed ? 'ZoomOut' : 'ZoomIn'} size={16} />
        </button>
      </div>

      {/* Preview Image */}
      <div className={`relative mb-4 rounded-lg overflow-hidden border border-border transition-all duration-300 ${
        isZoomed ? 'transform scale-110' : ''
      }`}>
        <div className="aspect-[4/3] bg-background">
          <Image
            src={getPreviewImage()}
            alt="Family Tree Preview"
            className="w-full h-full object-cover"
          />
          
          {/* Format Overlay */}
          <div className="absolute top-2 left-2">
            <div className="flex items-center space-x-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
              <Icon name={getFormatIcon()} size={12} />
              <span>{format.toUpperCase()}</span>
            </div>
          </div>

          {/* Watermark Preview */}
          {settings.watermark && (
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center space-x-1 bg-white bg-opacity-75 text-text-primary px-2 py-1 rounded text-xs">
                <Icon name="TreePine" size={12} />
                <span>FamilyTree</span>
              </div>
            </div>
          )}

          {/* Generation Indicator */}
          <div className="absolute top-2 right-2">
            <div className="bg-primary text-white px-2 py-1 rounded text-xs">
              {settings.generations === 'all' ? `${tree.generations} Gen` : settings.generations}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Format:</span>
          <span className="font-medium text-text-primary">{format.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Quality:</span>
          <span className="font-medium text-text-primary">{getQualityLabel()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Size:</span>
          <span className="font-medium text-text-primary">{getSizeLabel()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Orientation:</span>
          <span className="font-medium text-text-primary capitalize">{settings.orientation}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Members:</span>
          <span className="font-medium text-text-primary">{tree.memberCount}</span>
        </div>
      </div>

      {/* Color Scheme Preview */}
      {settings.colorScheme !== 'default' && (
        <div className="mt-4 p-3 bg-background rounded border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Palette" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Color Scheme</span>
          </div>
          <div className="flex space-x-2">
            {settings.colorScheme === 'monochrome' && (
              <>
                <div className="w-4 h-4 bg-black rounded"></div>
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <div className="w-4 h-4 bg-white border border-border rounded"></div>
              </>
            )}
            {settings.colorScheme === 'sepia' && (
              <>
                <div className="w-4 h-4 bg-yellow-800 rounded"></div>
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              </>
            )}
            {settings.colorScheme === 'high-contrast' && (
              <>
                <div className="w-4 h-4 bg-black rounded"></div>
                <div className="w-4 h-4 bg-white border border-border rounded"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded transition-smooth">
            <Icon name="RotateCcw" size={14} />
            <span>Reset</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded transition-smooth">
            <Icon name="Maximize2" size={14} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPreview;