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
import type { RobotObject } from '../../types';

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
    const robot = objects.find(
      (obj): obj is RobotObject =>
        obj.type === 'robot' && obj.properties.pathId === path.id
    );

    if (!robot) {
      return;
    }

    // Calculate new progress based on delta time and speed
    const pathSpeed = path.speed; // Units per second
    const simulationSpeed = simulation.speed; // Speed multiplier
    const pathLength = path.waypoints.length > 1 ? path.waypoints.length - 1 : 1;
    const progressDelta = (delta * pathSpeed * simulationSpeed) / pathLength;

    let newProgress = simulation.progress + progressDelta;

    // Handle path completion
    if (newProgress >= 1) {
      if (path.loop) {
        newProgress = newProgress % 1;
      } else {
        newProgress = 1;
        // Stop simulation when non-looping path completes
        stopSimulation();
      }
    }

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
      console.error('Error interpolating path:', error);
    }
  });

  // This component doesn't render anything - it's a system component
  return null;
}

