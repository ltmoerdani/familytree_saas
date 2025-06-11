/**
 * Minimap component for canvas navigation
 * Provides overview of the entire family tree and current viewport
 */

import React from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import Icon from 'components/AppIcon';

const Minimap = ({ 
  familyMembers = [], 
  minimapData, 
  onMinimapClick, 
  isVisible = true,
  className = ""
}) => {
  if (!isVisible || !minimapData) return null;

  const { minimapWidth, minimapHeight, minimapScale, viewport } = minimapData;

  const handleStageClick = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    if (onMinimapClick) {
      onMinimapClick(pos.x, pos.y, minimapData);
    }
  };

  return (
    <div className={`absolute bg-background border border-border rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-primary">Overview</span>
          <Icon name="Minimize2" size={12} className="text-text-secondary" />
        </div>
      </div>
      
      {/* Minimap Canvas */}
      <div className="relative">
        <Stage
          width={Math.max(minimapWidth, 150)}
          height={Math.max(minimapHeight, 100)}
          onClick={handleStageClick}
          style={{ cursor: 'pointer' }}
        >
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={minimapWidth}
              height={minimapHeight}
              fill="#F9FAFB"
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
            
            {/* Family members as small rectangles */}
            {familyMembers.map(member => (
              <Rect
                key={member.id}
                x={(member.x || 0) * minimapScale - 2}
                y={(member.y || 0) * minimapScale - 2}
                width={4}
                height={4}
                fill="#8B5CF6"
                cornerRadius={1}
              />
            ))}
            
            {/* Viewport indicator */}
            <Group>
              <Rect
                x={viewport.x}
                y={viewport.y}
                width={viewport.width}
                height={viewport.height}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#3B82F6"
                strokeWidth={1}
                dash={[2, 2]}
              />
            </Group>
          </Layer>
        </Stage>
      </div>
      
      {/* Scale indicator */}
      <div className="px-3 py-1 border-t border-border bg-surface">
        <div className="text-xs text-text-secondary text-center">
          {Math.round((1 / minimapScale) * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Minimap;
