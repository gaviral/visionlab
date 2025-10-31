/**
 * ObjectRenderer - Composes object rendering components
 * Following design principles: Composition over coupling, extreme modularity
 *
 * Responsibility: Compose geometry, material, and interaction components
 * Delegates to specialized components and hooks for each concern
 */
import { useRef } from 'react';
import { Mesh } from 'three';
import { TransformControls } from '@react-three/drei';
import { ObjectGeometry } from './ObjectGeometry';
import { ObjectMaterial } from './ObjectMaterial';
import { useObjectVisualState } from '../../hooks/useObjectVisualState';
import { useObjectInteraction } from '../../hooks/useObjectInteraction';
import { getObjectGeometryConfig } from '../../utils/objectGeometryConfig';
import type { SceneObject } from '../../types';

interface ObjectRendererProps {
  object: SceneObject;
}

export function ObjectRenderer({ object }: ObjectRendererProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Use hooks for visual state and interaction
  const { isVisible, isColliding, isSelected } = useObjectVisualState(object);
  const { handleClick, handleTransformChange } = useObjectInteraction(object);

  // Get wireframe setting from geometry config
  const geometryConfig = getObjectGeometryConfig(object.type);
  const wireframe = geometryConfig.wireframe ?? false;

  return (
    <>
      <mesh
        ref={meshRef}
        position={[object.position.x, object.position.y, object.position.z]}
        rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
        scale={[object.scale.x, object.scale.y, object.scale.z]}
        onClick={handleClick}
      >
        <ObjectGeometry type={object.type} scale={object.scale} />
        <ObjectMaterial
          type={object.type}
          isColliding={isColliding}
          isVisible={isVisible}
          wireframe={wireframe}
        />
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onMouseUp={() => {
            if (meshRef.current) handleTransformChange(meshRef.current);
          }}
          onChange={() => {
            if (meshRef.current) handleTransformChange(meshRef.current);
          }}
        />
      )}
    </>
  );
}
