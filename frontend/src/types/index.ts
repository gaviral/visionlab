/**
 * Type definitions for Vision Lab
 * Following design principles: type safety, clear interfaces
 */

export type ObjectType = 'camera' | 'bin' | 'obstacle' | 'robot' | 'gripper';

export type CameraType = 'eye-to-hand' | 'eye-in-hand';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: string;
  type: ObjectType;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  properties: Record<string, unknown>;
}

export interface CameraObject extends SceneObject {
  type: 'camera';
  cameraType: CameraType;
  properties: {
    fov?: number;
    resolution?: { width: number; height: number };
    parentRobotId?: string | null; // For eye-in-hand cameras
  };
}

export interface BinObject extends SceneObject {
  type: 'bin';
  properties: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ObstacleObject extends SceneObject {
  type: 'obstacle';
  properties: {
    geometry: 'box' | 'cylinder' | 'sphere';
    dimensions: Vector3;
  };
}

export interface RobotObject extends SceneObject {
  type: 'robot';
  properties: {
    endEffectorOffset?: Vector3; // Offset from robot base to end effector
    pathId?: string | null; // Reference to path for movement
    gripperId?: string | null; // Reference to attached gripper (for eye-in-hand cameras)
  };
}

export interface GripperObject extends SceneObject {
  type: 'gripper';
  properties: {
    parentRobotId?: string | null; // Robot this gripper is attached to
    gripperType?: 'vacuum' | 'mechanical' | 'magnetic';
  };
}

export interface PathWaypoint {
  id: string;
  position: Vector3;
  rotation: Vector3;
}

export interface Path {
  id: string;
  waypoints: PathWaypoint[];
  loop: boolean; // Whether path loops back to start
  speed: number; // Units per second
}

export type SimulationState = 'idle' | 'playing' | 'paused';

export interface SimulationData {
  state: SimulationState;
  progress: number; // 0-1
  currentPathId: string | null;
  speed: number; // Multiplier for simulation speed
}

export interface SceneState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  cameraMode: 'perspective' | 'orthographic';
  isPlacing: boolean;
  placingType: ObjectType | null;
  paths: Path[];
  simulation: SimulationData;
  visibility: Record<string, string[]>; // cameraId -> array of visible object IDs
  collisions: string[]; // array of object IDs that are colliding
}

