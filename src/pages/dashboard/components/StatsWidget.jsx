import React from 'react';
import Icon from 'components/AppIcon';

const StatsWidget = ({ icon, label, value, color = 'primary', trend = null }) => {
  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-50',
        icon: 'text-primary',
        text: 'text-primary-600'
      },
      accent: {
        bg: 'bg-accent-50',
        icon: 'text-accent',
        text: 'text-accent-600'
      },
      secondary: {
        bg: 'bg-secondary-50',
        icon: 'text-secondary-700',
        text: 'text-secondary-600'
      },
      success: {
        bg: 'bg-success-50',
        icon: 'text-success-500',
        text: 'text-success-600'
      },
      warning: {
        bg: 'bg-warning-50',
        icon: 'text-warning-500',
        text: 'text-warning-600'
      }
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const colors = getColorClasses(color);

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toString();
    }
    return val;
  };

  return (
    <div className="bg-background rounded-lg p-4 border border-border hover:shadow-card transition-smooth">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <Icon name={icon} size={20} className={colors.icon} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs ${
            trend.direction === 'up' ? 'text-success-500' : 'text-error-500'
          }`}>
            <Icon 
              name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={12} 
            />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-text-primary">
          {formatValue(value)}
        </div>
        <div className="text-sm text-text-secondary">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;