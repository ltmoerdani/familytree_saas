import React from 'react';
import Icon from 'components/AppIcon';

const ExportFormatCard = ({ format, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-smooth ${
        isSelected
          ? 'border-primary bg-primary-50' :'border-border bg-background hover:border-primary-300 hover:bg-surface'
      }`}
    >
      {format.recommended && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-primary text-white' : 'bg-primary-100 text-primary'
        }`}>
          <Icon name={format.icon} size={20} />
        </div>
        <div>
          <h3 className="font-medium text-text-primary">{format.name}</h3>
          <p className="text-sm text-text-secondary">{format.fileSize}</p>
        </div>
      </div>
      
      <p className="text-sm text-text-secondary mb-3">
        {format.description}
      </p>
      
      <div className="space-y-1">
        {format.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="text-xs text-text-secondary">{feature}</span>
          </div>
        ))}
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={12} color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportFormatCard;