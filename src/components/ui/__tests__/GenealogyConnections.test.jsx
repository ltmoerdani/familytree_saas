// filepath: src/components/ui/__tests__/GenealogyConnections.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { Stage, Layer } from 'react-konva';
import GenealogyConnections from '../GenealogyConnections';

// Mock data untuk testing
const mockFamilyMembers = [
  {
    id: 'parent1',
    x: 100,
    y: 100,
    generation: 1,
    spouseId: 'parent2',
    children: ['child1', 'child2']
  },
  {
    id: 'parent2',
    x: 250,
    y: 100,
    generation: 1,
    spouseId: 'parent1',
    children: ['child1', 'child2']
  },
  {
    id: 'child1',
    x: 100,
    y: 250,
    generation: 2,
    parents: ['parent1', 'parent2']
  },
  {
    id: 'child2',
    x: 250,
    y: 250,
    generation: 2,
    parents: ['parent1', 'parent2']
  }
];

describe('GenealogyConnections', () => {
  it('renders without crashing', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <GenealogyConnections familyMembers={mockFamilyMembers} />
        </Layer>
      </Stage>
    );
  });

  it('handles empty family members array', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <GenealogyConnections familyMembers={[]} />
        </Layer>
      </Stage>
    );
  });

  it('renders with minimal required props', () => {
    const minimalMembers = [
      {
        id: 'test1',
        x: 100,
        y: 100,
        generation: 1
      }
    ];

    render(
      <Stage width={400} height={400}>
        <Layer>
          <GenealogyConnections familyMembers={minimalMembers} />
        </Layer>
      </Stage>
    );
  });
});
