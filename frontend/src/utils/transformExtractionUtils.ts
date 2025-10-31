/**
 * Transform extraction utilities
 * Following design principles: DRY, pure functions, reusable
 *
 * Responsibility: Extract transform data from Three.js objects
 * Single source of truth for transform extraction
 */
import * as THREE from 'three';
import type { Vector3 } from '../types';

/**
 * Extract position from Three.js object
 * Following design principles: Pure function, reusable utility
 */
export function extractPosition(mesh: THREE.Mesh): Vector3 {
  const { position } = mesh;
  return { x: position.x, y: position.y, z: position.z };
}

/**
 * Extract rotation from Three.js object
 * Following design principles: Pure function, reusable utility
 */
export function extractRotation(mesh: THREE.Mesh): Vector3 {
  const { rotation } = mesh;
  return { x: rotation.x, y: rotation.y, z: rotation.z };
}

/**
 * Extract scale from Three.js object
 * Following design principles: Pure function, reusable utility
 */
export function extractScale(mesh: THREE.Mesh): Vector3 {
  const { scale } = mesh;
  return { x: scale.x, y: scale.y, z: scale.z };
}

/**
 * Extract all transform data from Three.js object
 * Following design principles: Pure function, reusable utility
 */
export function extractTransform(mesh: THREE.Mesh): {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
} {
  return {
    position: extractPosition(mesh),
    rotation: extractRotation(mesh),
    scale: extractScale(mesh),
  };
}

