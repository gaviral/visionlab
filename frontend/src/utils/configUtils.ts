/**
 * ConfigUtils - Configuration utilities for save/load
 * Following design principles: DRY, single responsibility, structured error handling
 */
import type { SceneObject } from '../types';
import { createFileError, fromNativeError, ErrorCode, logger } from './index';

export interface SceneConfig {
  version: string;
  objects: SceneObject[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Export scene to JSON string
 * Following design principles: Pure function, structured format
 * 
 * @param objects - Array of scene objects to export
 * @returns JSON string representation of scene
 */
export const exportScene = (objects: SceneObject[]): string => {
  const tracker = logger.startPerformanceTracking('exportScene');
  
  try {
    const config: SceneConfig = {
      version: '1.0.0',
      objects,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    const json = JSON.stringify(config, null, 2);
    tracker.end({ objectCount: objects.length });
    logger.info('Scene exported successfully', { objectCount: objects.length });
    
    return json;
  } catch (error) {
    tracker.end({ error: true });
    const appError = fromNativeError(
      error as Error,
      ErrorCode.FILE_SAVE_ERROR,
      'Failed to export scene'
    );
    logger.error('Scene export failed', appError);
    throw appError;
  }
};

/**
 * Import scene from JSON string
 * Following design principles: Structured error handling, validation
 * 
 * @param json - JSON string to parse
 * @returns Array of scene objects
 * @throws AppError if parsing fails
 */
export const importScene = (json: string): SceneObject[] => {
  const tracker = logger.startPerformanceTracking('importScene');
  
  try {
    const config: SceneConfig = JSON.parse(json);
    
    // Validate config structure
    if (!config.objects || !Array.isArray(config.objects)) {
      throw createFileError(
        'parse',
        'Invalid scene file format',
        'Missing or invalid objects array'
      );
    }
    
    tracker.end({ objectCount: config.objects.length });
    logger.info('Scene imported successfully', { 
      objectCount: config.objects.length,
      version: config.version 
    });
    
    return config.objects;
  } catch (error) {
    tracker.end({ error: true });
    
    if (error instanceof Error && error.message.includes('objects array')) {
      // Already a structured error
      logger.error('Scene import validation failed', error as never);
      throw error;
    }
    
    const appError = createFileError(
      'parse',
      'Invalid scene configuration file',
      (error as Error).message
    );
    logger.error('Scene import parse failed', appError);
    throw appError;
  }
};

/**
 * Download scene as JSON file
 * Following design principles: User-friendly, structured error handling
 * 
 * @param objects - Array of scene objects to download
 * @throws AppError if download fails
 */
export const downloadScene = (objects: SceneObject[]): void => {
  const tracker = logger.startPerformanceTracking('downloadScene');
  
  try {
    const json = exportScene(objects);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vision-lab-scene-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    tracker.end({ objectCount: objects.length });
    logger.info('Scene download initiated', { objectCount: objects.length });
  } catch (error) {
    tracker.end({ error: true });
    const appError = fromNativeError(
      error as Error,
      ErrorCode.FILE_SAVE_ERROR,
      'Failed to download scene file'
    );
    logger.error('Scene download failed', appError);
    throw appError;
  }
};

/**
 * Load scene from uploaded file
 * Following design principles: Async operation, structured error handling
 * 
 * @param file - File object to load
 * @returns Promise resolving to array of scene objects
 * @throws AppError if file loading or parsing fails
 */
export const loadSceneFromFile = (
  file: File
): Promise<SceneObject[]> => {
  const tracker = logger.startPerformanceTracking('loadSceneFromFile');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const objects = importScene(e.target?.result as string);
        tracker.end({ objectCount: objects.length });
        resolve(objects);
      } catch (error) {
        tracker.end({ error: true });
        reject(error); // Error already structured by importScene
      }
    };
    
    reader.onerror = () => {
      tracker.end({ error: true });
      const appError = createFileError(
        'load',
        'Failed to read scene file',
        reader.error?.message
      );
      logger.error('File reader error', appError);
      reject(appError);
    };
    
    reader.readAsText(file);
  });
};

