/**
 * Ground visual state utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate visual state for ground plane
 * Separates visual state logic from rendering
 */
import type { ObjectType } from '../types';

/**
 * Ground visual state configuration
 * Following design principles: Configuration over code
 */
const GROUND_VISUAL_STATE = {
  placing: {
    color: '#10b981',
    opacity: 0.6,
  },
  default: {
    color: '#4b5563',
    opacity: 0.4,
  },
} as const;

/**
 * Calculate ground visual state
 * Following design principles: Pure function, reusable utility
 */
export function calculateGroundVisualState(
  placingType: ObjectType | null
): { color: string; opacity: number } {
  return placingType !== null
    ? GROUND_VISUAL_STATE.placing
    : GROUND_VISUAL_STATE.default;
}

