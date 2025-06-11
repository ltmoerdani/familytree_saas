import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'member_added':
        return 'UserPlus';
      case 'collaboration':
        return 'Users';
      case 'export':
        return 'Download';
      case 'edit':
        return 'Edit3';
      case 'share':
        return 'Share2';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'member_added':
        return 'text-success-500';
      case 'collaboration':
        return 'text-primary';
      case 'export':
        return 'text-accent';
      case 'edit':
        return 'text-secondary-700';
      case 'share':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffTime = Math.abs(now - timestamp);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-background rounded-lg p-6 border border-border">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Activity" size={24} className="text-text-secondary" />
          </div>
          <p className="text-text-secondary text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Recent Activity
        </h3>
        <button className="text-text-secondary hover:text-primary transition-smooth">
          <Icon name="MoreHorizontal" size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                {activity.message}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-text-secondary">
                  {activity.treeName}
                </span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-primary hover:text-primary-600 font-medium transition-smooth">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;