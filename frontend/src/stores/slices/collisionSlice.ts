/**
 * Collision domain slice actions
 * Following design principles: Single responsibility, domain separation
 *
 * Responsibility: Actions for managing collision detection data (which objects are colliding)
 * 
 * Note: State property (collisions) comes from SceneState
 */
import type { StoreSetter } from '../sceneStore';

export interface CollisionSlice {
  setCollisions: (collidingObjectIds: string[]) => void;
}

export function createCollisionSlice(set: StoreSetter): CollisionSlice {
  return {
    setCollisions: (collidingObjectIds) =>
      set(() => ({
        collisions: collidingObjectIds,
      })),
  };
}

