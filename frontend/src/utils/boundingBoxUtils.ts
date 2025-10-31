/**
 * Bounding box utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Calculate bounding boxes for scene objects
 * Shared utility for both collision detection and vision validation
 */
import type { SceneObject, Vector3 } from '../types';

/**
 * Bounding box interface
 */
export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

/**
 * Get bounding box for a scene object
 * Following design principles: Pure function, reusable utility, single source of truth
 * 
 * @param object - Scene object to calculate bounding box for
 * @returns BoundingBox with min and max coordinates
 */
export function getObjectBoundingBox(object: SceneObject): BoundingBox {
  const scale = object.scale;
  const center = object.position;
  
  // Approximate bounding box sizes per object type
  let size: Vector3;
  switch (object.type) {
    case 'camera':
      size = { x: 0.5 * scale.x, y: 0.5 * scale.y, z: 0.5 * scale.z };
      break;
    case 'bin':
      size = { x: 1 * scale.x, y: 1 * scale.y, z: 1 * scale.z };
      break;
    case 'obstacle':
      size = { x: 1 * scale.x, y: 1 * scale.y, z: 1 * scale.z };
      break;
    case 'robot':
      size = { x: 0.8 * scale.x, y: 1.5 * scale.y, z: 0.8 * scale.z };
      break;
    case 'gripper':
      size = { x: 0.3 * scale.x, y: 0.3 * scale.y, z: 0.6 * scale.z };
      break;
    default:
      size = { x: 1 * scale.x, y: 1 * scale.y, z: 1 * scale.z };
  }
  
  return {
    min: {
      x: center.x - size.x / 2,
      y: center.y - size.y / 2,
      z: center.z - size.z / 2,
    },
    max: {
      x: center.x + size.x / 2,
      y: center.y + size.y / 2,
      z: center.z + size.z / 2,
    },
  };
}

/**
 * Get bounding box corners for frustum testing
 * Following design principles: Pure function, reusable utility
 * 
 * @param bbox - Bounding box to get corners from
 * @returns Array of 8 corner positions (Vector3)
 */
export function getBoundingBoxCorners(bbox: BoundingBox): Vector3[] {
  return [
    { x: bbox.min.x, y: bbox.min.y, z: bbox.min.z },
    { x: bbox.max.x, y: bbox.min.y, z: bbox.min.z },
    { x: bbox.min.x, y: bbox.max.y, z: bbox.min.z },
    { x: bbox.max.x, y: bbox.max.y, z: bbox.min.z },
    { x: bbox.min.x, y: bbox.min.y, z: bbox.max.z },
    { x: bbox.max.x, y: bbox.min.y, z: bbox.max.z },
    { x: bbox.min.x, y: bbox.max.y, z: bbox.max.z },
    { x: bbox.max.x, y: bbox.max.y, z: bbox.max.z },
  ];
}

