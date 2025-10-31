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

