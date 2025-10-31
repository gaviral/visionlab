/**
 * Toolbar - Professional actions toolbar
 * Following design principles: Single responsibility, user-focused, enterprise-grade
 */
import { useRef, useState } from 'react';
import { useSceneStore } from '../../stores/sceneStore';
import { downloadScene, loadSceneFromFile } from '../../utils/configUtils';
import { Button } from './Button';

export function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objects = useSceneStore((state) => state.objects);
  const setObjects = useSceneStore((state) => state.setObjects);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    downloadScene(objects);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const loadedObjects = await loadSceneFromFile(file);
      setObjects(loadedObjects);
    } catch (error) {
      // Error is already structured by configUtils
      const errorMessage = (error as { message?: string }).message || 'Failed to load scene';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="absolute top-4 left-[calc(18rem+1rem)] z-10 flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={objects.length === 0}
          aria-label="Save current scene to JSON file"
        >
          Save Scene
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleLoad} 
          isLoading={isLoading}
          aria-label="Load scene from JSON file"
        >
          Load Scene
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Scene JSON file input"
      />
    </>
  );
}
