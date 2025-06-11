// filepath: src/hooks/useDragAndDrop.js
import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola drag and drop functionality
 * Mengikuti prinsip reusable hooks dan clean code
 */
export const useDragAndDrop = (onDragEnd) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((item, event) => {
    setDraggedItem(item);
    
    // Calculate offset dari mouse position ke corner item
    if (event && event.evt) {
      const { offsetX, offsetY } = event.evt;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  }, []);

  const handleDragMove = useCallback((event) => {
    if (!draggedItem) return;
    
    // Update position berdasarkan mouse movement
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (pointerPosition) {
      const newPosition = {
        x: pointerPosition.x - dragOffset.x,
        y: pointerPosition.y - dragOffset.y
      };
      
      // Batasi movement dalam bounds tertentu jika diperlukan
      return newPosition;
    }
  }, [draggedItem, dragOffset]);

  const handleDragEnd = useCallback((event) => {
    if (!draggedItem) return;
    
    const newPosition = {
      x: event.target.x(),
      y: event.target.y()
    };
    
    // Call callback dengan item dan position baru
    if (onDragEnd) {
      onDragEnd(draggedItem, newPosition);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDragOffset({ x: 0, y: 0 });
  }, [draggedItem, onDragEnd]);

  const isDragging = useCallback((item) => {
    return draggedItem?.id === item?.id;
  }, [draggedItem]);

  return {
    draggedItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isDragging
  };
};
