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
import {
  calculateAutoLayout,
  calculateHierarchicalLayout,
  getLayoutBounds,
  centerLayout,
} from 'utils/autoLayout';

const FamilyTreeCanvas = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('manual');
  const [showMinimap] = useState(true);

  // Initialize with improved layout data matching the reference
  const initialMembers = [
    // Generation 1 - Grandparents
    {
      id: 'grandpa',
      firstName: 'Abdul Rahman',
      lastName: '',
      birthDate: '1960-01-01',
      deathDate: '2023-12-31',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      generation: 1,
      x: 1000,
      y: 80,
      gender: 'male',
      spouseId: 'grandma',
      children: ['father', 'uncle'],
      occupation: 'Kepala Keluarga',
      location: 'Indonesia',
    },
    {
      id: 'grandma',
      firstName: 'Zulmelia',
      lastName: '',
      birthDate: '1962-03-15',
      deathDate: null,
      photo:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      generation: 1,
      x: 650,
      y: 80,
      gender: 'female',
      spouseId: 'grandpa',
      children: ['father', 'uncle'],
      occupation: 'Ibu Rumah Tangga',
      location: 'Indonesia',
    },

    // Generation 2 - Parents
    {
      id: 'father',
      firstName: 'Zulharman Maddani',
      lastName: '',
      birthDate: '1994-05-20',
      deathDate: null,
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 1000,
      y: 350,
      gender: 'male',
      spouseId: null,
      children: [],
      parents: ['grandpa', 'grandma'],
      occupation: 'Profesional',
      location: 'Indonesia',
    },
    {
      id: 'aunt1',
      firstName: 'Dita Yunita Rahman',
      lastName: '',
      birthDate: '1992-08-10',
      deathDate: null,
      photo:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 350,
      y: 350,
      gender: 'female',
      spouseId: null,
      children: [],
      parents: ['grandpa', 'grandma'],
      occupation: 'Dita',
      location: 'Indonesia',
    },
    {
      id: 'aunt2',
      firstName: 'Ismi Tri Oktaviani',
      lastName: '',
      birthDate: '1996-11-25',
      deathDate: null,
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 650,
      y: 350,
      gender: 'female',
      spouseId: null,
      children: [],
      parents: ['grandpa', 'grandma'],
      occupation: 'Profesional',
      location: 'Indonesia',
    },
    {
      id: 'uncle',
      firstName: 'Laksmana Tri Moerdani',
      lastName: '',
      birthDate: '1984-07-15',
      deathDate: null,
      photo:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      generation: 2,
      x: 1350,
      y: 350,
      gender: 'male',
      spouseId: null,
      children: [],
      parents: ['grandpa', 'grandma'],
      occupation: 'Profesional',
      location: 'Indonesia',
    },
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
    markAsSaved,
  } = useGenealogyTree(initialMembers);

  // Enhanced canvas controls
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
    zoomPercentage,
  } = useCanvasControls(1, { x: 0, y: 0 });

  // Real-time drag and drop implementation
  const [isDragging, setIsDragging] = useState(null);

  const handleDragStart = member => {
    setIsDragging(member.id);
  };

  const handleDragMove = (member, newPosition) => {
    const updatedMembers = familyMembers.map(m =>
      m.id === member.id ? { ...m, x: newPosition.x, y: newPosition.y } : m
    );
    updateMembersForDrag(updatedMembers);
  };

  const handleDragEnd = (member, newPosition) => {
    setIsDragging(null);
    const updatedMembers = familyMembers.map(m =>
      m.id === member.id ? { ...m, x: newPosition.x, y: newPosition.y } : m
    );
    updateAllMembers(updatedMembers);
  };

  const isCardDragging = member => {
    return isDragging === member.id;
  };

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const leftPanelWidth = isLeftPanelOpen ? 280 : 0;
      const rightPanelWidth = isRightPanelOpen ? 350 : 0;
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
    const centeredMembers = centerLayout(
      layoutMembers,
      stageSize.width,
      stageSize.height
    );
    updateAllMembers(centeredMembers);
    setLayoutMode('auto');
  }, [familyMembers, stageSize, updateAllMembers]);

  const applyHierarchicalLayout = useCallback(() => {
    const layoutMembers = calculateHierarchicalLayout(familyMembers);
    const centeredMembers = centerLayout(
      layoutMembers,
      stageSize.width,
      stageSize.height
    );
    updateAllMembers(centeredMembers);
    setLayoutMode('hierarchical');
  }, [familyMembers, stageSize, updateAllMembers]);

  // Mock active tree data
  const activeTree = {
    id: 'tree-1',
    name: 'The Rahman Family Tree',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
  };

  // Generation levels with improved positioning
  const generationLevels = Object.keys(generations)
    .map(gen => ({
      level: parseInt(gen),
      y: 50 + (parseInt(gen) - 1) * 270,
      label: `Generation ${gen}`,
    }))
    .sort((a, b) => a.level - b.level);

  // Filter members based on search
  const filteredMembers = searchMembers(searchQuery);

  // Canvas controls
  const handleSave = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    markAsSaved();
  }, [markAsSaved]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Member selection with panel toggle
  const handleMemberSelect = useCallback(
    member => {
      if (selectedMember?.id === member.id) {
        // If clicking the same member, toggle the panel
        setIsRightPanelOpen(!isRightPanelOpen);
      } else {
        // If clicking a different member, select it and show panel
        setSelectedMember(member);
        setIsRightPanelOpen(true);
      }
    },
    [selectedMember, isRightPanelOpen, setSelectedMember]
  );

  // Export functionality
  const handleExport = format => {
    const stage = stageRef.current;
    if (stage) {
      const dataURL = stage.toDataURL({
        mimeType: format === 'pdf' ? 'image/png' : `image/${format}`,
        quality: 1,
        pixelRatio: 2,
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
        {/* Left Panel - Statistics and Controls */}
        <div
          className={`bg-background border-r border-border transition-all duration-300 ${
            isLeftPanelOpen ? 'w-80' : 'w-0'
          } overflow-hidden flex-shrink-0`}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Statistics Section */}
            <div className="mb-8">
              <h3 className="font-heading font-semibold text-lg text-text-primary mb-4">
                Statistik Keluarga
              </h3>

              {/* Total Members */}
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {familyMembers.length}
                    </div>
                    <div className="text-sm text-primary">Total Anggota</div>
                  </div>
                </div>
              </div>

              {/* Generations */}
              <div className="bg-success-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Icon name="TreePine" size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {Object.keys(generations).length}
                    </div>
                    <div className="text-sm text-success">Generasi</div>
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="mb-4">
                <h4 className="font-medium text-text-primary mb-3">
                  Distribusi Gender
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {familyMembers.filter(m => m.gender === 'male').length}
                    </div>
                    <div className="text-sm text-blue-600">Laki-laki</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-pink-600">
                      {familyMembers.filter(m => m.gender === 'female').length}
                    </div>
                    <div className="text-sm text-pink-600">Perempuan</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Controls */}
            <div className="mb-6">
              <h4 className="font-medium text-text-primary mb-3">
                Layout Controls
              </h4>
              <div className="space-y-2">
                <button
                  onClick={applyAutoLayout}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-smooth"
                >
                  <Icon name="Shuffle" size={16} />
                  <span>Auto Layout</span>
                </button>
                <button
                  onClick={zoomToFit}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-surface text-text-primary border border-border rounded-lg hover:bg-secondary-100 transition-smooth"
                >
                  <Icon name="Maximize2" size={16} />
                  <span>Fit View</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <h4 className="font-medium text-text-primary mb-3">
                Cari Anggota
              </h4>
              <div className="relative">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-3 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder="Cari nama..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                />
              </div>
            </div>

            {/* Member List */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">
                Anggota Keluarga ({filteredMembers.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => handleMemberSelect(member)}
                    className={`w-full text-left p-3 rounded-lg border transition-smooth ${
                      selectedMember?.id === member.id
                        ? 'border-primary bg-primary-50'
                        : 'border-border hover:border-primary-200 hover:bg-surface'
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
                          Gen {member.generation} • {member.occupation}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 z-40 flex items-center space-x-2">
            <button
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-smooth shadow-card"
              title="Toggle Statistics Panel"
            >
              <Icon
                name={isLeftPanelOpen ? 'PanelLeftClose' : 'PanelLeftOpen'}
                size={20}
              />
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-text-secondary hover:text-primary transition-smooth shadow-card"
              title="Export Tree"
            >
              <Icon name="Download" size={20} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 z-40 bg-background border border-border rounded-lg shadow-card">
            <div className="flex flex-col">
              <button
                onClick={zoomIn}
                className="p-3 text-text-secondary hover:text-primary hover:bg-surface transition-smooth border-b border-border"
                title="Zoom In"
              >
                <Icon name="Plus" size={16} />
              </button>
              <div className="px-3 py-2 text-xs text-center text-text-secondary border-b border-border">
                {zoomPercentage}%
              </div>
              <button
                onClick={zoomOut}
                className="p-3 text-text-secondary hover:text-primary hover:bg-surface transition-smooth"
                title="Zoom Out"
              >
                <Icon name="Minus" size={16} />
              </button>
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
                    points={[0, gen.y - 30, 2000, gen.y - 30]}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.5}
                  />
                  <Text
                    x={20}
                    y={gen.y - 50}
                    text={`Generasi: ${gen.level}`}
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

        {/* Right Panel - Member Details (Collapsible) */}
        <div
          className={`bg-background border-l border-border transition-all duration-300 ${
            isRightPanelOpen ? 'w-96' : 'w-0'
          } overflow-hidden flex-shrink-0`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-text-primary">
                Detail Anggota
              </h3>
              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth"
                title="Close Panel"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {selectedMember ? (
              <div className="space-y-6">
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
                  <h4 className="font-heading font-semibold text-text-primary">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {selectedMember.occupation}
                  </p>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={`${selectedMember.firstName} ${selectedMember.lastName}`}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Tanggal Lahir
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={selectedMember.birthDate}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Pekerjaan
                    </label>
                    <input
                      id="occupation"
                      type="text"
                      value={selectedMember.occupation}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Lokasi
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={selectedMember.location}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="generation"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Generasi
                    </label>
                    <input
                      id="generation"
                      type="text"
                      value={`Generasi ${selectedMember.generation}`}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                      readOnly
                    />
                  </div>
                </div>

                {/* Relationships */}
                <div>
                  <h5 className="font-medium text-text-primary mb-3">
                    Hubungan Keluarga
                  </h5>
                  <div className="space-y-2">
                    {selectedMember.spouseId && (
                      <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Icon
                            name="Heart"
                            size={16}
                            className="text-accent"
                          />
                          <span className="text-sm text-text-primary">
                            Pasangan
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedMember.children &&
                      selectedMember.children.length > 0 && (
                        <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Icon
                              name="Users"
                              size={16}
                              className="text-primary"
                            />
                            <span className="text-sm text-text-primary">
                              {selectedMember.children.length} Anak
                            </span>
                          </div>
                        </div>
                      )}

                    {selectedMember.parents &&
                      selectedMember.parents.length > 0 && (
                        <div className="flex items-center justify-between p-2 bg-surface rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Icon
                              name="Users"
                              size={16}
                              className="text-secondary"
                            />
                            <span className="text-sm text-text-primary">
                              {selectedMember.parents.length} Orang Tua
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  <button className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-smooth">
                    Edit Detail
                  </button>
                  <button className="w-full bg-surface text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-secondary-100 transition-smooth border border-border">
                    Lihat di Pohon
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon
                  name="Users"
                  size={48}
                  className="text-text-secondary mx-auto mb-4"
                />
                <p className="text-text-secondary">
                  Klik pada kartu anggota keluarga untuk melihat detail
                </p>
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
              <h3 className="font-heading font-semibold text-lg text-text-primary">
                Export Family Tree
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 text-text-secondary hover:text-primary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <p className="text-text-secondary mb-6">
              Choose your preferred export format:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleExport('png')}
                className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-surface transition-smooth"
              >
                <Icon name="Image" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">PNG Image</div>
                  <div className="text-sm text-text-secondary">
                    High quality image with transparency
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleExport('jpg')}
                className="w-full flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary-200 hover:bg-surface transition-smooth"
              >
                <Icon name="Image" size={20} className="text-accent" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">JPG Image</div>
                  <div className="text-sm text-text-secondary">
                    Compressed image format
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeCanvas;
