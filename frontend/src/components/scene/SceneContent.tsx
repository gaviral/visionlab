/**
 * SceneContent - Main 3D scene content
 * Following design principles: Modular, composable components
 */
import { Ground } from './Ground';
import { ObjectRenderer } from '../objects/ObjectRenderer';
import { RobotMovementSystem } from './RobotMovementSystem';
import { CameraSystem } from './CameraSystem';
import { useSceneStore } from '../../stores/sceneStore';
import { useEffect } from 'react';

export function SceneContent() {
  const objects = useSceneStore((state) => state.objects);

  useEffect(() => {
    console.log('[SceneContent] Objects updated:', { 
      count: objects.length,
      objects: objects.map(obj => ({ id: obj.id, type: obj.type, position: obj.position }))
    });
  }, [objects]);

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

