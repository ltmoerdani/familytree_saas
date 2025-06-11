import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TimelineTab = ({ memberData, onDataChange }) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    description: '',
    type: 'personal',
    source: ''
  });

  const eventTypes = [
    { value: 'birth', label: 'Birth', icon: 'Baby', color: 'text-success' },
    { value: 'death', label: 'Death', icon: 'Heart', color: 'text-error' },
    { value: 'marriage', label: 'Marriage', icon: 'Heart', color: 'text-accent' },
    { value: 'education', label: 'Education', icon: 'GraduationCap', color: 'text-primary' },
    { value: 'career', label: 'Career', icon: 'Briefcase', color: 'text-secondary' },
    { value: 'family', label: 'Family', icon: 'Users', color: 'text-accent' },
    { value: 'personal', label: 'Personal', icon: 'User', color: 'text-text-secondary' },
    { value: 'achievement', label: 'Achievement', icon: 'Award', color: 'text-warning' }
  ];

  const getEventTypeInfo = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.title) {
      const event = {
        id: `event-${Date.now()}`,
        ...newEvent
      };

      const updatedTimeline = [...memberData.timeline, event].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      onDataChange({ timeline: updatedTimeline });
      setNewEvent({ date: '', title: '', description: '', type: 'personal', source: '' });
      setShowAddEvent(false);
    }
  };

  const handleRemoveEvent = (eventId) => {
    const updatedTimeline = memberData.timeline.filter(e => e.id !== eventId);
    onDataChange({ timeline: updatedTimeline });
  };

  const handleUpdateEvent = (eventId, updates) => {
    const updatedTimeline = memberData.timeline.map(e => 
      e.id === eventId ? { ...e, ...updates } : e
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    onDataChange({ timeline: updatedTimeline });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (eventDate, birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const event = new Date(eventDate);
    const age = event.getFullYear() - birth.getFullYear();
    const monthDiff = event.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && event.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Add Event Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Life Timeline
        </h3>
        <button
          onClick={() => setShowAddEvent(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth"
        >
          <Icon name="Plus" size={16} />
          <span>Add Event</span>
        </button>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-md font-heading font-semibold text-text-primary mb-4">
            Add Life Event
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date *
              </label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Event Type
              </label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Enter event title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Describe the event..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Source
              </label>
              <input
                type="text"
                value={newEvent.source}
                onChange={(e) => setNewEvent(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                placeholder="Source of information (optional)"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddEvent}
              disabled={!newEvent.date || !newEvent.title}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="Plus" size={16} />
              <span>Add Event</span>
            </button>
            
            <button
              onClick={() => setShowAddEvent(false)}
              className="px-4 py-2 bg-surface text-text-secondary border border-border rounded-lg font-medium hover:bg-secondary-100 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-surface rounded-lg border border-border p-6">
        {memberData.timeline.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-6">
              {memberData.timeline.map((event, index) => {
                const eventTypeInfo = getEventTypeInfo(event.type);
                const age = calculateAge(event.date, memberData.birthDate);
                
                return (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-background shadow-card flex items-center justify-center ${
                      eventTypeInfo.color === 'text-success' ? 'bg-success' :
                      eventTypeInfo.color === 'text-error' ? 'bg-error' :
                      eventTypeInfo.color === 'text-accent' ? 'bg-accent' :
                      eventTypeInfo.color === 'text-primary' ? 'bg-primary' :
                      eventTypeInfo.color === 'text-secondary' ? 'bg-secondary' :
                      eventTypeInfo.color === 'text-warning'? 'bg-warning' : 'bg-text-secondary'
                    }`}>
                      <Icon name={eventTypeInfo.icon} size={20} color="white" />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 bg-background rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-heading font-semibold text-text-primary">
                            {event.title}
                          </h5>
                          <div className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                            <span>{formatDate(event.date)}</span>
                            {age !== null && (
                              <>
                                <span>•</span>
                                <span>Age {age}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className={eventTypeInfo.color}>
                              {eventTypeInfo.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-surface rounded transition-smooth"
                            title="Edit Event"
                          >
                            <Icon name="Edit" size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveEvent(event.id)}
                            className="p-1.5 text-text-secondary hover:text-error hover:bg-error-50 rounded transition-smooth"
                            title="Delete Event"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-text-secondary text-sm mb-3">
                          {event.description}
                        </p>
                      )}

                      {event.source && (
                        <div className="flex items-center space-x-1 text-xs text-text-secondary">
                          <Icon name="FileText" size={12} />
                          <span>Source: {event.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-heading font-semibold text-text-primary mb-2">
              No Timeline Events
            </h4>
            <p className="text-text-secondary mb-6">
              Add important life events to create a comprehensive timeline.
            </p>
            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-smooth mx-auto"
            >
              <Icon name="Plus" size={16} />
              <span>Add First Event</span>
            </button>
          </div>
        )}
      </div>

      {/* Timeline Statistics */}
      {memberData.timeline.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {eventTypes.map(type => {
            const count = memberData.timeline.filter(e => e.type === type.value).length;
            if (count === 0) return null;
            
            return (
              <div key={type.value} className="bg-surface rounded-lg border border-border p-4 text-center">
                <Icon name={type.icon} size={24} className={`${type.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-text-primary">{count}</p>
                <p className="text-sm text-text-secondary">{type.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimelineTab;