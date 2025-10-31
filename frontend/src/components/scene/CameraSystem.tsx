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
import { filterCameras, filterRobots } from '../../utils/objectQueryUtils';
import { calculateEndEffectorPosition } from '../../utils/endEffectorUtils';

export function CameraSystem() {
  const objects = useSceneStore((state) => state.objects);
  const updateObject = useSceneStore((state) => state.updateObject);

  useFrame(() => {
    // Find all cameras and robots
    const cameras = filterCameras(objects);
    const robots = filterRobots(objects);

    cameras.forEach((camera) => {
      if (camera.cameraType === 'eye-in-hand') {
        // Eye-in-hand: Camera follows robot end effector
        const parentRobotId = camera.properties.parentRobotId;
        if (!parentRobotId) return;

        const robot = robots.find((r) => r.id === parentRobotId);
        if (!robot) return;

        // Calculate end effector position
        const endEffectorPosition = calculateEndEffectorPosition(robot);

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

