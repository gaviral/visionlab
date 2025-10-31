/**
 * Ground component - Professional placement surface
 * Following design principles: Single responsibility, reusable, clear visual feedback
 */
import { useRef } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { createObjectAtPoint } from '../../utils/objectFactory';
import { calculateGroundVisualState } from '../../utils/groundVisualStateUtils';
import type { SceneObject } from '../../types';

export function Ground() {
  const meshRef = useRef<Mesh>(null);
  const addObject = useSceneStore((state) => state.addObject);
  const placingType = useSceneStore((state) => state.placingType);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!placingType) return;

    event.stopPropagation();
    const { point } = event;

    // Create object using factory utility
    const result = createObjectAtPoint(placingType, point);
    
    // Robots automatically create grippers - handle both objects
    if (placingType === 'robot' && 'robot' in result && 'gripper' in result) {
      addObject(result.robot);
      addObject(result.gripper);
    } else if (placingType !== 'gripper') {
      // Regular object (grippers cannot be placed directly)
      addObject(result as SceneObject);
    }
  };

  // Ground visual state based on placement mode
  const visualState = calculateGroundVisualState(placingType);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color={visualState.color}
        opacity={visualState.opacity}
        transparent
      />
    </mesh>
  );
}
