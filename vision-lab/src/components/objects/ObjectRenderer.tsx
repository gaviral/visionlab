/**
 * ObjectRenderer - Renders scene objects
 * Following design principles: Single responsibility, extensible
 */
import { TransformControls } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useSceneStore } from '../../stores/sceneStore';
import { vector3ToArray } from '../../utils/transformUtils';
import type { SceneObject } from '../../types';

interface ObjectRendererProps {
  object: SceneObject;
}

export function ObjectRenderer({ object }: ObjectRendererProps) {
  const meshRef = useRef<Mesh>(null);
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const selectObject = useSceneStore((state) => state.selectObject);
  const updateObject = useSceneStore((state) => state.updateObject);

  const isSelected = selectedObjectId === object.id;

  const handleClick = (event: any) => {
    event.stopPropagation();
    selectObject(object.id);
  };

  const handleTransformChange = () => {
    if (!meshRef.current) return;

    const position = meshRef.current.position;
    const rotation = meshRef.current.rotation;
    const scale = meshRef.current.scale;

    updateObject(object.id, {
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      scale: { x: scale.x, y: scale.y, z: scale.z },
    });
  };

  // Render different geometries based on object type
  const renderGeometry = () => {
    switch (object.type) {
      case 'camera':
        return (
          <>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#3b82f6" />
          </>
        );
      case 'bin':
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ef4444" wireframe />
          </>
        );
      case 'obstacle':
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#f59e0b" />
          </>
        );
      case 'robot':
        return (
          <>
            <boxGeometry args={[0.8, 1.5, 0.8]} />
            <meshStandardMaterial color="#8b5cf6" />
          </>
        );
      default:
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#6b7280" />
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

