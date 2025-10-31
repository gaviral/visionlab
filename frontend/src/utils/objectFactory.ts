/**
 * Object factory utilities
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Create scene objects with proper defaults
 * Pure functions for object creation - single source of truth
 */
import { createId, createVector3 } from './transformUtils';
import type { SceneObject, CameraObject, ObjectType, Vector3, RobotObject, GripperObject } from '../types';

/**
 * Default object properties configuration
 * Following design principles: Configuration over code
 */
const DEFAULT_OBJECT_PROPERTIES: Record<ObjectType, Record<string, unknown>> = {
  camera: {
    fov: 60,
    resolution: { width: 1920, height: 1080 },
    parentRobotId: null,
  },
  bin: {},
  obstacle: {},
  robot: {
    endEffectorOffset: { x: 0, y: 0.75, z: 0 },
    pathId: null,
    gripperId: null,
  },
  gripper: {
    parentRobotId: null,
    gripperType: 'mechanical',
  },
};

/**
 * Create a camera object
 * Following design principles: Pure function, single responsibility
 */
export function createCameraObject(
  position: Vector3,
  cameraType: 'eye-to-hand' | 'eye-in-hand' = 'eye-to-hand',
  parentRobotId: string | null = null
): CameraObject {
  return {
    id: createId(),
    type: 'camera',
    cameraType,
    position,
    rotation: createVector3(0, 0, 0),
    scale: createVector3(1, 1, 1),
    properties: {
      ...DEFAULT_OBJECT_PROPERTIES.camera,
      parentRobotId,
    },
  } as CameraObject;
}

/**
 * Create a generic scene object
 * Following design principles: Pure function, single responsibility
 */
export function createSceneObject(
  type: ObjectType,
  position: Vector3,
  properties: Record<string, unknown> = {}
): SceneObject {
  return {
    id: createId(),
    type,
    position,
    rotation: createVector3(0, 0, 0),
    scale: createVector3(1, 1, 1),
    properties: {
      ...DEFAULT_OBJECT_PROPERTIES[type],
      ...properties,
    },
  };
}

/**
 * Create a gripper object attached to a robot
 * Following design principles: Pure function, single responsibility
 */
function createGripperForRobot(
  robotId: string,
  robotPosition: Vector3,
  endEffectorOffset: Vector3
): GripperObject {
  const gripperPosition = {
    x: robotPosition.x + endEffectorOffset.x,
    y: robotPosition.y + endEffectorOffset.y,
    z: robotPosition.z + endEffectorOffset.z,
  };

  return {
    id: createId(),
    type: 'gripper',
    position: gripperPosition,
    rotation: createVector3(0, 0, 0),
    scale: createVector3(1, 1, 1),
    properties: {
      parentRobotId: robotId,
      gripperType: 'mechanical',
    },
  } as GripperObject;
}

/**
 * Create an object at a placement point (with Y offset)
 * Following design principles: Pure function, reusable utility
 * 
 * Special handling: Robots automatically get a gripper created with them
 */
export function createObjectAtPoint(
  type: ObjectType,
  point: Vector3,
  options: {
    yOffset?: number;
    cameraType?: 'eye-to-hand' | 'eye-in-hand';
    parentRobotId?: string | null;
    properties?: Record<string, unknown>;
  } = {}
): SceneObject | { robot: RobotObject; gripper: GripperObject } {
  const yOffset = options.yOffset ?? 0.5;
  const position = createVector3(point.x, point.y + yOffset, point.z);

  if (type === 'camera') {
    return createCameraObject(
      position,
      options.cameraType,
      options.parentRobotId ?? null
    );
  }

  if (type === 'robot') {
    // Create robot with automatic gripper
    const robot = createSceneObject(type, position, options.properties) as RobotObject;
    const endEffectorOffset = (robot.properties.endEffectorOffset || { x: 0, y: 0.75, z: 0 }) as Vector3;
    const gripper = createGripperForRobot(robot.id, robot.position, endEffectorOffset);
    
    // Set gripper ID on robot
    robot.properties.gripperId = gripper.id;
    
    return { robot, gripper };
  }

  // Grippers cannot be placed directly - they're part of robots
  if (type === 'gripper') {
    // Return obstacle as fallback to prevent errors (gripper placement blocked in Ground.tsx)
    return createSceneObject('obstacle', position, options.properties);
  }

  return createSceneObject(type, position, options.properties);
}

