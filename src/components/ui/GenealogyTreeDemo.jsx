// filepath: src/components/ui/GenealogyTreeDemo.jsx
import React from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import GenealogyConnections from './GenealogyConnections';
import FamilyMemberCard from './FamilyMemberCard';

/**
 * Demo component untuk menampilkan fitur genealogy tree
 * Mendemonstrasikan standar koneksi genealogi yang telah diimplementasikan
 */
const GenealogyTreeDemo = () => {
  // Sample data yang mendemonstrasikan berbagai jenis koneksi
  const demoFamilyMembers = [
    // Generation 1 - Grandparents
    {
      id: 'grandpa',
      firstName: 'Robert',
      lastName: 'Smith',
      birthDate: '1930-01-15',
      deathDate: '2010-05-20',
      x: 200,
      y: 50,
      generation: 1,
      gender: 'male',
      spouseId: 'grandma',
      children: ['father', 'uncle']
    },
    {
      id: 'grandma',
      firstName: 'Mary',
      lastName: 'Smith',
      birthDate: '1932-03-22',
      deathDate: '2015-08-10',
      x: 370,
      y: 50,
      generation: 1,
      gender: 'female',
      spouseId: 'grandpa',
      children: ['father', 'uncle']
    },
    
    // Generation 2 - Parents and Uncles/Aunts
    {
      id: 'father',
      firstName: 'John',
      lastName: 'Smith',
      birthDate: '1955-06-10',
      deathDate: null,
      x: 150,
      y: 250,
      generation: 2,
      gender: 'male',
      spouseId: 'mother',
      children: ['child1', 'child2', 'child3'],
      parents: ['grandpa', 'grandma']
    },
    {
      id: 'mother',
      firstName: 'Linda',
      lastName: 'Smith',
      birthDate: '1957-09-15',
      deathDate: null,
      x: 320,
      y: 250,
      generation: 2,
      gender: 'female',
      spouseId: 'father',
      children: ['child1', 'child2', 'child3'],
      parents: []
    },
    {
      id: 'uncle',
      firstName: 'David',
      lastName: 'Smith',
      birthDate: '1960-12-05',
      deathDate: null,
      x: 500,
      y: 250,
      generation: 2,
      gender: 'male',
      spouseId: 'aunt',
      children: ['cousin'],
      parents: ['grandpa', 'grandma']
    },
    {
      id: 'aunt',
      firstName: 'Sarah',
      lastName: 'Smith',
      birthDate: '1962-04-18',
      deathDate: null,
      x: 670,
      y: 250,
      generation: 2,
      gender: 'female',
      spouseId: 'uncle',
      children: ['cousin'],
      parents: []
    },
    
    // Generation 3 - Children and Cousins
    {
      id: 'child1',
      firstName: 'Michael',
      lastName: 'Smith',
      birthDate: '1980-03-12',
      deathDate: null,
      x: 50,
      y: 450,
      generation: 3,
      gender: 'male',
      spouseId: null,
      children: [],
      parents: ['father', 'mother']
    },
    {
      id: 'child2',
      firstName: 'Jennifer',
      lastName: 'Smith',
      birthDate: '1982-07-25',
      deathDate: null,
      x: 220,
      y: 450,
      generation: 3,
      gender: 'female',
      spouseId: null,
      children: [],
      parents: ['father', 'mother']
    },
    {
      id: 'child3',
      firstName: 'Christopher',
      lastName: 'Smith',
      birthDate: '1985-11-08',
      deathDate: null,
      x: 390,
      y: 450,
      generation: 3,
      gender: 'male',
      spouseId: null,
      children: [],
      parents: ['father', 'mother']
    },
    {
      id: 'cousin',
      firstName: 'Emily',
      lastName: 'Smith',
      birthDate: '1983-09-14',
      deathDate: null,
      x: 580,
      y: 450,
      generation: 3,
      gender: 'female',
      spouseId: null,
      children: [],
      parents: ['uncle', 'aunt']
    }
  ];

  const [selectedMember, setSelectedMember] = React.useState(null);

  // Generation level indicators
  const generationLevels = [
    { level: 1, y: 50, label: 'Generation 1 - Grandparents' },
    { level: 2, y: 250, label: 'Generation 2 - Parents' },
    { level: 3, y: 450, label: 'Generation 3 - Children' }
  ];

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    console.log('Selected member:', member);
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Genealogy Tree Demo - Standar Koneksi
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Garis horizontal menunjukkan hubungan pernikahan</p>
          <p>• Garis vertikal menunjukkan hubungan orang tua-anak</p>
          <p>• Sistem T-junction untuk multiple anak</p>
          <p>• Kartu berwarna biru untuk pria, merah muda untuk wanita</p>
          <p>• Kartu abu-abu untuk yang sudah meninggal</p>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Stage width={800} height={600}>
          <Layer>
            {/* Generation level indicators */}
            {generationLevels.map(gen => (
              <React.Fragment key={gen.level}>
                <Line
                  points={[0, gen.y - 20, 800, gen.y - 20]}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                  dash={[10, 5]}
                />
                <Text
                  x={10}
                  y={gen.y - 35}
                  text={gen.label}
                  fontSize={12}
                  fontFamily="Inter, Arial, sans-serif"
                  fill="#6B7280"
                />
              </React.Fragment>
            ))}
            
            {/* Genealogy connection lines */}
            <GenealogyConnections familyMembers={demoFamilyMembers} />
            
            {/* Family member cards */}
            {demoFamilyMembers.map(member => (
              <FamilyMemberCard 
                key={member.id} 
                member={member}
                isSelected={selectedMember?.id === member.id}
                isDragging={false}
                onSelect={handleMemberSelect}
                onDragStart={() => console.log('Drag start:', member)}
                onDragEnd={() => console.log('Drag end:', member)}
                onDoubleClick={() => console.log('Double click:', member)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      
      {/* Selected member info */}
      {selectedMember && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Selected Member</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Name:</strong> {selectedMember.firstName} {selectedMember.lastName}</div>
            <div><strong>Gender:</strong> {selectedMember.gender}</div>
            <div><strong>Birth:</strong> {selectedMember.birthDate}</div>
            <div><strong>Death:</strong> {selectedMember.deathDate || 'Still alive'}</div>
            <div><strong>Generation:</strong> {selectedMember.generation}</div>
            <div><strong>Spouse:</strong> {selectedMember.spouseId || 'None'}</div>
            <div><strong>Children:</strong> {selectedMember.children?.length || 0}</div>
            <div><strong>Parents:</strong> {selectedMember.parents?.length || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenealogyTreeDemo;
