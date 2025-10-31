/**
 * ObjectGeometry - Renders geometry for scene objects
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Render only the geometry for an object
 * Composable with ObjectMaterial for complete rendering
 * Uses custom purpose-driven geometries for better visual representation
 */
import { CustomGeometry } from './CustomGeometry';
import { ObjectMaterial } from './ObjectMaterial';
import type { ObjectType } from '../../types';

interface ObjectGeometryProps {
  type: ObjectType;
  scale: { x: number; y: number; z: number };
  isColliding: boolean;
  isVisible: boolean;
  isSelected: boolean;
  isHovered: boolean;
  wireframe?: boolean;
}

export function ObjectGeometry({
  type,
  scale,
  isColliding,
  isVisible,
  isSelected,
  isHovered,
  wireframe,
}: ObjectGeometryProps) {
  // Create material component to pass to CustomGeometry
  const material = (
    <ObjectMaterial
      type={type}
      isColliding={isColliding}
      isVisible={isVisible}
      isSelected={isSelected}
      isHovered={isHovered}
      wireframe={wireframe}
    />
  );

  // Use custom geometries with material (purpose-driven design)
  return <CustomGeometry type={type} scale={scale} material={material} />;
}

