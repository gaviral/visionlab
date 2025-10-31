/**
 * Ground component - Professional placement surface
 * Following design principles: Single responsibility, reusable, clear visual feedback
 */
import { useRef } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { createObjectAtPoint } from '../../utils/objectFactory';

export function Ground() {
  const meshRef = useRef<Mesh>(null);
  const addObject = useSceneStore((state) => state.addObject);
  const placingType = useSceneStore((state) => state.placingType);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!placingType) return;

    event.stopPropagation();
    const { point } = event;

    // Create object using factory utility
    const newObject = createObjectAtPoint(placingType, point);
    addObject(newObject);
  };

  // Ground is always visible, changes color when in placement mode
  const isPlacing = placingType !== null;
  const groundColor = isPlacing ? '#10b981' : '#4b5563'; // Green when placing, gray otherwise
  const groundOpacity = isPlacing ? 0.6 : 0.4; // More visible when placing

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color={groundColor}
        opacity={groundOpacity}
        transparent
      />
    </mesh>
  );
}
