import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Group } from 'react-konva';
import Header from 'components/ui/Header';
import TreeContextIndicator from 'components/ui/TreeContextIndicator';
import CanvasActionToolbar from 'components/ui/CanvasActionToolbar';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const FamilyTreeCanvas = () => {
  const stageRef = useRef();
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [draggedMember, setDraggedMember] = useState(null);

  // Mock active tree data
  const activeTree = {
    id: 'tree-1',
    name: 'The Johnson Family Tree',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20'
  };

  // Mock family members data with fixed Y positions for generations
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 'member-1',
      firstName: 'Robert',
      lastName: 'Johnson',
      birthDate: '1925-03-15',
      deathDate: '1995-08-22',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      generation: 1,
      x: 400,
      y: 50,
      spouseId: 'member-2',
      children: ['member-3', 'member-4']
    },
    {
      id: 'member-2',
      firstName: 'Mary',
      lastName: 'Johnson',
      birthDate: '1928-07-10',
      deathDate: '1998-12-05',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      generation: 1,
      x: 600,
      y: 50,
      spouseId: 'member-1',
      children: ['member-3', 'member-4']
    },
    {
      id: 'member-3',
      firstName: 'David',
      lastName: 'Johnson',
      birthDate: '1952-11-20',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 300,
      y: 250,
      spouseId: 'member-5',
      children: ['member-6', 'member-7'],
      parents: ['member-1', 'member-2']
    },
    {
      id: 'member-4',
      firstName: 'Susan',
      lastName: 'Wilson',
      birthDate: '1955-04-08',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 700,
      y: 250,
      spouseId: 'member-8',
      children: ['member-9'],
      parents: ['member-1', 'member-2']
    },
    {
      id: 'member-5',
      firstName: 'Linda',
      lastName: 'Johnson',
      birthDate: '1954-09-12',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 500,
      y: 250,
      spouseId: 'member-3',
      children: ['member-6', 'member-7']
    },
    {
      id: 'member-6',
      firstName: 'Michael',
      lastName: 'Johnson',
      birthDate: '1978-02-14',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      generation: 3,
      x: 200,
      y: 450,
      parents: ['member-3', 'member-5']
    },
    {
      id: 'member-7',
      firstName: 'Jennifer',
      lastName: 'Johnson',
      birthDate: '1980-06-25',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      generation: 3,
      x: 400,
      y: 450,
      parents: ['member-3', 'member-5']
    },
    {
      id: 'member-8',
      firstName: 'James',
      lastName: 'Wilson',
      birthDate: '1953-12-03',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 900,
      y: 250,
      spouseId: 'member-4',
      children: ['member-9']
    },
    {
      id: 'member-9',
      firstName: 'Emily',
      lastName: 'Wilson',
      birthDate: '1982-10-18',
      deathDate: null,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      generation: 3,
      x: 800,
      y: 450,
      parents: ['member-4', 'member-8']
    }
  ]);

  // Generation levels with fixed Y positions
  const generationLevels = [
    { level: 1, y: 50, label: 'Great Grandparents' },
    { level: 2, y: 250, label: 'Grandparents' },
    { level: 3, y: 450, label: 'Parents' },
    { level: 4, y: 650, label: 'Children' }
  ];

  // Filter members based on search
  const filteredMembers = familyMembers.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(stageScale * 1.2, 2);
    setStageScale(newScale);
  }, [stageScale]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(stageScale / 1.2, 0.25);
    setStageScale(newScale);
  }, [stageScale]);

  const handleZoomReset = useCallback(() => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const handleSave = useCallback(async () => {
    // Mock save functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      // Restore previous state
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Restore next state
    }
  }, [historyIndex, history]);

  // Member card drag handling
  const handleMemberDragStart = (member) => {
    setDraggedMember(member);
  };

  const handleMemberDragEnd = (e, member) => {
    const newX = e.target.x();
    const generationY = generationLevels.find(g => g.level === member.generation)?.y || member.y;
    
    setFamilyMembers(prev => prev.map(m => 
      m.id === member.id 
        ? { ...m, x: newX, y: generationY }
        : m
    ));
    
    setDraggedMember(null);
    setHasUnsavedChanges(true);
  };

  // Member selection
  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setIsRightPanelOpen(true);
  };

  // Export functionality
  const handleExport = (format) => {
    const stage = stageRef.current;
    if (stage) {
      const dataURL = stage.toDataURL({ 
        mimeType: format === 'pdf' ? 'image/png' : `image/${format}`,
        quality: 1,
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = `${activeTree.name}.${format}`;
      link.href = dataURL;
      link.click();
    }
    setIsExportModalOpen(false);
  };

  // Render family member card on canvas
  const FamilyMemberCard = ({ member }) => {
    const isSelected = selectedMember?.id === member.id;
    const isDragging = draggedMember?.id === member.id;
    
    return (
      <Group
        x={member.x}
        y={member.y}
        draggable
        onDragStart={() => handleMemberDragStart(member)}
        onDragEnd={(e) => handleMemberDragEnd(e, member)}
        onClick={() => handleMemberSelect(member)}
        opacity={isDragging ? 0.7 : 1}
        scaleX={isDragging ? 1.05 : 1}
        scaleY={isDragging ? 1.05 : 1}
      >
        {/* Card background */}
        <Rect
          width={120}
          height={140}
          fill="white"
          stroke={isSelected ? "#8B4513" : "#E5E7EB"}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={4}
          shadowOffset={{ x: 0, y: 2 }}
        />
        
        {/* Photo placeholder */}
        <Circle
          x={60}
          y={30}
          radius={20}
          fill="#D2B48C"
          stroke="#8B4513"
          strokeWidth={1}
        />
        
        {/* Name */}
        <Text
          x={10}
          y={60}
          width={100}
          text={`${member.firstName} ${member.lastName}`}
          fontSize={12}
          fontFamily="Inter"
          fill="#2C1810"
          align="center"
          wrap="word"
        />
        
        {/* Birth date */}
        <Text
          x={10}
          y={85}
          width={100}
          text={`Born: ${new Date(member.birthDate).getFullYear()}`}
          fontSize={10}
          fontFamily="Inter"
          fill="#6B4E3D"
          align="center"
        />
        
        {/* Death date */}
        {member.deathDate && (
          <Text
            x={10}
            y={100}
            width={100}
            text={`Died: ${new Date(member.deathDate).getFullYear()}`}
            fontSize={10}
            fontFamily="Inter"
            fill="#6B4E3D"
            align="center"
          />
        )}
      </Group>
    );
  };

  // Render connection lines
  const ConnectionLines = () => {
    const lines = [];
    
    familyMembers.forEach(member => {
      // Marriage lines (horizontal)
      if (member.spouseId) {
        const spouse = familyMembers.find(m => m.id === member.spouseId);
        if (spouse && member.id < spouse.id) { // Avoid duplicate lines
          lines.push(
            <Line
              key={`marriage-${member.id}-${spouse.id}`}
              points={[
                member.x + 60, member.y + 70,
                spouse.x + 60, spouse.y + 70
              ]}
              stroke="#8B4513"
              strokeWidth={2}
            />
          );
        }
      }
      
      // Parent-child lines (vertical)
      if (member.children) {
        member.children.forEach(childId => {
          const child = familyMembers.find(m => m.id === childId);
          if (child) {
            lines.push(
              <Line
                key={`parent-child-${member.id}-${childId}`}
                points={[
                  member.x + 60, member.y + 140,
                  member.x + 60, member.y + 180,
                  child.x + 60, child.y - 40,
                  child.x + 60, child.y
                ]}
                stroke="#8B4513"
                strokeWidth={1.5}
              />
            );
          }
        });
      }
    });
    
    return lines;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreeContextIndicator activeTree={activeTree} />
      
      <div className="pt-28 h-screen flex">
        {/* Left Panel - Member Search & Controls */}
        <div className={`fixed left-0 top-28 h-full bg-background border-r border-border z-50 transition-transform duration-300 ${
          isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80 md:relative md:translate-x-0 md:w-64`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-text-primary">Family Members</h3>
              <button
                onClick={() => setIsLeftPanelOpen(false)}
                className="md:hidden p-1 text-text-secondary hover:text-primary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Icon name="Search" size={16} className="absolute left-3 top-3 text-text-secondary" />
              <input
                type="text"
                placeholder="Search family members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
              />
            </div>
            
            {/* Add Member Button */}
            <button className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-smooth mb-4 flex items-center justify-center space-x-2">
              <Icon name="Plus" size={16} />
              <span>Add Family Member</span>
            </button>
            
            {/* Generation Filters */}
            <div className="mb-4">
              <h4 className="font-medium text-text-primary mb-2">Generations</h4>
              <div className="space-y-2">
                {generationLevels.map(gen => (
                  <label key={gen.level} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm text-text-secondary">{gen.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Member List */}
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary mb-2">Members ({filteredMembers.length})</h4>
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className={`p-3 rounded-lg border cursor-pointer transition-smooth ${
                    selectedMember?.id === member.id
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Born {new Date(member.birthDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 z-40 flex space-x-2">
            <button
              onClick={() => setIsLeftPanelOpen(true)}
              className="md:hidden w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-smooth"
            >
              <Icon name="Menu" size={20} />
            </button>
            
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-smooth"
              title="Export Tree"
            >
              <Icon name="Download" size={20} />
            </button>
          </div>
          
          {/* Konva Stage */}
          <Stage
            ref={stageRef}
            width={window.innerWidth - (isLeftPanelOpen ? 320 : 0) - (isRightPanelOpen ? 320 : 0)}
            height={window.innerHeight - 112}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePosition.x}
            y={stagePosition.y}
            draggable
            onDragEnd={(e) => setStagePosition({ x: e.target.x(), y: e.target.y() })}
          >
            <Layer>
              {/* Generation level indicators */}
              {generationLevels.map(gen => (
                <React.Fragment key={gen.level}>
                  <Line
                    points={[0, gen.y - 20, 2000, gen.y - 20]}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                  <Text
                    x={20}
                    y={gen.y - 35}
                    text={gen.label}
                    fontSize={12}
                    fontFamily="Inter"
                    fill="#6B4E3D"
                  />
                </React.Fragment>
              ))}
              
              {/* Connection lines */}
              <ConnectionLines />
              
              {/* Family member cards */}
              {familyMembers.map(member => (
                <FamilyMemberCard key={member.id} member={member} />
              ))}
            </Layer>
          </Stage>
        </div>
        
        {/* Right Panel - Member Details */}
        <div className={`fixed right-0 top-28 h-full bg-background border-l border-border z-50 transition-transform duration-300 ${
          isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
        } w-80 md:relative md:translate-x-0 md:w-64`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-text-primary">Member Details</h3>
              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="md:hidden p-1 text-text-secondary hover:text-primary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            {selectedMember ? (
              <div className="space-y-4">
                {/* Photo */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {selectedMember.photo ? (
                      <Image
                        src={selectedMember.photo}
                        alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={32} className="text-primary" />
                    )}
                  </div>
                  <button className="text-sm text-primary hover:text-primary-600 transition-smooth">
                    Change Photo
                  </button>
                </div>
                
                {/* Basic Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">First Name</label>
                    <input
                      type="text"
                      value={selectedMember.firstName}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
                    <input
                      type="text"
                      value={selectedMember.lastName}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={selectedMember.birthDate}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Death Date</label>
                    <input
                      type="date"
                      value={selectedMember.deathDate || ''}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                </div>
                
                {/* Relationships */}
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Relationships</h4>
                  <div className="space-y-2">
                    {selectedMember.spouseId && (
                      <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Icon name="Heart" size={16} className="text-accent" />
                          <span className="text-sm text-text-primary">Spouse</span>
                        </div>
                        <button className="text-xs text-primary hover:text-primary-600">Edit</button>
                      </div>
                    )}
                    
                    {selectedMember.children && selectedMember.children.length > 0 && (
                      <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size={16} className="text-primary" />
                          <span className="text-sm text-text-primary">{selectedMember.children.length} Children</span>
                        </div>
                        <button className="text-xs text-primary hover:text-primary-600">View</button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  <button className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-smooth">
                    Save Changes
                  </button>
                  <button className="w-full bg-surface text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-100 transition-smooth border border-border">
                    Delete Member
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">Select a family member to view and edit their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Canvas Action Toolbar */}
      <CanvasActionToolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoomLevel={Math.round(stageScale * 100)}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1050">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-text-primary">Export Family Tree</h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 text-text-secondary hover:text-primary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <p className="text-text-secondary mb-6">Choose your preferred export format:</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExport('png')}
                className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-surface transition-smooth"
              >
                <Icon name="Image" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">PNG Image</div>
                  <div className="text-sm text-text-secondary">High quality image with transparency</div>
                </div>
              </button>
              
              <button
                onClick={() => handleExport('jpg')}
                className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-surface transition-smooth"
              >
                <Icon name="Image" size={20} className="text-accent" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">JPG Image</div>
                  <div className="text-sm text-text-secondary">Compressed image format</div>
                </div>
              </button>
              
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-surface transition-smooth"
              >
                <Icon name="FileText" size={20} className="text-error" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">PDF Document</div>
                  <div className="text-sm text-text-secondary">Printable document format</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Panel Toggle */}
      <div className="md:hidden fixed bottom-6 left-4 z-40">
        <button
          onClick={() => setIsRightPanelOpen(true)}
          className="w-12 h-12 bg-primary text-white rounded-full shadow-modal flex items-center justify-center transition-smooth hover:bg-primary-600"
          title="Member Details"
        >
          <Icon name="User" size={20} />
        </button>
      </div>
    </div>
  );
};

export default FamilyTreeCanvas;