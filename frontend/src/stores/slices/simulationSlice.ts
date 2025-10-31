/**
 * Simulation domain slice actions
 * Following design principles: Single responsibility, domain separation, observability
 *
 * Responsibility: Actions for managing simulation state (play/pause/stop, progress, speed)
 * 
 * Note: State property (simulation) comes from SceneState
 */
import type { StoreSetter } from '../sceneStore';
import { logger } from '../../utils/loggingUtils';

export interface SimulationSlice {
  startSimulation: (pathId: string) => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  setSimulationProgress: (progress: number) => void;
  setSimulationSpeed: (speed: number) => void;
}

export function createSimulationSlice(set: StoreSetter): SimulationSlice {
  return {
    startSimulation: (pathId) => {
      logger.info('Simulation started', { pathId });
      return set(() => ({
        simulation: {
          state: 'playing',
          progress: 0,
          currentPathId: pathId,
          speed: 1,
        },
      }));
    },

    pauseSimulation: () => {
      logger.info('Simulation paused');
      return set((state) => ({
        simulation: {
          ...state.simulation,
          state: 'paused',
        },
      }));
    },

    stopSimulation: () => {
      logger.info('Simulation stopped');
      return set(() => ({
        simulation: {
          state: 'idle',
          progress: 0,
          currentPathId: null,
          speed: 1,
        },
      }));
    },

    setSimulationProgress: (progress) =>
      set((state) => ({
        simulation: {
          ...state.simulation,
          progress: Math.max(0, Math.min(1, progress)),
        },
      })),

    setSimulationSpeed: (speed) => {
      const clampedSpeed = Math.max(0.1, Math.min(5, speed));
      logger.info('Simulation speed changed', { speed: clampedSpeed });
      return set((state) => ({
        simulation: {
          ...state.simulation,
          speed: clampedSpeed,
        },
      }));
    },
  };
}

