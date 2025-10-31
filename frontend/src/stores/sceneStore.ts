/**
 * Zustand store for application state
 * Two-tiered: Application state here, transient state in useFrame
 * Following design principles: Single responsibility, clear interface
 */
import { create } from 'zustand';
import type { SceneState, SceneObject, ObjectType } from '../types';

interface SceneStore extends SceneState {
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setPlacingMode: (type: ObjectType | null) => void;
  setCameraMode: (mode: 'perspective' | 'orthographic') => void;
  setObjects: (objects: SceneObject[]) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  // Initial state
  objects: [],
  selectedObjectId: null,
  cameraMode: 'perspective',
  isPlacing: false,
  placingType: null,

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
}));

