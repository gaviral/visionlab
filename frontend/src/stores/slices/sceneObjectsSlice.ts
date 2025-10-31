/**
 * Scene objects domain slice actions
 * Following design principles: Single responsibility, domain separation
 *
 * Responsibility: Actions for managing scene objects (cameras, robots, bins, obstacles, grippers)
 * Includes selection and placement mode actions
 * 
 * Note: State properties (objects, selectedObjectId, etc.) come from SceneState
 */
import type { SceneObject, ObjectType } from '../../types';
import type { StoreSetter } from '../sceneStore';

export interface SceneObjectsSlice {
  // Actions only - state comes from SceneState
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setPlacingMode: (type: ObjectType | null) => void;
  setObjects: (objects: SceneObject[]) => void;
}

export function createSceneObjectsSlice(set: StoreSetter): SceneObjectsSlice {
  return {
    addObject: (object) => {
      return set((state) => {
        const newObjects = [...state.objects, object];
        return {
          objects: newObjects,
          selectedObjectId: object.id,
          isPlacing: false,
          placingType: null,
        };
      });
    },

    removeObject: (id) => {
      return set((state) => {
        const newObjects = state.objects.filter((obj) => obj.id !== id);
        return {
          objects: newObjects,
          selectedObjectId:
            state.selectedObjectId === id ? null : state.selectedObjectId,
        };
      });
    },

    selectObject: (id) => {
      return set(() => ({
        selectedObjectId: id,
        isPlacing: false,
        placingType: null,
      }));
    },

    updateObject: (id, updates) => {
      return set((state) => {
        const newObjects = state.objects.map((obj) =>
          obj.id === id ? { ...obj, ...updates } : obj
        );
        return {
          objects: newObjects,
        };
      });
    },

    setPlacingMode: (type) => {
      return set(() => ({
        placingType: type,
        isPlacing: type !== null,
        selectedObjectId: null,
      }));
    },

    setObjects: (objects) =>
      set(() => ({
        objects,
        selectedObjectId: null,
        isPlacing: false,
        placingType: null,
      })),
  };
}

