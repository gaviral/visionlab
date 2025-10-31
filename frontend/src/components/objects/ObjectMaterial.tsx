/**
 * ObjectMaterial - Renders material for scene objects
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Render only the material for an object
 * Composable with ObjectGeometry for complete rendering
 */
import { calculateVisualFeedback } from '../../utils/visualFeedbackUtils';
import type { ObjectType } from '../../types';

interface ObjectMaterialProps {
  type: ObjectType;
  isColliding: boolean;
  isVisible: boolean;
  wireframe?: boolean;
}

export function ObjectMaterial({
  type,
  isColliding,
  isVisible,
  wireframe = false,
}: ObjectMaterialProps) {
  const { color, opacity } = calculateVisualFeedback(type, isColliding, isVisible);

  return (
    <meshStandardMaterial
      color={color}
      opacity={opacity}
      transparent
      wireframe={wireframe}
    />
  );
}

