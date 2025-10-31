/**
 * Vision domain slice actions
 * Following design principles: Single responsibility, domain separation
 *
 * Responsibility: Actions for managing vision validation data (which objects are visible from each camera)
 * 
 * Note: State property (visibility) comes from SceneState
 */
import type { StoreSetter } from '../sceneStore';

export interface VisionSlice {
  setVisibility: (cameraId: string, visibleObjectIds: string[]) => void;
}

export function createVisionSlice(set: StoreSetter): VisionSlice {
  return {
    setVisibility: (cameraId, visibleObjectIds) =>
      set((state) => ({
        visibility: {
          ...state.visibility,
          [cameraId]: visibleObjectIds,
        },
      })),
  };
}

