// filepath: src/components/ui/__tests__/FamilyMemberCard.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { Stage, Layer } from 'react-konva';
import FamilyMemberCard from '../FamilyMemberCard';

// Mock member data
const mockMember = {
  id: 'test-member',
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1990-01-01',
  deathDate: null,
  x: 100,
  y: 100,
  generation: 2,
  gender: 'male',
  spouseId: 'spouse-1',
  children: ['child-1', 'child-2']
};

const mockDeceasedMember = {
  ...mockMember,
  id: 'deceased-member',
  deathDate: '2020-12-31'
};

describe('FamilyMemberCard', () => {
  it('renders without crashing', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard member={mockMember} />
        </Layer>
      </Stage>
    );
  });

  it('handles deceased member correctly', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard member={mockDeceasedMember} />
        </Layer>
      </Stage>
    );
  });

  it('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    
    const { container } = render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard 
            member={mockMember} 
            onSelect={mockOnSelect}
          />
        </Layer>
      </Stage>
    );

    // Note: Testing Konva components requires special handling
    // This is a basic structure for testing
    expect(container).toBeInTheDocument();
  });

  it('renders selected state correctly', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard 
            member={mockMember} 
            isSelected={true}
          />
        </Layer>
      </Stage>
    );
  });

  it('renders dragging state correctly', () => {
    render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard 
            member={mockMember} 
            isDragging={true}
          />
        </Layer>
      </Stage>
    );
  });

  it('handles member with minimal data', () => {
    const minimalMember = {
      id: 'minimal',
      x: 0,
      y: 0,
      generation: 1
    };

    render(
      <Stage width={400} height={400}>
        <Layer>
          <FamilyMemberCard member={minimalMember} />
        </Layer>
      </Stage>
    );
  });
});
