/**
 * SceneContent - Main 3D scene content
 * Following design principles: Modular, composable components
 */
import { Ground } from './Ground';
import { ObjectRenderer } from '../objects/ObjectRenderer';
import { RobotMovementSystem } from './RobotMovementSystem';
import { CameraSystem } from './CameraSystem';
import { CameraFrustum } from './CameraFrustum';
import { VisionValidationSystem } from './VisionValidationSystem';
import { CollisionDetector } from './CollisionDetector';
import { useSceneStore } from '../../stores/sceneStore';
import { useEffect } from 'react';
import type { CameraObject } from '../../types';

export function SceneContent() {
  const objects = useSceneStore((state) => state.objects);

  useEffect(() => {
    console.log('[SceneContent] Objects updated:', { 
      count: objects.length,
      objects: objects.map(obj => ({ id: obj.id, type: obj.type, position: obj.position }))
    });
  }, [objects]);

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

