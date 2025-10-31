/**
 * Utility functions for raycasting and 3D calculations
 * Following design principles: DRY, single responsibility, reusable utilities
 */
import type { Vector3 } from '../types';

/**
 * Create a unique identifier
 * Following design principles: Reusable utility
 * 
 * @returns Unique string identifier combining timestamp and random string
 */
export const createId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a Vector3 object from x, y, z coordinates
 * Following design principles: Pure function, reusable utility
 * 
 * @param x - X coordinate (default: 0)
 * @param y - Y coordinate (default: 0)
 * @param z - Z coordinate (default: 0)
 * @returns Vector3 object with specified coordinates
 */
export const createVector3 = (x = 0, y = 0, z = 0): Vector3 => ({
  x,
  y,
  z,
});

/**
 * Convert Vector3 to array tuple
 * Following design principles: Pure function, type conversion utility
 * 
 * @param vec - Vector3 object to convert
 * @returns Array tuple [x, y, z]
 */
export const vector3ToArray = (vec: Vector3): [number, number, number] => [
  vec.x,
  vec.y,
  vec.z,
];

/**
 * Convert array tuple to Vector3
 * Following design principles: Pure function, type conversion utility
 * 
 * @param arr - Array tuple [x, y, z]
 * @returns Vector3 object
 */
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
 * 
 * @param start - Starting Vector3 position
 * @param end - Ending Vector3 position
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated Vector3 position
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
 * 
 * @param start - Starting rotation Vector3 (in radians)
 * @param end - Ending rotation Vector3 (in radians)
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated rotation Vector3
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
 * Linear interpolation for angles (handles wrapping at ±π)
 * Following design principles: Pure function, reusable utility
 * 
 * @param start - Starting angle in radians
 * @param end - Ending angle in radians
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated angle in radians
 */
const lerpAngle = (start: number, end: number, t: number): number => {
  let diff = end - start;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  return start + diff * t;
};

