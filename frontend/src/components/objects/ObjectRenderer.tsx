/**
 * ObjectRenderer - Composes object rendering components
 * Following design principles: Composition over coupling, extreme modularity
 *
 * Responsibility: Compose geometry, material, and interaction components
 * Delegates to specialized components and hooks for each concern
 * Implements industry-standard visual feedback (selection glow, hover glow)
 */
import { useRef } from 'react';
import { Group } from 'three';
import { TransformControls } from '@react-three/drei';
import { ObjectGeometry } from './ObjectGeometry';
import { useObjectVisualState } from '../../hooks/useObjectVisualState';
import { useObjectInteraction } from '../../hooks/useObjectInteraction';
import { useHoverState } from '../../hooks/useHoverState';
import { getObjectGeometryConfig } from '../../utils/objectGeometryConfig';
import type { SceneObject } from '../../types';

interface ObjectRendererProps {
  object: SceneObject;
}

export function ObjectRenderer({ object }: ObjectRendererProps) {
  const groupRef = useRef<Group>(null);
  
  // Use hooks for visual state and interaction
  const { isVisible, isColliding, isSelected } = useObjectVisualState(object);
  const { handleClick, handleTransformChange } = useObjectInteraction(object);
  const { isHovered, handlePointerEnter, handlePointerLeave } = useHoverState();

  // Get wireframe setting from geometry config
  const geometryConfig = getObjectGeometryConfig(object.type);
  const wireframe = geometryConfig.wireframe ?? false;

  // Grippers are always attached to robots - cannot be manually moved
  const isGripper = object.type === 'gripper';

  return (
    <>
      <group
        ref={groupRef}
        position={[object.position.x, object.position.y, object.position.z]}
        rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
        scale={[object.scale.x, object.scale.y, object.scale.z]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <ObjectGeometry
          type={object.type}
          scale={object.scale}
          isColliding={isColliding}
          isVisible={isVisible}
          isSelected={isSelected}
          isHovered={isHovered}
          wireframe={wireframe}
        />
      </group>
      {isSelected && groupRef.current && !isGripper && (
        <TransformControls
          object={groupRef.current}
          mode="translate"
          space="local"
          onMouseUp={() => {
            if (groupRef.current) handleTransformChange(groupRef.current);
          }}
          onChange={() => {
            if (groupRef.current) handleTransformChange(groupRef.current);
          }}
        />
      )}
    </>
  );
}
