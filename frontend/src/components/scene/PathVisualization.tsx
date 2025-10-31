/**
 * PathVisualization - Renders robot paths in 3D scene
 * Following design principles: Single responsibility, visual feedback, professional polish
 * 
 * Responsibility: Visualize paths and waypoints in 3D space
 * Provides visual feedback during path creation and editing
 */
import { Line } from '@react-three/drei';
import { useSceneStore } from '../../stores/sceneStore';
import type { Path, PathWaypoint } from '../../types';

/**
 * Single path visualization component
 * Following design principles: Composition, reusable
 */
function PathLine({ path }: { path: Path }) {
  if (path.waypoints.length < 2) {
    // Need at least 2 waypoints to draw a line
    return null;
  }

  // Convert waypoints to line points (as tuples for Three.js)
  const points: [number, number, number][] = path.waypoints.map((wp) => [
    wp.position.x,
    wp.position.y,
    wp.position.z,
  ]);

  // If looping, connect last point back to first
  if (path.loop) {
    points.push([
      path.waypoints[0].position.x,
      path.waypoints[0].position.y,
      path.waypoints[0].position.z,
    ]);
  }

  return (
    <Line
      points={points}
      color="#3b82f6" // Blue - matches design system primary color
      lineWidth={2}
      dashed={false}
    />
  );
}

/**
 * Single waypoint marker component
 * Following design principles: Single responsibility, visual clarity
 */
function WaypointMarker({
  waypoint,
  isFirst,
  isLast,
}: {
  waypoint: PathWaypoint;
  isFirst: boolean;
  isLast: boolean;
}) {
  // Visual differentiation: first (green), last (red), middle (blue)
  const color = isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6';
  const size = isFirst || isLast ? 0.15 : 0.1;

  return (
    <group position={[waypoint.position.x, waypoint.position.y, waypoint.position.z]}>
      {/* Waypoint sphere marker */}
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Waypoint number label (using a small sphere with offset) */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

/**
 * Main path visualization component
 * Following design principles: Composition, performance-optimized
 */
export function PathVisualization() {
  const paths = useSceneStore((state) => state.paths);

  // Don't render anything if no paths exist
  if (paths.length === 0) {
    return null;
  }

  return (
    <group>
      {paths.map((path) => (
        <group key={path.id}>
          {/* Path line */}
          <PathLine path={path} />

          {/* Waypoint markers */}
          {path.waypoints.map((waypoint, index) => (
            <WaypointMarker
              key={waypoint.id}
              waypoint={waypoint}
              isFirst={index === 0}
              isLast={index === path.waypoints.length - 1}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

