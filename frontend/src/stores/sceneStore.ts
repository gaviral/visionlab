/**
 * Zustand store for application state
 * Two-tiered: Application state here, transient state in useFrame
 * Following design principles: Single responsibility, clear interface, domain separation
 * 
 * Uses slice pattern for modular organization:
 * - SceneObjectsSlice: Object actions (selection, placement)
 * - CameraSlice: Camera rendering mode actions
 * - PathSlice: Robot path actions
 * - SimulationSlice: Simulation control actions
 * - VisionSlice: Vision validation actions
 * - CollisionSlice: Collision detection actions
 */
import { create } from 'zustand';
import type { SceneState } from '../types';
import { createSceneObjectsSlice, type SceneObjectsSlice } from './slices/sceneObjectsSlice';
import { createCameraSlice, type CameraSlice } from './slices/cameraSlice';
import { createPathSlice, type PathSlice } from './slices/pathSlice';
import { createSimulationSlice, type SimulationSlice } from './slices/simulationSlice';
import { createVisionSlice, type VisionSlice } from './slices/visionSlice';
import { createCollisionSlice, type CollisionSlice } from './slices/collisionSlice';

/**
 * Combined store interface
 * Following design principles: Composition over inheritance, modular slices
 * State properties come from SceneState, actions come from slices
 */
export interface SceneStore
  extends SceneState,
    SceneObjectsSlice,
    CameraSlice,
    PathSlice,
    SimulationSlice,
    VisionSlice,
    CollisionSlice {}

/**
 * Zustand setter function type
 * Following design principles: Type safety, reusable type
 */
export type StoreSetter = (
  partial: Partial<SceneStore> | ((state: SceneStore) => Partial<SceneStore>),
  replace?: boolean
) => void;

/**
 * Create the scene store by combining all domain slices
 * Following design principles: Modular composition, single source of truth
 */
export const useSceneStore = create<SceneStore>((set) => ({
  // Initial state (from SceneState)
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
  visibility: {},
  collisions: [],

  // Actions from slices
  ...createSceneObjectsSlice(set),
  ...createCameraSlice(set),
  ...createPathSlice(set),
  ...createSimulationSlice(set),
  ...createVisionSlice(set),
  ...createCollisionSlice(set),
}));

