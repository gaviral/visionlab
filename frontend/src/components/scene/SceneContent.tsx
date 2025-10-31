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
  GripperSystem,
  PathVisualization,
} from './index';
import { ObjectRenderer } from '../objects';
import { useSceneStore } from '../../stores/sceneStore';
import { filterCameras } from '../../utils/objectQueryUtils';

export function SceneContent() {
  const objects = useSceneStore((state) => state.objects);

  // Separate cameras for frustum rendering
  const cameras = filterCameras(objects);

  return (
    <>
      <Ground />
      <RobotMovementSystem />
      <CameraSystem />
      <GripperSystem />
      <VisionValidationSystem />
      <CollisionDetector />
      <PathVisualization />
      {objects.map((obj) => (
        <ObjectRenderer key={obj.id} object={obj} />
      ))}
      {cameras.map((camera) => (
        <CameraFrustum key={`frustum-${camera.id}`} camera={camera} />
      ))}
    </>
  );
}

