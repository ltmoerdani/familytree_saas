// filepath: src/hooks/useDragAndDrop.js
import { useState, useCallback, useRef } from 'react';

/**
 * Enhanced drag and drop hook for Konva with better performance
 * Mengikuti prinsip reusable hooks dan clean code
 */
export const useDragAndDrop = (onDragEnd, onDragMove) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragMode, setIsDragMode] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const originalPosition = useRef({ x: 0, y: 0 });

  const handleDragStart = useCallback((item, event) => {
    if (event?.target) {
      setDraggedItem(item);
      setIsDragMode(true);

      // Store original position
      originalPosition.current = {
        x: event.target.x(),
        y: event.target.y(),
      };

      // Store drag start position
      dragStartPosition.current = {
        x: event.target.x(),
        y: event.target.y(),
      };
    }
  }, []);

  const handleDragMove = useCallback(
    event => {
      if (!draggedItem || !isDragMode) return;

      const newPosition = {
        x: event.target.x(),
        y: event.target.y(),
      };

      // Call optional drag move callback
      if (onDragMove) {
        onDragMove(draggedItem, newPosition, event);
      }

      return newPosition;
    },
    [draggedItem, isDragMode, onDragMove]
  );

  const handleDragEnd = useCallback(
    event => {
      if (!draggedItem || !isDragMode) return;

      const finalPosition = {
        x: event.target.x(),
        y: event.target.y(),
      };

      // Calculate if item actually moved
      const moved =
        Math.abs(finalPosition.x - originalPosition.current.x) > 5 ||
        Math.abs(finalPosition.y - originalPosition.current.y) > 5;

      // Call callback with final position
      if (onDragEnd && moved) {
        onDragEnd(draggedItem, finalPosition, event);
      }

      // Reset drag state
      setDraggedItem(null);
      setIsDragMode(false);
      dragStartPosition.current = { x: 0, y: 0 };
      originalPosition.current = { x: 0, y: 0 };
    },
    [draggedItem, isDragMode, onDragEnd]
  );

  const isDragging = useCallback(
    item => {
      return draggedItem?.id === item?.id && isDragMode;
    },
    [draggedItem, isDragMode]
  );

  const cancelDrag = useCallback(() => {
    setDraggedItem(null);
    setIsDragMode(false);
    dragStartPosition.current = { x: 0, y: 0 };
    originalPosition.current = { x: 0, y: 0 };
  }, []);

  const getDraggedItem = useCallback(() => {
    return draggedItem;
  }, [draggedItem]);

  const getDragDistance = useCallback(() => {
    if (!isDragMode || !originalPosition.current) return 0;

    const dx = dragStartPosition.current.x - originalPosition.current.x;
    const dy = dragStartPosition.current.y - originalPosition.current.y;

    return Math.sqrt(dx * dx + dy * dy);
  }, [isDragMode]);

  return {
    draggedItem,
    isDragMode,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isDragging,
    cancelDrag,
    getDraggedItem,
    getDragDistance,
  };
};
