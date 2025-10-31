/**
 * Object query utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Query and filter objects from collections
 * Single source of truth for object queries
 */
import type { SceneObject, ObjectType, CameraObject, RobotObject, GripperObject } from '../types';

/**
 * Filter objects by type
 * Following design principles: Pure function, reusable utility
 */
export function filterObjectsByType<T extends SceneObject>(
  objects: SceneObject[],
  type: ObjectType
): T[] {
  return objects.filter((obj): obj is T => obj.type === type);
}

/**
 * Find object by ID
 * Following design principles: Pure function, reusable utility
 */
export function findObjectById(
  objects: SceneObject[],
  id: string
): SceneObject | undefined {
  return objects.find((obj) => obj.id === id);
}

/**
 * Filter cameras from objects
 * Following design principles: Pure function, reusable utility
 */
export function filterCameras(objects: SceneObject[]): CameraObject[] {
  return filterObjectsByType<CameraObject>(objects, 'camera');
}

/**
 * Filter robots from objects
 * Following design principles: Pure function, reusable utility
 */
export function filterRobots(objects: SceneObject[]): RobotObject[] {
  return filterObjectsByType<RobotObject>(objects, 'robot');
}

/**
 * Filter grippers from objects
 * Following design principles: Pure function, reusable utility
 */
export function filterGrippers(objects: SceneObject[]): GripperObject[] {
  return filterObjectsByType<GripperObject>(objects, 'gripper');
}

/**
 * Filter objects visible to cameras (non-camera objects)
 * Following design principles: Pure function, reusable utility
 */
export function filterObjectsVisibleToCameras(
  objects: SceneObject[],
  excludeCameraId?: string
): SceneObject[] {
  return objects.filter(
    (obj) => obj.type !== 'camera' && obj.id !== excludeCameraId
  );
}

