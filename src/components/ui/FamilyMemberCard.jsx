import React from 'react';
import PropTypes from 'prop-types';
import { Group, Rect, Text, Circle } from 'react-konva';

/**
 * Enhanced family member card matching the reference design
 */
const FamilyMemberCard = ({
  member,
  isSelected = false,
  isDragging = false,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDoubleClick,
}) => {
  // Enhanced card dimensions for better layout
  const cardWidth = 160;
  const cardHeight = 180;

  // Color theme based on gender
  const getCardTheme = () => {
    if (member.gender === 'male') {
      return {
        primary: '#3B82F6',
        secondary: '#DBEAFE',
        border: '#2563EB',
        accent: '#1D4ED8',
      };
    } else if (member.gender === 'female') {
      return {
        primary: '#EC4899',
        secondary: '#FCE7F3',
        border: '#DB2777',
        accent: '#BE185D',
      };
    }

    return {
      primary: '#8B4513',
      secondary: '#F5F5DC',
      border: '#D2B48C',
      accent: '#A0522D',
    };
  };

  const theme = getCardTheme();

  // Format date
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  };

  // Status
  const isDeceased = Boolean(member.deathDate);

  // Utility function to get age or death text
  const getAgeOrDeathText = () => {
    if (isDeceased) {
      return `† ${formatDate(member.deathDate)}`;
    }

    if (member.birthDate) {
      const age =
        new Date().getFullYear() - new Date(member.birthDate).getFullYear();
      return `${age} tahun`;
    }

    return '';
  };

  // Name with proper truncation
  const displayName = member.firstName || 'Unknown';
  const displayLastName = member.lastName || '';

  // Calculate scale values
  let scaleX = 1;
  let scaleY = 1;

  if (isDragging) {
    scaleX = 1.05;
    scaleY = 1.05;
  } else if (isSelected) {
    scaleX = 1.02;
    scaleY = 1.02;
  }

  return (
    <Group
      x={member.x}
      y={member.y}
      draggable
      onDragStart={() => onDragStart?.(member)}
      onDragMove={e =>
        onDragMove?.(member, { x: e.target.x(), y: e.target.y() })
      }
      onDragEnd={e => onDragEnd?.(member, { x: e.target.x(), y: e.target.y() })}
      onClick={() => onSelect?.(member)}
      onDblClick={() => onDoubleClick?.(member)}
      opacity={isDragging ? 0.8 : 1}
      scaleX={scaleX}
      scaleY={scaleY}
    >
      {/* Card Shadow */}
      <Rect
        x={3}
        y={3}
        width={cardWidth}
        height={cardHeight}
        fill="rgba(0,0,0,0.1)"
        cornerRadius={12}
      />

      {/* Card Background */}
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill="white"
        stroke={isSelected ? theme.border : '#E5E7EB'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={12}
      />

      {/* Generation indicator */}
      <Circle x={cardWidth - 15} y={15} radius={8} fill={theme.primary} />
      <Text
        x={cardWidth - 20}
        y={10}
        text={member.generation.toString()}
        fontSize={10}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="white"
        align="center"
        width={10}
      />

      {/* Photo area */}
      <Circle
        x={cardWidth / 2}
        y={50}
        radius={25}
        fill={theme.secondary}
        stroke={theme.primary}
        strokeWidth={2}
      />

      {/* Gender/Status indicator inside photo */}
      <Circle
        x={cardWidth / 2}
        y={50}
        radius={18}
        fill={isDeceased ? '#9E9E9E' : theme.primary}
        opacity={0.8}
      />

      {/* Initial or icon */}
      <Text
        x={cardWidth / 2 - 8}
        y={44}
        text={displayName ? displayName.charAt(0).toUpperCase() : '?'}
        fontSize={16}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="white"
      />

      {/* Name */}
      <Text
        x={10}
        y={85}
        width={cardWidth - 20}
        text={displayName}
        fontSize={14}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="#2C1810"
        align="center"
        wrap="none"
      />

      {/* Last name if exists */}
      {displayLastName && (
        <Text
          x={10}
          y={105}
          width={cardWidth - 20}
          text={displayLastName}
          fontSize={12}
          fontFamily="Inter, Arial, sans-serif"
          fill="#6B4E3D"
          align="center"
          wrap="none"
        />
      )}

      {/* Birth year */}
      <Text
        x={10}
        y={125}
        width={cardWidth - 20}
        text={member.birthDate ? `(${formatDate(member.birthDate)})` : ''}
        fontSize={11}
        fontFamily="Inter, Arial, sans-serif"
        fill="#6B4E3D"
        align="center"
      />

      {/* Age or death year */}
      <Text
        x={10}
        y={140}
        width={cardWidth - 20}
        text={getAgeOrDeathText()}
        fontSize={10}
        fontFamily="Inter, Arial, sans-serif"
        fill={isDeceased ? '#9E9E9E' : '#6B4E3D'}
        align="center"
      />

      {/* Occupation */}
      {member.occupation && (
        <Text
          x={10}
          y={155}
          width={cardWidth - 20}
          text={member.occupation}
          fontSize={9}
          fontFamily="Inter, Arial, sans-serif"
          fill="#9E9E9E"
          align="center"
          wrap="none"
        />
      )}

      {/* Location indicator */}
      {member.location && (
        <Text
          x={10}
          y={cardHeight - 15}
          width={cardWidth - 20}
          text={`📍 ${member.location}`}
          fontSize={8}
          fontFamily="Inter, Arial, sans-serif"
          fill="#9E9E9E"
          align="center"
        />
      )}

      {/* Relationship indicators */}
      {member.spouseId && (
        <Circle
          x={15}
          y={cardHeight - 20}
          radius={4}
          fill="#E91E63"
          stroke="white"
          strokeWidth={1}
        />
      )}

      {member.children && member.children.length > 0 && (
        <Circle
          x={cardWidth - 15}
          y={cardHeight - 20}
          radius={6}
          fill="#4CAF50"
          stroke="white"
          strokeWidth={1}
        />
      )}

      {member.children && member.children.length > 0 && (
        <Text
          x={cardWidth - 20}
          y={cardHeight - 25}
          text={member.children.length.toString()}
          fontSize={8}
          fontFamily="Inter, Arial, sans-serif"
          fill="white"
          fontStyle="bold"
          align="center"
          width={10}
        />
      )}

      {/* Selection highlight */}
      {isSelected && (
        <Rect
          x={-3}
          y={-3}
          width={cardWidth + 6}
          height={cardHeight + 6}
          stroke={theme.border}
          strokeWidth={3}
          cornerRadius={15}
          fill="transparent"
          dash={[8, 4]}
        />
      )}
    </Group>
  );
};

FamilyMemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
    deathDate: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    generation: PropTypes.number.isRequired,
    gender: PropTypes.oneOf(['male', 'female']),
    spouseId: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.string),
    occupation: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  isDragging: PropTypes.bool,
  onSelect: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

export default FamilyMemberCard;
