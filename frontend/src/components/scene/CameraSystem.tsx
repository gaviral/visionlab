/**
 * CameraSystem - Handles EOAT camera positioning (eye-in-hand and eye-to-hand)
 * Following design principles: Single responsibility, performance-optimized, modular
 * 
 * Responsibility: Update camera positions based on EOAT mode
 * - Eye-in-hand: Camera follows robot end effector (via gripper)
 * - Eye-to-hand: Camera maintains fixed position
 * 
 * Uses useFrame for smooth 60fps updates without React re-renders
 */
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import type { CameraObject, RobotObject, GripperObject } from '../../types';

export function CameraSystem() {
  const objects = useSceneStore((state) => state.objects);
  const updateObject = useSceneStore((state) => state.updateObject);

  useFrame(() => {
    // Find all cameras
    const cameras = objects.filter(
      (obj): obj is CameraObject => obj.type === 'camera'
    );

    cameras.forEach((camera) => {
      if (camera.cameraType === 'eye-in-hand') {
        // Eye-in-hand: Camera follows robot end effector
        const parentRobotId = camera.properties.parentRobotId;
        if (!parentRobotId) return;

        const robot = objects.find(
          (obj): obj is RobotObject =>
            obj.type === 'robot' && obj.id === parentRobotId
        );

        if (!robot) return;

        // Get gripper position if attached
        let endEffectorPosition = robot.position;
        const gripperId = robot.properties.gripperId;
        
        if (gripperId) {
          const gripper = objects.find(
            (obj): obj is GripperObject =>
              obj.type === 'gripper' && obj.id === gripperId
          );
          if (gripper) {
            // End effector is at gripper position
            endEffectorPosition = gripper.position;
          } else {
            // Use robot's end effector offset if no gripper
            const offset = robot.properties.endEffectorOffset || { x: 0, y: 0, z: 0 };
            endEffectorPosition = {
              x: robot.position.x + offset.x,
              y: robot.position.y + offset.y,
              z: robot.position.z + offset.z,
            };
          }
        } else {
          // Use robot's end effector offset
          const offset = robot.properties.endEffectorOffset || { x: 0, y: 0.75, z: 0 };
          endEffectorPosition = {
            x: robot.position.x + offset.x,
            y: robot.position.y + offset.y,
            z: robot.position.z + offset.z,
          };
        }

        // Update camera position to follow end effector
        // Camera rotation follows robot rotation
        updateObject(camera.id, {
          position: endEffectorPosition,
          rotation: robot.rotation,
        });
      }
      // Eye-to-hand cameras maintain their fixed position (no update needed)
    });
  });

  // This component doesn't render anything - it's a system component
  return null;
}

