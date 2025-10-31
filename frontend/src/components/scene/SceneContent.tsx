/**
 * SceneContent - Main 3D scene content
 * Following design principles: Modular, composable components
 */
import { Ground } from './Ground';
import { ObjectRenderer } from '../objects/ObjectRenderer';
import { RobotMovementSystem } from './RobotMovementSystem';
import { CameraSystem } from './CameraSystem';
import { useSceneStore } from '../../stores/sceneStore';

export function SceneContent() {
  const objects = useSceneStore((state) => state.objects);

  return (
    <>
      <Ground />
      <RobotMovementSystem />
      <CameraSystem />
      {objects.map((obj) => (
        <ObjectRenderer key={obj.id} object={obj} />
      ))}
    </>
  );
}

