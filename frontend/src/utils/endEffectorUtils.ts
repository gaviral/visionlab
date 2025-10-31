/**
 * End effector calculation utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Calculate end effector position for robots
 * Used by CameraSystem for eye-in-hand camera positioning
 */
import type { RobotObject, Vector3 } from '../types';

/**
 * Calculate end effector position for a robot
 * Following design principles: Pure function, single responsibility
 *
 * Calculates end effector position based on robot position and offset.
 * When gripper is attached, gripper will be positioned here by GripperSystem.
 * 
 * @param robot - Robot object to calculate end effector position for
 * @returns End effector position in world space
 */
export function calculateEndEffectorPosition(
  robot: RobotObject
): Vector3 {
  // Use robot's end effector offset (relative to robot base)
  const offset = robot.properties.endEffectorOffset || { x: 0, y: 0.75, z: 0 };
  
  return {
    x: robot.position.x + offset.x,
    y: robot.position.y + offset.y,
    z: robot.position.z + offset.z,
  };
}

