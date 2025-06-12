// Test file untuk memverifikasi bahwa koneksi genealogi mengikuti drag & drop
import React from 'react';
import { render } from '@testing-library/react';
import { Stage, Layer } from 'react-konva';
import GenealogyConnections from '../GenealogyConnections';

describe('GenealogyConnections Drag & Drop', () => {
  const mockFamilyMembers = [
    {
      id: 'parent1',
      firstName: 'John',
      lastName: 'Doe',
      x: 100,
      y: 50,
      generation: 1,
      spouseId: 'parent2',
      children: ['child1']
    },
    {
      id: 'parent2', 
      firstName: 'Jane',
      lastName: 'Doe',
      x: 300,
      y: 50,
      generation: 1,
      spouseId: 'parent1',
      children: ['child1']
    },
    {
      id: 'child1',
      firstName: 'Bob',
      lastName: 'Doe', 
      x: 200,
      y: 250,
      generation: 2,
      parents: ['parent1', 'parent2']
    }
  ];

  const renderWithStage = (familyMembers) => {
    return render(
      <Stage width={800} height={600}>
        <Layer>
          <GenealogyConnections familyMembers={familyMembers} />
        </Layer>
      </Stage>
    );
  };

  test('should re-render connections when family member positions change', () => {
    // Spy on console.log untuk memverifikasi re-render
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { rerender } = renderWithStage(mockFamilyMembers);
    
    // Verifikasi initial render
    expect(consoleSpy).toHaveBeenCalledWith(
      'GenealogyConnections re-render dengan familyMembers:',
      expect.arrayContaining([
        { id: 'parent1', x: 100, y: 50 },
        { id: 'parent2', x: 300, y: 50 },
        { id: 'child1', x: 200, y: 250 }
      ])
    );

    // Update posisi parent1
    const updatedMembers = mockFamilyMembers.map(member => 
      member.id === 'parent1' ? { ...member, x: 150, y: 60 } : member
    );

    // Re-render dengan posisi baru
    rerender(
      <Stage width={800} height={600}>
        <Layer>
          <GenealogyConnections familyMembers={updatedMembers} />
        </Layer>
      </Stage>
    );

    // Verifikasi re-render dengan posisi baru
    expect(consoleSpy).toHaveBeenCalledWith(
      'GenealogyConnections re-render dengan familyMembers:',
      expect.arrayContaining([
        { id: 'parent1', x: 150, y: 60 }, // Posisi terupdate
        { id: 'parent2', x: 300, y: 50 },
        { id: 'child1', x: 200, y: 250 }
      ])
    );

    consoleSpy.mockRestore();
  });

  test('should calculate correct border connections for marriage lines', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithStage(mockFamilyMembers);
    
    // Verifikasi bahwa marriageConnections dihitung ulang
    expect(consoleSpy).toHaveBeenCalledWith('Menghitung ulang marriageConnections...');
    
    consoleSpy.mockRestore();
  });

  test('should calculate correct connections for parent-child relationships', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithStage(mockFamilyMembers);
    
    // Verifikasi bahwa parentChildConnections dihitung ulang
    expect(consoleSpy).toHaveBeenCalledWith('Menghitung ulang parentChildConnections...');
    
    consoleSpy.mockRestore();
  });

  test('should handle position changes for multiple family members', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { rerender } = renderWithStage(mockFamilyMembers);
    
    // Update posisi semua members
    const updatedMembers = mockFamilyMembers.map(member => ({
      ...member,
      x: member.x + 50,
      y: member.y + 25
    }));

    rerender(
      <Stage width={800} height={600}>
        <Layer>
          <GenealogyConnections familyMembers={updatedMembers} />
        </Layer>
      </Stage>
    );

    // Verifikasi semua posisi terupdate
    expect(consoleSpy).toHaveBeenCalledWith(
      'GenealogyConnections re-render dengan familyMembers:',
      expect.arrayContaining([
        { id: 'parent1', x: 150, y: 75 },
        { id: 'parent2', x: 350, y: 75 },
        { id: 'child1', x: 250, y: 275 }
      ])
    );

    consoleSpy.mockRestore();
  });
});
