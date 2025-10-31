/**
 * Vision validation utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Calculate visibility and field of view metrics
 * Pure functions for vision validation calculations
 */
import * as THREE from 'three';
import type { CameraObject, SceneObject } from '../types';
import { getObjectBoundingBox, getBoundingBoxCorners } from './boundingBoxUtils';

/**
 * Check if a point is inside a camera frustum
 * Following design principles: Pure function, reusable utility
 * 
 * @param point - 3D point to check
 * @param camera - Camera object with FOV and position
 * @returns True if point is within camera frustum, false otherwise
 */
export function isPointInFrustum(
  point: { x: number; y: number; z: number },
  camera: CameraObject
): boolean {
  const fov = camera.properties.fov || 60;
  const resolution = camera.properties.resolution || { width: 1920, height: 1080 };
  const aspect = resolution.width / resolution.height;
  
  // Create Three.js camera for frustum calculation
  const threeCamera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 10);
  threeCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
  threeCamera.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
  threeCamera.updateProjectionMatrix();
  
  // Create frustum from camera
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    threeCamera.projectionMatrix,
    threeCamera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);
  
  // Check if point is in frustum
  const pointVec = new THREE.Vector3(point.x, point.y, point.z);
  return frustum.containsPoint(pointVec);
}

/**
 * Check if an object's bounding box is visible from camera
 * Following design principles: Pure function, reusable utility
 * 
 * @param object - Scene object to check visibility for
 * @param camera - Camera object to check visibility from
 * @returns True if at least one corner of object's bounding box is visible
 */
export function isObjectVisible(
  object: SceneObject,
  camera: CameraObject
): boolean {
  // Get bounding box for object
  const bbox = getObjectBoundingBox(object);
  
  // Get bounding box corners
  const corners = getBoundingBoxCorners(bbox);
  
  // Object is visible if at least one corner is in frustum
  return corners.some((corner) => isPointInFrustum(corner, camera));
}

/**
 * Calculate visibility percentage for an object from a camera
 * Returns 0-1 indicating how much of the object is visible
 * Following design principles: Pure function, reusable utility
 * 
 * @param object - Scene object to calculate visibility for
 * @param camera - Camera object to calculate visibility from
 * @returns Visibility percentage (0-1, currently binary: 1 if visible, 0 if not)
 */
export function calculateVisibilityPercentage(
  object: SceneObject,
  camera: CameraObject
): number {
  // Simplified: return 1 if visible, 0 if not
  // In a more advanced implementation, this could sample multiple points
  return isObjectVisible(object, camera) ? 1 : 0;
}

