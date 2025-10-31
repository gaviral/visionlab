/**
 * CollisionDetector - Detects collisions between scene objects
 * Following design principles: Single responsibility, performance-optimized, modular
 *
 * Responsibility: Detect collisions between objects (especially robot and obstacles)
 * Updates store with collision data for visual feedback
 *
 * Design Decision: System component (like CameraSystem, VisionValidationSystem)
 * Runs collision checks every frame during simulation
 */
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { findCollidingObjects } from '../../utils/collisionUtils';
import type { RobotObject } from '../../types';

export function CollisionDetector() {
  const objects = useSceneStore((state) => state.objects);
  const setCollisions = useSceneStore((state) => state.setCollisions);

  useFrame(() => {
    // Check collisions for all objects
    // Focus on robot-obstacle collisions (most critical)
    const collidingObjectIds = new Set<string>();

    objects.forEach((object) => {
      // Check robot collisions with obstacles
      if (object.type === 'robot') {
        const robot = object as RobotObject;
        const collidingObjects = findCollidingObjects(robot, objects);
        
        // Mark robot and all colliding objects
        collidingObjects.forEach((colliding) => {
          collidingObjectIds.add(robot.id);
          collidingObjectIds.add(colliding.id);
        });
      }
    });

    // Update store with collision data
    setCollisions(Array.from(collidingObjectIds));
  });

  // This component doesn't render anything - it's a system component
  return null;
}

