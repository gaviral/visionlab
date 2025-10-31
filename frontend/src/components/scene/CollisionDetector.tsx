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
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { findCollidingObjects } from '../../utils/collisionUtils';
import { filterRobots } from '../../utils/objectQueryUtils';
import { logger } from '../../utils/loggingUtils';

export function CollisionDetector() {
  const objects = useSceneStore((state) => state.objects);
  const setCollisions = useSceneStore((state) => state.setCollisions);
  
  // Track previous collision state to only log changes
  const prevCollisionsRef = useRef<Set<string>>(new Set());

  useFrame(() => {
    // Check collisions for all objects
    // Focus on robot-obstacle collisions (most critical)
    const collidingObjectIds = new Set<string>();
    const robots = filterRobots(objects);

    robots.forEach((robot) => {
      const collidingObjects = findCollidingObjects(robot, objects);
      
      // Mark robot and all colliding objects
      collidingObjects.forEach((colliding) => {
        collidingObjectIds.add(robot.id);
        collidingObjectIds.add(colliding.id);
      });
    });

    // Log collision state changes (not every frame - only when state changes)
    const collisionArray = Array.from(collidingObjectIds);
    const hasCollisions = collisionArray.length > 0;
    const hadCollisions = prevCollisionsRef.current.size > 0;
    
    if (hasCollisions && !hadCollisions) {
      // New collision detected
      logger.warn('Collision detected', {
        collidingObjects: collisionArray,
        robotCount: robots.length,
      });
    } else if (!hasCollisions && hadCollisions) {
      // Collisions cleared
      logger.info('Collisions cleared');
    }
    
    prevCollisionsRef.current = collidingObjectIds;

    // Update store with collision data
    setCollisions(collisionArray);
  });

  // This component doesn't render anything - it's a system component
  return null;
}

