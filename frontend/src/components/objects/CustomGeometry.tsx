/**
 * Custom object geometries
 * Following design principles: Single responsibility, purpose-driven design, composability
 *
 * Responsibility: Render purpose-specific geometries for each object type
 * Each geometry reflects the object's function in robotic vision simulation
 */
import type { ObjectType } from '../../types';
import type { ReactNode } from 'react';

interface CustomGeometryProps {
  type: ObjectType;
  scale: { x: number; y: number; z: number };
  material: ReactNode; // Material component to apply to all meshes
}

/**
 * Camera Geometry - Vision sensor
 * Purpose: Capture vision data
 * Design: Cylindrical body with lens-like front indicator
 */
function CameraGeometry({ scale, material }: { scale: { x: number; y: number; z: number }; material: ReactNode }) {
  const bodyRadius = 0.2 * scale.x;
  const bodyHeight = 0.3 * scale.y;
  const lensRadius = 0.15 * scale.x;
  const lensDepth = 0.1 * scale.z;

  return (
    <group>
      {/* Camera body - cylindrical */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyHeight, 16]} />
        {material}
      </mesh>
      {/* Lens front - smaller cylinder indicating direction */}
      <mesh position={[0, 0, bodyHeight / 2 + lensDepth / 2]}>
        <cylinderGeometry args={[lensRadius, lensRadius, lensDepth, 16]} />
        {material}
      </mesh>
    </group>
  );
}

/**
 * Robot Geometry - Manipulator arm
 * Purpose: Manipulate objects
 * Design: Cylindrical base + vertical arm structure
 */
function RobotGeometry({ scale, material }: { scale: { x: number; y: number; z: number }; material: ReactNode }) {
  const baseRadius = 0.3 * scale.x;
  const baseHeight = 0.2 * scale.y;
  const armWidth = 0.15 * scale.x;
  const armHeight = 1.0 * scale.y;
  const armDepth = 0.15 * scale.z;

  return (
    <group>
      {/* Robot base - cylindrical */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <cylinderGeometry args={[baseRadius, baseRadius, baseHeight, 16]} />
        {material}
      </mesh>
      {/* Vertical arm */}
      <mesh position={[0, baseHeight + armHeight / 2, 0]}>
        <boxGeometry args={[armWidth, armHeight, armDepth]} />
        {material}
      </mesh>
    </group>
  );
}

/**
 * Bin Geometry - Container
 * Purpose: Hold objects
 * Design: Open container with visible walls, open top
 */
function BinGeometry({ scale, material }: { scale: { x: number; y: number; z: number }; material: ReactNode }) {
  const width = scale.x;
  const height = scale.y;
  const depth = scale.z;
  const wallThickness = 0.05;

  return (
    <group>
      {/* Bottom */}
      <mesh position={[0, -height / 2 + wallThickness / 2, 0]}>
        <boxGeometry args={[width, wallThickness, depth]} />
        {material}
      </mesh>
      {/* Front wall */}
      <mesh position={[0, 0, depth / 2 - wallThickness / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        {material}
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -depth / 2 + wallThickness / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        {material}
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2 + wallThickness / 2, 0, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        {material}
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2 - wallThickness / 2, 0, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        {material}
      </mesh>
    </group>
  );
}

/**
 * Obstacle Geometry - Barrier
 * Purpose: Block movement/collision detection
 * Design: Wall-like barrier structure
 */
function ObstacleGeometry({ scale, material }: { scale: { x: number; y: number; z: number }; material: ReactNode }) {
  const width = scale.x;
  const height = scale.y;
  const depth = scale.z;

  return (
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      {material}
    </mesh>
  );
}

/**
 * Gripper Geometry - End effector tool
 * Purpose: Grasp and manipulate objects
 * Design: Two-finger pincer structure
 */
function GripperGeometry({ scale, material }: { scale: { x: number; y: number; z: number }; material: ReactNode }) {
  const fingerWidth = 0.08 * scale.x;
  const fingerHeight = 0.1 * scale.y;
  const fingerLength = 0.4 * scale.z;
  const fingerGap = 0.1 * scale.z;
  const baseWidth = 0.2 * scale.x;
  const baseHeight = 0.15 * scale.y;
  const baseDepth = 0.1 * scale.z;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0, -fingerLength / 2]}>
        <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
        {material}
      </mesh>
      {/* Left finger */}
      <mesh position={[-fingerGap / 2, 0, fingerLength / 2]}>
        <boxGeometry args={[fingerWidth, fingerHeight, fingerLength]} />
        {material}
      </mesh>
      {/* Right finger */}
      <mesh position={[fingerGap / 2, 0, fingerLength / 2]}>
        <boxGeometry args={[fingerWidth, fingerHeight, fingerLength]} />
        {material}
      </mesh>
    </group>
  );
}

/**
 * CustomGeometry component
 * Following design principles: Single responsibility, composability, purpose-driven
 */
export function CustomGeometry({ type, scale, material }: CustomGeometryProps) {
  switch (type) {
    case 'camera':
      return <CameraGeometry scale={scale} material={material} />;
    case 'robot':
      return <RobotGeometry scale={scale} material={material} />;
    case 'bin':
      return <BinGeometry scale={scale} material={material} />;
    case 'obstacle':
      return <ObstacleGeometry scale={scale} material={material} />;
    case 'gripper':
      return <GripperGeometry scale={scale} material={material} />;
    default:
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          {material}
        </mesh>
      );
  }
}

