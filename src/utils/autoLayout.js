/**
 * Auto-layout utilities using Dagre for family tree positioning
 * Implements automatic node positioning and layout calculation
 */

import dagre from 'dagre';

export const LAYOUT_CONFIG = {
  CARD_WIDTH: 180,
  CARD_HEIGHT: 120,
  NODE_SEP: 50,
  EDGE_SEP: 20,
  RANK_SEP: 150,
  MARGIN_X: 50,
  MARGIN_Y: 50
};

/**
 * Create Dagre graph for family tree auto-layout
 * @param {Array} familyMembers - Array of family members
 * @returns {Object} Dagre graph instance
 */
export const createFamilyGraph = () => {
  const g = new dagre.graphlib.Graph();
  
  // Set graph properties
  g.setGraph({
    rankdir: 'TB', // Top to Bottom
    nodesep: LAYOUT_CONFIG.NODE_SEP,
    edgesep: LAYOUT_CONFIG.EDGE_SEP,
    ranksep: LAYOUT_CONFIG.RANK_SEP,
    marginx: LAYOUT_CONFIG.MARGIN_X,
    marginy: LAYOUT_CONFIG.MARGIN_Y
  });
  
  g.setDefaultEdgeLabel(() => ({}));
  
  return g;
};

/**
 * Add family members as nodes to the graph
 * @param {Object} graph - Dagre graph instance
 * @param {Array} familyMembers - Array of family members
 */
export const addNodesToGraph = (graph, familyMembers) => {
  familyMembers.forEach(member => {
    graph.setNode(member.id, {
      label: `${member.firstName} ${member.lastName}`,
      width: LAYOUT_CONFIG.CARD_WIDTH,
      height: LAYOUT_CONFIG.CARD_HEIGHT,
      member: member
    });
  });
};

/**
 * Add family relationships as edges to the graph
 * @param {Object} graph - Dagre graph instance
 * @param {Array} familyMembers - Array of family members
 */
export const addEdgesToGraph = (graph, familyMembers) => {
  familyMembers.forEach(member => {
    // Add parent-child relationships
    if (member.parents && member.parents.length > 0) {
      member.parents.forEach(parentId => {
        if (graph.hasNode(parentId)) {
          graph.setEdge(parentId, member.id, {
            type: 'parent-child',
            weight: 1
          });
        }
      });
    }
    
    // Add spouse relationships (but don't create duplicate edges)
    if (member.spouseId) {
      const spouseExists = graph.hasNode(member.spouseId);
      const edgeExists = graph.hasEdge(member.spouseId, member.id);
      
      if (spouseExists && !edgeExists) {
        graph.setEdge(member.id, member.spouseId, {
          type: 'spouse',
          weight: 0.5
        });
      }
    }
  });
};

/**
 * Calculate auto-layout positions using Dagre
 * @param {Array} familyMembers - Array of family members
 * @returns {Array} Array of family members with updated positions
 */
export const calculateAutoLayout = (familyMembers) => {
  try {
    const graph = createFamilyGraph();
    
    // Add nodes and edges
    addNodesToGraph(graph, familyMembers);
    addEdgesToGraph(graph, familyMembers);
    
    // Run layout algorithm
    dagre.layout(graph);
    
    // Extract positioned nodes
    const positionedMembers = familyMembers.map(member => {
      const node = graph.node(member.id);
      return {
        ...member,
        x: node.x,
        y: node.y
      };
    });
    
    return positionedMembers;
  } catch (error) {
    console.warn('Auto-layout failed, using manual positioning:', error);
    return familyMembers;
  }
};

/**
 * Calculate hierarchical layout by generation
 * Alternative layout when Dagre fails or for simple trees
 * @param {Array} familyMembers - Array of family members
 * @returns {Array} Array of family members with updated positions
 */
export const calculateHierarchicalLayout = (familyMembers) => {
  // Group by generation
  const generations = familyMembers.reduce((acc, member) => {
    if (!acc[member.generation]) {
      acc[member.generation] = [];
    }
    acc[member.generation].push(member);
    return acc;
  }, {});
  
  const sortedGenerations = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b);
  
  let positionedMembers = [];
  
  sortedGenerations.forEach((genNumber, genIndex) => {
    const genMembers = generations[genNumber];
    const y = LAYOUT_CONFIG.MARGIN_Y + (genIndex * LAYOUT_CONFIG.RANK_SEP);
    
    // Simple horizontal distribution
    const startX = LAYOUT_CONFIG.MARGIN_X;
    
    genMembers.forEach((member, memberIndex) => {
      const x = startX + (memberIndex * (LAYOUT_CONFIG.CARD_WIDTH + LAYOUT_CONFIG.NODE_SEP));
      
      positionedMembers.push({
        ...member,
        x,
        y
      });
    });
  });
  
  return positionedMembers;
};

/**
 * Get layout bounds for canvas sizing
 * @param {Array} familyMembers - Array of positioned family members
 * @returns {Object} Layout bounds {minX, minY, maxX, maxY, width, height}
 */
export const getLayoutBounds = (familyMembers) => {
  if (!familyMembers || familyMembers.length === 0) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 600, width: 1000, height: 600 };
  }
  
  const positions = familyMembers.map(member => ({
    x: member.x || 0,
    y: member.y || 0
  }));
  
  const minX = Math.min(...positions.map(p => p.x)) - LAYOUT_CONFIG.CARD_WIDTH / 2;
  const maxX = Math.max(...positions.map(p => p.x)) + LAYOUT_CONFIG.CARD_WIDTH / 2;
  const minY = Math.min(...positions.map(p => p.y)) - LAYOUT_CONFIG.CARD_HEIGHT / 2;
  const maxY = Math.max(...positions.map(p => p.y)) + LAYOUT_CONFIG.CARD_HEIGHT / 2;
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + LAYOUT_CONFIG.MARGIN_X * 2,
    height: maxY - minY + LAYOUT_CONFIG.MARGIN_Y * 2
  };
};

/**
 * Center layout in canvas
 * @param {Array} familyMembers - Array of family members
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {Array} Centered family members
 */
export const centerLayout = (familyMembers, canvasWidth, canvasHeight) => {
  const bounds = getLayoutBounds(familyMembers);
  
  const offsetX = (canvasWidth - bounds.width) / 2 - bounds.minX;
  const offsetY = (canvasHeight - bounds.height) / 2 - bounds.minY;
  
  return familyMembers.map(member => ({
    ...member,
    x: member.x + offsetX,
    y: member.y + offsetY
  }));
};
