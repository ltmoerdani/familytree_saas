import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group, Rect, Text, Circle, Image } from 'react-konva';

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
  const [profileImage, setProfileImage] = useState(null);

  // Card dimensions matching the design
  const cardWidth = 180;
  const cardHeight = 200;

  // Photo dimensions
  const photoSize = 80;
  const photoX = (cardWidth - photoSize) / 2;
  const photoY = 30;

  // Load profile image
  useEffect(() => {
    if (member.photo) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setProfileImage(img);
      };
      img.onerror = () => {
        setProfileImage(null);
      };
      img.src = member.photo;
    } else {
      setProfileImage(null);
    }
  }, [member.photo]);

  // Utility functions
  const formatDate = dateString => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  };

  const calculateAge = birthDate => {
    if (!birthDate) return '';
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return `${age} years old`;
  };

  const getBirthYearAndAge = () => {
    if (!member.birthDate) return '';
    const year = formatDate(member.birthDate);
    const age = calculateAge(member.birthDate);
    return `(${year}) ${age}`;
  };

  const getDisplayNickname = () => {
    return member.nickname ? `(${member.nickname})` : '';
  };

  const getDisplayName = () => {
    const firstName = member.firstName || '';
    const lastName = member.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown';
  };

  // Status
  const isDeceased = Boolean(member.deathDate);

  // Calculate scale values for interaction
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
      {/* Card Background - No shadow, clean design */}
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill="white"
        stroke={isSelected ? '#10B981' : '#E5E7EB'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={16}
      />

      {/* Generation number in top-left corner */}
      <Circle
        x={20}
        y={20}
        radius={12}
        fill="#10B981"
        stroke="white"
        strokeWidth={2}
      />
      <Text
        x={20}
        y={20}
        text={member.generation?.toString() || '1'}
        fontSize={12}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="white"
        align="center"
        verticalAlign="middle"
        width={24}
        height={24}
        offsetX={12}
        offsetY={12}
      />

      {/* Photo Container */}
      <Circle
        x={photoX + photoSize / 2}
        y={photoY + photoSize / 2}
        radius={photoSize / 2}
        fill="#A7F3D0"
        stroke="white"
        strokeWidth={3}
      />

      {/* Photo or Placeholder */}
      {profileImage ? (
        <Group
          clipFunc={ctx => {
            ctx.arc(
              photoX + photoSize / 2,
              photoY + photoSize / 2,
              photoSize / 2 - 5,
              0,
              Math.PI * 2,
              false
            );
          }}
        >
          <Image
            x={photoX + 5}
            y={photoY + 5}
            width={photoSize - 10}
            height={photoSize - 10}
            image={profileImage}
          />
        </Group>
      ) : (
        <>
          {/* Photo Placeholder */}
          <Circle
            x={photoX + photoSize / 2}
            y={photoY + photoSize / 2}
            radius={photoSize / 2 - 5}
            fill="#F3F4F6"
          />

          {/* Initial Letter in Photo */}
          <Text
            x={photoX + photoSize / 2}
            y={photoY + photoSize / 2}
            text={getDisplayName().charAt(0).toUpperCase()}
            fontSize={28}
            fontFamily="Inter, Arial, sans-serif"
            fontStyle="bold"
            fill="#6B7280"
            align="center"
            verticalAlign="middle"
            width={photoSize - 10}
            height={photoSize - 10}
            offsetX={(photoSize - 10) / 2}
            offsetY={(photoSize - 10) / 2}
          />
        </>
      )}

      {/* Nickname */}
      {getDisplayNickname() && (
        <Text
          x={10}
          y={photoY + photoSize + 15}
          text={getDisplayNickname()}
          fontSize={14}
          fontFamily="Inter, Arial, sans-serif"
          fontStyle="normal"
          fill="#F59E0B"
          align="center"
          width={cardWidth - 20}
        />
      )}

      {/* Full Name - Allow 2 lines for long names */}
      <Text
        x={10}
        y={photoY + photoSize + (getDisplayNickname() ? 35 : 20)}
        text={getDisplayName()}
        fontSize={16}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="#1F2937"
        align="center"
        width={cardWidth - 20}
        wrap="word"
        lineHeight={1.2}
      />

      {/* Birth Year & Age - Style matching reference */}
      {getBirthYearAndAge() && (
        <Text
          x={10}
          y={photoY + photoSize + (getDisplayNickname() ? 65 : 50)}
          text={getBirthYearAndAge()}
          fontSize={13}
          fontFamily="Inter, Arial, sans-serif"
          fill="#9CA3AF"
          align="center"
          width={cardWidth - 20}
        />
      )}

      {/* Death indicator if deceased */}
      {isDeceased && (
        <Text
          x={10}
          y={photoY + photoSize + (getDisplayNickname() ? 105 : 85)}
          text={`† ${formatDate(member.deathDate)}`}
          fontSize={12}
          fontFamily="Inter, Arial, sans-serif"
          fill="#EF4444"
          align="center"
          width={cardWidth - 20}
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
    nickname: PropTypes.string,
    birthDate: PropTypes.string,
    deathDate: PropTypes.string,
    generation: PropTypes.number,
    gender: PropTypes.oneOf(['male', 'female']),
    photo: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
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
