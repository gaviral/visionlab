/**
 * ConfigUtils - Configuration utilities for save/load
 * Following design principles: DRY, single responsibility, reusable utilities
 */
import type { SceneObject } from '../types';

export interface SceneConfig {
  version: string;
  objects: SceneObject[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export const exportScene = (objects: SceneObject[]): string => {
  const config: SceneConfig = {
    version: '1.0.0',
    objects,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  return JSON.stringify(config, null, 2);
};

export const importScene = (json: string): SceneObject[] => {
  try {
    const config: SceneConfig = JSON.parse(json);
    return config.objects || [];
  } catch (error) {
    throw new Error('Invalid scene configuration file');
  }
};

export const downloadScene = (objects: SceneObject[]): void => {
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
};

export const loadSceneFromFile = (
  file: File
): Promise<SceneObject[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const objects = importScene(e.target?.result as string);
        resolve(objects);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

