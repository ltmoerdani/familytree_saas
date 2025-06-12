// filepath: src/components/ui/GenealogyConnections.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line, Group } from 'react-konva';

/**
 * Komponen untuk menggambar koneksi genealogi standar
 * Mengikuti prinsip standar genealogy tree dengan garis yang jelas dan terorganisir
 */
const GenealogyConnections = ({ familyMembers }) => {
  const CARD_WIDTH = 120;
  const CARD_HEIGHT = 140;
  
  // Konstanta untuk jarak koneksi yang konsisten
  const CONNECTION_CONSTANTS = {
    MARRIAGE_TO_CHILDREN_DISTANCE: 30,
    CHILDREN_HORIZONTAL_DISTANCE: 30
  };
  
  // Fungsi untuk mendapatkan titik koneksi atas kartu
  const getCardTopConnection = (member) => ({
    x: member.x + CARD_WIDTH / 2,
    y: member.y
  });

  // Fungsi untuk mendapatkan titik koneksi kiri kartu (untuk pernikahan)
  const getCardLeftConnection = (member) => ({
    x: member.x,
    y: member.y + CARD_HEIGHT / 2
  });

  // Fungsi untuk mendapatkan titik koneksi kanan kartu (untuk pernikahan)
  const getCardRightConnection = (member) => ({
    x: member.x + CARD_WIDTH,
    y: member.y + CARD_HEIGHT / 2
  });

  // Helper function untuk mendapatkan titik koneksi pernikahan yang konsisten
  const getMarriageConnectionPoints = (member1, member2) => {
    let member1Connection, member2Connection;
    
    if (member1.x < member2.x) {
      // Member1 di kiri, member2 di kanan
      member1Connection = getCardRightConnection(member1);
      member2Connection = getCardLeftConnection(member2);
    } else {
      // Member1 di kanan, member2 di kiri
      member1Connection = getCardLeftConnection(member1);
      member2Connection = getCardRightConnection(member2);
    }
    
    const midX = (member1Connection.x + member2Connection.x) / 2;
    const midY = (member1Connection.y + member2Connection.y) / 2;
    
    return {
      member1Connection,
      member2Connection,
      midX,
      midY
    };
  };

  // Memoize marriage connections untuk optimasi performa
  const marriageConnections = useMemo(() => {
    return renderMarriageConnections();
  }, [familyMembers]);

  // Memoize parent-child connections untuk optimasi performa  
  const parentChildConnections = useMemo(() => {
    return renderParentChildConnections();
  }, [familyMembers]);

  // Memoize generation lines untuk optimasi performa
  const generationConnections = useMemo(() => {
    return renderGenerationLines();
  }, [familyMembers]);

  // Fungsi untuk menggambar garis pernikahan
  function renderMarriageConnections() {
    const marriageLines = [];
    const processedPairs = new Set();

    familyMembers.forEach(member => {
      if (member.spouseId && !processedPairs.has(`${member.id}-${member.spouseId}`)) {
        const spouse = familyMembers.find(m => m.id === member.spouseId);
        if (spouse) {
          processedPairs.add(`${member.id}-${member.spouseId}`);
          processedPairs.add(`${member.spouseId}-${member.id}`);

          // Gunakan helper function untuk mendapatkan titik koneksi yang konsisten
          const connectionPoints = getMarriageConnectionPoints(member, spouse);
          
          // Garis pernikahan horizontal langsung
          marriageLines.push(
            <Line
              key={`marriage-${member.id}-${spouse.id}`}
              points={[
                connectionPoints.member1Connection.x, connectionPoints.member1Connection.y,
                connectionPoints.member2Connection.x, connectionPoints.member2Connection.y
              ]}
              stroke="#8B4513"
              strokeWidth={3}
            />
          );
          
          // Garis vertikal ke bawah untuk anak-anak jika ada
          if (member.children && member.children.length > 0) {
            marriageLines.push(
              <Line
                key={`marriage-to-children-${member.id}-${spouse.id}`}
                points={[
                  connectionPoints.midX, connectionPoints.midY,
                  connectionPoints.midX, connectionPoints.midY + CONNECTION_CONSTANTS.MARRIAGE_TO_CHILDREN_DISTANCE
                ]}
                stroke="#8B4513"
                strokeWidth={2}
              />
            );
          }
        }
      }
    });

    return marriageLines;
  };

  // Fungsi untuk menggambar garis orang tua-anak
  function renderParentChildConnections() {
    const parentChildLines = [];
    
    // Grup anak berdasarkan pasangan orang tua
    const familyGroups = {};
    
    familyMembers.forEach(member => {
      if (member.parents && member.parents.length === 2) {
        const parentKey = member.parents.sort().join('-');
        if (!familyGroups[parentKey]) {
          familyGroups[parentKey] = {
            parents: member.parents,
            children: []
          };
        }
        familyGroups[parentKey].children.push(member);
      }
    });

    // Render koneksi untuk setiap grup keluarga
    Object.entries(familyGroups).forEach(([parentKey, family]) => {
      const [parent1Id, parent2Id] = family.parents;
      const parent1 = familyMembers.find(m => m.id === parent1Id);
      const parent2 = familyMembers.find(m => m.id === parent2Id);
      
      if (parent1 && parent2 && family.children.length > 0) {
        // Gunakan helper function yang sama untuk mendapatkan titik tengah pernikahan
        const connectionPoints = getMarriageConnectionPoints(parent1, parent2);
        const marriageMidX = connectionPoints.midX;
        const marriageMidY = connectionPoints.midY;
        
        // Urutkan anak berdasarkan posisi X
        const sortedChildren = family.children.sort((a, b) => a.x - b.x);
        
        if (sortedChildren.length === 1) {
          // Satu anak - garis langsung
          const child = sortedChildren[0];
          const childTop = getCardTopConnection(child);
          
          parentChildLines.push(
            <Group key={`family-${parentKey}`}>
              {/* Garis dari titik tengah pernikahan ke anak */}
              <Line
                points={[
                  marriageMidX, marriageMidY + CONNECTION_CONSTANTS.MARRIAGE_TO_CHILDREN_DISTANCE, // Mulai dari bawah garis pernikahan
                  marriageMidX, childTop.y - CONNECTION_CONSTANTS.CHILDREN_HORIZONTAL_DISTANCE,   // Turun ke atas area anak
                  childTop.x, childTop.y - CONNECTION_CONSTANTS.CHILDREN_HORIZONTAL_DISTANCE,     // Horizontal ke anak
                  childTop.x, childTop.y           // Turun ke kartu anak
                ]}
                stroke="#654321"
                strokeWidth={2}
              />
            </Group>
          );
        } else {
          // Beberapa anak - sistem T-junction dengan distribusi line yang dinamis
          const firstChild = sortedChildren[0];
          const lastChild = sortedChildren[sortedChildren.length - 1];
          const firstChildTop = getCardTopConnection(firstChild);
          const lastChildTop = getCardTopConnection(lastChild);
          
          // Garis horizontal menghubungkan semua anak
          const childrenConnectionY = firstChildTop.y - CONNECTION_CONSTANTS.CHILDREN_HORIZONTAL_DISTANCE;
          
          // Hitung range horizontal yang mencakup semua posisi (parent dan children)
          const allXPositions = [marriageMidX, firstChildTop.x, lastChildTop.x];
          const minX = Math.min(...allXPositions);
          const maxX = Math.max(...allXPositions);
          
          parentChildLines.push(
            <Group key={`family-${parentKey}`}>
              {/* Garis vertikal dari orang tua ke garis horizontal anak */}
              <Line
                points={[
                  marriageMidX, marriageMidY + CONNECTION_CONSTANTS.MARRIAGE_TO_CHILDREN_DISTANCE,
                  marriageMidX, childrenConnectionY
                ]}
                stroke="#654321"
                strokeWidth={2}
              />
              
              {/* Garis horizontal yang melebar mengikuti posisi parent dan children */}
              <Line
                points={[
                  minX, childrenConnectionY,
                  maxX, childrenConnectionY
                ]}
                stroke="#654321"
                strokeWidth={2}
              />
              
              {/* Garis vertikal dari garis horizontal ke setiap anak */}
              {sortedChildren.map(child => {
                const childTop = getCardTopConnection(child);
                return (
                  <Line
                    key={`child-connection-${child.id}`}
                    points={[
                      childTop.x, childrenConnectionY,
                      childTop.x, childTop.y
                    ]}
                    stroke="#654321"
                    strokeWidth={2}
                  />
                );
              })}
            </Group>
          );
        }
      }
    });

    return parentChildLines;
  };

  // Fungsi untuk menggambar garis generasi (opsional)
  function renderGenerationLines() {
    const generations = {};
    
    // Grup anggota berdasarkan generasi
    familyMembers.forEach(member => {
      if (!generations[member.generation]) {
        generations[member.generation] = [];
      }
      generations[member.generation].push(member);
    });

    const generationLines = [];
    
    Object.entries(generations).forEach(([generation, members]) => {
      if (members.length > 1) {
        const minX = Math.min(...members.map(m => m.x));
        const maxX = Math.max(...members.map(m => m.x + CARD_WIDTH));
        const y = members[0].y - 50;
        
        generationLines.push(
          <Line
            key={`generation-${generation}`}
            points={[minX - 50, y, maxX + 50, y]}
            stroke="#E5E7EB"
            strokeWidth={1}
            dash={[10, 5]}
            opacity={0.5}
          />
        );
      }
    });

    return generationLines;
  };

  return (
    <Group>
      {/* Garis generasi (background) */}
      {generationConnections}
      
      {/* Garis orang tua-anak */}
      {parentChildConnections}
      
      {/* Garis pernikahan */}
      {marriageConnections}
    </Group>
  );
};

GenealogyConnections.propTypes = {
  familyMembers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      generation: PropTypes.number.isRequired,
      spouseId: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
      parents: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired
};

export default GenealogyConnections;
