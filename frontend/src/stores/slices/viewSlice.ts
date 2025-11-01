/**
 * View settings slice
 * Following design principles: Single responsibility, domain separation
 *
 * Responsibility: Actions for managing view/display settings (what is visible in the viewport)
 */
import type { StoreSetter } from '../sceneStore';

export interface ViewSlice {
  toggleFrustums: () => void;
  toggleCollisions: () => void;
  togglePaths: () => void;
  setShowFrustums: (show: boolean) => void;
  setShowCollisions: (show: boolean) => void;
  setShowPaths: (show: boolean) => void;
}

export function createViewSlice(set: StoreSetter): ViewSlice {
  return {
    toggleFrustums: () =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showFrustums: !state.viewSettings.showFrustums,
        },
      })),

    toggleCollisions: () =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showCollisions: !state.viewSettings.showCollisions,
        },
      })),

    togglePaths: () =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showPaths: !state.viewSettings.showPaths,
        },
      })),

    setShowFrustums: (show) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showFrustums: show,
        },
      })),

    setShowCollisions: (show) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showCollisions: show,
        },
      })),

    setShowPaths: (show) =>
      set((state) => ({
        viewSettings: {
          ...state.viewSettings,
          showPaths: show,
        },
      })),
  };
}

