/**
 * useObjectInteraction hook
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Handle object interaction logic (click, transform)
 * Separates interaction logic from rendering components
 */
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../stores/sceneStore';
import type { SceneObject } from '../types';

/**
 * Object interaction handlers
 */
export interface ObjectInteractionHandlers {
  handleClick: (event: ThreeEvent<MouseEvent>) => void;
  handleTransformChange: (object: THREE.Object3D) => void;
}

/**
 * Hook to get interaction handlers for an object
 * Following design principles: Reusable hook, single responsibility
 */
export function useObjectInteraction(
  object: SceneObject
): ObjectInteractionHandlers {
  const selectObject = useSceneStore((state) => state.selectObject);
  const updateObject = useSceneStore((state) => state.updateObject);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectObject(object.id);
  };

  const handleTransformChange = (obj: THREE.Object3D) => {
    // Extract transform from any Object3D (Mesh, Group, etc.)
    const position = obj.position;
    const rotation = obj.rotation;
    const scale = obj.scale;

    updateObject(object.id, {
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      scale: { x: scale.x, y: scale.y, z: scale.z },
    });
  };

  return {
    handleClick,
    handleTransformChange,
  };
}

