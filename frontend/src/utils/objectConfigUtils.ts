/**
 * Object configuration utilities
 * Following design principles: Configuration over code, DRY
 *
 * Responsibility: Centralized object type configurations
 * Single source of truth for object colors, sizes, etc.
 */
import type { ObjectType } from '../types';

/**
 * Object type base colors
 * Following design principles: Configuration over code
 */
export const OBJECT_TYPE_COLORS: Record<ObjectType, string> = {
  camera: '#3b82f6',
  bin: '#ef4444',
  obstacle: '#f59e0b',
  robot: '#8b5cf6',
  gripper: '#ec4899',
};

/**
 * Get base color for object type
 * Following design principles: Pure function, reusable utility
 */
export function getObjectBaseColor(type: ObjectType): string {
  return OBJECT_TYPE_COLORS[type];
}

