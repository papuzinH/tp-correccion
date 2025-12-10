import { useState, useCallback, useEffect } from 'react';

interface UseResizableSidebarOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidthOffset?: number; // Espacio reservado para el panel derecho
  sidebarOffset?: number; // Ancho del sidebar de navegación izquierdo
}

export const useResizableSidebar = ({
  initialWidth = 600,
  minWidth = 300,
  maxWidthOffset = 400,
  sidebarOffset = 64
}: UseResizableSidebarOptions = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX - sidebarOffset;
      if (newWidth > minWidth && newWidth < window.innerWidth - maxWidthOffset) {
         setWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, maxWidthOffset, sidebarOffset]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return { width, isResizing, startResizing };
};
