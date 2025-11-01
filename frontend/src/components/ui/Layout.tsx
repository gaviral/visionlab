/**
 * Layout component - Professional layout system
 * Following design principles: Single responsibility, composition, enterprise-grade visual hierarchy
 * 
 * Inspired by: Unity Editor layout (left: hierarchy/objects, center: viewport, right: inspector)
 */
import { ReactNode, useRef, useState } from 'react';
import { ObjectLibrary } from './ObjectLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { PathPanel } from './PathPanel';
import { SceneHierarchy } from './SceneHierarchy';
import { SimulationPanel } from './SimulationPanel';
import { TabbedPanel } from './TabbedPanel';
import { ViewPanel } from './ViewPanel';
import { Button } from './Button';
import { useSceneStore } from '../../stores/sceneStore';
import { downloadScene, loadSceneFromFile } from '../../utils/configUtils';

interface LayoutProps {
  children: ReactNode;
  onViewArchitecture?: () => void;
}

export function Layout({ children, onViewArchitecture }: LayoutProps) {
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
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header with toolbar */}
      <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img 
            src="/favicon.svg" 
            alt="Vision Lab" 
            className="w-7 h-7 rounded"
          />
          <h1 className="text-base font-semibold text-white">
            Vision Lab
          </h1>
        </div>

        {/* Right: Toolbar actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            disabled={objects.length === 0}
            aria-label="Save current scene to JSON file"
          >
            💾 Save
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleLoad} 
            isLoading={isLoading}
            aria-label="Load scene from JSON file"
          >
            📂 Load
          </Button>
          {onViewArchitecture && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewArchitecture}
              aria-label="View architecture documentation"
            >
              📚 Docs
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Hierarchy + Object Library */}
        <aside className="w-72 bg-gray-800 border-r border-gray-700 shadow-xl flex-shrink-0">
          <TabbedPanel
            tabs={[
              {
                id: 'hierarchy',
                label: 'Hierarchy',
                icon: '🌳',
                content: <SceneHierarchy />,
              },
              {
                id: 'library',
                label: 'Library',
                icon: '📦',
                content: <ObjectLibrary />,
              },
            ]}
            defaultTab="hierarchy"
          />
        </aside>

        {/* 3D Viewport */}
        <main className="flex-1 relative overflow-hidden">{children}</main>

        {/* Right Sidebar - Inspector (Properties/Paths/Simulation/View) */}
        <aside className="w-72 bg-gray-800 border-l border-gray-700 shadow-xl flex-shrink-0">
          <TabbedPanel
            tabs={[
              {
                id: 'properties',
                label: 'Inspector',
                icon: '⚙️',
                content: <PropertiesPanel />,
              },
              {
                id: 'paths',
                label: 'Paths',
                icon: '🛤️',
                content: <PathPanel />,
              },
              {
                id: 'simulation',
                label: 'Simulation',
                icon: '▶️',
                content: <SimulationPanel />,
              },
              {
                id: 'view',
                label: 'View',
                icon: '👁️',
                content: <ViewPanel />,
              },
            ]}
            defaultTab="properties"
          />
        </aside>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Scene JSON file input"
      />
    </div>
  );
}
