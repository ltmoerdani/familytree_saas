/**
 * Enhanced canvas controls hook with zoom, pan, and minimap functionality
 * Mengikuti prinsip single responsibility dan reusable hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.05; // Mengurangi dari 0.1 ke 0.05 untuk zoom yang lebih halus
const WHEEL_ZOOM_STEP = 0.02; // Mengurangi dari 0.05 ke 0.02 untuk wheel zoom yang lebih halus
const TRACKPAD_ZOOM_STEP = 0.01; // Untuk trackpad zoom yang sangat halus

export const useCanvasControls = (initialScale = 1, initialPosition = { x: 0, y: 0 }) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 });
  const [contentBounds, setContentBounds] = useState({ width: 2000, height: 1500 });
  
  const stageRef = useRef();

  // Handle wheel zoom with improved sensitivity
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    let direction = e.evt.deltaY > 0 ? -1 : 1;
    let zoomStep;
    
    // Deteksi jenis input untuk sensitivitas yang berbeda
    if (e.evt.ctrlKey || e.evt.metaKey) {
      // Pinch gesture pada trackpad atau Ctrl+wheel
      zoomStep = TRACKPAD_ZOOM_STEP;
    } else if (Math.abs(e.evt.deltaY) > 10) {
      // Mouse wheel (biasanya deltaY lebih besar)
      zoomStep = WHEEL_ZOOM_STEP;
    } else {
      // Trackpad scroll yang halus
      zoomStep = TRACKPAD_ZOOM_STEP;
    }
    
    // Batasi kecepatan zoom untuk mencegah perubahan yang terlalu cepat
    const scaleDelta = direction * zoomStep;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, oldScale + scaleDelta));
    
    // Hanya update jika ada perubahan signifikan
    if (Math.abs(newScale - oldScale) > 0.001) {
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      
      setScale(newScale);
      setPosition(newPos);
    }
  }, []);

  // Zoom controls with throttling
  const zoomIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale + ZOOM_STEP, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale - ZOOM_STEP, MIN_SCALE));
  }, []);

  const zoomToFit = useCallback(() => {
    if (!contentBounds.width || !contentBounds.height) return;
    
    const scaleX = stageSize.width / contentBounds.width;
    const scaleY = stageSize.height / contentBounds.height;
    const optimalScale = Math.min(scaleX, scaleY, 1) * 0.9; // 90% untuk margin
    
    const newPosition = {
      x: (stageSize.width - contentBounds.width * optimalScale) / 2,
      y: (stageSize.height - contentBounds.height * optimalScale) / 2
    };
    
    setScale(optimalScale);
    setPosition(newPosition);
  }, [contentBounds, stageSize]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Pan controls with smooth damping
  const handleDragStart = useCallback((e) => {
    if (e.target === e.target.getStage()) {
      setIsDragging(true);
      const stage = e.target.getStage();
      setDragStart({
        x: stage.getPointerPosition().x - position.x,
        y: stage.getPointerPosition().y - position.y
      });
    }
  }, [position]);

  const handleDragEnd = useCallback((e) => {
    if (isDragging) {
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      
      const newPosition = {
        x: pointerPos.x - dragStart.x,
        y: pointerPos.y - dragStart.y
      };
      
      setPosition(newPosition);
      setIsDragging(false);
    }
  }, [isDragging, dragStart]);

  // Center on specific point
  const centerOn = useCallback((x, y) => {
    const newPosition = {
      x: stageSize.width / 2 - x * scale,
      y: stageSize.height / 2 - y * scale
    };
    setPosition(newPosition);
  }, [scale, stageSize]);

  // Update stage size when container resizes
  const updateStageSize = useCallback((width, height) => {
    setStageSize({ width, height });
  }, []);

  // Update content bounds based on elements
  const updateContentBounds = useCallback((bounds) => {
    setContentBounds(bounds);
  }, []);

  // Get minimap data
  const getMinimapData = useCallback(() => {
    const minimapScale = Math.min(200 / contentBounds.width, 150 / contentBounds.height);
    const minimapWidth = contentBounds.width * minimapScale;
    const minimapHeight = contentBounds.height * minimapScale;
    
    // Calculate viewport position in minimap
    const viewportWidth = stageSize.width / scale * minimapScale;
    const viewportHeight = stageSize.height / scale * minimapScale;
    const viewportX = (-position.x / scale) * minimapScale;
    const viewportY = (-position.y / scale) * minimapScale;
    
    return {
      minimapWidth,
      minimapHeight,
      minimapScale,
      viewport: {
        x: Math.max(0, Math.min(viewportX, minimapWidth - viewportWidth)),
        y: Math.max(0, Math.min(viewportY, minimapHeight - viewportHeight)),
        width: Math.min(viewportWidth, minimapWidth),
        height: Math.min(viewportHeight, minimapHeight)
      }
    };
  }, [contentBounds, stageSize, scale, position]);

  // Handle minimap click
  const handleMinimapClick = useCallback((x, y, minimapData) => {
    const { minimapScale } = minimapData;
    const realX = x / minimapScale;
    const realY = y / minimapScale;
    
    centerOn(realX, realY);
  }, [centerOn]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  return {
    // State
    scale,
    position,
    isDragging,
    stageSize,
    contentBounds,
    stageRef,
    
    // Zoom controls
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
    
    // Pan controls
    handleDragStart,
    handleDragEnd,
    centerOn,
    
    // Event handlers
    handleWheel,
    
    // Utilities
    updateStageSize,
    updateContentBounds,
    getMinimapData,
    handleMinimapClick,
    
    // Calculated values
    zoomPercentage: Math.round(scale * 100)
  };
};
