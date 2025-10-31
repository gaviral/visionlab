/**
 * Zustand store for application state
 * Two-tiered: Application state here, transient state in useFrame
 * Following design principles: Single responsibility, clear interface
 */
import { create } from 'zustand';
import type { SceneState, SceneObject, ObjectType, Path, SimulationState } from '../types';
import { createId } from '../utils/transformUtils';

interface SceneStore extends SceneState {
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setPlacingMode: (type: ObjectType | null) => void;
  setCameraMode: (mode: 'perspective' | 'orthographic') => void;
  setObjects: (objects: SceneObject[]) => void;
  // Path actions
  addPath: (path: Path) => void;
  removePath: (id: string) => void;
  updatePath: (id: string, updates: Partial<Path>) => void;
  // Simulation actions
  startSimulation: (pathId: string) => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  setSimulationProgress: (progress: number) => void;
  setSimulationSpeed: (speed: number) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  // Initial state
  objects: [],
  selectedObjectId: null,
  cameraMode: 'perspective',
  isPlacing: false,
  placingType: null,
  paths: [],
  simulation: {
    state: 'idle',
    progress: 0,
    currentPathId: null,
    speed: 1,
  },

  // Actions
  addObject: (object) =>
    set((state) => ({
      objects: [...state.objects, object],
      selectedObjectId: object.id,
      isPlacing: false,
      placingType: null,
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId:
        state.selectedObjectId === id ? null : state.selectedObjectId,
    })),

  selectObject: (id) =>
    set(() => ({
      selectedObjectId: id,
      isPlacing: false,
      placingType: null,
    })),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  setPlacingMode: (type) =>
    set(() => ({
      placingType: type,
      isPlacing: type !== null,
      selectedObjectId: null,
    })),

  setCameraMode: (mode) => set(() => ({ cameraMode: mode })),

  setObjects: (objects) =>
    set(() => ({
      objects,
      selectedObjectId: null,
      isPlacing: false,
      placingType: null,
    })),

  // Path actions
  addPath: (path) =>
    set((state) => ({
      paths: [...state.paths, path],
    })),

  removePath: (id) =>
    set((state) => ({
      paths: state.paths.filter((path) => path.id !== id),
    })),

  updatePath: (id, updates) =>
    set((state) => ({
      paths: state.paths.map((path) =>
        path.id === id ? { ...path, ...updates } : path
      ),
    })),

  // Simulation actions
  startSimulation: (pathId) =>
    set(() => ({
      simulation: {
        state: 'playing',
        progress: 0,
        currentPathId: pathId,
        speed: 1,
      },
    })),

  pauseSimulation: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        state: 'paused',
      },
    })),

  stopSimulation: () =>
    set(() => ({
      simulation: {
        state: 'idle',
        progress: 0,
        currentPathId: null,
        speed: 1,
      },
    })),

  setSimulationProgress: (progress) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        progress: Math.max(0, Math.min(1, progress)),
      },
    })),

  setSimulationSpeed: (speed) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        speed: Math.max(0.1, Math.min(5, speed)),
      },
    })),
}));

