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
  handleTransformChange: (mesh: THREE.Mesh) => void;
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

  const handleTransformChange = (mesh: THREE.Mesh) => {
    const position = mesh.position;
    const rotation = mesh.rotation;
    const scale = mesh.scale;

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

