/**
 * Visual feedback utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate visual feedback state for objects
 * Determines color, opacity, and emissive properties based on object state
 * Inspired by industry standards (Unity/Unreal selection highlighting)
 */
import type { ObjectType } from '../types';
import { getObjectBaseColor } from './objectConfigUtils';

/**
 * Visual feedback state
 */
export interface VisualFeedbackState {
  color: string;
  opacity: number;
  emissive?: string; // For selection/hover glow effect
  emissiveIntensity?: number;
}

/**
 * Visual feedback priority constants
 * Following design principles: Configuration over code
 * Priority: collision > selection > hover > visibility > base color
 */
const VISUAL_FEEDBACK_COLORS = {
  collision: '#ef4444', // Red - critical state
  selection: '#f59e0b', // Orange - Unity-style selection
  hover: '#3b82f6', // Blue - subtle hover feedback
  visibility: '#10b981', // Green - visible from camera
} as const;

const VISUAL_FEEDBACK_OPACITY = {
  collision: 1.0,
  selection: 1.0,
  hover: 1.0,
  visibility: 0.9,
  default: 1.0,
} as const;

const EMISSIVE_INTENSITY = {
  selection: 0.3, // Subtle glow for selection
  hover: 0.15, // Subtle glow for hover
  default: 0,
} as const;

/**
 * Calculate visual feedback state for an object
 * Following design principles: Pure function, single responsibility
 *
 * Priority: collision > selection > hover > visibility > base color
 * Industry standard: Selection glow (Unity/Unreal style)
 */
export function calculateVisualFeedback(
  objectType: ObjectType,
  isColliding: boolean,
  isVisible: boolean,
  isSelected: boolean = false,
  isHovered: boolean = false
): VisualFeedbackState {
  // Priority 1: Collision (critical state - enhanced with strong glow)
  if (isColliding) {
    return {
      color: VISUAL_FEEDBACK_COLORS.collision,
      opacity: VISUAL_FEEDBACK_OPACITY.collision,
      emissive: VISUAL_FEEDBACK_COLORS.collision,
      emissiveIntensity: 0.5, // Increased from 0.2 for stronger warning
    };
  }

  // Priority 2: Selection (industry standard: glow effect)
  if (isSelected) {
    const baseColor = getObjectBaseColor(objectType);
    return {
      color: baseColor,
      opacity: VISUAL_FEEDBACK_OPACITY.selection,
      emissive: VISUAL_FEEDBACK_COLORS.selection,
      emissiveIntensity: EMISSIVE_INTENSITY.selection,
    };
  }

  // Priority 3: Hover (subtle feedback)
  if (isHovered) {
    const baseColor = getObjectBaseColor(objectType);
    return {
      color: baseColor,
      opacity: VISUAL_FEEDBACK_OPACITY.hover,
      emissive: VISUAL_FEEDBACK_COLORS.hover,
      emissiveIntensity: EMISSIVE_INTENSITY.hover,
    };
  }

  // Priority 4: Visibility (from camera)
  if (isVisible) {
    return {
      color: VISUAL_FEEDBACK_COLORS.visibility,
      opacity: VISUAL_FEEDBACK_OPACITY.visibility,
    };
  }

  // Priority 5: Default state
  return {
    color: getObjectBaseColor(objectType),
    opacity: VISUAL_FEEDBACK_OPACITY.default,
  };
}

