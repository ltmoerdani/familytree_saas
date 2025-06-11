// filepath: src/components/ui/FamilyMemberCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Group, Rect, Text, Circle } from 'react-konva';
import { LAYOUT_CONFIG } from '../../utils/genealogyLayout';

/**
 * Komponen kartu anggota keluarga untuk canvas genealogi
 * Mengikuti prinsip Single Responsibility dan Reusable Components
 */
const FamilyMemberCard = ({ 
  member, 
  isSelected = false, 
  isDragging = false,
  onSelect,
  onDragStart,
  onDragEnd,
  onDoubleClick 
}) => {
  const { CARD_WIDTH, CARD_HEIGHT } = LAYOUT_CONFIG;
  
  // Warna tema berdasarkan gender atau status
  const getCardTheme = () => {
    if (member.gender === 'male') {
      return {
        primary: '#4A90E2',
        secondary: '#E3F2FD',
        border: '#2196F3'
      };
    } else if (member.gender === 'female') {
      return {
        primary: '#E91E63',
        secondary: '#FCE4EC',
        border: '#F06292'
      };
    }
    
    // Default theme
    return {
      primary: '#8B4513',
      secondary: '#F5F5DC',
      border: '#D2B48C'
    };
  };

  const theme = getCardTheme();
  
  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  };

  // Status hidup/mati
  const isDeceased = Boolean(member.deathDate);
  
  // Nama lengkap dengan truncation jika terlalu panjang
  const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim();
  const displayName = fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName;
  
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
      onDragEnd={(e) => onDragEnd?.(e, member)}
      onClick={() => onSelect?.(member)}
      onDblClick={() => onDoubleClick?.(member)}
      opacity={isDragging ? 0.7 : 1}
      scaleX={scaleX}
      scaleY={scaleY}
    >
      {/* Card Shadow */}
      <Rect
        x={2}
        y={2}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        fill="rgba(0,0,0,0.1)"
        cornerRadius={8}
      />
      
      {/* Card Background */}
      <Rect
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        fill="white"
        stroke={isSelected ? theme.border : '#E5E7EB'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={8}
      />
      
      {/* Header Background */}
      <Rect
        width={CARD_WIDTH}
        height={25}
        fill={theme.secondary}
        cornerRadius={[8, 8, 0, 0]}
      />
      
      {/* Status Indicator (untuk yang sudah meninggal) */}
      {isDeceased && (
        <Rect
          x={CARD_WIDTH - 15}
          y={5}
          width={10}
          height={15}
          fill="#9E9E9E"
          cornerRadius={2}
        />
      )}
      
      {/* Photo atau Avatar */}
      <Circle
        x={CARD_WIDTH / 2}
        y={45}
        radius={18}
        fill={theme.primary}
        stroke="white"
        strokeWidth={2}
      />
      
      {/* Gender indicator (small circle inside photo) */}
      <Circle
        x={CARD_WIDTH / 2}
        y={45}
        radius={12}
        fill={isDeceased ? '#9E9E9E' : theme.primary}
        opacity={0.7}
      />
      
      {/* Initial atau foto placeholder */}
      <Text
        x={CARD_WIDTH / 2 - 6}
        y={40}
        text={member.firstName ? member.firstName.charAt(0).toUpperCase() : '?'}
        fontSize={14}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="white"
      />
      
      {/* Nama */}
      <Text
        x={5}
        y={75}
        width={CARD_WIDTH - 10}
        text={displayName}
        fontSize={11}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="#2C1810"
        align="center"
        wrap="none"
      />
      
      {/* Tanggal lahir */}
      <Text
        x={5}
        y={95}
        width={CARD_WIDTH - 10}
        text={member.birthDate ? `Born: ${formatDate(member.birthDate)}` : 'Birth: Unknown'}
        fontSize={9}
        fontFamily="Inter, Arial, sans-serif"
        fill="#6B4E3D"
        align="center"
      />
      
      {/* Tanggal meninggal */}
      {isDeceased && (
        <Text
          x={5}
          y={108}
          width={CARD_WIDTH - 10}
          text={`Died: ${formatDate(member.deathDate)}`}
          fontSize={9}
          fontFamily="Inter, Arial, sans-serif"
          fill="#9E9E9E"
          align="center"
        />
      )}
      
      {/* Generation indicator */}
      <Text
        x={5}
        y={CARD_HEIGHT - 15}
        text={`Gen ${member.generation}`}
        fontSize={8}
        fontFamily="Inter, Arial, sans-serif"
        fill="#9E9E9E"
      />
      
      {/* Relationship indicators */}
      {member.spouseId && (
        <Circle
          x={CARD_WIDTH - 15}
          y={CARD_HEIGHT - 15}
          radius={4}
          fill="#E91E63"
          stroke="white"
          strokeWidth={1}
        />
      )}
      
      {member.children && member.children.length > 0 && (
        <Text
          x={CARD_WIDTH - 25}
          y={CARD_HEIGHT - 20}
          text={member.children.length.toString()}
          fontSize={8}
          fontFamily="Inter, Arial, sans-serif"
          fill="#4CAF50"
          fontStyle="bold"
        />
      )}
      
      {/* Selection highlight */}
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={CARD_WIDTH + 4}
          height={CARD_HEIGHT + 4}
          stroke={theme.border}
          strokeWidth={2}
          cornerRadius={10}
          fill="transparent"
          dash={[5, 5]}
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
    children: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  isSelected: PropTypes.bool,
  isDragging: PropTypes.bool,
  onSelect: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDoubleClick: PropTypes.func
};

FamilyMemberCard.defaultProps = {
  isSelected: false,
  isDragging: false,
  onSelect: null,
  onDragStart: null,
  onDragEnd: null,
  onDoubleClick: null
};

export default FamilyMemberCard;
