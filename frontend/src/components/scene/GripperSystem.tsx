/**
 * GripperSystem - Handles gripper positioning relative to parent robots
 * Following design principles: Single responsibility, performance-optimized, modular
 * 
 * Responsibility: Update gripper positions when attached to robots
 * - Attached grippers: Follow robot's end effector position automatically
 * - Independent grippers: Maintain their own position (user-controlled)
 * 
 * Uses useFrame for smooth 60fps updates without React re-renders
 */
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { filterGrippers, filterRobots } from '../../utils/objectQueryUtils';
import { calculateEndEffectorPosition } from '../../utils/endEffectorUtils';

export function GripperSystem() {
  const objects = useSceneStore((state) => state.objects);
  const updateObject = useSceneStore((state) => state.updateObject);

  useFrame(() => {
    const grippers = filterGrippers(objects);
    const robots = filterRobots(objects);

    grippers.forEach((gripper) => {
      const parentRobotId = gripper.properties.parentRobotId;
      
      // All grippers should be attached to a robot
      if (!parentRobotId) {
        return; // Orphaned gripper - skip (shouldn't happen in normal flow)
      }

      const robot = robots.find((r) => r.id === parentRobotId);
      if (!robot) {
        return; // Parent robot not found
      }

      // Calculate end effector position (where gripper should be)
      const endEffectorPosition = calculateEndEffectorPosition(robot);

      // Update gripper to follow robot's end effector
      // Gripper rotation follows robot rotation
      updateObject(gripper.id, {
        position: endEffectorPosition,
        rotation: robot.rotation,
      });
    });
  });

  // This component doesn't render anything - it's a system component
  return null;
}

