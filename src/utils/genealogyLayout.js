// filepath: src/utils/genealogyLayout.js
/**
 * Enhanced genealogy layout utilities matching reference design
 */

// Enhanced layout constants for better spacing
export const LAYOUT_CONFIG = {
  CARD_WIDTH: 160,
  CARD_HEIGHT: 180,
  GENERATION_GAP: 270,
  SIBLING_GAP: 200,
  MARRIAGE_GAP: 60,
  PARENT_CHILD_VERTICAL_GAP: 80,
  CONNECTION_OFFSET: 40,
};

/**
 * Calculate optimal layout for family members with improved spacing
 */
export const calculateOptimalLayout = familyMembers => {
  const generations = groupByGeneration(familyMembers);
  const generationYPositions = calculateGenerationYPositions(generations);

  const updatedMembers = familyMembers.map(member => {
    const generationY = generationYPositions[member.generation];
    return {
      ...member,
      y: generationY,
    };
  });

  return optimizeXPositions(updatedMembers, generations);
};

/**
 * Group family members by generation
 */
export const groupByGeneration = familyMembers => {
  return familyMembers.reduce((acc, member) => {
    if (!acc[member.generation]) {
      acc[member.generation] = [];
    }
    acc[member.generation].push(member);
    return acc;
  }, {});
};

/**
 * Calculate Y positions for each generation with improved spacing
 */
export const calculateGenerationYPositions = generations => {
  const generationNumbers = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b);
  const positions = {};

  generationNumbers.forEach((gen, index) => {
    positions[gen] = 80 + index * LAYOUT_CONFIG.GENERATION_GAP;
  });

  return positions;
};

/**
 * Position married pairs with improved spacing
 */
const positionMarriedPairs = (pairIds, updatedMembers, currentX) => {
  const pair = pairIds.map(id => updatedMembers.find(m => m.id === id));

  // Position spouses with proper spacing
  pair[0].x = currentX;
  pair[1].x = currentX + LAYOUT_CONFIG.CARD_WIDTH + LAYOUT_CONFIG.MARRIAGE_GAP;

  return (
    currentX +
    LAYOUT_CONFIG.CARD_WIDTH * 2 +
    LAYOUT_CONFIG.MARRIAGE_GAP +
    LAYOUT_CONFIG.SIBLING_GAP
  );
};

/**
 * Position single member
 */
const positionSingleMember = (member, currentX) => {
  member.x = currentX;
  return currentX + LAYOUT_CONFIG.CARD_WIDTH + LAYOUT_CONFIG.SIBLING_GAP;
};

/**
 * Process X positions for one generation with improved layout
 */
const processGenerationXPositions = (genNumber, updatedMembers) => {
  const genMembers = updatedMembers.filter(m => m.generation === genNumber);

  // Group married pairs
  const marriedPairs = findMarriedPairs(genMembers);
  const singleMembers = genMembers.filter(
    m => !marriedPairs.some(pair => pair.includes(m.id))
  );

  let currentX = 150; // Improved starting position

  // Position married pairs first
  marriedPairs.forEach(pairIds => {
    currentX = positionMarriedPairs(pairIds, updatedMembers, currentX);
  });

  // Position single members
  singleMembers.forEach(member => {
    currentX = positionSingleMember(member, currentX);
  });
};

/**
 * Optimize X positions with improved spacing and alignment
 */
export const optimizeXPositions = (familyMembers, generations) => {
  const updatedMembers = [...familyMembers];

  const sortedGenerations = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b);

  sortedGenerations.forEach(genNumber => {
    processGenerationXPositions(genNumber, updatedMembers);
  });

  return updatedMembers;
};

/**
 * Find married pairs in a generation
 */
export const findMarriedPairs = members => {
  const pairs = [];
  const processed = new Set();

  members.forEach(member => {
    if (member.spouseId && !processed.has(member.id)) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse) {
        pairs.push([member.id, spouse.id]);
        processed.add(member.id);
        processed.add(spouse.id);
      }
    }
  });

  return pairs;
};

/**
 * Get connection point for genealogy lines
 */
export const getConnectionPoint = (member, connectionType = 'center') => {
  const { x, y } = member;
  const { CARD_WIDTH, CARD_HEIGHT } = LAYOUT_CONFIG;

  switch (connectionType) {
    case 'top':
      return { x: x + CARD_WIDTH / 2, y: y };
    case 'bottom':
      return { x: x + CARD_WIDTH / 2, y: y + CARD_HEIGHT };
    case 'left':
      return { x: x, y: y + CARD_HEIGHT / 2 };
    case 'right':
      return { x: x + CARD_WIDTH, y: y + CARD_HEIGHT / 2 };
    case 'center':
    default:
      return { x: x + CARD_WIDTH / 2, y: y + CARD_HEIGHT / 2 };
  }
};

/**
 * Validate family relationships
 */
export const validateFamilyRelationships = familyMembers => {
  const errors = [];

  familyMembers.forEach(member => {
    // Validate spouse relationship
    if (member.spouseId) {
      const spouse = familyMembers.find(m => m.id === member.spouseId);
      if (!spouse) {
        errors.push(
          `Spouse with ID ${member.spouseId} not found for ${member.firstName} ${member.lastName}`
        );
      } else if (spouse.spouseId !== member.id) {
        errors.push(
          `Spouse relationship not mutual between ${member.firstName} and ${spouse.firstName}`
        );
      }
    }

    // Validate parent-child relationship
    if (member.children) {
      member.children.forEach(childId => {
        const child = familyMembers.find(m => m.id === childId);
        if (!child) {
          errors.push(
            `Child with ID ${childId} not found for ${member.firstName} ${member.lastName}`
          );
        } else if (!child.parents?.includes(member.id)) {
          errors.push(
            `Parent relationship not mutual between ${member.firstName} and ${child.firstName}`
          );
        }
      });
    }

    // Validate parents relationship
    if (member.parents) {
      member.parents.forEach(parentId => {
        const parent = familyMembers.find(m => m.id === parentId);
        if (!parent) {
          errors.push(
            `Parent with ID ${parentId} not found for ${member.firstName} ${member.lastName}`
          );
        } else if (!parent.children?.includes(member.id)) {
          errors.push(
            `Child relationship not mutual between ${parent.firstName} and ${member.firstName}`
          );
        }
      });
    }
  });

  return errors;
};

/**
 * Calculate tree bounds with improved margins
 */
export const calculateTreeBounds = familyMembers => {
  if (familyMembers.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const { CARD_WIDTH, CARD_HEIGHT } = LAYOUT_CONFIG;

  const minX = Math.min(...familyMembers.map(m => m.x)) - 100;
  const maxX = Math.max(...familyMembers.map(m => m.x + CARD_WIDTH)) + 100;
  const minY = Math.min(...familyMembers.map(m => m.y)) - 100;
  const maxY = Math.max(...familyMembers.map(m => m.y + CARD_HEIGHT)) + 100;

  return { minX, minY, maxX, maxY };
};