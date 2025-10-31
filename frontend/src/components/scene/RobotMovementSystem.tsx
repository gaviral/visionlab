/**
 * RobotMovementSystem - Handles robot movement animation along paths
 * Following design principles: Single responsibility, performance-optimized, modular
 * 
 * Responsibility: Animate all robot objects along their assigned paths during simulation
 * Uses useFrame for smooth 60fps updates without React re-renders
 * 
 * Design Decision: Single system component handles all robots (more efficient than per-robot systems)
 */
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { interpolatePath } from '../../utils/pathUtils';
import { calculateProgressDelta, calculateNextProgress } from '../../utils/pathProgressUtils';
import { filterRobots } from '../../utils/objectQueryUtils';

export function RobotMovementSystem() {
  const simulation = useSceneStore((state) => state.simulation);
  const objects = useSceneStore((state) => state.objects);
  const paths = useSceneStore((state) => state.paths);
  const updateObject = useSceneStore((state) => state.updateObject);
  const setSimulationProgress = useSceneStore(
    (state) => state.setSimulationProgress
  );
  const stopSimulation = useSceneStore((state) => state.stopSimulation);

  useFrame((_, delta) => {
    // Only animate if simulation is playing
    if (simulation.state !== 'playing' || !simulation.currentPathId) {
      return;
    }

    // Find path and robot for current simulation
    const path = paths.find((p) => p.id === simulation.currentPathId);
    if (!path || path.waypoints.length === 0) {
      return;
    }

    // Find robot assigned to this path
    const robots = filterRobots(objects);
    const robot = robots.find(
      (r) => r.properties.pathId === path.id
    );

    if (!robot) {
      return;
    }

    // Calculate progress delta
    const progressDelta = calculateProgressDelta(
      path,
      delta,
      simulation.speed
    );

    // Calculate next progress with completion handling
    const newProgress = calculateNextProgress(
      simulation.progress,
      progressDelta,
      path,
      () => stopSimulation()
    );

    // Update simulation progress
    setSimulationProgress(newProgress);

    // Interpolate robot position and rotation
    try {
      const { position, rotation } = interpolatePath(path, newProgress);
      updateObject(robot.id, {
        position,
        rotation,
      });
    } catch (error) {
      // Silent fail - path interpolation errors are handled gracefully
    }
  });

  // This component doesn't render anything - it's a system component
  return null;
}

