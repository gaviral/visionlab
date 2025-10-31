/**
 * Path domain slice actions
 * Following design principles: Single responsibility, domain separation, observability
 *
 * Responsibility: Actions for managing robot paths (waypoints, looping, speed)
 * 
 * Note: State property (paths) comes from SceneState
 */
import type { Path, PathWaypoint, Vector3 } from '../../types';
import type { StoreSetter } from '../sceneStore';
import { createId, createVector3 } from '../../utils/transformUtils';
import { logger } from '../../utils/loggingUtils';

export interface PathSlice {
  // Path CRUD
  addPath: (path: Path) => void;
  removePath: (id: string) => void;
  updatePath: (id: string, updates: Partial<Path>) => void;
  createPath: (options?: { loop?: boolean; speed?: number }) => string; // Returns path ID
  
  // Waypoint management
  addWaypoint: (pathId: string, position: Vector3, rotation?: Vector3) => void;
  removeWaypoint: (pathId: string, waypointId: string) => void;
  updateWaypoint: (pathId: string, waypointId: string, updates: Partial<PathWaypoint>) => void;
}

export function createPathSlice(set: StoreSetter): PathSlice {
  return {
    addPath: (path) => {
      logger.info('Path added', { pathId: path.id, waypointCount: path.waypoints.length });
      return set((state) => ({
        paths: [...state.paths, path],
      }));
    },

    removePath: (id) => {
      logger.info('Path removed', { pathId: id });
      return set((state) => ({
        paths: state.paths.filter((path) => path.id !== id),
      }));
    },

    updatePath: (id, updates) => {
      logger.debug('Path updated', { pathId: id, updates });
      return set((state) => ({
        paths: state.paths.map((path) =>
          path.id === id ? { ...path, ...updates } : path
        ),
      }));
    },

    createPath: (options = {}) => {
      const pathId = createId();
      const newPath: Path = {
        id: pathId,
        waypoints: [],
        loop: options.loop ?? false,
        speed: options.speed ?? 1.0,
      };
      
      logger.info('Path created', { pathId, options });
      
      set((state) => ({
        paths: [...state.paths, newPath],
      }));
      
      return pathId;
    },

    addWaypoint: (pathId, position, rotation) => {
      const waypoint: PathWaypoint = {
        id: createId(),
        position,
        rotation: rotation || createVector3(0, 0, 0),
      };
      
      logger.debug('Waypoint added', { pathId, waypointId: waypoint.id });
      
      return set((state) => ({
        paths: state.paths.map((path) =>
          path.id === pathId
            ? { ...path, waypoints: [...path.waypoints, waypoint] }
            : path
        ),
      }));
    },

    removeWaypoint: (pathId, waypointId) => {
      logger.debug('Waypoint removed', { pathId, waypointId });
      
      return set((state) => ({
        paths: state.paths.map((path) =>
          path.id === pathId
            ? {
                ...path,
                waypoints: path.waypoints.filter((wp) => wp.id !== waypointId),
              }
            : path
        ),
      }));
    },

    updateWaypoint: (pathId, waypointId, updates) => {
      logger.debug('Waypoint updated', { pathId, waypointId, updates });
      
      return set((state) => ({
        paths: state.paths.map((path) =>
          path.id === pathId
            ? {
                ...path,
                waypoints: path.waypoints.map((wp) =>
                  wp.id === waypointId ? { ...wp, ...updates } : wp
                ),
              }
            : path
        ),
      }));
    },
  };
}

