/**
 * Collision detection utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Detect collisions between scene objects
 * Uses AABB (Axis-Aligned Bounding Box) for performance
 */
import type { SceneObject } from '../types';
import { getObjectBoundingBox, type BoundingBox } from './boundingBoxUtils';

/**
 * Check if two bounding boxes intersect (AABB collision detection)
 * Following design principles: Pure function, reusable utility
 * 
 * @param box1 - First bounding box
 * @param box2 - Second bounding box
 * @returns True if boxes intersect, false otherwise
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
 * 
 * @param obj1 - First scene object
 * @param obj2 - Second scene object
 * @returns True if objects collide, false otherwise
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
 * 
 * @param object - Object to check collisions for
 * @param allObjects - Array of all objects in the scene
 * @returns Array of objects that collide with the given object
 */
export function findCollidingObjects(
  object: SceneObject,
  allObjects: SceneObject[]
): SceneObject[] {
  return allObjects.filter(
    (other) => other.id !== object.id && checkObjectCollision(object, other)
  );
}

