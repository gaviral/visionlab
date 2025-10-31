/**
 * ObjectRenderer - Renders scene objects
 * Following design principles: Single responsibility, extensible
 */
import { TransformControls } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { vector3ToArray } from '../../utils/transformUtils';
import { getObjectBaseColor } from '../../utils/objectConfigUtils';
import type { SceneObject, ObjectType } from '../../types';

interface ObjectRendererProps {
  object: SceneObject;
}

export function ObjectRenderer({ object }: ObjectRendererProps) {
  const meshRef = useRef<Mesh>(null);
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const visibility = useSceneStore((state) => state.visibility);
  const collisions = useSceneStore((state) => state.collisions);
  const selectObject = useSceneStore((state) => state.selectObject);
  const updateObject = useSceneStore((state) => state.updateObject);

  const isSelected = selectedObjectId === object.id;

  // Check if object is visible from any camera
  const isVisible = Object.values(visibility).some((visibleIds) =>
    visibleIds.includes(object.id)
  );

  // Check if object is colliding
  const isColliding = collisions.includes(object.id);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectObject(object.id);
  };

  const handleTransformChange = () => {
    if (!meshRef.current) return;

    const position = meshRef.current.position;
    const rotation = meshRef.current.rotation;
    const scale = meshRef.current.scale;

    const updates = {
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      scale: { x: scale.x, y: scale.y, z: scale.z },
    };
    updateObject(object.id, updates);
  };

  // Render different geometries based on object type
  // Apply visual feedback: green for visible, red for colliding
  // Priority: collision > visibility > base color
  const renderGeometry = () => {
    let baseColor: string;
    let opacity = 1.0;

    if (isColliding) {
      // Collision takes priority - red highlight
      baseColor = '#ef4444';
      opacity = 1.0;
    } else if (isVisible) {
      // Visibility - green highlight
      baseColor = '#10b981';
      opacity = 0.9;
    } else {
      // Base color
      baseColor = getObjectBaseColor(object.type as ObjectType);
      opacity = 1.0;
    }

    switch (object.type) {
      case 'camera':
        return (
          <>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent />
          </>
        );
      case 'bin':
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent wireframe />
          </>
        );
      case 'obstacle':
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent />
          </>
        );
      case 'robot':
        return (
          <>
            <boxGeometry args={[0.8, 1.5, 0.8]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent />
          </>
        );
      case 'gripper':
        return (
          <>
            <boxGeometry args={[0.3, 0.3, 0.6]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent />
          </>
        );
      default:
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={baseColor} opacity={opacity} transparent />
          </>
        );
    }
  };

  return (
    <>
      <mesh
        ref={meshRef}
        position={vector3ToArray(object.position)}
        rotation={vector3ToArray(object.rotation)}
        scale={vector3ToArray(object.scale)}
        onClick={handleClick}
      >
        {renderGeometry()}
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onMouseUp={handleTransformChange}
          onChange={handleTransformChange}
        />
      )}
    </>
  );
}
