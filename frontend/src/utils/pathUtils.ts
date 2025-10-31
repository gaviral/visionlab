/**
 * Path interpolation utilities
 * Following design principles: Single responsibility, DRY, pure functions
 */
import type { Path, Vector3 } from '../types';
import { lerpVector3, lerpRotation } from './transformUtils';

/**
 * Interpolate position along path based on progress (0-1)
 * Returns current position and rotation for given progress
 * 
 * @param path - Path with waypoints to interpolate along
 * @param progress - Progress value (0-1) along the path
 * @returns Object containing interpolated position and rotation
 * @throws Error if path has no waypoints
 */
export const interpolatePath = (
  path: Path,
  progress: number
): { position: Vector3; rotation: Vector3 } => {
  if (path.waypoints.length === 0) {
    throw new Error('Path must have at least one waypoint');
  }

  if (path.waypoints.length === 1) {
    return {
      position: path.waypoints[0].position,
      rotation: path.waypoints[0].rotation,
    };
  }

  // Handle looping paths
  let normalizedProgress = progress;
  if (path.loop) {
    normalizedProgress = progress % 1;
  } else {
    normalizedProgress = Math.min(1, Math.max(0, progress));
  }

  // Calculate segment
  const segmentCount = path.waypoints.length - (path.loop ? 0 : 1);
  const segmentLength = 1 / segmentCount;
  const segmentIndex = Math.floor(normalizedProgress / segmentLength);
  const segmentProgress =
    segmentCount > 0 ? (normalizedProgress % segmentLength) / segmentLength : 0;

  // Get waypoints for current segment
  const startIndex = segmentIndex % path.waypoints.length;
  const endIndex = (startIndex + 1) % path.waypoints.length;
  const start = path.waypoints[startIndex];
  const end = path.waypoints[endIndex];

  // Interpolate
  return {
    position: lerpVector3(start.position, end.position, segmentProgress),
    rotation: lerpRotation(start.rotation, end.rotation, segmentProgress),
  };
};

/**
 * Calculate total path length (approximate, using straight-line distances)
 * 
 * @param path - Path to calculate length for
 * @returns Total path length in world units
 */
export const calculatePathLength = (path: Path): number => {
  if (path.waypoints.length < 2) return 0;

  let totalLength = 0;
  for (let i = 0; i < path.waypoints.length - 1; i++) {
    const start = path.waypoints[i].position;
    const end = path.waypoints[i + 1].position;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    totalLength += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  if (path.loop && path.waypoints.length > 2) {
    const start = path.waypoints[path.waypoints.length - 1].position;
    const end = path.waypoints[0].position;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    totalLength += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  return totalLength;
};

