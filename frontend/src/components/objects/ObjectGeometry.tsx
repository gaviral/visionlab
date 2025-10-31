/**
 * ObjectGeometry - Renders geometry for scene objects
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Render only the geometry for an object
 * Composable with ObjectMaterial for complete rendering
 */
import { getObjectGeometryConfig } from '../../utils/objectGeometryConfig';
import type { ObjectType } from '../../types';

interface ObjectGeometryProps {
  type: ObjectType;
  scale: { x: number; y: number; z: number };
}

export function ObjectGeometry({ type, scale }: ObjectGeometryProps) {
  const config = getObjectGeometryConfig(type);
  
  // Apply scale to geometry args
  const scaledArgs = config.args.map((arg, index) => {
    const argValue = arg ?? 1;
    if (index === 0) return argValue * scale.x;
    if (index === 1) return argValue * scale.y;
    if (index === 2) return argValue * scale.z;
    return argValue;
  });

  switch (config.type) {
    case 'box':
      return <boxGeometry args={scaledArgs as [number, number, number]} />;
    case 'cylinder':
      return <cylinderGeometry args={scaledArgs as [number, number, number]} />;
    case 'sphere':
      return <sphereGeometry args={scaledArgs as [number]} />;
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
}

