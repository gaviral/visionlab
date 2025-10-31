/**
 * Vision validation utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Calculate visibility and field of view metrics
 * Pure functions for vision validation calculations
 */
import * as THREE from 'three';
import type { CameraObject, SceneObject, Vector3 } from '../types';

/**
 * Check if a point is inside a camera frustum
 * Following design principles: Pure function, reusable utility
 */
export function isPointInFrustum(
  point: Vector3,
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
 */
export function isObjectVisible(
  object: SceneObject,
  camera: CameraObject
): boolean {
  // Get bounding box for object based on type
  const bbox = getObjectBoundingBox(object);
  
  // Check if any corner of bounding box is in frustum
  const corners = [
    { x: bbox.min.x, y: bbox.min.y, z: bbox.min.z },
    { x: bbox.max.x, y: bbox.min.y, z: bbox.min.z },
    { x: bbox.min.x, y: bbox.max.y, z: bbox.min.z },
    { x: bbox.max.x, y: bbox.max.y, z: bbox.min.z },
    { x: bbox.min.x, y: bbox.min.y, z: bbox.max.z },
    { x: bbox.max.x, y: bbox.min.y, z: bbox.max.z },
    { x: bbox.min.x, y: bbox.max.y, z: bbox.max.z },
    { x: bbox.max.x, y: bbox.max.y, z: bbox.max.z },
  ];
  
  // Object is visible if at least one corner is in frustum
  return corners.some((corner) => isPointInFrustum(corner, camera));
}

/**
 * Get bounding box for a scene object
 * Following design principles: Pure function, reusable utility
 */
function getObjectBoundingBox(object: SceneObject): { min: Vector3; max: Vector3 } {
  // Simple bounding box based on object type and scale
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
 * Calculate visibility percentage for an object from a camera
 * Returns 0-1 indicating how much of the object is visible
 * Following design principles: Pure function, reusable utility
 */
export function calculateVisibilityPercentage(
  object: SceneObject,
  camera: CameraObject
): number {
  // Simplified: return 1 if visible, 0 if not
  // In a more advanced implementation, this could sample multiple points
  return isObjectVisible(object, camera) ? 1 : 0;
}

