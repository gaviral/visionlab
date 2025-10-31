/**
 * useObjectVisualState hook
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate visual state for an object (visibility, collision)
 * Separates visual state logic from rendering components
 */
import { useMemo } from 'react';
import { useSceneStore } from '../stores/sceneStore';
import type { SceneObject } from '../types';

/**
 * Object visual state
 */
export interface ObjectVisualState {
  isVisible: boolean;
  isColliding: boolean;
  isSelected: boolean;
}

/**
 * Hook to get visual state for an object
 * Following design principles: Reusable hook, single responsibility
 */
export function useObjectVisualState(object: SceneObject): ObjectVisualState {
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const visibility = useSceneStore((state) => state.visibility);
  const collisions = useSceneStore((state) => state.collisions);

  const isSelected = selectedObjectId === object.id;

  // Check if object is visible from any camera
  const isVisible = useMemo(
    () =>
      Object.values(visibility).some((visibleIds: string[]) =>
        visibleIds.includes(object.id)
      ),
    [visibility, object.id]
  );

  // Check if object is colliding
  const isColliding = useMemo(
    () => collisions.includes(object.id),
    [collisions, object.id]
  );

  return {
    isVisible,
    isColliding,
    isSelected,
  };
}

