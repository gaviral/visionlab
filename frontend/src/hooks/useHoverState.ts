/**
 * Hover state hook
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Track hover state for objects
 * Provides hover state for visual feedback
 */
import { useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';

/**
 * Hover state handlers
 */
export interface HoverStateHandlers {
  isHovered: boolean;
  handlePointerEnter: (event: ThreeEvent<PointerEvent>) => void;
  handlePointerLeave: (event: ThreeEvent<PointerEvent>) => void;
}

/**
 * Hook to manage hover state for an object
 * Following design principles: Reusable hook, single responsibility
 */
export function useHoverState(): HoverStateHandlers {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(false);
  };

  return {
    isHovered,
    handlePointerEnter,
    handlePointerLeave,
  };
}

