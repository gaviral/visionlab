/**
 * CameraFrustum - Visualizes camera field of view as wireframe frustum
 * Following design principles: Single responsibility, reusable, composable
 *
 * Responsibility: Render wireframe frustum visualization for a camera object
 * Shows camera's field of view (FOV) as a 3D cone/frustum
 *
 * Design Decision: Separate component for each camera (composition over coupling)
 * Uses Three.js CameraHelper internally for accurate frustum calculation
 * 
 * Color coding:
 * - Eye-to-hand cameras: Cyan (stationary, environment view)
 * - Eye-in-hand cameras: Yellow (moving with robot, EOAT view)
 */
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CameraObject } from '../../types';

interface CameraFrustumProps {
  camera: CameraObject;
}

/**
 * Get frustum color based on camera type
 * Following design principles: Single responsibility, visual clarity
 */
function getFrustumColor(cameraMode: string): THREE.Color {
  return cameraMode === 'eye-in-hand'
    ? new THREE.Color(0xffff00) // Yellow for eye-in-hand (moves with robot)
    : new THREE.Color(0x00ffff); // Cyan for eye-to-hand (stationary)
}

export function CameraFrustum({ camera }: CameraFrustumProps) {
  const helperRef = useRef<THREE.CameraHelper | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Initialize Three.js camera and helper
  useEffect(() => {
    if (!cameraRef.current) {
      cameraRef.current = new THREE.PerspectiveCamera();
    }

    const threeCamera = cameraRef.current;
    const fov = camera.properties.fov || 60;
    const resolution = camera.properties.resolution || { width: 1920, height: 1080 };
    const aspect = resolution.width / resolution.height;
    const cameraMode = camera.cameraType || 'eye-to-hand';

    // Update camera parameters
    threeCamera.fov = fov;
    threeCamera.aspect = aspect;
    threeCamera.near = 0.1; // Near clipping plane
    threeCamera.far = 10; // Far clipping plane (adjustable)
    threeCamera.updateProjectionMatrix();

    // Create helper if it doesn't exist
    if (!helperRef.current) {
      helperRef.current = new THREE.CameraHelper(threeCamera);
      
      // Set frustum color based on camera mode
      const frustumColor = getFrustumColor(cameraMode);
      if (helperRef.current.material) {
        (helperRef.current.material as THREE.LineBasicMaterial).color = frustumColor;
      }
    }

    // Update helper when camera properties change
    helperRef.current.update();

    return () => {
      // Cleanup: dispose of helper
      if (helperRef.current) {
        helperRef.current.dispose();
        helperRef.current = null;
      }
    };
  }, [camera.properties.fov, camera.properties.resolution, camera.cameraType]);

  // Update camera position and rotation every frame
  useFrame(() => {
    if (!cameraRef.current || !helperRef.current) return;

    const threeCamera = cameraRef.current;

    // Update position
    threeCamera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );

    // Update rotation (convert Euler angles)
    threeCamera.rotation.set(
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    );

    // Update helper to reflect camera changes
    helperRef.current.update();
  });

  // Render helper using primitive (react-three-fiber pattern)
  if (!helperRef.current) {
    return null;
  }

  return <primitive object={helperRef.current} />;
}
