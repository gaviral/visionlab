/**
 * SceneContent - Main 3D scene content
 * Following design principles: Modular, composable components
 */
import {
  Ground,
  RobotMovementSystem,
  CameraSystem,
  CameraFrustum,
  VisionValidationSystem,
  CollisionDetector,
} from './index';
import { ObjectRenderer } from '../objects';
import { useSceneStore } from '../../stores/sceneStore';
import type { CameraObject } from '../../types';

export function SceneContent() {
  const objects = useSceneStore((state) => state.objects);

  // Separate cameras for frustum rendering
  const cameras = objects.filter(
    (obj): obj is CameraObject => obj.type === 'camera'
  );

  return (
    <>
      <Ground />
      <RobotMovementSystem />
      <CameraSystem />
      <VisionValidationSystem />
      <CollisionDetector />
      {objects.map((obj) => (
        <ObjectRenderer key={obj.id} object={obj} />
      ))}
      {cameras.map((camera) => (
        <CameraFrustum key={`frustum-${camera.id}`} camera={camera} />
      ))}
    </>
  );
}

