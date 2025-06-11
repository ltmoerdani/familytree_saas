// filepath: src/hooks/useGenealogyTree.js
import { useState, useCallback, useMemo } from 'react';
import { 
  calculateOptimalLayout, 
  validateFamilyRelationships, 
  calculateTreeBounds,
  groupByGeneration 
} from '../utils/genealogyLayout';

/**
 * Custom hook untuk mengelola state dan operasi genealogy tree
 * Mengikuti prinsip Single Responsibility dan State Management Minimalis
 */
export const useGenealogyTree = (initialMembers = []) => {
  const [familyMembers, setFamilyMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Memoized computed values
  const generations = useMemo(() => groupByGeneration(familyMembers), [familyMembers]);
  
  const treeBounds = useMemo(() => calculateTreeBounds(familyMembers), [familyMembers]);
  
  const validationErrors = useMemo(() => validateFamilyRelationships(familyMembers), [familyMembers]);

  const optimizedMembers = useMemo(() => calculateOptimalLayout(familyMembers), [familyMembers]);

  // Fungsi untuk menyimpan state ke history
  const saveToHistory = useCallback((newMembers) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newMembers]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
  }, [history, historyIndex]);

  // Operasi CRUD untuk anggota keluarga
  const addMember = useCallback((memberData) => {
    const newMember = {
      id: `member-${Date.now()}`,
      firstName: '',
      lastName: '',
      birthDate: '',
      deathDate: null,
      photo: null,
      generation: 1,
      x: 100,
      y: 50,
      spouseId: null,
      children: [],
      parents: [],
      ...memberData
    };
    
    const updatedMembers = [...familyMembers, newMember];
    setFamilyMembers(updatedMembers);
    saveToHistory(updatedMembers);
    setSelectedMember(newMember);
    
    return newMember;
  }, [familyMembers, saveToHistory]);

  const updateMember = useCallback((memberId, updates) => {
    const updatedMembers = familyMembers.map(member =>
      member.id === memberId ? { ...member, ...updates } : member
    );
    
    setFamilyMembers(updatedMembers);
    saveToHistory(updatedMembers);
    
    // Update selected member if it's the one being updated
    if (selectedMember?.id === memberId) {
      setSelectedMember(prev => ({ ...prev, ...updates }));
    }
  }, [familyMembers, selectedMember, saveToHistory]);

  const updateAllMembers = useCallback((newMembers) => {
    setFamilyMembers(newMembers);
    saveToHistory(newMembers);
  }, [saveToHistory]);

  const deleteMember = useCallback((memberId) => {
    // Remove member and clean up relationships
    const updatedMembers = familyMembers
      .filter(member => member.id !== memberId)
      .map(member => ({
        ...member,
        spouseId: member.spouseId === memberId ? null : member.spouseId,
        children: member.children ? member.children.filter(id => id !== memberId) : [],
        parents: member.parents ? member.parents.filter(id => id !== memberId) : []
      }));
    
    setFamilyMembers(updatedMembers);
    saveToHistory(updatedMembers);
    
    // Clear selection if deleted member was selected
    if (selectedMember?.id === memberId) {
      setSelectedMember(null);
    }
  }, [familyMembers, selectedMember, saveToHistory]);

  // Operasi relationship
  const addMarriage = useCallback((member1Id, member2Id) => {
    const updatedMembers = familyMembers.map(member => {
      if (member.id === member1Id) {
        return { ...member, spouseId: member2Id };
      }
      if (member.id === member2Id) {
        return { ...member, spouseId: member1Id };
      }
      return member;
    });
    
    setFamilyMembers(updatedMembers);
    saveToHistory(updatedMembers);
  }, [familyMembers, saveToHistory]);

  const removeMarriage = useCallback((memberId) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member?.spouseId) return;
    
    const updatedMembers = familyMembers.map(m => {
      if (m.id === memberId || m.id === member.spouseId) {
        return { ...m, spouseId: null };
      }
      return m;
    });
    
    setFamilyMembers(updatedMembers);
    saveToHistory(updatedMembers);
  }, [familyMembers, saveToHistory]);

  const addChild = useCallback((parentId, childData) => {
    // Create child
    const child = addMember({
      ...childData,
      generation: (familyMembers.find(m => m.id === parentId)?.generation || 1) + 1,
      parents: [parentId]
    });
    
    // Update parent to include child
    const parent = familyMembers.find(m => m.id === parentId);
    if (parent) {
      const updatedMembers = familyMembers.map(member => {
        if (member.id === parentId) {
          return { 
            ...member, 
            children: [...(member.children || []), child.id] 
          };
        }
        if (member.id === parent.spouseId) {
          // Add child to spouse as well
          return { 
            ...member, 
            children: [...(member.children || []), child.id] 
          };
        }
        return member;
      });
      
      // Update child to have both parents if there's a spouse
      if (parent.spouseId) {
        const finalMembers = updatedMembers.map(member => 
          member.id === child.id 
            ? { ...member, parents: [parentId, parent.spouseId] }
            : member
        );
        setFamilyMembers(finalMembers);
        saveToHistory(finalMembers);
      } else {
        setFamilyMembers(updatedMembers);
        saveToHistory(updatedMembers);
      }
    }
    
    return child;
  }, [familyMembers, addMember, saveToHistory]);

  // Operasi positioning
  const updateMemberPosition = useCallback((memberId, x, y) => {
    updateMember(memberId, { x, y });
  }, [updateMember]);

  const autoArrangeLayout = useCallback(() => {
    const arrangedMembers = calculateOptimalLayout(familyMembers);
    setFamilyMembers(arrangedMembers);
    saveToHistory(arrangedMembers);
  }, [familyMembers, saveToHistory]);

  // History operations
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setFamilyMembers([...previousState]);
      setHistoryIndex(historyIndex - 1);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setFamilyMembers([...nextState]);
      setHistoryIndex(historyIndex + 1);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  // Search and filter
  const searchMembers = useCallback((query) => {
    if (!query.trim()) return familyMembers;
    
    const searchTerm = query.toLowerCase().trim();
    return familyMembers.filter(member => 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm) ||
      member.birthDate?.includes(searchTerm) ||
      member.deathDate?.includes(searchTerm)
    );
  }, [familyMembers]);

  const getMembersByGeneration = useCallback((generation) => {
    return familyMembers.filter(member => member.generation === generation);
  }, [familyMembers]);

  // Utility functions
  const getMemberById = useCallback((id) => {
    return familyMembers.find(member => member.id === id);
  }, [familyMembers]);

  const getSpouse = useCallback((memberId) => {
    const member = getMemberById(memberId);
    return member?.spouseId ? getMemberById(member.spouseId) : null;
  }, [getMemberById]);

  const getChildren = useCallback((memberId) => {
    const member = getMemberById(memberId);
    return member?.children?.map(childId => getMemberById(childId)).filter(Boolean) || [];
  }, [getMemberById]);

  const getParents = useCallback((memberId) => {
    const member = getMemberById(memberId);
    return member?.parents?.map(parentId => getMemberById(parentId)).filter(Boolean) || [];
  }, [getMemberById]);

  const getSiblings = useCallback((memberId) => {
    const member = getMemberById(memberId);
    if (!member?.parents?.length) return [];
    
    return familyMembers.filter(m => 
      m.id !== memberId && 
      m.parents?.some(parentId => member.parents.includes(parentId))
    );
  }, [familyMembers, getMemberById]);

  // Save functionality
  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    // State
    familyMembers: optimizedMembers,
    selectedMember,
    hasUnsavedChanges,
    generations,
    treeBounds,
    validationErrors,
    
    // State setters
    setSelectedMember,
    
    // CRUD operations
    addMember,
    updateMember,
    updateAllMembers,
    deleteMember,
    
    // Relationship operations
    addMarriage,
    removeMarriage,
    addChild,
    
    // Position operations
    updateMemberPosition,
    autoArrangeLayout,
    
    // History operations
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    
    // Search and filter
    searchMembers,
    getMembersByGeneration,
    
    // Utility functions
    getMemberById,
    getSpouse,
    getChildren,
    getParents,
    getSiblings,
    
    // Save operations
    markAsSaved
  };
};
