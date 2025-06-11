// filepath: src/components/ui/GenealogyConnections.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Line, Group } from 'react-konva';

/**
 * Komponen untuk menggambar koneksi genealogi standar
 * Mengikuti prinsip standar genealogy tree dengan garis yang jelas dan terorganisir
 */
const GenealogyConnections = ({ familyMembers }) => {
  const CARD_WIDTH = 120;
  const CARD_HEIGHT = 140;
  
  // Fungsi untuk mendapatkan titik tengah kartu
  const getCardCenter = (member) => ({
    x: member.x + CARD_WIDTH / 2,
    y: member.y + CARD_HEIGHT / 2
  });

  // Fungsi untuk mendapatkan titik koneksi atas kartu
  const getCardTopConnection = (member) => ({
    x: member.x + CARD_WIDTH / 2,
    y: member.y
  });

  // Fungsi untuk menggambar garis pernikahan
  const renderMarriageConnections = () => {
    const marriageLines = [];
    const processedPairs = new Set();

    familyMembers.forEach(member => {
      if (member.spouseId && !processedPairs.has(`${member.id}-${member.spouseId}`)) {
        const spouse = familyMembers.find(m => m.id === member.spouseId);
        if (spouse) {
          processedPairs.add(`${member.id}-${member.spouseId}`);
          processedPairs.add(`${member.spouseId}-${member.id}`);

          const memberCenter = getCardCenter(member);
          const spouseCenter = getCardCenter(spouse);
          
          // Garis pernikahan horizontal dengan sedikit offset ke bawah
          const marriageY = Math.max(memberCenter.y, spouseCenter.y) + 10;
          
          marriageLines.push(
            <Group key={`marriage-${member.id}-${spouse.id}`}>
              {/* Garis horizontal pernikahan */}
              <Line
                points={[
                  Math.min(memberCenter.x, spouseCenter.x), marriageY,
                  Math.max(memberCenter.x, spouseCenter.x), marriageY
                ]}
                stroke="#8B4513"
                strokeWidth={3}
              />
              
              {/* Garis vertikal dari setiap pasangan ke garis pernikahan */}
              <Line
                points={[memberCenter.x, memberCenter.y, memberCenter.x, marriageY]}
                stroke="#8B4513"
                strokeWidth={2}
              />
              <Line
                points={[spouseCenter.x, spouseCenter.y, spouseCenter.x, marriageY]}
                stroke="#8B4513"
                strokeWidth={2}
              />
            </Group>
          );
        }
      }
    });

    return marriageLines;
  };

  // Fungsi untuk menggambar garis orang tua-anak
  const renderParentChildConnections = () => {
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
        // Titik tengah antara kedua orang tua
        const parent1Center = getCardCenter(parent1);
        const parent2Center = getCardCenter(parent2);
        const parentsMidX = (parent1Center.x + parent2Center.x) / 2;
        const parentsY = Math.max(parent1Center.y, parent2Center.y) + 10; // Garis pernikahan
        
        // Urutkan anak berdasarkan posisi X
        const sortedChildren = family.children.sort((a, b) => a.x - b.x);
        
        if (sortedChildren.length === 1) {
          // Satu anak - garis langsung
          const child = sortedChildren[0];
          const childTop = getCardTopConnection(child);
          
          parentChildLines.push(
            <Group key={`family-${parentKey}`}>
              {/* Garis dari titik tengah orang tua ke anak */}
              <Line
                points={[
                  parentsMidX, parentsY,
                  parentsMidX, parentsY + 30,
                  childTop.x, parentsY + 30,
                  childTop.x, childTop.y
                ]}
                stroke="#654321"
                strokeWidth={2}
              />
            </Group>
          );
        } else {
          // Beberapa anak - sistem T-junction
          const firstChild = sortedChildren[0];
          const lastChild = sortedChildren[sortedChildren.length - 1];
          const firstChildTop = getCardTopConnection(firstChild);
          const lastChildTop = getCardTopConnection(lastChild);
          
          // Garis horizontal menghubungkan semua anak
          const childrenConnectionY = firstChildTop.y - 30;
          
          parentChildLines.push(
            <Group key={`family-${parentKey}`}>
              {/* Garis vertikal dari orang tua ke garis horizontal anak */}
              <Line
                points={[
                  parentsMidX, parentsY,
                  parentsMidX, childrenConnectionY
                ]}
                stroke="#654321"
                strokeWidth={2}
              />
              
              {/* Garis horizontal menghubungkan semua anak */}
              <Line
                points={[
                  firstChildTop.x, childrenConnectionY,
                  lastChildTop.x, childrenConnectionY
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
  const renderGenerationLines = () => {
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
      {renderGenerationLines()}
      
      {/* Garis orang tua-anak */}
      {renderParentChildConnections()}
      
      {/* Garis pernikahan */}
      {renderMarriageConnections()}
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
