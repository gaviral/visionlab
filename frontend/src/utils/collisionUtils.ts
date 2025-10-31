/**
 * Collision detection utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Detect collisions between scene objects
 * Uses AABB (Axis-Aligned Bounding Box) for performance
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
 * Following design principles: Pure function, reusable utility
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
 * Check if two bounding boxes intersect (AABB collision detection)
 * Following design principles: Pure function, reusable utility
 */
export function checkAABBCollision(
  box1: BoundingBox,
  box2: BoundingBox
): boolean {
  return (
    box1.min.x <= box2.max.x &&
    box1.max.x >= box2.min.x &&
    box1.min.y <= box2.max.y &&
    box1.max.y >= box2.min.y &&
    box1.min.z <= box2.max.z &&
    box1.max.z >= box2.min.z
  );
}

/**
 * Check if two objects collide
 * Following design principles: Pure function, reusable utility
 */
export function checkObjectCollision(
  obj1: SceneObject,
  obj2: SceneObject
): boolean {
  const box1 = getObjectBoundingBox(obj1);
  const box2 = getObjectBoundingBox(obj2);
  return checkAABBCollision(box1, box2);
}

/**
 * Find all objects that collide with a given object
 * Following design principles: Pure function, reusable utility
 */
export function findCollidingObjects(
  object: SceneObject,
  allObjects: SceneObject[]
): SceneObject[] {
  return allObjects.filter(
    (other) => other.id !== object.id && checkObjectCollision(object, other)
  );
}

