/**
 * Object geometry configuration
 * Following design principles: Configuration over code, single source of truth
 *
 * Responsibility: Define geometry parameters for each object type
 * Centralized geometry configuration for consistent rendering
 */
import type { ObjectType } from '../types';

/**
 * Geometry configuration for object types
 * Following design principles: Configuration over code, DRY
 */
export interface ObjectGeometryConfig {
  type: 'box' | 'cylinder' | 'sphere';
  args: number[];
  wireframe?: boolean; // Object-specific wireframe setting
}

export const OBJECT_GEOMETRY_CONFIG: Record<ObjectType, ObjectGeometryConfig> = {
  camera: {
    type: 'box',
    args: [0.5, 0.5, 0.5],
  },
  bin: {
    type: 'box',
    args: [1, 1, 1],
    wireframe: true,
  },
  obstacle: {
    type: 'box',
    args: [1, 1, 1],
  },
  robot: {
    type: 'box',
    args: [0.8, 1.5, 0.8],
  },
  gripper: {
    type: 'box',
    args: [0.3, 0.3, 0.6],
  },
};

/**
 * Get geometry configuration for object type
 * Following design principles: Pure function, reusable utility
 */
export function getObjectGeometryConfig(type: ObjectType): ObjectGeometryConfig {
  return OBJECT_GEOMETRY_CONFIG[type];
}

