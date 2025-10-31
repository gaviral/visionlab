/**
 * VisionValidationSystem - Validates camera placement and calculates visibility
 * Following design principles: Single responsibility, performance-optimized, modular
 *
 * Responsibility: Calculate which objects are visible from each camera
 * Updates store with visibility data for visual feedback
 *
 * Design Decision: System component (like CameraSystem) that runs in useFrame
 * Separates visibility calculation from rendering (single responsibility)
 */
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '../../stores/sceneStore';
import { isObjectVisible } from '../../utils/visionUtils';
import { filterCameras, filterObjectsVisibleToCameras } from '../../utils/objectQueryUtils';

export function VisionValidationSystem() {
  const objects = useSceneStore((state) => state.objects);
  const setVisibility = useSceneStore((state) => state.setVisibility);

  useFrame(() => {
    // Find all cameras
    const cameras = filterCameras(objects);

    // Calculate visibility for each camera
    cameras.forEach((camera) => {
      // Find all objects visible to cameras
      const objectsToCheck = filterObjectsVisibleToCameras(objects, camera.id);

      // Calculate which objects are visible from this camera
      const visibleObjectIds = objectsToCheck
        .filter((obj) => isObjectVisible(obj, camera))
        .map((obj) => obj.id);

      // Update store with visibility data
      setVisibility(camera.id, visibleObjectIds);
    });
  });

  // This component doesn't render anything - it's a system component
  return null;
}

