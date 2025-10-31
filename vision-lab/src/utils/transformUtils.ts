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

