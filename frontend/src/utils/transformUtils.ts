/**
 * Utility functions for raycasting and 3D calculations
 * Following design principles: DRY, single responsibility, reusable utilities
 */
import type { Vector3 } from '../types';

export const createId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createVector3 = (x = 0, y = 0, z = 0): Vector3 => ({
  x,
  y,
  z,
});

export const vector3ToArray = (vec: Vector3): [number, number, number] => [
  vec.x,
  vec.y,
  vec.z,
];

export const arrayToVector3 = (
  arr: [number, number, number]
): Vector3 => ({
  x: arr[0],
  y: arr[1],
  z: arr[2],
});

/**
 * Linear interpolation between two Vector3 values
 * Following design principles: Pure function, reusable utility
 */
export const lerpVector3 = (
  start: Vector3,
  end: Vector3,
  t: number
): Vector3 => ({
  x: start.x + (end.x - start.x) * t,
  y: start.y + (end.y - start.y) * t,
  z: start.z + (end.z - start.z) * t,
});

/**
 * Linear interpolation for rotation (handles angle wrapping)
 * Following design principles: Pure function, reusable utility
 */
export const lerpRotation = (
  start: Vector3,
  end: Vector3,
  t: number
): Vector3 => ({
  x: lerpAngle(start.x, end.x, t),
  y: lerpAngle(start.y, end.y, t),
  z: lerpAngle(start.z, end.z, t),
});

/**
 * Linear interpolation for angles (handles wrapping)
 * Following design principles: Pure function, reusable utility
 */
const lerpAngle = (start: number, end: number, t: number): number => {
  let diff = end - start;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  return start + diff * t;
};

