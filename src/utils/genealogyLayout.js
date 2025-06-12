// filepath: src/utils/genealogyLayout.js
/**
 * Utilitas untuk layout genealogy tree yang mengikuti standar
 * Membantu dalam positioning anggota keluarga dan perhitungan koneksi
 */

// Konstanta layout
export const LAYOUT_CONFIG = {
  CARD_WIDTH: 120,
  CARD_HEIGHT: 140,
  GENERATION_GAP: 200,
  SIBLING_GAP: 150,
  MARRIAGE_GAP: 50,
  PARENT_CHILD_VERTICAL_GAP: 60,
  CONNECTION_OFFSET: 30,
};

/**
 * Menghitung posisi optimal untuk anggota keluarga
 * @param {Array} familyMembers - Array anggota keluarga
 * @returns {Array} Array anggota keluarga dengan posisi yang dioptimalkan
 */
export const calculateOptimalLayout = familyMembers => {
  // Grup berdasarkan generasi
  const generations = groupByGeneration(familyMembers);

  // Hitung posisi Y untuk setiap generasi
  const generationYPositions = calculateGenerationYPositions(generations);

  // Hitung posisi X untuk setiap generasi
  const updatedMembers = familyMembers.map(member => {
    const generationY = generationYPositions[member.generation];
    return {
      ...member,
      y: generationY,
    };
  });

  // Optimalkan posisi X untuk setiap generasi
  return optimizeXPositions(updatedMembers, generations);
};

/**
 * Mengelompokkan anggota keluarga berdasarkan generasi
 * @param {Array} familyMembers - Array anggota keluarga
 * @returns {Object} Object dengan key generasi dan value array anggota
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
 * Menghitung posisi Y untuk setiap generasi
 * @param {Object} generations - Object generasi
 * @returns {Object} Object dengan key generasi dan value posisi Y
 */
export const calculateGenerationYPositions = generations => {
  const generationNumbers = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b);
  const positions = {};

  generationNumbers.forEach((gen, index) => {
    positions[gen] = 50 + index * LAYOUT_CONFIG.GENERATION_GAP;
  });

  return positions;
};

/**
 * Posisikan pasangan yang sudah menikah dalam satu generasi
 * @param {Array} pairIds - Array ID pasangan
 * @param {Array} updatedMembers - Array anggota yang diupdate
 * @param {number} currentX - Posisi X saat ini
 * @returns {number} Posisi X yang diupdate
 */
const positionMarriedPairs = (pairIds, updatedMembers, currentX) => {
  const pair = pairIds.map(id => updatedMembers.find(m => m.id === id));

  // Pasangan diposisikan berdekatan
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
 * Posisikan anggota yang tidak menikah dalam satu generasi
 * @param {Object} member - Anggota keluarga
 * @param {number} currentX - Posisi X saat ini
 * @returns {number} Posisi X yang diupdate
 */
const positionSingleMember = (member, currentX) => {
  member.x = currentX;
  return currentX + LAYOUT_CONFIG.CARD_WIDTH + LAYOUT_CONFIG.SIBLING_GAP;
};

/**
 * Memproses posisi X untuk satu generasi
 * @param {number} genNumber - Nomor generasi
 * @param {Array} updatedMembers - Array anggota yang diupdate
 * @returns {void}
 */
const processGenerationXPositions = (genNumber, updatedMembers) => {
  const genMembers = updatedMembers.filter(m => m.generation === genNumber);

  // Grup pasangan yang sudah menikah
  const marriedPairs = findMarriedPairs(genMembers);
  const singleMembers = genMembers.filter(
    m => !marriedPairs.some(pair => pair.includes(m.id))
  );

  let currentX = 100; // Starting X position

  // Posisikan pasangan yang sudah menikah
  marriedPairs.forEach(pairIds => {
    currentX = positionMarriedPairs(pairIds, updatedMembers, currentX);
  });

  // Posisikan anggota yang tidak menikah
  singleMembers.forEach(member => {
    currentX = positionSingleMember(member, currentX);
  });
};

/**
 * Mengoptimalkan posisi X untuk menghindari overlap dan mengatur pasangan
 * @param {Array} familyMembers - Array anggota keluarga
 * @param {Object} generations - Object generasi
 * @returns {Array} Array anggota dengan posisi X yang dioptimalkan
 */
export const optimizeXPositions = (familyMembers, generations) => {
  const updatedMembers = [...familyMembers];

  // Proses setiap generasi dari atas ke bawah
  const sortedGenerations = Object.keys(generations)
    .map(Number)
    .sort((a, b) => a - b);

  sortedGenerations.forEach(genNumber => {
    processGenerationXPositions(genNumber, updatedMembers);
  });

  return updatedMembers;
};

/**
 * Mencari pasangan yang sudah menikah dalam satu generasi
 * @param {Array} members - Array anggota dalam satu generasi
 * @returns {Array} Array pasangan yang sudah menikah
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
 * Menghitung titik koneksi untuk garis genealogi
 * @param {Object} member - Anggota keluarga
 * @param {String} connectionType - Tipe koneksi ('top', 'bottom', 'center', 'left', 'right')
 * @returns {Object} Koordinat titik koneksi
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
 * Validasi hubungan keluarga untuk memastikan konsistensi data
 * @param {Array} familyMembers - Array anggota keluarga
 * @returns {Array} Array error jika ada inkonsistensi
 */
export const validateFamilyRelationships = familyMembers => {
  const errors = [];

  familyMembers.forEach(member => {
    // Validasi spouse relationship
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

    // Validasi parent-child relationship
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

    // Validasi parents relationship
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
 * Menghitung bounding box untuk seluruh family tree
 * @param {Array} familyMembers - Array anggota keluarga
 * @returns {Object} Bounding box dengan minX, minY, maxX, maxY
 */
export const calculateTreeBounds = familyMembers => {
  if (familyMembers.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const { CARD_WIDTH, CARD_HEIGHT } = LAYOUT_CONFIG;

  const minX = Math.min(...familyMembers.map(m => m.x)) - 50;
  const maxX = Math.max(...familyMembers.map(m => m.x + CARD_WIDTH)) + 50;
  const minY = Math.min(...familyMembers.map(m => m.y)) - 50;
  const maxY = Math.max(...familyMembers.map(m => m.y + CARD_HEIGHT)) + 50;

  return { minX, minY, maxX, maxY };
};
