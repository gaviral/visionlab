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
 * Professional, muted colors for industrial simulation
 */
export const OBJECT_TYPE_COLORS: Record<ObjectType, string> = {
  camera: '#60a5fa', // Light blue (professional camera equipment)
  bin: '#94a3b8', // Neutral gray (industrial container)
  obstacle: '#fb923c', // Muted orange (safety barrier)
  robot: '#a78bfa', // Soft purple (robotic system)
  gripper: '#f472b6', // Soft pink (tool/accessory)
};

/**
 * Get base color for object type
 * Following design principles: Pure function, reusable utility
 */
export function getObjectBaseColor(type: ObjectType): string {
  return OBJECT_TYPE_COLORS[type];
}

