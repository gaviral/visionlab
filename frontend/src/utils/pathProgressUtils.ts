/**
 * Path progress calculation utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate path progress and handle completion
 * Used by RobotMovementSystem for path animation
 */
import type { Path } from '../types';

/**
 * Calculate progress delta for path animation
 * Following design principles: Pure function, reusable utility
 */
export function calculateProgressDelta(
  path: Path,
  delta: number,
  simulationSpeed: number
): number {
  const pathSpeed = path.speed; // Units per second
  const pathLength = path.waypoints.length > 1 ? path.waypoints.length - 1 : 1;
  return (delta * pathSpeed * simulationSpeed) / pathLength;
}

/**
 * Calculate next progress value with path completion handling
 * Following design principles: Pure function, reusable utility
 */
export function calculateNextProgress(
  currentProgress: number,
  progressDelta: number,
  path: Path,
  onComplete: () => void
): number {
  let newProgress = currentProgress + progressDelta;

  // Handle path completion
  if (newProgress >= 1) {
    if (path.loop) {
      newProgress = newProgress % 1;
    } else {
      newProgress = 1;
      onComplete();
    }
  }

  return newProgress;
}

