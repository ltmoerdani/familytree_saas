// filepath: src/hooks/__tests__/useGenealogyTree.test.js
import { renderHook, act } from '@testing-library/react';
import { useGenealogyTree } from '../useGenealogyTree';

const mockInitialMembers = [
  {
    id: 'parent1',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1960-01-01',
    generation: 1,
    x: 100,
    y: 100,
    spouseId: 'parent2',
    children: ['child1']
  },
  {
    id: 'parent2',
    firstName: 'Jane',
    lastName: 'Doe',
    birthDate: '1962-01-01',
    generation: 1,
    x: 250,
    y: 100,
    spouseId: 'parent1',
    children: ['child1']
  },
  {
    id: 'child1',
    firstName: 'Bob',
    lastName: 'Doe',
    birthDate: '1990-01-01',
    generation: 2,
    x: 175,
    y: 250,
    parents: ['parent1', 'parent2']
  }
];

describe('useGenealogyTree', () => {
  it('initializes with provided members', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    expect(result.current.familyMembers).toHaveLength(3);
    expect(result.current.selectedMember).toBeNull();
    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });

  it('adds a new member', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    act(() => {
      result.current.addMember({
        firstName: 'Alice',
        lastName: 'Doe',
        birthDate: '1992-01-01',
        generation: 2
      });
    });

    expect(result.current.familyMembers).toHaveLength(4);
    expect(result.current.hasUnsavedChanges).toBeTruthy();
    expect(result.current.selectedMember?.firstName).toBe('Alice');
  });

  it('updates a member', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    act(() => {
      result.current.updateMember('child1', { firstName: 'Robert' });
    });

    const updatedMember = result.current.familyMembers.find(m => m.id === 'child1');
    expect(updatedMember.firstName).toBe('Robert');
    expect(result.current.hasUnsavedChanges).toBeTruthy();
  });

  it('deletes a member', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    act(() => {
      result.current.deleteMember('child1');
    });

    expect(result.current.familyMembers).toHaveLength(2);
    expect(result.current.familyMembers.find(m => m.id === 'child1')).toBeUndefined();
    
    // Check that relationships are cleaned up
    const parent1 = result.current.familyMembers.find(m => m.id === 'parent1');
    expect(parent1.children).toEqual([]);
  });

  it('adds marriage relationship', () => {
    const singleMembers = [
      {
        id: 'person1',
        firstName: 'John',
        generation: 1,
        x: 100,
        y: 100
      },
      {
        id: 'person2',
        firstName: 'Jane',
        generation: 1,
        x: 250,
        y: 100
      }
    ];

    const { result } = renderHook(() => useGenealogyTree(singleMembers));
    
    act(() => {
      result.current.addMarriage('person1', 'person2');
    });

    const person1 = result.current.familyMembers.find(m => m.id === 'person1');
    const person2 = result.current.familyMembers.find(m => m.id === 'person2');
    
    expect(person1.spouseId).toBe('person2');
    expect(person2.spouseId).toBe('person1');
  });

  it('removes marriage relationship', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    act(() => {
      result.current.removeMarriage('parent1');
    });

    const parent1 = result.current.familyMembers.find(m => m.id === 'parent1');
    const parent2 = result.current.familyMembers.find(m => m.id === 'parent2');
    
    expect(parent1.spouseId).toBeNull();
    expect(parent2.spouseId).toBeNull();
  });

  it('searches members correctly', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    const searchResults = result.current.searchMembers('John');
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].firstName).toBe('John');
  });

  it('gets members by generation', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    const generation1 = result.current.getMembersByGeneration(1);
    const generation2 = result.current.getMembersByGeneration(2);
    
    expect(generation1).toHaveLength(2);
    expect(generation2).toHaveLength(1);
  });

  it('gets family relationships correctly', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    const spouse = result.current.getSpouse('parent1');
    const children = result.current.getChildren('parent1');
    const parents = result.current.getParents('child1');
    
    expect(spouse?.id).toBe('parent2');
    expect(children).toHaveLength(1);
    expect(children[0].id).toBe('child1');
    expect(parents).toHaveLength(2);
  });

  it('handles undo/redo operations', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    // Make a change
    act(() => {
      result.current.updateMember('child1', { firstName: 'Robert' });
    });

    expect(result.current.familyMembers.find(m => m.id === 'child1').firstName).toBe('Robert');
    expect(result.current.canUndo).toBeTruthy();
    
    // Undo the change
    act(() => {
      result.current.undo();
    });

    expect(result.current.familyMembers.find(m => m.id === 'child1').firstName).toBe('Bob');
    expect(result.current.canRedo).toBeTruthy();
    
    // Redo the change
    act(() => {
      result.current.redo();
    });

    expect(result.current.familyMembers.find(m => m.id === 'child1').firstName).toBe('Robert');
  });

  it('validates family relationships', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    // The validation errors should be empty for valid data
    expect(result.current.validationErrors).toHaveLength(0);
  });

  it('marks as saved correctly', () => {
    const { result } = renderHook(() => useGenealogyTree(mockInitialMembers));
    
    // Make a change
    act(() => {
      result.current.updateMember('child1', { firstName: 'Robert' });
    });

    expect(result.current.hasUnsavedChanges).toBeTruthy();
    
    // Mark as saved
    act(() => {
      result.current.markAsSaved();
    });

    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });
});
