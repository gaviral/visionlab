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
  const viewSettings = useSceneStore((state) => state.viewSettings);

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
      
      {/* Conditionally render path visualization */}
      {viewSettings.showPaths && <PathVisualization />}

      {/* Render all objects */}
      {objects.map((obj) => (
        <ObjectRenderer key={obj.id} object={obj} />
      ))}

      {/* Conditionally render camera frustums */}
      {viewSettings.showFrustums &&
        cameras.map((camera) => (
          <CameraFrustum key={`frustum-${camera.id}`} camera={camera} />
        ))}
    </>
  );
}

