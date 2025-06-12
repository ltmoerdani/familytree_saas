// Demo khusus untuk testing drag & drop connections
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import GenealogyConnections from './GenealogyConnections';
import FamilyMemberCard from './FamilyMemberCard';

const DragDropConnectionsDemo = () => {
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 'parent1',
      firstName: 'John',
      lastName: 'Doe',
      x: 100,
      y: 100,
      generation: 1,
      gender: 'male',
      spouseId: 'parent2',
      children: ['child1', 'child2']
    },
    {
      id: 'parent2',
      firstName: 'Jane',
      lastName: 'Doe',
      x: 300,
      y: 100,
      generation: 1,
      gender: 'female',
      spouseId: 'parent1',
      children: ['child1', 'child2']
    },
    {
      id: 'child1',
      firstName: 'Alice',
      lastName: 'Doe',
      x: 150,
      y: 300,
      generation: 2,
      gender: 'female',
      parents: ['parent1', 'parent2']
    },
    {
      id: 'child2',
      firstName: 'Bob',
      lastName: 'Doe',
      x: 350,
      y: 300,
      generation: 2,
      gender: 'male',
      parents: ['parent1', 'parent2']
    }
  ]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [isDragging, setIsDragging] = useState(null);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleDragStart = (member) => {
    setIsDragging(member.id);
  };

  const handleDragMove = (member, newPosition) => {
    // Update posisi secara real-time saat drag
    setFamilyMembers(prev => 
      prev.map(m => 
        m.id === member.id 
          ? { ...m, x: newPosition.x, y: newPosition.y }
          : m
      )
    );
  };

  const handleDragEnd = (member, newPosition) => {
    setIsDragging(null);
    
    // Final update posisi member
    setFamilyMembers(prev => 
      prev.map(m => 
        m.id === member.id 
          ? { ...m, x: newPosition.x, y: newPosition.y }
          : m
      )
    );
  };

  const isCardDragging = (member) => {
    return isDragging === member.id;
  };

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          Drag & Drop Connections Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Drag kartu anggota keluarga untuk melihat apakah garis koneksi mengikuti pergerakan secara real-time.
        </p>
        <div className="mt-2 space-x-4">
          <span className="text-sm text-gray-500">
            Selected: {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'None'}
          </span>
          <span className="text-sm text-gray-500">
            Dragging: {isDragging || 'None'}
          </span>
        </div>
      </div>
      
      <div className="w-full h-full">
        <Stage width={800} height={600}>
          <Layer>
            {/* Koneksi genealogi - harus dirender sebelum kartu */}
            <GenealogyConnections familyMembers={familyMembers} />
            
            {/* Kartu anggota keluarga */}
            {familyMembers.map(member => (
              <FamilyMemberCard 
                key={member.id}
                member={member}
                isSelected={selectedMember?.id === member.id}
                isDragging={isCardDragging(member)}
                onSelect={handleMemberSelect}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-semibold mb-2">Test Controls</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setFamilyMembers(prev => 
                prev.map(m => 
                  m.id === 'parent1' 
                    ? { ...m, x: m.x + 50 }
                    : m
                )
              );
            }}
            className="block w-full px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Move John →
          </button>
          <button
            onClick={() => {
              setFamilyMembers(prev => 
                prev.map(m => 
                  m.id === 'parent2' 
                    ? { ...m, y: m.y + 30 }
                    : m
                )
              );
            }}
            className="block w-full px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Move Jane ↓
          </button>
          <button
            onClick={() => {
              setFamilyMembers(prev => 
                prev.map(m => ({
                  ...m,
                  x: m.x + (Math.random() - 0.5) * 100,
                  y: m.y + (Math.random() - 0.5) * 50
                }))
              );
            }}
            className="block w-full px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
          >
            Random Move
          </button>
          <button
            onClick={() => {
              setFamilyMembers([
                { ...familyMembers[0], x: 100, y: 100 },
                { ...familyMembers[1], x: 300, y: 100 },
                { ...familyMembers[2], x: 150, y: 300 },
                { ...familyMembers[3], x: 350, y: 300 }
              ]);
            }}
            className="block w-full px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Reset Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragDropConnectionsDemo;
