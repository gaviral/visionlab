/**
 * Visual feedback utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate visual feedback state for objects
 * Determines color and opacity based on visibility and collision state
 */
import type { ObjectType } from '../types';
import { getObjectBaseColor } from './objectConfigUtils';

/**
 * Visual feedback state
 */
export interface VisualFeedbackState {
  color: string;
  opacity: number;
}

/**
 * Visual feedback priority constants
 * Following design principles: Configuration over code
 */
const VISUAL_FEEDBACK_COLORS = {
  collision: '#ef4444',
  visibility: '#10b981',
} as const;

const VISUAL_FEEDBACK_OPACITY = {
  collision: 1.0,
  visibility: 0.9,
  default: 1.0,
} as const;

/**
 * Calculate visual feedback state for an object
 * Following design principles: Pure function, single responsibility
 *
 * Priority: collision > visibility > base color
 */
export function calculateVisualFeedback(
  objectType: ObjectType,
  isColliding: boolean,
  isVisible: boolean
): VisualFeedbackState {
  if (isColliding) {
    return {
      color: VISUAL_FEEDBACK_COLORS.collision,
      opacity: VISUAL_FEEDBACK_OPACITY.collision,
    };
  }

  if (isVisible) {
    return {
      color: VISUAL_FEEDBACK_COLORS.visibility,
      opacity: VISUAL_FEEDBACK_OPACITY.visibility,
    };
  }

  return {
    color: getObjectBaseColor(objectType),
    opacity: VISUAL_FEEDBACK_OPACITY.default,
  };
}

