/**
 * Camera domain slice actions
 * Following design principles: Single responsibility, domain separation
 *
 * Responsibility: Actions for managing camera rendering mode (perspective/orthographic)
 * 
 * Note: State property (cameraMode) comes from SceneState
 */
import type { StoreSetter } from '../sceneStore';

export interface CameraSlice {
  setCameraMode: (mode: 'perspective' | 'orthographic') => void;
}

export function createCameraSlice(set: StoreSetter): CameraSlice {
  return {
    setCameraMode: (mode) => set(() => ({ cameraMode: mode })),
  };
}

