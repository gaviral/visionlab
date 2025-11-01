/**
 * ObjectMaterial - Renders material for scene objects
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Render only the material for an object
 * Composable with ObjectGeometry for complete rendering
 * Supports industry-standard visual feedback (emission, selection glow)
 */
import { calculateVisualFeedback } from '../../utils/visualFeedbackUtils';
import type { ObjectType } from '../../types';

interface ObjectMaterialProps {
  type: ObjectType;
  isColliding: boolean;
  isVisible: boolean;
  isSelected: boolean;
  isHovered: boolean;
  wireframe?: boolean;
}

export function ObjectMaterial({
  type,
  isColliding,
  isVisible,
  isSelected,
  isHovered,
  wireframe = false,
}: ObjectMaterialProps) {
  const { color, opacity, emissive, emissiveIntensity } = calculateVisualFeedback(
    type,
    isColliding,
    isVisible,
    isSelected,
    isHovered
  );

  // PBR material properties for professional, realistic look
  const metalness = type === 'robot' || type === 'gripper' ? 0.6 : 0.2;
  const roughness = type === 'camera' ? 0.3 : type === 'bin' ? 0.7 : 0.5;

  return (
    <meshStandardMaterial
      color={color}
      opacity={opacity}
      transparent={opacity < 1.0}
      wireframe={wireframe}
      emissive={emissive || '#000000'}
      emissiveIntensity={emissiveIntensity || 0}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

