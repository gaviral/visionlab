/**
 * Type definitions for Vision Lab
 * Following design principles: type safety, clear interfaces
 */

export type ObjectType = 'camera' | 'bin' | 'obstacle' | 'robot';

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

export interface SceneState {
  objects: SceneObject[];
  selectedObjectId: string | null;
  cameraMode: 'perspective' | 'orthographic';
  isPlacing: boolean;
  placingType: ObjectType | null;
}

