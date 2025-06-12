import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import Header from 'components/ui/Header';
import TreeContextIndicator from 'components/ui/TreeContextIndicator';
import CanvasActionToolbar from 'components/ui/CanvasActionToolbar';
import GenealogyConnections from 'components/ui/GenealogyConnections';
import FamilyMemberCard from 'components/ui/FamilyMemberCard';
import Minimap from 'components/ui/Minimap';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { useGenealogyTree } from 'hooks/useGenealogyTree';
import { useCanvasControls } from 'hooks/useCanvasControls';
import { calculateAutoLayout, calculateHierarchicalLayout, getLayoutBounds, centerLayout } from 'utils/autoLayout';

const FamilyTreeCanvas = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('manual'); // 'auto', 'hierarchical', 'manual'
  const [showMinimap, setShowMinimap] = useState(true);

  // Initialize with mock data
  const initialMembers = [
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
      gender: 'male',
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
      gender: 'female',
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
      gender: 'male',
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
      gender: 'female',
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
      gender: 'female',
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
      gender: 'male',
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
      gender: 'female',
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
      gender: 'male',
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
      gender: 'female',
      parents: ['member-4', 'member-8']
    }
  ];

  // Use genealogy tree hook
  const {
    familyMembers,
    selectedMember,
    hasUnsavedChanges,
    generations,
    setSelectedMember,
    updateAllMembers,
    updateMembersForDrag,
    undo,
    redo,
    canUndo,
    canRedo,
    searchMembers,
    markAsSaved
  } = useGenealogyTree(initialMembers);

  // Enhanced canvas controls with zoom, pan, and minimap
  const {
    scale,
    position,
    stageRef,
    stageSize,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
    handleWheel,
    handleDragStart: handleStageDragStart,
    handleDragEnd: handleStageDragEnd,
    updateStageSize,
    updateContentBounds,
    getMinimapData,
    handleMinimapClick,
    zoomPercentage
  } = useCanvasControls(1, { x: 0, y: 0 });

  // Real-time drag and drop implementation (sama seperti demo yang berhasil)
  const [isDragging, setIsDragging] = useState(null);

  const handleDragStart = (member) => {
    setIsDragging(member.id);
  };

  const handleDragMove = (member, newPosition) => {
    // Update posisi secara real-time saat drag - sama seperti demo, tanpa history
    const updatedMembers = familyMembers.map(m => 
      m.id === member.id 
        ? { ...m, x: newPosition.x, y: newPosition.y }
        : m
    );
    updateMembersForDrag(updatedMembers);
  };

  const handleDragEnd = (member, newPosition) => {
    setIsDragging(null);
    
    // Final update posisi member - sama seperti demo, dengan history
    const updatedMembers = familyMembers.map(m => 
      m.id === member.id 
        ? { ...m, x: newPosition.x, y: newPosition.y }
        : m
    );
    updateAllMembers(updatedMembers);
  };

  const isCardDragging = (member) => {
    return isDragging === member.id;
  };

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const leftPanelWidth = isLeftPanelOpen ? 320 : 0;
      const rightPanelWidth = isRightPanelOpen ? 320 : 0;
      const width = window.innerWidth - leftPanelWidth - rightPanelWidth;
      const height = window.innerHeight - 112;
      updateStageSize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLeftPanelOpen, isRightPanelOpen, updateStageSize]);

  // Update content bounds when family members change
  useEffect(() => {
    const bounds = getLayoutBounds(familyMembers);
    updateContentBounds(bounds);
  }, [familyMembers, updateContentBounds]);

  // Auto-layout functions
  const applyAutoLayout = useCallback(() => {
    const layoutMembers = calculateAutoLayout(familyMembers);
    const centeredMembers = centerLayout(layoutMembers, stageSize.width, stageSize.height);
    updateAllMembers(centeredMembers);
    setLayoutMode('auto');
  }, [familyMembers, stageSize, updateAllMembers]);

  const applyHierarchicalLayout = useCallback(() => {
    const layoutMembers = calculateHierarchicalLayout(familyMembers);
    const centeredMembers = centerLayout(layoutMembers, stageSize.width, stageSize.height);
    updateAllMembers(centeredMembers);
    setLayoutMode('hierarchical');
  }, [familyMembers, stageSize, updateAllMembers]);

  // Mock active tree data
  const activeTree = {
    id: 'tree-1',
    name: 'The Johnson Family Tree',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20'
  };

  // Generation levels with improved positioning
  const generationLevels = Object.keys(generations).map(gen => ({
    level: parseInt(gen),
    y: 50 + ((parseInt(gen) - 1) * 200),
    label: `Generation ${gen}`
  })).sort((a, b) => a.level - b.level);

  // Filter members based on search
  const filteredMembers = searchMembers(searchQuery);

  // Canvas controls
  const handleSave = useCallback(async () => {
    // Mock save functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    markAsSaved();
  }, [markAsSaved]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Member selection
  const handleMemberSelect = useCallback((member) => {
    setSelectedMember(member);
    setIsRightPanelOpen(true);
  }, [setSelectedMember]);

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

  // Get minimap data
  const minimapData = showMinimap ? getMinimapData() : null;

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
          <div className="absolute top-4 left-4 z-40 flex flex-col space-y-2">
            <div className="flex space-x-2">
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
            
            {/* Layout Controls */}
            <div className="bg-background border border-border rounded-lg p-2">
              <div className="text-xs font-medium text-text-primary mb-2">Layout</div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={applyAutoLayout}
                  className={`px-2 py-1 text-xs rounded ${
                    layoutMode === 'auto' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text-secondary hover:bg-secondary'
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={applyHierarchicalLayout}
                  className={`px-2 py-1 text-xs rounded ${
                    layoutMode === 'hierarchical' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text-secondary hover:bg-secondary'
                  }`}
                >
                  Hierarchical
                </button>
                <button
                  onClick={() => setLayoutMode('manual')}
                  className={`px-2 py-1 text-xs rounded ${
                    layoutMode === 'manual' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text-secondary hover:bg-secondary'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="bg-background border border-border rounded-lg p-2">
              <div className="text-xs font-medium text-text-primary mb-2">Zoom</div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={zoomIn}
                  className="w-8 h-8 bg-surface text-text-secondary hover:bg-secondary rounded flex items-center justify-center"
                  title="Zoom In"
                >
                  <Icon name="Plus" size={14} />
                </button>
                <div className="text-xs text-center text-text-secondary py-1">
                  {zoomPercentage}%
                </div>
                <button
                  onClick={zoomOut}
                  className="w-8 h-8 bg-surface text-text-secondary hover:bg-secondary rounded flex items-center justify-center"
                  title="Zoom Out"
                >
                  <Icon name="Minus" size={14} />
                </button>
                <button
                  onClick={zoomToFit}
                  className="w-8 h-8 bg-surface text-text-secondary hover:bg-secondary rounded flex items-center justify-center"
                  title="Fit to Screen"
                >
                  <Icon name="Maximize2" size={12} />
                </button>
                <button
                  onClick={resetZoom}
                  className="w-8 h-8 bg-surface text-text-secondary hover:bg-secondary rounded flex items-center justify-center"
                  title="Reset Zoom"
                >
                  <Icon name="RotateCcw" size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Minimap */}
          {showMinimap && (
            <Minimap
              familyMembers={familyMembers}
              minimapData={minimapData}
              onMinimapClick={handleMinimapClick}
              className="top-4 right-4"
            />
          )}

          {/* Minimap Toggle */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className="absolute top-4 right-4 w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-smooth z-30"
            title={showMinimap ? "Hide Minimap" : "Show Minimap"}
            style={{ right: showMinimap ? '220px' : '16px' }}
          >
            <Icon name={showMinimap ? "EyeOff" : "Eye"} size={16} />
          </button>
          
          {/* Konva Stage */}
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
            draggable={layoutMode === 'manual'}
            onWheel={handleWheel}
            onDragStart={handleStageDragStart}
            onDragEnd={handleStageDragEnd}
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
              
              {/* Genealogy connection lines */}
              <GenealogyConnections familyMembers={familyMembers} />
              
              {/* Family member cards */}
              {familyMembers.map(member => (
                <FamilyMemberCard 
                  key={member.id} 
                  member={member}
                  isSelected={selectedMember?.id === member.id}
                  isDragging={isCardDragging(member)}
                  onSelect={handleMemberSelect}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
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
                    <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={selectedMember.firstName}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={selectedMember.lastName}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-text-primary mb-1">Birth Date</label>
                    <input
                      id="birthDate"
                      type="date"
                      value={selectedMember.birthDate}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deathDate" className="block text-sm font-medium text-text-primary mb-1">Death Date</label>
                    <input
                      id="deathDate"
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
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={resetZoom}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoomLevel={zoomPercentage}
        hasUnsavedChanges={hasUnsavedChanges}
        onAutoLayout={applyAutoLayout}
        onHierarchicalLayout={applyHierarchicalLayout}
        layoutMode={layoutMode}
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