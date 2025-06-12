import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const MediaTab = ({ memberData, onDataChange }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadType, setUploadType] = useState('photo');
  const fileInputRef = useRef(null);

  const handleFileUpload = event => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const newMedia = {
          id: `media-${Date.now()}-${Math.random()}`,
          type: file.type.startsWith('image/') ? 'photo' : 'document',
          title: file.name.split('.')[0],
          url: e.target.result,
          date: new Date().toISOString().split('T')[0],
          description: '',
          fileName: file.name,
          fileSize: file.size,
        };

        const updatedMedia = [...memberData.media, newMedia];
        onDataChange({ media: updatedMedia });
      };
      reader.readAsDataURL(file);
    });

    setShowUploadForm(false);
  };

  const handleRemoveMedia = mediaId => {
    const updatedMedia = memberData.media.filter(m => m.id !== mediaId);
    onDataChange({ media: updatedMedia });
    setSelectedMedia(null);
  };

  const handleUpdateMedia = (mediaId, updates) => {
    const updatedMedia = memberData.media.map(m =>
      m.id === mediaId ? { ...m, ...updates } : m
    );
    onDataChange({ media: updatedMedia });
  };

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const photos = memberData.media.filter(m => m.type === 'photo');
  const documents = memberData.media.filter(m => m.type === 'document');

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Media & Documents
        </h3>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth"
        >
          <Icon name="Upload" size={16} />
          <span>Upload Files</span>
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-md font-heading font-semibold text-text-primary mb-4">
            Upload Media
          </h4>

          <div className="space-y-4">
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-text-primary mb-2">
                  File Type
                </legend>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="photo"
                      checked={uploadType === 'photo'}
                      onChange={e => setUploadType(e.target.value)}
                      className="text-primary focus:ring-primary focus:ring-2"
                      name="fileType"
                    />
                    <span>Photos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="document"
                      checked={uploadType === 'document'}
                      onChange={e => setUploadType(e.target.value)}
                      className="text-primary focus:ring-primary focus:ring-2"
                      name="fileType"
                    />
                    <span>Documents</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <button
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label={`Click to upload ${
                uploadType === 'photo' ? 'photos' : 'documents'
              } or drag and drop`}
              type="button"
            >
              <Icon
                name="Upload"
                size={48}
                className="text-text-secondary mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-text-primary font-medium mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-text-secondary text-sm">
                {uploadType === 'photo'
                  ? 'PNG, JPG, GIF up to 10MB'
                  : 'PDF, DOC, TXT up to 10MB'}
              </p>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={
                uploadType === 'photo' ? 'image/*' : '.pdf,.doc,.docx,.txt'
              }
              onChange={handleFileUpload}
              className="sr-only"
              aria-label={`Upload ${
                uploadType === 'photo' ? 'photo' : 'document'
              } files`}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth"
              >
                <Icon name="Upload" size={16} />
                <span>Choose Files</span>
              </button>

              <button
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 bg-surface text-text-secondary border border-border rounded-lg font-medium hover:bg-secondary-100 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photos Section */}
      {photos.length > 0 && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Image" size={20} className="text-accent" />
            <h4 className="text-md font-heading font-semibold text-text-primary">
              Photos ({photos.length})
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <button
                key={photo.id}
                type="button"
                className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                onClick={() => setSelectedMedia(photo)}
                aria-label={`View photo: ${photo.title}`}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-primary-100">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <Icon
                    name="Eye"
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveMedia(photo.id);
                    }}
                    className="w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-smooth focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                    aria-label={`Delete photo: ${photo.title}`}
                    type="button"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>

                <p className="text-sm text-text-primary mt-2 truncate">
                  {photo.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {new Date(photo.date).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="FileText" size={20} className="text-accent" />
            <h4 className="text-md font-heading font-semibold text-text-primary">
              Documents ({documents.length})
            </h4>
          </div>

          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-surface transition-smooth"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{doc.title}</p>
                    <p className="text-sm text-text-secondary">
                      {new Date(doc.date).toLocaleDateString()}
                      {doc.fileSize && ` • ${formatFileSize(doc.fileSize)}`}
                    </p>
                    {doc.description && (
                      <p className="text-sm text-text-secondary mt-1">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedMedia(doc)}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
                    title="View Details"
                  >
                    <Icon name="Eye" size={16} />
                  </button>
                  <button
                    className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
                    title="Download"
                  >
                    <Icon name="Download" size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveMedia(doc.id)}
                    className="p-2 text-text-secondary hover:text-error hover:bg-error-50 rounded-lg transition-smooth"
                    title="Delete"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {memberData.media.length === 0 && (
        <div className="bg-surface rounded-lg border border-border p-12 text-center">
          <Icon
            name="Image"
            size={48}
            className="text-text-secondary mx-auto mb-4"
          />
          <h4 className="text-lg font-heading font-semibold text-text-primary mb-2">
            No Media Yet
          </h4>
          <p className="text-text-secondary mb-6">
            Upload photos and documents to preserve family memories and
            important records.
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth mx-auto"
          >
            <Icon name="Upload" size={16} />
            <span>Upload First File</span>
          </button>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-1050 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                {selectedMedia.title}
              </h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-6">
              {selectedMedia.type === 'photo' ? (
                <div className="text-center">
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon
                    name="FileText"
                    size={64}
                    className="text-accent mx-auto mb-4"
                  />
                  <p className="text-text-primary font-medium mb-2">
                    {selectedMedia.fileName}
                  </p>
                  <p className="text-text-secondary">
                    {selectedMedia.fileSize &&
                      formatFileSize(selectedMedia.fileSize)}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor={`media-title-${selectedMedia.id}`}
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Title
                  </label>
                  <input
                    id={`media-title-${selectedMedia.id}`}
                    type="text"
                    value={selectedMedia.title}
                    onChange={e =>
                      handleUpdateMedia(selectedMedia.id, {
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`media-description-${selectedMedia.id}`}
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id={`media-description-${selectedMedia.id}`}
                    value={selectedMedia.description}
                    onChange={e =>
                      handleUpdateMedia(selectedMedia.id, {
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="Add a description..."
                  />
                </div>

                <div>
                  <label
                    htmlFor={`media-date-${selectedMedia.id}`}
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Date
                  </label>
                  <input
                    id={`media-date-${selectedMedia.id}`}
                    type="date"
                    value={selectedMedia.date}
                    onChange={e =>
                      handleUpdateMedia(selectedMedia.id, {
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
MediaTab.propTypes = {
  memberData: PropTypes.shape({
    media: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['photo', 'document']).isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string,
        fileName: PropTypes.string,
        fileSize: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onDataChange: PropTypes.func.isRequired,
};

export default MediaTab;
